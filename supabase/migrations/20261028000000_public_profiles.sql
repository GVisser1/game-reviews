-- Public profiles at /app/users/<username>: every player gets a unique, URL-safe username, and two functions return a
-- profile and its reviews without exposing user ids.

-- Usernames -----------------------------------------------------------------------------------------------------------

-- Usernames belong to this app, not to a login provider. A player's first sign-in picks one from whatever the provider
-- calls their login (Twitch's `slug` today), and it never changes after that, so profile links keep working when
-- someone renames their account or links another login method.
alter table public.profiles add column username text;

-- Lowercase letters, digits, "_" and "-", at most 30 characters; "player" if nothing usable is left.
create function public.to_username_base(source text)
returns text
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    nullif(trim(both '-' from left(regexp_replace(lower(coalesce(source, '')), '[^a-z0-9_]+', '-', 'g'), 30)), ''),
    'player'
  );
$$;

-- The base itself if nobody has it yet, otherwise base-2, base-3 and so on.
create function public.next_free_username(base text)
returns text
language plpgsql
set search_path = ''
as $$
declare
  candidate text := base;
  suffix integer := 1;
begin
  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := base || '-' || suffix;
  end loop;
  return candidate;
end;
$$;

revoke execute on function public.to_username_base(text) from public, anon, authenticated;
revoke execute on function public.next_free_username(text) from public, anon, authenticated;

-- Same as before, plus a username for new profiles (and for existing ones that don't have one yet).
create or replace function public.sync_profile(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb;
  username_source text;
  username_base text;
begin
  select coalesce(u.raw_user_meta_data, '{}'::jsonb) || coalesce(twitch.identity_data, '{}'::jsonb)
    into metadata
    from auth.users u
    left join lateral (
      select i.identity_data
        from auth.identities i
       where i.user_id = u.id and i.provider = 'twitch'
       order by i.created_at
       limit 1
    ) twitch on true
   where u.id = target_user_id
     and u.is_anonymous is false;

  if metadata is null then
    return;
  end if;

  -- Login names first (Twitch's `slug`, then the common OAuth fields), display names as a fallback.
  username_source := coalesce(
    nullif(metadata ->> 'slug', ''),
    nullif(metadata ->> 'preferred_username', ''),
    nullif(metadata ->> 'user_name', ''),
    nullif(metadata ->> 'nickname', ''),
    nullif(metadata ->> 'name', ''),
    nullif(metadata ->> 'full_name', '')
  );

  -- A sign-in can create the user before its login data arrives (that triggers another sync). Waiting for it keeps
  -- new players from getting a placeholder username that would then stick.
  if username_source is null and not exists (select 1 from public.profiles where id = target_user_id) then
    return;
  end if;

  username_base := public.to_username_base(username_source);

  loop
    begin
      insert into public.profiles (id, display_name, avatar_url, username, updated_at)
      values (
        target_user_id,
        coalesce(
          nullif(metadata ->> 'nickname', ''),
          nullif(metadata ->> 'full_name', ''),
          nullif(metadata ->> 'name', ''),
          nullif(metadata ->> 'preferred_username', ''),
          nullif(metadata ->> 'user_name', ''),
          'Twitch user'
        ),
        coalesce(nullif(metadata ->> 'avatar_url', ''), nullif(metadata ->> 'picture', '')),
        public.next_free_username(username_base),
        now()
      )
      on conflict (id) do update
        set display_name = excluded.display_name,
            avatar_url = excluded.avatar_url,
            username = coalesce(public.profiles.username, excluded.username),
            updated_at = now();
      exit;
    exception when unique_violation then
      -- Someone else took the same username at the same moment; the next round picks the next free one.
    end;
  end loop;
end;
$$;

-- Usernames for everyone who already has a profile.
select public.sync_profile(id) from public.profiles where username is null;

alter table public.profiles
  alter column username set not null,
  add constraint profiles_username_key unique (username),
  add constraint profiles_username_format check (username ~ '^[a-z0-9_][a-z0-9_-]{0,39}$');

-- Public reviews ------------------------------------------------------------------------------------------------------

-- Same as before, plus each reviewer's username so their name can link to their profile.
drop function public.get_game_reviews(bigint);

create function public.get_game_reviews(target_game_id bigint)
returns table (
  username text,
  display_name text,
  avatar_url text,
  rating smallint,
  body text,
  created_at timestamptz,
  is_own boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.username, p.display_name, p.avatar_url, r.rating, r.body, r.created_at, r.user_id = (select auth.uid())
    from public.reviews r
    join public.profiles p on p.id = r.user_id
   where r.game_id = target_game_id
     and r.body is not null
   order by r.created_at desc
   limit 50;
$$;

-- One player's public profile; no rows if the username doesn't exist.
create function public.get_profile(target_username text)
returns table (
  username text,
  display_name text,
  avatar_url text,
  is_own boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.username, p.display_name, p.avatar_url, p.id = (select auth.uid())
    from public.profiles p
   where p.username = lower(target_username);
$$;

-- Everything one player rated, newest first, with or without review text.
create function public.get_profile_reviews(target_username text)
returns table (
  game_id bigint,
  game_name text,
  cover_url text,
  rating smallint,
  body text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.game_id, r.game_name, r.cover_url, r.rating, r.body, r.created_at
    from public.reviews r
    join public.profiles p on p.id = r.user_id
   where p.username = lower(target_username)
   order by r.created_at desc;
$$;

-- The signed-in player's own username, for the link to their profile; null for anonymous visitors.
create function public.get_own_username()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.username from public.profiles p where p.id = (select auth.uid());
$$;

grant execute on function public.get_game_reviews(bigint) to anon, authenticated;
grant execute on function public.get_profile(text) to anon, authenticated;
grant execute on function public.get_profile_reviews(text) to anon, authenticated;
grant execute on function public.get_own_username() to anon, authenticated;

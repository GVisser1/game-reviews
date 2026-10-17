-- Written reviews: optional review text, public profiles (name and avatar from Twitch) and a function that returns a
-- game's reviews without exposing user ids.

-- Profiles ------------------------------------------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone may read profiles. Nobody writes them directly: only sync_profile below does, from the user's Twitch data,
-- so users can't impersonate someone else.
create policy "Profiles are public"
  on public.profiles for select to anon, authenticated
  using (true);

grant select on table public.profiles to anon, authenticated;

-- Copies a signed-in user's Twitch name and avatar into their profile. Anonymous users get no profile.
-- Twitch's profile can sit on the identity (linked accounts) or in the user's metadata; the identity wins.
create function public.sync_profile(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb;
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

  insert into public.profiles (id, display_name, avatar_url, updated_at)
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
    now()
  )
  on conflict (id) do update
    set display_name = excluded.display_name,
        avatar_url = excluded.avatar_url,
        updated_at = now();
end;
$$;

revoke execute on function public.sync_profile(uuid) from public, anon, authenticated;

create function public.sync_profile_from_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.sync_profile(new.id);
  return new;
end;
$$;

create function public.sync_profile_from_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.sync_profile(new.user_id);
  return new;
end;
$$;

revoke execute on function public.sync_profile_from_user() from public, anon, authenticated;
revoke execute on function public.sync_profile_from_identity() from public, anon, authenticated;

-- Runs when someone signs up or signs in with Twitch, and when Twitch sends a new name or avatar.
create trigger sync_profile_on_user_change
  after insert or update of raw_user_meta_data, is_anonymous on auth.users
  for each row execute function public.sync_profile_from_user();

create trigger sync_profile_on_identity_change
  after insert or update of identity_data on auth.identities
  for each row execute function public.sync_profile_from_identity();

-- Profiles for users who signed in before this migration.
select public.sync_profile(id) from auth.users where is_anonymous is false;

-- Review text ---------------------------------------------------------------------------------------------------------

alter table public.reviews
  add column body text check (char_length(body) <= 2000);

-- Public reviews ------------------------------------------------------------------------------------------------------

-- The reviews table stays private to each user; this returns only what's shown publicly for one game.
-- Reviews without text, and old reviews from anonymous users (who have no profile), are left out.
create function public.get_game_reviews(target_game_id bigint)
returns table (
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
  select p.display_name, p.avatar_url, r.rating, r.body, r.created_at, r.user_id = (select auth.uid())
    from public.reviews r
    join public.profiles p on p.id = r.user_id
   where r.game_id = target_game_id
     and r.body is not null
   order by r.created_at desc
   limit 50;
$$;

grant execute on function public.get_game_reviews(bigint) to anon, authenticated;

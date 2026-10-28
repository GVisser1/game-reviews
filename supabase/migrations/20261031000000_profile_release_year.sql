-- The Top rated page became the games list's "Highest rated" sort (get_rated_games), so its function goes.
drop function public.get_top_rated_games(integer, integer);

-- Same as before, plus each game's release year, so profiles show the same details as the games list.
drop function public.get_profile_reviews(text);

create function public.get_profile_reviews(target_username text)
returns table (
  game_id bigint,
  game_name text,
  cover_url text,
  release_year smallint,
  rating smallint,
  body text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.game_id, r.game_name, r.cover_url, r.release_year, r.rating, r.body, r.created_at
    from public.reviews r
    join public.profiles p on p.id = r.user_id
   where p.username = lower(target_username)
   order by r.created_at desc;
$$;

grant execute on function public.get_profile_reviews(text) to anon, authenticated;

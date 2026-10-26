-- Community ratings for the games list and the Top rated page. Like get_game_rating_summary, these only count reviews
-- from users with a profile (signed in with Twitch) and never reveal who rated what.

-- Summaries and top-rated lists group reviews by game.
create index reviews_game_id_idx on public.reviews (game_id);

-- The average rating and number of ratings for each of the given games. Games nobody rated are left out.
create function public.get_rating_summaries(target_game_ids bigint[])
returns table (
  game_id bigint,
  average_rating numeric,
  rating_count integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.game_id, round(avg(r.rating), 1), count(*)::integer
    from public.reviews r
    join public.profiles p on p.id = r.user_id
   where r.game_id = any(target_game_ids)
   group by r.game_id;
$$;

-- The highest-rated games with at least min_ratings ratings, best first. Ties go to the game with more ratings.
-- Each review keeps the game's name and cover from when it was written; the newest review's copy is used.
create function public.get_top_rated_games(min_ratings integer, max_games integer)
returns table (
  game_id bigint,
  game_name text,
  cover_url text,
  average_rating numeric,
  rating_count integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.game_id,
         (array_agg(r.game_name order by r.created_at desc))[1],
         (array_agg(r.cover_url order by r.created_at desc))[1],
         round(avg(r.rating), 1) as average_rating,
         count(*)::integer as rating_count
    from public.reviews r
    join public.profiles p on p.id = r.user_id
   group by r.game_id
  having count(*) >= greatest(min_ratings, 1)
   order by average_rating desc, rating_count desc, r.game_id
   limit least(greatest(max_games, 0), 100);
$$;

grant execute on function public.get_rating_summaries(bigint[]) to anon, authenticated;
grant execute on function public.get_top_rated_games(integer, integer) to anon, authenticated;

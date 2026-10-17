-- Community ratings: a game's average rating and number of ratings, without revealing who rated what.
-- Old reviews from anonymous users (who have no profile) aren't counted, matching get_game_reviews.
create function public.get_game_rating_summary(target_game_id bigint)
returns table (
  average_rating numeric,
  rating_count integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select round(avg(r.rating), 1), count(*)::integer
    from public.reviews r
    join public.profiles p on p.id = r.user_id
   where r.game_id = target_game_id;
$$;

grant execute on function public.get_game_rating_summary(bigint) to anon, authenticated;

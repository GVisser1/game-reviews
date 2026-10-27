-- The games list's "Highest rated" sort: every game players here rated, best average first, a page at a time and
-- optionally narrowed by name. Like the other rating functions, only reviews from users with a profile count.
create function public.get_rated_games(search_text text, page_offset integer, page_size integer)
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
  with rated as (
    -- Each review keeps the game's name and cover from when it was written; the newest review's copy is used.
    select r.game_id,
           (array_agg(r.game_name order by r.created_at desc))[1] as game_name,
           (array_agg(r.cover_url order by r.created_at desc))[1] as cover_url,
           round(avg(r.rating), 1) as average_rating,
           count(*)::integer as rating_count
      from public.reviews r
      join public.profiles p on p.id = r.user_id
     group by r.game_id
  ),
  -- The search, with ILIKE's wildcards escaped so they match literally.
  search as (
    select replace(replace(replace(trim(coalesce(search_text, '')), '\', '\\'), '%', '\%'), '_', '\_') as pattern
  )
  select rated.*
    from rated, search
   -- Like the IGDB search: matches at the start of the name or of any word in it.
   where search.pattern = ''
      or rated.game_name ilike search.pattern || '%'
      or rated.game_name ilike '% ' || search.pattern || '%'
   order by rated.average_rating desc, rated.rating_count desc, rated.game_id
  offset greatest(page_offset, 0)
   limit least(greatest(page_size, 0), 100);
$$;

grant execute on function public.get_rated_games(text, integer, integer) to anon, authenticated;

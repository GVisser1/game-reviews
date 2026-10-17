create table public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  game_id bigint not null,
  game_name text not null,
  cover_url text,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, game_id)
);

alter table public.reviews enable row level security;

create policy "Users can read their own reviews"
  on public.reviews for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own reviews"
  on public.reviews for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete to authenticated
  using ((select auth.uid()) = user_id);

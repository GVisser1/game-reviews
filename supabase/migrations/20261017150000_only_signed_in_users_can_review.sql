-- Anonymous visitors can browse, but only users signed in with Twitch may write reviews.
-- Permanent users carry is_anonymous = false in their JWT; anonymous sign-ins carry true.

alter policy "Users can add their own reviews"
  on public.reviews
  with check (
    (select auth.uid()) = user_id
    and (select (auth.jwt() ->> 'is_anonymous')::boolean) is false
  );

alter policy "Users can update their own reviews"
  on public.reviews
  using (
    (select auth.uid()) = user_id
    and (select (auth.jwt() ->> 'is_anonymous')::boolean) is false
  )
  with check (
    (select auth.uid()) = user_id
    and (select (auth.jwt() ->> 'is_anonymous')::boolean) is false
  );

alter policy "Users can delete their own reviews"
  on public.reviews
  using (
    (select auth.uid()) = user_id
    and (select (auth.jwt() ->> 'is_anonymous')::boolean) is false
  );

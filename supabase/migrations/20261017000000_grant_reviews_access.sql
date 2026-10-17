-- New Supabase projects don't grant table access to API roles by default; RLS policies still limit rows per user.
grant select, insert, update, delete on table public.reviews to authenticated;

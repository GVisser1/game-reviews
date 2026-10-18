-- Lets a signed-in user delete their own account. Deleting the auth user also deletes their profile and reviews
-- (both reference auth.users with on delete cascade) and their sessions and Twitch identity.

-- Fail the migration up front, rather than at the first deletion, if this role can't delete auth users.
do $$
begin
  if not has_table_privilege('auth.users', 'DELETE') then
    raise exception 'Role % cannot delete from auth.users, so delete_own_account would not work', current_user;
  end if;
end;
$$;

create function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Anonymous visitors have nothing to delete and get a fresh anonymous session anyway.
  if (select auth.uid()) is null or coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) then
    raise exception 'Only signed-in users can delete their account' using errcode = '42501';
  end if;

  delete from auth.users where id = (select auth.uid());
end;
$$;

revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;

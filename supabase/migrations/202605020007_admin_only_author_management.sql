create or replace function public.is_platform_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce(public.current_author_role() = 'admin', false)
$$;

drop policy if exists "Editorial admins can manage authors" on public.authors;

create policy "Platform admins can manage authors" on public.authors
on public.authors
for all
using (public.is_platform_admin())
with check (public.is_platform_admin());

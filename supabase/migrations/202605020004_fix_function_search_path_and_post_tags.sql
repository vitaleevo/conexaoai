create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_author_role()
returns text
language sql
stable
set search_path = public, pg_temp
as $$
  select a.role
  from public.authors a
  where a.user_id = auth.uid()
  order by case a.role
    when 'admin' then 1
    when 'manager' then 2
    when 'editor' then 3
    when 'author' then 4
    when 'viewer' then 5
    else 6
  end
  limit 1
$$;

create or replace function public.is_editorial_member()
returns boolean
language sql
stable
set search_path = public, pg_temp
as $$
  select coalesce(public.current_author_role() in ('admin', 'manager', 'editor', 'author'), false)
$$;

create or replace function public.is_editorial_admin()
returns boolean
language sql
stable
set search_path = public, pg_temp
as $$
  select coalesce(public.current_author_role() in ('admin', 'manager', 'editor'), false)
$$;

create or replace function public.recalculate_content_counts()
returns void
language plpgsql
set search_path = public, pg_temp
as $$
begin
  update public.categories c
  set post_count = (
    select count(*)
    from public.posts p
    where p.category_id = c.id and p.status = 'published'
  );

  update public.tags t
  set post_count = (
    select count(*)
    from public.post_tags pt
    join public.posts p on p.id = pt.post_id
    where pt.tag_id = t.id and p.status = 'published'
  );
end;
$$;

create or replace function public.refresh_content_counts()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  perform public.recalculate_content_counts();
  return null;
end;
$$;

insert into public.post_tags (post_id, tag_id)
select p.id, t.id
from public.posts p
join public.tags t on (
  (p.slug = 'ia-equipas-editoriais' and t.slug = 'ia')
  or (p.slug = 'automacao-publicacao-consistente' and t.slug in ('ia', 'produtividade'))
)
on conflict do nothing;

select public.recalculate_content_counts();

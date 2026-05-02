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
  )
  where true;

  update public.tags t
  set post_count = (
    select count(*)
    from public.post_tags pt
    join public.posts p on p.id = pt.post_id
    where pt.tag_id = t.id and p.status = 'published'
  )
  where true;
end;
$$;

select public.recalculate_content_counts();

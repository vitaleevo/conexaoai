alter table public.categories add column if not exists updated_at timestamptz not null default now();
alter table public.tags add column if not exists updated_at timestamptz not null default now();
alter table public.subscribers add column if not exists updated_at timestamptz not null default now();
alter table public.media_assets add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_authors_updated_at on public.authors;
create trigger set_authors_updated_at
before update on public.authors
for each row execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_tags_updated_at on public.tags;
create trigger set_tags_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists set_subscribers_updated_at on public.subscribers;
create trigger set_subscribers_updated_at
before update on public.subscribers
for each row execute function public.set_updated_at();

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

create or replace function public.current_author_role()
returns text
language sql
stable
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
as $$
  select coalesce(public.current_author_role() in ('admin', 'manager', 'editor', 'author'), false)
$$;

create or replace function public.is_editorial_admin()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_author_role() in ('admin', 'manager', 'editor'), false)
$$;

drop policy if exists "Authenticated can manage authors" on public.authors;
drop policy if exists "Authenticated can manage categories" on public.categories;
drop policy if exists "Authenticated can manage tags" on public.tags;
drop policy if exists "Authenticated can manage posts" on public.posts;
drop policy if exists "Authenticated can manage post tags" on public.post_tags;
drop policy if exists "Authenticated can read subscribers" on public.subscribers;
drop policy if exists "Authenticated can manage media" on public.media_assets;

create policy "Editorial admins can manage authors" on public.authors
for all
using (public.is_editorial_admin())
with check (public.is_editorial_admin());

create policy "Editorial admins can manage categories" on public.categories
for all
using (public.is_editorial_admin())
with check (public.is_editorial_admin());

create policy "Editorial admins can manage tags" on public.tags
for all
using (public.is_editorial_admin())
with check (public.is_editorial_admin());

create policy "Editorial members can manage posts" on public.posts
for all
using (public.is_editorial_member())
with check (public.is_editorial_member());

create policy "Editorial members can manage post tags" on public.post_tags
for all
using (public.is_editorial_member())
with check (public.is_editorial_member());

create policy "Editorial admins can read subscribers" on public.subscribers
for select
using (public.is_editorial_admin());

create policy "Editorial members can manage media" on public.media_assets
for all
using (public.is_editorial_member())
with check (public.is_editorial_member());

drop policy if exists "Authenticated can upload media" on storage.objects;
drop policy if exists "Authenticated can update media" on storage.objects;
drop policy if exists "Authenticated can delete media" on storage.objects;

create policy "Editorial members can upload media" on storage.objects
for insert
with check (bucket_id = 'media' and public.is_editorial_member());

create policy "Editorial members can update media" on storage.objects
for update
using (bucket_id = 'media' and public.is_editorial_member());

create policy "Editorial members can delete media" on storage.objects
for delete
using (bucket_id = 'media' and public.is_editorial_member());

create or replace function public.recalculate_content_counts()
returns void
language plpgsql
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
as $$
begin
  perform public.recalculate_content_counts();
  return null;
end;
$$;

drop trigger if exists refresh_counts_after_posts on public.posts;
create trigger refresh_counts_after_posts
after insert or update or delete on public.posts
for each statement execute function public.refresh_content_counts();

drop trigger if exists refresh_counts_after_post_tags on public.post_tags;
create trigger refresh_counts_after_post_tags
after insert or update or delete on public.post_tags
for each statement execute function public.refresh_content_counts();

with author_row as (
  select id from public.authors order by id limit 1
),
category_ai as (
  select id from public.categories where slug = 'inteligencia-artificial'
),
category_auto as (
  select id from public.categories where slug = 'automacao'
),
inserted_posts as (
  insert into public.posts (
    title,
    slug,
    excerpt,
    content,
    author_id,
    category_id,
    status,
    region,
    published_at,
    is_featured,
    reading_time,
    meta_title,
    meta_description
  )
  values
    (
      'Como a inteligência artificial está a mudar equipas editoriais',
      'ia-equipas-editoriais',
      'Um guia prático sobre como usar IA para pesquisa, revisão e publicação sem perder controlo editorial.',
      'A inteligência artificial já entrou no fluxo editorial moderno. O valor real não está em substituir editores, mas em acelerar pesquisa, organizar ideias, identificar lacunas e manter consistência entre canais. Para equipas pequenas, a IA reduz trabalho repetitivo e liberta tempo para decisões editoriais com mais critério.',
      (select id from author_row),
      (select id from category_ai),
      'published',
      'global',
      now() - interval '2 days',
      true,
      3,
      'IA para equipas editoriais',
      'Guia prático sobre IA aplicada a pesquisa, revisão e publicação editorial.'
    ),
    (
      'Automação simples para publicar com mais consistência',
      'automacao-publicacao-consistente',
      'Processos pequenos e bem desenhados ajudam uma equipa editorial a publicar com ritmo previsível.',
      'A automação editorial começa com tarefas claras: calendário, revisão, aprovação, publicação e distribuição. Quando estes passos estão bem definidos, ferramentas digitais conseguem reduzir atrasos e evitar retrabalho. O objetivo é criar um sistema estável, não uma cadeia complexa difícil de manter.',
      (select id from author_row),
      (select id from category_auto),
      'published',
      'global',
      now() - interval '1 day',
      false,
      2,
      'Automação editorial simples',
      'Como organizar processos de publicação com automação leve e sustentável.'
    ),
    (
      'Rascunho: tendências de IA para empresas lusófonas',
      'rascunho-tendencias-ia-empresas-lusofonas',
      'Rascunho interno para preparar uma análise sobre IA no mercado lusófono.',
      'Este conteúdo deve permanecer privado até revisão editorial.',
      (select id from author_row),
      (select id from category_ai),
      'draft',
      'global',
      null,
      false,
      1,
      'Rascunho de tendências de IA',
      'Rascunho interno ainda não publicado.'
    )
  on conflict (slug) do nothing
  returning id, slug
)
insert into public.post_tags (post_id, tag_id)
select p.id, t.id
from public.posts p
join public.tags t on t.slug in ('ia', 'produtividade')
where p.slug in ('ia-equipas-editoriais', 'automacao-publicacao-consistente')
on conflict do nothing;

select public.recalculate_content_counts();

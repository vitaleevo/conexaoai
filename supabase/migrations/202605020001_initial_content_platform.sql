create extension if not exists pgcrypto;

create table public.authors (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  bio text default '',
  avatar text default '',
  website text default '',
  twitter text default '',
  linkedin text default '',
  credentials text default '',
  role text not null default 'author' check (role in ('admin', 'manager', 'editor', 'author', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  description text default '',
  meta_title text default '',
  meta_description text default '',
  post_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.tags (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  post_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.posts (
  id bigserial primary key,
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text not null,
  featured_image text default '',
  featured_image_alt text default '',
  author_id bigint references public.authors(id) on delete set null,
  category_id bigint references public.categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'scheduled')),
  region text not null default 'global' check (region in ('global', 'america', 'europe', 'asia')),
  published_at timestamptz,
  is_featured boolean not null default false,
  reading_time integer not null default 1,
  meta_title text default '',
  meta_description text default '',
  keywords text default '',
  canonical_url text default '',
  og_image text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_tags (
  post_id bigint not null references public.posts(id) on delete cascade,
  tag_id bigint not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.subscribers (
  id bigserial primary key,
  email text not null unique,
  name text default '',
  region text not null default 'global',
  is_active boolean not null default true,
  confirmed boolean not null default false,
  confirmation_token uuid not null default gen_random_uuid(),
  subscribed_at timestamptz not null default now()
);

create table public.media_assets (
  id bigserial primary key,
  file text not null,
  storage_path text,
  description text default '',
  created_at timestamptz not null default now()
);

create table public.click_events (
  id bigserial primary key,
  path text not null default '/',
  x_percent numeric(6, 2) not null,
  y_percent numeric(6, 2) not null,
  device_type text default '',
  browser text default '',
  created_at timestamptz not null default now()
);

create index posts_status_published_at_idx on public.posts(status, published_at desc);
create index posts_category_idx on public.posts(category_id);
create index posts_featured_idx on public.posts(is_featured);
create index posts_search_idx on public.posts using gin(to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));
create index click_events_path_created_idx on public.click_events(path, created_at desc);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.subscribers enable row level security;
alter table public.media_assets enable row level security;
alter table public.click_events enable row level security;

create policy "Public can read authors" on public.authors for select using (true);
create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read tags" on public.tags for select using (true);
create policy "Public can read published posts" on public.posts for select using (status = 'published' or auth.role() = 'authenticated');
create policy "Public can read post tags" on public.post_tags for select using (true);
create policy "Authenticated can manage authors" on public.authors for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated can manage categories" on public.categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated can manage tags" on public.tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated can manage posts" on public.posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated can manage post tags" on public.post_tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Anyone can subscribe" on public.subscribers for insert with check (true);
create policy "Authenticated can read subscribers" on public.subscribers for select using (auth.role() = 'authenticated');
create policy "Authenticated can manage media" on public.media_assets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Anyone can insert click events" on public.click_events for insert with check (true);
create policy "Authenticated can read click events" on public.click_events for select using (auth.role() = 'authenticated');

create policy "Public can read media bucket" on storage.objects for select using (bucket_id = 'media');
create policy "Authenticated can upload media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Authenticated can update media" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Authenticated can delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');


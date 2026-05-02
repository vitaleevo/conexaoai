drop policy if exists "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe with valid email" on public.subscribers
for insert
with check (
  email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and length(email) <= 254
  and coalesce(length(name), 0) <= 120
  and coalesce(length(region), 0) <= 80
);

drop policy if exists "Anyone can insert click events" on public.click_events;
create policy "Anyone can insert bounded click events" on public.click_events
for insert
with check (
  length(path) between 1 and 2048
  and x_percent between 0 and 100
  and y_percent between 0 and 100
  and coalesce(length(device_type), 0) <= 80
  and coalesce(length(browser), 0) <= 120
);

drop policy if exists "Public can read media bucket" on storage.objects;

revoke execute on function public.rls_auto_enable() from anon, authenticated, public;

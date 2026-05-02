insert into public.authors (name, email, role, bio)
values ('Editor ConexãoAI', 'editor@conexaoai.local', 'admin', 'Perfil editorial inicial.')
on conflict do nothing;

insert into public.categories (name, slug, description)
values
  ('Inteligência Artificial', 'inteligencia-artificial', 'Análises e guias sobre IA.'),
  ('Automação', 'automacao', 'Automação aplicada a negócios e produtividade.')
on conflict (slug) do nothing;

insert into public.tags (name, slug)
values ('IA', 'ia'), ('Produtividade', 'produtividade')
on conflict (slug) do nothing;


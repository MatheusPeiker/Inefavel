-- Passos Automóveis: banco de dados do estoque.
-- Rode este arquivo no Supabase (SQL Editor > New query > Run).

-- 1) Carros -------------------------------------------------------------------
create table if not exists public.cars (
  id            text primary key default gen_random_uuid()::text,
  code          text unique not null,
  brand         text not null,
  model         text not null,
  version       text not null default '',
  year_fab      int  not null,
  year_model    int  not null,
  price         numeric(12,2) not null check (price > 0),
  fipe          numeric(12,2),
  km            int  not null default 0,
  fuel          text not null default 'Flex',
  transmission  text not null default 'Automático',
  body          text not null default 'Hatch',
  color         text not null default '',
  color_hex     text not null default '#8A8D91',
  doors         int  not null default 4,
  plate_end     text not null default '',
  features      text[] not null default '{}',
  description   text not null default '',
  photos        text[] not null default '{}',
  featured      boolean not null default false,
  status        text not null default 'disponivel' check (status in ('disponivel','reservado','vendido')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz
);
create index if not exists cars_status_idx on public.cars (status);
create index if not exists cars_created_idx on public.cars (created_at desc);

alter table public.cars enable row level security;

-- Visitantes veem só carros à venda; o lojista (logado) vê e edita tudo.
drop policy if exists "cars: leitura pública" on public.cars;
create policy "cars: leitura pública" on public.cars
  for select using (status <> 'vendido' or auth.role() = 'authenticated');

drop policy if exists "cars: lojista edita" on public.cars;
create policy "cars: lojista edita" on public.cars
  for all to authenticated using (true) with check (true);

-- 2) Configurações da loja (uma linha só) ---------------------------------------
create table if not exists public.store_settings (
  id          int primary key default 1 check (id = 1),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
alter table public.store_settings enable row level security;

drop policy if exists "settings: leitura pública" on public.store_settings;
create policy "settings: leitura pública" on public.store_settings for select using (true);

drop policy if exists "settings: lojista edita" on public.store_settings;
create policy "settings: lojista edita" on public.store_settings
  for all to authenticated using (true) with check (true);

-- 3) Fotos (Storage) ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('car-photos', 'car-photos', true)
on conflict (id) do nothing;

drop policy if exists "fotos: leitura pública" on storage.objects;
create policy "fotos: leitura pública" on storage.objects
  for select using (bucket_id = 'car-photos');

drop policy if exists "fotos: lojista envia" on storage.objects;
create policy "fotos: lojista envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'car-photos');

drop policy if exists "fotos: lojista apaga" on storage.objects;
create policy "fotos: lojista apaga" on storage.objects
  for delete to authenticated using (bucket_id = 'car-photos');

-- IMPORTANTE: qualquer usuário logado vira "lojista". Em Authentication > Providers,
-- desative "Allow new users to sign up" e crie o(s) usuário(s) da loja manualmente
-- em Authentication > Users > Add user.

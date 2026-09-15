create extension if not exists pgcrypto;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_on date not null,
  title text not null check (char_length(title) between 1 and 200),
  category text not null default 'อื่น ๆ',
  amount numeric(14,2) not null check (amount <> 0),
  kind text not null check (kind in ('income','expense')),
  source text not null default 'manual' check (source in ('manual','statement','receipt')),
  source_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists transactions_user_source_hash_idx on public.transactions(user_id,source_hash) where source_hash is not null;
create index if not exists transactions_user_date_idx on public.transactions(user_id,occurred_on desc);

alter table public.transactions enable row level security;
revoke all on table public.transactions from anon, authenticated;
grant select,insert,update,delete on table public.transactions to authenticated;

create policy "transactions_select_own" on public.transactions for select to authenticated using ((select auth.uid())=user_id);
create policy "transactions_insert_own" on public.transactions for insert to authenticated with check ((select auth.uid())=user_id);
create policy "transactions_update_own" on public.transactions for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "transactions_delete_own" on public.transactions for delete to authenticated using ((select auth.uid())=user_id);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  account_type text not null,
  opening_balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists accounts_user_idx on public.accounts(user_id);
alter table public.accounts enable row level security;
revoke all on table public.accounts from anon, authenticated;
grant select,insert,update,delete on table public.accounts to authenticated;
create policy "accounts_select_own" on public.accounts for select to authenticated using ((select auth.uid())=user_id);
create policy "accounts_insert_own" on public.accounts for insert to authenticated with check ((select auth.uid())=user_id);
create policy "accounts_update_own" on public.accounts for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "accounts_delete_own" on public.accounts for delete to authenticated using ((select auth.uid())=user_id);

alter table public.requests
  add column if not exists selection jsonb;

alter table public.requests
  drop constraint if exists requests_selection_size;

alter table public.requests
  add constraint requests_selection_size
  check (selection is null or octet_length(selection::text) < 8000);

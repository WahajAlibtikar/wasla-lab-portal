-- Wasla shared database foundation
-- PostgreSQL / Supabase: lab web portal + doctor mobile app

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

create type public.organization_type as enum (
  'clinic',
  'laboratory'
);

create type public.organization_member_role as enum (
  'doctor',
  'clinic_admin',
  'clinic_staff',
  'lab_admin',
  'case_coordinator',
  'technician',
  'finance',
  'courier'
);

create type public.membership_status as enum (
  'invited',
  'active',
  'suspended'
);

create type public.service_category as enum (
  'crown',
  'bridge',
  'veneer',
  'implant',
  'denture',
  'orthodontics',
  'night_guard',
  'other'
);

create type public.case_priority as enum (
  'normal',
  'urgent'
);

create type public.case_status as enum (
  'draft',
  'submitted',
  'under_review',
  'needs_clarification',
  'quote_sent',
  'quote_accepted',
  'in_design',
  'in_manufacturing',
  'quality_control',
  'ready_for_delivery',
  'out_for_delivery',
  'delivered',
  'completed',
  'rejected',
  'cancelled'
);

create type public.file_kind as enum (
  'scan_3d',
  'clinical_image',
  'xray',
  'prescription',
  'design_preview',
  'invoice',
  'delivery_proof',
  'review_image',
  'other'
);

create type public.quote_status as enum (
  'draft',
  'sent',
  'accepted',
  'rejected',
  'expired'
);

create type public.production_stage as enum (
  'design',
  'manufacturing',
  'quality_control',
  'ready'
);

create type public.delivery_kind as enum (
  'pickup',
  'delivery'
);

create type public.delivery_status as enum (
  'scheduled',
  'assigned',
  'en_route',
  'completed',
  'delayed',
  'cancelled'
);

create type public.payment_kind as enum (
  'deposit',
  'balance',
  'refund'
);

create type public.payment_status as enum (
  'pending',
  'processing',
  'paid',
  'failed',
  'refunded'
);

create type public.invoice_status as enum (
  'draft',
  'issued',
  'partially_paid',
  'paid',
  'overdue',
  'void'
);

create type public.notification_kind as enum (
  'case_update',
  'quote',
  'message',
  'payment',
  'delivery',
  'system'
);

create sequence public.case_number_seq start with 1001;
create sequence public.invoice_number_seq start with 1001;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (length(btrim(full_name)) between 2 and 120),
  avatar_path text,
  specialty text,
  locale text not null default 'ar-SA',
  is_onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  type public.organization_type not null,
  display_name text not null check (length(btrim(display_name)) between 2 and 160),
  legal_name text,
  slug text,
  phone text,
  whatsapp text,
  email text,
  city text,
  district text,
  address_line text,
  maps_url text,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_slug_format check (
    slug is null or slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create unique index organizations_slug_unique_idx
  on public.organizations (lower(slug))
  where slug is not null;

create table public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.organization_member_role not null,
  status public.membership_status not null default 'active',
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index organization_members_user_id_idx
  on public.organization_members (user_id, status);

create table public.lab_profiles (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  description text,
  logo_path text,
  cover_path text,
  years_experience smallint check (years_experience between 0 and 100),
  minimum_turnaround_days smallint check (minimum_turnaround_days between 1 and 180),
  accepts_digital_scans boolean not null default true,
  pickup_available boolean not null default false,
  delivery_available boolean not null default false,
  working_hours jsonb not null default '{}'::jsonb,
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lab_services (
  id uuid primary key default gen_random_uuid(),
  laboratory_id uuid not null references public.organizations (id) on delete cascade,
  category public.service_category not null,
  name_ar text not null check (length(btrim(name_ar)) between 2 and 120),
  description_ar text,
  base_price_minor bigint check (base_price_minor is null or base_price_minor >= 0),
  currency char(3) not null default 'SAR' check (currency = upper(currency)),
  estimated_working_days smallint check (estimated_working_days between 1 and 180),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, laboratory_id)
);

create index lab_services_laboratory_active_idx
  on public.lab_services (laboratory_id, category)
  where is_active;

create table public.lab_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  laboratory_id uuid not null references public.organizations (id) on delete cascade,
  title_ar text not null check (length(btrim(title_ar)) between 2 and 120),
  image_path text not null,
  sort_order smallint not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lab_portfolio_items_laboratory_idx
  on public.lab_portfolio_items (laboratory_id, sort_order)
  where is_visible;

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique default (
    'WSL-' || lpad(nextval('public.case_number_seq')::text, 6, '0')
  ),
  doctor_id uuid not null references public.profiles (id) on delete restrict,
  clinic_id uuid not null references public.organizations (id) on delete restrict,
  laboratory_id uuid not null references public.organizations (id) on delete restrict,
  service_id uuid,
  patient_reference text not null check (length(btrim(patient_reference)) between 1 and 64),
  patient_age_years smallint check (patient_age_years between 0 and 120),
  service_name_snapshot text not null check (length(btrim(service_name_snapshot)) between 2 and 160),
  work_description text,
  shade_code text,
  requested_delivery_date date,
  priority public.case_priority not null default 'normal',
  status public.case_status not null default 'draft',
  submitted_at timestamptz,
  accepted_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, laboratory_id),
  constraint cases_service_laboratory_fk
    foreign key (service_id, laboratory_id)
    references public.lab_services (id, laboratory_id)
    on delete restrict
);

create index cases_doctor_created_idx
  on public.cases (doctor_id, created_at desc);

create index cases_clinic_status_idx
  on public.cases (clinic_id, status, created_at desc);

create index cases_laboratory_status_idx
  on public.cases (laboratory_id, status, created_at desc);

create index cases_laboratory_attention_idx
  on public.cases (laboratory_id, priority, created_at desc)
  where status in ('submitted', 'needs_clarification', 'quote_sent');

create table public.case_teeth (
  case_id uuid not null references public.cases (id) on delete cascade,
  tooth_code text not null,
  notes text,
  created_at timestamptz not null default now(),
  primary key (case_id, tooth_code),
  constraint case_teeth_fdi_code_check check (
    tooth_code ~ '^(?:[1-4][1-8]|[5-8][1-5])$'
  )
);

create table public.case_files (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  uploaded_by uuid not null references public.profiles (id) on delete restrict,
  kind public.file_kind not null,
  bucket_id text not null default 'case-files',
  storage_path text not null,
  original_name text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (bucket_id, storage_path)
);

create index case_files_case_created_idx
  on public.case_files (case_id, created_at desc);

create table public.case_messages (
  id bigint generated always as identity primary key,
  case_id uuid not null references public.cases (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete restrict,
  body text not null check (length(btrim(body)) between 1 and 5000),
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create index case_messages_case_created_idx
  on public.case_messages (case_id, created_at desc);

create table public.case_status_events (
  id bigint generated always as identity primary key,
  case_id uuid not null references public.cases (id) on delete cascade,
  from_status public.case_status,
  to_status public.case_status not null,
  actor_id uuid references public.profiles (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index case_status_events_case_created_idx
  on public.case_status_events (case_id, created_at desc);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  version smallint not null check (version > 0),
  subtotal_minor bigint not null check (subtotal_minor >= 0),
  tax_minor bigint not null default 0 check (tax_minor >= 0),
  total_minor bigint not null check (total_minor >= 0),
  currency char(3) not null default 'SAR' check (currency = upper(currency)),
  deposit_percent smallint not null default 25 check (deposit_percent between 0 and 100),
  estimated_working_days smallint not null check (estimated_working_days between 1 and 180),
  promised_date date,
  doctor_note text,
  internal_note text,
  status public.quote_status not null default 'draft',
  created_by uuid not null references public.profiles (id) on delete restrict,
  expires_at timestamptz,
  sent_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (case_id, version),
  constraint quotes_total_check check (total_minor = subtotal_minor + tax_minor)
);

create index quotes_case_status_idx
  on public.quotes (case_id, status, version desc);

create table public.production_jobs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references public.cases (id) on delete cascade,
  stage public.production_stage not null default 'design',
  assigned_to uuid references public.profiles (id) on delete set null,
  due_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index production_jobs_assignee_stage_idx
  on public.production_jobs (assigned_to, stage, due_at)
  where completed_at is null;

create table public.delivery_tasks (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  kind public.delivery_kind not null,
  status public.delivery_status not null default 'scheduled',
  assigned_to uuid references public.profiles (id) on delete set null,
  contact_name text not null,
  contact_phone text not null,
  city text,
  district text,
  address_line text not null,
  scheduled_from timestamptz,
  scheduled_to timestamptz,
  courier_name text,
  courier_phone text,
  instructions text,
  proof_file_id uuid references public.case_files (id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint delivery_tasks_window_check check (
    scheduled_to is null or scheduled_from is null or scheduled_to > scheduled_from
  )
);

create index delivery_tasks_case_idx
  on public.delivery_tasks (case_id, created_at desc);

create index delivery_tasks_active_schedule_idx
  on public.delivery_tasks (status, scheduled_from)
  where status in ('scheduled', 'assigned', 'en_route', 'delayed');

create table public.delivery_events (
  id bigint generated always as identity primary key,
  delivery_task_id uuid not null references public.delivery_tasks (id) on delete cascade,
  from_status public.delivery_status,
  to_status public.delivery_status not null,
  actor_id uuid references public.profiles (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index delivery_events_task_created_idx
  on public.delivery_events (delivery_task_id, created_at desc);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique default (
    'INV-' || lpad(nextval('public.invoice_number_seq')::text, 6, '0')
  ),
  case_id uuid not null references public.cases (id) on delete restrict,
  quote_id uuid references public.quotes (id) on delete set null,
  subtotal_minor bigint not null check (subtotal_minor >= 0),
  tax_minor bigint not null default 0 check (tax_minor >= 0),
  total_minor bigint not null check (total_minor >= 0),
  paid_minor bigint not null default 0 check (paid_minor >= 0),
  currency char(3) not null default 'SAR' check (currency = upper(currency)),
  status public.invoice_status not null default 'draft',
  issued_at timestamptz,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_total_check check (total_minor = subtotal_minor + tax_minor),
  constraint invoices_paid_check check (paid_minor <= total_minor)
);

create index invoices_case_status_idx
  on public.invoices (case_id, status, created_at desc);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete restrict,
  quote_id uuid references public.quotes (id) on delete set null,
  invoice_id uuid references public.invoices (id) on delete set null,
  kind public.payment_kind not null,
  status public.payment_status not null default 'pending',
  amount_minor bigint not null check (amount_minor > 0),
  currency char(3) not null default 'SAR' check (currency = upper(currency)),
  provider text,
  provider_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_case_created_idx
  on public.payments (case_id, created_at desc);

create unique index payments_provider_reference_unique_idx
  on public.payments (provider, provider_reference)
  where provider_reference is not null;

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references public.cases (id) on delete restrict,
  laboratory_id uuid not null,
  doctor_id uuid not null references public.profiles (id) on delete restrict,
  rating smallint not null check (rating between 1 and 5),
  comment text check (comment is null or length(btrim(comment)) between 3 and 2000),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_case_laboratory_fk
    foreign key (case_id, laboratory_id)
    references public.cases (id, laboratory_id)
    on delete restrict
);

create index reviews_laboratory_published_idx
  on public.reviews (laboratory_id, created_at desc)
  where is_published;

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.notification_kind not null,
  title_ar text not null check (length(btrim(title_ar)) between 2 and 160),
  body_ar text not null check (length(btrim(body_ar)) between 2 and 1000),
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function private.set_updated_at();

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row execute function private.set_updated_at();

create trigger lab_profiles_set_updated_at
before update on public.lab_profiles
for each row execute function private.set_updated_at();

create trigger lab_services_set_updated_at
before update on public.lab_services
for each row execute function private.set_updated_at();

create trigger lab_portfolio_items_set_updated_at
before update on public.lab_portfolio_items
for each row execute function private.set_updated_at();

create trigger cases_set_updated_at
before update on public.cases
for each row execute function private.set_updated_at();

create trigger quotes_set_updated_at
before update on public.quotes
for each row execute function private.set_updated_at();

create trigger production_jobs_set_updated_at
before update on public.production_jobs
for each row execute function private.set_updated_at();

create trigger delivery_tasks_set_updated_at
before update on public.delivery_tasks
for each row execute function private.set_updated_at();

create trigger invoices_set_updated_at
before update on public.invoices
for each row execute function private.set_updated_at();

create trigger payments_set_updated_at
before update on public.payments
for each row execute function private.set_updated_at();

create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function private.set_updated_at();

create function private.validate_laboratory_record()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target_id uuid;
begin
  target_id := coalesce(
    nullif(to_jsonb(new) ->> 'organization_id', ''),
    nullif(to_jsonb(new) ->> 'laboratory_id', '')
  )::uuid;

  if not exists (
    select 1
    from public.organizations o
    where o.id = target_id
      and o.type = 'laboratory'::public.organization_type
  ) then
    raise exception 'The referenced organization must be a laboratory.';
  end if;

  return new;
end;
$$;

create trigger lab_profiles_validate_organization
before insert or update on public.lab_profiles
for each row execute function private.validate_laboratory_record();

create trigger lab_services_validate_organization
before insert or update on public.lab_services
for each row execute function private.validate_laboratory_record();

create trigger lab_portfolio_validate_organization
before insert or update on public.lab_portfolio_items
for each row execute function private.validate_laboratory_record();

create function private.validate_case_parties()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.organizations o
    where o.id = new.clinic_id
      and o.type = 'clinic'::public.organization_type
      and o.is_active
  ) then
    raise exception 'The referenced clinic is invalid or inactive.';
  end if;

  if not exists (
    select 1 from public.organizations o
    where o.id = new.laboratory_id
      and o.type = 'laboratory'::public.organization_type
      and o.is_active
  ) then
    raise exception 'The referenced laboratory is invalid or inactive.';
  end if;

  if not exists (
    select 1
    from public.organization_members m
    where m.organization_id = new.clinic_id
      and m.user_id = new.doctor_id
      and m.status = 'active'::public.membership_status
      and m.role in (
        'doctor'::public.organization_member_role,
        'clinic_admin'::public.organization_member_role
      )
  ) then
    raise exception 'The doctor must be an active member of the clinic.';
  end if;

  return new;
end;
$$;

create trigger cases_validate_parties
before insert or update of doctor_id, clinic_id, laboratory_id on public.cases
for each row execute function private.validate_case_parties();

create function private.record_initial_case_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.case_status_events (
    case_id,
    from_status,
    to_status,
    actor_id,
    note
  ) values (
    new.id,
    null,
    new.status,
    coalesce((select auth.uid()), new.doctor_id),
    'تم إنشاء الحالة'
  );

  return new;
end;
$$;

create trigger cases_record_initial_status
after insert on public.cases
for each row execute function private.record_initial_case_status();

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_path)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(new.phone, ''),
      'مستخدم جديد'
    ),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

revoke all on function private.set_updated_at() from public;
revoke all on function private.validate_laboratory_record() from public;
revoke all on function private.validate_case_parties() from public;
revoke all on function private.record_initial_case_status() from public;
revoke all on function private.handle_new_user() from public;

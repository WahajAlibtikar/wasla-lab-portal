-- Explicit API privileges, RLS policies and guarded workflows.

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated, service_role;

revoke all on all tables in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from public, anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

grant usage on schema public to authenticated, service_role;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

create function private.is_org_member(
  p_organization_id uuid,
  p_roles public.organization_member_role[] default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.organization_id = p_organization_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'::public.membership_status
      and (p_roles is null or m.role = any (p_roles))
  );
$$;

create function private.can_access_case(p_case_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cases c
    where c.id = p_case_id
      and (
        c.doctor_id = (select auth.uid())
        or private.is_org_member(c.clinic_id)
        or private.is_org_member(c.laboratory_id)
      )
  );
$$;

create function private.is_active_laboratory(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organizations o
    where o.id = p_organization_id
      and o.type = 'laboratory'::public.organization_type
      and o.is_active
  );
$$;

create function private.is_case_lab_member(
  p_case_id uuid,
  p_roles public.organization_member_role[] default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cases c
    join public.organization_members m
      on m.organization_id = c.laboratory_id
    where c.id = p_case_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'::public.membership_status
      and (p_roles is null or m.role = any (p_roles))
  );
$$;

create function private.is_case_clinic_member(
  p_case_id uuid,
  p_roles public.organization_member_role[] default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cases c
    left join public.organization_members m
      on m.organization_id = c.clinic_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'::public.membership_status
    where c.id = p_case_id
      and (
        c.doctor_id = (select auth.uid())
        or (
          m.user_id is not null
          and (p_roles is null or m.role = any (p_roles))
        )
      )
  );
$$;

create function private.can_edit_case_details(p_case_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cases c
    where c.id = p_case_id
      and c.status in (
        'draft'::public.case_status,
        'needs_clarification'::public.case_status
      )
      and (
        c.doctor_id = (select auth.uid())
        or private.is_org_member(
          c.clinic_id,
          array[
            'doctor'::public.organization_member_role,
            'clinic_admin'::public.organization_member_role
          ]
        )
      )
  );
$$;

create function private.can_view_profile(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    p_profile_id = (select auth.uid())
    or exists (
      select 1
      from public.organization_members mine
      join public.organization_members theirs
        on theirs.organization_id = mine.organization_id
      where mine.user_id = (select auth.uid())
        and mine.status = 'active'::public.membership_status
        and theirs.user_id = p_profile_id
        and theirs.status = 'active'::public.membership_status
    )
    or exists (
      select 1
      from public.cases c
      where private.can_access_case(c.id)
        and (
          c.doctor_id = p_profile_id
          or exists (
            select 1 from public.case_messages m
            where m.case_id = c.id and m.sender_id = p_profile_id
          )
          or exists (
            select 1 from public.production_jobs p
            where p.case_id = c.id and p.assigned_to = p_profile_id
          )
          or exists (
            select 1 from public.delivery_tasks d
            where d.case_id = c.id and d.assigned_to = p_profile_id
          )
        )
    );
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_org_member(uuid, public.organization_member_role[]) to authenticated;
grant execute on function private.can_access_case(uuid) to authenticated;
grant execute on function private.is_active_laboratory(uuid) to authenticated;
grant execute on function private.is_case_lab_member(uuid, public.organization_member_role[]) to authenticated;
grant execute on function private.is_case_clinic_member(uuid, public.organization_member_role[]) to authenticated;
grant execute on function private.can_edit_case_details(uuid) to authenticated;
grant execute on function private.can_view_profile(uuid) to authenticated;

create function private.validate_organization_member_role()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_organization_type public.organization_type;
begin
  select o.type into v_organization_type
  from public.organizations o
  where o.id = new.organization_id;

  if v_organization_type = 'clinic'::public.organization_type
    and new.role not in (
      'doctor'::public.organization_member_role,
      'clinic_admin'::public.organization_member_role,
      'clinic_staff'::public.organization_member_role
    ) then
    raise exception 'This role is not valid for a clinic.';
  end if;

  if v_organization_type = 'laboratory'::public.organization_type
    and new.role not in (
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'technician'::public.organization_member_role,
      'finance'::public.organization_member_role,
      'courier'::public.organization_member_role
    ) then
    raise exception 'This role is not valid for a laboratory.';
  end if;

  return new;
end;
$$;

create trigger organization_members_validate_role
before insert or update of organization_id, role on public.organization_members
for each row execute function private.validate_organization_member_role();

revoke all on function private.validate_organization_member_role() from public;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.lab_profiles enable row level security;
alter table public.lab_services enable row level security;
alter table public.lab_portfolio_items enable row level security;
alter table public.cases enable row level security;
alter table public.case_teeth enable row level security;
alter table public.case_files enable row level security;
alter table public.case_messages enable row level security;
alter table public.case_status_events enable row level security;
alter table public.quotes enable row level security;
alter table public.production_jobs enable row level security;
alter table public.delivery_tasks enable row level security;
alter table public.delivery_events enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;

create policy profiles_select_related
on public.profiles
for select
to authenticated
using (private.can_view_profile(id));

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy organizations_select_accessible
on public.organizations
for select
to authenticated
using (
  (type = 'laboratory'::public.organization_type and is_active)
  or private.is_org_member(id)
  or exists (
    select 1
    from public.cases c
    where (c.clinic_id = organizations.id or c.laboratory_id = organizations.id)
      and private.can_access_case(c.id)
  )
);

create policy organizations_update_admin
on public.organizations
for update
to authenticated
using (
  private.is_org_member(
    id,
    array[
      'clinic_admin'::public.organization_member_role,
      'lab_admin'::public.organization_member_role
    ]
  )
)
with check (
  private.is_org_member(
    id,
    array[
      'clinic_admin'::public.organization_member_role,
      'lab_admin'::public.organization_member_role
    ]
  )
);

create policy organization_members_select_team
on public.organization_members
for select
to authenticated
using (
  user_id = (select auth.uid())
  or private.is_org_member(organization_id)
);

create policy organization_members_insert_admin
on public.organization_members
for insert
to authenticated
with check (
  private.is_org_member(
    organization_id,
    array[
      'clinic_admin'::public.organization_member_role,
      'lab_admin'::public.organization_member_role
    ]
  )
);

create policy organization_members_update_admin
on public.organization_members
for update
to authenticated
using (
  private.is_org_member(
    organization_id,
    array[
      'clinic_admin'::public.organization_member_role,
      'lab_admin'::public.organization_member_role
    ]
  )
)
with check (
  private.is_org_member(
    organization_id,
    array[
      'clinic_admin'::public.organization_member_role,
      'lab_admin'::public.organization_member_role
    ]
  )
);

create policy organization_members_delete_admin
on public.organization_members
for delete
to authenticated
using (
  private.is_org_member(
    organization_id,
    array[
      'clinic_admin'::public.organization_member_role,
      'lab_admin'::public.organization_member_role
    ]
  )
);

create policy lab_profiles_select_directory
on public.lab_profiles
for select
to authenticated
using (
  exists (
    select 1 from public.organizations o
    where o.id = lab_profiles.organization_id
      and o.type = 'laboratory'::public.organization_type
      and o.is_active
  )
  or private.is_org_member(organization_id)
);

create policy lab_profiles_insert_admin
on public.lab_profiles
for insert
to authenticated
with check (
  private.is_org_member(
    organization_id,
    array['lab_admin'::public.organization_member_role]
  )
);

create policy lab_profiles_update_admin
on public.lab_profiles
for update
to authenticated
using (
  private.is_org_member(
    organization_id,
    array['lab_admin'::public.organization_member_role]
  )
)
with check (
  private.is_org_member(
    organization_id,
    array['lab_admin'::public.organization_member_role]
  )
);

create policy lab_services_select_directory
on public.lab_services
for select
to authenticated
using (
  is_active
  or private.is_org_member(laboratory_id)
);

create policy lab_services_insert_admin
on public.lab_services
for insert
to authenticated
with check (
  private.is_org_member(
    laboratory_id,
    array['lab_admin'::public.organization_member_role]
  )
);

create policy lab_services_update_admin
on public.lab_services
for update
to authenticated
using (
  private.is_org_member(
    laboratory_id,
    array['lab_admin'::public.organization_member_role]
  )
)
with check (
  private.is_org_member(
    laboratory_id,
    array['lab_admin'::public.organization_member_role]
  )
);

create policy lab_services_delete_admin
on public.lab_services
for delete
to authenticated
using (
  private.is_org_member(
    laboratory_id,
    array['lab_admin'::public.organization_member_role]
  )
);

create policy lab_portfolio_select_directory
on public.lab_portfolio_items
for select
to authenticated
using (
  is_visible
  or private.is_org_member(laboratory_id)
);

create policy lab_portfolio_insert_admin
on public.lab_portfolio_items
for insert
to authenticated
with check (
  private.is_org_member(
    laboratory_id,
    array['lab_admin'::public.organization_member_role]
  )
);

create policy lab_portfolio_update_admin
on public.lab_portfolio_items
for update
to authenticated
using (
  private.is_org_member(
    laboratory_id,
    array['lab_admin'::public.organization_member_role]
  )
)
with check (
  private.is_org_member(
    laboratory_id,
    array['lab_admin'::public.organization_member_role]
  )
);

create policy lab_portfolio_delete_admin
on public.lab_portfolio_items
for delete
to authenticated
using (
  private.is_org_member(
    laboratory_id,
    array['lab_admin'::public.organization_member_role]
  )
);

create policy cases_select_parties
on public.cases
for select
to authenticated
using (
  doctor_id = (select auth.uid())
  or private.can_access_case(id)
);

create policy cases_insert_doctor
on public.cases
for insert
to authenticated
with check (
  doctor_id = (select auth.uid())
  and status = 'draft'::public.case_status
  and private.is_org_member(
    clinic_id,
    array[
      'doctor'::public.organization_member_role,
      'clinic_admin'::public.organization_member_role
    ]
  )
  and private.is_active_laboratory(laboratory_id)
);

create policy cases_update_editable_details
on public.cases
for update
to authenticated
using (private.can_edit_case_details(id))
with check (private.can_edit_case_details(id));

create policy cases_delete_draft
on public.cases
for delete
to authenticated
using (
  status = 'draft'::public.case_status
  and private.can_edit_case_details(id)
);

create policy case_teeth_select_parties
on public.case_teeth
for select
to authenticated
using (private.can_access_case(case_id));

create policy case_teeth_insert_editor
on public.case_teeth
for insert
to authenticated
with check (private.can_edit_case_details(case_id));

create policy case_teeth_update_editor
on public.case_teeth
for update
to authenticated
using (private.can_edit_case_details(case_id))
with check (private.can_edit_case_details(case_id));

create policy case_teeth_delete_editor
on public.case_teeth
for delete
to authenticated
using (private.can_edit_case_details(case_id));

create policy case_files_select_parties
on public.case_files
for select
to authenticated
using (private.can_access_case(case_id));

create policy case_files_insert_parties
on public.case_files
for insert
to authenticated
with check (
  uploaded_by = (select auth.uid())
  and private.can_access_case(case_id)
);

create policy case_files_update_owner_or_lab
on public.case_files
for update
to authenticated
using (
  uploaded_by = (select auth.uid())
  or private.is_case_lab_member(case_id)
)
with check (
  uploaded_by = (select auth.uid())
  or private.is_case_lab_member(case_id)
);

create policy case_files_delete_owner_or_lab
on public.case_files
for delete
to authenticated
using (
  uploaded_by = (select auth.uid())
  or private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role
    ]
  )
);

create policy case_messages_select_parties
on public.case_messages
for select
to authenticated
using (
  private.can_access_case(case_id)
  and (
    not is_internal
    or private.is_case_lab_member(case_id)
  )
);

create policy case_messages_insert_parties
on public.case_messages
for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and private.can_access_case(case_id)
  and (
    not is_internal
    or private.is_case_lab_member(case_id)
  )
);

create policy case_status_events_select_parties
on public.case_status_events
for select
to authenticated
using (private.can_access_case(case_id));

create policy quotes_select_parties
on public.quotes
for select
to authenticated
using (private.can_access_case(case_id));

create policy quotes_insert_lab
on public.quotes
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and status = 'draft'::public.quote_status
  and private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'finance'::public.organization_member_role
    ]
  )
);

create policy quotes_update_draft_lab
on public.quotes
for update
to authenticated
using (
  status = 'draft'::public.quote_status
  and private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'finance'::public.organization_member_role
    ]
  )
)
with check (
  status = 'draft'::public.quote_status
  and private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'finance'::public.organization_member_role
    ]
  )
);

create policy quotes_delete_draft_lab
on public.quotes
for delete
to authenticated
using (
  status = 'draft'::public.quote_status
  and private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'finance'::public.organization_member_role
    ]
  )
);

create policy production_jobs_select_parties
on public.production_jobs
for select
to authenticated
using (private.can_access_case(case_id));

create policy production_jobs_insert_lab
on public.production_jobs
for insert
to authenticated
with check (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'technician'::public.organization_member_role
    ]
  )
);

create policy production_jobs_update_lab
on public.production_jobs
for update
to authenticated
using (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'technician'::public.organization_member_role
    ]
  )
)
with check (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'technician'::public.organization_member_role
    ]
  )
);

create policy delivery_tasks_select_parties
on public.delivery_tasks
for select
to authenticated
using (private.can_access_case(case_id));

create policy delivery_tasks_insert_lab
on public.delivery_tasks
for insert
to authenticated
with check (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'courier'::public.organization_member_role
    ]
  )
);

create policy delivery_tasks_update_lab
on public.delivery_tasks
for update
to authenticated
using (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'courier'::public.organization_member_role
    ]
  )
)
with check (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'courier'::public.organization_member_role
    ]
  )
);

create policy delivery_events_select_parties
on public.delivery_events
for select
to authenticated
using (
  exists (
    select 1 from public.delivery_tasks d
    where d.id = delivery_events.delivery_task_id
      and private.can_access_case(d.case_id)
  )
);

create policy invoices_select_parties
on public.invoices
for select
to authenticated
using (private.can_access_case(case_id));

create policy invoices_insert_lab_finance
on public.invoices
for insert
to authenticated
with check (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'finance'::public.organization_member_role
    ]
  )
);

create policy invoices_update_lab_finance
on public.invoices
for update
to authenticated
using (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'finance'::public.organization_member_role
    ]
  )
)
with check (
  private.is_case_lab_member(
    case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'finance'::public.organization_member_role
    ]
  )
);

create policy payments_select_parties
on public.payments
for select
to authenticated
using (private.can_access_case(case_id));

create policy reviews_select_published
on public.reviews
for select
to authenticated
using (is_published or private.can_access_case(case_id));

create policy reviews_insert_doctor
on public.reviews
for insert
to authenticated
with check (
  doctor_id = (select auth.uid())
  and exists (
    select 1
    from public.cases c
    where c.id = reviews.case_id
      and c.doctor_id = (select auth.uid())
      and c.laboratory_id = reviews.laboratory_id
      and c.status in (
        'delivered'::public.case_status,
        'completed'::public.case_status
      )
  )
);

create policy reviews_update_doctor
on public.reviews
for update
to authenticated
using (doctor_id = (select auth.uid()))
with check (doctor_id = (select auth.uid()));

create policy reviews_delete_doctor
on public.reviews
for delete
to authenticated
using (doctor_id = (select auth.uid()));

create policy notifications_select_own
on public.notifications
for select
to authenticated
using (user_id = (select auth.uid()));

create policy notifications_update_own
on public.notifications
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

grant select on public.profiles to authenticated;
grant update (full_name, avatar_path, specialty, locale, is_onboarded)
  on public.profiles to authenticated;
grant select on public.organizations to authenticated;
grant update (
  display_name,
  legal_name,
  slug,
  phone,
  whatsapp,
  email,
  city,
  district,
  address_line,
  maps_url
) on public.organizations to authenticated;
grant select, insert, update, delete on public.organization_members to authenticated;
grant select, insert on public.lab_profiles to authenticated;
grant update (
  description,
  logo_path,
  cover_path,
  years_experience,
  minimum_turnaround_days,
  accepts_digital_scans,
  pickup_available,
  delivery_available,
  working_hours,
  latitude,
  longitude
) on public.lab_profiles to authenticated;
grant select, insert, delete on public.lab_services to authenticated;
grant update (
  category,
  name_ar,
  description_ar,
  base_price_minor,
  currency,
  estimated_working_days,
  is_active
) on public.lab_services to authenticated;
grant select, insert, delete on public.lab_portfolio_items to authenticated;
grant update (title_ar, image_path, sort_order, is_visible)
  on public.lab_portfolio_items to authenticated;
grant select, insert, delete on public.cases to authenticated;
grant update (
  patient_reference,
  patient_age_years,
  service_id,
  service_name_snapshot,
  work_description,
  shade_code,
  requested_delivery_date,
  priority
) on public.cases to authenticated;
grant select, insert, update, delete on public.case_teeth to authenticated;
grant select, insert, delete on public.case_files to authenticated;
grant update (kind, original_name, metadata) on public.case_files to authenticated;
grant select, insert on public.case_messages to authenticated;
grant select on public.case_status_events to authenticated;
grant select, insert, delete on public.quotes to authenticated;
grant update (
  subtotal_minor,
  tax_minor,
  total_minor,
  currency,
  deposit_percent,
  estimated_working_days,
  promised_date,
  doctor_note,
  internal_note,
  expires_at
) on public.quotes to authenticated;
grant select, insert on public.production_jobs to authenticated;
grant update (
  stage,
  assigned_to,
  due_at,
  started_at,
  completed_at,
  notes
) on public.production_jobs to authenticated;
grant select, insert on public.delivery_tasks to authenticated;
grant update (
  status,
  assigned_to,
  contact_name,
  contact_phone,
  city,
  district,
  address_line,
  scheduled_from,
  scheduled_to,
  courier_name,
  courier_phone,
  instructions,
  proof_file_id,
  completed_at
) on public.delivery_tasks to authenticated;
grant select on public.delivery_events to authenticated;
grant select, insert on public.invoices to authenticated;
grant update (
  subtotal_minor,
  tax_minor,
  total_minor,
  paid_minor,
  currency,
  status,
  issued_at,
  due_at
) on public.invoices to authenticated;
grant select on public.payments to authenticated;
grant select, insert, delete on public.reviews to authenticated;
grant update (rating, comment, is_published) on public.reviews to authenticated;
grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant usage on all sequences in schema public to authenticated;

create function public.create_organization(
  p_type public.organization_type,
  p_display_name text,
  p_legal_name text default null,
  p_slug text default null,
  p_phone text default null,
  p_city text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_organization_id uuid;
  v_role public.organization_member_role;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.';
  end if;

  if not exists (select 1 from public.profiles p where p.id = v_user_id) then
    raise exception 'Complete the user profile before creating an organization.';
  end if;

  if length(btrim(p_display_name)) < 2 then
    raise exception 'Organization name is required.';
  end if;

  insert into public.organizations (
    type,
    display_name,
    legal_name,
    slug,
    phone,
    city
  ) values (
    p_type,
    btrim(p_display_name),
    nullif(btrim(p_legal_name), ''),
    nullif(lower(btrim(p_slug)), ''),
    nullif(btrim(p_phone), ''),
    nullif(btrim(p_city), '')
  )
  returning id into v_organization_id;

  v_role := case p_type
    when 'clinic'::public.organization_type
      then 'clinic_admin'::public.organization_member_role
    when 'laboratory'::public.organization_type
      then 'lab_admin'::public.organization_member_role
  end;

  insert into public.organization_members (
    organization_id,
    user_id,
    role,
    status,
    joined_at
  ) values (
    v_organization_id,
    v_user_id,
    v_role,
    'active'::public.membership_status,
    now()
  );

  if p_type = 'laboratory'::public.organization_type then
    insert into public.lab_profiles (organization_id)
    values (v_organization_id);
  end if;

  return v_organization_id;
end;
$$;

create function public.transition_case(
  p_case_id uuid,
  p_new_status public.case_status,
  p_note text default null
)
returns public.cases
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_case public.cases%rowtype;
  v_clinic_actor boolean;
  v_lab_manager boolean;
  v_lab_production boolean;
  v_lab_delivery boolean;
  v_previous_status public.case_status;
  v_allowed boolean := false;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.';
  end if;

  select * into v_case
  from public.cases c
  where c.id = p_case_id
  for update;

  if not found then
    raise exception 'Case not found.';
  end if;

  if v_case.status = p_new_status then
    return v_case;
  end if;

  v_previous_status := v_case.status;

  v_clinic_actor := private.is_case_clinic_member(
    p_case_id,
    array[
      'doctor'::public.organization_member_role,
      'clinic_admin'::public.organization_member_role
    ]
  );

  v_lab_manager := private.is_case_lab_member(
    p_case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role
    ]
  );

  v_lab_production := private.is_case_lab_member(
    p_case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'technician'::public.organization_member_role
    ]
  );

  v_lab_delivery := private.is_case_lab_member(
    p_case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'courier'::public.organization_member_role
    ]
  );

  v_allowed :=
    (
      v_clinic_actor
      and (
        (v_case.status = 'draft' and p_new_status = 'submitted')
        or (v_case.status = 'needs_clarification' and p_new_status = 'submitted')
        or (v_case.status = 'delivered' and p_new_status = 'completed')
        or (
          p_new_status = 'cancelled'
          and v_case.status in (
            'draft',
            'submitted',
            'under_review',
            'needs_clarification',
            'quote_sent'
          )
        )
      )
    )
    or (
      v_lab_manager
      and (
        (v_case.status = 'submitted' and p_new_status in ('under_review', 'needs_clarification', 'rejected'))
        or (v_case.status = 'under_review' and p_new_status in ('needs_clarification', 'rejected'))
        or (v_case.status = 'needs_clarification' and p_new_status in ('under_review', 'rejected'))
        or (v_case.status = 'quote_sent' and p_new_status = 'needs_clarification')
        or (v_case.status = 'delivered' and p_new_status = 'completed')
      )
    )
    or (
      v_lab_production
      and (
        (v_case.status = 'quote_accepted' and p_new_status = 'in_design')
        or (v_case.status = 'in_design' and p_new_status = 'in_manufacturing')
        or (v_case.status = 'in_manufacturing' and p_new_status = 'quality_control')
        or (v_case.status = 'quality_control' and p_new_status in ('in_manufacturing', 'ready_for_delivery'))
      )
    )
    or (
      v_lab_delivery
      and (
        (v_case.status = 'ready_for_delivery' and p_new_status = 'out_for_delivery')
        or (v_case.status = 'out_for_delivery' and p_new_status = 'delivered')
      )
    );

  if not v_allowed then
    raise exception 'This status transition is not allowed for the current user.';
  end if;

  update public.cases
  set
    status = p_new_status,
    submitted_at = case
      when p_new_status = 'submitted' then coalesce(submitted_at, now())
      else submitted_at
    end,
    completed_at = case
      when p_new_status = 'completed' then now()
      else completed_at
    end,
    cancelled_at = case
      when p_new_status = 'cancelled' then now()
      else cancelled_at
    end
  where id = p_case_id
  returning * into v_case;

  insert into public.case_status_events (
    case_id,
    from_status,
    to_status,
    actor_id,
    note
  ) values (
    p_case_id,
    v_previous_status,
    p_new_status,
    v_user_id,
    nullif(btrim(p_note), '')
  );

  if p_new_status in (
    'in_design'::public.case_status,
    'in_manufacturing'::public.case_status,
    'quality_control'::public.case_status,
    'ready_for_delivery'::public.case_status
  ) then
    insert into public.production_jobs (case_id, stage, started_at)
    values (
      p_case_id,
      case p_new_status
        when 'in_design'::public.case_status then 'design'::public.production_stage
        when 'in_manufacturing'::public.case_status then 'manufacturing'::public.production_stage
        when 'quality_control'::public.case_status then 'quality_control'::public.production_stage
        else 'ready'::public.production_stage
      end,
      now()
    )
    on conflict (case_id) do update
      set stage = excluded.stage;
  end if;

  return v_case;
end;
$$;

create function public.send_quote(p_quote_id uuid)
returns public.quotes
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_quote public.quotes%rowtype;
  v_case public.cases%rowtype;
  v_previous_status public.case_status;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.';
  end if;

  select * into v_quote
  from public.quotes q
  where q.id = p_quote_id
  for update;

  if not found then
    raise exception 'Quote not found.';
  end if;

  if not private.is_case_lab_member(
    v_quote.case_id,
    array[
      'lab_admin'::public.organization_member_role,
      'case_coordinator'::public.organization_member_role,
      'finance'::public.organization_member_role
    ]
  ) then
    raise exception 'Only authorized laboratory staff can send this quote.';
  end if;

  select * into v_case
  from public.cases c
  where c.id = v_quote.case_id
  for update;

  if v_quote.status <> 'draft'::public.quote_status
    or v_case.status not in (
      'under_review'::public.case_status,
      'needs_clarification'::public.case_status
    ) then
    raise exception 'This quote cannot be sent in its current state.';
  end if;

  v_previous_status := v_case.status;

  update public.quotes
  set status = 'sent', sent_at = now()
  where id = p_quote_id
  returning * into v_quote;

  update public.cases
  set status = 'quote_sent'
  where id = v_quote.case_id;

  insert into public.case_status_events (
    case_id,
    from_status,
    to_status,
    actor_id,
    note
  ) values (
    v_quote.case_id,
    v_previous_status,
    'quote_sent',
    v_user_id,
    'تم إرسال عرض السعر'
  );

  return v_quote;
end;
$$;

create function public.accept_quote(p_quote_id uuid)
returns public.quotes
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_quote public.quotes%rowtype;
  v_case public.cases%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.';
  end if;

  select * into v_quote
  from public.quotes q
  where q.id = p_quote_id
  for update;

  if not found then
    raise exception 'Quote not found.';
  end if;

  select * into v_case
  from public.cases c
  where c.id = v_quote.case_id
  for update;

  if not private.is_case_clinic_member(
    v_quote.case_id,
    array[
      'doctor'::public.organization_member_role,
      'clinic_admin'::public.organization_member_role
    ]
  ) then
    raise exception 'Only the doctor or clinic administrator can accept this quote.';
  end if;

  if v_quote.status <> 'sent'::public.quote_status
    or v_case.status <> 'quote_sent'::public.case_status
    or (v_quote.expires_at is not null and v_quote.expires_at <= now()) then
    raise exception 'This quote is no longer available for acceptance.';
  end if;

  update public.quotes
  set status = 'rejected'
  where case_id = v_quote.case_id
    and id <> p_quote_id
    and status = 'sent';

  update public.quotes
  set status = 'accepted', accepted_at = now()
  where id = p_quote_id
  returning * into v_quote;

  update public.cases
  set status = 'quote_accepted', accepted_at = now()
  where id = v_quote.case_id;

  insert into public.case_status_events (
    case_id,
    from_status,
    to_status,
    actor_id,
    note
  ) values (
    v_quote.case_id,
    'quote_sent',
    'quote_accepted',
    v_user_id,
    'تم اعتماد عرض السعر'
  );

  return v_quote;
end;
$$;

create function private.record_delivery_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.delivery_events (
      delivery_task_id,
      from_status,
      to_status,
      actor_id,
      note
    ) values (
      new.id,
      null,
      new.status,
      (select auth.uid()),
      'تم إنشاء مهمة النقل'
    );
  elsif new.status is distinct from old.status then
    insert into public.delivery_events (
      delivery_task_id,
      from_status,
      to_status,
      actor_id
    ) values (
      new.id,
      old.status,
      new.status,
      (select auth.uid())
    );
  end if;

  return new;
end;
$$;

create trigger delivery_tasks_record_initial_status
after insert on public.delivery_tasks
for each row execute function private.record_delivery_status();

create trigger delivery_tasks_record_status_change
after update of status on public.delivery_tasks
for each row execute function private.record_delivery_status();

revoke all on function public.create_organization(
  public.organization_type,
  text,
  text,
  text,
  text,
  text
) from public, anon, authenticated, service_role;

revoke all on function public.transition_case(uuid, public.case_status, text)
  from public, anon, authenticated, service_role;

revoke all on function public.send_quote(uuid)
  from public, anon, authenticated, service_role;

revoke all on function public.accept_quote(uuid)
  from public, anon, authenticated, service_role;

grant execute on function public.create_organization(
  public.organization_type,
  text,
  text,
  text,
  text,
  text
) to authenticated;

grant execute on function public.transition_case(uuid, public.case_status, text)
  to authenticated;

grant execute on function public.send_quote(uuid)
  to authenticated;

grant execute on function public.accept_quote(uuid)
  to authenticated;

create view public.lab_directory
with (security_invoker = true)
as
select
  o.id,
  o.display_name,
  o.slug,
  o.city,
  o.district,
  o.is_verified,
  lp.description,
  lp.logo_path,
  lp.cover_path,
  lp.years_experience,
  lp.minimum_turnaround_days,
  lp.accepts_digital_scans,
  lp.pickup_available,
  lp.delivery_available,
  coalesce(review_stats.average_rating, 0::numeric) as average_rating,
  coalesce(review_stats.review_count, 0::bigint) as review_count,
  service_stats.minimum_price_minor,
  service_stats.service_count
from public.organizations o
join public.lab_profiles lp on lp.organization_id = o.id
left join lateral (
  select
    round(avg(r.rating)::numeric, 1) as average_rating,
    count(*) as review_count
  from public.reviews r
  where r.laboratory_id = o.id
    and r.is_published
) review_stats on true
left join lateral (
  select
    min(s.base_price_minor) as minimum_price_minor,
    count(*) as service_count
  from public.lab_services s
  where s.laboratory_id = o.id
    and s.is_active
) service_stats on true
where o.type = 'laboratory'::public.organization_type
  and o.is_active;

revoke all on public.lab_directory from public, anon, authenticated;
grant select on public.lab_directory to authenticated;

-- Storage policies and the small Realtime surface needed by both clients.

create function private.safe_uuid(p_value text)
returns uuid
language plpgsql
immutable
set search_path = ''
as $$
begin
  return nullif(p_value, '')::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

create function private.case_id_from_storage_name(p_name text)
returns uuid
language sql
stable
set search_path = ''
as $$
  select private.safe_uuid((storage.foldername(p_name))[1]);
$$;

revoke all on function private.safe_uuid(text) from public, anon, authenticated;
revoke all on function private.case_id_from_storage_name(text) from public, anon, authenticated;
grant execute on function private.safe_uuid(text) to authenticated;
grant execute on function private.case_id_from_storage_name(text) to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'case-files',
  'case-files',
  false,
  104857600,
  array[
    'image/jpeg',
    'image/png',
    'image/heic',
    'application/pdf',
    'application/dicom',
    'model/stl',
    'application/sla',
    'application/octet-stream',
    'application/zip'
  ]
), (
  'public-assets',
  'public-assets',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy case_files_storage_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'case-files'
  and private.can_access_case(private.case_id_from_storage_name(name))
);

create policy case_files_storage_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'case-files'
  and private.can_access_case(private.case_id_from_storage_name(name))
);

create policy case_files_storage_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'case-files'
  and (
    private.is_case_lab_member(
      private.case_id_from_storage_name(name),
      array[
        'lab_admin'::public.organization_member_role,
        'case_coordinator'::public.organization_member_role
      ]
    )
    or exists (
      select 1
      from public.case_files f
      where f.bucket_id = storage.objects.bucket_id
        and f.storage_path = storage.objects.name
        and f.uploaded_by = (select auth.uid())
    )
  )
)
with check (
  bucket_id = 'case-files'
  and private.can_access_case(private.case_id_from_storage_name(name))
);

create policy case_files_storage_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'case-files'
  and (
    private.is_case_lab_member(
      private.case_id_from_storage_name(name),
      array[
        'lab_admin'::public.organization_member_role,
        'case_coordinator'::public.organization_member_role
      ]
    )
    or exists (
      select 1
      from public.case_files f
      where f.bucket_id = storage.objects.bucket_id
        and f.storage_path = storage.objects.name
        and f.uploaded_by = (select auth.uid())
    )
  )
);

create policy public_assets_storage_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'public-assets'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and private.safe_uuid((storage.foldername(name))[2]) = (select auth.uid())
    )
    or (
      (storage.foldername(name))[1] = 'labs'
      and private.is_org_member(
        private.safe_uuid((storage.foldername(name))[2]),
        array['lab_admin'::public.organization_member_role]
      )
    )
  )
);

create policy public_assets_storage_select_owners
on storage.objects
for select
to authenticated
using (
  bucket_id = 'public-assets'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and private.safe_uuid((storage.foldername(name))[2]) = (select auth.uid())
    )
    or (
      (storage.foldername(name))[1] = 'labs'
      and private.is_org_member(
        private.safe_uuid((storage.foldername(name))[2]),
        array['lab_admin'::public.organization_member_role]
      )
    )
  )
);

create policy public_assets_storage_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'public-assets'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and private.safe_uuid((storage.foldername(name))[2]) = (select auth.uid())
    )
    or (
      (storage.foldername(name))[1] = 'labs'
      and private.is_org_member(
        private.safe_uuid((storage.foldername(name))[2]),
        array['lab_admin'::public.organization_member_role]
      )
    )
  )
)
with check (
  bucket_id = 'public-assets'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and private.safe_uuid((storage.foldername(name))[2]) = (select auth.uid())
    )
    or (
      (storage.foldername(name))[1] = 'labs'
      and private.is_org_member(
        private.safe_uuid((storage.foldername(name))[2]),
        array['lab_admin'::public.organization_member_role]
      )
    )
  )
);

create policy public_assets_storage_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'public-assets'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and private.safe_uuid((storage.foldername(name))[2]) = (select auth.uid())
    )
    or (
      (storage.foldername(name))[1] = 'labs'
      and private.is_org_member(
        private.safe_uuid((storage.foldername(name))[2]),
        array['lab_admin'::public.organization_member_role]
      )
    )
  )
);

do $$
declare
  target_table text;
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    foreach target_table in array array[
      'cases',
      'case_messages',
      'case_status_events',
      'quotes',
      'production_jobs',
      'delivery_tasks',
      'notifications'
    ]
    loop
      if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = target_table
      ) then
        execute format(
          'alter publication supabase_realtime add table public.%I',
          target_table
        );
      end if;
    end loop;
  end if;
end;
$$;

-- Verify custom types
select typname, typcategory 
from pg_type 
where typname in (
  'project_status',
  'billing_status',
  'user_role',
  'document_type',
  'note_type',
  'task_status',
  'task_priority',
  'photo_category'
);

-- Verify tables and their columns
select 
  table_name,
  string_agg(column_name || ' ' || data_type, ', ') as columns
from information_schema.columns
where table_schema = 'public'
and table_name in (
  'profiles',
  'clients',
  'projects',
  'project_requirements',
  'project_access'
)
group by table_name;

-- Verify RLS is enabled
select 
    tablename,
    rowsecurity
from pg_tables
where schemaname = 'public';
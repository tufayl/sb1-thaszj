-- Drop all policies first
do $$ 
begin
  execute (
    select string_agg(
      format('drop policy if exists %I on %I.%I;',
             pol.policyname, 
             tab.schemaname, 
             tab.tablename),
      E'\n'
    )
    from pg_policies pol
    join pg_tables tab on pol.tablename = tab.tablename
    where tab.schemaname = 'public'
  );
end $$;

-- Drop existing tables in correct order
drop table if exists public.notifications cascade;
drop table if exists public.notification_preferences cascade;
drop table if exists public.project_photos cascade;
drop table if exists public.project_tasks cascade;
drop table if exists public.project_phases cascade;
drop table if exists public.project_notes cascade;
drop table if exists public.project_access cascade;
drop table if exists public.project_requirements cascade;
drop table if exists public.projects cascade;
drop table if exists public.clients cascade;
drop table if exists public.profiles cascade;

-- Drop existing types
drop type if exists photo_category cascade;
drop type if exists note_type cascade;
drop type if exists task_priority cascade;
drop type if exists task_status cascade;
drop type if exists project_status cascade;
drop type if exists billing_status cascade;
drop type if exists user_role cascade;

-- Drop existing functions and triggers
drop function if exists public.handle_new_user() cascade;
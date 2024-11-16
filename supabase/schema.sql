-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('admin', 'manager', 'user');
create type project_status as enum ('planning', 'in-progress', 'review', 'completed');
create type billing_status as enum ('pending', 'invoiced', 'paid');
create type task_status as enum ('todo', 'in-progress', 'review', 'completed');
create type task_priority as enum ('low', 'medium', 'high');
create type note_type as enum ('general', 'update', 'issue', 'milestone');
create type photo_category as enum ('site-survey', 'progress', 'completion', 'design', 'other');

-- Create profiles table
create table public.profiles (
  id uuid references auth.users(id) primary key,
  email text,
  first_name text,
  last_name text,
  role user_role not null default 'user'::user_role,
  position text,
  department text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create clients table
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  company text,
  address text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create projects table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) not null,
  name text not null,
  description text not null,
  status project_status not null default 'planning',
  start_date date not null,
  budget numeric(12,2) not null,
  billing_status billing_status not null default 'pending',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create project requirements table
create table public.project_requirements (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  requirement text not null,
  created_at timestamptz default now()
);

-- Create project access table
create table public.project_access (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  access_type text not null check (access_type in ('read', 'write', 'admin')),
  created_at timestamptz default now(),
  unique(project_id, user_id)
);

-- Create project notes table
create table public.project_notes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id),
  type note_type not null default 'general',
  updated_at timestamptz default now()
);

-- Create project tasks table
create table public.project_tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status task_status not null default 'todo',
  priority task_priority not null default 'medium',
  assigned_to uuid references auth.users(id),
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  phase_id uuid
);

-- Create project phases table
create table public.project_phases (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  start_date date not null,
  end_date date not null,
  status project_status not null default 'planning',
  progress integer check (progress >= 0 and progress <= 100) default 0,
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create project photos table
create table public.project_photos (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  url text not null,
  title text not null,
  description text,
  category photo_category not null default 'other',
  location text,
  taken_at timestamptz not null,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Create notification preferences table
create table public.notification_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade,
  types text[] not null,
  email boolean default true,
  in_app boolean default true,
  created_at timestamptz default now(),
  unique(user_id, project_id)
);

-- Create notifications table
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_requirements enable row level security;
alter table public.project_access enable row level security;
alter table public.project_notes enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_phases enable row level security;
alter table public.project_photos enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;

-- Create RLS policies

-- Profiles policies
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Clients policies
create policy "Authenticated users can view clients"
  on public.clients for select
  using (auth.uid() is not null);

create policy "Managers and admins can manage clients"
  on public.clients for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('manager', 'admin')
    )
  );

-- Projects policies
create policy "Users can view accessible projects"
  on public.projects for select
  using (
    auth.uid() = created_by
    or exists (
      select 1 from public.project_access
      where project_id = id
      and user_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Managers and admins can manage projects"
  on public.projects for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('manager', 'admin')
    )
  );

-- Project access policies
create policy "Users can view project access"
  on public.project_access for select
  using (
    auth.uid() in (
      select user_id from public.project_access pa
      where pa.project_id = project_id
    )
  );

create policy "Managers and admins can manage project access"
  on public.project_access for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('manager', 'admin')
    )
  );

-- Project content policies (notes, tasks, phases, photos)
create policy "Users can view project content they have access to"
  on public.project_notes for select
  using (
    exists (
      select 1 from public.project_access
      where project_id = project_notes.project_id
      and user_id = auth.uid()
    )
  );

create policy "Users with write access can manage project content"
  on public.project_notes for all
  using (
    exists (
      select 1 from public.project_access
      where project_id = project_notes.project_id
      and user_id = auth.uid()
      and access_type in ('write', 'admin')
    )
  );

-- Repeat similar policies for tasks, phases, and photos
create policy "Users can view project tasks"
  on public.project_tasks for select
  using (
    exists (
      select 1 from public.project_access
      where project_id = project_tasks.project_id
      and user_id = auth.uid()
    )
  );

create policy "Users with write access can manage tasks"
  on public.project_tasks for all
  using (
    exists (
      select 1 from public.project_access
      where project_id = project_tasks.project_id
      and user_id = auth.uid()
      and access_type in ('write', 'admin')
    )
  );

-- Notification policies
create policy "Users can view their own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can manage their own notification preferences"
  on public.notification_preferences for all
  using (user_id = auth.uid());

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    role
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
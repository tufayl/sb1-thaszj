-- Drop existing policies first
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

-- Create new policies for the profiles table
create policy "Public profiles are viewable by everyone"
on profiles for select
using (true);

create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

-- Enable RLS
alter table profiles enable row level security;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on profiles to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- Create or update trigger for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    'user',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
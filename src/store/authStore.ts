import { create } from 'zustand';
import { User } from '../types';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface AuthStore {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (user: Omit<User, 'id' | 'passwordHash' | 'createdAt'> & { password: string }) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => void;
  resetPassword: (userId: string) => string;
  getUserById: (userId: string) => User | undefined;
  hasProjectAccess: (userId: string, projectId: string, accessType: 'read' | 'write' | 'admin') => boolean;
}

// Demo users for local development
const DEMO_USERS: User[] = [
  {
    id: uuidv4(),
    username: 'admin@example.com',
    email: 'admin@example.com',
    passwordHash: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    position: 'System Administrator',
    department: 'IT',
    createdAt: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    notificationPreferences: [],
    isActive: true
  },
  {
    id: uuidv4(),
    username: 'manager@example.com',
    email: 'manager@example.com',
    passwordHash: 'manager123',
    role: 'manager',
    firstName: 'Project',
    lastName: 'Manager',
    position: 'Senior Project Manager',
    department: 'Operations',
    createdAt: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    notificationPreferences: [],
    isActive: true
  }
];

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  users: DEMO_USERS,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      // First try demo login
      const demoUser = DEMO_USERS.find(u => 
        u.email === email && u.passwordHash === password
      );
      
      if (demoUser) {
        set({ 
          currentUser: demoUser, 
          isAuthenticated: true 
        });
        return true;
      }

      // Then try Supabase if enabled
      if (isSupabaseEnabled() && supabase) {
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        if (!user) throw new Error('No user data returned');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        const userData: User = {
          id: user.id,
          username: email,
          email: email,
          passwordHash: '',
          role: profile?.role || 'user',
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          position: profile?.position || '',
          department: profile?.department || '',
          createdAt: user.created_at,
          avatar: profile?.avatar_url,
          notificationPreferences: [],
          isActive: true
        };

        set({ 
          currentUser: userData, 
          isAuthenticated: true 
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      if (isSupabaseEnabled() && supabase) {
        await supabase.auth.signOut();
      }
      
      set({ 
        currentUser: null, 
        isAuthenticated: false 
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    if (!isSupabaseEnabled() || !supabase) {
      throw new Error('Registration requires Supabase configuration');
    }

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');
  },

  updateUser: (userId, updates) => {
    set(state => ({
      users: state.users.map(user =>
        user.id === userId
          ? { ...user, ...updates }
          : user
      ),
      currentUser: state.currentUser?.id === userId
        ? { ...state.currentUser, ...updates }
        : state.currentUser
    }));
  },

  resetPassword: (userId) => {
    const tempPassword = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(x => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'[x % 71])
      .join('');
    
    return tempPassword;
  },

  getUserById: (userId) => {
    return get().users.find(u => u.id === userId);
  },

  hasProjectAccess: (userId, projectId, accessType) => {
    const user = get().users.find(u => u.id === userId);
    if (!user) return false;
    if (user.role === 'admin') return true;
    return true;
  }
}));
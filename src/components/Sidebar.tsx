import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Users, 
  FolderKanban, 
  LayoutDashboard, 
  Settings,
  LogOut,
  User,
  UserCog,
  CreditCard,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import NotificationCenter from './notifications/NotificationCenter';

export default function Sidebar() {
  const { currentUser, logout } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FolderKanban className="w-6 h-6" />
          ArchiManager
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <Users className="w-5 h-5" />
          Clients
        </NavLink>
        
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <FolderKanban className="w-5 h-5" />
          Projects
        </NavLink>

        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-2 text-xs font-semibold text-gray-400 uppercase">
                Administration
              </p>
            </div>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`
              }
            >
              <UserCog className="w-5 h-5" />
              User Management
            </NavLink>

            <NavLink
              to="/subscription"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-lg ${
                  isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`
              }
            >
              <CreditCard className="w-5 h-5" />
              Subscription
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <NotificationCenter />
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="p-2 rounded-full hover:bg-gray-800"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-gray-800 text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'}
            alt={currentUser?.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate capitalize">
              {currentUser?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
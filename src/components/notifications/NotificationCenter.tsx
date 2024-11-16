import React from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import NotificationList from './NotificationList';
import NotificationPreferences from './NotificationPreferences';

export default function NotificationCenter() {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showPreferences, setShowPreferences] = React.useState(false);
  const { currentUser } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();

  if (!currentUser) return null;

  const unreadCount = getUnreadCount(currentUser.id);

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button
                onClick={() => setShowPreferences(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Preferences
              </button>
            </div>
          </div>
          <NotificationList userId={currentUser.id} />
        </div>
      )}

      {showPreferences && (
        <NotificationPreferences
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
}
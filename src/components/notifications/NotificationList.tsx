import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';

interface NotificationListProps {
  userId: string;
}

export default function NotificationList({ userId }: NotificationListProps) {
  const { notifications, markAsRead } = useNotificationStore();

  const userNotifications = notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (userNotifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {userNotifications.map(notification => (
        <div
          key={notification.id}
          onClick={() => markAsRead(notification.id)}
          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
            !notification.read ? 'bg-blue-50' : ''
          }`}
        >
          <h4 className="font-medium">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
      ))}
    </div>
  );
}
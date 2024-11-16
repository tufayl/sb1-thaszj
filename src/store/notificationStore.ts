import { create } from 'zustand';
import { Notification, NotificationPreference, NotificationType } from '../types';
import { useAuthStore } from './authStore';

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  updatePreferences: (preferences: NotificationPreference) => void;
  removePreferences: (userId: string, projectId?: string) => void;
  shouldNotify: (userId: string, projectId: string, type: NotificationType) => boolean;
  getUnreadCount: (userId: string) => number;
  sendEmailNotification: (notification: Notification) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false
    };

    // Check if user should be notified
    if (get().shouldNotify(notification.userId, notification.projectId, notification.type)) {
      set(state => ({
        notifications: [newNotification, ...state.notifications]
      }));

      // Send email if user has email notifications enabled
      const user = useAuthStore.getState().getUserById(notification.userId);
      const preference = user?.notificationPreferences.find(p => 
        p.userId === notification.userId && 
        (!p.projectId || p.projectId === notification.projectId)
      );

      if (preference?.email) {
        get().sendEmailNotification(newNotification);
      }
    }
  },

  markAsRead: (notificationId) => {
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    }));
  },

  markAllAsRead: (userId) => {
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.userId === userId
          ? { ...notification, read: true }
          : notification
      )
    }));
  },

  updatePreferences: (preferences) => {
    const { updateUser } = useAuthStore.getState();
    const user = useAuthStore.getState().getUserById(preferences.userId);

    if (user) {
      const updatedPreferences = user.notificationPreferences
        .filter(p => p.projectId !== preferences.projectId)
        .concat(preferences);

      updateUser(user.id, {
        notificationPreferences: updatedPreferences
      });
    }
  },

  removePreferences: (userId, projectId) => {
    const { updateUser } = useAuthStore.getState();
    const user = useAuthStore.getState().getUserById(userId);

    if (user) {
      const updatedPreferences = user.notificationPreferences
        .filter(p => p.projectId !== projectId);

      updateUser(user.id, {
        notificationPreferences: updatedPreferences
      });
    }
  },

  shouldNotify: (userId, projectId, type) => {
    const user = useAuthStore.getState().getUserById(userId);
    if (!user) return false;

    // Check project-specific preferences first
    const projectPreference = user.notificationPreferences.find(
      p => p.projectId === projectId
    );

    if (projectPreference) {
      return projectPreference.types.includes(type);
    }

    // Fall back to global preferences
    const globalPreference = user.notificationPreferences.find(
      p => !p.projectId
    );

    return globalPreference?.types.includes(type) ?? false;
  },

  getUnreadCount: (userId) => {
    return get().notifications.filter(
      n => n.userId === userId && !n.read
    ).length;
  },

  sendEmailNotification: async (notification) => {
    // In a real application, integrate with an email service provider
    // For now, we'll just log the email content
    console.log('Sending email notification:', {
      to: useAuthStore.getState().getUserById(notification.userId)?.email,
      subject: notification.title,
      body: notification.message
    });
  }
}));
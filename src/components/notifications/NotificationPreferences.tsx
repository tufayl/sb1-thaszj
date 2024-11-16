import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStore } from '../../store';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationType } from '../../types';

interface NotificationPreferencesProps {
  onClose: () => void;
}

const NOTIFICATION_TYPES: { value: NotificationType; label: string }[] = [
  { value: 'project_update', label: 'Project Updates' },
  { value: 'task_assigned', label: 'Task Assignments' },
  { value: 'task_completed', label: 'Task Completions' },
  { value: 'document_uploaded', label: 'Document Uploads' },
  { value: 'note_added', label: 'New Notes' },
  { value: 'photo_added', label: 'New Photos' },
  { value: 'project_status_changed', label: 'Status Changes' },
  { value: 'deadline_approaching', label: 'Deadline Reminders' }
];

export default function NotificationPreferences({ onClose }: NotificationPreferencesProps) {
  const { currentUser } = useAuthStore();
  const { projects } = useStore();
  const { updatePreferences } = useNotificationStore();

  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([]);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);

  const handleSave = () => {
    if (!currentUser) return;

    updatePreferences({
      userId: currentUser.id,
      projectId: selectedProject || undefined,
      types: selectedTypes,
      email: emailEnabled,
      inApp: inAppEnabled
    });

    onClose();
  };

  if (!currentUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Specific (Optional)
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="input"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Types
            </label>
            <div className="space-y-2">
              {NOTIFICATION_TYPES.map(type => (
                <label key={type.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTypes([...selectedTypes, type.value]);
                      } else {
                        setSelectedTypes(selectedTypes.filter(t => t !== type.value));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={inAppEnabled}
                onChange={(e) => setInAppEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">In-App Notifications</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
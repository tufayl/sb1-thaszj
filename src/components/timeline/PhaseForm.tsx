import React, { useState } from 'react';
import { ProjectPhase } from '../../types';

interface PhaseFormProps {
  onSubmit: (phase: Omit<ProjectPhase, 'id'>) => void;
  onCancel: () => void;
  initialData?: ProjectPhase;
}

export default function PhaseForm({ onSubmit, onCancel, initialData }: PhaseFormProps) {
  const [formData, setFormData] = useState<Omit<ProjectPhase, 'id'>>({
    projectId: initialData?.projectId || '',
    name: initialData?.name || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    status: initialData?.status || 'planned',
    progress: initialData?.progress || 0,
    assignedUsers: initialData?.assignedUsers || [],
    color: initialData?.color || '#1a73e8',
    dependencies: initialData?.dependencies || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phase Name
        </label>
        <input
          type="text"
          required
          className="input"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            name: e.target.value
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            required
            className="input"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              startDate: e.target.value
            }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            required
            className="input"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              endDate: e.target.value
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="input"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              status: e.target.value as ProjectPhase['status']
            }))}
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Progress
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="input"
            value={formData.progress}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              progress: Number(e.target.value)
            }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <input
          type="color"
          className="h-10 w-full"
          value={formData.color}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            color: e.target.value
          }))}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Phase' : 'Add Phase'}
        </button>
      </div>
    </form>
  );
}
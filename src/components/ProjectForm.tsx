import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Project } from '../types';
import { AlertCircle } from 'lucide-react';

export default function ProjectForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addProject, clients } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get clientId from location state if coming from client detail page
  const preselectedClientId = location.state?.clientId;
  
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'documentLinks' | 'notes' | 'tasks' | 'phases' | 'photos'>>({
    clientId: preselectedClientId || '',
    name: '',
    description: '',
    status: 'planning',
    startDate: new Date().toISOString().split('T')[0],
    budget: 0,
    requirements: [],
    billingStatus: 'pending',
    assignedUsers: [],
    access: {
      readAccess: [],
      writeAccess: [],
      admin: []
    }
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Project, string>>>({});
  const [newRequirement, setNewRequirement] = useState('');

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Project, string>> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addProject(formData);
      navigate('/projects');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
      setIsSubmitting(false);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  clientId: e.target.value
                }));
                if (errors.clientId) {
                  setErrors(prev => ({ ...prev, clientId: '' }));
                }
              }}
              className={`input ${errors.clientId ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="mt-1 text-sm text-red-500">{errors.clientId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }));
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: '' }));
                }
              }}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }));
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: '' }));
                }
              }}
              className={`input ${errors.description ? 'border-red-500' : ''}`}
              rows={4}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }));
                  if (errors.startDate) {
                    setErrors(prev => ({ ...prev, startDate: '' }));
                  }
                }}
                className={`input ${errors.startDate ? 'border-red-500' : ''}`}
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget *
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    budget: Number(e.target.value)
                  }));
                  if (errors.budget) {
                    setErrors(prev => ({ ...prev, budget: '' }));
                  }
                }}
                className={`input ${errors.budget ? 'border-red-500' : ''}`}
                min="0"
                step="1000"
                required
              />
              {errors.budget && (
                <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                status: e.target.value as Project['status']
              }))}
              className="input"
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="input flex-1"
                placeholder="Add a requirement"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {formData.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        * Required fields
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../store';
import { Project } from '../types';
import DocumentLinks from './documents/DocumentLinks';
import ProjectNotes from './ProjectNotes';
import ProjectTasks from './ProjectTasks';
import ProjectPhotos from './ProjectPhotos';
import ProjectTimeline from './timeline/ProjectTimeline';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { projects, clients, updateProject } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'tasks' | 'notes' | 'photos' | 'timeline'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const project = id ? projects.find(p => p.id === id) : null;
  const client = project ? clients.find(c => c.id === project.clientId) : null;

  if (!project || !client) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">
              Project not found. The project may have been deleted or you may not have access to it.
            </p>
          </div>
          <Link to="/projects" className="mt-4 inline-block text-sm text-red-700 hover:text-red-900 underline">
            Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getBillingStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'invoiced': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    try {
      await updateProject({
        ...project,
        ...editForm
      });

      setIsEditing(false);
      setEditForm({});
    } catch (error) {
      console.error('Error updating project:', error);
      setUpdateError(error instanceof Error ? error.message : 'Failed to update project');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-gray-400" />
            <Link to={`/clients/${client.id}`} className="text-gray-600 hover:text-gray-900">
              {client.name}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/projects" className="btn btn-secondary">
            Back to Projects
          </Link>
          <button 
            onClick={() => setIsEditing(true)} 
            className="btn btn-primary"
          >
            Edit Project
          </button>
        </div>
      </div>

      {updateError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {updateError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-medium mb-4">Project Status</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Billing Status</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${getBillingStatusColor(project.billingStatus)}`}>
                {project.billingStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-medium mb-4">Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-medium mb-4">Budget</h3>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="font-medium">${project.budget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'notes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'photos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timeline
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {project.requirements.map((req, index) => (
                    <li key={index} className="text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <DocumentLinks
              links={project.documentLinks}
              onAddLink={(link) => {
                updateProject({
                  ...project,
                  documentLinks: [...project.documentLinks, { ...link, id: uuidv4() }]
                });
              }}
              onDeleteLink={(linkId) => {
                updateProject({
                  ...project,
                  documentLinks: project.documentLinks.filter(l => l.id !== linkId)
                });
              }}
              onUpdateLink={(linkId, updates) => {
                updateProject({
                  ...project,
                  documentLinks: project.documentLinks.map(l =>
                    l.id === linkId ? { ...l, ...updates } : l
                  )
                });
              }}
            />
          )}

          {activeTab === 'tasks' && (
            <ProjectTasks
              tasks={project.tasks}
              onAddTask={(task) => {
                updateProject({
                  ...project,
                  tasks: [...project.tasks, { ...task, id: uuidv4() }]
                });
              }}
              onUpdateTask={(taskId, updates) => {
                updateProject({
                  ...project,
                  tasks: project.tasks.map(t =>
                    t.id === taskId ? { ...t, ...updates } : t
                  )
                });
              }}
            />
          )}

          {activeTab === 'notes' && (
            <ProjectNotes
              notes={project.notes}
              onAddNote={(note) => {
                updateProject({
                  ...project,
                  notes: [...project.notes, { ...note, id: uuidv4() }]
                });
              }}
            />
          )}

          {activeTab === 'photos' && (
            <ProjectPhotos
              photos={project.photos}
              onAddPhoto={(photo) => {
                updateProject({
                  ...project,
                  photos: [...project.photos, { ...photo, id: uuidv4() }]
                });
              }}
            />
          )}

          {activeTab === 'timeline' && (
            <ProjectTimeline project={project} />
          )}
        </div>
      </div>
    </div>
  );
}
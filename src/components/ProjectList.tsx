import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, DollarSign } from 'lucide-react';
import { useStore } from '../store';

export default function ProjectList() {
  const { projects, clients } = useStore();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button 
          onClick={handleNewProject}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="input pl-10"
            />
          </div>
        </div>

        <div className="divide-y">
          {projects.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="p-4 hover:bg-gray-50 flex items-center gap-4 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">
                  {clients.find(c => c.id === project.clientId)?.name}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{project.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">${project.budget.toLocaleString()}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </Link>
          ))}

          {projects.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p className="mb-4">No projects found</p>
              <button
                onClick={handleNewProject}
                className="btn btn-primary"
              >
                Create your first project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
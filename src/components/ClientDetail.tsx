import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, FolderKanban } from 'lucide-react';
import { useStore } from '../store';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { clients, getClientProjects } = useStore();
  
  const client = clients.find(c => c.id === id);
  const projects = getClientProjects(id || '');

  if (!client) {
    return <div className="p-6">Client not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <Link to="/clients" className="btn btn-secondary">
          Back to Clients
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Client Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{client.company || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{client.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Projects</h2>
              <Link 
                to="/projects/new" 
                state={{ clientId: client.id }}
                className="btn btn-primary"
              >
                New Project
              </Link>
            </div>
            
            <div className="space-y-4">
              {projects.map(project => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderKanban className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-500">
                          ${project.budget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))}
              
              {projects.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No projects found for this client
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-blue-600">
                  {projects.length}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status === 'in-progress').length}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
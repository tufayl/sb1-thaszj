import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { BarChart3, Users, FolderKanban, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { clients, projects } = useStore();
  
  const totalRevenue = projects.reduce((sum, project) => sum + project.budget, 0);
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;

  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/clients" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clients</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Link>
        
        <Link to="/projects" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Projects</p>
              <p className="text-2xl font-bold">{activeProjects}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FolderKanban className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <Link to="/projects" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Projects</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {projects.slice(0, 5).map(project => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-gray-500">
                    {clients.find(c => c.id === project.clientId)?.name}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </Link>
            ))}

            {projects.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No projects found
              </p>
            )}

            {projects.length > 5 && (
              <Link
                to="/projects"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 mt-4"
              >
                View all projects
              </Link>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Clients</h2>
          <div className="space-y-4">
            {clients.slice(0, 5).map(client => (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              </Link>
            ))}

            {clients.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No clients found
              </p>
            )}

            {clients.length > 5 && (
              <Link
                to="/clients"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 mt-4"
              >
                View all clients
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
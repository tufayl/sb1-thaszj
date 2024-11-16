import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Building2, Phone, Mail } from 'lucide-react';
import { useStore } from '../store';

export default function ClientList() {
  const { clients } = useStore();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Link to="/clients/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="input pl-10"
            />
          </div>
        </div>

        <div className="divide-y">
          {clients.map(client => (
            <Link
              key={client.id}
              to={`/clients/${client.id}`}
              className="p-4 hover:bg-gray-50 flex items-center gap-6 transition-colors"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{client.name}</h3>
                {client.company && (
                  <p className="text-sm text-gray-500">{client.company}</p>
                )}
              </div>

              <div className="flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{client.email}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
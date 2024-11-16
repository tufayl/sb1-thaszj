// Update form validation
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Client } from '../types';

export default function ClientForm() {
  const navigate = useNavigate();
  const addClient = useStore(state => state.addClient);
  
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Client, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Client, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newClient: Client = {
      ...formData,
      id: crypto.randomUUID()
    };
    addClient(newClient);
    navigate('/clients');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Client</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              value={formData.name}
              onChange={e => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: '' }));
                }
              }}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                className={`input ${errors.email ? 'border-red-500' : ''}`}
                value={formData.email}
                onChange={e => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                className={`input ${errors.phone ? 'border-red-500' : ''}`}
                value={formData.phone}
                onChange={e => {
                  setFormData(prev => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) {
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              className="input"
              value={formData.company}
              onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
            <p className="mt-1 text-sm text-gray-500">Optional</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              required
              className={`input ${errors.address ? 'border-red-500' : ''}`}
              rows={3}
              value={formData.address}
              onChange={e => {
                setFormData(prev => ({ ...prev, address: e.target.value }));
                if (errors.address) {
                  setErrors(prev => ({ ...prev, address: '' }));
                }
              }}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Client
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
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Camera, Mail, Briefcase, Users } from 'lucide-react';

export default function UserProfile() {
  const { currentUser, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    position: currentUser?.position || '',
    department: currentUser?.department || '',
    avatar: currentUser?.avatar || ''
  });

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateUser(currentUser.id, formData);
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center -mt-16 gap-6">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'}
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
            
            <div className="text-center sm:text-left mt-4 sm:mt-8">
              <h1 className="text-2xl font-bold">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className="text-gray-600">{currentUser.position}</p>
            </div>
          </div>

          {!isEditing ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{currentUser.position || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{currentUser.department || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{currentUser.role}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary md:col-span-2"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      firstName: e.target.value
                    }))}
                    className="input mt-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lastName: e.target.value
                    }))}
                    className="input mt-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    className="input mt-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      position: e.target.value
                    }))}
                    className="input mt-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      department: e.target.value
                    }))}
                    className="input mt-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      avatar: e.target.value
                    }))}
                    className="input mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
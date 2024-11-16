import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { UserPlus, Key, Mail, User as UserIcon } from 'lucide-react';

export default function UserList() {
  const { users, register, resetPassword } = useAuthStore();
  const { canAddUser } = useSubscriptionStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    position: '',
    department: ''
  });

  const activeUsers = users.filter(user => user.isActive).length;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canAddUser(activeUsers)) {
      alert('User limit reached for your current subscription plan. Please upgrade to add more users.');
      return;
    }

    register({ ...formData, isActive: true });
    setShowAddModal(false);
    setFormData({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'user',
      position: '',
      department: ''
    });
  };

  const handleResetPassword = (userId: string) => {
    const newPassword = resetPassword(userId);
    setTempPassword(newPassword);
    setShowResetConfirm(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="divide-y">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs capitalize bg-gray-100">
                  {user.role}
                </span>
              </div>

              <button
                onClick={() => setShowResetConfirm(user.id)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                Reset Password
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      firstName: e.target.value
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lastName: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    role: e.target.value
                  }))}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reset this user's password? A new temporary password will be generated.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResetPassword(showResetConfirm)}
                className="btn btn-primary"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temporary Password Modal */}
      {tempPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold mb-4">Temporary Password Generated</h2>
            <p className="text-gray-600 mb-2">
              Please provide this temporary password to the user:
            </p>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-center mb-4">
              {tempPassword}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              The user should change this password upon their next login.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setTempPassword(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
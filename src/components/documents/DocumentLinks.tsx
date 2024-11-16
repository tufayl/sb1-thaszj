import React, { useState } from 'react';
import { 
  Link2, 
  FileBox, 
  FileText, 
  Cloud,
  ExternalLink,
  Trash2,
  Edit2,
  Calendar,
  User
} from 'lucide-react';
import { DocumentLink, DocumentLinkType } from '../../types';

interface DocumentLinksProps {
  links: DocumentLink[];
  onAddLink: (link: Omit<DocumentLink, 'id' | 'uploadedAt'>) => void;
  onDeleteLink: (linkId: string) => void;
  onUpdateLink: (linkId: string, updates: Partial<DocumentLink>) => void;
}

export default function DocumentLinks({ 
  links, 
  onAddLink, 
  onDeleteLink,
  onUpdateLink 
}: DocumentLinksProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<DocumentLink | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: 'other' as DocumentLinkType,
    category: '',
    description: '',
    version: ''
  });

  const getLinkIcon = (type: DocumentLinkType) => {
    switch (type) {
      case 'dropbox':
        return <FileBox className="w-5 h-5 text-blue-600" />;
      case 'google-drive':
        return <Cloud className="w-5 h-5 text-green-600" />;
      case 'onedrive':
        return <Cloud className="w-5 h-5 text-blue-500" />;
      case 'local':
        return <FileText className="w-5 h-5 text-purple-600" />;
      default:
        return <Link2 className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLink) {
      onUpdateLink(editingLink.id, formData);
      setEditingLink(null);
    } else {
      onAddLink({
        ...formData,
        uploadedBy: 'Current User' // In real app, get from auth context
      });
    }

    setFormData({
      name: '',
      url: '',
      type: 'other',
      category: '',
      description: '',
      version: ''
    });
    setShowAddModal(false);
  };

  const handleEdit = (link: DocumentLink) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      url: link.url,
      type: link.type,
      category: link.category,
      description: link.description || '',
      version: link.version || ''
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Document Links</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Link2 className="w-4 h-4" />
          Add Link
        </button>
      </div>

      <div className="space-y-3">
        {links.map(link => (
          <div
            key={link.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              {getLinkIcon(link.type)}
              <div>
                <h4 className="font-medium">{link.name}</h4>
                <p className="text-sm text-gray-500">{link.description}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(link.uploadedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {link.uploadedBy}
                  </span>
                  {link.version && (
                    <span>v{link.version}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                title="Open link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => handleEdit(link)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteLink(link.id)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No document links added yet
          </p>
        )}
      </div>

      {/* Add/Edit Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingLink ? 'Edit Document Link' : 'Add Document Link'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  required
                  className="input"
                  value={formData.url}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    url: e.target.value
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    className="input"
                    value={formData.type}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      type: e.target.value as DocumentLinkType
                    }))}
                  >
                    <option value="local">Local</option>
                    <option value="dropbox">Dropbox</option>
                    <option value="google-drive">Google Drive</option>
                    <option value="onedrive">OneDrive</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.category}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                    placeholder="e.g., Drawings"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.version}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    version: e.target.value
                  }))}
                  placeholder="e.g., 1.0"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLink(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLink ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Camera, MapPin, Calendar, X } from 'lucide-react';
import { ProjectPhoto } from '../types';

interface ProjectPhotosProps {
  photos: ProjectPhoto[];
  onAddPhoto: (photo: Omit<ProjectPhoto, 'id'>) => void;
}

export default function ProjectPhotos({ photos, onAddPhoto }: ProjectPhotosProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | null>(null);
  const [newPhoto, setNewPhoto] = useState({
    url: '',
    title: '',
    description: '',
    category: 'site-survey' as ProjectPhoto['category'],
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.url.trim() || !newPhoto.title.trim()) return;

    onAddPhoto({
      ...newPhoto,
      takenAt: new Date().toISOString()
    });

    setNewPhoto({
      url: '',
      title: '',
      description: '',
      category: 'site-survey',
      location: ''
    });
  };

  const getCategoryColor = (category: ProjectPhoto['category']) => {
    const colors = {
      'site-survey': 'bg-blue-100 text-blue-800',
      'progress': 'bg-green-100 text-green-800',
      'completion': 'bg-purple-100 text-purple-800',
      'design': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={newPhoto.url}
            onChange={(e) => setNewPhoto(prev => ({ ...prev, url: e.target.value }))}
            placeholder="Photo URL"
            className="input"
          />
          
          <select
            value={newPhoto.category}
            onChange={(e) => setNewPhoto(prev => ({ 
              ...prev, 
              category: e.target.value as ProjectPhoto['category']
            }))}
            className="input"
          >
            <option value="site-survey">Site Survey</option>
            <option value="progress">Progress</option>
            <option value="completion">Completion</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={newPhoto.title}
            onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Photo title"
            className="input"
          />
          
          <input
            type="text"
            value={newPhoto.location}
            onChange={(e) => setNewPhoto(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Location (optional)"
            className="input"
          />
        </div>

        <textarea
          value={newPhoto.description}
          onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description (optional)"
          className="input"
          rows={2}
        />

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Add Photo
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-sm font-medium truncate">{photo.title}</p>
                <span className={`inline-block px-2 py-1 mt-1 rounded-full text-xs ${getCategoryColor(photo.category)}`}>
                  {photo.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedPhoto.title}</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="aspect-video relative">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="mt-4 space-y-3">
                {selectedPhoto.description && (
                  <p className="text-gray-600">{selectedPhoto.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(selectedPhoto.category)}`}>
                    {selectedPhoto.category}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedPhoto.takenAt).toLocaleDateString()}</span>
                  </div>
                  
                  {selectedPhoto.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedPhoto.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
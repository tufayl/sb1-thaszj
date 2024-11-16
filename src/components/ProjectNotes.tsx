import React, { useState } from 'react';
import { MessageSquarePlus, AlertCircle, Flag, CheckCircle2 } from 'lucide-react';
import { ProjectNote } from '../types';

interface ProjectNotesProps {
  notes: ProjectNote[];
  onAddNote: (note: Omit<ProjectNote, 'id'>) => void;
}

export default function ProjectNotes({ notes, onAddNote }: ProjectNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<ProjectNote['type']>('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    onAddNote({
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      type: noteType
    });

    setNewNote('');
    setNoteType('general');
  };

  const getNoteIcon = (type: ProjectNote['type']) => {
    switch (type) {
      case 'issue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'milestone':
        return <Flag className="w-5 h-5 text-purple-500" />;
      case 'update':
        return <MessageSquarePlus className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  const getNoteTypeClass = (type: ProjectNote['type']) => {
    switch (type) {
      case 'issue':
        return 'bg-red-50 border-red-100';
      case 'milestone':
        return 'bg-purple-50 border-purple-100';
      case 'update':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-green-50 border-green-100';
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value as ProjectNote['type'])}
            className="input w-40"
          >
            <option value="general">General</option>
            <option value="update">Update</option>
            <option value="issue">Issue</option>
            <option value="milestone">Milestone</option>
          </select>
          
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="input flex-1"
          />
          
          <button type="submit" className="btn btn-primary">
            Add Note
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-4 rounded-lg border ${getNoteTypeClass(note.type)}`}
          >
            <div className="flex items-start gap-3">
              {getNoteIcon(note.type)}
              <div className="flex-1">
                <p className="text-gray-800">{note.content}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span>{note.createdBy}</span>
                  <span>•</span>
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {notes.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No notes added yet
          </p>
        )}
      </div>
    </div>
  );
}
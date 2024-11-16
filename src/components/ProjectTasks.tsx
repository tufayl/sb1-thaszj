import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Flag
} from 'lucide-react';
import { Task } from '../types';

interface ProjectTasksProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export default function ProjectTasks({ tasks, onAddTask, onUpdateTask }: ProjectTasksProps) {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Task, string>> = {};

    if (!newTask.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onAddTask({
      ...newTask,
      status: 'todo',
      createdAt: new Date().toISOString()
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'review':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => {
                setNewTask(prev => ({ ...prev, title: e.target.value }));
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: '' }));
                }
              }}
              placeholder="Enter task title"
              className={`input ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask(prev => ({ 
                ...prev, 
                priority: e.target.value as Task['priority'] 
              }))}
              className="input"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Task description"
              className="input"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </div>

        <div className="text-sm text-gray-500">
          * Required fields
        </div>
      </form>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <button
                onClick={() => onUpdateTask(task.id, {
                  status: task.status === 'completed' ? 'todo' : 'completed'
                })}
                className="mt-1"
              >
                {getStatusIcon(task.status)}
              </button>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{task.title}</h3>
                  {getPriorityBadge(task.priority)}
                </div>
                
                <p className="text-gray-600 mt-1">{task.description}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {task.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{task.assignedTo}</span>
                    </div>
                  )}
                  
                  {task.phaseId && (
                    <div className="flex items-center gap-1">
                      <Flag className="w-4 h-4" />
                      <span>Phase: {task.phaseId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No tasks added yet
          </p>
        )}
      </div>
    </div>
  );
}
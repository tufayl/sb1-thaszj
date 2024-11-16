import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Client, Project, DocumentLink } from './types';
import { projectService } from './services/projectService';
import { isSupabaseEnabled } from './lib/supabase';

interface Store {
  clients: Client[];
  projects: Project[];
  setInitialData: (data: { clients: Client[], projects: Project[] }) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  getClientProjects: (clientId: string) => Project[];
}

// Initial demo data
const initialProjects: Project[] = [
  {
    id: uuidv4(),
    clientId: uuidv4(),
    name: 'Riverside Commercial Complex',
    description: 'Modern commercial complex with riverside views',
    status: 'in-progress',
    startDate: '2024-01-15',
    budget: 8500000,
    billingStatus: 'pending',
    requirements: [
      'Sustainable design features',
      'River-facing offices',
      'Underground parking'
    ],
    documentLinks: [],
    assignedUsers: [],
    access: {
      readAccess: [],
      writeAccess: [],
      admin: []
    },
    notes: [],
    tasks: [],
    phases: [],
    photos: []
  }
];

const initialClients: Client[] = [
  {
    id: uuidv4(),
    name: 'Sarah Johnson',
    email: 'sarah.johnson@modernspaces.com',
    phone: '+44 20 1234 5678',
    company: 'Modern Spaces Ltd',
    address: '123 Business Park, London, UK'
  }
];

export const useStore = create<Store>((set, get) => ({
  clients: initialClients,
  projects: initialProjects,
  
  setInitialData: (data) => set(data),

  addClient: (clientData) => {
    const newClient: Client = {
      ...clientData,
      id: uuidv4()
    };
    
    set((state) => ({
      clients: [...state.clients, newClient]
    }));
  },
  
  addProject: async (projectData) => {
    try {
      let newProject: Project;
      
      if (isSupabaseEnabled()) {
        const result = await projectService.createProject(projectData);
        if (!result) {
          throw new Error('Failed to create project in Supabase');
        }
        newProject = result;
      } else {
        newProject = {
          ...projectData,
          id: uuidv4(),
          documentLinks: [],
          notes: [],
          tasks: [],
          phases: [],
          photos: []
        };
      }

      set(state => ({
        projects: [...state.projects, newProject]
      }));
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },
  
  updateProject: async (project) => {
    try {
      let updatedProject: Project;
      
      if (isSupabaseEnabled()) {
        const result = await projectService.updateProject(project.id, project);
        if (!result) {
          throw new Error('Failed to update project in Supabase');
        }
        updatedProject = result;
      } else {
        updatedProject = project;
      }
      
      set(state => ({
        projects: state.projects.map(p =>
          p.id === project.id ? updatedProject : p
        )
      }));
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },
  
  getClientProjects: (clientId) => {
    return get().projects.filter(project => project.clientId === clientId);
  }
}));
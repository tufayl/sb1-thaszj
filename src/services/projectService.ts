import { supabase, isSupabaseEnabled, validateSupabaseConnection } from '../lib/supabase';
import { Project } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectError extends Error {
  code?: string;
  details?: unknown;
}

export const projectService = {
  async createProject(projectData: Omit<Project, 'id'>) {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase not configured or invalid');
    }

    try {
      const connectionStatus = await validateSupabaseConnection();
      if (!connectionStatus.success) {
        throw new Error(`Supabase connection failed: ${connectionStatus.error}`);
      }

      if (!supabase) {
        throw new Error('Supabase client is null');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user');

      const projectId = uuidv4();

      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          id: projectId,
          client_id: projectData.clientId,
          name: projectData.name,
          description: projectData.description,
          status: projectData.status.toLowerCase(),
          start_date: projectData.startDate,
          budget: projectData.budget,
          billing_status: projectData.billingStatus.toLowerCase(),
          created_by: user.id
        }])
        .select()
        .single();

      if (projectError) {
        const error = new Error('Failed to create project') as ProjectError;
        error.code = projectError.code;
        error.details = projectError;
        throw error;
      }

      // Grant admin access to the creator
      const { error: accessError } = await supabase
        .from('project_access')
        .insert([{
          project_id: projectId,
          user_id: user.id,
          access_type: 'admin'
        }]);

      if (accessError) {
        const error = new Error('Failed to set project access') as ProjectError;
        error.code = accessError.code;
        error.details = accessError;
        throw error;
      }

      // Insert requirements if any
      if (projectData.requirements?.length > 0) {
        const { error: reqError } = await supabase
          .from('project_requirements')
          .insert(
            projectData.requirements.map(req => ({
              project_id: projectId,
              requirement: req
            }))
          );

        if (reqError) {
          const error = new Error('Failed to add project requirements') as ProjectError;
          error.code = reqError.code;
          error.details = reqError;
          throw error;
        }
      }

      // Return the complete project object
      return {
        id: projectId,
        clientId: projectData.clientId,
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        startDate: projectData.startDate,
        budget: projectData.budget,
        billingStatus: projectData.billingStatus,
        requirements: projectData.requirements || [],
        documentLinks: [],
        assignedUsers: [],
        access: {
          readAccess: [],
          writeAccess: [],
          admin: [user.id]
        },
        notes: [],
        tasks: [],
        phases: [],
        photos: []
      };
    } catch (error) {
      const projectError = error as ProjectError;
      throw new Error(`Project creation failed: ${projectError.message}`);
    }
  },

  async getProject(projectId: string) {
    if (!isSupabaseEnabled() || !supabase) {
      throw new Error('Supabase not configured or invalid');
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user');

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          project_requirements (requirement),
          project_access (user_id, access_type),
          project_notes (*),
          project_tasks (*),
          project_phases (*),
          project_photos (*)
        `)
        .eq('id', projectId)
        .single();

      if (projectError) {
        const error = new Error('Failed to fetch project') as ProjectError;
        error.code = projectError.code;
        error.details = projectError;
        throw error;
      }

      if (!project) {
        throw new Error('Project not found');
      }

      // Check if user has access
      const hasAccess = project.project_access.some(
        (access: { user_id: string }) => access.user_id === user.id
      );

      if (!hasAccess) {
        throw new Error('User does not have access to this project');
      }

      return project;
    } catch (error) {
      const projectError = error as ProjectError;
      throw new Error(`Project fetch failed: ${projectError.message}`);
    }
  },

  async updateProject(projectId: string, updates: Partial<Project>) {
    if (!isSupabaseEnabled() || !supabase) {
      throw new Error('Supabase not configured or invalid');
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user');

      // Update project
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          name: updates.name,
          description: updates.description,
          status: updates.status?.toLowerCase(),
          start_date: updates.startDate,
          budget: updates.budget,
          billing_status: updates.billingStatus?.toLowerCase(),
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (updateError) {
        const error = new Error('Failed to update project') as ProjectError;
        error.code = updateError.code;
        error.details = updateError;
        throw error;
      }

      // Update requirements if changed
      if (updates.requirements) {
        // First delete existing requirements
        await supabase
          .from('project_requirements')
          .delete()
          .eq('project_id', projectId);

        // Then insert new ones
        if (updates.requirements.length > 0) {
          const { error: reqError } = await supabase
            .from('project_requirements')
            .insert(
              updates.requirements.map(req => ({
                project_id: projectId,
                requirement: req
              }))
            );

          if (reqError) {
            const error = new Error('Failed to update project requirements') as ProjectError;
            error.code = reqError.code;
            error.details = reqError;
            throw error;
          }
        }
      }

      // Fetch and return the updated project
      return this.getProject(projectId);
    } catch (error) {
      const projectError = error as ProjectError;
      throw new Error(`Project update failed: ${projectError.message}`);
    }
  }
};
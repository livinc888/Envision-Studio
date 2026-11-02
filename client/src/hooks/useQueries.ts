import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Project, type ProjectDetail, type Task, type DashboardSummary, ApiClientError } from '../services/api';
import { useToast } from '../components/common/Toast';

export const queryKeys = {
  projects: (status?: string) => ['projects', { status: status || 'All' }] as const,
  project: (id: number) => ['project', id] as const,
  tasks: (projectId: number) => ['tasks', projectId] as const,
  summary: ['summary'] as const
};

// 1. Projects Query
export function useProjects(status?: string) {
  return useQuery<Project[], ApiClientError>({
    queryKey: queryKeys.projects(status),
    queryFn: ({ signal }) => api.getProjects(status, signal)
  });
}

// 2. Project Detail Query
export function useProject(id: number) {
  return useQuery<ProjectDetail, ApiClientError>({
    queryKey: queryKeys.project(id),
    queryFn: ({ signal }) => api.getProjectById(id, signal),
    enabled: !isNaN(id) && id > 0
  });
}

// 3. Project Tasks Query
export function useProjectTasks(projectId: number) {
  return useQuery<Task[], ApiClientError>({
    queryKey: queryKeys.tasks(projectId),
    queryFn: ({ signal }) => api.getProjectTasks(projectId, signal),
    enabled: !isNaN(projectId) && projectId > 0
  });
}

// 4. Dashboard Summary Query
export function useDashboardSummary() {
  return useQuery<DashboardSummary, ApiClientError>({
    queryKey: queryKeys.summary,
    queryFn: ({ signal }) => api.getDashboardSummary(signal)
  });
}

// 5. Create Project Mutation
export function useCreateProject() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: { title: string; description: string; status: string; deadline: string }) =>
      api.createProject(data),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      toast.success('Project Created', `PRJ-${String(newProject.id).padStart(3, '0')} has been added.`);
    },
    onError: (err: ApiClientError) => {
      toast.error('Failed to Create Project', err.message);
    }
  });
}

// 6. Update Project Mutation
export function useUpdateProject(id: number) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Partial<{ title: string; description: string; status: string; deadline: string }>) =>
      api.updateProject(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      toast.success('Project Updated', `PRJ-${String(updated.id).padStart(3, '0')} changes saved.`);
    },
    onError: (err: ApiClientError) => {
      toast.error('Failed to Update Project', err.message);
    }
  });
}

// 7. Delete Project Mutation
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => api.deleteProject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      toast.success('Project Deleted', `PRJ-${String(id).padStart(3, '0')} and all associated tasks removed.`);
    },
    onError: (err: ApiClientError) => {
      toast.error('Failed to Delete Project', err.message);
    }
  });
}

// 8. Create Task Mutation
export function useCreateTask(projectId: number) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: { title: string; description?: string; status?: string; completed?: boolean }) =>
      api.createTask(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      toast.success('Task Added', 'New execution milestone created.');
    },
    onError: (err: ApiClientError) => {
      toast.error('Failed to Create Task', err.message);
    }
  });
}

// 9. Update Task Mutation
export function useUpdateTask(projectId: number) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: Partial<{ title: string; description: string; status: string; completed: boolean }> }) =>
      api.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      toast.success('Task Updated', 'Milestone details updated.');
    },
    onError: (err: ApiClientError) => {
      toast.error('Failed to Update Task', err.message);
    }
  });
}

// 10. Optimistic Toggle Task Mutation (Rule: optimistic update with snapshot rollback & error toast)
export function useToggleTask(projectId: number) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ taskId, completed }: { taskId: number; completed: boolean }) =>
      api.updateTask(taskId, { completed }),

    // Optimistic Update Before Mutation
    onMutate: async ({ taskId, completed }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.project(projectId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks(projectId) });

      // Snapshot previous value
      const previousProject = queryClient.getQueryData<ProjectDetail>(queryKeys.project(projectId));

      // Optimistically update project in cache
      if (previousProject) {
        const updatedTasks = previousProject.tasks.map((t) =>
          t.id === taskId
            ? { ...t, completed, status: (completed ? 'Completed' : 'Pending') as 'Completed' | 'Pending' }
            : t
        );
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0;

        queryClient.setQueryData<ProjectDetail>(queryKeys.project(projectId), {
          ...previousProject,
          tasks: updatedTasks,
          completedTaskCount: completedCount,
          progress
        });
      }

      return { previousProject };
    },

    // If mutation fails, rollback to snapshot!
    onError: (err: ApiClientError, _, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(queryKeys.project(projectId), context.previousProject);
      }
      toast.error('Failed to Update Task', err.message || 'Rollback applied.');
    },

    // Always refetch to stay in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
    }
  });
}

// 11. Delete Task Mutation
export function useDeleteTask(projectId: number) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (taskId: number) => api.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      toast.success('Task Deleted', 'Milestone removed.');
    },
    onError: (err: ApiClientError) => {
      toast.error('Failed to Delete Task', err.message);
    }
  });
}

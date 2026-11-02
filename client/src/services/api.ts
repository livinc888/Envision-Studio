export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  deadline: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  completedTaskCount: number;
  progress: number;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail extends Project {
  tasks: Task[];
}

export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  totalTasks: number;
  overallCompletionRate: number;
  upcomingDeadlines: Project[];
  activeProjectsList: Project[];
}

export interface FieldError {
  field: string;
  message: string;
}

export class ApiClientError extends Error {
  status: number;
  fieldErrors: FieldError[];

  constructor(status: number, message: string, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, options?: RequestInit & { timeoutMs?: number }): Promise<T> {
    const timeoutMs = options?.timeoutMs || 10000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Merge abort signals if external signal is provided
    if (options?.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options,
        signal: controller.signal
      });

      if (!res.ok) {
        let errorMessage = `API request failed with status ${res.status}`;
        let fieldErrors: FieldError[] = [];

        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          if (Array.isArray(errorData.details)) {
            fieldErrors = errorData.details;
          }
        } catch {
          // If response body isn't JSON, retain fallback status text
        }

        throw new ApiClientError(res.status, errorMessage, fieldErrors);
      }

      // Handle 204 No Content
      if (res.status === 204) {
        return null as unknown as T;
      }

      return (await res.json()) as T;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new ApiClientError(408, 'Request timed out after 10 seconds. Please try again.');
      }
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError(500, err.message || 'Network connection failed. Please check your connection.');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Projects
  async getProjects(status?: string, signal?: AbortSignal): Promise<Project[]> {
    const query = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<Project[]>(`/projects${query}`, { signal });
  }

  async getProjectById(id: number, signal?: AbortSignal): Promise<ProjectDetail> {
    return this.request<ProjectDetail>(`/projects/${id}`, { signal });
  }

  async createProject(
    data: { title: string; description: string; status: string; deadline: string },
    signal?: AbortSignal
  ): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
      signal
    });
  }

  async updateProject(
    id: number,
    data: Partial<{ title: string; description: string; status: string; deadline: string }>,
    signal?: AbortSignal
  ): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      signal
    });
  }

  async deleteProject(id: number, signal?: AbortSignal): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/projects/${id}`, {
      method: 'DELETE',
      signal
    });
  }

  // Tasks
  async getProjectTasks(projectId: number, signal?: AbortSignal): Promise<Task[]> {
    return this.request<Task[]>(`/projects/${projectId}/tasks`, { signal });
  }

  async createTask(
    projectId: number,
    data: { title: string; description?: string; status?: string; completed?: boolean },
    signal?: AbortSignal
  ): Promise<Task> {
    return this.request<Task>(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
      signal
    });
  }

  async updateTask(
    taskId: number,
    data: Partial<{ title: string; description: string; status: string; completed: boolean }>,
    signal?: AbortSignal
  ): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      signal
    });
  }

  async deleteTask(taskId: number, signal?: AbortSignal): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/tasks/${taskId}`, {
      method: 'DELETE',
      signal
    });
  }

  // Dashboard Summary
  async getDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
    return this.request<DashboardSummary>('/dashboard/summary', { signal });
  }

  // Health
  async getHealth(signal?: AbortSignal): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health', { signal });
  }
}

export const api = new ApiService();

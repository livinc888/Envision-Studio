import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { getNextSequence } from '../models/Counter.js';
import type { CreateProjectInput, UpdateProjectInput } from '../validators/schemas.js';

export interface ProjectWithStats {
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

export interface TaskRecord {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail extends ProjectWithStats {
  tasks: TaskRecord[];
}

export class ProjectsService {
  async getAll(status?: string): Promise<ProjectWithStats[]> {
    const pipeline: any[] = [];
    if (status) {
      pipeline.push({ $match: { status } });
    }
    pipeline.push(
      {
        $lookup: {
          from: 'tasks',
          localField: 'id',
          foreignField: 'projectId',
          as: 'tasks'
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          title: 1,
          description: 1,
          status: 1,
          deadline: 1,
          createdAt: 1,
          updatedAt: 1,
          taskCount: { $size: '$tasks' },
          completedTaskCount: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 't',
                cond: {
                  $or: [
                    { $eq: ['$$t.status', 'Completed'] },
                    { $eq: ['$$t.completed', true] }
                  ]
                }
              }
            }
          }
        }
      },
      { $sort: { id: 1 } }
    );

    const rows = await Project.aggregate(pipeline);

    return rows.map((r: any) => {
      const taskCount = Number(r.taskCount) || 0;
      const completedTaskCount = Number(r.completedTaskCount) || 0;
      const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        status: r.status,
        deadline: r.deadline,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt || new Date().toISOString()),
        updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt || new Date().toISOString()),
        taskCount,
        completedTaskCount,
        progress
      };
    });
  }

  async getById(id: number): Promise<ProjectDetail | null> {
    const project = await Project.findOne({ id }).lean();
    if (!project) return null;

    const taskRows = await Task.find({ projectId: id }).sort({ id: 1 }).lean();
    const tasks: TaskRecord[] = taskRows.map((t: any) => ({
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      description: t.description || '',
      status: t.status,
      completed: Boolean(t.completed || t.status === 'Completed'),
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt || new Date().toISOString()),
      updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : String(t.updatedAt || new Date().toISOString())
    }));

    const taskCount = tasks.length;
    const completedTaskCount = tasks.filter((t) => t.completed).length;
    const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

    return {
      id: (project as any).id,
      title: (project as any).title,
      description: (project as any).description,
      status: (project as any).status,
      deadline: (project as any).deadline,
      createdAt: (project as any).createdAt instanceof Date ? (project as any).createdAt.toISOString() : String((project as any).createdAt || new Date().toISOString()),
      updatedAt: (project as any).updatedAt instanceof Date ? (project as any).updatedAt.toISOString() : String((project as any).updatedAt || new Date().toISOString()),
      taskCount,
      completedTaskCount,
      progress,
      tasks
    };
  }

  async create(data: CreateProjectInput): Promise<ProjectWithStats> {
    const newId = await getNextSequence('projectId');
    const now = new Date();
    const project = await Project.create({
      id: newId,
      title: data.title,
      description: data.description,
      status: data.status,
      deadline: data.deadline
    });

    return {
      id: newId,
      title: data.title,
      description: data.description,
      status: data.status,
      deadline: data.deadline,
      createdAt: project.createdAt ? project.createdAt.toISOString() : now.toISOString(),
      updatedAt: project.updatedAt ? project.updatedAt.toISOString() : now.toISOString(),
      taskCount: 0,
      completedTaskCount: 0,
      progress: 0
    };
  }

  async update(id: number, data: UpdateProjectInput): Promise<ProjectWithStats | null> {
    const existing = await Project.findOne({ id });
    if (!existing) return null;

    if (data.title !== undefined) existing.title = data.title;
    if (data.description !== undefined) existing.description = data.description;
    if (data.status !== undefined) existing.status = data.status;
    if (data.deadline !== undefined) existing.deadline = data.deadline;

    await existing.save();
    return this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await Project.findOneAndDelete({ id });
    if (!result) return false;

    // Cascade delete tasks
    await Task.deleteMany({ projectId: id });
    return true;
  }
}

export const projectsService = new ProjectsService();

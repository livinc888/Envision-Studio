import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { projectsService, type ProjectWithStats } from './projectsService.js';

export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  totalTasks: number;
  overallCompletionRate: number;
  upcomingDeadlines: ProjectWithStats[];
  activeProjectsList: ProjectWithStats[];
}

export class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'Active' });

    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$status', 'Completed'] },
                    { $eq: ['$completed', true] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const totalTasks = taskStats[0]?.totalTasks || 0;
    const completedTasks = taskStats[0]?.completedTasks || 0;
    const pendingTasks = totalTasks - completedTasks;
    const overallCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const allProjects = await projectsService.getAll();
    const activeProjectsList = allProjects.filter((p) => p.status === 'Active');

    // Upcoming deadlines: sort by deadline ascending (excluding Completed projects)
    const upcomingDeadlines = [...allProjects]
      .filter((p) => p.status !== 'Completed')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);

    return {
      totalProjects,
      activeProjects,
      completedTasks,
      pendingTasks,
      totalTasks,
      overallCompletionRate,
      upcomingDeadlines,
      activeProjectsList
    };
  }
}

export const dashboardService = new DashboardService();

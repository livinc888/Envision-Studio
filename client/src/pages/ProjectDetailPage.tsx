import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
  useCreateTask,
  useToggleTask,
  useUpdateTask,
  useDeleteTask
} from '../hooks/useQueries';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { TaskPanel } from '../components/dashboard/TaskPanel';
import { ProjectFormDrawer } from '../components/dashboard/ProjectFormDrawer';
import { DeleteProjectModal } from '../components/dashboard/DeleteProjectModal';
import { ArrowLeft, Calendar, Edit2, Trash2, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || '', 10);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // TanStack Query Hooks
  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch
  } = useProject(projectId);

  const updateProjectMutation = useUpdateProject(projectId);
  const deleteProjectMutation = useDeleteProject();

  const createTaskMutation = useCreateTask(projectId);
  const toggleTaskMutation = useToggleTask(projectId);
  const updateTaskMutation = useUpdateTask(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);

  // Project Actions
  const handleUpdateProject = async (data: any) => {
    await updateProjectMutation.mutateAsync(data);
    setIsEditDrawerOpen(false);
  };

  const handleDeleteProject = async () => {
    await deleteProjectMutation.mutateAsync(projectId);
    navigate('/app/projects');
  };

  // Task Actions (with Optimistic Toggle)
  const handleAddTask = async (taskData: any) => {
    await createTaskMutation.mutateAsync(taskData);
  };

  const handleToggleTask = async (taskId: number, currentCompleted: boolean) => {
    await toggleTaskMutation.mutateAsync({
      taskId,
      completed: !currentCompleted
    });
  };

  const handleUpdateTask = async (taskId: number, data: any) => {
    await updateTaskMutation.mutateAsync({ taskId, data });
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTaskMutation.mutateAsync(taskId);
  };

  const getDaysRemaining = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)} days overdue`;
    if (diff === 0) return 'Due today';
    return `${diff} days remaining`;
  };

  if (isLoading) {
    return (
      <DashboardShell title="Loading Project...">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </DashboardShell>
    );
  }

  if (isError || !project) {
    return (
      <DashboardShell title="Project Not Found">
        <div className="p-12 text-center rounded-2xl bg-studio-cardDark border border-white/10 flex flex-col items-center justify-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-studio-red">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {error?.message || 'Project Record Unavailable'}
            </h3>
            <p className="text-xs text-zinc-400 font-sans max-w-sm">
              The project record you requested might have been deleted, moved, or the ID is invalid.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link to="/app/projects">
              <Button size="sm" variant="secondary">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Return to Directory
              </Button>
            </Link>
            <Button size="sm" variant="danger" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const daysStr = getDaysRemaining(project.deadline);
  const isOverdue = daysStr.includes('overdue');

  return (
    <DashboardShell
      title={project.title}
      subtitle={`PRJ-${String(project.id).padStart(3, '0')} • Client Deliverables Spec`}
      breadcrumbs={[
        { label: 'App', href: '/app' },
        { label: 'Projects', href: '/app/projects' },
        { label: `PRJ-${String(project.id).padStart(3, '0')}` }
      ]}
    >
      {/* Top Action Back Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/app/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all projects
        </Link>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setIsEditDrawerOpen(true)}>
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>

          <Button size="sm" variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-studio-cardDark border border-white/10 shadow-card-dark mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-zinc-400">
                PRJ-{String(project.id).padStart(3, '0')}
              </span>
              <Badge status={project.status} />
              {isOverdue && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] font-mono text-red-400 font-bold uppercase">
                  Overdue
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{project.title}</h2>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-sans max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="flex items-center gap-4 shrink-0 bg-white/5 p-4 rounded-xl border border-white/10">
            {/* Circular Progress Ring */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#26262B" strokeWidth="5" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#E5322B"
                  strokeWidth="5"
                  strokeDasharray={163.3}
                  strokeDashoffset={163.3 - (163.3 * project.progress) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-white">
                {project.progress}%
              </span>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="text-white font-semibold">
                {project.completedTaskCount} of {project.taskCount} Tasks
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                <Clock className="w-3 h-3" />
                <span className={isOverdue ? 'text-red-400 font-semibold' : ''}>{daysStr}</span>
              </div>
              <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Due {project.deadline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Panel */}
      <TaskPanel
        projectId={projectId}
        tasks={project.tasks}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Edit Drawer */}
      <ProjectFormDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onSubmit={handleUpdateProject}
        initialData={project}
        isLoading={updateProjectMutation.isPending}
        serverError={updateProjectMutation.error?.message}
      />

      {/* Delete Modal */}
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        project={project}
        onConfirm={handleDeleteProject}
      />
    </DashboardShell>
  );
};

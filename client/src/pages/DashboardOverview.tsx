import React, { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardSummary, useProjects, useCreateProject } from '../hooks/useQueries';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { ConstellationFallback } from '../components/dashboard/ConstellationFallback';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Calendar, ArrowUpRight, AlertCircle, RefreshCw, Layers, Orbit } from 'lucide-react';
import { ProjectFormDrawer } from '../components/dashboard/ProjectFormDrawer';

// Lazy-load Three.js Constellation
const Constellation3DCanvas = lazy(() =>
  import('../components/three/Constellation3DCanvas').then((mod) => ({
    default: mod.Constellation3DCanvas
  }))
);

export const DashboardOverview: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [constellationMode, setConstellationMode] = useState<'3d' | 'list'>('3d');

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary
  } = useDashboardSummary();

  const {
    data: allProjects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
    refetch: refetchProjects
  } = useProjects();

  const createProjectMutation = useCreateProject();

  const isLoading = isSummaryLoading || isProjectsLoading;
  const isError = isSummaryError || isProjectsError;
  const errorMessage = summaryError?.message || projectsError?.message || 'Failed to connect to EnvisionStudio API';

  const handleCreateProject = async (data: any) => {
    await createProjectMutation.mutateAsync(data);
    setIsDrawerOpen(false);
  };

  const refetchAll = () => {
    refetchSummary();
    refetchProjects();
  };

  const getDaysRemaining = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return 'Due today';
    return `${diff}d left`;
  };

  return (
    <DashboardShell
      title="Studio Overview"
      subtitle="Agency project operations, milestone velocity & resource allocation"
      onNewProject={() => setIsDrawerOpen(true)}
    >
      {/* Error State with Retry Button */}
      {isError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4 text-red-400">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
          <Button size="sm" variant="danger" onClick={refetchAll}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* 4 Summary Counters */}
      <MetricsGrid summary={summary || null} loading={isLoading} />

      {/* Constellation Section with Mode Switcher (3D vs List Fallback) */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-studio-red" />
            <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
              Project Constellation Visualizer
            </h3>
          </div>

          {/* 3D vs List Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setConstellationMode('3d')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                constellationMode === '3d'
                  ? 'bg-studio-red text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>3D Orbit</span>
            </button>
            <button
              onClick={() => setConstellationMode('list')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                constellationMode === 'list'
                  ? 'bg-studio-red text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>List Fallback</span>
            </button>
          </div>
        </div>

        {constellationMode === '3d' ? (
          <Suspense
            fallback={
              <div className="w-full h-[360px] rounded-2xl bg-[#0B0B0D] border border-white/10 flex items-center justify-center text-zinc-500 font-mono text-xs">
                Initializing 3D Constellation Nodes...
              </div>
            }
          >
            <Constellation3DCanvas projects={allProjects} />
          </Suspense>
        ) : (
          <ConstellationFallback projects={allProjects} />
        )}
      </div>

      {/* Two Column Grid: Upcoming Deadlines & Active Projects Pipeline */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-studio-cardDark border border-white/10 shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-studio-red" />
                <h3 className="text-sm font-semibold tracking-tight text-white uppercase font-mono">
                  Upcoming Milestones
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-mono">Earliest First</span>
            </div>

            <div className="mt-4 divide-y divide-white/5">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="py-3 flex items-center justify-between animate-pulse">
                    <div className="h-4 w-32 bg-white/5 rounded" />
                    <div className="h-4 w-16 bg-white/5 rounded" />
                  </div>
                ))
              ) : summary?.upcomingDeadlines && summary.upcomingDeadlines.length > 0 ? (
                summary.upcomingDeadlines.map((p) => {
                  const daysStr = getDaysRemaining(p.deadline);
                  const isOverdue = daysStr.includes('overdue');
                  return (
                    <Link
                      key={p.id}
                      to={`/app/projects/${p.id}`}
                      className="py-3 flex items-center justify-between gap-3 group hover:px-1 transition-all"
                    >
                      <div className="space-y-0.5 max-w-[220px]">
                        <div className="text-xs font-medium text-white group-hover:text-studio-red transition-colors truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500">
                          {p.completedTaskCount}/{p.taskCount} tasks ({p.progress}%)
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isOverdue
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-white/5 text-zinc-300'
                          }`}
                        >
                          {daysStr}
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                  No upcoming deadlines pending
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5">
            <Link
              to="/app/projects"
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center justify-between group transition-colors"
            >
              <span>Explore full delivery roadmap</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Active Projects Pipeline Table */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-studio-cardDark border border-white/10 shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-sm font-semibold tracking-tight text-white uppercase font-mono">
                Active Client Projects
              </h3>
              <Link
                to="/app/projects?status=Active"
                className="text-xs text-studio-red hover:underline font-mono"
              >
                View all ({summary?.activeProjects || 0})
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px]">
                    <th className="pb-3 font-semibold">PROJECT</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold">PROGRESS</th>
                    <th className="pb-3 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-3.5"><div className="h-4 w-36 bg-white/5 rounded" /></td>
                        <td className="py-3.5"><div className="h-4 w-16 bg-white/5 rounded" /></td>
                        <td className="py-3.5"><div className="h-4 w-24 bg-white/5 rounded" /></td>
                        <td className="py-3.5 text-right"><div className="h-4 w-8 bg-white/5 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : summary?.activeProjectsList && summary.activeProjectsList.length > 0 ? (
                    summary.activeProjectsList.slice(0, 5).map((project) => (
                      <tr key={project.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-3">
                          <Link
                            to={`/app/projects/${project.id}`}
                            className="font-medium text-white group-hover:text-studio-red transition-colors block truncate max-w-[200px]"
                          >
                            {project.title}
                          </Link>
                          <span className="text-[10px] font-mono text-zinc-500">
                            PRJ-{String(project.id).padStart(3, '0')}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3">
                          <Badge status={project.status} size="sm" />
                        </td>
                        <td className="py-3.5 pr-3 font-mono">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-studio-red transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-zinc-400">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to={`/app/projects/${project.id}`}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
                            title="Inspect Project"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500 font-mono">
                        No active projects currently
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over New Project Form Drawer */}
      <ProjectFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateProject}
        isLoading={createProjectMutation.isPending}
        serverError={createProjectMutation.error?.message}
      />
    </DashboardShell>
  );
};

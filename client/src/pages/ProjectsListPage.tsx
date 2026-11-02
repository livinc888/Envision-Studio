import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useQueries';
import { type Project } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { ProjectTable } from '../components/dashboard/ProjectTable';
import { ProjectGrid } from '../components/dashboard/ProjectGrid';
import { ProjectFormDrawer } from '../components/dashboard/ProjectFormDrawer';
import { DeleteProjectModal } from '../components/dashboard/DeleteProjectModal';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { Search, LayoutGrid, List, RefreshCw, AlertCircle, FolderX, X } from 'lucide-react';

export const ProjectsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL State
  const statusParam = searchParams.get('status') || 'All';
  const searchParam = searchParams.get('search') || '';
  const viewParam = (searchParams.get('view') as 'table' | 'grid') || 'table';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);

  // Drawer & Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // TanStack Query Hooks
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
    refetch
  } = useProjects();

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject(editingProject?.id || 0);
  const deleteMutation = useDeleteProject();

  // 250ms Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (searchInput.trim()) {
          next.set('search', searchInput.trim());
        } else {
          next.delete('search');
        }
        return next;
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput, setSearchParams]);

  // Sync back/forward navigation with search input
  useEffect(() => {
    setSearchInput(searchParam);
    setDebouncedSearch(searchParam);
  }, [searchParam]);

  const handleStatusFilterChange = (status: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (status === 'All') {
        next.delete('status');
      } else {
        next.set('status', status);
      }
      return next;
    });
  };

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (mode === 'table') {
        next.delete('view');
      } else {
        next.set('view', mode);
      }
      return next;
    });
  };

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = statusParam === 'All' || p.status === statusParam;
      const matchesSearch =
        debouncedSearch === '' ||
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [projects, statusParam, debouncedSearch]);

  // Counts for Segmented Tabs
  const statusCounts = useMemo(() => {
    return {
      All: projects.length,
      Active: projects.filter((p) => p.status === 'Active').length,
      Completed: projects.filter((p) => p.status === 'Completed').length,
      'On Hold': projects.filter((p) => p.status === 'On Hold').length
    };
  }, [projects]);

  // Project CRUD Handlers
  const handleSaveProject = async (data: any) => {
    if (editingProject) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
    setEditingProject(null);
    setIsDrawerOpen(false);
  };

  const handleDeleteProject = async (projectId: number) => {
    await deleteMutation.mutateAsync(projectId);
    setDeletingProject(null);
  };

  const openNewProjectDrawer = () => {
    setEditingProject(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (project: Project) => {
    setEditingProject(project);
    setIsDrawerOpen(true);
  };

  return (
    <DashboardShell
      title="Project Directory"
      subtitle="Comprehensive view of all client contracts and deliverables"
      onNewProject={openNewProjectDrawer}
    >
      {/* Error State with Retry Button */}
      {isError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-4 text-red-400">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error?.message || 'Failed to load projects'}</span>
          </div>
          <Button size="sm" variant="danger" onClick={() => refetch()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Control Bar: Filter Tabs, Search & View Mode */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto no-scrollbar">
          {(['All', 'Active', 'Completed', 'On Hold'] as const).map((tab) => {
            const count = statusCounts[tab];
            const isActive = statusParam === tab;
            return (
              <button
                key={tab}
                onClick={() => handleStatusFilterChange(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-studio-red text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-white/5 text-zinc-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Search & View Switcher */}
        <div className="flex items-center gap-3">
          {/* 250ms Debounced Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-studio-red transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Table vs Grid */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
            <button
              onClick={() => handleViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewParam === 'table' ? 'bg-studio-red text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewParam === 'grid' ? 'bg-studio-red text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering: Loading / Empty / Table / Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-studio-cardDark border border-white/10 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400">
            <FolderX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-white">No Matching Projects Found</h4>
            <p className="text-xs text-zinc-400 max-w-sm font-sans">
              No projects matched the selected status &quot;{statusParam}&quot;
              {debouncedSearch && ` or search query "${debouncedSearch}"`}.
            </p>
          </div>
          {(statusParam !== 'All' || debouncedSearch) && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearchInput('');
                handleStatusFilterChange('All');
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : viewParam === 'table' ? (
        <ProjectTable
          projects={filteredProjects}
          onEdit={openEditDrawer}
          onDelete={(project) => setDeletingProject(project)}
        />
      ) : (
        <ProjectGrid
          projects={filteredProjects}
          onEdit={openEditDrawer}
          onDelete={(project) => setDeletingProject(project)}
        />
      )}

      {/* Slide-over Form Drawer (Add / Edit) */}
      <ProjectFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleSaveProject}
        initialData={editingProject}
        isLoading={createMutation.isPending || updateMutation.isPending}
        serverError={createMutation.error?.message || updateMutation.error?.message}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProjectModal
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        project={deletingProject}
        onConfirm={handleDeleteProject}
      />
    </DashboardShell>
  );
};

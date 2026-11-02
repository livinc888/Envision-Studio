import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useQueries';
import { SectionTag } from '../common/SectionTag';
import { Badge } from '../common/Badge';
import { Skeleton } from '../common/Skeleton';
import { Button } from '../common/Button';
import { ArrowUpRight, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

export const FeaturedWork: React.FC = () => {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects();

  const topProjects = projects.slice(0, 3);

  return (
    <section id="work" className="bg-white text-black py-16 md:py-24 px-6 md:px-12 w-full">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
          <div className="space-y-3">
            <SectionTag label="Selected Works" theme="light" />
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-black">
              Featured Client Engagements
            </h2>
          </div>

          <Link
            to="/app/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-black hover:text-studio-red transition-colors pb-1 border-b border-black hover:border-studio-red"
          >
            <span>View All Live ({projects.length > 0 ? projects.length : '10'}) in Dashboard</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Error State with Retry */}
        {isError && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-red-600">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">
                {error?.message || 'Failed to connect to live project database'}
              </span>
            </div>
            <Button size="sm" variant="danger" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retry Connection
            </Button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-8 border-b border-zinc-100 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 w-full max-w-xl">
                  <Skeleton className="h-5 w-32 bg-zinc-200" />
                  <Skeleton className="h-8 w-3/4 bg-zinc-200" />
                  <Skeleton className="h-4 w-full bg-zinc-200" />
                </div>
                <Skeleton className="h-10 w-28 bg-zinc-200 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Live Project Rows */}
        {!isLoading && !isError && (
          <div className="divide-y divide-zinc-200">
            {topProjects.map((project) => (
              <div
                key={project.id}
                className="py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:px-2 transition-all duration-200"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-400 font-bold">
                      PRJ-{String(project.id).padStart(3, '0')}
                    </span>
                    <Badge status={project.status} size="sm" />
                  </div>

                  <Link
                    to={`/app/projects/${project.id}`}
                    className="block font-sans text-2xl md:text-3xl font-bold tracking-tight text-black group-hover:text-studio-red transition-colors"
                  >
                    {project.title}
                  </Link>

                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-sans line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-8 shrink-0">
                  <div className="hidden sm:block text-right font-mono text-xs">
                    <div className="text-black font-semibold">
                      {project.completedTaskCount}/{project.taskCount} Tasks
                    </div>
                    <div className="text-zinc-500 text-[11px] flex items-center justify-end gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{project.deadline}</span>
                    </div>
                  </div>

                  <Link
                    to={`/app/projects/${project.id}`}
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-black text-white group-hover:bg-studio-red transition-all group-hover:scale-105"
                    title={`Inspect ${project.title}`}
                  >
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

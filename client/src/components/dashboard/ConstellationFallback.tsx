import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../services/api';
import { Badge } from '../common/Badge';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface ConstellationFallbackProps {
  projects: Project[];
}

export const ConstellationFallback: React.FC<ConstellationFallbackProps> = ({ projects }) => {
  return (
    <div className="p-6 rounded-2xl bg-studio-cardDark border border-white/10 shadow-card-dark">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-studio-red" />
          <h3 className="text-sm font-semibold tracking-tight text-white uppercase font-mono">
            Project Constellation Matrix (List Mode)
          </h3>
        </div>
        <span className="text-xs text-zinc-400 font-mono">{projects.length} Nodes Synchronized</span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/app/projects/${project.id}`}
            className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                  PRJ-{String(project.id).padStart(3, '0')}
                </span>
                <Badge status={project.status} size="sm" />
              </div>
              <h4 className="mt-2 text-sm font-medium text-white group-hover:text-studio-red transition-colors line-clamp-1">
                {project.title}
              </h4>
              <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{project.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono">
                {project.completedTaskCount}/{project.taskCount} tasks ({project.progress}%)
              </span>
              <span className="text-zinc-400 group-hover:text-white flex items-center gap-0.5">
                Inspect <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};


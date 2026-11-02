import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../services/api';
import { Badge } from '../common/Badge';
import { Edit2, Trash2, ArrowUpRight, Calendar, CheckCircle2 } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const TaskCompletionRing: React.FC<{ progress: number; status: string }> = ({ progress, status }) => {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const color =
    status === 'Completed'
      ? '#3B82F6'
      : status === 'Active'
      ? '#10B981'
      : '#F59E0B';

  return (
    <div className="relative inline-flex items-center justify-center shrink-0 w-7 h-7" title={`${progress}% completed`}>
      <svg className="w-7 h-7 -rotate-90">
        <circle
          cx="14"
          cy="14"
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx="14"
          cy="14"
          r={radius}
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[8px] font-mono font-bold text-zinc-300">
        {Math.round(progress)}
      </span>
    </div>
  );
};

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <div
          key={project.id}
          className="p-6 rounded-2xl bg-studio-cardDark border border-white/10 hover:border-white/20 transition-all duration-300 shadow-card-dark hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="font-mono text-xs text-zinc-500 font-semibold tracking-wider">
                PRJ-{String(project.id).padStart(3, '0')}
              </span>
              <Badge status={project.status} size="sm" />
            </div>

            <div className="mt-4">
              <div className="flex items-start gap-3">
                <TaskCompletionRing progress={project.progress} status={project.status} />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/app/projects/${project.id}`}
                    className="text-base font-semibold text-white group-hover:text-studio-red transition-colors line-clamp-1 block"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-zinc-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                {project.completedTaskCount} of {project.taskCount} tasks
              </span>
              <span className="text-white font-semibold">{project.progress}%</span>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  project.status === 'Completed'
                    ? 'bg-blue-500'
                    : project.status === 'Active'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* Footer with deadline and action buttons */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{project.deadline}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(project)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(project)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link
                  to={`/app/projects/${project.id}`}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Inspect"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

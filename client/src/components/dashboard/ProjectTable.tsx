import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../services/api';
import { Badge } from '../common/Badge';
import { Edit2, Trash2, ArrowUpRight, Calendar } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const TaskCompletionRing: React.FC<{ progress: number; status: string }> = ({ progress, status }) => {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const color =
    status === 'Completed'
      ? '#3B82F6'
      : status === 'Active'
      ? '#10B981'
      : '#F59E0B';

  return (
    <div className="relative inline-flex items-center justify-center shrink-0 w-6 h-6" title={`${progress}% completed`}>
      <svg className="w-6 h-6 -rotate-90">
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke={color}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>
    </div>
  );
};

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEdit, onDelete }) => {
  const getDaysRemaining = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)}d ago`;
    if (diff === 0) return 'Today';
    return `${diff}d left`;
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-studio-cardDark shadow-card-dark">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#161618] border-b border-white/10 text-xs font-mono uppercase text-zinc-400">
          <tr>
            <th className="py-3.5 px-4 font-semibold">ID</th>
            <th className="py-3.5 px-4 font-semibold">Project Title</th>
            <th className="py-3.5 px-4 font-semibold">Status</th>
            <th className="py-3.5 px-4 font-semibold">Deadline</th>
            <th className="py-3.5 px-4 font-semibold">Tasks & Progress</th>
            <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {projects.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-white/[0.03] transition-colors group"
            >
              <td className="py-4 px-4 font-mono text-xs text-zinc-400 font-medium">
                PRJ-{String(project.id).padStart(3, '0')}
              </td>

              <td className="py-4 px-4">
                <div className="flex items-center gap-2.5">
                  {/* Circular Task-Completion Ring */}
                  <TaskCompletionRing progress={project.progress} status={project.status} />

                  <div>
                    <Link
                      to={`/app/projects/${project.id}`}
                      className="font-medium text-white hover:text-studio-red transition-colors block line-clamp-1 group-hover:translate-x-0.5 duration-150"
                    >
                      {project.title}
                    </Link>
                    <span className="text-xs text-zinc-400 line-clamp-1 block mt-0.5">
                      {project.description}
                    </span>
                  </div>
                </div>
              </td>

              <td className="py-4 px-4">
                <Badge status={project.status} size="sm" />
              </td>

              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{project.deadline}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                    {getDaysRemaining(project.deadline)}
                  </span>
                </div>
              </td>

              <td className="py-4 px-4 min-w-[180px]">
                <div className="flex items-center justify-between text-xs mb-1 font-mono">
                  <span className="text-zinc-400">
                    {project.completedTaskCount}/{project.taskCount} tasks
                  </span>
                  <span className="font-semibold text-white">{project.progress}%</span>
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
              </td>

              <td className="py-4 px-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-1">
                  <Link
                    to={`/app/projects/${project.id}`}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="View Project"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => onEdit(project)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(project)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

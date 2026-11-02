import React, { useEffect, useState } from 'react';
import type { DashboardSummary } from '../../services/api';
import { Skeleton } from '../common/Skeleton';
import { FolderKanban, CheckCircle2, Clock, Activity } from 'lucide-react';

interface MetricsGridProps {
  summary: DashboardSummary | null;
  loading: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ summary, loading }) => {
  // Animated count-up values for all 4 cards
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!summary) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTotalCount(summary.totalProjects);
      setActiveCount(summary.activeProjects);
      setCompletedCount(summary.completedTasks);
      setPendingCount(summary.pendingTasks);
      return;
    }

    const duration = 1000; // ms
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic out

      setTotalCount(Math.round(summary.totalProjects * ease));
      setActiveCount(Math.round(summary.activeProjects * ease));
      setCompletedCount(Math.round(summary.completedTasks * ease));
      setPendingCount(Math.round(summary.pendingTasks * ease));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [summary]);

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl bg-studio-cardDark border border-white/10 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Projects - Clean White Hero Card (No blurry gradient bleed above card) */}
      <div className="relative p-6 rounded-2xl bg-white text-studio-dark border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-500">
            Total Projects
          </span>
          <span className="p-2 rounded-xl bg-zinc-100 text-studio-dark group-hover:bg-studio-red group-hover:text-white transition-colors">
            <FolderKanban className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2 relative z-10">
          <span
            className="text-4xl lg:text-5xl font-bold font-mono tracking-tight text-studio-dark"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {totalCount}
          </span>
          <span className="text-xs text-zinc-500 font-medium">portfolio items</span>
        </div>
        <p className="mt-2 text-xs text-zinc-600 relative z-10">
          Managed across active agency pipeline
        </p>
      </div>

      {/* Active Projects - Mint Green Accent */}
      <div className="relative p-6 rounded-2xl bg-studio-cardDark border border-emerald-500/20 shadow-card-dark overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-medium">
            Active Projects
          </span>
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Activity className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span
            className="text-4xl lg:text-5xl font-bold font-mono tracking-tight text-white"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {activeCount}
          </span>
          <span className="text-xs text-zinc-400 font-medium">in delivery</span>
        </div>
        <p className="mt-2 text-xs text-zinc-400">
          Currently in design &amp; sprint execution
        </p>
      </div>

      {/* Completed Tasks - Blue Accent */}
      <div className="relative p-6 rounded-2xl bg-studio-cardDark border border-blue-500/20 shadow-card-dark overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-medium">
            Completed Tasks
          </span>
          <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span
            className="text-4xl lg:text-5xl font-bold font-mono tracking-tight text-white"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {completedCount}
          </span>
          <span className="text-xs text-zinc-400 font-medium">/ {summary.totalTasks} total</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${summary.overallCompletionRate}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-blue-400 font-bold">
            {summary.overallCompletionRate}%
          </span>
        </div>
      </div>

      {/* Pending Tasks - Amber Accent */}
      <div className="relative p-6 rounded-2xl bg-studio-cardDark border border-amber-500/20 shadow-card-dark overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-medium">
            Pending Tasks
          </span>
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span
            className="text-4xl lg:text-5xl font-bold font-mono tracking-tight text-white"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {pendingCount}
          </span>
          <span className="text-xs text-zinc-400 font-medium">backlog &amp; WIP</span>
        </div>
        <p className="mt-2 text-xs text-zinc-400">
          Awaiting feedback or in progress
        </p>
      </div>
    </div>
  );
};

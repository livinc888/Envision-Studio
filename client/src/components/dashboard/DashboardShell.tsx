import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ArrowLeft, Plus, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Button } from '../common/Button';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  onNewProject?: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  onNewProject
}) => {
  const location = useLocation();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Live API Health Status Check for pulsing dot
  const { isError: isApiOffline } = useQuery({
    queryKey: ['health'],
    queryFn: ({ signal }) => api.getHealth(signal),
    refetchInterval: 15000,
    retry: 1
  });

  const isApiOnline = !isApiOffline;

  // Default dynamic breadcrumbs
  const defaultBreadcrumbs: BreadcrumbItem[] = React.useMemo(() => {
    if (breadcrumbs) return breadcrumbs;
    const paths = location.pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: 'App', href: '/app' }];

    if (paths.includes('projects')) {
      crumbs.push({ label: 'Projects', href: '/app/projects' });
      const lastSegment = paths[paths.length - 1];
      if (lastSegment && lastSegment !== 'projects') {
        crumbs.push({ label: `PRJ-${String(lastSegment).padStart(3, '0')}` });
      }
    } else {
      crumbs.push({ label: 'Overview' });
    }
    return crumbs;
  }, [breadcrumbs, location.pathname]);

  return (
    <div
      className="min-h-screen bg-studio-dark text-white flex flex-col md:flex-row font-sans overflow-x-hidden"
      style={{ '--header-h': '76px' } as React.CSSProperties}
    >
      {/* Desktop Slim Left Rail (Expands to Icon + Label on Hover/Focus) */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`hidden md:flex flex-col justify-between py-6 border-r border-white/10 bg-[#0E0E10] shrink-0 fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ease-out shadow-2xl ${
          isSidebarHovered ? 'w-56 px-4' : 'w-20 px-3 items-center'
        }`}
      >
        <div className="flex flex-col gap-8 w-full">
          {/* Brand Logo Glyph */}
          <Link
            to="/"
            className={`group relative p-2.5 rounded-2xl bg-white/5 hover:bg-studio-red/20 transition-all border border-white/10 hover:border-studio-red/40 flex items-center gap-3 ${
              isSidebarHovered ? 'px-3' : 'justify-center'
            }`}
            title="EnvisionStudio Home"
          >
            <div className="grid grid-cols-3 gap-0.5 w-5 h-5 shrink-0">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[1px] transition-colors ${
                    i === 4 || i === 0 || i === 8 ? 'bg-studio-red' : 'bg-white/70 group-hover:bg-white'
                  }`}
                />
              ))}
            </div>
            {isSidebarHovered && (
              <span className="font-sans font-semibold text-xs text-white tracking-tight whitespace-nowrap overflow-hidden transition-opacity">
                EnvisionStudio<span className="text-[10px] text-zinc-400">®</span>
              </span>
            )}
          </Link>

          {/* Navigation Links with Expanding Labels */}
          <nav className="flex flex-col gap-2 w-full">
            <NavLink
              to="/app"
              end
              className={({ isActive }) =>
                `group relative p-3 rounded-xl transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-studio-red text-white shadow-glow-red font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
              title="Dashboard Overview"
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {isSidebarHovered && (
                <span className="text-xs font-medium tracking-tight whitespace-nowrap">
                  Overview
                </span>
              )}
            </NavLink>

            <NavLink
              to="/app/projects"
              className={({ isActive }) =>
                `group relative p-3 rounded-xl transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-studio-red text-white shadow-glow-red font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
              title="Projects Management"
            >
              <FolderKanban className="w-5 h-5 shrink-0" />
              {isSidebarHovered && (
                <span className="text-xs font-medium tracking-tight whitespace-nowrap">
                  Projects
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Bottom Section: Back to Website & API Health Status Dot */}
        <div className="flex flex-col gap-4 w-full">
          <Link
            to="/"
            className={`p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group flex items-center gap-3 ${
              isSidebarHovered ? 'px-3' : 'justify-center'
            }`}
            title="Exit to Website"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isSidebarHovered && (
              <span className="text-xs font-medium whitespace-nowrap">Exit App</span>
            )}
          </Link>

          {/* API Online Status Dot Indicator */}
          <div
            className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3 cursor-default transition-all ${
              isSidebarHovered ? 'px-3' : 'justify-center'
            }`}
            title={isApiOnline ? 'API online (port 5000 connected)' : 'API unreachable (server offline)'}
          >
            <div className="relative flex items-center justify-center shrink-0">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isApiOnline
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
                    : 'bg-studio-red shadow-[0_0_8px_rgba(229,50,43,0.8)] animate-ping'
                }`}
              />
            </div>
            {isSidebarHovered && (
              <span
                className={`text-[10px] font-mono uppercase tracking-wider font-semibold whitespace-nowrap ${
                  isApiOnline ? 'text-emerald-400' : 'text-studio-red'
                }`}
              >
                {isApiOnline ? 'API ONLINE' : 'API OFFLINE'}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-20 flex flex-col min-h-screen w-full">
        {/* Sticky Header with Exact --header-h, blur(16px), 1px border, z-50 */}
        <header
          className="sticky top-0 z-50 h-[var(--header-h)] bg-[#0B0B0B]/85 backdrop-blur-[16px] border-b border-white/[0.08] px-6 sm:px-8 flex items-center justify-between transition-colors w-full"
        >
          <div className="flex flex-col gap-1">
            {/* Breadcrumb Trail */}
            <nav className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              {defaultBreadcrumbs.map((crumb, idx) => {
                const isLast = idx === defaultBreadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-zinc-600" />}
                    {crumb.href && !isLast ? (
                      <Link to={crumb.href} className="hover:text-white transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? 'text-studio-red font-semibold' : 'text-zinc-400'}>
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/" className="md:hidden flex items-center gap-2">
                <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`rounded-[1px] ${i === 4 ? 'bg-studio-red' : 'bg-white/80'}`} />
                  ))}
                </div>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h1>
              {subtitle && <p className="text-xs text-zinc-400 hidden sm:block mt-0.5">• {subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Website
            </Link>

            {onNewProject && (
              <Button size="sm" variant="primary" onClick={onNewProject} className="text-xs">
                <Plus className="w-4 h-4 mr-1" />
                New Project
              </Button>
            )}
          </div>
        </header>

        {/* Page Content: with proper breathing room below the sticky header */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E10]/95 backdrop-blur-lg border-t border-white/10 px-6 py-2.5 flex items-center justify-around">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-studio-red' : 'text-zinc-400 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/app/projects"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-studio-red' : 'text-zinc-400 hover:text-white'
            }`
          }
        >
          <FolderKanban className="w-5 h-5" />
          <span>Projects</span>
        </NavLink>

        <Link
          to="/"
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit App</span>
        </Link>
      </nav>
    </div>
  );
};

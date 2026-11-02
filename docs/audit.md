# EnvisionStudio System & Workflow Audit Report

**Audit Date:** 2026-11-01  
**Lead Auditor:** Senior Full-Stack Engineer & QA Lead  
**Scope:** Core system workflows, API contracts, database operations, error boundaries, and state synchronization across the EnvisionStudio monorepo (`/client` + `/server`).

---

## 1. Executive Summary

An exhaustive end-to-end audit was conducted across all 13 critical functional flows (A through M). The backend Express + SQLite engine demonstrates strong core stability with proper foreign keys (`PRAGMA foreign_keys = ON`), schema migrations, and REST endpoints. 

However, the frontend architecture currently relies on decentralized `fetch` calls, raw component state (`useState`), and uncoordinated refetches rather than a unified server-state cache. This causes cache desynchronization across routes, lack of optimistic updates on task toggling, missing form field error mapping, missing breadcrumbs, and absence of an application-wide toast and error-boundary system.

Below is the exhaustive audit table detailing the findings for each flow.

---

## 2. Comprehensive Flow Audit Table

| Flow | Expected Behavior | Actual Behavior | Status | Suspected Cause | Key File(s) |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **A. First Load & Seeding** | Fresh DB auto-seeds from `mock.json`. Dashboard, projects, and featured work load live data with no manual intervention. Re-running seed creates zero duplicates. | Backend checks `SELECT COUNT(*)` and seeds 10 projects + 20 tasks idempotently. However, `FeaturedWork.tsx` hardcodes static mock projects in local state before fetching live data. | **FAIL** | `FeaturedWork.tsx` initializes `useState` with 3 hardcoded projects instead of loading from API with a skeleton state. | `client/src/components/marketing/FeaturedWork.tsx`<br>`server/src/db/seed.ts` |
| **B. Dashboard Summary** | Total Projects (10), Active Projects (6), Completed Tasks (6), and Pending Tasks (14) match database and update instantly after any project/task change without a full page reload. | Endpoint `/api/dashboard/summary` computes metrics in SQL accurately. However, mutations in Projects or Tasks do not invalidate the summary cache across routes. Navigating back shows stale counts until manual reload. | **FAIL** | Absence of TanStack Query (React Query) query invalidation (`queryClient.invalidateQueries({ queryKey: ['summary'] })`). | `client/src/pages/DashboardOverview.tsx`<br>`client/src/services/api.ts` |
| **C. Projects List** | Displays all projects with correct status badge, deadline countdown, and task progress (done/total). | All 10 projects render with correct status, deadline, and progress calculated from `taskCount` and `completedTaskCount`. | **PASS** | Projects SQL query uses `LEFT JOIN tasks` with `COUNT` and conditional `SUM`. | `server/src/services/projectsService.ts`<br>`client/src/components/dashboard/ProjectTable.tsx` |
| **D. Status Filter & Search** | Segmented tabs (All / Active / Completed / On Hold) show correct counts. Filter is synced with URL (`?status=Active`) so back/forward and refresh persist state. Search combines with filter and debounces by 250ms. | Filter counts are correct. However, `handleStatusFilterChange` replaces search params object (wiping out search query and view mode), browser Back/Forward does not trigger state updates, and search query is not debounced (fires per keystroke). | **FAIL** | `searchParams` not synced bidirectionally via `useEffect`; search input lacks 250ms debounce mechanism; `setSearchParams` overwrites other params. | `client/src/pages/ProjectsListPage.tsx` |
| **E. Add Project** | Slide-over drawer with Title, Description, Status, Deadline. Client & server validation with inline field errors, disabled submit button with spinner, double-submit prevention, auto-closing drawer, and success toast. | Drawer opens and submits. However, validation is handled via primitive `useState` strings; no inline field errors are shown (only a single generic banner); no focus trap or auto-focus on first invalid field; no toast notifications. | **FAIL** | Missing `react-hook-form` + `@hookform/resolvers/zod`; missing focus trapping/restoration in drawer; missing toast context. | `client/src/components/dashboard/ProjectFormDrawer.tsx` |
| **F. Edit Project** | Form opens pre-filled, saving updates project list, detail page, and dashboard. Cancel cleanly discards changes. | Form opens pre-filled and cancel discards changes. However, saving only updates local page state without invalidating global query keys; dashboard and project lists retain stale data on navigation. No edit toast. | **FAIL** | Decentralized local fetch logic rather than React Query mutation cache invalidation (`['projects']`, `['project', id]`, `['summary']`). | `client/src/components/dashboard/ProjectFormDrawer.tsx`<br>`client/src/pages/ProjectDetailPage.tsx` |
| **G. Delete Project** | Confirmation modal displays project title and cascade task count. Deletion purges project and associated tasks via DB cascade, invalidates list & dashboard, and redirects to `/app/projects` from detail page. | Cascade delete works cleanly in SQLite via `ON DELETE CASCADE`. Modal shows warning. However, modal lacks accessible focus trap (Tab key escapes to background), ESC key does not restore trigger focus, and no deletion toast is shown. | **FAIL** | Missing keyboard focus management and accessible modal trap; missing query cache invalidation on delete. | `client/src/components/dashboard/DeleteProjectModal.tsx`<br>`client/src/pages/ProjectDetailPage.tsx` |
| **H. Project Detail (`/app/projects/:id`)** | Loads project and tasks by ID. Shows dedicated "Not Found" state for invalid ID. Refreshing on this URL works in development and production (SPA fallback). | Loads detail and tasks. Refresh works in production via Express SPA fallback. However, invalid IDs render a generic inline error rather than an explicit 404 screen, and unknown non-app routes redirect to `/` without a 404 page. | **FAIL** | Missing dedicated 404 component and missing global React ErrorBoundary. | `client/src/pages/ProjectDetailPage.tsx`<br>`client/src/App.tsx` |
| **I. Tasks Operations** | Add, inline edit, delete, and toggle complete/incomplete. Tabs and counters stay synced, progress ring updates instantly, and blank/whitespace titles are rejected. Task toggle uses optimistic updates with rollback on failure. | Add, edit, delete, and tab filters work. Blank titles are rejected. However, task toggle performs a slow network roundtrip with full project refetch rather than an optimistic UI toggle with rollback and error toast on failure. | **FAIL** | Missing optimistic mutation logic (`onMutate`, `onError` rollback in React Query); missing error toast system. | `client/src/components/dashboard/TaskPanel.tsx`<br>`client/src/pages/ProjectDetailPage.tsx` |
| **J. Navigation & History** | Seamless navigation via sidebar, mobile tab bar, breadcrumbs, browser back/forward, active links, and scroll restored to top on route change. | Sidebar and mobile tab bar highlight active links. However, **breadcrumbs are completely missing** from the dashboard shell, and **scroll position is not restored to top** when changing routes. | **FAIL** | Breadcrumb navigation component not implemented in `DashboardShell.tsx`; missing `ScrollToTop` router listener. | `client/src/components/dashboard/DashboardShell.tsx`<br>`client/src/App.tsx` |
| **K. Constellation (Three.js)** | 3D orbital nodes reflect live projects, update on CRUD/status change, hover displays tooltip, click navigates to `/app/projects/:id`. Keyboard-accessible list fallback exists. | 3D visualizer maps status colors and task counts. Tooltip and click navigation work. List fallback exists. However, Three.js geometries and materials for individual project nodes and orbital rings are not disposed on unmount, creating a memory leak during route switches. | **FAIL** | Incomplete WebGL disposal in `useEffect` cleanup (only core sphere disposed, dynamically generated node meshes/materials leaked). | `client/src/components/three/Constellation3DCanvas.tsx` |
| **L. Marketing "Featured Work"** | Renders live API project data, displays loading skeletons on fetch, provides error state with Retry button, and links directly to project detail. | Section displays static fallback data immediately; fails to show loading skeletons; has no user-facing error state or Retry action if `/api/projects` fails. | **FAIL** | Hardcoded initial state in `FeaturedWork.tsx` with unhandled API errors (`console.error`). | `client/src/components/marketing/FeaturedWork.tsx` |
| **M. Error Handling & Resilience** | When backend is unreachable, every page displays an error state with Retry. Slow 3G displays skeleton loaders. Server 400 responses provide typed field-level error messages mapped to form inputs. | Server returns structured Zod error details. However, frontend `api.ts` throws plain string errors, losing `fieldErrors` structure. Form components do not bind field errors. Uncaught errors crash React due to lack of an Error Boundary. | **FAIL** | Missing typed `ApiClientError` with `{ status, message, fieldErrors }`; missing field error mapping in forms; missing `ErrorBoundary`. | `client/src/services/api.ts`<br>`client/src/App.tsx`<br>`client/src/components/dashboard/ProjectFormDrawer.tsx` |

---

## 3. Recommended Remediation Plan (To Execute Upon Approval)

### Phase 1: Data Layer & API Architecture
1. **Install Dependencies**:
   - Client: `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers/zod`, `zod`.
2. **Standardize API Client (`services/api.ts`)**:
   - Base URL from `import.meta.env.VITE_API_URL || '/api'`.
   - Typed `ApiError` class exposing `{ status, message, fieldErrors }`.
   - Request timeout (10s) and native `AbortController` signal forwarding.
3. **Configure TanStack Query**:
   - Global `QueryClient` with default `staleTime: 1000 * 60 * 2` (2 minutes).
   - Standard query keys: `['projects', { status }]`, `['project', id]`, `['tasks', projectId]`, `['summary']`.
   - Optimistic updates with snapshot rollback for task status toggle.

### Phase 2: Backend Refinement & Contracts
1. **Response Standardization**:
   - Ensure all controllers return consistent shapes (`200`, `201`, `204 No Content` for delete, `400` with field errors, `404` for missing records).
2. **Shared Overdue Logic**:
   - Extract overdue evaluation into a shared helper: overdue when `deadline < today && status !== 'Completed'`.
3. **Strict Validation & Transactions**:
   - Validate ID parameters (`z.coerce.number().int().positive()`).
   - Use transactions for multi-step mutations.
   - Enforce trimmed strings and ISO date format `YYYY-MM-DD`.

### Phase 3: Frontend Component & Workflow Fixes
1. **Forms Modernization**:
   - Migrate `ProjectFormDrawer` to `react-hook-form` + `zod`.
   - Display inline validation errors below fields and autofocus first invalid input.
   - Implement focus trapping and ESC key dismissal in Drawer and Modal.
2. **Toasts System**:
   - Integrate lightweight accessible toast notification provider for Create, Update, Delete, and Error events.
3. **Navigation & Breadcrumbs**:
   - Add dynamic breadcrumbs to `DashboardShell` (`Dashboard / Projects / PRJ-001`).
   - Add `ScrollToTop` listener to `App.tsx`.
   - Sync URL search parameters (`?status=...&search=...&view=...`) bidirectionally with a 250ms debounced search input.
4. **Marketing "Featured Work"**:
   - Replace static fallback data with live query hook, loading skeleton state, and error banner with `Retry`.
5. **Memory Leak Prevention**:
   - Add recursive WebGL resource disposal in `Constellation3DCanvas.tsx` to prevent memory leaks across route navigation.
6. **Error Boundary & 404**:
   - Add a global `ErrorBoundary` and dedicated `NotFoundPage`.

### Phase 4: Test Suite & Verification
1. **Backend Tests**: Vitest + Supertest suite verifying seed idempotency, cascade delete, summary accuracy, status filtering, and 400/404 handling.
2. **Frontend Tests**: React Testing Library tests for form validation, delete modal cascade count, and task toggle optimistic updates.
3. **E2E Tests**: Playwright journey verifying the complete lifecycle (load dashboard → create project → add tasks → toggle tasks → edit project → delete project) at 1440px and 390px.


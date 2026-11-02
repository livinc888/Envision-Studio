# Envision-Studio

[![Live Demo on Render](https://img.shields.io/badge/Render-Live%20Demo-brightgreen?style=for-the-badge&logo=render)](https://envision-studio.onrender.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-Cloud%20Database-green?style=for-the-badge&logo=mongodb)](https://cloud.mongodb.com)

> 🌐 **Live Production App**: [https://envision-studio.onrender.com](https://envision-studio.onrender.com)  
> 📊 **Project Management Dashboard**: [https://envision-studio.onrender.com/app](https://envision-studio.onrender.com/app)  
> 🩺 **Live API Health Check**: [https://envision-studio.onrender.com/api/health](https://envision-studio.onrender.com/api/health)

A production-quality digital agency marketing website and integrated Project Management Dashboard web app built with React, Vite, Tailwind CSS, Three.js (lazy-loaded), Lenis smooth scroll, Node.js + Express, and MongoDB Atlas (`mongoose`).

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js**: v20+ or v22+ (tested on v24)
- **MongoDB**: v6+ / v7+ / v8+ (running locally on port 27017 or a MongoDB Atlas URI)
- **npm**: v10+

### 1. Installation
Clone or navigate to the project directory:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration
Copy the `.env.example` in `/server`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://Envision:envision123@cluster0.nrpxu9h.mongodb.net/envision_studio?retryWrites=true&w=majority
```

### 3. Database Seeding
The database auto-seeds on first server start if empty, but you can also run the seed script directly:
```bash
# In /server
npm run seed
```

### 4. Running in Development Mode
You can run the frontend and backend concurrently:
```bash
# Terminal 1: Backend API (runs on port 5000)
cd server
npm run dev

# Terminal 2: Frontend Vite Dev Server with API Proxy (runs on port 3000)
cd client
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running as a Single Service (Production Build)
Express is configured to serve the compiled client SPA directly from `client/dist`:
```bash
# 1. Build frontend
cd client
npm run build

# 2. Build backend
cd ../server
npm run build

# 3. Start production server
npm start
```
Visit [http://localhost:5000](http://localhost:5000) for the marketing site and [http://localhost:5000/app](http://localhost:5000/app) for the Project Management Dashboard.

### 6. Running the API Test Suite
Run the full 15-test Vitest + Supertest suite:
```bash
cd server
npm test
```

---

## 🛠 Technology Stack & Architectural Decisions

| Layer | Technology | Decision Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + Vite** | Fast HMR development cycles, efficient build tooling, and effortless code-splitting of heavy 3D assets. |
| **Styling & Tokens** | **Tailwind CSS** | Direct expression of custom tokens (`#E5322B`, `#0B0B0B`, `#C1272D`, status colors) with utility speed and zero runtime CSS overhead. |
| **Typography** | **Geist Sans & JetBrains Mono** | Modern grotesque sans for tight editorial headlines paired with JetBrains Mono for technical codes and numerical metrics. |
| **3D & Shaders** | **Three.js (Lazy-Loaded)** | Code-split into its own bundle (`three.module.js`), loaded only on demand. Includes a custom GLSL fluid shader for the Hero and an interactive 3D Constellation canvas for the Dashboard. |
| **Smooth Scrolling** | **Lenis** | Silky momentum-based inertia scroll enabled exclusively on the marketing landing page and cleanly torn down on `/app/*` dashboard routes. |
| **Backend Framework** | **Express.js** | Lightweight REST foundation with clean MVC separation (`routes/`, `controllers/`, `services/`, `models/`). |
| **Validation** | **Zod** | Runtime contract validation ensuring strict type safety on all endpoints. |
| **Database Engine** | **MongoDB Atlas (`mongoose`)** | Cloud document store with atomic auto-increment sequential ID counter for frontend routing parity and full relational aggregation pipelines. |
| **Testing** | **Vitest + Supertest** | Lightning-fast test runner with native ESM execution and end-to-end HTTP integration assertions. |

---

## 🌐 API Endpoint Specification

All REST endpoints are rooted at `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and MongoDB Atlas connection state |
| `GET` | `/api/dashboard/summary` | Aggregate metrics (totals, active, completion rates, deadlines) |
| `GET` | `/api/projects` | List all projects (supports optional `?status=Active\|Completed\|On Hold`) |
| `POST` | `/api/projects` | Create a new project (validated via Zod) |
| `GET` | `/api/projects/:id` | Get project detail with its tasks and progress statistics |
| `PUT` | `/api/projects/:id` | Update project metadata (title, description, status, deadline) |
| `DELETE` | `/api/projects/:id` | Delete project (cascades and deletes all child tasks) |
| `GET` | `/api/projects/:projectId/tasks` | Get all tasks belonging to a specific project |
| `POST` | `/api/projects/:projectId/tasks` | Add a new task to a project |
| `PUT` | `/api/tasks/:id` | Update task title, status, or toggle completed state |
| `DELETE` | `/api/tasks/:id` | Delete a single task |

---

## ☁️ Deployment

### Live Production Deployment on Render
The application is deployed as a single unified service on Render:
* **Web App**: [https://envision-studio.onrender.com](https://envision-studio.onrender.com)
* **Dashboard**: [https://envision-studio.onrender.com/app](https://envision-studio.onrender.com/app)
* **API Health**: [https://envision-studio.onrender.com/api/health](https://envision-studio.onrender.com/api/health)

### Docker Deployment
The repository includes a ready-to-deploy multi-stage `Dockerfile`:

```bash
# Build & run production container locally
docker build -t envision-studio .
docker run -p 5000:5000 -e MONGODB_URI="mongodb+srv://Envision:envision123@cluster0.nrpxu9h.mongodb.net/envision_studio?retryWrites=true&w=majority" envision-studio
```

---

## 🤖 AI Tools Used and Code Verification
- **AI Coding Assistant**: Google Antigravity (Powered by Gemini)
- **Validation Methodology**:
  - [x] Schema parity validation against `/data/mock.json`
  - [x] 15/15 automated Vitest + Supertest API integration tests
  - [x] Single-service compilation and HTTP probing across `/api/health`, `/api/dashboard/summary`, and SPA fallback routes
  - [x] TypeScript strict compilation (`tsc -b` on client and server)
  - [x] MongoDB Atlas migration complete with cloud seeding verified

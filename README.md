# 🛡️ API Watchtower

<p align="center">
  <strong>⚡ Local-first API testing & monitoring desktop app</strong>
</p>

<p align="center">
  A lightweight desktop application for testing APIs, saving request history, measuring response times and monitoring endpoint health locally.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-MVP%20functional-brightgreen" />
  <img src="https://img.shields.io/badge/desktop-Electron-47848F" />
  <img src="https://img.shields.io/badge/frontend-Vanilla%20JS-F7DF1E" />
  <img src="https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933" />
  <img src="https://img.shields.io/badge/storage-JSON%20Local-blue" />
  <img src="https://img.shields.io/badge/license-MIT-black" />
</p>

---

## ✨ Overview

**API Watchtower** is a local-first desktop application created for developers who need a simple, fast and clean tool to test APIs.

It works as a lightweight alternative to large API platforms, focused on the essential workflow:

- ✅ Create API projects
- ✅ Register endpoints
- ✅ Execute real HTTP requests
- ✅ Measure response time
- ✅ Save local history
- ✅ Review API health
- ✅ Generate basic reports
- ✅ Keep all data local

> A clean control tower for your APIs.

---

## 🧠 Why API Watchtower?

Developers often need to quickly test endpoints, validate responses, inspect errors and track performance.

Large tools are powerful, but sometimes they add too much friction for small projects, local development or quick testing.

API Watchtower focuses on a direct workflow:

```txt
Open app → Create project → Add endpoint → Send request → Review response → Check history
```

No cloud account.  
No heavy setup.  
No unnecessary noise.  
Just a clean local workflow.

---

## 🚀 Main Features

### 📁 Projects

Create and organize API projects locally.

- Create API projects
- Store project name
- Store base URL
- Add project description
- Open project endpoints
- Persist projects locally
- Reload projects after reopening the app

---

### 🔗 Endpoints

Register endpoints for each project.

- Add endpoint name
- Select HTTP method
- Save endpoint URL
- Add optional headers
- Add optional body
- Track last HTTP status
- Track last response time
- Test endpoint directly from the app
- Persist endpoints locally

Supported methods:

```txt
GET
POST
PUT
PATCH
DELETE
HEAD
OPTIONS
```

---

### 🧪 Tester

Execute real HTTP requests from the desktop interface.

- Send real API requests
- View HTTP status
- View response time
- View response headers
- View response body
- Copy response
- Save request automatically in history
- Remember last request after reopening the app

Example public API for testing:

```txt
https://jsonplaceholder.typicode.com/posts/1
```

---

### 🕘 History

Review all executed requests.

- View request method
- View request URL
- View HTTP status code
- View response time
- View execution date
- View full request detail
- Copy saved response
- Repeat previous request
- Clear local history

Local history file:

```txt
apps/server/data/history.json
```

---

### 📊 Dashboard

Visual summary of API activity.

- Total projects
- Total endpoints
- Total requests
- Average response time
- Endpoint health summary
- Last request
- Recent activity

---

### 📈 Reports

Local reports based on request history.

- Availability percentage
- Total executed requests
- Average response time
- Total errors
- Fastest request
- Slowest request
- Recent activity
- Copy report as JSON

---

### 🎨 UI / UX

The interface was designed to be:

- Clean
- Light
- Minimalist
- Fully responsive
- Small and refined
- Animated with smooth transitions
- Easy to understand
- Focused on developer productivity

---

## 🏗️ Architecture

```txt
┌──────────────────────────────────────────────┐
│              Electron Desktop App             │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │          Vanilla JS Frontend            │  │
│  │                                        │  │
│  │  Dashboard                             │  │
│  │  Projects                              │  │
│  │  Endpoints                             │  │
│  │  Tester                                │  │
│  │  History                               │  │
│  │  Reports                               │  │
│  │  Settings                              │  │
│  └────────────────────────────────────────┘  │
│                    │                         │
│                    ▼                         │
│  ┌────────────────────────────────────────┐  │
│  │       Local Express Backend API         │  │
│  │                                        │  │
│  │  /api/health                           │  │
│  │  /api/projects                         │  │
│  │  /api/endpoints                        │  │
│  │  /api/requests/send                    │  │
│  │  /api/history                          │  │
│  │  /api/reports/summary                  │  │
│  │  /api/settings                         │  │
│  └────────────────────────────────────────┘  │
│                    │                         │
│                    ▼                         │
│  ┌────────────────────────────────────────┐  │
│  │            Local JSON Storage           │  │
│  │                                        │  │
│  │  projects.json                         │  │
│  │  endpoints.json                        │  │
│  │  history.json                          │  │
│  │  settings.json                         │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## 🧰 Tech Stack

### Desktop

- Electron

### Frontend

- Vanilla JavaScript
- HTML
- CSS
- Vite

### Backend

- Node.js
- Express
- Axios
- CORS
- Morgan
- Dotenv

### Storage

- Local JSON files

### Packaging

- Electron Builder
- NSIS Windows installer

---

## 📂 Project Structure

```txt
api-watchtower/
├── apps/
│   ├── desktop/
│   │   ├── assets/
│   │   │   ├── icon.ico
│   │   │   └── logo.png
│   │   ├── electron/
│   │   │   ├── ipc-handlers.cjs
│   │   │   ├── main.cjs
│   │   │   ├── preload.cjs
│   │   │   ├── server-manager.cjs
│   │   │   └── window-manager.cjs
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── code-viewer.js
│   │   │   │   ├── empty-state.js
│   │   │   │   ├── footer.js
│   │   │   │   ├── loader.js
│   │   │   │   ├── modal.js
│   │   │   │   ├── navbar.js
│   │   │   │   ├── sidebar.js
│   │   │   │   ├── status-badge.js
│   │   │   │   └── toast.js
│   │   │   ├── core/
│   │   │   │   ├── api.client.js
│   │   │   │   ├── config.js
│   │   │   │   ├── events.js
│   │   │   │   ├── router.js
│   │   │   │   └── storage.js
│   │   │   ├── pages/
│   │   │   │   ├── dashboard.page.js
│   │   │   │   ├── endpoints.page.js
│   │   │   │   ├── history.page.js
│   │   │   │   ├── not-found.page.js
│   │   │   │   ├── projects.page.js
│   │   │   │   ├── reports.page.js
│   │   │   │   ├── settings.page.js
│   │   │   │   └── tester.page.js
│   │   │   ├── services/
│   │   │   │   ├── endpoints.service.js
│   │   │   │   ├── history.service.js
│   │   │   │   ├── projects.service.js
│   │   │   │   ├── reports.service.js
│   │   │   │   ├── requests.service.js
│   │   │   │   └── settings.service.js
│   │   │   ├── styles/
│   │   │   │   ├── base.css
│   │   │   │   ├── components.css
│   │   │   │   ├── dashboard.css
│   │   │   │   ├── layout.css
│   │   │   │   ├── pages.css
│   │   │   │   ├── settings.css
│   │   │   │   └── tester.css
│   │   │   ├── utils/
│   │   │   │   ├── date.util.js
│   │   │   │   ├── format.util.js
│   │   │   │   ├── http-status.util.js
│   │   │   │   ├── json.util.js
│   │   │   │   └── validators.util.js
│   │   │   ├── app.js
│   │   │   └── main.js
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   └── server/
│       ├── data/
│       │   ├── endpoints.json
│       │   ├── history.json
│       │   ├── projects.json
│       │   └── settings.json
│       ├── logs/
│       │   └── app.log
│       ├── src/
│       │   ├── config/
│       │   │   ├── cors.js
│       │   │   └── env.js
│       │   ├── controllers/
│       │   │   ├── endpoints.controller.js
│       │   │   ├── health.controller.js
│       │   │   ├── history.controller.js
│       │   │   ├── projects.controller.js
│       │   │   ├── reports.controller.js
│       │   │   ├── requests.controller.js
│       │   │   └── settings.controller.js
│       │   ├── middlewares/
│       │   │   ├── error.middleware.js
│       │   │   ├── not-found.middleware.js
│       │   │   └── request-logger.middleware.js
│       │   ├── routes/
│       │   │   ├── endpoints.routes.js
│       │   │   ├── health.routes.js
│       │   │   ├── history.routes.js
│       │   │   ├── index.routes.js
│       │   │   ├── projects.routes.js
│       │   │   ├── reports.routes.js
│       │   │   ├── requests.routes.js
│       │   │   └── settings.routes.js
│       │   ├── services/
│       │   │   ├── endpoints.service.js
│       │   │   ├── history.service.js
│       │   │   ├── projects.service.js
│       │   │   ├── reports.service.js
│       │   │   ├── requests.service.js
│       │   │   ├── settings.service.js
│       │   │   └── watchtower.service.js
│       │   ├── storage/
│       │   │   ├── db.js
│       │   │   ├── json-db.js
│       │   │   └── seed.js
│       │   ├── utils/
│       │   │   ├── file-system.js
│       │   │   ├── http-client.js
│       │   │   ├── id.js
│       │   │   ├── response-time.js
│       │   │   ├── safe-json.js
│       │   │   └── status-classifier.js
│       │   ├── app.js
│       │   └── server.js
│       ├── .env
│       └── package.json
├── docs/
│   ├── architecture.md
│   ├── desktop-build.md
│   ├── installation.md
│   ├── mvp.md
│   └── roadmap.md
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── constants.js
│       │   ├── http-methods.js
│       │   ├── status-codes.js
│       │   └── validators.js
│       └── package.json
├── release/
├── scripts/
│   ├── build.bat
│   ├── clean.bat
│   ├── dev.bat
│   ├── dist.bat
│   └── reset-data.bat
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Requirements

- Node.js 20+
- npm 10+
- Windows 10/11

### Install dependencies

```bash
npm install
```

---

## ▶️ Run in Development

From the project root:

```bash
npm run dev
```

This starts:

```txt
SERVER   → http://127.0.0.1:3567
DESKTOP  → http://127.0.0.1:5173
ELECTRON → API Watchtower desktop window
```

---

## 🩺 Backend Health Check

Open in the browser:

```txt
http://127.0.0.1:3567/api/health
```

Expected response:

```json
{
  "ok": true,
  "message": "API Watchtower API online",
  "app": "API Watchtower",
  "status": "online"
}
```

---

## 🧪 Quick Test

Use this public API:

```txt
https://jsonplaceholder.typicode.com/posts/1
```

Workflow:

1. Open API Watchtower
2. Go to Projects
3. Create a project
4. Open the project
5. Create an endpoint
6. Go to Tester
7. Click Send
8. Check response
9. Open History
10. Review saved request

---

## 📌 API Routes

### Health

```txt
GET /api/health
```

---

### Projects

```txt
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Example payload:

```json
{
  "name": "CRM API",
  "baseUrl": "https://api.example.com",
  "description": "Main CRM backend API"
}
```

---

### Endpoints

```txt
GET    /api/endpoints
GET    /api/endpoints?projectId=PROJECT_ID
GET    /api/endpoints/:id
POST   /api/endpoints
PUT    /api/endpoints/:id
DELETE /api/endpoints/:id
```

Example payload:

```json
{
  "projectId": "project_xxxxx",
  "name": "Get users",
  "method": "GET",
  "url": "https://jsonplaceholder.typicode.com/users",
  "headers": {},
  "body": ""
}
```

---

### Requests

```txt
POST /api/requests/send
```

Example payload:

```json
{
  "endpointId": "endpoint_xxxxx",
  "projectId": "project_xxxxx",
  "method": "GET",
  "url": "https://jsonplaceholder.typicode.com/posts/1",
  "headers": {},
  "body": "",
  "timeout": 30000
}
```

Example response:

```json
{
  "ok": true,
  "data": {
    "ok": true,
    "status": 200,
    "statusText": "OK",
    "kind": "ok",
    "responseTimeMs": 268,
    "headers": {},
    "body": {
      "userId": 1,
      "id": 1,
      "title": "Example title",
      "body": "Example body"
    },
    "error": null,
    "historyId": "history_xxxxx"
  }
}
```

---

### History

```txt
GET    /api/history
DELETE /api/history
```

---

### Reports

```txt
GET /api/reports/summary
```

---

### Settings

```txt
GET /api/settings
PUT /api/settings
```

---

## 💾 Local Storage

API Watchtower currently uses local JSON files.

```txt
apps/server/data/projects.json
apps/server/data/endpoints.json
apps/server/data/history.json
apps/server/data/settings.json
```

This keeps the MVP simple, transparent and easy to debug.

Future versions may replace this layer with SQLite.

---

## 🖥️ Desktop Build

API Watchtower uses Electron Builder.

### Build frontend

```bash
npm run build
```

### Generate Windows installer

```bash
npm run dist
```

Output:

```txt
release/
└── API Watchtower Setup 0.1.0.exe
```

### Generate portable executable

```bash
npm run dist:portable
```

---

## 🧹 Useful Scripts

Start local server, Vite frontend and Electron app:

```bash
npm run dev
```

Build desktop frontend:

```bash
npm run build
```

Generate Windows installer:

```bash
npm run dist
```

Generate portable EXE:

```bash
npm run dist:portable
```

Remove generated builds:

```bash
npm run clean
```

---

## 🧾 BAT Scripts

The project also includes Windows helper scripts:

```txt
scripts/dev.bat
scripts/build.bat
scripts/dist.bat
scripts/clean.bat
scripts/reset-data.bat
```

Use them if you prefer double-click workflows on Windows.

---

## 🎯 MVP Status

- ✅ Electron desktop shell
- ✅ Local Express backend
- ✅ Vanilla JavaScript frontend
- ✅ Project creation
- ✅ Endpoint creation
- ✅ Real request execution
- ✅ Local request history
- ✅ Request repeat
- ✅ Response copy
- ✅ Dashboard summary
- ✅ Reports section
- ✅ Local JSON persistence
- ✅ Responsive light UI
- ✅ Windows installer config

---

## 🧩 Current Screens

- Dashboard
- Projects
- Endpoints
- Tester
- History
- Reports
- Settings

---

## 🔮 Roadmap

### Phase 1 — MVP Foundation

- ✅ Desktop shell
- ✅ Local backend
- ✅ Local JSON storage
- ✅ Request tester
- ✅ History
- ✅ Dashboard
- ✅ Reports

---

### Phase 2 — Better API Workspace

- ⬜ Collections
- ⬜ Environments
- ⬜ Environment variables
- ⬜ Headers presets
- ⬜ Query params editor
- ⬜ Auth helpers
- ⬜ Import/export workspace

---

### Phase 3 — Monitoring

- ⬜ Scheduled endpoint checks
- ⬜ Health timeline
- ⬜ Downtime detection
- ⬜ Slow endpoint alerts
- ⬜ Endpoint availability score
- ⬜ Background monitoring

---

### Phase 4 — Reports

- ⬜ Export report as JSON
- ⬜ Export report as PDF
- ⬜ Response time charts
- ⬜ Endpoint comparison
- ⬜ Error frequency report
- ⬜ Daily/weekly summaries

---

### Phase 5 — Professional Desktop App

- ⬜ SQLite storage
- ⬜ AppData persistence
- ⬜ Auto updates
- ⬜ Signed installer
- ⬜ Custom app icon
- ⬜ Portable mode
- ⬜ Backup and restore

---

### Phase 6 — AI Assistant

- ⬜ Explain API errors
- ⬜ Suggest fixes
- ⬜ Analyze failed responses
- ⬜ Generate request payloads
- ⬜ Generate documentation
- ⬜ Local Ollama support

---

## 🧠 Future Ideas

- Postman collection import
- OpenAPI / Swagger import
- Response diff viewer
- Mock server generator
- Endpoint documentation generator
- Local API uptime monitor
- Team export package
- CLI runner
- Test suites
- Assertion engine

---

## 🧪 Example Use Case

A developer is building a local CRM API.

Instead of manually checking endpoints in the browser or using a heavy API client, they can:

1. Create `"CRM API"` project
2. Add endpoints:
   - `GET /clients`
   - `POST /clients`
   - `GET /orders`
   - `POST /orders`
3. Execute real requests
4. Review response status
5. Check response time
6. Save all executions in history
7. Use reports to detect slow or broken endpoints

---

## 🛡️ Local-first Philosophy

API Watchtower is designed to run locally.

- No account required
- No cloud dependency
- No external database required
- No vendor lock-in
- Data is stored locally
- Developer keeps control

---

## 🧱 Design Principles

- Simple over complex
- Local over cloud
- Fast over heavy
- Clear over bloated
- Useful over decorative
- Developer-first over enterprise noise

---

## 📦 Packaging Strategy

### Development

```txt
Electron loads Vite frontend
Express runs locally
JSON files store data
```

### Production

```txt
Electron loads built frontend
Local server runs internally
Data remains local
Installer generated with Electron Builder
```

---

## 🧑‍💻 Development Notes

The project is intentionally modular:

- Frontend pages are separated by feature
- Frontend services communicate with backend routes
- Backend routes call controllers
- Controllers call services
- Services access local JSON storage

This makes the app easier to scale without turning the MVP into a corporate octopus with meetings.

---

## 🚨 Troubleshooting

### npm install fails with EJSONPARSE

Check that every `package.json` has valid JSON.

PowerShell:

```powershell
Get-ChildItem -Recurse -Filter package.json | ForEach-Object {
  if ((Get-Content $_.FullName -Raw).Trim().Length -eq 0) {
    Write-Host "EMPTY:" $_.FullName
  }
}
```

---

### concurrently not recognized

Run:

```bash
npm install
```

If needed:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
```

---

### Backend is not responding

Check:

```txt
http://127.0.0.1:3567/api/health
```

If it fails, run:

```bash
npm run dev --workspace apps/server
```

---

### Frontend is not loading

Check:

```txt
http://127.0.0.1:5173
```

If it fails, run:

```bash
npm run dev --workspace apps/desktop
```

---

### Data is not showing after reopening

Check local JSON files:

```txt
apps/server/data/projects.json
apps/server/data/endpoints.json
apps/server/data/history.json
```

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Developed as a local-first developer utility project.

```txt
API Watchtower
A clean desktop control tower for APIs.
```

---

<p align="center">
  <strong>🛡️ API Watchtower — Test. Monitor. Review. Locally.</strong>
</p>

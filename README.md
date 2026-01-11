# GitHub Profile Viewer

A small application that fetches GitHub profile data, recent contributions, and repositories from GitHub and displays them in a lightweight React UI. The project contains a Node/Express backend that proxies GitHub API requests (to avoid CORS/rate-limit issues) and a Vite + React frontend that visualizes profiles, repositories, and a contributions heatmap.

---

## 🚀 Features

- View a GitHub user's profile (avatar, name, bio, followers, public repos).
- View repositories (sorted by last updated).
- Visualize contribution activity (aggregated from public push events).
- Lightweight backend proxy to GitHub API with optional `GITHUB_TOKEN` support to increase rate limits.

---

## 🔧 Requirements

- Node.js (14+ recommended)
- npm

---

## 📦 Project structure

- `/backend` — Express server and GitHub API service
- `/frontend/github-profile-ui` — Vite + React UI

---

## ⚙️ Setup & Run (Development)

Open two terminals (one for backend, one for frontend):

1) Backend

```bash
cd backend
npm install
# Optional: create a .env file with a GitHub token (see below)
# Run in development mode (auto restarts):
npm run dev
# Or to run once:
npm start
```

The backend listens on port **5000** and exposes API routes under `/api/github`.

2) Frontend

```bash
cd frontend/github-profile-ui
npm install
npm run dev
```

Vite will start the frontend (usually at `http://localhost:5173`). The frontend is configured to call the backend at `http://localhost:5000/api/github` by default.

---

## 🔐 Environment Variables

Create a `.env` file in the `/backend` folder if you need higher GitHub API rate limits:

```
# backend/.env
GITHUB_TOKEN=ghp_yourGitHubPersonalAccessTokenHere
```

- `GITHUB_TOKEN` is optional but recommended for frequent use (it increases GitHub API rate limits).

---

## 📡 HTTP API (backend)

Base path: `http://localhost:5000/api/github`

- GET `/user/:username`
  - Returns the GitHub user profile JSON (same shape as GitHub's `/users/:username`).
  - 404 — User not found.
  - 403 — Rate limit exceeded (response includes helpful message and reset time if available).

- GET `/contributions/:username`
  - Returns an array representing contribution counts aggregated from recent public push events (format: `[{ date: "YYYY-MM-DD", count: N }, ...]`).
  - If contributions cannot be fetched (errors, timeouts, private contributions), the endpoint returns an empty array `[]`.

- GET `/repositories/:username`
  - Returns repositories for the user (sorted by updated date, up to 100 results).
  - 404 — User not found.
  - 403 — Rate limit exceeded.

Examples:

```bash
curl http://localhost:5000/api/github/user/octocat
curl http://localhost:5000/api/github/contributions/octocat
curl http://localhost:5000/api/github/repositories/octocat
```

---

## 🧠 How the frontend works

- The frontend calls the backend endpoints defined above via `src/services/api.js` (default `API_BASE` is `http://localhost:5000/api/github`).
- The profile page (component `Profiles.jsx`) currently uses the hardcoded username `shreeramk`. To view another user, change the `username` constant in `src/pages/Profiles.jsx` or modify the UI to accept input.
- Contribution data is consumed by `ContributionGraph.jsx` and converted to chart data to render a heatmap using `echarts`.

Notes:
- Contributions are derived from recent public events (PushEvent commits) and may not reflect the full GitHub contribution calendar — especially for private contributions or if the GitHub Events API doesn't return older events.
- Repositories are fetched with `?sort=updated&per_page=100` and will show most recently updated repos first.

---

## ❗ Troubleshooting & Tips

- If you get `403` with a message about the GitHub API rate limit, set `GITHUB_TOKEN` in `/backend/.env` and restart the backend.
- If the frontend cannot reach the backend, ensure the backend is running on port **5000**, and that `src/services/api.js` `API_BASE` matches where your backend is hosted.
- CORS is enabled on the backend, so the frontend (running on a different port) can access it during development.
- Contributions endpoint gracefully returns an empty array on errors (so the UI will show "No contribution available").

---

## 🧩 Extending / Production

- To build the frontend for production:

```bash
cd frontend/github-profile-ui
npm run build
# Use your preferred static file server to serve the generated build
```

- For production, make sure the frontend points to the correct backend URL (update `API_BASE` in `src/services/api.js` or inject at build time via environment variables).

---

## 🤝 Contributing

Contributions are welcome — please open an issue or add a pull request. There are no tests included at the moment.

---

## ℹ️ Implementation notes

- Backend uses Axios to call GitHub API and implements conservative timeouts and error handling.
- Contribution aggregation: The backend fetches `GET /users/:username/events/public` and aggregates `PushEvent` commit counts by date (within the last year window).
- Repositories are fetched via GitHub's `GET /users/:username/repos` endpoint.

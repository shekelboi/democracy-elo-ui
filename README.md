# Democracy ELO

A React app for comparing the democracies of different countries. Users are presented with two countries and choose which is more democratic; ELO scores are calculated based on their votes.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure the backend API is running at `http://localhost:8000` (see API.md).

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open the app in your browser (typically `http://localhost:5173`).

## API Proxy

The app proxies `/api` requests to `http://localhost:8000` in development. For production, set `VITE_API_URL` to your API base URL (e.g. `https://api.example.com`).

## Pages

- **Index** (`/`) – Vote on country pairs; flags expand on hover; Skip button in bottom right.
- **Statistics** (`/stats`) – Sortable table of countries and ELO scores with search.

# trubanb-frontend

React frontend for the Trubanb accommodation booking platform.

## Tech Stack

- React 19, TypeScript, Vite
- Material UI (MUI)
- React Router DOM
- Axios

## Local Development (outside cluster)

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` and proxies API calls to Kong via the `VITE_API_URL` env variable (configured in `.env.development`).

## Docker Build

```bash
docker build -t trubanb-frontend:local .
```

The Dockerfile uses a multi-stage build:
1. **Build stage**: `node:20-alpine` runs `npm run build` to produce static files in `dist/`
2. **Serve stage**: `nginx:alpine` serves the static files

When running in the cluster, the frontend uses relative paths for API calls (`/api/...`). Kong routes these to the appropriate backend services.

## Kubernetes Deployment

The frontend is deployed as part of the umbrella Helm chart. See [trubanb-infra](../trubanb-infra/README.md) for deployment instructions.

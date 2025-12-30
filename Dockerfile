# syntax=docker/dockerfile:1.7-labs

# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# Serve static build with Nginx
FROM nginx:alpine AS production
# Optional: enable gzip, long cache headers for assets
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

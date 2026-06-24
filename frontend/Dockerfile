# ==============================================================================
# Build Stage
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors first for caching layer speedups
COPY package*.json ./

# Clean dependency installation (similar to dotnet restore)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production bundle
RUN npm run build

# ==============================================================================
# Run Stage (Lightweight Nginx to serve static assets)
# ==============================================================================
FROM nginx:1.25-alpine

# Copy built files to Nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Overwrite default Nginx config with our SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

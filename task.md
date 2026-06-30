# Key of History - Task List

## Phase 1: Java Spring Boot Backend (CRUD & DB Setup)
- [x] Initialize Spring Boot project structure (Maven, Java 17) in `backend/` directory
- [x] Add standard dependencies (`pom.xml`)
- [x] Setup Docker-based build environment (Alternative to local Maven Wrapper)
- [x] Create domain entities (`HistoricalEvent`)
- [x] Setup Repository (`HistoricalEventRepository`) using Spring Data JPA
- [x] Write Service and Controller layer for CRUD API (`/api/events`)
- [x] Add local database profiles: in-memory H2 (for unit tests) and PostgreSQL (for docker runs)
- [x] Write Unit and Integration tests for CRUD operations
- [ ] Verify execution using Docker once Docker Desktop is running

## Phase 2: Event-Driven & Caching (RabbitMQ & Redis)
- [x] Add Redis and RabbitMQ dependencies to `pom.xml`
- [x] Configure Redis and RabbitMQ in `application-prod.properties` and `application-h2.properties` (mocked/disabled for H2/unit tests)
- [x] Create Event DTO / Message models
- [x] Create RabbitMQ Configuration Bean (exchanges, queues, bindings)
- [x] Integrate `RabbitTemplate` into `HistoricalEventService` to publish events on CRUD operations
- [x] Create RabbitMQ Event Listener (Consumer) to process events asynchronously
- [x] Implement stats computation logic and store computed values in Redis (using `RedisTemplate`)
- [x] Add `/api/stats` endpoint to get historical stats from Redis
- [x] Update `docker-compose.dev.yml` to include Redis and RabbitMQ containers

## Phase 3: React + TypeScript Frontend
- [x] Initialize React frontend using Vite (React, TypeScript, CSS) in `frontend/` directory
- [x] Setup folder structure (`components/`, `services/`, `styles/`, etc.)
- [x] Write API client (`services/api.ts`) to communicate with the Spring Boot backend
- [x] Create UI components (Header, StatsDashboard, EventList, EventForm)
- [x] Write styling in `index.css` using modern premium themes
- [x] Setup Dockerfile and Nginx configuration for Frontend
- [x] Add Frontend to `docker-compose.dev.yml`

## Phase 4: Kubernetes Setup (Docker Desktop K8s)
- [x] Create namespace declarations (`k8s/namespaces.yaml`)
- [x] Create Test Environment Manifests under `k8s/test/` (Postgres, Redis, RabbitMQ, Backend, Frontend)
- [x] Create Prod Environment Manifests under `k8s/prod/` (Postgres, Redis, RabbitMQ, Backend, Frontend, Ingress)
- [x] Write a README.md under `k8s/` explaining K8s commands, persistent volumes, and ingress setups

## Phase 5: CI/CD Pipeline (GitHub Actions)
- [x] Create GitHub Actions workflow directories (`.github/workflows/`)
- [x] Create CI workflow to run backend tests and frontend lints
- [x] Create CD workflow for Test namespace (Build & push images to GHCR/Docker Hub, update manifests)
- [x] Create CD workflow for Prod namespace (Build & push images, update prod manifests)

## Phase 6: Interactive Hatay Map Feature
- [x] Create HatayMap.tsx with interactive SVG and Nisanyan-style etymology details
- [x] Add navigation views in App.tsx to toggle between Timeline and Map
- [x] Add retro game style CSS transitions and animations in index.css
- [x] Add .dockerignore to optimize Docker builds


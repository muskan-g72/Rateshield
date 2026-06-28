#  RateShield – Intelligent API Gateway with Sliding Window Rate Limiting

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-success)
![License](https://img.shields.io/badge/License-MIT-yellow)




>RateShield is a production-inspired API Gateway built with FastAPI, React, PostgreSQL and Redis. It provides secure JWT authentication, API key management, Redis-backed sliding window rate limiting using atomic Lua scripts, request analytics and a responsive developer dashboard.
---

##  Live Demo

- **Frontend:** https://rateshield-nine.vercel.app
- **Backend API:** https://rateshield-k9s8.onrender.com
- **Swagger Documentation:** https://rateshield-k9s8.onrender.com/docs

---

##  Features

- JWT-based Authentication & Authorization
- Secure API Key Generation & Revocation
- Redis-backed Sliding Window Rate Limiting (Atomic Lua Script)
- Password & API Key Hashing
- Weather Service Proxy
- Developer Dashboard & Usage Analytics
- Health Checks for PostgreSQL, Redis & Weather Service
- Structured Request Logging Middleware
- Database Migrations with Alembic
- Dockerized Development Environment
- GitHub Actions CI Pipeline
- Responsive React Frontend

---

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL (Neon)
- Redis (Upstash)
- Alembic
- Pydantic
- HTTPX
- Pytest

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Infrastructure

- Docker
- Docker Compose
- Render
- Vercel
- Neon PostgreSQL
- Upstash Redis

---

## Architecture

```text
                 ┌─────────────────────────┐
                 │     React Frontend      │
                 │   (React + TypeScript)  │
                 └────────────┬────────────┘
                              │
                       JWT Authentication
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │         FastAPI API Gateway            │
        │────────────────────────────────────────│
        │ • JWT Authentication                   │
        │ • API Key Management                   │
        │ • Sliding Window Rate Limiter (Redis)  │
        │ • Dashboard APIs                       │
        │ • Logging Middleware                   │
        └───────────┬───────────────┬────────────┘
                    │               │
            Stores Data      Rate Limiting
                    │               │
          ┌─────────▼──────┐  ┌─────▼─────┐
          │   PostgreSQL   │  │   Redis   │
          │ Users & Keys   │  │ Analytics │
          └────────────────┘  └───────────┘
                    │
                    │ HTTP Request
                    ▼
          ┌────────────────────────┐
          │ Weather Microservice   │
          └────────────────────────┘
```
---

## Authentication Flow

1. Register an account
2. Login using email & password
3. Receive JWT Access Token
4. Generate an API Key
5. Access Gateway endpoints using the API Key
6. Sliding Window Rate Limiter validates every request
7. Dashboard displays real-time usage statistics

---

## Dashboard

Each authenticated developer can view:

- Current Subscription Plan
- Total API Keys
- Active API Keys
- Total Requests
- Approved Requests
- Blocked Requests
- Success Rate

---

## Main API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user |
| POST | `/upgrade` | Upgrade to Pro plan |
| GET | `/dashboard` | Usage analytics |
| POST | `/api-keys` | Generate API key |
| GET | `/api-keys` | List API keys |
| DELETE | `/api-keys/{id}` | Revoke API key |
| GET | `/gateway/test` | Protected gateway endpoint |
| GET | `/gateway/weather` | Weather service proxy |
| GET | `/health` | Service health status |

---

## Load Testing (Locust)

Load tested using Locust against the protected gateway endpoint.

| Metric | Value |
|---------|------:|
| Requests Processed | 11,468 |
| Failure Rate | 0% |
| Throughput | ~95 requests/sec |
| Median Latency | 180 ms |
| Average Latency | 204 ms |
| P95 Latency | 460 ms |
| P99 Latency | 640 ms |

### Test Configuration

- 50 Concurrent Users
- Spawn Rate: 5 Users/sec
- FastAPI + Redis + PostgreSQL
- Dockerized Local Environment

---

## Running Locally

Clone the repository

```bash
git clone https://github.com/muskan-g72/Rateshield
cd RateShield
```

### Backend

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker compose up --build
```

---
##  Environment Variables

Configure the following environment variables before running the application:

```env
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/rateshield_db
REDIS_URL=redis://localhost:6379
WEATHER_URL=http://localhost:8001
JWT_SECRET=your_secret_key
```

> Replace the placeholder values with your own database credentials, Redis instance and JWT secret.
---


## Future Improvements

- OAuth2 Authentication (Google/GitHub)
- Configurable Per-Endpoint Rate Limiting
- Prometheus & Grafana Monitoring
- Kubernetes Deployment with Auto-Scaling

---

##  License

This project is licensed under the MIT License.
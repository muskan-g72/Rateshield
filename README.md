# RateShield — API Gateway with Rate Limiting & API Key Authentication

##  Overview

RateShield is a lightweight API Gateway built using FastAPI that provides API key authentication, Redis-based rate limiting, and request analytics. It includes a simple frontend dashboard for testing and monitoring API usage.

---

##  Features

* API Key Authentication system
* Plan-based Rate Limiting (Free & Pro)
* Redis-backed request tracking
* API Gateway proxy (Weather service demo)
* Full-stack frontend dashboard
* Real-time usage statistics

---

##  Architecture

Client → FastAPI Gateway → Redis (Rate Limiting Layer)
                          → SQLite (User & API Key Storage)
                          → Weather Service (Upstream API)
---

##  Tech Stack

* FastAPI
* SQLite (SQLAlchemy)
* Redis
* HTML, CSS, JavaScript
* HTTPX (API calls)

---

##  API Endpoints

### Public

* `POST /register`
* `POST /generate-key`
* `GET /`

### Protected

* `GET /protected`
* `GET /gateway/weather`

### Stats

* `GET /stats`

---
##  Workflow

1. User registers via `/register`
2. System creates a user in SQLite
3. User generates API key via `/generate-key`
4. Client sends API requests with `X-API-Key`
5. FastAPI validates API key
6. Redis checks rate limits per key (time window: 60s)
7. If limit exceeded → request blocked (429)
8. If allowed → request is proxied to Weather Service
9. All requests are tracked in Redis stats
---

##  Project Structure
```text

RateShield/
│
├── main.py                  # FastAPI API Gateway
├── auth.py                 # API key validation
├── limiter.py              # Redis rate limiting logic
├── models.py               # SQLAlchemy models (User, APIKey)
├── database.py             # SQLite DB setup
├── redis_client.py         # Redis connection client
├── weather_service.py      # Mock upstream service
│
├── templates/
│   └── index.html          # Frontend single-page app
│
├── static/
│   ├── css/
│   │   └── style.css       # UI styling
│   └── js/
│       └── app.js          # Frontend logic + API calls
│
├── rateshield.db           # SQLite database (auto-generated)
├── .gitignore              # Ignored files
└── README.md               # Project documentation
```


##  How to Run

### 1. Start Redis (Docker)

```bash
docker run -d --name rateshield-redis -p 6379:6379 redis
```

### 2. Start Backend

```bash
uvicorn main:app --reload
```

### 3. Start Weather Service

```bash
uvicorn weather_service:app --port 8001
```

### 4. Start Frontend

```bash
python -m http.server 8080
```

---

##  Open App

```
http://127.0.0.1:8080/templates/index.html
```

---

##  Example Flow

1. Register user
2. Generate API key
3. Use API in playground
4. View stats in real-time

---

##  Future Improvements

* JWT authentication
* User dashboard analytics
* API key revoke system
* Deployment (Render / AWS)
* Monitoring dashboard

---
##  Note

- Redis must be running locally for rate limiting to work
- Weather service runs as a mock upstream API
- Frontend is a lightweight SPA (no frameworks used)



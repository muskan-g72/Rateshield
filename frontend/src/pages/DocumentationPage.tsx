import { CodeBlock, DocLink, DocSection } from '@/components/docs'
import { Card } from '@/components/ui'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export function DocumentationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">Documentation</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted sm:text-base">
          A quick start guide to RateShield — an API gateway with JWT authentication, API key
          management, rate limiting, and service health monitoring.
        </p>
      </div>

      <DocSection title="Project Overview">
        <p className="text-sm leading-relaxed text-muted">
          RateShield sits between clients and upstream services. Dashboard routes use JWT bearer
          tokens. Gateway routes validate API keys before proxying requests and enforcing plan-based
          rate limits through Redis.
        </p>
      </DocSection>

      <DocSection title="Authentication Flow">
        <p className="text-sm text-muted">
          Register an account, sign in to receive a JWT, then use protected dashboard endpoints with
          the bearer token.
        </p>
        <CodeBlock
          code={`POST ${API_BASE}/register
Content-Type: application/json

{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "password": "securepassword"
}

→ 200 OK
{
  "message": "User created",
  "user_id": 1
}`}
        />
      </DocSection>

      <DocSection title="JWT Authentication">
        <CodeBlock
          code={`POST ${API_BASE}/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securepassword"
}

→ 200 OK
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}

GET ${API_BASE}/protected
Authorization: Bearer <jwt>

→ 200 OK
{
  "message": "success",
  "user": {
    "id": 1,
    "email": "jane@example.com"
  }
}`}
        />
      </DocSection>

      <DocSection title="API Key Flow">
        <CodeBlock
          code={`POST ${API_BASE}/api-keys
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "production-app"
}

→ 200 OK
{
  "id": 1,
  "api_key": "<plaintext-key-shown-once>",
  "name": "production-app",
  "active": true
}

GET ${API_BASE}/api-keys
Authorization: Bearer <jwt>

→ 200 OK
[
  {
    "id": 1,
    "name": "production-app",
    "active": true,
    "created_at": "2026-06-08T12:00:00"
  }
]`}
        />
      </DocSection>

      <DocSection title="Gateway Flow">
        <CodeBlock
          code={`GET ${API_BASE}/gateway/weather
X-API-Key: <your-api-key>

→ 200 OK
{
  "city": "Delhi",
  "temperature": "30°C",
  "condition": "Sunny"
}`}
        />
      </DocSection>

      <DocSection title="Rate Limiting">
        <p className="text-sm text-muted">
          Rate limits are enforced per API key using a sliding window in Redis. Free plans allow 5
          requests per minute. Pro plans allow 100 requests per minute.
        </p>
        <CodeBlock
          code={`Exceeded limit response:

→ 429 Too Many Requests
{
  "detail": "free plan limit exceeded"
}`}
        />
      </DocSection>

      <DocSection title="Health Endpoint">
        <CodeBlock
          code={`GET ${API_BASE}/health

→ 200 OK (all services healthy)
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "weather_service": "healthy"
  }
}

→ 503 Service Unavailable (one or more services unhealthy)
{
  "status": "unhealthy",
  "services": {
    "database": "healthy",
    "redis": "unhealthy",
    "weather_service": "healthy"
  }
}`}
        />
      </DocSection>

      <DocSection title="API Reference Links">
        <div className="grid gap-4 md:grid-cols-2">
          <DocLink
            href={`${API_BASE}/docs`}
            label="Swagger UI"
            description="Interactive OpenAPI documentation for every backend endpoint."
          />
          <DocLink
            href={`${API_BASE}/redoc`}
            label="ReDoc"
            description="Alternative API reference with a readable schema layout."
          />
          <DocLink
            href="https://github.com/muskan-g72/Rateshield"
            label="GitHub Repository"
            description="Source code, architecture notes, and deployment instructions."
          />
        </div>
      </DocSection>

      <Card>
        <p className="text-sm text-muted">
          Need the full request schema? Use Swagger or ReDoc for complete parameter and response
          definitions. This page is a quick start overview only.
        </p>
      </Card>
    </div>
  )
}

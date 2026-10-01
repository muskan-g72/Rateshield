import { CodeBlock, DocLink, DocSection } from '@/components/docs'
import { Card } from '@/components/ui'

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://rateshield-k9s8.onrender.com'

export function DocumentationPage() {
  return (
    <div className="space-y-8 max-w-4xl py-2">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink font-display">
          API Documentation
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">
          Quick start reference for RateShield — an API gateway with JWT session authentication, API key
          management, Redis sliding-window rate limiting, and service health monitoring.
        </p>
      </div>

      <DocSection title="Gateway Overview">
        <p className="text-sm leading-relaxed text-muted">
          RateShield sits between external clients and internal upstream services. Dashboard routes use JWT bearer
          tokens. Gateway routes validate API keys with <code className="font-mono text-xs font-bold text-ink bg-bg px-1.5 py-0.5 rounded-md border border-line">X-API-Key</code> before proxying requests and enforcing plan-based
          rate limits through Redis.
        </p>
      </DocSection>

      <DocSection title="1. Account Registration">
        <p className="text-sm text-muted">
          Register a developer account to receive access to the RateShield control panel.
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

      <DocSection title="2. JWT Authentication & Login">
        <p className="text-sm text-muted">
          Sign in with credentials to receive a signed JWT access token for session management.
        </p>
        <CodeBlock
          code={`POST ${API_BASE}/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securepassword"
}

→ 200 OK
{
  "access_token": "<jwt-bearer-token>",
  "token_type": "bearer"
}

GET ${API_BASE}/protected
Authorization: Bearer <jwt-bearer-token>

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

      <DocSection title="3. API Key Generation">
        <p className="text-sm text-muted">
          Generate API keys for your applications. The plaintext secret is returned only once at creation time.
        </p>
        <CodeBlock
          code={`POST ${API_BASE}/api-keys
Authorization: Bearer <jwt-bearer-token>
Content-Type: application/json

{
  "name": "production-app"
}

→ 200 OK
{
  "id": 1,
  "api_key": "<plaintext-secret-key-shown-once>",
  "name": "production-app",
  "active": true
}

GET ${API_BASE}/api-keys
Authorization: Bearer <jwt-bearer-token>

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

      <DocSection title="4. Rate-Limited Gateway Requests">
        <p className="text-sm text-muted">
          Send upstream calls through the gateway with your API key in the <code className="font-mono text-xs font-bold text-ink bg-bg px-1.5 py-0.5 rounded-md border border-line">X-API-Key</code> header.
        </p>
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

      <DocSection title="5. Sliding-Window Quota & 429 Status">
        <p className="text-sm text-muted">
          Rate limits are enforced per API key using Redis sliding windows. Free plans allow 5
          requests/minute. Pro plans allow 100 requests/minute.
        </p>
        <CodeBlock
          code={`Exceeded quota response:

→ 429 Too Many Requests
{
  "detail": "free plan limit exceeded"
}`}
        />
      </DocSection>

      <DocSection title="6. Service Health Check">
        <CodeBlock
          code={`GET ${API_BASE}/health

→ 200 OK (all services operational)
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "weather_service": "healthy"
  }
}`}
        />
      </DocSection>

      <DocSection title="Interactive OpenAPI & Schemas">
        <div className="grid gap-4 md:grid-cols-2">
          <DocLink
            href={`${API_BASE}/docs`}
            label="Swagger UI"
            description="Interactive OpenAPI documentation with live endpoint try-out."
          />
          <DocLink
            href={`${API_BASE}/redoc`}
            label="ReDoc"
            description="Detailed reference with request and response schemas."
          />
        </div>
      </DocSection>

      <Card>
        <p className="text-xs sm:text-sm text-muted">
          Looking for deployment instructions and architectural diagrams? View the{' '}
          <a
            href="https://github.com/muskan-g72/Rateshield"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-ink underline"
          >
            GitHub repository
          </a>
          .
        </p>
      </Card>
    </div>
  )
}

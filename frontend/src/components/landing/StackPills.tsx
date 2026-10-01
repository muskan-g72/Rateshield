export function StackPills() {
  const stack = [
    { name: 'FastAPI', detail: 'Asynchronous Python Web Gateway' },
    { name: 'Redis 7', detail: 'Sliding Window Rate Limiter' },
    { name: 'PostgreSQL', detail: 'User & API Key Store' },
    { name: 'JWT Auth', detail: 'Secure Bearer Tokens' },
    { name: 'Docker', detail: 'Containerized Deployment' },
    { name: 'React 19', detail: 'Client SPA' },
    { name: 'TypeScript', detail: 'Strict Type Safety' },
    { name: 'Tailwind CSS v4', detail: 'Custom Design Tokens' },
  ]

  return (
    <section className="py-10 border-t-2 border-line">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h3 className="text-lg font-bold font-display text-ink tracking-tight">
          Built with precision tools
        </h3>
        <span className="text-xs font-mono text-muted">
          FastAPI + Redis Sliding-Window Stack
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {stack.map((item) => (
          <div
            key={item.name}
            className="inline-flex items-center gap-2 rounded-full border-2 border-line bg-surface px-4 py-1.5 text-xs transition-colors duration-150 hover:border-ink"
          >
            <span className="font-bold text-ink">{item.name}</span>
            <span className="h-1 w-1 rounded-full bg-muted/50" />
            <span className="font-mono text-muted">{item.detail}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

import { Button } from '@/components/ui/Button'
import { ApiKeyStatusBadge } from '@/components/api-keys/ApiKeyStatusBadge'
import type { ApiKey } from '@/types/apiKeys'
import { formatApiKeyDate } from '@/types/apiKeys'

interface ApiKeyTableProps {
  keys: ApiKey[]
  onRevoke: (key: ApiKey) => void
}

export function ApiKeyTable({ keys, onRevoke }: ApiKeyTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-surface">
          <tr>
            <th className="px-4 py-3 font-semibold text-muted">Name</th>
            <th className="px-4 py-3 font-semibold text-muted">Created</th>
            <th className="px-4 py-3 font-semibold text-muted">Status</th>
            <th className="px-4 py-3 font-semibold text-muted">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr
              key={key.id}
              className="border-b border-border/70 last:border-b-0 transition-colors duration-150 hover:bg-white/[0.02]"
            >
              <td className="px-4 py-3.5 font-medium text-slate-100">{key.name}</td>
              <td className="px-4 py-3.5 text-muted">{formatApiKeyDate(key.created_at)}</td>
              <td className="px-4 py-3.5">
                <ApiKeyStatusBadge active={key.active} />
              </td>
              <td className="px-4 py-3.5 text-right">
                {key.active ? (
                  <Button variant="danger" size="sm" onClick={() => onRevoke(key)}>
                    Revoke
                  </Button>
                ) : (
                  <span className="text-xs text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

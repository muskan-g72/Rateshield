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
    <div className="overflow-x-auto rounded-[18px] border-2 border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-line bg-bg/50">
            <th className="px-5 py-3.5 font-bold font-display text-ink text-xs uppercase tracking-wider">
              Key ID / Prefix
            </th>
            <th className="px-5 py-3.5 font-bold font-display text-ink text-xs uppercase tracking-wider">
              Name
            </th>
            <th className="px-5 py-3.5 font-bold font-display text-ink text-xs uppercase tracking-wider">
              Created Date
            </th>
            <th className="px-5 py-3.5 font-bold font-display text-ink text-xs uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3.5 font-bold font-display text-ink text-xs uppercase tracking-wider text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-line">
          {keys.map((key) => (
            <tr
              key={key.id}
              className="transition-colors duration-150 hover:bg-bg/40"
            >
              {/* Key ID / Prefix in mono */}
              <td className="px-5 py-4 font-mono text-xs font-semibold text-ink whitespace-nowrap">
                <span className="rounded-full border border-line bg-bg px-2.5 py-1 text-ink">
                  key_#{key.id.toString().padStart(4, '0')}
                </span>
              </td>

              {/* Name */}
              <td className="px-5 py-4 font-semibold text-ink whitespace-nowrap">
                {key.name}
              </td>

              {/* Created Date */}
              <td className="px-5 py-4 text-xs font-mono text-muted whitespace-nowrap">
                {formatApiKeyDate(key.created_at)}
              </td>

              {/* Status Badge */}
              <td className="px-5 py-4 whitespace-nowrap">
                <ApiKeyStatusBadge active={key.active} />
              </td>

              {/* Revoke Action */}
              <td className="px-5 py-4 text-right whitespace-nowrap">
                {key.active ? (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onRevoke(key)}
                  >
                    Revoke key
                  </Button>
                ) : (
                  <span className="text-xs font-mono text-muted">Revoked</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

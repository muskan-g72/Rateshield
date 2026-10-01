import { formatSuccessRate } from '@/types/dashboard'

interface StatBarProps {
  approved: number
  blocked: number
  totalRequests: number
  successRate: number
}

export function StatBar({
  approved,
  blocked,
  totalRequests,
  successRate,
}: StatBarProps) {
  const total = approved + blocked || totalRequests || 0
  const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 100
  const blockedPct = total > 0 ? 100 - approvedPct : 0

  return (
    <div className="rounded-[18px] border-2 border-line bg-surface p-5 sm:p-6 text-ink">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-line pb-4 mb-5">
        <div>
          <h3 className="font-bold font-display text-base sm:text-lg text-ink">
            Gateway request ratio
          </h3>
          <p className="text-xs text-muted">
            Proportional split of allowed and rate-limited calls
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-muted">Success rate:</span>
          <span className="rounded-full bg-ok-bg border border-ok/40 px-3 py-0.5 text-xs font-mono font-bold text-ok">
            {formatSuccessRate(successRate)}
          </span>
        </div>
      </div>

      {/* Proportional Bar */}
      <div
        className="relative h-7 w-full overflow-hidden rounded-full border-2 border-ink bg-bg flex shadow-inner"
        role="progressbar"
        aria-valuenow={approvedPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Approved requests: ${approvedPct}%, Blocked requests: ${blockedPct}%`}
      >
        {total === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-xs font-mono font-semibold text-muted">
            No gateway traffic recorded yet
          </div>
        ) : (
          <>
            {/* Approved (Green) */}
            <div
              style={{ width: `${approvedPct}%` }}
              className="h-full bg-ok transition-all duration-300 flex items-center justify-center text-[11px] font-mono font-bold text-white px-2 overflow-hidden whitespace-nowrap"
              title={`Approved: ${approved.toLocaleString()} (${approvedPct}%)`}
            >
              {approvedPct >= 12 ? `${approvedPct}%` : ''}
            </div>

            {/* Blocked (Coral) */}
            {blockedPct > 0 && (
              <div
                style={{ width: `${blockedPct}%` }}
                className="h-full bg-no transition-all duration-300 flex items-center justify-center text-[11px] font-mono font-bold text-white px-2 overflow-hidden whitespace-nowrap"
                title={`Blocked: ${blocked.toLocaleString()} (${blockedPct}%)`}
              >
                {blockedPct >= 12 ? `${blockedPct}%` : ''}
              </div>
            )}
          </>
        )}
      </div>

      {/* Legend & Exact Counts */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 pt-4 border-t border-line">
        {/* Approved Count Card */}
        <div className="flex items-center justify-between rounded-[12px] border-2 border-ok/40 bg-ok-bg/30 p-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-ok shrink-0" aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-ink">Approved</span>
              <p className="text-[11px] font-mono text-muted">200 OK passed</p>
            </div>
          </div>
          <span className="font-mono text-lg font-extrabold text-ok">
            {approved.toLocaleString()}
          </span>
        </div>

        {/* Blocked Count Card */}
        <div className="flex items-center justify-between rounded-[12px] border-2 border-no/40 bg-no-bg/30 p-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rotate-45 rounded-[1px] bg-no shrink-0" aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-ink">Blocked</span>
              <p className="text-[11px] font-mono text-muted">429 Rate limited</p>
            </div>
          </div>
          <span className="font-mono text-lg font-extrabold text-no">
            {blocked.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

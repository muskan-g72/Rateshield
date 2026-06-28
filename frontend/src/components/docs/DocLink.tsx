interface DocLinkProps {
  href: string
  label: string
  description: string
}

export function DocLink({ href, label, description }: DocLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-border bg-surface-raised p-4 transition-colors duration-150 hover:border-primary/40 hover:bg-surface"
    >
      <p className="font-semibold text-primary">{label}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </a>
  )
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2)
}

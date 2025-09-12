export const days = Array.from({ length: 31 }, (_, i) => String(i + 1))

export function makeYears(count = 100): string[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: count }, (_, i) => String(currentYear - i))
}

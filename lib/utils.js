export const COLORS = ['#4F46E5', '#D97706', '#16A34A', '#DC2626', '#7C3AED', '#0891B2']

export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) {
    const h = Math.floor(s / 3600)
    return `${h} hour${h > 1 ? 's' : ''} ago`
  }
  const d = Math.floor(s / 86400)
  return `${d} day${d > 1 ? 's' : ''} ago`
}

export function avatarInitials(name) {
  if (!name || name === 'Anonymous') return 'AN'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function randColor(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return COLORS[Math.abs(h) % COLORS.length]
}

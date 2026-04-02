export default function Spinner({ size = 'md', color = 'blue' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  }
  const colors = {
    blue:  'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray:  'border-slate-300 border-t-transparent',
  }
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  )
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-1">
        {icon}
      </div>
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  )
}
const CONFIG = {
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  active:    { label: 'Active',    cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  ongoing:   { label: 'Ongoing',   cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200' },
}

export default function StatusBadge({ status }) {
  const c = CONFIG[status] || CONFIG.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${c.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {c.label}
    </span>
  )
}
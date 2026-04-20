export function StatsSkeletons() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-zinc-900 border border-zinc-800"
          />
        ))}
      </div>

      {/* Chart + Countries row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-xl bg-zinc-900 border border-zinc-800" />
        <div className="h-72 rounded-xl bg-zinc-900 border border-zinc-800" />
      </div>

      {/* Endpoints section */}
      <div className="h-64 rounded-xl bg-zinc-900 border border-zinc-800" />
      <div className="h-64 rounded-xl bg-zinc-900 border border-zinc-800" />
    </div>
  )
}

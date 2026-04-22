"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface EndpointData {
  endpoint: string
  total_requests: number
  cantidad_errores: number
  tasa_error: number
  callers_unicos: number
  latencia_promedio_ms: number
}

interface Props {
  endpoints: EndpointData[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as EndpointData
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 backdrop-blur p-3 text-xs shadow-xl max-w-[240px]">
      <p className="font-mono text-[10px] text-zinc-400 break-all mb-2">{d?.endpoint}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Requests</span>
          <span className="font-semibold text-white font-mono">
            {d?.total_requests.toLocaleString("es-AR")}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Latencia</span>
          <span className="font-semibold text-white font-mono">
            {d?.latencia_promedio_ms.toLocaleString("es-AR")} ms
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Tasa error</span>
          <span className="font-semibold text-[#E24B4A] font-mono">
            {d?.tasa_error.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}

/** Keep just the last N chars of a path so it's readable in tight spaces */
function truncateEndpoint(ep: string, maxLen = 22) {
  if (ep.length <= maxLen) return ep
  return "…" + ep.slice(ep.length - (maxLen - 1))
}

export function EndpointsChart({ endpoints }: Props) {
  // Aggregate by endpoint in case the API returns multiple rows for the same endpoint
  const aggregated = new Map<string, EndpointData>()
  for (const e of endpoints) {
    if (!aggregated.has(e.endpoint)) {
      aggregated.set(e.endpoint, { ...e })
    } else {
      const existing = aggregated.get(e.endpoint)!
      const totalReqs = existing.total_requests + e.total_requests
      const totalErrors = existing.cantidad_errores + e.cantidad_errores
      aggregated.set(e.endpoint, {
        ...existing,
        total_requests: totalReqs,
        cantidad_errores: totalErrors,
        tasa_error: totalReqs > 0 ? (totalErrors / totalReqs) * 100 : 0,
        callers_unicos: Math.max(existing.callers_unicos, e.callers_unicos),
        latencia_promedio_ms: Math.round(
          (existing.latencia_promedio_ms + e.latencia_promedio_ms) / 2
        ),
      })
    }
  }

  const top10 = [...aggregated.values()]
    .sort((a, b) => b.total_requests - a.total_requests)
    .slice(0, 10)

  // Use endpoint as dataKey directly; tickFormatter handles display truncation.
  // Avoid creating a field named "label" — it's a reserved Recharts prop.
  const chartData = top10

  // Dynamic height: each bar ~28px + some padding
  const chartHeight = Math.max(220, chartData.length * 32)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-white mb-1">Top Endpoints por Volumen</h2>
      <p className="text-xs text-zinc-500 mb-4">Requests acumulados · últimos 30 días</p>

      {/* Scroll container on very small screens so the chart doesn't crush */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div style={{ minWidth: 300, height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#71717a", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                }
              />
              <YAxis
                type="category"
                dataKey="endpoint"
                width={140}
                tick={{
                  fill: "#a1a1aa",
                  fontSize: 10,
                  fontFamily: "Geist Mono, monospace",
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => truncateEndpoint(v)}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(127,119,221,0.06)" }}
              />
              <Bar
                dataKey="total_requests"
                name="Requests"
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "#7F77DD"
                        : `rgba(127,119,221,${Math.max(0.3, 1 - index * 0.07)})`
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

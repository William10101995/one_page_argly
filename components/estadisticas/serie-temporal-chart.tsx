"use client"

import { useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface RawPoint {
  hour: string
  total_requests: number
  error_count: number
  avg_response_ms: number
}

interface Props {
  serie: RawPoint[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 backdrop-blur p-3 text-xs shadow-xl">
      <p className="font-semibold text-zinc-300 mb-2">{point?.fullLabel}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-zinc-400">{entry.name}:</span>
          <span className="font-mono font-semibold text-white">
            {entry.value.toLocaleString("es-AR")}
          </span>
        </div>
      ))}
    </div>
  )
}

export function SerieTemporalChart({ serie }: Props) {
  // Agrupamos aquí en el cliente para no depender de caché del servidor.
  // Múltiples filas con el mismo `hour` se suman en una sola.
  const chartData = useMemo(() => {
    const map = new Map<string, { hour: string; requests: number; errores: number; latencias: number[] }>()

    for (const p of serie) {
      if (!map.has(p.hour)) {
        map.set(p.hour, { hour: p.hour, requests: 0, errores: 0, latencias: [] })
      }
      const g = map.get(p.hour)!
      g.requests += p.total_requests ?? 0
      g.errores += p.error_count ?? 0
      if (p.avg_response_ms != null) g.latencias.push(p.avg_response_ms)
    }

    return Array.from(map.values())
      .sort((a, b) => a.hour.localeCompare(b.hour))
      .map((g) => ({
        hour: g.hour,
        requests: g.requests,
        errores: g.errores,
        label: format(parseISO(g.hour), "HH:mm", { locale: es }),
        fullLabel: format(parseISO(g.hour), "dd/MM HH:mm", { locale: es }),
      }))
  }, [serie])

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 h-full">
      <h2 className="text-sm font-semibold text-white mb-1">Serie Temporal</h2>
      <p className="text-xs text-zinc-500 mb-4">
        Requests y errores por hora · {chartData.length} punto{chartData.length !== 1 ? "s" : ""}
      </p>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7F77DD" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7F77DD" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradErrors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E24B4A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E24B4A" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

            <XAxis
              dataKey="label"
              interval={0}
              tick={{ fill: "#71717a", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              width={36}
              tick={{ fill: "#71717a", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
              }
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
            />

            <Area
              type="monotone"
              dataKey="requests"
              name="Requests"
              stroke="#7F77DD"
              strokeWidth={2}
              fill="url(#gradRequests)"
              dot={{ r: 3, fill: "#7F77DD", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="errores"
              name="Errores"
              stroke="#E24B4A"
              strokeWidth={2}
              fill="url(#gradErrors)"
              dot={{ r: 3, fill: "#E24B4A", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

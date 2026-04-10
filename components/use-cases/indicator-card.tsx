"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"
import { Activity, LucideIcon } from "lucide-react"

// ── Types ────────────────────────────────────────────────────────
type DailyData = { fecha: string; valor: number }
type MonthlyData = { mes: number; anio: number; nombre_mes: string; valor: number }

type IndicatorConfig = {
  id: string
  title: string
  description: string
  apiUrl: string
  icon: LucideIcon
  /** colour pair for gradient + stroke */
  colorFrom: string
  colorTo: string
  strokeColor: string
  /** if true, data shape is monthly (IPC), otherwise daily */
  isMonthly?: boolean
  /** Format used in the value badge */
  valueFormat?: (v: number) => string
  /** How many recent data-points to show on chart */
  chartSlice?: number
}

// ── Helper: parse "DD/MM/YYYY" → Date ────────────────────────────
function parseDMY(s: string): Date {
  const [d, m, y] = s.split("/")
  return new Date(Number(y), Number(m) - 1, Number(d))
}

// ── Main component ───────────────────────────────────────────────
export function IndicatorCard({ config, index = 0 }: { config: IndicatorConfig; index?: number }) {
  const [rawData, setRawData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(config.apiUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setRawData(json.data ?? [])
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [config.apiUrl])

  // Normalise data for the chart
  const { chartData, latestValue, latestLabel } = useMemo(() => {
    if (!rawData.length)
      return { chartData: [], latestValue: null, latestLabel: "" }

    // Special handling for Canasta (CBT/CBA)
    if (rawData[0].periodo) {
      const typed = rawData as any[]
      const key = config.id as "cbt" | "cba"
      const sliced = typed.slice(-(config.chartSlice ?? 24))
      const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
      const fullMonths = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
      
      const chartData = sliced.map((d) => {
        const [year, month] = d.periodo.split("-")
        return {
          label: `${months[parseInt(month) - 1]} ${year.slice(2)}`,
          valor: Math.round(d[key].adulto_equivalente),
        }
      })
      
      const last = typed[typed.length - 1]
      const [y, m] = last.periodo.split("-")
      
      return {
        chartData,
        latestValue: Math.round(last[key].adulto_equivalente),
        latestLabel: `${fullMonths[parseInt(m) - 1]} ${y}`,
      }
    }

    if (config.isMonthly) {
      // IPC style
      const typed = rawData as MonthlyData[]
      const sliced = typed.slice(-(config.chartSlice ?? 24))
      const chartData = sliced.map((d) => ({
        label: `${d.nombre_mes.slice(0, 3)} ${String(d.anio).slice(2)}`,
        valor: d.valor,
      }))
      const last = typed[typed.length - 1]
      return {
        chartData,
        latestValue: last.valor,
        latestLabel: `${last.nombre_mes} ${last.anio}`,
      }
    }

    // Daily style (ICL / UVA / UVI / CER)
    const typed = rawData as DailyData[]
    // Sample ~one per month for last ~12 months or use last N points
    const sliceSize = config.chartSlice ?? 90
    const sliced = typed.slice(-sliceSize)

    // For a clean chart, sample every Nth day if too many points
    const maxPoints = 60
    let sampled = sliced
    if (sliced.length > maxPoints) {
      const step = Math.ceil(sliced.length / maxPoints)
      sampled = sliced.filter((_, i) => i % step === 0)
      // Always include last
      if (sampled[sampled.length - 1] !== sliced[sliced.length - 1]) {
        sampled.push(sliced[sliced.length - 1])
      }
    }

    const chartData = sampled.map((d) => {
      const date = parseDMY(d.fecha)
      return {
        label: `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(2)}`,
        valor: d.valor,
      }
    })

    const last = typed[typed.length - 1]
    const lastDate = parseDMY(last.fecha)
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
    return {
      chartData,
      latestValue: last.valor,
      latestLabel: `${lastDate.getDate()} ${months[lastDate.getMonth()]} ${lastDate.getFullYear()}`,
    }
  }, [rawData, config])

  const Icon = config.icon
  const gradientId = `grad-${config.id}`

  const formatValue = config.valueFormat ?? ((v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 2 }))

  // ── Loading state ──────────────────────────────────────────────
  if (loading)
    return (
      <Card className="h-full bg-card/40 backdrop-blur-md border border-border/50 shadow-xl overflow-hidden min-h-[420px] flex items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground animate-pulse gap-3">
          <Activity className="h-7 w-7" />
          <p className="text-sm">Obteniendo datos…</p>
        </div>
      </Card>
    )

  if (error)
    return (
      <Card className="h-full bg-card/40 backdrop-blur-md border border-destructive/50 overflow-hidden min-h-[420px] flex items-center justify-center">
        <p className="text-destructive font-medium text-sm px-6 text-center">Error: {error}</p>
      </Card>
    )

  // ── Rendered card ──────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-card/40 backdrop-blur-xl border border-border/50 shadow-[0_0_30px_rgba(var(--primary),0.04)] overflow-hidden hover:border-primary/30 transition-all duration-300 group min-w-0">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-border/20 pb-5 gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className="h-5 w-5" style={{ color: config.strokeColor }} />
              {config.title}
            </CardTitle>
            <CardDescription className="text-xs">{config.description}</CardDescription>
          </div>

          <div className="flex flex-col items-start sm:items-end bg-background/50 backdrop-blur-md rounded-xl p-3 border border-border/50 shrink-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1 capitalize">
              {latestLabel}
            </span>
            <span
              className="text-2xl font-black bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${config.colorFrom}, ${config.colorTo})`,
              }}
            >
              {latestValue !== null ? formatValue(latestValue) : "—"}
              {config.isMonthly ? "%" : ""}
            </span>
          </div>
        </CardHeader>

        {/* Chart */}
        <div className="pt-5 pb-3 flex-1 min-w-0 overflow-hidden">
          <div className="h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.colorFrom} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={config.colorTo} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="oklch(0.28 0 0)"
                  tick={{ fill: "oklch(0.55 0 0)", fontSize: 10 }}
                  tickMargin={12}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis
                  stroke="oklch(0.28 0 0)"
                  tick={{ fill: "oklch(0.55 0 0)", fontSize: 10 }}
                  tickFormatter={(v) => {
                    if (config.id === "cbt" || config.id === "cba") {
                      return `$${(v / 1000).toFixed(0)}k`
                    }
                    return config.isMonthly
                      ? `${v}%`
                      : v >= 1000
                        ? `${(v / 1000).toFixed(1)}k`
                        : String(v)
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.85)",
                    borderColor: "oklch(0.28 0 0)",
                    borderRadius: "8px",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => {
                    if (config.id === "cbt" || config.id === "cba") {
                      return [`$${value.toLocaleString("es-AR")}`, config.title]
                    }
                    return [
                      config.isMonthly
                        ? `${value}%`
                        : value.toLocaleString("es-AR", { maximumFractionDigits: 2 }),
                      config.title,
                    ]
                  }}
                  labelStyle={{ color: "oklch(0.65 0 0)", fontSize: 11 }}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke={config.strokeColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${gradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

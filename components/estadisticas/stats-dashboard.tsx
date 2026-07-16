"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Activity, AlertCircle, Users, Zap } from "lucide-react"
import { SerieTemporalChart } from "./serie-temporal-chart"
import { EndpointsChart } from "./endpoints-chart"
import { StatsSkeletons } from "./stats-skeletons"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Snapshot {
  total_requests: number
  error_count: number
  unique_callers: number
  avg_response_ms: number | null
}

interface Resumen {
  last_24h: Snapshot
  prev_24h: Snapshot
}

interface SeriePoint {
  hour: string
  total_requests: number
  error_count: number
  avg_response_ms: number
}

interface EndpointData {
  endpoint: string
  total_requests: number
  cantidad_errores: number
  tasa_error: number
  callers_unicos: number
  latencia_promedio_ms: number
}

interface PaisData {
  country: string
  requests: number
  pct: number
}

interface StatsData {
  resumen: Resumen
  serie: SeriePoint[]
  endpoints: EndpointData[]
  paises: PaisData[]
}

// ─── Data fetching ────────────────────────────────────────────────────────────

const BASE = "https://api.argly.com.ar/api/admin/estadisticas"

/** Agrupa las filas de serie-temporal por hora y suma los valores. */
function agregarSerie(raw: any[]): SeriePoint[] {
  const map = new Map<
    string,
    { hour: string; total_requests: number; error_count: number; latencias: number[] }
  >()

  for (const p of raw) {
    if (!map.has(p.hour)) {
      map.set(p.hour, { hour: p.hour, total_requests: 0, error_count: 0, latencias: [] })
    }
    const g = map.get(p.hour)!
    g.total_requests += p.total_requests ?? 0
    g.error_count += p.error_count ?? 0
    if (p.avg_response_ms != null) g.latencias.push(p.avg_response_ms)
  }

  return Array.from(map.values())
    .sort((a, b) => a.hour.localeCompare(b.hour))
    .map((g) => ({
      hour: g.hour,
      total_requests: g.total_requests,
      error_count: g.error_count,
      avg_response_ms:
        g.latencias.length > 0
          ? Math.round(g.latencias.reduce((a, b) => a + b, 0) / g.latencias.length)
          : 0,
    }))
}

async function fetchAllStats(): Promise<StatsData> {
  const emptySnapshot: Snapshot = { total_requests: 0, error_count: 0, unique_callers: 0, avg_response_ms: 0 }
  const fallback: StatsData = {
    resumen: { last_24h: emptySnapshot, prev_24h: emptySnapshot },
    serie: [],
    endpoints: [],
    paises: [],
  }

  try {
    const [resumen, serie, endpoints, paises] = await Promise.all([
      fetch(`${BASE}/resumen`).then((r) => r.json()),
      fetch(`${BASE}/serie-temporal`).then((r) => r.json()),
      fetch(`${BASE}/endpoints`).then((r) => r.json()),
      fetch(`${BASE}/paises`).then((r) => r.json()),
    ])

    return {
      resumen: resumen.data ?? resumen,
      serie: agregarSerie(serie.data ?? serie),
      endpoints: endpoints.data ?? endpoints,
      paises: paises.data ?? paises,
    }
  } catch {
    return fallback
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined) {
  if (n == null) return "—"
  return n.toLocaleString("es-AR")
}

function delta(current: number, prev: number): number | null {
  if (prev === 0) return null
  return ((current - prev) / prev) * 100
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiProps {
  label: string
  value: string
  deltaValue: number | null
  /** When true, a negative delta is good (e.g. errors, latency) */
  lowerIsBetter?: boolean
  icon: React.ReactNode
  suffix?: string
  period?: string
}

function KpiCard({ label, value, deltaValue, lowerIsBetter = false, icon, suffix, period }: KpiProps) {
  const isPositive = deltaValue !== null && deltaValue > 0
  const isGood = lowerIsBetter ? !isPositive : isPositive
  const deltaColor = deltaValue === null ? "text-zinc-500" : isGood ? "text-emerald-400" : "text-red-400"

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:p-5 overflow-hidden group hover:border-[#7F77DD]/40 transition-all duration-300">
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(127,119,221,0.06),transparent_60%)]" />

      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider leading-tight">{label}</span>
        <span className="p-1 sm:p-1.5 rounded-lg bg-[#7F77DD]/10 text-[#7F77DD] flex-shrink-0">{icon}</span>
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">
          {value}
        </span>
        {suffix && <span className="text-xs sm:text-sm text-zinc-500 mb-0.5">{suffix}</span>}
      </div>

      {period && (
        <p className="text-[10px] text-zinc-600 mt-1">{period}</p>
      )}

      {deltaValue !== null && (
        <div className={`flex items-center gap-1 mt-1 text-[10px] sm:text-xs ${deltaColor}`}>
          {isPositive ? (
            <ArrowUp className="w-3 h-3 flex-shrink-0" />
          ) : (
            <ArrowDown className="w-3 h-3 flex-shrink-0" />
          )}
          <span className="font-mono font-semibold">
            {Math.abs(deltaValue).toFixed(1)}%
          </span>
          <span className="text-zinc-500 hidden sm:inline">vs 24h anteriores</span>
        </div>
      )}
    </div>
  )
}

// ─── Countries List ────────────────────────────────────────────────────────────

/**
 * Derives a country flag emoji from an ISO 3166-1 alpha-2 code.
 * Each letter maps to a Regional Indicator Symbol (U+1F1E6–U+1F1FF),
 * so any valid 2-letter code automatically yields the correct flag.
 */
function getFlag(code: string): string {
  if (!code || code === "Unknown" || code.length !== 2) return "🌐"
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("")
}

function CountriesList({ paises }: { paises: PaisData[] }) {
  // Top 10 by volume (Unknown included if it ranks in top 10)
  const sorted = [...paises]
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10)

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 h-full flex flex-col items-center justify-center">
        <p className="text-sm text-zinc-500">Sin datos de distribución geográfica</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 h-full">
      <h2 className="text-sm font-semibold text-white mb-1">Distribución por País</h2>
      <p className="text-xs text-zinc-500 mb-4">Volumen de requests · últimos 7 días</p>

      <div className="space-y-3">
        {sorted.map((p) => (
          <div key={p.country}>
            <div className="flex items-center justify-between mb-1 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base leading-none flex-shrink-0">
                  {getFlag(p.country)}
                </span>
                <span className="text-sm text-zinc-300 font-medium truncate">{p.country}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-zinc-500 font-mono tabular-nums">
                  {p.requests.toLocaleString("es-AR")}
                </span>
                <span className="text-xs font-semibold text-[#7F77DD] font-mono w-11 text-right tabular-nums">
                  {p.pct.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${p.pct}%`,
                  background: "linear-gradient(90deg, #7F77DD, #a59cf5)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


// ─── Main Dashboard ────────────────────────────────────────────────────────────

export function StatsDashboard() {
  const [data, setData] = useState<StatsData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchAllStats()
      .then(setData)
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-red-300 font-medium">Error al cargar las estadísticas</p>
        <p className="text-zinc-500 text-sm mt-1">Intentá nuevamente en unos momentos.</p>
      </div>
    )
  }

  if (!data) {
    return <StatsSkeletons />
  }

  const { resumen, serie, endpoints, paises } = data
  const { last_24h, prev_24h } = resumen

  const kpis: KpiProps[] = [
    {
      label: "Requests",
      value: fmt(last_24h.total_requests),
      deltaValue: delta(last_24h.total_requests, prev_24h.total_requests),
      lowerIsBetter: false,
      icon: <Activity className="w-4 h-4" />,
      period: "Últimas 24 horas",
    },
    {
      label: "Errores",
      value: fmt(last_24h.error_count),
      deltaValue: delta(last_24h.error_count, prev_24h.error_count),
      lowerIsBetter: true,
      icon: <AlertCircle className="w-4 h-4" />,
      period: "Últimas 24 horas",
    },
    {
      label: "Usuarios únicos",
      value: fmt(last_24h.unique_callers),
      deltaValue: delta(last_24h.unique_callers, prev_24h.unique_callers),
      lowerIsBetter: false,
      icon: <Users className="w-4 h-4" />,
      period: "Últimas 24 horas",
    },
    {
      label: "Latencia media",
      value: fmt(last_24h.avg_response_ms),
      deltaValue:
        last_24h.avg_response_ms != null && prev_24h.avg_response_ms != null
          ? delta(last_24h.avg_response_ms, prev_24h.avg_response_ms)
          : null,
      lowerIsBetter: true,
      icon: <Zap className="w-4 h-4" />,
      suffix: "ms",
      period: "Últimas 24 horas",
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* KPI Cards: 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Chart + Countries: stacks on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <SerieTemporalChart serie={serie} />
        </div>
        <div className="h-full">
          <CountriesList paises={paises} />
        </div>
      </div>

      {/* Top Endpoints Chart */}
      <EndpointsChart endpoints={endpoints} />
    </div>
  )
}

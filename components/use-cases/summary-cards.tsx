"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Home,
  Landmark,
  Building2,
  BadgeDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Utensils
} from "lucide-react"

// ── Types ────────────────────────────────────────────────────────
type MonthlyItem = { mes: number; anio: number; nombre_mes: string; valor: number }
type DailyItem = { fecha: string; valor: number }

type SummaryDef = {
  id: string
  title: string
  subtitle: string
  apiUrl: string
  isMonthly: boolean
  icon: React.ReactNode
  colorFrom: string
  colorTo: string
  valueFormat: (v: number) => string
}

function parseDMY(s: string): Date {
  const [d, m, y] = s.split("/")
  return new Date(Number(y), Number(m) - 1, Number(d))
}

const SUMMARIES: SummaryDef[] = [
  {
    id: "ipc",
    title: "IPC",
    subtitle: "Inflación mensual",
    apiUrl: "https://api.argly.com.ar/api/ipc/history",
    isMonthly: true,
    icon: <TrendingUp className="h-5 w-5" />,
    colorFrom: "#22d3ee",
    colorTo: "#3b82f6",
    valueFormat: (v) => `${v}%`,
  },
  {
    id: "icl",
    title: "ICL",
    subtitle: "Contratos de locación",
    apiUrl: "https://api.argly.com.ar/api/icl/history",
    isMonthly: false,
    icon: <Home className="h-5 w-5" />,
    colorFrom: "#a78bfa",
    colorTo: "#7c3aed",
    valueFormat: (v) => v.toLocaleString("es-AR", { maximumFractionDigits: 2 }),
  },
  {
    id: "uva",
    title: "UVA",
    subtitle: "Unidad de Valor Adquisitivo",
    apiUrl: "https://api.argly.com.ar/api/uva/history",
    isMonthly: false,
    icon: <Landmark className="h-5 w-5" />,
    colorFrom: "#34d399",
    colorTo: "#059669",
    valueFormat: (v) => `$${v.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`,
  },
  {
    id: "uvi",
    title: "UVI",
    subtitle: "Unidad de Vivienda",
    apiUrl: "https://api.argly.com.ar/api/uvi/history",
    isMonthly: false,
    icon: <Building2 className="h-5 w-5" />,
    colorFrom: "#fb923c",
    colorTo: "#ea580c",
    valueFormat: (v) => `$${v.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`,
  },
  {
    id: "cer",
    title: "CER",
    subtitle: "Coef. de Estabilización",
    apiUrl: "https://api.argly.com.ar/api/cer/history",
    isMonthly: false,
    icon: <BadgeDollarSign className="h-5 w-5" />,
    colorFrom: "#f472b6",
    colorTo: "#db2777",
    valueFormat: (v) => v.toLocaleString("es-AR", { maximumFractionDigits: 4 }),
  },
  {
    id: "cbt",
    title: "CBT",
    subtitle: "Canasta Básica Total",
    apiUrl: "https://api.argly.com.ar/api/canasta/history",
    isMonthly: true,
    icon: <ShoppingBag className="h-5 w-5" />,
    colorFrom: "#6366f1",
    colorTo: "#4f46e5",
    valueFormat: (v) => `$${v.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`,
  },
  {
    id: "cba",
    title: "CBA",
    subtitle: "Canasta Alimentaria",
    apiUrl: "https://api.argly.com.ar/api/canasta/history",
    isMonthly: true,
    icon: <Utensils className="h-5 w-5" />,
    colorFrom: "#f59e0b",
    colorTo: "#d97706",
    valueFormat: (v) => `$${v.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`,
  },
]

type ResolvedSummary = {
  def: SummaryDef
  value: number
  dateLabel: string
  prevValue: number | null
  changePercent: number | null
}

export function SummaryCards() {
  const [cards, setCards] = useState<ResolvedSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all(
      SUMMARIES.map(async (def) => {
        try {
          const res = await fetch(def.apiUrl)
          const json = await res.json()
          const data = json.data as any[]
          if (!data?.length) return null

          let last: any
          let prev: any
          let dateLabel: string = ""
          let value: number = 0

          if (def.id === "cbt" || def.id === "cba") {
            const items = data as any[]
            const lastItem = items[items.length - 1]
            const prevItem = items.length >= 2 ? items[items.length - 2] : null
            
            const key = def.id as "cbt" | "cba"
            value = Math.round(lastItem[key].adulto_equivalente)
            const prevValue = prevItem ? Math.round(prevItem[key].adulto_equivalente) : null
            
            const [year, month] = lastItem.periodo.split("-")
            const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
            dateLabel = `${months[parseInt(month) - 1]} ${year}`

            return {
              def,
              value,
              dateLabel,
              prevValue,
              changePercent: prevValue ? parseFloat(((value - prevValue) / prevValue * 100).toFixed(1)) : null
            } as ResolvedSummary
          }

          if (def.isMonthly) {
            const items = data as MonthlyItem[]
            const lastItem = items[items.length - 1]
            const prevItem = items.length >= 2 ? items[items.length - 2] : null
            return {
              def,
              value: lastItem.valor,
              dateLabel: `${lastItem.nombre_mes} ${lastItem.anio}`,
              prevValue: prevItem?.valor ?? null,
              changePercent:
                prevItem ? parseFloat(((lastItem.valor - prevItem.valor) / prevItem.valor * 100).toFixed(1)) : null,
            } as ResolvedSummary
          }

          // Daily
          const items = data as DailyItem[]
          const lastItem = items[items.length - 1]
          // Find value ~30 days ago
          const prev30 = items.length >= 31 ? items[items.length - 31] : null
          const lastDate = parseDMY(lastItem.fecha)
          const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
          return {
            def,
            value: lastItem.valor,
            dateLabel: `${lastDate.getDate()} ${months[lastDate.getMonth()]} ${lastDate.getFullYear()}`,
            prevValue: prev30?.valor ?? null,
            changePercent:
              prev30
                ? parseFloat(((lastItem.valor - prev30.valor) / prev30.valor * 100).toFixed(2))
                : null,
          } as ResolvedSummary
        } catch {
          return null
        }
      })
    ).then((results) => {
      setCards(results.filter(Boolean) as ResolvedSummary[])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-[130px] rounded-xl bg-card/30 border border-border/40 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {cards.map((card, i) => {
        const isUp = card.changePercent !== null && card.changePercent >= 0
        return (
          <motion.div
            key={card.def.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <div
              className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl p-4 overflow-hidden group hover:border-primary/30 transition-all duration-300 cursor-default"
              style={{
                boxShadow: `0 0 30px color-mix(in srgb, ${card.def.colorFrom} 6%, transparent)`,
              }}
            >
              {/* Subtle corner glow */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 group-hover:opacity-40 transition-opacity blur-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${card.def.colorFrom}, transparent 70%)`,
                }}
              />

              {/* Icon + Title */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="p-1.5 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${card.def.colorFrom}22, ${card.def.colorTo}22)`,
                    color: card.def.colorFrom,
                  }}
                >
                  {card.def.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{card.def.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{card.def.subtitle}</p>
                </div>
              </div>

              {/* Value */}
              <p
                className="text-xl font-black bg-clip-text text-transparent mb-1"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${card.def.colorFrom}, ${card.def.colorTo})`,
                }}
              >
                {card.def.valueFormat(card.value)}
              </p>

              {/* Change badge + date */}
              <div className="flex items-center gap-2">
                {card.changePercent !== null && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      isUp
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(card.changePercent)}%
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground capitalize">{card.dateLabel}</span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

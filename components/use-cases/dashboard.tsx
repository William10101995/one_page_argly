"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  Home,
  Landmark,
  Building2,
  BadgeDollarSign,
  Calculator,
  Waves,
  ArrowRight,
  Pill,
  ShoppingBag,
  Utensils,
  HardHat,
  Hammer
} from "lucide-react"
import { SummaryCards } from "./summary-cards"
import { IndicatorCard } from "./indicator-card"

const indicators = [
  {
    id: "ipc",
    title: "IPC Nacional",
    description: "Índice de Precios al Consumidor – Variación porcentual mensual publicada por INDEC.",
    apiUrl: "https://api.argly.com.ar/api/ipc/history",
    icon: TrendingUp,
    colorFrom: "#22d3ee",
    colorTo: "#3b82f6",
    strokeColor: "#22d3ee",
    isMonthly: true,
    valueFormat: (v: number) => `${v}`,
    chartSlice: 24,
  },
  {
    id: "icl",
    title: "ICL – Índice para Contratos de Locación",
    description: "Índice diario del BCRA para la actualización de contratos de alquiler.",
    apiUrl: "https://api.argly.com.ar/api/icl/history",
    icon: Home,
    colorFrom: "#a78bfa",
    colorTo: "#7c3aed",
    strokeColor: "#a78bfa",
    chartSlice: 365,
  },
  {
    id: "uva",
    title: "UVA – Unidad de Valor Adquisitivo",
    description: "Valor diario publicado por el BCRA, utilizado para créditos hipotecarios UVA.",
    apiUrl: "https://api.argly.com.ar/api/uva/history",
    icon: Landmark,
    colorFrom: "#34d399",
    colorTo: "#059669",
    strokeColor: "#34d399",
    valueFormat: (v: number) => `$${v.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`,
    chartSlice: 365,
  },
  {
    id: "uvi",
    title: "UVI – Unidad de Vivienda",
    description: "Índice del BCRA para préstamos de vivienda, basado en el costo de construcción.",
    apiUrl: "https://api.argly.com.ar/api/uvi/history",
    icon: Building2,
    colorFrom: "#fb923c",
    colorTo: "#ea580c",
    strokeColor: "#fb923c",
    valueFormat: (v: number) => `$${v.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`,
    chartSlice: 365,
  },
  {
    id: "cer",
    title: "CER – Coeficiente de Estabilización de Referencia",
    description: "Coeficiente del BCRA utilizado para indexar deudas y contratos financieros.",
    apiUrl: "https://api.argly.com.ar/api/cer/history",
    icon: BadgeDollarSign,
    colorFrom: "#f472b6",
    colorTo: "#db2777",
    strokeColor: "#f472b6",
    valueFormat: (v: number) => v.toLocaleString("es-AR", { maximumFractionDigits: 4 }),
    chartSlice: 365,
  },
  {
    id: "cbt",
    title: "CBT – Canasta Básica Total",
    description: "Monto mínimo que necesita un adulto para no ser considerado pobre (incluye bienes y servicios no alimentarios).",
    apiUrl: "https://api.argly.com.ar/api/canasta/history",
    icon: ShoppingBag,
    colorFrom: "#6366f1",
    colorTo: "#4f46e5",
    strokeColor: "#6366f1",
    valueFormat: (v: number) => `$${v.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`,
    isMonthly: false,
  },
  {
    id: "cba",
    title: "CBA – Canasta Básica Alimentaria",
    description: "Monto mínimo que necesita un adulto para cubrir sus necesidades kilocalóricas y proteicas mímimas para no ser indigente.",
    apiUrl: "https://api.argly.com.ar/api/canasta/history",
    icon: Utensils,
    colorFrom: "#f59e0b",
    colorTo: "#d97706",
    strokeColor: "#f59e0b",
    valueFormat: (v: number) => `$${v.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`,
    isMonthly: false,
  },
]

export function UseCasesDashboard() {
  return (
    <div className="space-y-16">
      {/* ── Summary stat cards ── */}
      <SummaryCards />

      {/* ── Section divider ── */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
          Históricos
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Full charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {indicators.map((cfg, i) => (
          <IndicatorCard key={cfg.id} config={cfg} index={i} />
        ))}
      </div>
    </div>
  )
}

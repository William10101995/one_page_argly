"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { apiFetch } from "@/lib/api"

// ── Bloc color palette (characteristic political colors) ──────────────────────
const BLOC_COLORS: Record<string, string> = {
  "LA LIBERTAD AVANZA":         "#7C3AED", // Purple
  "UNIÓN POR LA PATRIA":        "#38BDF8", // Sky Blue
  "PRO":                        "#EAB308", // Yellow
  "UCR - UNIÓN CÍVICA RADICAL": "#EF4444", // Red
  "ENCUENTRO FEDERAL":          "#0D9488", // Teal
  "INNOVACIÓN FEDERAL":         "#1E3A8A", // Dark Blue
  "PROVINCIAS UNIDAS":          "#F97316", // Orange
  "COALICION CIVICA":           "#10B981", // Green
  "PTS-FRENTE DE IZQUIERDA Y DE TRABAJADORES UNIDAD": "#BE123C", // Dark Red
  "PARTIDO OBRERO EN EL FRENTE DE IZQUIERDA Y DE TRABAJADORES-UNIDAD": "#9F1239", // Very Dark Red
  "INDEPENDENCIA":              "#6366F1", // Indigo
  "ELIJO CATAMARCA":            "#3B82F6", // Blue
  "LA NEUQUINIDAD":             "#84CC16", // Lime
  "POR SANTA CRUZ":             "#06B6D4", // Cyan
  "PRODUCCION Y TRABAJO":       "#F59E0B", // Amber
  "MID - MOVIMIENTO DE INTEGRACIÓN Y DESARROLLO": "#D946EF", // Fuchsia
  "ADELANTE BUENOS AIRES":      "#F43F5E", // Rose
  "PRIMERO SAN LUIS":           "#14B8A6", // Light Teal
  "DEFENDAMOS CÓRDOBA":         "#8B5CF6", // Violet
  "COHERENCIA":                 "#EC4899", // Pink
}

const DEFAULT_COLOR = "#6B7280"

function getBlocColor(bloc: string): string {
  return BLOC_COLORS[bloc] ?? DEFAULT_COLOR
}

// ── Bloc ideological / seating order (left to right) ───────────────────────
const BLOC_ORDER = [
  "UNIÓN POR LA PATRIA",
  "PRIMERO SAN LUIS",
  "DEFENDAMOS CÓRDOBA",
  "COHERENCIA",
  "PTS-FRENTE DE IZQUIERDA Y DE TRABAJADORES UNIDAD",
  "PARTIDO OBRERO EN EL FRENTE DE IZQUIERDA Y DE TRABAJADORES-UNIDAD",
  "COALICION CIVICA",
  "INNOVACIÓN FEDERAL",
  "INDEPENDENCIA",
  "ELIJO CATAMARCA",
  "LA NEUQUINIDAD",
  "PROVINCIAS UNIDAS",
  "PRODUCCION Y TRABAJO",
  "PRO",
  "UCR - UNIÓN CÍVICA RADICAL",
  "MID - MOVIMIENTO DE INTEGRACIÓN Y DESARROLLO",
  "ENCUENTRO FEDERAL",
  "ADELANTE BUENOS AIRES",
  "POR SANTA CRUZ",
  "LA LIBERTAD AVANZA"
]

function getBlocOrderIndex(bloc: string): number {
  const idx = BLOC_ORDER.indexOf(bloc)
  return idx === -1 ? 999 : idx
}

// ── Hemicycle geometry ────────────────────────────────────────────────────────
// Distributes N seats across concentric semicircular rows.
// Returns an array of {x, y} positions (normalised to SVG viewBox).

function computeHemicyclePositions(
  total: number,
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  rows: number,
): { x: number; y: number }[] {
  const arcSeats = total - 1
  const rowStep = (rOuter - rInner) / (rows - 1)

  // Proportional seat count per row (proportional to arc length = radius)
  const radii = Array.from({ length: rows }, (_, i) => rInner + i * rowStep)
  const totalR = radii.reduce((s, r) => s + r, 0)
  const seatsPerRow = radii.map(r => Math.round((r / totalR) * arcSeats))

  // Adjust rounding error to hit exactly `arcSeats`
  let diff = arcSeats - seatsPerRow.reduce((s, n) => s + n, 0)
  let idx = rows - 1
  while (diff !== 0) {
    seatsPerRow[idx] += diff > 0 ? 1 : -1
    diff += diff > 0 ? -1 : 1
    idx = (idx - 1 + rows) % rows
  }

  const positions: { x: number; y: number; angle: number; r: number }[] = []

  for (let row = 0; row < rows; row++) {
    const r = radii[row]
    const n = seatsPerRow[row]
    for (let seat = 0; seat < n; seat++) {
      // angle from 0 (left) to π (right) across the semicircle
      const angle = Math.PI - (seat / (n - 1 || 1)) * Math.PI
      positions.push({
        x: cx + r * Math.cos(angle),
        y: cy - r * Math.sin(angle),
        angle,
        r,
      })
    }
  }

  // Sort radially from left (PI) to right (0)
  positions.sort((a, b) => {
    if (Math.abs(b.angle - a.angle) > 0.0001) {
      return b.angle - a.angle
    }
    return a.r - b.r
  })

  // Add the President at the center bottom
  positions.push({
    x: cx,
    y: cy - 45, // position between arches and center label
    angle: 0,
    r: 0,
    isPresident: true
  })

  return positions
}

// ── Types ────────────────────────────────────────────────────────────────────
interface Diputado {
  apellido: string
  nombre: string
  distrito: string
  bloque: string
  inicio_mandato: string
  fin_mandato: string
}

interface BlocData {
  name: string
  count: number
  color: string
}

interface TooltipState {
  x: number
  y: number
  diputado: Diputado
  isPresident?: boolean
}

// ── Component ────────────────────────────────────────────────────────────────
export function HemicycleChart() {
  const [diputados, setDiputados] = useState<Diputado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [activeBloc, setActiveBloc] = useState<string | null>(null)
  const [activeDistrito, setActiveDistrito] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    let cancelled = false

    async function load(attempt = 0) {
      try {
        const r = await apiFetch("/v1/diputados", { cache: "no-store" })
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const json = await r.json()
        const lista = Array.isArray(json)
          ? json
          : Array.isArray(json?.datos)
          ? json.datos
          : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.datos)
          ? json.data.datos
          : null
        if (!lista) throw new Error("Formato de respuesta inesperado")
        if (!cancelled) {
          setDiputados(lista)
          setLoading(false)
        }
      } catch (err) {
        if (attempt < 2) {
          setTimeout(() => load(attempt + 1), 1500)
        } else if (!cancelled) {
          setError("No se pudo cargar el listado de diputados.")
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // ── Derived data (always safe — diputados starts as []) ───────────────────
  const safeDiputados = Array.isArray(diputados) ? diputados : []

  // Extract unique sorted districts
  const distritos = Array.from(new Set(safeDiputados.map(d => d.distrito))).sort()

  const blocMap = new Map<string, Diputado[]>()
  for (const d of safeDiputados) {
    if (!blocMap.has(d.bloque)) blocMap.set(d.bloque, [])
    blocMap.get(d.bloque)!.push(d)
  }

  // Sort blocs by ideological/seating order (left to right)
  const blocs: BlocData[] = [...blocMap.entries()]
    .sort((a, b) => {
      const idxA = getBlocOrderIndex(a[0])
      const idxB = getBlocOrderIndex(b[0])
      if (idxA !== idxB) return idxA - idxB
      return b[1].length - a[1].length // fallback to count
    })
    .map(([name, members]) => ({
      name,
      count: members.length,
      color: getBlocColor(name),
    }))

  // Build ordered seat → diputado mapping (blocs fill seats left-to-right)
  const orderedDiputados: Diputado[] = blocs.flatMap(b =>
    (blocMap.get(b.name) ?? [])
  )

  // Extraemos a Martín Menem y lo mandamos al final del array para que ocupe
  // el asiento `isPresident`. De esta manera, garantizamos que no aparezca como un
  // diputado más en el anillo, y evitamos ocultar a otro diputado al azar.
  const presidentIndex = orderedDiputados.findIndex(d => 
    d.apellido.toLowerCase().includes("menem") && 
    (d.nombre.toLowerCase().includes("martin") || d.nombre.toLowerCase().includes("martín"))
  )
  if (presidentIndex !== -1) {
    const president = orderedDiputados.splice(presidentIndex, 1)[0]
    orderedDiputados.push(president)
  }


  // SVG dimensions
  const W = 700
  const H = 370
  const cx = W / 2
  const cy = H - 10
  const ROWS = 9
  const rInner = 100
  const rOuter = 310
  const DOT_R = 5.2

  const positions = computeHemicyclePositions(
    orderedDiputados.length,
    cx, cy, rInner, rOuter, ROWS,
  )

  // Compute center labels based on filters
  let filteredCount = safeDiputados.length
  let filteredLabel = "DIPUTADOS"

  if (activeBloc || activeDistrito) {
    filteredCount = safeDiputados.filter(d => 
      (!activeBloc || d.bloque === activeBloc) && 
      (!activeDistrito || d.distrito === activeDistrito)
    ).length

    if (activeBloc && activeDistrito) {
      filteredLabel = "FILTRADOS"
    } else if (activeBloc) {
      filteredLabel = activeBloc.split(" ").slice(0, 3).join(" ")
    } else if (activeDistrito) {
      filteredLabel = activeDistrito.toUpperCase()
    }
  }

  const handleDotEnter = (e: React.MouseEvent<SVGCircleElement>, d: Diputado, isPresident?: boolean) => {
    const svgRect = svgRef.current?.getBoundingClientRect()
    if (!svgRect) return
    setTooltip({
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
      diputado: d,
      isPresident
    })
  }

  const handleDotLeave = () => setTooltip(null)

  // ── Loading / error ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando composición de la Cámara…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-destructive">{error}</div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* ── Hemicycle SVG ── */}
      <div className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ maxHeight: 380 }}
          onMouseLeave={handleDotLeave}
        >
          {/* Subtle arc guides */}
          {Array.from({ length: ROWS }, (_, i) => {
            const step = (rOuter - rInner) / (ROWS - 1)
            const r = rInner + i * step
            return (
              <path
                key={i}
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={1}
              />
            )
          })}

          {/* Seats */}
          {positions.map((pos, i) => {
            const d = orderedDiputados[i]
            if (!d) return null
            const color = getBlocColor(d.bloque)
            const isActive = 
              (activeBloc === null || activeBloc === d.bloque) && 
              (activeDistrito === null || activeDistrito === d.distrito)
            
            return (
              <circle
                key={i}
                cx={pos.x}
                cy={pos.y}
                r={DOT_R}
                fill={color}
                opacity={isActive ? 1 : 0.12}
                className="cursor-pointer transition-opacity duration-200"
                onMouseEnter={e => handleDotEnter(e, d, (pos as any).isPresident)}
                onMouseLeave={handleDotLeave}
                onClick={() =>
                  setActiveBloc(prev => (prev === d.bloque ? null : d.bloque))
                }
              />
            )
          })}

          {/* Centre label */}
          <text
            x={cx}
            y={cy - 14}
            textAnchor="middle"
            className="fill-foreground font-extrabold"
            style={{ fontSize: 28, fontFamily: "inherit" }}
          >
            {filteredCount}
          </text>
          <text
            x={cx}
            y={cy + 6}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 10, fontFamily: "inherit" }}
          >
            {filteredLabel}
          </text>
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none absolute z-20 rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm p-3 shadow-xl text-xs max-w-[200px]"
              style={{
                left: Math.min(tooltip.x + 12, W - 220),
                top: Math.max(tooltip.y - 70, 4),
              }}
            >
              <p className="font-bold text-foreground leading-tight">
                {tooltip.isPresident 
                  ? "Presidencia de la Cámara" 
                  : `${tooltip.diputado.apellido}, ${tooltip.diputado.nombre}`}
              </p>
              {tooltip.isPresident && (
                <p className="text-foreground mt-1 leading-tight text-[11px] font-medium">
                  {tooltip.diputado.apellido}, {tooltip.diputado.nombre}
                </p>
              )}
              <p className="text-muted-foreground mt-1 leading-tight">
                {tooltip.diputado.distrito}
              </p>
              <div
                className="mt-2 rounded px-2 py-0.5 text-[10px] font-semibold w-fit"
                style={{
                  backgroundColor: getBlocColor(tooltip.diputado.bloque) + "33",
                  color: getBlocColor(tooltip.diputado.bloque),
                }}
              >
                {tooltip.diputado.bloque}
              </div>
              <p className="text-muted-foreground/60 mt-1 text-[9px]">
                Hasta {tooltip.diputado.fin_mandato}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-sm font-semibold text-foreground border-l-2 border-primary pl-2">
          Bloques Políticos
        </h3>
        <div className="flex items-center gap-2">
          <label htmlFor="distrito-filter" className="text-xs text-muted-foreground">Distrito:</label>
          <select
            id="distrito-filter"
            value={activeDistrito ?? ""}
            onChange={(e) => setActiveDistrito(e.target.value || null)}
            className="text-xs bg-card border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="">Todos los distritos</option>
            {distritos.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {blocs.map(bloc => (
          <button
            key={bloc.name}
            onClick={() =>
              setActiveBloc(prev => (prev === bloc.name ? null : bloc.name))
            }
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all duration-200 ${
              activeBloc === bloc.name
                ? "border-transparent shadow-md scale-[1.02]"
                : activeBloc === null
                ? "border-border/40 bg-card/30 hover:border-border hover:bg-card/60"
                : "border-border/20 bg-card/10 opacity-40"
            }`}
            style={
              activeBloc === bloc.name
                ? {
                    backgroundColor: bloc.color + "1A",
                    borderColor: bloc.color + "60",
                  }
                : {}
            }
          >
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: bloc.color }}
            />
            <span className="flex-1 min-w-0">
              <span className="block text-[11px] font-medium text-foreground truncate leading-tight">
                {bloc.name.length > 30
                  ? bloc.name.split(/[–\-,]/)[0].trim()
                  : bloc.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {bloc.count} dip.
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        Hacé clic en un bloque o selecciona un distrito para filtrar · {safeDiputados.length} diputados generados dinámicamente desde los datos provistos por la API
      </p>
    </div>
  )
}

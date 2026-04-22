import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { StatsDashboard } from "@/components/estadisticas/stats-dashboard"
import { StatsSkeletons } from "@/components/estadisticas/stats-skeletons"

export const metadata = {
  title: "Estadísticas Públicas | Argly",
  description:
    "Métricas en tiempo real de uso de la API Argly: requests, latencia, endpoints más usados y distribución geográfica.",
}

/** Agrupa las filas de serie-temporal por hora y suma los valores.
 *  El backend actualmente devuelve una fila por request en lugar de
 *  una fila por hora agregada — esto lo corrige en el servidor. */
function agregarSerie(raw: any[]) {
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

async function fetchAllStats() {
  const BASE = "https://api.argly.com.ar/api/admin/estadisticas"
  const opts = { next: { revalidate: 300 } }

  const [resumen, serie, endpoints, paises] = await Promise.all([
    fetch(`${BASE}/resumen`, opts).then((r) => r.json()),
    fetch(`${BASE}/serie-temporal`, opts).then((r) => r.json()),
    fetch(`${BASE}/endpoints`, opts).then((r) => r.json()),
    fetch(`${BASE}/paises`, opts).then((r) => r.json()),
  ])

  return {
    resumen: resumen.data ?? resumen,
    serie: agregarSerie(serie.data ?? serie),
    endpoints: endpoints.data ?? endpoints,
    paises: paises.data ?? paises,
  }
}

export default async function EstadisticasPage() {
  const data = await fetchAllStats()

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground">
      <Navbar />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7F77DD]/30 bg-[#7F77DD]/10 px-3 py-1 text-xs font-medium text-[#7F77DD]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7F77DD] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7F77DD]" />
              </span>
              Live
            </span>
            <span className="text-xs text-zinc-500">Actualiza cada 5 min</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Métricas de Argly
          </h1>
          <p className="mt-2 text-zinc-400 text-base max-w-2xl">
            Datos reales del uso de Argly — requests, latencia, endpoints más consumidos y
            distribución geográfica de usuarios.
          </p>
        </div>

        <Suspense fallback={<StatsSkeletons />}>
          <StatsDashboard {...data} />
        </Suspense>
      </main>
    </div>
  )
}

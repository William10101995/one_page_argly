import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatsDashboard } from "@/components/estadisticas/stats-dashboard"

export const metadata = {
  title: "Estadísticas Públicas | Argly",
  description:
    "Métricas en tiempo real de uso de la API Argly: requests, latencia, endpoints más usados y distribución geográfica.",
}

export default function EstadisticasPage() {
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
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Métricas de Argly
          </h1>
          <p className="mt-2 text-zinc-400 text-base max-w-2xl">
            Datos reales del uso de Argly — requests, latencia, endpoints más consumidos y
            distribución geográfica de usuarios.
          </p>
        </div>

        <StatsDashboard />
      </main>
      <Footer />
    </div>
  )
}

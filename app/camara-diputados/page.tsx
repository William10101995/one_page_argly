import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HemicycleChart } from "@/components/use-cases/hemicycle-chart"

export const metadata = {
  title: 'Cámara de Diputados – Argly',
  description: 'Visualización interactiva de la distribución de bancas de la Cámara de Diputados de la Nación Argentina obtenida a través de la API de Argly.',
}

export default function CamaraDiputadosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1 w-full pt-24 pb-16">
        <section className="relative px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Background glows */}
          <div className="absolute top-0 right-1/4 w-full max-w-3xl h-[400px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-[300px] left-0 w-[500px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 pt-10 pb-12 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)] mb-6">
              <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              Poder Legislativo
            </div>
            <h1 className="mb-4 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              Cámara de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">
                Diputados de la Nación
              </span>
            </h1>
            <p className="text-pretty text-lg text-muted-foreground max-w-3xl">
              Composición actualizada de la H. Cámara de Diputados de la Nación. Explora la distribución de bancas por bloque y el detalle de cada representante utilizando la información provista por la API.
            </p>
          </div>

          {/* Dashboard */}
          <div className="relative z-10">
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-6 sm:p-8 shadow-xl ring-1 ring-white/5">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight">
                      Distribución de la Cámara de Diputados
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Composición actual por bloque parlamentario y distrito
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generados dinámicamente desde los datos provistos por la API en{" "}
                  <code className="text-violet-400 font-mono text-xs bg-violet-500/10 px-1 py-0.5 rounded">GET /v1/diputados</code>.
                  Cada punto representa un diputado. Hacé clic en un bloque o seleccioná un distrito para filtrar.
                </p>
              </div>
              <HemicycleChart />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

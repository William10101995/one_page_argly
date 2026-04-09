import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RiverMonitor } from "@/components/use-cases/river-monitor"

export const metadata = {
  title: 'Monitoreo de Ríos en Tiempo Real – Argly',
  description: 'Consulta el estado de los ríos en Argentina (Paraná, Uruguay, Iguazú y más). Altura de los puertos, tendencias y variaciones actualizadas.',
}

export default function RiverMonitorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1 w-full pt-24 pb-16">
        <section className="relative px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Background glows */}
          <div className="absolute top-0 right-1/4 w-full max-w-3xl h-[400px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-[600px] left-0 w-[500px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 pt-10 pb-12 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)] mb-6">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              Prefectura Naval Argentina
            </div>
            <h1 className="mb-4 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              Monitoreo de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600">
                Ríos
              </span>
            </h1>
            <p className="text-pretty text-lg text-muted-foreground max-w-3xl">
              Estado actualizado de las cuencas hidrológicas. Seguí en tiempo real la altura en los puertos, 
              las tendencias de crecimiento y las alertas hidrológicas en todo el territorio nacional.
            </p>
          </div>

          {/* Monitor Component */}
          <div className="relative z-10">
            <RiverMonitor />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

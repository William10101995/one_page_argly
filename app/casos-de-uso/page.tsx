import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UseCasesDashboard } from "@/components/use-cases/dashboard"

export const metadata = {
  title: 'Indicadores Económicos – Argly',
  description: 'Dashboard interactivo con indicadores económicos argentinos: Canasta Básica (CBT/CBA), IPC, ICL, UVA, UVI y CER en tiempo real usando la API de Argly.',
}

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1 w-full pt-24 pb-16">
        <section className="relative px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Background glows */}
          <div className="absolute top-0 right-1/4 w-full max-w-3xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-[600px] left-0 w-[500px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-[1200px] right-0 w-[500px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 pt-10 pb-16 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)] mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Datos en Vivo
            </div>
            <h1 className="mb-4 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              Indicadores{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Económicos
              </span>
            </h1>
            <p className="text-pretty text-lg text-muted-foreground max-w-3xl">
              Dashboard interactivo con los principales indicadores económicos argentinos, incluyendo Canasta Básica, Inflación y registros del BCRA.
              Todos los datos se obtienen en tiempo real desde{" "}
              <code className="text-primary font-mono text-sm bg-primary/10 px-1 py-0.5 rounded">
                api.argly.com.ar
              </code>
            </p>
          </div>

          {/* Dashboard */}
          <div className="relative z-10">
            <UseCasesDashboard />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

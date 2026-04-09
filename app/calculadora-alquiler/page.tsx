import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RentCalculator } from "@/components/use-cases/rent-calculator"

export const metadata = {
  title: 'Calculadora de Alquiler – Argly',
  description: 'Calcula la actualización de tu alquiler usando los índices oficiales ICL (BCRA) e IPC (INDEC) a través de la API de Argly.',
}

export default function RentCalculatorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1 w-full pt-24 pb-16">
        <section className="relative px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Background glows */}
          <div className="absolute top-0 right-1/4 w-full max-w-3xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-[600px] left-0 w-[500px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 pt-10 pb-12 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)] mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Herramienta Gratuita
            </div>
            <h1 className="mb-4 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              Calculadora de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-600">
                Alquiler
              </span>
            </h1>
            <p className="text-pretty text-lg text-muted-foreground max-w-3xl">
              Calculá la actualización de tu contrato de forma rápida y precisa. 
              Soportamos los índices <strong>ICL</strong> (Ley de Alquileres) e <strong>IPC</strong> (Inflación) con datos actualizados diariamente.
            </p>
          </div>

          {/* Calculator Component */}
          <div className="relative z-10">
            <RentCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

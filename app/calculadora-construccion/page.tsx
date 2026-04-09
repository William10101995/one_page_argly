import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ConstructionCalculator } from "@/components/use-cases/construction-calculator"

export const metadata = {
  title: 'Calculadora de Costo de Construcción – Argly',
  description: 'Estimá cuánto te costará construir tu casa según los metros cuadrados usando la API de Argly con datos oficiales del ICC (INDEC).',
}

export default function ConstructionCalculatorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1 w-full pt-24 pb-16">
        <section className="relative px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Background glows */}
          <div className="absolute top-0 right-1/4 w-full max-w-3xl h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-[600px] left-0 w-[500px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 pt-10 pb-12 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] mb-6">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              ICC · INDEC
            </div>
            <h1 className="mb-4 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              Calculadora de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
                Construcción
              </span>
            </h1>
            <p className="text-pretty text-lg text-muted-foreground max-w-3xl">
              Estimá el presupuesto total de tu obra. Usamos el <strong>Índice del Costo de la Construcción (ICC)</strong> oficial para darte una referencia precisa basada en el valor actual por metro cuadrado.
            </p>
          </div>

          {/* Calculator Component */}
          <div className="relative z-10">
            <ConstructionCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

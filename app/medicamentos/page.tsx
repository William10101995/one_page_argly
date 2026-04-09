import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MedicationSearch } from "@/components/use-cases/medication-search"

export const metadata = {
  title: 'Buscador de Precios de Medicamentos – Argly',
  description: 'Consulta los precios de referencia de medicamentos en Argentina. Datos actualizados del Vademécum Nacional de Medicamentos.',
}

export default function MedicationSearchPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1 w-full pt-24 pb-16">
        <section className="relative px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Background glows */}
          <div className="absolute top-0 right-1/4 w-full max-w-3xl h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-[600px] left-0 w-[500px] h-[400px] bg-teal-600/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 pt-10 pb-12 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Ministerio de Salud de la Nación
            </div>
            <h1 className="mb-4 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              Buscador de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600">
                Medicamentos
              </span>
            </h1>
            <p className="text-pretty text-lg text-muted-foreground max-w-3xl">
              Accedé a los precios de referencia vigentes. Buscá por nombre comercial o droga para comparar presentaciones y laboratorios de todo el mercado argentino.
            </p>
          </div>

          {/* Search Component */}
          <div className="relative z-10">
            <MedicationSearch />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ApiDocumentation } from "@/components/api-documentation"
import { Playground } from "@/components/playground"
import { DataSources } from "@/components/data-sources"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen relative pt-16">
      <Navbar />
      <div id="inicio">
        <Hero />
      </div>
      <Features />
      <ApiDocumentation />
      <Playground />
      <DataSources />
      <Footer />
    </main>
  )
}

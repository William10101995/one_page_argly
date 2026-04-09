import { Github, Coffee } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-0">
              <img src="/icon.png" alt="Argly Logo" className="w-7 h-7 object-contain -mr-1.5" />
              <h3 className="text-lg font-semibold">Argly</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Datos públicos de Argentina accesibles para todos los desarrolladores.
            </p>
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                asChild
                className="border-accent/20 bg-accent/5 hover:bg-accent/10 hover:text-accent"
              >
                <Link href="https://cafecito.app/williamjuanjoselopez" target="_blank" rel="noopener noreferrer">
                  <Coffee className="mr-2 h-4 w-4" />
                  Apoyar proyecto
                </Link>
              </Button>
            </div>
            {/* </CHANGE> */}
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Documentación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#docs" className="text-muted-foreground hover:text-foreground">
                  Introducción
                </Link>
              </li>
              <li>
                <Link href="#docs" className="text-muted-foreground hover:text-foreground">
                  Endpoints
                </Link>
              </li>
              <li>
                <Link href="#playground" className="text-muted-foreground hover:text-foreground">
                  Playground
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Comunidad</h4>
            <div className="flex gap-4">
              <Link href="https://github.com/William10101995" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 argly.com.ar - Datos obtenidos de fuentes públicas.</p>
        </div>
      </div>
    </footer>
  )
}

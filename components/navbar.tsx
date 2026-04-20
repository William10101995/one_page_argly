"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Database, Coffee, Heart, Menu, X, ChevronDown, BarChart3, BarChart2, Calculator, Waves, Pill, BadgeDollarSign, Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#docs", label: "Documentación" },
  { href: "/#playground", label: "Playground" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/casos-de-uso", label: "Casos de Uso" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 border-b border-transparent ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 transition-opacity hover:opacity-80">
            <img src="/icon.png" alt="Argly Logo" className="w-8 h-8 object-contain -mr-1.5" />
            <span className="font-bold text-lg tracking-tight">Argly</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.label === "Casos de Uso") {
                return (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none">
                      {link.label}
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-md border-border/50">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/casos-de-uso" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          <span>Indicadores Económicos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/calculadora-alquiler" className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-primary" />
                          <span>Calculadora de Alquiler</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/monitoreo-rios" className="flex items-center gap-2">
                          <Waves className="h-4 w-4 text-primary" />
                          <span>Monitoreo de Ríos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/medicamentos" className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span>Precios de Medicamentos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/calculadora-construccion" className="flex items-center gap-2">
                          <Hammer className="h-4 w-4 text-primary" />
                          <span>Calculadora de Construcción</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="border-accent/20 bg-accent/5 hover:bg-accent/10 hover:text-accent font-medium"
            >
              <Link href="https://cafecito.app/williamjuanjoselopez" target="_blank" rel="noopener noreferrer">
                <Coffee className="mr-2 h-4 w-4" />
                Apoyar al Proyecto
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="border-accent/20 bg-accent/5 hover:bg-accent/10 hover:text-accent font-medium"
            >
              <Link href="https://github.com/sponsors/William10101995" target="_blank" rel="noopener noreferrer">
                <Heart className="mr-2 h-4 w-4 text-red-500" />
                Sponsor
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background border-b border-border shadow-lg"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <div key={link.label} className="space-y-4">
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-base font-medium ${
                      link.label === "Casos de Uso" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.label === "Casos de Uso" && (
                    <div className="pl-4 space-y-3 border-l border-border/50 ml-1">
                      <Link
                        href="/casos-de-uso"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Indicadores Económicos
                      </Link>
                      <Link
                        href="/calculadora-alquiler"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Calculator className="h-4 w-4" />
                        Calculadora de Alquiler
                      </Link>
                      <Link
                        href="/monitoreo-rios"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Waves className="h-4 w-4" />
                        Monitoreo de Ríos
                      </Link>
                      <Link
                        href="/medicamentos"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Pill className="h-4 w-4" />
                        Precios de Medicamentos
                      </Link>
                      <Link
                        href="/calculadora-construccion"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Hammer className="h-4 w-4" />
                        Calculadora de Construcción
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-border space-y-3">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="w-full border-accent/20 bg-accent/5 hover:bg-accent/10 hover:text-accent font-medium flex justify-center"
                >
                  <Link href="https://cafecito.app/williamjuanjoselopez" target="_blank" rel="noopener noreferrer">
                    <Coffee className="mr-2 h-4 w-4" />
                    Apoyar al Proyecto
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="w-full border-accent/20 bg-accent/5 hover:bg-accent/10 hover:text-accent font-medium flex justify-center"
                >
                  <Link href="https://github.com/sponsors/William10101995" target="_blank" rel="noopener noreferrer">
                    <Heart className="mr-2 h-4 w-4 text-red-500" />
                    Sponsor en GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

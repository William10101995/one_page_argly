"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Pill, 
  Beaker, 
  Hospital, 
  Info, 
  Loader2, 
  TrendingUp,
  Tag,
  SearchX,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type Medication = {
  nombre: string
  presentacion: string
  laboratorio: string
  precio: number
  tipo_venta: string
  droga: string
}

type ApiResponse = {
  query: string
  total: number
  results: Medication[]
}

export function MedicationSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Medication[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setResults([])
      setTotal(0)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`https://api.argly.com.ar/api/medicamentos/${encodeURIComponent(searchQuery)}`)
      const json: ApiResponse = await res.json()
      setResults(json.results || [])
      setTotal(json.total || 0)
    } catch (error) {
      console.error("Error fetching medications:", error)
    } finally {
      setLoading(false)
      setHasSearched(true)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query, handleSearch])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── Search Bar ── */}
      <div className="max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <Input 
            type="text" 
            placeholder="Buscá por nombre o droga (ej: Ibuprofeno, Amoxicilina...)" 
            className="pl-12 bg-card/40 backdrop-blur-xl border-border/50 h-14 rounded-2xl focus:ring-emerald-500 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            </div>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground px-1">
          Se requieren al menos 3 caracteres para iniciar la búsqueda.
        </p>
      </div>

      {/* ── Results Area ── */}
      <AnimatePresence mode="wait">
        {!hasSearched && !loading ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-2">
              <Pill className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold">Consultá precios oficiales</h3>
            <p className="text-muted-foreground max-w-sm">
              Ingresá el nombre de un medicamento para comparar presentaciones y laboratorios del Vademécum Nacional.
            </p>
          </motion.div>
        ) : loading && results.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="py-24 flex flex-col items-center justify-center gap-4 text-muted-foreground"
          >
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="text-lg font-medium">Buscando en el Vademécum...</p>
          </motion.div>
        ) : hasSearched && results.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 flex flex-col items-center text-center space-y-4 bg-card/20 backdrop-blur-md border border-border/50 rounded-3xl"
          >
            <SearchX className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-bold">No se encontraron resultados</h3>
            <p className="text-muted-foreground max-w-sm">
              No pudimos encontrar medicamentos que coincidan con &quot;{query}&quot;. Intentá con una variante o el nombre de la droga.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                Resultados para &quot;{query}&quot;
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none font-mono">
                  {total} encontrados
                </Badge>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map((med, idx) => (
                <motion.div
                  key={`${med.nombre}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="h-full bg-card/30 backdrop-blur-xl border-border/50 hover:border-emerald-500/40 transition-all hover:shadow-xl hover:-translate-y-1 group">
                    <CardHeader className="pb-3 px-5">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[10px] uppercase font-bold tracking-tight">
                          {med.tipo_venta}
                        </Badge>
                        <Hospital className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <CardTitle className="text-lg font-bold leading-tight group-hover:text-emerald-400 transition-colors">
                        {med.nombre}
                      </CardTitle>
                      <CardDescription className="text-xs font-mono text-emerald-500/70">
                        {med.droga}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Tag className="h-3 w-3" />
                            <span>{med.presentacion}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Beaker className="h-3 w-3 text-emerald-500" />
                            <span>{med.laboratorio}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-emerald-500/10 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Precio Sugerido</p>
                            <p className="text-2xl font-black text-foreground">
                              ${med.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex gap-4 items-start">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Info className="h-5 w-5 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-emerald-400">Información del Vademécum</h4>
          <p className="text-xs text-emerald-200/60 leading-relaxed max-w-4xl">
            Los precios mostrados corresponden al precio de venta sugerido al público y tienen carácter de referencia. 
            El valor final puede variar según farmacia, cobertura de obra social o prepaga. La información es provista por 
            el <strong>Vademécum Nacional de Medicamentos</strong> del Ministerio de Salud.
          </p>
        </div>
      </div>
    </div>
  )
}

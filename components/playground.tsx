"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Play, Copy, Check, CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const API_BASE_URL = "https://api.argly.com.ar"

const provincias = [
  { value: "buenos-aires", label: "Buenos Aires" },
  { value: "capital-federal-caba", label: "Capital Federal (CABA)" },
  { value: "catamarca", label: "Catamarca" },
  { value: "chaco", label: "Chaco" },
  { value: "chubut", label: "Chubut" },
  { value: "cordoba", label: "Córdoba" },
  { value: "corrientes", label: "Corrientes" },
  { value: "entre-rios", label: "Entre Ríos" },
  { value: "formosa", label: "Formosa" },
  { value: "jujuy", label: "Jujuy" },
  { value: "la-pampa", label: "La Pampa" },
  { value: "la-rioja", label: "La Rioja" },
  { value: "mendoza", label: "Mendoza" },
  { value: "misiones", label: "Misiones" },
  { value: "neuquen", label: "Neuquén" },
  { value: "rio-negro", label: "Río Negro" },
  { value: "salta", label: "Salta" },
  { value: "san-juan", label: "San Juan" },
  { value: "san-luis", label: "San Luis" },
  { value: "santa-cruz", label: "Santa Cruz" },
  { value: "santa-fe", label: "Santa Fe" },
  { value: "santiago-del-estero", label: "Santiago del Estero" },
  { value: "tierra-del-fuego", label: "Tierra del Fuego" },
  { value: "tucuman", label: "Tucumán" },
]

const empresas = [
  { value: "axion", label: "AXION" },
  { value: "blanca", label: "BLANCA" },
  { value: "dapsa-s.a.", label: "DAPSA S.A." },
  { value: "gulf", label: "GULF" },
  { value: "puma", label: "PUMA" },
  { value: "refinor", label: "REFINOR" },
  { value: "shell", label: "SHELL" },
  { value: "voy", label: "VOY" },
  { value: "ypf", label: "YPF" },
]

const combustibles = [
  { value: "gasoil-grado-2", label: "Gasoil Grado 2" },
  { value: "gasoil-grado-3", label: "Gasoil Grado 3" },
  { value: "gnc", label: "GNC" },
  { value: "nafta-premium", label: "Nafta Premium" },
  { value: "nafta-super", label: "Nafta Súper" },
]

const rios = [
  { value: "iguazu", label: "Iguazú" },
  { value: "parana", label: "Paraná" },
  { value: "san-javier", label: "San Javier" },
  { value: "delta-parana", label: "Delta Paraná" },
  { value: "gualeguay", label: "Gualeguay" },
  { value: "ibicuy", label: "Ibicuy" },
  { value: "paraguay", label: "Paraguay" },
  { value: "uruguay", label: "Uruguay" },
  { value: "gualeguaychu", label: "Gualeguaychú" },
  { value: "de-la-plata", label: "De la Plata" },
]


const endpoints = [
  { value: "/api/ipc", label: "IPC - Índice de Precios al Consumidor", params: [] },
  { value: "/api/ipc/history", label: "IPC - Histórico", params: [] },
  {
    value: "/api/ipc/range",
    label: "IPC - Por Rango de Fecha",
    params: [
      { name: "desde", type: "month" },
      { name: "hasta", type: "month" },
    ],
  },
  { value: "/api/cer", label: "CER - Coef. de Estabilización de Referencia", params: [] },
  { value: "/api/cer/history", label: "CER - Histórico", params: [] },
  {
    value: "/api/cer/range",
    label: "CER - Por Rango de Fecha",
    params: [
      { name: "desde", type: "date" },
      { name: "hasta", type: "date" },
    ],
  },
  { value: "/api/canasta", label: "Canasta Basica (CBT y CBA)", params: [] },
  { value: "/api/canasta/history", label: "Canasta Basica - Historico", params: [] },
  {
    value: "/api/canasta/range",
    label: "Canasta Basica - Por Rango de Fecha",
    params: [
      { name: "desde", type: "month" },
      { name: "hasta", type: "month" },
    ],
  },
  { value: "/api/construccion", label: "ICC - Indice del Costo de la Construccion (Beta)", params: [] },

  { value: "/api/icl", label: "ICL - Índice para Contratos de Locación", params: [] },
  { value: "/api/icl/history", label: "ICL - Histórico", params: [] },
  {
    value: "/api/icl/range",
    label: "ICL - Por Rango de Fecha",
    params: [
      { name: "desde", type: "date" },
      { name: "hasta", type: "date" },
    ],
  },
  { value: "/api/uvi", label: "UVI - Unidad de Vivienda", params: [] },
  { value: "/api/uvi/history", label: "UVI - Histórico", params: [] },
  {
    value: "/api/uvi/range",
    label: "UVI - Por Rango de Fecha",
    params: [
      { name: "desde", type: "date" },
      { name: "hasta", type: "date" },
    ],
  },
  { value: "/api/uva", label: "UVA - Unidad de Valor Adquisitivo", params: [] },
  { value: "/api/uva/history", label: "UVA - Histórico", params: [] },
  {
    value: "/api/uva/range",
    label: "UVA - Por Rango de Fecha",
    params: [
      { name: "desde", type: "date" },
      { name: "hasta", type: "date" },
    ],
  },

  {
    value: "/api/combustibles/provincia",
    label: "Combustible por Provincia",
    params: [{ name: "provincia", type: "provincia" }],
  },
  {
    value: "/api/combustibles/empresa",
    label: "Combustible por Empresa",
    params: [{ name: "empresa", type: "empresa" }],
  },
  {
    value: "/api/combustibles/promedio",
    label: "Precio Promedio de Combustible",
    params: [
      { name: "provincia", type: "provincia" },
      { name: "combustible", type: "combustible" },
    ],
  },
  {
    value: "/api/medicamentos",
    label: "Precio de Medicamentos (Beta)",
    params: [{ name: "medicamento", type: "text" }],
  },
  {
    value: "/api/credito",
    label: "Scoring Crediticio (Beta)",
    params: [
      { name: "cuil", type: "cuil" },
      { name: "salario_mensual", type: "number" },
      { name: "tea", type: "number" },
    ],
  },

  { value: "/api/provincias", label: "Provincias y Municipios", params: [] },
  { value: "/api/rios", label: "Rios - Estado de Todos los Rios", params: [] },
  {
    value: "/api/rios/rio",
    label: "Rios - Estado de un Rio Especifico",
    params: [{ name: "rio", type: "rio" }],
  },
]

const endpointCategories = [
  {
    name: "Economía e Inflación",
    endpoints: ["/api/ipc", "/api/ipc/history", "/api/ipc/range", "/api/cer", "/api/cer/history", "/api/cer/range", "/api/canasta", "/api/canasta/history", "/api/canasta/range", "/api/construccion"]
  },
  {
    name: "Vivienda y Locación",
    endpoints: ["/api/icl", "/api/icl/history", "/api/icl/range", "/api/uvi", "/api/uvi/history", "/api/uvi/range", "/api/uva", "/api/uva/history", "/api/uva/range"]
  },
  {
    name: "Mercado Local y Servicios",
    endpoints: ["/api/combustibles/provincia", "/api/combustibles/empresa", "/api/combustibles/promedio", "/api/medicamentos", "/api/credito"]
  },
  {
    name: "Geografía y Naturaleza",
    endpoints: ["/api/provincias", "/api/rios", "/api/rios/rio"]
  }
]

export function Playground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0].value)
  const [params, setParams] = useState<Record<string, string>>({
    provincia: "chaco",
    empresa: "axion",
    combustible: "nafta-super",
    rio: "parana",
    desde: "",
    hasta: "",
    cuil: "",
    salario_mensual: "",
    tea: "",
    medicamento: "",
  })
  const [dateDesde, setDateDesde] = useState<Date | undefined>(undefined)
  const [dateHasta, setDateHasta] = useState<Date | undefined>(undefined)
  const [monthDesde, setMonthDesde] = useState<Date | undefined>(undefined)
  const [monthHasta, setMonthHasta] = useState<Date | undefined>(undefined)
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const currentEndpoint = endpoints.find((e) => e.value === selectedEndpoint)

  const buildUrl = () => {
    let url = `${API_BASE_URL}${selectedEndpoint}`
    if (currentEndpoint?.params && currentEndpoint.params.length > 0) {
      const hasQueryParams = currentEndpoint.params.some((p) => p.type === "month" || p.type === "date")
      if (hasQueryParams) {
        const queryParams = currentEndpoint.params
          .map((param) => `${param.name}=${params[param.name] || ""}`)
          .join("&")
        url += `?${queryParams}`
      } else {
        currentEndpoint.params.forEach((param) => {
          url += `/${params[param.name] || ""}`
        })
      }
    }
    return url
  }

  const handleTest = async () => {
    setLoading(true)
    setResponse(null)
    setError(null)

    try {
      const apiUrl = buildUrl()

      const res = await fetch(apiUrl, {
        method: "GET",
        credentials: "omit",
        mode: "cors",
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      setResponse(data)

      toast({
        title: "Solicitud exitosa",
        description: "La API respondió correctamente",
      })
    } catch (err) {
      let errorMessage = "Error al conectar con la API"

      if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(buildUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Copiado",
      description: "URL copiada al portapapeles",
    })
  }

  const updateParam = (paramName: string, value: string) => {
    setParams((prev) => ({ ...prev, [paramName]: value }))
  }

  const renderParamSelect = (param: { name: string; type: string }) => {
    // Render month picker for IPC range (MM/AAAA)
    if (param.type === "month") {
      const selectedDate = param.name === "desde" ? monthDesde : monthHasta
      const setSelectedDate = param.name === "desde" ? setMonthDesde : setMonthHasta

      const handleMonthSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date) {
          const formattedValue = format(date, "yyyy-MM")
          updateParam(param.name, formattedValue)
        }
      }

      return (
        <div key={param.name}>
          <label className="mb-2 block text-sm font-medium capitalize">
            {param.name} <span className="text-destructive">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent text-left font-mono text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "MMMM yyyy", { locale: es }) : "Seleccionar mes"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleMonthSelect}
                locale={es}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                defaultMonth={selectedDate || new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    }

    // Render date picker for ICL range (DD/MM/AAAA)
    if (param.type === "date") {
      const selectedDate = param.name === "desde" ? dateDesde : dateHasta
      const setSelectedDate = param.name === "desde" ? setDateDesde : setDateHasta

      const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date) {
          const formattedValue = format(date, "yyyy-MM-dd")
          updateParam(param.name, formattedValue)
        }
      }

      return (
        <div key={param.name}>
          <label className="mb-2 block text-sm font-medium capitalize">
            {param.name} <span className="text-destructive">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent text-left font-mono text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={es}
                defaultMonth={selectedDate || new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    }

    // Render text input for CUIL
    if (param.type === "cuil") {
      return (
        <div key={param.name}>
          <label className="mb-2 block text-sm font-medium">
            CUIL <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={params[param.name] || ""}
            onChange={(e) => updateParam(param.name, e.target.value.replace(/\D/g, ""))}
            placeholder="20123456789"
            maxLength={11}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 sm:py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">Sin guiones, 11 digitos</p>
        </div>
      )
    }

    // Render number input
    if (param.type === "number") {
      const labels: Record<string, { label: string; placeholder: string; hint: string }> = {
        salario_mensual: { label: "Salario Mensual", placeholder: "500000", hint: "En pesos argentinos" },
        tea: { label: "TEA (%)", placeholder: "85", hint: "Tasa Efectiva Anual" },
      }
      const config = labels[param.name] || { label: param.name, placeholder: "", hint: "" }

      return (
        <div key={param.name}>
          <label className="mb-2 block text-sm font-medium">
            {config.label} <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            value={params[param.name] || ""}
            onChange={(e) => updateParam(param.name, e.target.value)}
            placeholder={config.placeholder}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 sm:py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {config.hint && <p className="mt-1 text-xs text-muted-foreground">{config.hint}</p>}
        </div>
      )
    }

    // Render text input for medicamento
    if (param.type === "text") {
      return (
        <div key={param.name}>
          <label className="mb-2 block text-sm font-medium capitalize">
            {param.name} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={params[param.name] || ""}
            onChange={(e) => updateParam(param.name, e.target.value)}
            placeholder="ibuprofeno"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 sm:py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )
    }

    let options: { value: string; label: string }[] = []

    if (param.type === "provincia") {
      options = provincias
    } else if (param.type === "empresa") {
      options = empresas
    } else if (param.type === "combustible") {
      options = combustibles
    } else if (param.type === "rio") {
      options = rios
    }

    return (
      <div key={param.name}>
        <label className="mb-2 block text-sm font-medium capitalize">
          {param.name} <span className="text-destructive">*</span>
        </label>
        <Select value={params[param.name]} onValueChange={(value) => updateParam(param.name, value)}>
          <SelectTrigger className="font-mono text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <section id="playground" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      {/* Background glow matching features/data sources */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Prueba la API en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Vivo</span>
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Experimenta con los endpoints directamente desde tu navegador
          </p>
        </div>

        <Card className="mx-auto mt-16 bg-card/40 backdrop-blur-md border hover:border-primary/30 border-border/50 shadow-xl transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.05)] ring-1 ring-white/5">
          <CardHeader>
            <CardTitle>API Playground</CardTitle>
            <CardDescription>
              Selecciona un endpoint y haz clic en &quot;Ejecutar&quot; para ver la respuesta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Endpoint</label>
                <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {endpointCategories.map((category) => (
                      <SelectGroup key={category.name}>
                        <SelectLabel className="font-semibold text-primary">{category.name}</SelectLabel>
                        {category.endpoints.map((epValue) => {
                          const endpoint = endpoints.find(e => e.value === epValue)
                          if (!endpoint) return null
                          return (
                            <SelectItem key={endpoint.value} value={endpoint.value} className="pl-6">
                              {endpoint.label}
                            </SelectItem>
                          )
                        })}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentEndpoint?.params && currentEndpoint.params.length > 0 && (
                <div className="space-y-4">{currentEndpoint.params.map((param) => renderParamSelect(param))}</div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">URL Completa</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 overflow-hidden rounded-lg border border-border bg-muted px-4 py-2">
                    <code className="block overflow-x-auto text-[10px] sm:text-sm font-mono whitespace-nowrap">{buildUrl()}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0 bg-transparent h-10 w-10 sm:h-9 sm:w-9" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button onClick={handleTest} disabled={loading} className="flex-1 sm:hidden h-10">
                      <Play className="mr-2 h-4 w-4" />
                      {loading ? "..." : "Ejecutar"}
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={handleTest} disabled={loading} className="hidden sm:flex w-full h-11">
                <Play className="mr-2 h-4 w-4" />
                {loading ? "Ejecutando..." : "Ejecutar"}
              </Button>
            </div>

            {error && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Error</label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">Error</span>
                  </div>
                </div>
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            {response && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Respuesta</label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">200 OK</span>
                  </div>
                </div>
                <div className="rounded-lg border border-border/50 bg-black/60 backdrop-blur-sm p-4">
                  <pre className="overflow-x-auto text-sm custom-scrollbar">
                    <code className="font-mono text-foreground">{JSON.stringify(response, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

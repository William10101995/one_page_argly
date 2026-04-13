"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeHighlighter } from "@/components/code-highlighter"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion, AnimatePresence } from "framer-motion"

const API_BASE_URL = "https://api.argly.com.ar"

const endpoints = [
  {
    id: "ipc",
    method: "GET",
    path: "/api/ipc",
    title: "Índice de Precios al Consumidor (IPC)",
    description:
      "Índice de Precios al Consumidor mensual reportado por INDEC. Devuelve el último IPC publicado con su fecha y próximo informe.",
    parameters: [],
    response: {
      data: {
        anio: 2025,
        fecha_proximo_informe: "10/02/2026",
        fecha_publicacion: "13/01/2026",
        indice_ipc: 2.8,
        mes: 12,
        nombre_mes: "diciembre",
        mes_nombre: "noviembre",
      },
    },
  },
  {
    id: "icl",
    method: "GET",
    path: "/api/icl",
    title: "Índice para Contratos de Locación (ICL)",
    description: "Índice para Contratos de Locación según Ley 27.551. Devuelve el ICL del día en curso publicado por el BCRA según disponibilidad del mismo.",
    parameters: [],
    response: {
      data: {
        fecha: "11/01/2026",
        valor: 29.63,
      },
    },
  },
  {
    id: "ipc-history",
    method: "GET",
    path: "/api/ipc/history",
    title: "Histórico de IPC",
    description: "Devuelve el histórico de valores del Índice de Precios al Consumidor (IPC) con el detalle mensual.",
    parameters: [],
    response: {
      data: [
        {
          anio: 2025,
          mes: 11,
          nombre_mes: "noviembre",
          valor: 2.5,
        },
        {
          anio: 2025,
          mes: 12,
          nombre_mes: "diciembre",
          valor: 2.8,
        },
      ],
    },
  },
  {
    id: "icl-history",
    method: "GET",
    path: "/api/icl/history",
    title: "Histórico de ICL",
    description: "Devuelve el histórico de valores del Índice para Contratos de Locación (ICL) con el detalle diario.",
    parameters: [],
    response: {
      data: [
        {
          fecha: "10/01/2026",
          valor: 29.61,
        },
        {
          fecha: "11/01/2026",
          valor: 29.63,
        },
        {
          fecha: "12/01/2026",
          valor: 29.65,
        },
      ],
    },
  },
  {
    id: "ipc-range",
    method: "GET",
    path: "/api/ipc/range?desde=AAAA-MM&hasta=AAAA-MM",
    title: "IPC por Rango de Fecha",
    description: "Devuelve los valores del IPC dentro de un rango de meses específico. El formato de fecha es AAAA-MM.",
    parameters: [
      {
        name: "desde",
        type: "string",
        required: true,
        description: "Fecha inicial en formato AAAA-MM (ej: 2025-11)",
      },
      {
        name: "hasta",
        type: "string",
        required: true,
        description: "Fecha final en formato AAAA-MM (ej: 2025-12)",
      },
    ],
    response: {
      data: [
        {
          anio: 2025,
          mes: 11,
          nombre_mes: "noviembre",
          valor: 2.5,
        },
        {
          anio: 2025,
          mes: 12,
          nombre_mes: "diciembre",
          valor: 2.8,
        },
      ],
    },
  },
  {
    id: "icl-range",
    method: "GET",
    path: "/api/icl/range?desde=AAAA-MM-DD&hasta=AAAA-MM-DD",
    title: "ICL por Rango de Fecha",
    description: "Devuelve los valores del ICL dentro de un rango de días específico. El formato de fecha es AAAA-MM-DD.",
    parameters: [
      {
        name: "desde",
        type: "string",
        required: true,
        description: "Fecha inicial en formato AAAA-MM-DD (ej: 2026-01-16)",
      },
      {
        name: "hasta",
        type: "string",
        required: true,
        description: "Fecha final en formato AAAA-MM-DD (ej: 2026-01-18)",
      },
    ],
    response: {
      data: [
        {
          fecha: "16/01/2026",
          valor: 29.75,
        },
        {
          fecha: "17/01/2026",
          valor: 29.76,
        },
        {
          fecha: "18/01/2026",
          valor: 29.78,
        },
      ],
    },
  },
  {
    id: "uvi",
    method: "GET",
    path: "/api/uvi",
    title: "Unidad de Vivienda (UVI)",
    description: "Valor actual de la Unidad de Vivienda (UVI) publicado por el BCRA.",
    parameters: [],
    response: {
      data: {
        fecha: "20/01/2026",
        valor: 1542.87,
      },
    },
  },
  {
    id: "uvi-history",
    method: "GET",
    path: "/api/uvi/history",
    title: "Histórico de UVI",
    description: "Devuelve el histórico completo de valores de la Unidad de Vivienda (UVI).",
    parameters: [],
    response: {
      data: [
        {
          fecha: "18/01/2026",
          valor: 1540.25,
        },
        {
          fecha: "19/01/2026",
          valor: 1541.56,
        },
        {
          fecha: "20/01/2026",
          valor: 1542.87,
        },
      ],
    },
  },
  {
    id: "uvi-range",
    method: "GET",
    path: "/api/uvi/range?desde=AAAA-MM-DD&hasta=AAAA-MM-DD",
    title: "UVI por Rango de Fecha",
    description: "Devuelve los valores de la UVI dentro de un rango de días específico. El formato de fecha es AAAA-MM-DD.",
    parameters: [
      {
        name: "desde",
        type: "string",
        required: true,
        description: "Fecha inicial en formato AAAA-MM-DD (ej: 2026-01-16)",
      },
      {
        name: "hasta",
        type: "string",
        required: true,
        description: "Fecha final en formato AAAA-MM-DD (ej: 2026-01-18)",
      },
    ],
    response: {
      data: [
        {
          fecha: "16/01/2026",
          valor: 1538.42,
        },
        {
          fecha: "17/01/2026",
          valor: 1539.68,
        },
        {
          fecha: "18/01/2026",
          valor: 1540.25,
        },
      ],
    },
  },
  {
    id: "uva",
    method: "GET",
    path: "/api/uva",
    title: "Unidad de Valor Adquisitivo (UVA)",
    description: "Valor actual de la Unidad de Valor Adquisitivo (UVA) publicado por el BCRA.",
    parameters: [],
    response: {
      data: {
        fecha: "20/01/2026",
        valor: 1285.34,
      },
    },
  },
  {
    id: "uva-history",
    method: "GET",
    path: "/api/uva/history",
    title: "Histórico de UVA",
    description: "Devuelve el histórico completo de valores de la Unidad de Valor Adquisitivo (UVA).",
    parameters: [],
    response: {
      data: [
        {
          fecha: "18/01/2026",
          valor: 1283.12,
        },
        {
          fecha: "19/01/2026",
          valor: 1284.23,
        },
        {
          fecha: "20/01/2026",
          valor: 1285.34,
        },
      ],
    },
  },
  {
    id: "uva-range",
    method: "GET",
    path: "/api/uva/range?desde=AAAA-MM-DD&hasta=AAAA-MM-DD",
    title: "UVA por Rango de Fecha",
    description: "Devuelve los valores de la UVA dentro de un rango de días específico. El formato de fecha es AAAA-MM-DD.",
    parameters: [
      {
        name: "desde",
        type: "string",
        required: true,
        description: "Fecha inicial en formato AAAA-MM-DD (ej: 2026-01-16)",
      },
      {
        name: "hasta",
        type: "string",
        required: true,
        description: "Fecha final en formato AAAA-MM-DD (ej: 2026-01-18)",
      },
    ],
    response: {
      data: [
        {
          fecha: "16/01/2026",
          valor: 1281.56,
        },
        {
          fecha: "17/01/2026",
          valor: 1282.34,
        },
        {
          fecha: "18/01/2026",
          valor: 1283.12,
        },
      ],
    },
  },
  {
    id: "combustible-provincia",
    method: "GET",
    path: "/api/combustibles/provincia/{provincia}",
    title: "Precios de Combustible por Provincia",
    description:
      "Obtiene los precios actualizados de combustibles en todas las estaciones de servicio de una provincia específica.",
    parameters: [
      {
        name: "provincia",
        type: "string",
        required: true,
        description: "Nombre de la provincia en formato slug (ej: chaco, buenos-aires, cordoba)",
      },
    ],
    response: {
      data: [
        {
          combustible: "Nafta Súper",
          direccion: "AV. 9 DE JULIO 4115",
          empresa: "BLANCA",
          localidad: "BARRANQUERAS",
          precios: {
            día: 1570,
            noche: 1570,
          },
          provincia: "chaco",
          vigencia: "07/11/2025",
        },
      ],
    },
  },
  {
    id: "combustible-empresa",
    method: "GET",
    path: "/api/combustibles/empresa/{empresa}",
    title: "Precios de Combustible por Empresa",
    description: "Obtiene los precios de combustibles en todas las estaciones de servicio de una empresa específica.",
    parameters: [
      {
        name: "empresa",
        type: "string",
        required: true,
        description: "Nombre de la empresa en minúsculas (ej: axion, ypf, shell)",
      },
    ],
    response: {
      data: [
        {
          combustible: "Nafta Súper",
          direccion: "SAN MARTIN 201",
          empresa: "AXION",
          localidad: "CASTELLI",
          precios: {
            día: 1743,
            noche: 1743,
          },
          provincia: "chaco",
          vigencia: "15/11/2025",
        },
      ],
    },
  },
  {
    id: "combustible-promedio",
    method: "GET",
    path: "/api/combustibles/promedio/{provincia}/{combustible}",
    title: "Precio Promedio de Combustible",
    description: "Calcula el precio promedio de un tipo de combustible específico en una provincia determinada.",
    parameters: [
      {
        name: "provincia",
        type: "string",
        required: true,
        description: "Nombre de la provincia en formato slug (ej: chaco, buenos-aires)",
      },
      {
        name: "combustible",
        type: "string",
        required: true,
        description: "Tipo de combustible en formato slug (ej: nafta-super, gasoil-grado-2, gnc)",
      },
    ],
    response: {
      data: {
        combustible: "Nafta Super",
        precio_promedio: 1747.63,
        provincia: "chaco",
      },
    },
  },
  {
    id: "canasta",
    method: "GET",
    path: "/api/canasta",
    title: "Canasta Basica (CBT y CBA)",
    description: "Ultimo dato publicado por el INDEC de la Canasta Basica Total (CBT) y Canasta Basica Alimentaria (CBA) con variaciones y valores por tipo de hogar.",
    parameters: [],
    response: {
      data: {
        periodo: "2026-02",
        fecha_publicacion: "2026-03-12",
        fuente: "INDEC - Direccion Nacional de Estadisticas de Precios",
        cba: {
          variacion_mensual: 3.2,
          variacion_acumulada_anio: 9.3,
          variacion_interanual: 37.6,
          adulto_equivalente: 208442.85,
          hogares: {
            hogar_1: { integrantes: 3, valor: 512769.41 },
            hogar_2: { integrantes: 4, valor: 644088.41 },
            hogar_3: { integrantes: 5, valor: 677439.26 },
          },
        },
        cbt: {
          variacion_mensual: 2.7,
          variacion_acumulada_anio: 6.8,
          variacion_interanual: 32.1,
          adulto_equivalente: 452320.98,
          hogares: {
            hogar_1: { integrantes: 3, valor: 1112709.61 },
            hogar_2: { integrantes: 4, valor: 1397671.83 },
            hogar_3: { integrantes: 5, valor: 1470043.19 },
          },
        },
      },
    },
  },
  {
    id: "canasta-history",
    method: "GET",
    path: "/api/canasta/history",
    title: "Historico de Canasta Basica",
    description: "Historico de la Canasta Basica Total (CBT) y Canasta Basica Alimentaria (CBA) desde Febrero de 2025.",
    parameters: [],
    response: {
      data: [
        {
          periodo: "2025-02",
          cba: { adulto_equivalente: 151491.17, variacion_mensual: 3.2 },
          cbt: { adulto_equivalente: 342370.04, variacion_mensual: 2.3 },
        },
        {
          periodo: "2025-03",
          cba: { adulto_equivalente: 160393.45, variacion_mensual: 5.9 },
          cbt: { adulto_equivalente: 356064.84, variacion_mensual: 4.0 },
        },
      ],
    },
  },
  {
    id: "canasta-range",
    method: "GET",
    path: "/api/canasta/range?desde=AAAA-MM&hasta=AAAA-MM",
    title: "Canasta Basica por Rango de Fecha",
    description: "CBT y CBA en un rango de fecha dado, disponible desde Febrero de 2025. El formato de fecha es AAAA-MM.",
    parameters: [
      {
        name: "desde",
        type: "string",
        required: true,
        description: "Fecha inicial en formato AAAA-MM (ej: 2025-02)",
      },
      {
        name: "hasta",
        type: "string",
        required: true,
        description: "Fecha final en formato AAAA-MM (ej: 2025-03)",
      },
    ],
    response: {
      data: [
        {
          periodo: "2025-02",
          cba: { adulto_equivalente: 151491.17, variacion_mensual: 3.2 },
          cbt: { adulto_equivalente: 342370.04, variacion_mensual: 2.3 },
        },
        {
          periodo: "2025-03",
          cba: { adulto_equivalente: 160393.45, variacion_mensual: 5.9 },
          cbt: { adulto_equivalente: 356064.84, variacion_mensual: 4.0 },
        },
      ],
    },
  },
  {
    id: "provincias",
    method: "GET",
    path: "/api/provincias",
    title: "Provincias y Municipios",
    description: "Listado de provincias argentinas con sus municipios, coordenadas geograficas y datos censales (Censo 2022).",
    parameters: [],
    response: {
      data: [
        {
          id: "06",
          nombre: "Buenos Aires",
          centroide: { lat: -36.677, lon: -60.558 },
          municipios: [
            {
              id: "060854",
              nombre: "25 de Mayo",
              centroide: { lat: -35.432, lon: -60.171 },
              censo_2022: { poblacion: 35563, viviendas: 15460 },
            },
          ],
        },
      ],
    },
  },
  {
    id: "credito",
    method: "GET",
    path: "/api/credito/{cuil}/{salario_mensual}/{tea}",
    title: "Scoring Crediticio",
    description: "Evaluacion de perfil crediticio a partir de los datos de la central de deudores del BCRA. Devuelve recomendacion de prestamo maximo, cuota y plazo estimado.",
    beta: true,
    parameters: [
      {
        name: "cuil",
        type: "string",
        required: true,
        description: "CUIL del solicitante sin guiones (ej: 20123456789)",
      },
      {
        name: "salario_mensual",
        type: "number",
        required: true,
        description: "Salario mensual en pesos argentinos (ej: 500000)",
      },
      {
        name: "tea",
        type: "number",
        required: true,
        description: "Tasa Efectiva Anual en porcentaje (ej: 85)",
      },
    ],
    response: {
      data: {
        cuil: "20123456789",
        salario_mensual: 500000,
        tea: 85,
        scoring: {
          puntaje: 750,
          categoria: "Bueno",
          deuda_actual: 0,
        },
        recomendacion: {
          prestamo_maximo: 2500000,
          cuota_estimada: 125000,
          plazo_meses: 24,
        },
      },
    },
  },
  {
    id: "medicamentos",
    method: "GET",
    path: "/api/medicamentos/{medicamento}",
    title: "Precio de Medicamentos",
    description: "Busqueda de medicamentos por nombre con precio de referencia e informacion complementaria. Datos del Vademecum oficial.",
    beta: true,
    parameters: [
      {
        name: "medicamento",
        type: "string",
        required: true,
        description: "Nombre del medicamento a buscar (ej: ibuprofeno, paracetamol)",
      },
    ],
    response: {
      query: "ibuprofeno",
      total: 191,
      results: [
        {
          nombre: "IBUPROFENO FECOFAR",
          presentacion: "susp.oral x 90 ml",
          laboratorio: "Fecofar",
          precio: 597.0,
          tipo_venta: "Venta Libre",
          droga: "ibuprofeno",
          fecha_actualizacion: "26/02/2026",
        },
      ],
    },
  },
  {
    id: "construccion",
    method: "GET",
    path: "/api/construccion",
    title: "Índice del Costo de la Construcción (ICC)",
    description: "Devuelve los precios de la construccion por metro cuadrado en pesos y las variaciones porcentuales vigentes.",
    beta: true,
    parameters: [],
    response: {
      data: {
        anio: 2026,
        fecha_proximo_informe: "17/03/2026",
        fecha_publicacion: "19/02/2026",
        fuente: "INDEC ICC",
        mes: 1,
        precio_m2_actual: {
          gastos_generales: 144961.78,
          mano_obra: 747848.94,
          materiales: 704837.02,
          total: 1597647.74,
        },
        variaciones: {
          gastos_generales: 2.2,
          general: 2.3,
          mano_obra: 3.1,
          materiales: 1.4,
        },
      },
    },
  },
  {
    id: "rios",
    method: "GET",
    path: "/api/rios",
    title: "Estado de Todos los Rios",
    description: "Devuelve el ultimo estado disponible de todos los rios con sus puertos y resumen. Datos obtenidos de Prefectura Naval Argentina.",
    parameters: [],
    response: {
      source: "prefectura_naval_argentina",
      updated_at: "2026-01-25T09:30:00Z",
      rios: [
        {
          nombre: "PARANA",
          estado_general: "baja",
          puertos: ["..."],
          resumen: {
            puertos_total: 12,
            crece: 2,
            baja: 5,
            estac: 5,
          },
        },
      ],
    },
  },
  {
    id: "rio-especifico",
    method: "GET",
    path: "/api/rios/rio/{nombre_rio}",
    title: "Estado de un Rio Especifico",
    description: "Devuelve el estado de un rio especifico con sus puertos y resumen.",
    parameters: [
      {
        name: "nombre_rio",
        type: "string",
        required: true,
        description: "Nombre del rio (ej: parana, uruguay, delta-parana, de-la-plata)",
      },
    ],
    response: {
      nombre: "URUGUAY",
      estado_general: "estac",
      puertos: [
        {
          nombre: "CONCORDIA",
          altura_m: 2.15,
          variacion_m: 0.0,
          estado: "estac",
          fecha: "2026-01-25",
          hora: "09:00",
          periodo: "24h",
        },
      ],
      resumen: {
        puertos_total: 1,
        crece: 0,
        baja: 0,
        estac: 1,
        altura_promedio_m: 2.1,
        altura_max_m: 4.8,
        altura_min_m: 1.9,
      },
    },
  },
  {
    id: "cer",
    method: "GET",
    path: "/api/cer",
    title: "Coeficiente de Estabilización de Referencia (CER)",
    description: "Valor y fecha de publicación de la CER del día en curso según el BCRA.",
    parameters: [],
    response: {
      data: {
        fecha: "24/02/2026",
        valor: 512.45,
      },
    },
  },
  {
    id: "cer-history",
    method: "GET",
    path: "/api/cer/history",
    title: "Histórico de la CER",
    description: "Devuelve el histórico completo de valores del Coeficiente de Estabilización de Referencia (CER).",
    parameters: [],
    response: {
      data: [
        {
          fecha: "22/02/2026",
          valor: 510.32,
        },
        {
          fecha: "23/02/2026",
          valor: 511.15,
        },
        {
          fecha: "24/02/2026",
          valor: 512.45,
        },
      ],
    },
  },
  {
    id: "cer-range",
    method: "GET",
    path: "/api/cer/range?desde=AAAA-MM-DD&hasta=AAAA-MM-DD",
    title: "CER por Rango de Fecha",
    description: "Devuelve los valores de la CER dentro de un rango de días específico. El formato de fecha es AAAA-MM-DD.",
    parameters: [
      {
        name: "desde",
        type: "string",
        required: true,
        description: "Fecha inicial en formato AAAA-MM-DD (ej: 2026-02-22)",
      },
      {
        name: "hasta",
        type: "string",
        required: true,
        description: "Fecha final en formato AAAA-MM-DD (ej: 2026-02-24)",
      },
    ],
    response: {
      data: [
        {
          fecha: "22/02/2026",
          valor: 510.32,
        },
        {
          fecha: "23/02/2026",
          valor: 511.15,
        },
        {
          fecha: "24/02/2026",
          valor: 512.45,
        },
      ],
    },
  },
  {
    id: "personas-desaparecidas",
    method: "GET",
    path: "/api/personas-desaparecidas",
    title: "Personas Desaparecidas",
    description: "Listado completo de todas las personas desaparecidas registradas en el SIFEBU del Ministerio de Seguridad de la Nación.",
    parameters: [],
    response: {
      data: {
        fuente: "SIFEBU - Ministerio de Seguridad de la Nación",
        url_fuente: "https://www.argentina.gob.ar/seguridad/personasextraviadas",
        total: 199,
        personas: [
          {
            nombre: "Loan Danilo Peña",
            slug: "pena",
            url: "https://www.argentina.gob.ar/persona-buscada/pena",
            fecha_desaparicion: "2024-06-13",
            recompensa: {
              tiene_recompensa: true,
              monto: "$20.000.000",
            },
            descripcion: "Loan Danilo PEÑA (Paradero)...",
            foto_url: "https://www.argentina.gob.ar/sites/default/files/2024/06/loan_d_pena_fotos.jpg",
            anio_desaparicion: 2024,
          },
        ],
      },
    },
  },
  {
    id: "personas-desaparecidas-anio",
    method: "GET",
    path: "/api/personas-desaparecidas?anio=AAAA",
    title: "Personas Desaparecidas por Año",
    description: "Listado de personas desaparecidas filtradas por un año específico.",
    parameters: [
      {
        name: "anio",
        type: "string",
        required: true,
        description: "Año de desaparición en formato AAAA (ej: 2023)",
      },
    ],
    response: {
      data: {
        fuente: "SIFEBU - Ministerio de Seguridad de la Nación",
        url_fuente: "https://www.argentina.gob.ar/seguridad/personasextraviadas",
        anio: 2023,
        total: 7,
        personas: [
          {
            nombre: "Ángel Miguel Franco",
            slug: "franco-1",
            url: "https://www.argentina.gob.ar/persona-buscada/franco-1",
            fecha_desaparicion: "2023-01-29",
            recompensa: {
              tiene_recompensa: false,
              monto: null,
            },
            descripcion: "...",
            foto_url: "https://www.argentina.gob.ar/sites/default/files/2023/04/afiche_difusion_franco_angel_miguel_-_foto.png",
          },
        ],
      },
    },
  },

]

const getExamplePath = (path: string) => {
  return path
    .replace("{provincia}", "chaco")
    .replace("{empresa}", "axion")
    .replace("{combustible}", "nafta-super")
    .replace("{nombre_rio}", "parana")
    .replace("{cuil}", "20123456789")
    .replace("{salario_mensual}", "500000")
    .replace("{tea}", "85")
    .replace("{medicamento}", "ibuprofeno")
    .replace("?desde=AAAA-MM&hasta=AAAA-MM", "?desde=2025-02&hasta=2025-03")
    .replace("?anio=AAAA", "?anio=2023")
}

const generateCodeExamples = (path: string) => {
  const fullUrl = `${API_BASE_URL}${getExamplePath(path)}`

  return {
    curl: `# cURL
curl -L "${fullUrl}"`,
    javascript: `// JavaScript (fetch)
fetch('${fullUrl}')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))`,
    python: `# Python (requests)
import requests

response = requests.get('${fullUrl}')
data = response.json()
print(data)`,
    php: `<?php
// PHP (cURL)
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, '${fullUrl}');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
print_r($data);`,
  }
}

export function ApiDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0])
  const [selectedLang, setSelectedLang] = useState<"curl" | "javascript" | "python" | "php">("javascript")

  const languages = [
    { key: "javascript" as const, label: "JavaScript" },
    { key: "python" as const, label: "Python" },
    { key: "php" as const, label: "PHP" },
    { key: "curl" as const, label: "cURL" },
  ]

  const categories = [
    {
      name: "Economía e Inflación",
      endpointIds: ["ipc", "ipc-history", "ipc-range", "cer", "cer-history", "cer-range", "canasta", "canasta-history", "canasta-range", "construccion"],
    },
    {
      name: "Vivienda y Locación",
      endpointIds: ["icl", "icl-history", "icl-range", "uvi", "uvi-history", "uvi-range", "uva", "uva-history", "uva-range"],
    },
    {
      name: "Mercado y Servicios",
      endpointIds: ["combustible-provincia", "combustible-empresa", "combustible-promedio", "medicamentos", "credito"],
    },
    {
      name: "Seguridad y Personas",
      endpointIds: ["personas-desaparecidas", "personas-desaparecidas-anio"],
    },
    {
      name: "Geografía y Clima",
      endpointIds: ["provincias", "rios", "rio-especifico"],
    },
  ]

  const codeExamples = generateCodeExamples(selectedEndpoint.path)

  return (
    <section id="docs" className="border-b border-border py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background glow matching features/data sources */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Documentación de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">API</span>
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Explora los endpoints agrupados por categoría, prueba peticiones y revisa los esquemas de respuesta.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-7xl overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr] md:grid-cols-[250px_1fr]">
            {/* Sidebar con lista de endpoints usando Accordion */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 pr-2 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar"
            >
              <Accordion type="single" collapsible defaultValue="Economía e Inflación" className="w-full">
                {categories.map((category) => (
                  <AccordionItem key={category.name} value={category.name} className="border-b-0 mb-4 bg-card/40 backdrop-blur-md rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all hover:shadow-[0_0_15px_rgba(var(--primary),0.05)]">
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline font-semibold text-sm transition-all data-[state=open]:bg-primary/10 data-[state=open]:text-primary data-[state=open]:border-b data-[state=open]:border-border/50">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 px-2 pt-2 gap-1 flex flex-col">
                      {category.endpointIds.map((id) => {
                        const endpoint = endpoints.find(e => e.id === id)
                        if (!endpoint) return null
                        return (
                          <button
                            key={endpoint.id}
                            onClick={() => setSelectedEndpoint(endpoint)}
                            className={`w-full rounded-md px-3 py-2 text-left transition-all text-xs sm:text-sm flex flex-col gap-1.5 ${
                              selectedEndpoint.id === endpoint.id
                                ? "bg-primary text-primary-foreground shadow-md font-medium"
                                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={selectedEndpoint.id === endpoint.id ? "secondary" : "outline"} className={`font-mono text-[9px] sm:text-[10px] px-1.5 py-0 ${selectedEndpoint.id === endpoint.id ? "bg-white/20 text-white border-transparent" : ""}`}>
                                {endpoint.method}
                              </Badge>
                              {("beta" in endpoint && endpoint.beta) && (
                                <span className={`text-[9px] sm:text-[10px] font-bold ${selectedEndpoint.id === endpoint.id ? "text-amber-200" : "text-amber-500"}`}>BETA</span>
                              )}
                            </div>
                            <span className="truncate w-full block">{endpoint.title}</span>
                          </button>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            {/* Contenido del endpoint seleccionado */}
            <motion.div
              key={selectedEndpoint.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card/40 backdrop-blur-xl border border-border/50 shadow-xl overflow-hidden ring-1 ring-white/5">
              <CardHeader>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary font-mono shrink-0">{selectedEndpoint.method}</Badge>
                  <code className="text-sm font-mono text-muted-foreground break-all">{selectedEndpoint.path}</code>
                </div>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  {selectedEndpoint.title}
                  {("beta" in selectedEndpoint && selectedEndpoint.beta) && (
                    <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">
                      Beta
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-base">{selectedEndpoint.description}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <Tabs defaultValue="parameters" className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/20">
                    <TabsTrigger value="parameters" className="py-2.5 px-4 text-xs sm:text-sm">Parámetros</TabsTrigger>
                    <TabsTrigger value="response" className="py-2.5 px-4 text-xs sm:text-sm">Respuesta</TabsTrigger>
                    <TabsTrigger value="example" className="py-2.5 px-4 text-xs sm:text-sm">Ejemplo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="parameters" className="mt-4">
                    <div className="space-y-4">
                      {selectedEndpoint.parameters.length > 0 ? (
                        selectedEndpoint.parameters.map((param) => (
                          <div key={param.name} className="rounded-lg border border-border p-4">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <code className="font-mono text-sm font-semibold text-primary">{param.name}</code>
                              <Badge variant="secondary" className="text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">
                                  requerido
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{param.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Este endpoint no requiere parámetros.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="response" className="mt-4">
                    <div className="rounded-lg border border-border bg-[#1e1e2e] p-4 overflow-x-auto">
                      <CodeHighlighter code={JSON.stringify(selectedEndpoint.response, null, 2)} language="json" />
                    </div>
                  </TabsContent>

                  <TabsContent value="example" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex gap-2 border-b border-border overflow-x-auto">
                        {languages.map((lang) => (
                          <button
                            key={lang.key}
                            onClick={() => setSelectedLang(lang.key)}
                            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                              selectedLang === lang.key
                                ? "border-b-2 border-primary text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                      <div className="rounded-lg border border-border bg-[#1e1e2e] p-4 overflow-x-auto">
                        <CodeHighlighter code={codeExamples[selectedLang]} language={selectedLang} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Argly | API de Datos Públicos de Argentina",
  description:
    "Accede a datos públicos de Argentina: precios de combustible, IPC, ICL y más. API REST gratuita y sin autenticación para desarrolladores.",

  keywords: [
    "API Argentina",
    "datos públicos",
    "precios combustible",
    "IPC",
    "ICL",
    "REST API",
  ],

  metadataBase: new URL("https://argly.com.ar"),

  openGraph: {
    title: "Argly | API de Datos Públicos de Argentina",
    description:
      "Datos públicos de Argentina vía API REST. Gratis y sin autenticación.",
    url: "https://argly.com.ar",
    siteName: "Argly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Argly - Indicadores Argentinos",
      },
    ],
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Argly | API de Datos Públicos de Argentina",
    description:
      "Datos públicos de Argentina vía API REST. Gratis y sin autenticación.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`font-sans antialiased overflow-x-hidden w-full relative`} suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col overflow-x-hidden w-full">
          {children}
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

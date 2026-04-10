"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, Coffee, Terminal, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { CodeHighlighter } from "@/components/code-highlighter"
import { motion, Variants } from "framer-motion"

const codeExamples = {
  javascript: `// JavaScript (fetch)
fetch('https://api.argly.com.ar/api/ipc')
  .then(res => res.json())
  .then(data => console.log(data))`,
  python: `# Python (requests)
import requests

response = requests.get('https://api.argly.com.ar/api/ipc')
data = response.json()
print(data)`,
  php: `<?php
// PHP (cURL)
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://api.argly.com.ar/api/ipc');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
print_r($data);`,
  curl: `# cURL
curl -L "https://api.argly.com.ar/api/ipc"`,
}

type Language = keyof typeof codeExamples

export function Hero() {
  const [selectedLang, setSelectedLang] = useState<Language>("javascript")

  const languages: { key: Language; label: string }[] = [
    { key: "javascript", label: "JavaScript" },
    { key: "python", label: "Python" },
    { key: "php", label: "PHP" },
    { key: "curl", label: "cURL" },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-12 pb-24 sm:pt-24 sm:pb-32">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="absolute top-0 flex w-full justify-center opacity-30">
        <div className="h-[300px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-w-0 w-full">

          {/* Left Column: Text Content */}
          <motion.div
            className="text-left overflow-hidden min-w-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-6 flex flex-row flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-[10px] xs:text-[11px] sm:text-sm font-medium text-emerald-400 w-fit mx-auto lg:mx-0">

              <span className="flex items-center gap-1.5 leading-none">
                <span className="text-emerald-500">✓</span> Completamente gratuita
              </span>
              <span className="text-emerald-500/40">•</span>
              <span className="flex items-center gap-1.5 leading-none">
                <span className="text-emerald-500">✓</span> Sin registro
              </span>
              <span className="text-emerald-500/40">•</span>
              <span className="flex items-center gap-1.5 leading-none">
                <span className="text-emerald-500">✓</span> Sin límites de uso
              </span>
            </div>

            <motion.div variants={itemVariants}>
              <h1 className="mb-6 text-balance text-3xl xs:text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                El Estado como <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 relative">
                  Infraestructura
                </span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-2xl">
                IPC, ICL, UVA, UVI, CER, ICC, CBA, CBT, combustibles, medicamentos, scoring crediticio, datos censales y más. Sin autenticación, sin barreras.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
              <Button size="lg" asChild className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold bg-white text-black hover:bg-white/90 shadow-none border border-white/10 w-full sm:w-auto">
                <Link href="#docs" className="flex items-center justify-center">
                  Comenzar a integrar
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold border-white/20 bg-transparent hover:bg-white/5 text-white w-full sm:w-auto"
              >
                <Link href="#playground" className="flex justify-center">Probar endpoints</Link>
              </Button>
            </div>


          </motion.div>

          {/* Right Column: Code Window */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-full lg:max-w-2xl mx-auto lg:ml-auto overflow-hidden"
          >
            <div className="rounded-xl border border-border/60 bg-black/60 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-white/10 w-full">
              {/* Window Controls */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-zinc-900/30 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex flex-wrap gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.key}
                      onClick={() => setSelectedLang(lang.key)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedLang === lang.key
                        ? "bg-cyan-500 text-black"
                        : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Code Area */}
              <div className="p-4 sm:p-6 bg-zinc-950/50 min-h-[200px] flex text-sm overflow-hidden">
                <div className="w-full overflow-hidden">
                  <CodeHighlighter code={codeExamples[selectedLang]} language={selectedLang} />
                </div>
              </div>
              {/* Footer Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 px-6 py-4 border-t border-white/5 bg-zinc-900/30">
                <span className="px-2 py-0.5 rounded flex items-center gap-1.5 text-[11px] font-medium bg-zinc-800 text-zinc-400 whitespace-nowrap">
                  <span className="font-bold text-zinc-200">27</span> endpoints
                </span>
                <span className="px-2 py-0.5 rounded flex items-center gap-1.5 text-[11px] font-medium bg-zinc-800 text-zinc-400 whitespace-nowrap">
                  <span className="font-bold text-zinc-200">4</span> categorías
                </span>
                <span className="px-2 py-0.5 rounded flex items-center gap-1.5 text-[11px] font-medium bg-zinc-800 text-zinc-400 whitespace-nowrap">
                  REST · JSON
                </span>
              </div>
            </div>
            {/* Decoration Glow */}
            <div className="absolute -inset-1 -z-10 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl rounded-xl" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

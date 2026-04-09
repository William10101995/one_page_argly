"use client"

import { Zap, Lock, TrendingUp, Code2, Globe, Clock, Server, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, Variants } from "framer-motion"

const features = [
  {
    icon: Zap,
    title: "Alta Disponibilidad",
    description: "Infraestructura escalable con tiempos de respuesta en milisegundos y un uptime garantizado del 99.9%.",
  },
  {
    icon: Lock,
    title: "Acceso Universal",
    description: "API de uso público irrestricto. Sin necesidad de autenticación, tarjetas ni tokens de desarrollador.",
  },
  {
    icon: Server,
    title: "Fuentes Oficiales",
    description: "Sincronización diaria automatizada directo desde las entidades del Estado Nacional (INDEC, BCRA, PNA).",
  },
  {
    icon: Code2,
    title: "Integración Inmediata",
    description: "Arquitectura RESTful predecible con respuestas JSON formadas bajo estándares estrictos y documentados.",
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function Features() {
  return (
    <section id="features" className="relative border-b border-border py-24 sm:py-32 bg-background overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Plataforma para <span className="text-primary">Desarrolladores</span>
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Hemos abstraído toda la complejidad burocrática para ofrecerte los datos listos para ser consumidos y mostrados.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] group">
                <CardContent className="p-6 flex flex-col items-start text-left">
                  <div className="mb-5 rounded-lg bg-primary/10 p-3 ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary transition-colors text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { Brain, Users, BarChart3, Heart, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Sistema de Bienestar Estudiantil</h1>
                <p className="text-xs text-muted-foreground">Plataforma Institucional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/help">
                <Button variant="ghost">Guía de Uso</Button>
              </Link>
              <Link href="/login">
                <Button>Iniciar Sesión</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
            <Heart className="w-4 h-4" />
            <span className="font-medium">Compromiso con tu bienestar integral</span>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 text-balance">
            Plataforma Integral de{' '}
            <span className="text-primary">Seguimiento Psicológico</span>
            {' '}y Académico
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Sistema profesional de gestión para el bienestar estudiantil que conecta psicólogos, 
            tutores y estudiantes en un solo lugar
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                <Users className="w-5 h-5" />
                Acceder al Sistema
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seguimiento Psicológico</h3>
            <p className="text-muted-foreground text-sm">
              Gestión completa de sesiones, registro emocional y asignación de tareas terapéuticas con retroalimentación en tiempo real
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tutorías Académicas</h3>
            <p className="text-muted-foreground text-sm">
              Seguimiento académico personalizado, detección temprana de riesgos y sistema de derivación a psicología
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Análisis y Reportes</h3>
            <p className="text-muted-foreground text-sm">
              Dashboard administrativo con estadísticas detalladas, indicadores de riesgo y reportes exportables
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacidad y Seguridad</h3>
            <p className="text-muted-foreground text-sm">
              Sistema de roles con acceso controlado, datos encriptados y cumplimiento de normativas de protección de datos
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Registro Emocional</h3>
            <p className="text-muted-foreground text-sm">
              Los estudiantes pueden registrar su estado de ánimo diario con visualización de tendencias y alertas automáticas
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Comunicación Integrada</h3>
            <p className="text-muted-foreground text-sm">
              Sistema de mensajería interna que conecta estudiantes con psicólogos y tutores de forma segura
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Accede al sistema con tus credenciales institucionales
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Sistema de Bienestar Estudiantil</p>
                <p className="text-xs text-muted-foreground">Plataforma Institucional</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Sistema de Bienestar. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

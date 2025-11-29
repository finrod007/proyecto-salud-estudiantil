import Link from "next/link"
import {
  Brain,
  ArrowLeft,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Heart,
  AlertCircle,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Guía del Sistema SASSE</h1>
                <p className="text-xs text-muted-foreground">Manual de Usuario</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Volver al Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Introduction */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">Manual de Usuario - SASSE</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Aprende a utilizar todas las funcionalidades del Sistema de Apoyo y Seguimiento de Salud Estudiantil
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Inicio Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <strong>Credenciales de demostración:</strong>
            </p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="bg-card p-3 rounded-lg border border-border">
                <strong>Administrador:</strong>
                <br />
                admin@sistema.edu / admin123
              </div>
              <div className="bg-card p-3 rounded-lg border border-border">
                <strong>Apoyo Psicológico:</strong>
                <br />
                psicologo@sistema.edu / psi123
              </div>
              <div className="bg-card p-3 rounded-lg border border-border">
                <strong>Tutor:</strong>
                <br />
                tutor@sistema.edu / tutor123
              </div>
              <div className="bg-card p-3 rounded-lg border border-border">
                <strong>Estudiante:</strong>
                <br />
                estudiante@sistema.edu / est123
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Guides */}
        <div className="space-y-8">
          {/* Student Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Panel del Estudiante</h3>
                <p className="text-sm text-muted-foreground">Gestiona tu bienestar emocional y académico</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Registro de Estado Emocional
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Accede a "Mi Estado Emocional" desde el menú lateral
                  </p>
                  <p>
                    <strong>2.</strong> Selecciona tu ánimo del día (1-5) usando los emojis
                  </p>
                  <p>
                    <strong>3.</strong> Agrega notas opcionales sobre cómo te sientes
                  </p>
                  <p>
                    <strong>4.</strong> Visualiza tu evolución en el gráfico de tendencias
                  </p>
                  <Badge className="mt-2">Sincronización en tiempo real</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Mis Tareas Psicológicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Ve a "Mis Tareas" para ver los compromisos asignados
                  </p>
                  <p>
                    <strong>2.</strong> Marca tareas como completadas con el checkbox
                  </p>
                  <p>
                    <strong>3.</strong> Agrega reflexiones personales sobre cada tarea
                  </p>
                  <p>
                    <strong>4.</strong> Lee la retroalimentación del apoyo psicológico cuando esté disponible
                  </p>
                  <Badge className="mt-2">Notificaciones automáticas</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Sistema de Mensajería
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Accede a "Mensajes" desde el menú
                  </p>
                  <p>
                    <strong>2.</strong> Selecciona un profesional de apoyo psicológico o tutor de la lista
                  </p>
                  <p>
                    <strong>3.</strong> Escribe y envía mensajes en tiempo real
                  </p>
                  <p>
                    <strong>4.</strong> Revisa el historial de conversaciones
                  </p>
                  <Badge className="mt-2">Comunicación segura y privada</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Citas y Sesiones
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Visualiza tus próximas citas en el dashboard principal
                  </p>
                  <p>
                    <strong>2.</strong> Recibe recordatorios de sesiones programadas
                  </p>
                  <p>
                    <strong>3.</strong> Consulta detalles de fecha, hora y ubicación
                  </p>
                  <p>
                    <strong>4.</strong> Las sesiones son programadas por tu profesional de apoyo psicológico o tutor
                  </p>
                  <Badge className="mt-2">Recordatorios automáticos</Badge>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Psychologist Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Panel de Apoyo Psicológico</h3>
                <p className="text-sm text-muted-foreground">Gestiona sesiones y seguimiento de estudiantes</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Gestión de Estudiantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Ve a "Mis Estudiantes" para ver tu lista completa
                  </p>
                  <p>
                    <strong>2.</strong> Filtra por nivel de riesgo (bajo, medio, alto)
                  </p>
                  <p>
                    <strong>3.</strong> Busca por nombre, ID o programa académico
                  </p>
                  <p>
                    <strong>4.</strong> Haz click en un estudiante para ver su perfil detallado
                  </p>
                  <Badge className="mt-2">Alertas de riesgo automáticas</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Programar Sesiones
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Accede a "Sesiones" desde el menú
                  </p>
                  <p>
                    <strong>2.</strong> Click en "Nueva Sesión" para crear una cita
                  </p>
                  <p>
                    <strong>3.</strong> Selecciona estudiante, fecha, hora y tipo de sesión
                  </p>
                  <p>
                    <strong>4.</strong> Las sesiones se sincronizan con el estudiante automáticamente
                  </p>
                  <Badge className="mt-2">Calendario integrado</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Asignar Tareas Terapéuticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Entra al perfil del estudiante
                  </p>
                  <p>
                    <strong>2.</strong> Click en "Asignar Tarea" en la pestaña de tareas
                  </p>
                  <p>
                    <strong>3.</strong> Describe la tarea y establece fecha de vencimiento
                  </p>
                  <p>
                    <strong>4.</strong> Monitorea el progreso y agrega retroalimentación
                  </p>
                  <Badge className="mt-2">Seguimiento en tiempo real</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Seguimiento Emocional
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Visualiza gráficos de evolución emocional de cada estudiante
                  </p>
                  <p>
                    <strong>2.</strong> Revisa el historial completo de registros de ánimo
                  </p>
                  <p>
                    <strong>3.</strong> Detecta patrones y tendencias preocupantes
                  </p>
                  <p>
                    <strong>4.</strong> Exporta reportes para análisis detallado
                  </p>
                  <Badge className="mt-2">Análisis predictivo</Badge>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tutor Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Panel del Tutor</h3>
                <p className="text-sm text-muted-foreground">Seguimiento académico y derivaciones</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Registrar Tutorías
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Ve a "Mis Tutorías" y click en "Nueva Tutoría"
                  </p>
                  <p>
                    <strong>2.</strong> Selecciona estudiante, fecha, hora y tipo
                  </p>
                  <p>
                    <strong>3.</strong> Agrega tema a tratar y ubicación
                  </p>
                  <p>
                    <strong>4.</strong> Registra notas después de la sesión
                  </p>
                  <Badge className="mt-2">Historial completo</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Derivar a Psicología
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Accede a "Derivaciones" desde el menú
                  </p>
                  <p>
                    <strong>2.</strong> Click en "Nueva Derivación"
                  </p>
                  <p>
                    <strong>3.</strong> Completa motivo, síntomas observados y urgencia
                  </p>
                  <p>
                    <strong>4.</strong> El profesional de apoyo psicológico recibe la notificación automáticamente
                  </p>
                  <Badge className="mt-2">Atención prioritaria</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Perfiles de Estudiantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Ve a "Mis Estudiantes" y selecciona un alumno
                  </p>
                  <p>
                    <strong>2.</strong> Revisa información académica y desempeño
                  </p>
                  <p>
                    <strong>3.</strong> Consulta historial de tutorías previas
                  </p>
                  <p>
                    <strong>4.</strong> Monitorea progreso académico por materia
                  </p>
                  <Badge className="mt-2">Vista 360° del estudiante</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Reportes Académicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Accede a "Reportes" para ver estadísticas
                  </p>
                  <p>
                    <strong>2.</strong> Visualiza estudiantes con mejor y peor desempeño
                  </p>
                  <p>
                    <strong>3.</strong> Analiza rendimiento por materia
                  </p>
                  <p>
                    <strong>4.</strong> Exporta datos en PDF, Excel o CSV
                  </p>
                  <Badge className="mt-2">Análisis detallado</Badge>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Admin Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Panel del Administrador</h3>
                <p className="text-sm text-muted-foreground">Gestión completa del sistema</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Gestión de Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Ve a "Usuarios" para ver todos los registrados
                  </p>
                  <p>
                    <strong>2.</strong> Filtra por rol (estudiante, apoyo psicológico, tutor)
                  </p>
                  <p>
                    <strong>3.</strong> Busca usuarios específicos por nombre o email
                  </p>
                  <p>
                    <strong>4.</strong> Administra permisos y estados de cuenta
                  </p>
                  <Badge className="mt-2">Control total</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Reportes del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Accede a "Reportes" para estadísticas globales
                  </p>
                  <p>
                    <strong>2.</strong> Filtra por período (semanal, mensual, anual)
                  </p>
                  <p>
                    <strong>3.</strong> Visualiza gráficos de sesiones, estudiantes y riesgos
                  </p>
                  <p>
                    <strong>4.</strong> Exporta reportes en múltiples formatos
                  </p>
                  <Badge className="mt-2">Business Intelligence</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Monitor de Riesgos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Dashboard principal muestra alertas activas
                  </p>
                  <p>
                    <strong>2.</strong> Casos críticos resaltados en rojo
                  </p>
                  <p>
                    <strong>3.</strong> Distribución de niveles de riesgo en gráficos
                  </p>
                  <p>
                    <strong>4.</strong> Notificaciones automáticas de casos urgentes
                  </p>
                  <Badge className="mt-2">Prevención proactiva</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Auditoría del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>1.</strong> Revisa logs de actividad del sistema
                  </p>
                  <p>
                    <strong>2.</strong> Monitorea accesos y cambios realizados
                  </p>
                  <p>
                    <strong>3.</strong> Detecta anomalías en el uso
                  </p>
                  <p>
                    <strong>4.</strong> Genera reportes de cumplimiento normativo
                  </p>
                  <Badge className="mt-2">Seguridad garantizada</Badge>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Support Section */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">¿Necesitas Ayuda Adicional?</CardTitle>
            <CardDescription className="text-base">Estamos aquí para apoyarte en todo momento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Soporte Técnico</h4>
                <p className="text-sm text-muted-foreground">soporte@sistema.edu</p>
                <p className="text-sm text-muted-foreground">+56 2 2345 6789</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Bienestar Estudiantil</h4>
                <p className="text-sm text-muted-foreground">bienestar@sistema.edu</p>
                <p className="text-sm text-muted-foreground">Horario: Lun-Vie 9:00-18:00</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Emergencias</h4>
                <p className="text-sm text-muted-foreground">emergencias@sistema.edu</p>
                <p className="text-sm text-muted-foreground">24/7 disponible</p>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/login">
                <Button className="w-full md:w-auto">Volver al Sistema</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

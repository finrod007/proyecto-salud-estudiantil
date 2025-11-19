'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, BookOpen, AlertTriangle, TrendingUp, LayoutDashboard, Calendar, MessageSquare, UserPlus, ArrowUpRight } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/tutor', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/tutor/students', icon: Users },
  { name: 'Tutorías', href: '/tutor/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/tutor/messages', icon: MessageSquare },
]

const stats = [
  {
    title: 'Estudiantes a Cargo',
    value: '45',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Tutorías Este Mes',
    value: '28',
    icon: BookOpen,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    title: 'Alertas Activas',
    value: '5',
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    title: 'Rendimiento Promedio',
    value: '78%',
    icon: TrendingUp,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
]

const recentAlerts = [
  {
    id: 1,
    student: 'Carlos Rodríguez',
    studentId: 'EST-5678',
    type: 'academic',
    severity: 'high',
    message: 'Bajo rendimiento en últimas 3 evaluaciones',
    action: 'Requiere derivación a psicología',
  },
  {
    id: 2,
    student: 'Laura Gómez',
    studentId: 'EST-9012',
    type: 'attendance',
    severity: 'medium',
    message: '4 ausencias no justificadas este mes',
    action: 'Contactar al estudiante',
  },
  {
    id: 3,
    student: 'Pedro Sánchez',
    studentId: 'EST-3456',
    type: 'emotional',
    severity: 'high',
    message: 'Derivación desde psicología - seguimiento académico',
    action: 'Programar tutoría',
  },
]

const upcomingTutorials = [
  {
    student: 'María López',
    topic: 'Planificación de proyectos',
    time: 'Hoy, 3:00 PM',
    location: 'Sala de Tutorías 2',
  },
  {
    student: 'José Torres',
    topic: 'Apoyo en Matemáticas',
    time: 'Mañana, 10:00 AM',
    location: 'Sala de Tutorías 1',
  },
  {
    student: 'Ana Martínez',
    topic: 'Técnicas de estudio',
    time: 'Mañana, 2:00 PM',
    location: 'Sala de Tutorías 2',
  },
]

const academicProgress = [
  {
    subject: 'Programación',
    students: 45,
    avgGrade: 82,
    atRisk: 3,
  },
  {
    subject: 'Matemáticas',
    students: 45,
    avgGrade: 75,
    atRisk: 8,
  },
  {
    subject: 'Base de Datos',
    students: 45,
    avgGrade: 88,
    atRisk: 2,
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'warning'
    case 'low':
      return 'outline'
    default:
      return 'outline'
  }
}

export default function TutorDashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'tutor') {
      router.push('/login')
    }
  }, [router])

  if (!mounted) return null

  return (
    <DashboardLayout navigation={navigation} userRole="tutor">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel del Tutor</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona el seguimiento académico de tus estudiantes
            </p>
          </div>
          <Button className="gap-2" onClick={() => router.push('/tutor/sessions')}>
            <UserPlus className="h-4 w-4" />
            Registrar Tutoría
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alerts */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alertas de Estudiantes</CardTitle>
                  <CardDescription>
                    Situaciones que requieren tu atención
                  </CardDescription>
                </div>
                <Badge variant="destructive" className="h-6">
                  {recentAlerts.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 border border-border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{alert.student}</h4>
                          <Badge variant={getSeverityColor(alert.severity) as any}>
                            {alert.severity === 'high' ? 'Urgente' : 'Atención'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.studentId}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-sm text-primary font-medium">{alert.action}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Ver Perfil
                      </Button>
                      {alert.type === 'academic' && (
                        <Button size="sm" className="flex-1">
                          Derivar a Psicología
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tutorials */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Próximas Tutorías</CardTitle>
              <CardDescription>
                Tu agenda de tutorías programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTutorials.map((tutorial, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{tutorial.student}</h4>
                      <p className="text-sm text-foreground">{tutorial.topic}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{tutorial.time}</span>
                        <span>•</span>
                        <span>{tutorial.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  Ver Calendario Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Progress */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Rendimiento Académico por Materia</CardTitle>
            <CardDescription>
              Resumen del desempeño de tus estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {academicProgress.map((subject) => (
                <div key={subject.subject} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{subject.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {subject.students} estudiantes
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold">{subject.avgGrade}%</div>
                      {subject.atRisk > 0 && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{subject.atRisk} en riesgo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Progress value={subject.avgGrade} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/tutor/referrals')}>
            <CardHeader>
              <CardTitle className="text-lg">Derivar a Psicología</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Envía un estudiante al servicio de apoyo psicológico
              </p>
              <Button variant="outline" className="w-full gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Iniciar Derivación
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/tutor/reports')}>
            <CardHeader>
              <CardTitle className="text-lg">Ver Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Accede a reportes académicos y de asistencia
              </p>
              <Button variant="outline" className="w-full gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/tutor/messages')}>
            <CardHeader>
              <CardTitle className="text-lg">Contactar Estudiante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Envía un mensaje o programa una reunión
              </p>
              <Button variant="outline" className="w-full gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Enviar Mensaje
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

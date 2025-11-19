'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, Calendar, AlertCircle, TrendingUp, LayoutDashboard, MessageSquare, FileText, UserPlus } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/psychologist', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/psychologist/students', icon: Users },
  { name: 'Sesiones', href: '/psychologist/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/psychologist/messages', icon: MessageSquare },
]

const stats = [
  {
    title: 'Estudiantes Asignados',
    value: '28',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Sesiones Esta Semana',
    value: '12',
    icon: Calendar,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    title: 'Alertas Activas',
    value: '3',
    icon: AlertCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    title: 'Mejorías Reportadas',
    value: '85%',
    icon: TrendingUp,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
]

const alertStudents = [
  {
    id: 1,
    name: 'Ana Martínez',
    studentId: 'EST-1234',
    risk: 'high',
    reason: 'Cambio drástico en estado emocional (5→2)',
    lastSession: 'Hace 3 días',
    moodTrend: 'down',
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    studentId: 'EST-5678',
    risk: 'medium',
    reason: 'No ha registrado estado de ánimo en 5 días',
    lastSession: 'Hace 1 semana',
    moodTrend: 'stable',
  },
  {
    id: 3,
    name: 'Laura Gómez',
    studentId: 'EST-9012',
    risk: 'high',
    reason: 'Comentarios preocupantes en últimos registros',
    lastSession: 'Hace 2 días',
    moodTrend: 'down',
  },
]

const upcomingSessions = [
  {
    student: 'Pedro Sánchez',
    time: 'Hoy, 2:00 PM',
    type: 'Seguimiento',
    location: 'Consultorio 3',
  },
  {
    student: 'María López',
    time: 'Hoy, 4:00 PM',
    type: 'Primera Sesión',
    location: 'Consultorio 3',
  },
  {
    student: 'José Torres',
    time: 'Mañana, 10:00 AM',
    type: 'Evaluación',
    location: 'Consultorio 3',
  },
]

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'outline'
  }
}

const getRiskLabel = (risk: string) => {
  switch (risk) {
    case 'high':
      return 'Alto Riesgo'
    case 'medium':
      return 'Riesgo Medio'
    case 'low':
      return 'Bajo Riesgo'
    default:
      return 'Sin Evaluar'
  }
}

export default function PsychologistDashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'psychologist') {
      router.push('/login')
    }
  }, [router])

  if (!mounted) return null

  return (
    <DashboardLayout navigation={navigation} userRole="psychologist">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel del Psicólogo</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus sesiones y da seguimiento a tus estudiantes
            </p>
          </div>
          <Button className="gap-2" onClick={() => router.push('/psychologist/sessions')}>
            <UserPlus className="h-4 w-4" />
            Nueva Sesión
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
          {/* Alert Students */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Estudiantes con Alertas</CardTitle>
                  <CardDescription>
                    Requieren atención inmediata
                  </CardDescription>
                </div>
                <Badge variant="destructive" className="h-6">
                  {alertStudents.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border border-border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{student.name}</h4>
                          <Badge variant={getRiskColor(student.risk) as any}>
                            {getRiskLabel(student.risk)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{student.studentId}</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{student.reason}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        Última sesión: {student.lastSession}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/psychologist/students/${student.id}`)}
                      >
                        Ver Ficha
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Próximas Sesiones</CardTitle>
              <CardDescription>
                Tu agenda para los próximos días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{session.student}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{session.time}</span>
                        <span>•</span>
                        <span>{session.location}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {session.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => router.push('/psychologist/sessions')}
                >
                  Ver Todas las Sesiones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Progreso General de Estudiantes</CardTitle>
            <CardDescription>
              Resumen del bienestar emocional de tus estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estado Excelente (4-5)</span>
                <span className="font-medium">12 estudiantes (43%)</span>
              </div>
              <Progress value={43} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estado Bueno (3)</span>
                <span className="font-medium">10 estudiantes (36%)</span>
              </div>
              <Progress value={36} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Necesita Atención (1-2)</span>
                <span className="font-medium">6 estudiantes (21%)</span>
              </div>
              <Progress value={21} className="h-2 [&>div]:bg-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

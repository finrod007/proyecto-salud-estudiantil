'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Search, LayoutDashboard, Calendar, MessageSquare, ArrowRight, AlertTriangle } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/tutor', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/tutor/students', icon: Users },
  { name: 'Tutorías', href: '/tutor/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/tutor/messages', icon: MessageSquare },
]

const students = [
  {
    id: 1,
    name: 'Ana Martínez',
    studentId: 'EST-1234',
    program: 'Ingeniería en Sistemas',
    avgGrade: 85,
    attendance: 92,
    emotionalStatus: 3,
    academicRisk: 'low',
    lastContact: 'Hace 2 días',
    alerts: 0,
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    studentId: 'EST-5678',
    program: 'Ingeniería en Sistemas',
    avgGrade: 65,
    attendance: 78,
    emotionalStatus: 2,
    academicRisk: 'high',
    lastContact: 'Hace 1 semana',
    alerts: 2,
  },
  {
    id: 3,
    name: 'Laura Gómez',
    studentId: 'EST-9012',
    program: 'Ingeniería en Sistemas',
    avgGrade: 78,
    attendance: 88,
    emotionalStatus: 4,
    academicRisk: 'medium',
    lastContact: 'Hace 3 días',
    alerts: 1,
  },
  {
    id: 4,
    name: 'Pedro Sánchez',
    studentId: 'EST-3456',
    program: 'Ingeniería en Sistemas',
    avgGrade: 90,
    attendance: 95,
    emotionalStatus: 4,
    academicRisk: 'low',
    lastContact: 'Ayer',
    alerts: 0,
  },
  {
    id: 5,
    name: 'María López',
    studentId: 'EST-7890',
    program: 'Ingeniería en Sistemas',
    avgGrade: 82,
    attendance: 90,
    emotionalStatus: 3,
    academicRisk: 'low',
    lastContact: 'Hace 1 día',
    alerts: 0,
  },
]

const getRiskBadge = (risk: string) => {
  switch (risk) {
    case 'high':
      return { label: 'Alto Riesgo', variant: 'destructive' as const }
    case 'medium':
      return { label: 'Riesgo Medio', variant: 'warning' as const }
    case 'low':
      return { label: 'Bajo Riesgo', variant: 'success' as const }
    default:
      return { label: 'Sin Evaluar', variant: 'outline' as const }
  }
}

const getMoodEmoji = (mood: number) => {
  const emojis = ['😢', '😟', '😐', '😊', '😄']
  return emojis[mood - 1] || '😐'
}

export default function TutorStudentsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'tutor') {
      router.push('/login')
    }
  }, [router])

  if (!mounted) return null

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout navigation={navigation} userRole="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mis Estudiantes</h1>
            <p className="text-muted-foreground mt-1">
              Lista completa de estudiantes bajo tu tutoría
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Estudiantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Asistencia Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88%</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">8</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Estudiantes</CardTitle>
                <CardDescription>Gestiona y da seguimiento a tus estudiantes</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar estudiantes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const riskBadge = getRiskBadge(student.academicRisk)
                
                return (
                  <div
                    key={student.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{student.name}</h4>
                              {student.alerts > 0 && (
                                <Badge variant="destructive" className="h-5 gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  {student.alerts}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {student.studentId} • {student.program}
                            </p>
                          </div>
                          <Badge variant={riskBadge.variant}>
                            {riskBadge.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs mb-1">Promedio</p>
                            <p className="font-semibold">{student.avgGrade}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs mb-1">Asistencia</p>
                            <p className="font-semibold">{student.attendance}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs mb-1">Estado Emocional</p>
                            <p className="text-xl">{getMoodEmoji(student.emotionalStatus)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs mb-1">Último Contacto</p>
                            <p className="font-semibold text-xs">{student.lastContact}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => router.push(`/tutor/students/${student.studentId}`)}>
                            Ver Perfil Completo
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => router.push('/tutor/sessions')}>
                            Registrar Tutoría
                          </Button>
                          {student.academicRisk === 'high' && (
                            <Button size="sm" className="flex-1" onClick={() => router.push('/tutor/referrals')}>
                              Derivar a Psicología
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { dataStore } from '@/lib/store'
import { Users, LayoutDashboard, Calendar, MessageSquare, ArrowLeft, Mail, Phone, BookOpen, TrendingDown, TrendingUp, Minus } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/tutor', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/tutor/students', icon: Users },
  { name: 'Tutorías', href: '/tutor/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/tutor/messages', icon: MessageSquare },
]

const studentData = {
  'EST-1234': {
    id: 'EST-1234',
    name: 'Ana Martínez',
    email: 'ana.martinez@university.edu',
    phone: '+52 55 1234 5678',
    program: 'Ingeniería en Sistemas',
    semester: '5to Semestre',
    avgGrade: 85,
    attendance: 92,
    creditsCompleted: 180,
    creditsTotal: 240,
    academicRisk: 'low',
    currentMood: 3,
    lastContact: '2024-01-15',
    subjects: [
      { name: 'Programación Web', grade: 90, attendance: 95, status: 'good' },
      { name: 'Bases de Datos', grade: 82, attendance: 90, status: 'good' },
      { name: 'Redes', grade: 78, attendance: 88, status: 'attention' },
      { name: 'Matemáticas Discretas', grade: 88, attendance: 93, status: 'good' },
    ],
    tutoringHistory: [
      { date: '2024-01-15', topic: 'Apoyo en Redes', duration: '60 min', notes: 'Mejoró comprensión de protocolos' },
      { date: '2024-01-08', topic: 'Técnicas de estudio', duration: '45 min', notes: 'Estableció plan de estudio' },
      { date: '2023-12-18', topic: 'Preparación de exámenes', duration: '60 min', notes: 'Organización de temario' },
    ],
  },
  'EST-5678': {
    id: 'EST-5678',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@university.edu',
    phone: '+52 55 9876 5432',
    program: 'Ingeniería en Sistemas',
    semester: '3er Semestre',
    avgGrade: 65,
    attendance: 78,
    creditsCompleted: 90,
    creditsTotal: 240,
    academicRisk: 'high',
    currentMood: 2,
    lastContact: '2024-01-10',
    subjects: [
      { name: 'Programación', grade: 60, attendance: 70, status: 'risk' },
      { name: 'Matemáticas', grade: 65, attendance: 75, status: 'risk' },
      { name: 'Física', grade: 70, attendance: 85, status: 'attention' },
      { name: 'Química', grade: 68, attendance: 80, status: 'attention' },
    ],
    tutoringHistory: [
      { date: '2024-01-10', topic: 'Recuperación académica', duration: '90 min', notes: 'Plan de mejora urgente' },
      { date: '2024-01-03', topic: 'Motivación y hábitos', duration: '60 min', notes: 'Identificó causas de bajo rendimiento' },
    ],
  },
}

export default function StudentProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'tutor') {
      router.push('/login')
    }
  }, [router])

  if (!mounted) return null

  const studentId = params.id as string
  const student = studentData[studentId as keyof typeof studentData]

  if (!student) {
    return (
      <DashboardLayout navigation={navigation} userRole="tutor">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Estudiante no encontrado</p>
          <Button className="mt-4" onClick={() => router.push('/tutor/students')}>
            Volver a Estudiantes
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😟', '😐', '😊', '😄']
    return emojis[mood - 1] || '😐'
  }

  const getRiskBadge = (risk: string) => {
    const badges = {
      high: { label: 'Alto Riesgo', variant: 'destructive' as const },
      medium: { label: 'Riesgo Medio', variant: 'warning' as const },
      low: { label: 'Bajo Riesgo', variant: 'success' as const },
    }
    return badges[risk as keyof typeof badges]
  }

  const getSubjectStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <TrendingUp className="h-4 w-4 text-success" />
      case 'risk':
        return <TrendingDown className="h-4 w-4 text-destructive" />
      case 'attention':
        return <Minus className="h-4 w-4 text-warning" />
      default:
        return null
    }
  }

  const riskBadge = getRiskBadge(student.academicRisk)
  const progressPercentage = (student.creditsCompleted / student.creditsTotal) * 100

  return (
    <DashboardLayout navigation={navigation} userRole="tutor">
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/tutor/students')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Estudiantes
        </Button>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{student.name}</h1>
                    <p className="text-muted-foreground">{student.id}</p>
                  </div>
                  <Badge variant={riskBadge.variant} className="text-sm">
                    {riskBadge.label}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Programa</p>
                    <p className="font-medium">{student.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Semestre</p>
                    <p className="font-medium">{student.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Contacto</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estado Emocional</p>
                    <p className="text-2xl">{getMoodEmoji(student.currentMood)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{student.avgGrade}%</div>
              <Progress value={student.avgGrade} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Asistencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{student.attendance}%</div>
              <Progress value={student.attendance} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avance en Carrera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(progressPercentage)}%</div>
              <p className="text-sm text-muted-foreground mt-1">
                {student.creditsCompleted} / {student.creditsTotal} créditos
              </p>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subjects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subjects">Materias Actuales</TabsTrigger>
            <TabsTrigger value="history">Historial de Tutorías</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Desempeño por Materia</CardTitle>
                <CardDescription>
                  Estado actual del estudiante en cada asignatura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.subjects.map((subject, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">{subject.name}</h4>
                          {getSubjectStatusIcon(subject.status)}
                        </div>
                        <Badge variant={subject.status === 'risk' ? 'destructive' : subject.status === 'attention' ? 'warning' : 'success'}>
                          {subject.status === 'risk' ? 'En Riesgo' : subject.status === 'attention' ? 'Atención' : 'Bien'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Calificación</p>
                          <div className="flex items-center gap-2">
                            <Progress value={subject.grade} className="flex-1" />
                            <span className="text-sm font-semibold w-12">{subject.grade}%</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Asistencia</p>
                          <div className="flex items-center gap-2">
                            <Progress value={subject.attendance} className="flex-1" />
                            <span className="text-sm font-semibold w-12">{subject.attendance}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Historial de Tutorías</CardTitle>
                <CardDescription>
                  Sesiones de tutoría realizadas con el estudiante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.tutoringHistory.map((session, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{session.topic}</h4>
                          <span className="text-sm text-muted-foreground">{session.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{session.date}</p>
                        <p className="text-sm text-foreground mt-2">{session.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button className="flex-1" onClick={() => router.push('/tutor/sessions')}>
            Programar Tutoría
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => router.push('/tutor/referrals')}>
            Derivar a Psicología
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => router.push('/tutor/messages')}>
            Enviar Mensaje
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

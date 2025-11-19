'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Users, LayoutDashboard, Calendar, MessageSquare, FileText, Download, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/tutor', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/tutor/students', icon: Users },
  { name: 'Tutorías', href: '/tutor/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/tutor/messages', icon: MessageSquare },
]

const reportData = {
  summary: {
    totalStudents: 45,
    avgGrade: 78,
    avgAttendance: 88,
    atRisk: 8,
    tutoringSessionsMonth: 28,
    referralsMade: 5,
  },
  topPerformers: [
    { name: 'Pedro Sánchez', id: 'EST-3456', avgGrade: 90, improvement: '+5%' },
    { name: 'Sofía Ramírez', id: 'EST-1357', avgGrade: 88, improvement: '+3%' },
    { name: 'Ana Martínez', id: 'EST-1234', avgGrade: 85, improvement: '+2%' },
  ],
  studentsAtRisk: [
    { name: 'Carlos Rodríguez', id: 'EST-5678', avgGrade: 65, attendance: 78, issue: 'Bajo rendimiento' },
    { name: 'Diego Fernández', id: 'EST-9753', avgGrade: 68, attendance: 80, issue: 'Asistencia irregular' },
    { name: 'Laura Gómez', id: 'EST-9012', avgGrade: 70, attendance: 85, issue: 'Desmotivación' },
  ],
  subjectPerformance: [
    { subject: 'Programación', avgGrade: 82, trend: 'up', studentsAtRisk: 3 },
    { subject: 'Matemáticas', avgGrade: 75, trend: 'down', studentsAtRisk: 8 },
    { subject: 'Base de Datos', avgGrade: 88, trend: 'up', studentsAtRisk: 2 },
    { subject: 'Redes', avgGrade: 79, trend: 'stable', studentsAtRisk: 5 },
  ],
  attendanceByMonth: [
    { month: 'Septiembre', attendance: 92 },
    { month: 'Octubre', attendance: 90 },
    { month: 'Noviembre', attendance: 88 },
    { month: 'Diciembre', attendance: 85 },
    { month: 'Enero', attendance: 88 },
  ],
}

export default function TutorReportsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState('current')
  const [reportType, setReportType] = useState('general')

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'tutor') {
      router.push('/login')
    }
  }, [router])

  if (!mounted) return null

  const { summary, topPerformers, studentsAtRisk, subjectPerformance, attendanceByMonth } = reportData

  return (
    <DashboardLayout navigation={navigation} userRole="tutor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportes y Estadísticas</h1>
            <p className="text-muted-foreground mt-1">
              Análisis del desempeño académico de tus estudiantes
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Período Actual</SelectItem>
              <SelectItem value="last_month">Último Mes</SelectItem>
              <SelectItem value="semester">Este Semestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Reporte General</SelectItem>
              <SelectItem value="academic">Rendimiento Académico</SelectItem>
              <SelectItem value="attendance">Asistencia</SelectItem>
              <SelectItem value="tutoring">Tutorías</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estudiantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalStudents}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgGrade}%</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Asistencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgAttendance}%</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{summary.atRisk}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tutorías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.tutoringSessionsMonth}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Derivaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.referralsMade}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Performers */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Mejores Desempeños</CardTitle>
              <CardDescription>
                Estudiantes con mejor rendimiento académico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10 text-success font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{student.avgGrade}%</p>
                      <div className="flex items-center gap-1 text-success text-sm">
                        <TrendingUp className="h-3 w-3" />
                        <span>{student.improvement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Students at Risk */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Estudiantes en Riesgo</CardTitle>
              <CardDescription>
                Requieren atención y seguimiento especial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentsAtRisk.map((student, index) => (
                  <div key={index} className="p-3 border border-destructive/20 bg-destructive/5 rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                      </div>
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Riesgo
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Promedio: </span>
                        <span className="font-semibold">{student.avgGrade}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Asistencia: </span>
                        <span className="font-semibold">{student.attendance}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-destructive">{student.issue}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Ver Perfil Completo
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Performance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Rendimiento por Materia</CardTitle>
            <CardDescription>
              Desempeño promedio de los estudiantes en cada asignatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{subject.subject}</h4>
                      {subject.trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
                      {subject.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">{subject.avgGrade}%</span>
                      {subject.studentsAtRisk > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {subject.studentsAtRisk} en riesgo
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={subject.avgGrade} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Trend */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Tendencia de Asistencia</CardTitle>
            <CardDescription>
              Evolución de la asistencia durante el período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceByMonth.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.month}</span>
                    <span className="text-sm font-bold">{data.attendance}%</span>
                  </div>
                  <Progress value={data.attendance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { LayoutDashboard, Settings, FileText, Users, Download, TrendingUp, Brain, Calendar, Activity, AlertTriangle, CheckCircle, BarChart3, FileSpreadsheet, Printer } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/admin', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/admin/users', icon: Users },
  { name: 'Reportes', href: '/admin/reports', icon: FileText },
  { name: 'Configuración', href: '/admin/settings', icon: Settings },
]

export default function ReportsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState('month')
  const [reportType, setReportType] = useState('general')

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'admin') {
      router.push('/login')
    }
  }, [router])

  const handleExport = (format: string) => {
    alert(`Exportando reporte en formato ${format.toUpperCase()}...`)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!mounted) return null

  return (
    <DashboardLayout navigation={navigation} userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportes del Sistema</h1>
            <p className="text-muted-foreground mt-1">
              Genera y visualiza reportes estadísticos del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={() => handleExport('pdf')} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Filtros de Reporte</CardTitle>
            <CardDescription>Selecciona el período y tipo de reporte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Período</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mes</SelectItem>
                    <SelectItem value="quarter">Este Trimestre</SelectItem>
                    <SelectItem value="year">Este Año</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Reporte</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="psychological">Psicológico</SelectItem>
                    <SelectItem value="academic">Académico</SelectItem>
                    <SelectItem value="risk">Estudiantes en Riesgo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Formato</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="risk">Análisis de Riesgo</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Sesiones
                  </CardTitle>
                  <Activity className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">892</div>
                  <p className="text-sm text-chart-4 mt-1">+18% vs mes anterior</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Estudiantes Activos
                  </CardTitle>
                  <Users className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">156</div>
                  <p className="text-sm text-chart-4 mt-1">+12% vs mes anterior</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Casos Cerrados
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">34</div>
                  <p className="text-sm text-muted-foreground mt-1">Este mes</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Alertas Activas
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-sm text-destructive mt-1">Requieren atención</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Sesiones por Mes</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: 'Enero', sessions: 650, percentage: 65 },
                      { month: 'Febrero', sessions: 720, percentage: 72 },
                      { month: 'Marzo', sessions: 780, percentage: 78 },
                      { month: 'Abril', sessions: 830, percentage: 83 },
                      { month: 'Mayo', sessions: 810, percentage: 81 },
                      { month: 'Junio', sessions: 892, percentage: 89 },
                    ].map((data) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{data.month}</span>
                          <span className="text-muted-foreground">{data.sessions} sesiones</span>
                        </div>
                        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${data.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Distribución por Tipo de Sesión</CardTitle>
                  <CardDescription>Sesiones este mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Individual', count: 412, color: 'bg-primary', percentage: 46 },
                      { type: 'Grupal', count: 256, color: 'bg-secondary', percentage: 29 },
                      { type: 'Seguimiento', count: 178, color: 'bg-accent', percentage: 20 },
                      { type: 'Crisis', count: 46, color: 'bg-destructive', percentage: 5 },
                    ].map((data) => (
                      <div key={data.type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${data.color}`} />
                            <span className="font-medium">{data.type}</span>
                          </div>
                          <span className="text-muted-foreground">{data.count} ({data.percentage}%)</span>
                        </div>
                        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${data.color} transition-all`}
                            style={{ width: `${data.percentage * 2}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Sesiones por Psicólogo</CardTitle>
                  <CardDescription>Top 5 psicólogos más activos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Dr. María González', sessions: 124, students: 28 },
                      { name: 'Dra. Ana Silva', sessions: 98, students: 22 },
                      { name: 'Dr. Carlos Méndez', sessions: 86, students: 19 },
                      { name: 'Dra. Laura Torres', sessions: 72, students: 16 },
                      { name: 'Dr. Roberto Díaz', sessions: 64, students: 14 },
                    ].map((psychologist, index) => (
                      <div key={psychologist.name} className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{psychologist.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {psychologist.sessions} sesiones • {psychologist.students} estudiantes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Horarios Pico</CardTitle>
                  <CardDescription>Horas con mayor demanda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: '09:00 - 10:00', sessions: 45, percentage: 90 },
                      { time: '10:00 - 11:00', sessions: 42, percentage: 84 },
                      { time: '14:00 - 15:00', sessions: 38, percentage: 76 },
                      { time: '15:00 - 16:00', sessions: 35, percentage: 70 },
                      { time: '11:00 - 12:00', sessions: 32, percentage: 64 },
                    ].map((slot) => (
                      <div key={slot.time} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{slot.time}</span>
                          <span className="text-muted-foreground">{slot.sessions} sesiones</span>
                        </div>
                        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{ width: `${slot.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Duración Promedio de Sesiones</CardTitle>
                <CardDescription>Por tipo de sesión</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-4">
                  {[
                    { type: 'Individual', duration: '45 min', icon: Users },
                    { type: 'Grupal', duration: '90 min', icon: Users },
                    { type: 'Seguimiento', duration: '30 min', icon: Calendar },
                    { type: 'Crisis', duration: '60 min', icon: AlertTriangle },
                  ].map((item) => (
                    <div key={item.type} className="text-center space-y-2 p-4 border border-border/50 rounded-lg">
                      <item.icon className="h-8 w-8 mx-auto text-primary" />
                      <p className="font-medium">{item.type}</p>
                      <p className="text-2xl font-bold">{item.duration}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Por Programa</CardTitle>
                  <CardDescription>Estudiantes en seguimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { program: 'Ingeniería', count: 48, color: 'bg-primary' },
                      { program: 'Medicina', count: 36, color: 'bg-secondary' },
                      { program: 'Derecho', count: 28, color: 'bg-accent' },
                      { program: 'Psicología', count: 22, color: 'bg-chart-4' },
                      { program: 'Otros', count: 22, color: 'bg-chart-5' },
                    ].map((item) => (
                      <div key={item.program} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm">{item.program}</span>
                        </div>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Por Año</CardTitle>
                  <CardDescription>Distribución por nivel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { year: 'Primer Año', count: 52, color: 'bg-primary' },
                      { year: 'Segundo Año', count: 38, color: 'bg-secondary' },
                      { year: 'Tercer Año', count: 34, color: 'bg-accent' },
                      { year: 'Cuarto Año', count: 22, color: 'bg-chart-4' },
                      { year: 'Quinto Año', count: 10, color: 'bg-chart-5' },
                    ].map((item) => (
                      <div key={item.year} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm">{item.year}</span>
                        </div>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Estado Emocional</CardTitle>
                  <CardDescription>Promedio último mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { mood: 'Muy Bien', count: 45, emoji: '😊', color: 'bg-chart-4' },
                      { mood: 'Bien', count: 62, emoji: '🙂', color: 'bg-primary' },
                      { mood: 'Regular', count: 34, emoji: '😐', color: 'bg-accent' },
                      { mood: 'Mal', count: 12, emoji: '😔', color: 'bg-warning' },
                      { mood: 'Muy Mal', count: 3, emoji: '😢', color: 'bg-destructive' },
                    ].map((item) => (
                      <div key={item.mood} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.emoji}</span>
                          <span className="text-sm">{item.mood}</span>
                        </div>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Motivos de Consulta Más Comunes</CardTitle>
                <CardDescription>Top 10 razones de seguimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { reason: 'Ansiedad académica', count: 45, percentage: 29 },
                    { reason: 'Estrés', count: 38, percentage: 24 },
                    { reason: 'Depresión', count: 28, percentage: 18 },
                    { reason: 'Problemas familiares', count: 22, percentage: 14 },
                    { reason: 'Adaptación', count: 18, percentage: 12 },
                    { reason: 'Relaciones interpersonales', count: 15, percentage: 10 },
                    { reason: 'Duelo', count: 12, percentage: 8 },
                    { reason: 'Autoestima', count: 10, percentage: 6 },
                    { reason: 'Trastornos alimentarios', count: 8, percentage: 5 },
                    { reason: 'Otros', count: 20, percentage: 13 },
                  ].map((item) => (
                    <div key={item.reason} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.reason}</span>
                        <span className="text-muted-foreground">{item.count} casos</span>
                      </div>
                      <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${item.percentage * 3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border/50 border-l-4 border-l-destructive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-destructive">Riesgo Alto</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <CardDescription>Requieren atención inmediata</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-destructive mb-4">8</div>
                  <div className="space-y-2 text-sm">
                    <p>• 5 con ideación suicida</p>
                    <p>• 2 con crisis severas</p>
                    <p>• 1 con deserción inminente</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 border-l-4 border-l-warning">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-warning">Riesgo Medio</CardTitle>
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <CardDescription>Seguimiento cercano</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-warning mb-4">24</div>
                  <div className="space-y-2 text-sm">
                    <p>• 12 con ansiedad severa</p>
                    <p>• 8 con depresión moderada</p>
                    <p>• 4 con bajo rendimiento</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 border-l-4 border-l-chart-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-chart-4">Riesgo Bajo</CardTitle>
                    <CheckCircle className="h-5 w-5 text-chart-4" />
                  </div>
                  <CardDescription>Seguimiento regular</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-chart-4 mb-4">124</div>
                  <div className="space-y-2 text-sm">
                    <p>• 89 en seguimiento preventivo</p>
                    <p>• 28 en fase de alta</p>
                    <p>• 7 control post-crisis</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Estudiantes de Alto Riesgo</CardTitle>
                <CardDescription>Listado detallado de casos críticos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 'EST-1234',
                      name: 'Estudiante A',
                      program: 'Ingeniería',
                      year: '2° Año',
                      risk: 'Ideación suicida',
                      lastSession: '1 día',
                      psychologist: 'Dr. María González',
                    },
                    {
                      id: 'EST-2456',
                      name: 'Estudiante B',
                      program: 'Medicina',
                      year: '3° Año',
                      risk: 'Crisis severa',
                      lastSession: '2 días',
                      psychologist: 'Dra. Ana Silva',
                    },
                    {
                      id: 'EST-3789',
                      name: 'Estudiante C',
                      program: 'Derecho',
                      year: '1° Año',
                      risk: 'Deserción inminente',
                      lastSession: '3 días',
                      psychologist: 'Dr. Carlos Méndez',
                    },
                  ].map((student) => (
                    <div
                      key={student.id}
                      className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{student.id}</span>
                            <span className="font-medium">{student.name}</span>
                            <span className="px-2 py-1 bg-destructive text-white text-xs rounded-full">
                              URGENTE
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <p>Programa: {student.program}</p>
                            <p>Año: {student.year}</p>
                            <p>Riesgo: {student.risk}</p>
                            <p>Última sesión: {student.lastSession}</p>
                            <p className="col-span-2">Psicólogo: {student.psychologist}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive">Ver Detalles</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Tendencia de Casos de Riesgo</CardTitle>
                <CardDescription>Evolución últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: 'Enero', high: 5, medium: 18, low: 102 },
                    { month: 'Febrero', high: 6, medium: 20, low: 108 },
                    { month: 'Marzo', high: 7, medium: 22, low: 115 },
                    { month: 'Abril', high: 9, medium: 25, low: 118 },
                    { month: 'Mayo', high: 7, medium: 23, low: 122 },
                    { month: 'Junio', high: 8, medium: 24, low: 124 },
                  ].map((data) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>{data.month}</span>
                        <span className="text-muted-foreground">
                          Total: {data.high + data.medium + data.low}
                        </span>
                      </div>
                      <div className="h-8 flex rounded-lg overflow-hidden">
                        <div
                          className="bg-destructive flex items-center justify-center text-white text-xs font-semibold"
                          style={{ width: `${(data.high / (data.high + data.medium + data.low)) * 100}%` }}
                        >
                          {data.high > 0 && data.high}
                        </div>
                        <div
                          className="bg-warning flex items-center justify-center text-white text-xs font-semibold"
                          style={{ width: `${(data.medium / (data.high + data.medium + data.low)) * 100}%` }}
                        >
                          {data.medium}
                        </div>
                        <div
                          className="bg-chart-4 flex items-center justify-center text-white text-xs font-semibold"
                          style={{ width: `${(data.low / (data.high + data.medium + data.low)) * 100}%` }}
                        >
                          {data.low}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded" />
                    <span>Alto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning rounded" />
                    <span>Medio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-chart-4 rounded" />
                    <span>Bajo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

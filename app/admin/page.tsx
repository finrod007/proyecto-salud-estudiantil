'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, Activity, TrendingUp, LayoutDashboard, Settings, FileText, Brain } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/admin', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/admin/users', icon: Users },
  { name: 'Reportes', href: '/admin/reports', icon: FileText },
  { name: 'Configuración', href: '/admin/settings', icon: Settings },
]

const stats = [
  {
    title: 'Usuarios Totales',
    value: '348',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Psicólogos Activos',
    value: '24',
    change: '+2',
    trend: 'up',
    icon: Brain,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    title: 'Sesiones Este Mes',
    value: '892',
    change: '+18%',
    trend: 'up',
    icon: Activity,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Estudiantes en Seguimiento',
    value: '156',
    change: '-5%',
    trend: 'down',
    icon: TrendingUp,
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
]

const recentActivities = [
  {
    user: 'Dr. María González',
    role: 'Psicóloga',
    action: 'Registró nueva sesión con estudiante #1234',
    time: 'Hace 5 minutos',
    type: 'session',
  },
  {
    user: 'Prof. Juan Pérez',
    role: 'Tutor',
    action: 'Derivó estudiante a psicología',
    time: 'Hace 15 minutos',
    type: 'referral',
  },
  {
    user: 'Admin Sistema',
    role: 'Administrador',
    action: 'Creó nueva cuenta de psicólogo',
    time: 'Hace 1 hora',
    type: 'user',
  },
  {
    user: 'Dra. Ana Silva',
    role: 'Psicóloga',
    action: 'Cerró caso de estudiante #5678',
    time: 'Hace 2 horas',
    type: 'closure',
  },
]

const systemAlerts = [
  {
    title: 'Respaldo Programado',
    message: 'El próximo respaldo del sistema está programado para mañana a las 2:00 AM',
    severity: 'info',
  },
  {
    title: 'Actualizaciones Pendientes',
    message: '3 usuarios requieren actualizar su información de contacto',
    severity: 'warning',
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'admin') {
      router.push('/login')
    }
  }, [router])

  if (!mounted) return null

  return (
    <DashboardLayout navigation={navigation} userRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona usuarios, monitorea el sistema y genera reportes
            </p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Crear Usuario
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
                <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-chart-4' : 'text-destructive'}`}>
                  {stat.change} desde el mes pasado
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones realizadas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{activity.user}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Alertas del Sistema</CardTitle>
              <CardDescription>
                Notificaciones y recordatorios importantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'warning'
                      ? 'bg-warning/5 border-warning/20'
                      : 'bg-primary/5 border-primary/20'
                  }`}
                >
                  <h4 className="text-sm font-semibold mb-1">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              ))}
              
              {/* Quick Actions */}
              <div className="pt-4 space-y-2">
                <h4 className="text-sm font-semibold mb-3">Acciones Rápidas</h4>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => router.push('/admin/reports')}
                >
                  <FileText className="h-4 w-4" />
                  Generar Reporte Mensual
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => router.push('/admin/users')}
                >
                  <Users className="h-4 w-4" />
                  Ver Todos los Usuarios
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => router.push('/admin/settings')}
                >
                  <Settings className="h-4 w-4" />
                  Configurar Sistema
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

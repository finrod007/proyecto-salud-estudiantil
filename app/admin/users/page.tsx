'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Users, UserPlus, Search, MoreHorizontal, Edit, Trash2, Mail, LayoutDashboard, Settings, FileText } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/admin', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/admin/users', icon: Users },
  { name: 'Reportes', href: '/admin/reports', icon: FileText },
  { name: 'Configuración', href: '/admin/settings', icon: Settings },
]

const mockUsers = [
  {
    id: 1,
    name: 'Dr. María González',
    email: 'maria.gonzalez@sistema.edu',
    role: 'psychologist',
    status: 'active',
    students: 28,
    lastActive: '2 minutos',
  },
  {
    id: 2,
    name: 'Prof. Juan Pérez',
    email: 'juan.perez@sistema.edu',
    role: 'tutor',
    status: 'active',
    students: 45,
    lastActive: '1 hora',
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana.martinez@estudiante.edu',
    role: 'student',
    status: 'active',
    students: 0,
    lastActive: '3 horas',
  },
  {
    id: 4,
    name: 'Dra. Carmen Silva',
    email: 'carmen.silva@sistema.edu',
    role: 'psychologist',
    status: 'inactive',
    students: 15,
    lastActive: '2 días',
  },
  {
    id: 5,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@estudiante.edu',
    role: 'student',
    status: 'active',
    students: 0,
    lastActive: '5 horas',
  },
]

const getRoleBadge = (role: string) => {
  const badges = {
    psychologist: { label: 'Apoyo Psicológico', variant: 'default' as const },
    tutor: { label: 'Tutor', variant: 'secondary' as const },
    student: { label: 'Estudiante', variant: 'outline' as const },
    admin: { label: 'Admin', variant: 'destructive' as const },
  }
  return badges[role as keyof typeof badges] || badges.student
}

const getStatusBadge = (status: string) => {
  return status === 'active' 
    ? { label: 'Activo', variant: 'success' as const }
    : { label: 'Inactivo', variant: 'outline' as const }
}

export default function UsersPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'admin') {
      router.push('/login')
    }
  }, [router])

  if (!mounted) return null

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout navigation={navigation} userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
            <p className="text-muted-foreground mt-1">
              Administra cuentas de Apoyo Psicológico, tutores y estudiantes
            </p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Crear Usuario
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">348</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Apoyo Psicológico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tutores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estudiantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">282</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Todos los Usuarios</CardTitle>
                <CardDescription>Lista completa de usuarios del sistema</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role)
                  const statusBadge = getStatusBadge(user.status)
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.role !== 'student' ? user.students : '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastActive}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar Mensaje
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

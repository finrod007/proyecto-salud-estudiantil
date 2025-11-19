'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Users, Calendar, MessageSquare, LayoutDashboard, Clock, MapPin, FileText, Plus, Search, Filter } from 'lucide-react'
import { dataStore } from '@/lib/store'

const navigation = [
  { name: 'Panel General', href: '/psychologist', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/psychologist/students', icon: Users },
  { name: 'Citas', href: '/psychologist/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/psychologist/messages', icon: MessageSquare },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmada':
    case 'completed':
      return 'success'
    case 'pendiente':
    case 'pending':
      return 'warning'
    case 'cancelada':
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmada':
      return 'Confirmada'
    case 'pendiente':
      return 'Pendiente'
    case 'cancelada':
      return 'Cancelada'
    default:
      return status
  }
}

export default function PsychologistSessionsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [formData, setFormData] = useState({
    student: '',
    date: '',
    time: '',
    duration: '60',
    type: 'Seguimiento',
    location: 'Consultorio 3',
    notes: ''
  })

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'psychologist') {
      router.push('/login')
    }
    loadSessions()
  }, [router])

  const loadSessions = () => {
    const allSessions = dataStore.getSessions()
    setSessions(allSessions)
  }

  const handleCreateSession = () => {
    const students = dataStore.getStudents()
    const student = students.find(s => s.studentId === formData.student)
    
    if (!student || !formData.date || !formData.time) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    dataStore.addSession({
      studentId: student.studentId,
      psychologistId: 'PSY-001',
      date: formData.date,
      time: formData.time,
      duration: `${formData.duration} min`,
      type: formData.type,
      location: formData.location,
      notes: formData.notes,
      status: 'pending',
    })

    loadSessions()
    setIsDialogOpen(false)
    setFormData({
      student: '',
      date: '',
      time: '',
      duration: '60',
      type: 'Seguimiento',
      location: 'Consultorio 3',
      notes: ''
    })
  }

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      dataStore.deleteSession(sessionId)
      loadSessions()
    }
  }

  if (!mounted) return null

  const upcomingSessions = sessions.filter(s => s.status === 'pending' || s.status === 'confirmada')
  const completedSessions = sessions.filter(s => s.status === 'completed')

  return (
    <DashboardLayout navigation={navigation} userRole="psychologist">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Citas</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus citas y da seguimiento a tus estudiantes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Cita</DialogTitle>
                <DialogDescription>
                  Programa una nueva cita con un estudiante
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="student">Estudiante *</Label>
                  <Select 
                    value={formData.student} 
                    onValueChange={(value) => setFormData({...formData, student: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EST-1234">Ana Martínez (EST-1234)</SelectItem>
                      <SelectItem value="EST-5678">Carlos Rodríguez (EST-5678)</SelectItem>
                      <SelectItem value="EST-9012">Laura Gómez (EST-9012)</SelectItem>
                      <SelectItem value="EST-3456">Pedro Sánchez (EST-3456)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Fecha *</Label>
                    <Input 
                      id="date" 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Hora *</Label>
                    <Input 
                      id="time" 
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duración (minutos)</Label>
                    <Select 
                      value={formData.duration}
                      onValueChange={(value) => setFormData({...formData, duration: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                        <SelectItem value="90">90 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo de Cita</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primera Cita">Primera Cita</SelectItem>
                        <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                        <SelectItem value="Evaluación">Evaluación</SelectItem>
                        <SelectItem value="Urgencia">Urgencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Select 
                    value={formData.location}
                    onValueChange={(value) => setFormData({...formData, location: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultorio 1">Consultorio 1</SelectItem>
                      <SelectItem value="Consultorio 2">Consultorio 2</SelectItem>
                      <SelectItem value="Consultorio 3">Consultorio 3</SelectItem>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Notas adicionales sobre la cita..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateSession}>
                  Crear Cita
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Citas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sessions.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Próximas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingSessions.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedSessions.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => {
                const students = dataStore.getStudents()
                const student = students.find(s => s.studentId === session.studentId)
                
                return (
                  <Card key={session.id} className="border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{student?.name || 'Estudiante'}</h3>
                            <Badge variant={getStatusColor(session.status) as any}>
                              {session.status === 'pending' ? 'Pendiente' : 'Confirmada'}
                            </Badge>
                            <Badge variant="outline">{session.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{session.studentId}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{session.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{session.time} ({session.duration})</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{session.location}</span>
                            </div>
                          </div>

                          {session.notes && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-sm text-muted-foreground">{session.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          Cancelar
                        </Button>
                        <Button size="sm" className="ml-auto">
                          Ver Ficha
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay citas próximas</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSessions.length > 0 ? (
              completedSessions.map((session) => {
                const students = dataStore.getStudents()
                const student = students.find(s => s.studentId === session.studentId)
                
                return (
                  <Card key={session.id} className="border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{student?.name || 'Estudiante'}</h3>
                            <Badge variant="outline">{session.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{session.studentId}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{session.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{session.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>No hay citas completadas aún</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

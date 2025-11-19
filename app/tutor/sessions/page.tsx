'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { dataStore, type Tutoring } from '@/lib/store'
import { Users, LayoutDashboard, Calendar, MessageSquare, Plus, BookOpen, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react'

const navigation = [
  { name: 'Panel General', href: '/tutor', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/tutor/students', icon: Users },
  { name: 'Tutorías', href: '/tutor/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/tutor/messages', icon: MessageSquare },
]

const students = [
  { id: 'EST-1234', name: 'Ana Martínez' },
  { id: 'EST-5678', name: 'Carlos Rodríguez' },
  { id: 'EST-9012', name: 'Laura Gómez' },
  { id: 'EST-3456', name: 'Pedro Sánchez' },
  { id: 'EST-7890', name: 'María López' },
]

export default function TutorSessionsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [sessions, setSessions] = useState<Tutoring[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    studentId: '',
    topic: '',
    type: 'academic' as const,
    date: '',
    time: '',
    duration: '60',
    location: '',
    notes: '',
  })

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'tutor') {
      router.push('/login')
    }
    loadSessions()
  }, [router])

  const loadSessions = () => {
    const allSessions = dataStore.getTutoringSessions()
    setSessions(allSessions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dataStore.addTutoringSession({
      ...formData,
      tutorId: 'tutor-001',
      attendance: 'present',
      status: 'scheduled',
    })
    setIsDialogOpen(false)
    setFormData({
      studentId: '',
      topic: '',
      type: 'academic',
      date: '',
      time: '',
      duration: '60',
      location: '',
      notes: '',
    })
    loadSessions()
  }

  const markAsCompleted = (id: string) => {
    dataStore.updateTutoringSession(id, { status: 'completed' })
    loadSessions()
  }

  const markAsCancelled = (id: string) => {
    dataStore.updateTutoringSession(id, { status: 'cancelled' })
    loadSessions()
  }

  if (!mounted) return null

  const scheduledSessions = sessions.filter(s => s.status === 'scheduled')
  const completedSessions = sessions.filter(s => s.status === 'completed')

  const getTypeColor = (type: string) => {
    const colors = {
      academic: 'bg-primary/10 text-primary',
      personal: 'bg-secondary/10 text-secondary',
      career: 'bg-accent/10 text-accent-foreground',
      study_skills: 'bg-success/10 text-success',
    }
    return colors[type as keyof typeof colors] || colors.academic
  }

  return (
    <DashboardLayout navigation={navigation} userRole="tutor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Tutorías</h1>
            <p className="text-muted-foreground mt-1">
              Programa y administra tus sesiones de tutoría
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Tutoría
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Tutoría</DialogTitle>
                <DialogDescription>
                  Completa los detalles de la sesión de tutoría
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Estudiante</Label>
                    <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estudiante" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Tutoría</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Académica</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="career">Orientación Vocacional</SelectItem>
                        <SelectItem value="study_skills">Técnicas de Estudio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Tema de la Tutoría</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="Ej: Apoyo en Matemáticas, Técnicas de memorización"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración (min)</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">60 min</SelectItem>
                        <SelectItem value="90">90 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Ej: Sala de Tutorías 2, Virtual - Zoom"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observaciones, materiales necesarios, etc."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Registrar Tutoría
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="scheduled" className="space-y-4">
          <TabsList>
            <TabsTrigger value="scheduled">Programadas ({scheduledSessions.length})</TabsTrigger>
            <TabsTrigger value="completed">Completadas ({completedSessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled" className="space-y-4">
            {scheduledSessions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay tutorías programadas</p>
                </CardContent>
              </Card>
            ) : (
              scheduledSessions.map(session => {
                const student = students.find(s => s.id === session.studentId)
                return (
                  <Card key={session.id} className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{session.topic}</h3>
                              <p className="text-sm text-muted-foreground">
                                {student?.name} ({session.studentId})
                              </p>
                            </div>
                            <Badge className={getTypeColor(session.type)}>
                              {session.type === 'academic' && 'Académica'}
                              {session.type === 'personal' && 'Personal'}
                              {session.type === 'career' && 'Orientación'}
                              {session.type === 'study_skills' && 'Técnicas de Estudio'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{session.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{session.time} ({session.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{session.location}</span>
                            </div>
                          </div>

                          {session.notes && (
                            <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                              {session.notes}
                            </p>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => markAsCompleted(session.id)}>
                              <CheckCircle className="h-4 w-4" />
                              Marcar Completada
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2 text-destructive" onClick={() => markAsCancelled(session.id)}>
                              <XCircle className="h-4 w-4" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSessions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay tutorías completadas</p>
                </CardContent>
              </Card>
            ) : (
              completedSessions.map(session => {
                const student = students.find(s => s.id === session.studentId)
                return (
                  <Card key={session.id} className="border-border/50 opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-success" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold">{session.topic}</h3>
                              <p className="text-sm text-muted-foreground">
                                {student?.name} • {session.date} • {session.time}
                              </p>
                            </div>
                            <Badge variant="success">Completada</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Calendar, MessageSquare, LayoutDashboard, ArrowLeft, FileText, Plus, TrendingDown, TrendingUp, Minus, Mail, Phone, Trash2, CheckCircle2, MessageCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dataStore } from '@/lib/store'

const navigation = [
  { name: 'Panel General', href: '/psychologist', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/psychologist/students', icon: Users },
  { name: 'Citas', href: '/psychologist/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/psychologist/messages', icon: MessageSquare },
]

const moodData = [
  { date: '10 Ene', mood: 4, label: 'Ene 10' },
  { date: '12 Ene', mood: 4, label: 'Ene 12' },
  { date: '15 Ene', mood: 3, label: 'Ene 15' },
  { date: '17 Ene', mood: 2, label: 'Ene 17' },
  { date: '20 Ene', mood: 2, label: 'Ene 20' },
  { date: '22 Ene', mood: 3, label: 'Ene 22' },
  { date: '25 Ene', mood: 3, label: 'Ene 25' },
]

const getMoodIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-success" />
    case 'down':
      return <TrendingDown className="h-4 w-4 text-destructive" />
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

const getMoodEmoji = (mood: number) => {
  const emojis = ['😢', '😟', '😐', '😊', '😄']
  return emojis[mood - 1] || '😐'
}

export default function StudentProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [feedbackText, setFeedbackText] = useState('')
  
  const [sessionFormData, setSessionFormData] = useState({
    date: '',
    time: '',
    duration: '60',
    type: 'Seguimiento',
    location: 'Consultorio 3',
    notes: ''
  })
  const [taskFormData, setTaskFormData] = useState({
    task: '',
    dueDate: ''
  })

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'psychologist') {
      router.push('/login')
    }
    loadSessionsAndTasks()
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('wellness_system')) {
        console.log('[v0] Storage changed, reloading data...')
        loadSessionsAndTasks()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadSessionsAndTasks()
      }
    }, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [router])

  const loadSessionsAndTasks = () => {
    const studentId = 'EST-1234'
    
    const allSessions = dataStore.getSessions()
    const studentSessions = allSessions.filter(s => s.studentId === studentId)
    console.log('[v0] Loaded sessions:', studentSessions)
    setSessions(studentSessions)

    const allTasks = dataStore.getTasks()
    const studentTasks = allTasks.filter(t => t.studentId === studentId)
    console.log('[v0] Loaded tasks:', studentTasks)
    setTasks(studentTasks)
  }

  const handleCreateSession = () => {
    if (!sessionFormData.date || !sessionFormData.time) {
      alert('Por favor completa los campos requeridos')
      return
    }

    dataStore.addSession({
      studentId: 'EST-1234',
      psychologistId: 'PSY-001',
      date: sessionFormData.date,
      time: sessionFormData.time,
      duration: `${sessionFormData.duration} min`,
      type: sessionFormData.type,
      location: sessionFormData.location,
      notes: sessionFormData.notes,
      status: 'pending',
    })

    loadSessionsAndTasks()
    setIsSessionDialogOpen(false)
    setSessionFormData({
      date: '',
      time: '',
      duration: '60',
      type: 'Seguimiento',
      location: 'Consultorio 3',
      notes: ''
    })
  }

  const handleCreateTask = () => {
    if (!taskFormData.task || !taskFormData.dueDate) {
      alert('Por favor completa los campos requeridos')
      return
    }

    dataStore.addTask({
      studentId: 'EST-1234',
      task: taskFormData.task,
      assignedBy: 'Dr. García (Psicólogo)',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: taskFormData.dueDate,
      status: 'pending',
    })

    loadSessionsAndTasks()
    setIsTaskDialogOpen(false)
    setTaskFormData({
      task: '',
      dueDate: ''
    })
  }

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'
    const updates: any = { status: newStatus }
    
    if (newStatus === 'completed') {
      updates.completedDate = new Date().toISOString().split('T')[0]
    }
    
    dataStore.updateTask(taskId, updates)
    loadSessionsAndTasks()
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      const allTasks = dataStore.getTasks()
      const filtered = allTasks.filter(t => t.id !== taskId)
      localStorage.setItem('wellness_system_tasks', JSON.stringify(filtered))
      loadSessionsAndTasks()
    }
  }

  const handleOpenFeedback = (task: any) => {
    setSelectedTask(task)
    setFeedbackText(task.feedback || '')
    setIsFeedbackDialogOpen(true)
  }

  const handleSaveFeedback = () => {
    if (!selectedTask || !feedbackText.trim()) {
      alert('Por favor escribe una retroalimentación')
      return
    }

    dataStore.updateTask(selectedTask.id, {
      feedback: feedbackText,
      feedbackDate: new Date().toISOString().split('T')[0]
    })

    loadSessionsAndTasks()
    setIsFeedbackDialogOpen(false)
    setSelectedTask(null)
    setFeedbackText('')
  }

  if (!mounted) return null

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <DashboardLayout navigation={navigation} userRole="psychologist">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Student Info Card */}
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold">Ana Martínez</h1>
                    <p className="text-muted-foreground">EST-1234 • Ingeniería en Sistemas</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      ana.martinez@estudiante.edu
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      +34 612 345 678
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Alto Riesgo</Badge>
                    <Badge variant="outline">En Seguimiento</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensaje
                </Button>
                <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Cita
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Programar Nueva Cita</DialogTitle>
                      <DialogDescription>
                        Agenda una cita con Ana Martínez
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="date">Fecha *</Label>
                          <Input 
                            id="date" 
                            type="date"
                            value={sessionFormData.date}
                            onChange={(e) => setSessionFormData({...sessionFormData, date: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="time">Hora *</Label>
                          <Input 
                            id="time" 
                            type="time"
                            value={sessionFormData.time}
                            onChange={(e) => setSessionFormData({...sessionFormData, time: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duración</Label>
                          <Select 
                            value={sessionFormData.duration}
                            onValueChange={(value) => setSessionFormData({...sessionFormData, duration: value})}
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
                            value={sessionFormData.type}
                            onValueChange={(value) => setSessionFormData({...sessionFormData, type: value})}
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
                          value={sessionFormData.location}
                          onValueChange={(value) => setSessionFormData({...sessionFormData, location: value})}
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
                          placeholder="Notas sobre la cita..."
                          rows={3}
                          value={sessionFormData.notes}
                          onChange={(e) => setSessionFormData({...sessionFormData, notes: e.target.value})}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateSession}>
                        Crear Cita
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estado Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{getMoodEmoji(3)}</span>
                <div>
                  <div className="text-2xl font-bold">3/5</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getMoodIcon('up')}
                    <span>Mejorando</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Citas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Última hace 5 días</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tareas Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.status === 'completed').length}/{tasks.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}% cumplimiento
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 días</div>
              <p className="text-xs text-muted-foreground mt-1">Desde 10 Dic 2024</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
            <TabsTrigger value="sessions">Citas</TabsTrigger>
            <TabsTrigger value="tasks">Tareas y Acuerdos</TabsTrigger>
            <TabsTrigger value="mood">Estado Emocional</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Evolución del Estado Emocional</CardTitle>
                <CardDescription>
                  Seguimiento de los últimos 30 días
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                        domain={[0, 5]}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <Card key={session.id} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{session.type}</CardTitle>
                        <CardDescription>{session.date} - {session.time}</CardDescription>
                      </div>
                      <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                        {session.status === 'completed' ? 'Completada' : 'Programada'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Notas</h4>
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      </div>
                    )}
                    {session.agreements && session.agreements.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Acuerdos y Tareas</h4>
                          <ul className="space-y-2">
                            {session.agreements.map((agreement: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-primary mt-1">•</span>
                                <span>{agreement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay citas registradas</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsSessionDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Cita
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tareas y Acuerdos</CardTitle>
                    <CardDescription>Seguimiento de compromisos terapéuticos</CardDescription>
                  </div>
                  <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Tarea
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Asignar Nueva Tarea</DialogTitle>
                        <DialogDescription>
                          Crea un compromiso o tarea para el estudiante
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="task">Descripción de la Tarea *</Label>
                          <Textarea 
                            id="task" 
                            placeholder="Ej: Practicar técnicas de respiración diariamente"
                            rows={3}
                            value={taskFormData.task}
                            onChange={(e) => setTaskFormData({...taskFormData, task: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Fecha de Cumplimiento *</Label>
                          <Input 
                            id="dueDate" 
                            type="date"
                            value={taskFormData.dueDate}
                            onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateTask}>
                          Asignar Tarea
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                    Tareas Pendientes ({pendingTasks.length})
                  </h4>
                  {pendingTasks.length > 0 ? (
                    <div className="space-y-3">
                      {pendingTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-4 border border-warning/30 bg-warning/5 rounded-lg">
                          <button 
                            onClick={() => handleToggleTask(task.id, task.status)}
                            className="flex-shrink-0 mt-1"
                          >
                            <div className="h-5 w-5 border-2 border-warning rounded-full hover:bg-warning/20 transition-colors" />
                          </button>
                          <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium">
                              {task.task}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>Asignada: {task.assignedDate}</span>
                              <span>•</span>
                              <span>Vence: {task.dueDate}</span>
                            </div>
                            {task.feedback && (
                              <div className="mt-2 p-2 bg-background rounded border border-border">
                                <p className="text-xs font-medium mb-1">Retroalimentación anterior:</p>
                                <p className="text-xs text-muted-foreground">{task.feedback}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="warning">Pendiente</Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              title="Eliminar tarea"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground text-sm">
                      No hay tareas pendientes
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                    Tareas Completadas ({completedTasks.length})
                  </h4>
                  {completedTasks.length > 0 ? (
                    <div className="space-y-3">
                      {completedTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-4 border border-success/30 bg-success/5 rounded-lg">
                          <button 
                            onClick={() => handleToggleTask(task.id, task.status)}
                            className="flex-shrink-0 mt-1"
                          >
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          </button>
                          <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium line-through decoration-muted-foreground/50">
                              {task.task}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>Asignada: {task.assignedDate}</span>
                              <span>•</span>
                              <span>Completada: {task.completedDate || 'Recientemente'}</span>
                            </div>
                            {task.feedback ? (
                              <div className="mt-2 p-3 bg-background rounded border border-border">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs font-medium">Retroalimentación:</p>
                                  <span className="text-xs text-muted-foreground">{task.feedbackDate}</span>
                                </div>
                                <p className="text-sm text-foreground">{task.feedback}</p>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenFeedback(task)}
                                className="mt-2"
                              >
                                <MessageCircle className="h-3 w-3 mr-2" />
                                Agregar Retroalimentación
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="success">Completada</Badge>
                            {task.feedback && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleOpenFeedback(task)}
                                title="Editar retroalimentación"
                              >
                                <MessageCircle className="h-4 w-4 text-primary" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              title="Eliminar tarea"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground text-sm">
                      El estudiante aún no ha completado ninguna tarea
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mood" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Comentarios del Estudiante</CardTitle>
                <CardDescription>
                  Registros personales sobre su estado emocional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moodData.map((entry, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                          <span className="font-medium">{entry.mood}/5</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{entry.date}</span>
                      </div>
                      {/* Added placeholder for comments */}
                      {/* <p className="text-sm text-foreground">{entry.comment}</p> */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Retroalimentación de Tarea</DialogTitle>
              <DialogDescription>
                Proporciona retroalimentación sobre el cumplimiento de la tarea
              </DialogDescription>
            </DialogHeader>
            
            {selectedTask && (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Tarea:</p>
                  <p className="text-sm text-muted-foreground">{selectedTask.task}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Completada: {selectedTask.completedDate || 'Recientemente'}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="feedback">Retroalimentación *</Label>
                  <Textarea 
                    id="feedback" 
                    placeholder="Escribe tu retroalimentación sobre cómo el estudiante completó esta tarea. ¿Qué observaste? ¿Qué podría mejorar?"
                    rows={5}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Esta retroalimentación se discutirá en la próxima cita
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsFeedbackDialogOpen(false)
                  setSelectedTask(null)
                  setFeedbackText('')
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveFeedback}>
                Guardar Retroalimentación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

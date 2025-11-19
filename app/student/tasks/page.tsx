'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Heart, CheckCircle2, MessageSquare, LayoutDashboard, Clock, User, MessageCircle, AlertCircle } from 'lucide-react'
import { dataStore } from '@/lib/store'

const navigation = [
  { name: 'Mi Panel', href: '/student', icon: LayoutDashboard },
  { name: 'Mi Estado Emocional', href: '/student/mood', icon: Heart },
  { name: 'Mis Tareas', href: '/student/tasks', icon: CheckCircle2 },
  { name: 'Mensajes', href: '/student/messages', icon: MessageSquare },
]

const SAMPLE_TASKS = [
  {
    studentId: 'EST-1234',
    task: 'Practicar técnica de respiración 4-7-8 antes de dormir (5 minutos diarios)',
    assignedBy: 'Dra. Patricia Muñoz',
    assignedDate: '2024-01-15',
    dueDate: '2024-01-22',
    status: 'pending' as const,
    sessionId: 'session_001'
  },
  {
    studentId: 'EST-1234',
    task: 'Escribir en diario de gratitud 3 cosas positivas del día',
    assignedBy: 'Dra. Patricia Muñoz',
    assignedDate: '2024-01-15',
    dueDate: '2024-01-22',
    status: 'pending' as const,
    sessionId: 'session_001'
  },
  {
    studentId: 'EST-1234',
    task: 'Identificar pensamientos negativos automáticos y replantearlos',
    assignedBy: 'Dra. Patricia Muñoz',
    assignedDate: '2024-01-10',
    dueDate: '2024-01-17',
    status: 'completed' as const,
    sessionId: 'session_002',
    completedDate: '2024-01-16',
    feedback: 'Excelente trabajo identificando patrones. Has mostrado gran avance en reconocer y cuestionar tus pensamientos automáticos. Continúa practicando esta técnica.',
    feedbackDate: '2024-01-17'
  },
]

export default function StudentTasksPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [studentComment, setStudentComment] = useState('')
  const [showCommentDialog, setShowCommentDialog] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'student') {
      router.push('/login')
    }
    
    const existingTasks = dataStore.getTasks('EST-1234')
    if (existingTasks.length === 0) {
      SAMPLE_TASKS.forEach(task => {
        dataStore.addTask(task)
      })
    }
    
    loadTasks()
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('wellness_system_tasks')) {
        loadTasks()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadTasks()
      }
    }, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [router])

  const loadTasks = () => {
    const allTasks = dataStore.getTasks('EST-1234')
    setTasks(allTasks)
  }

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    const updates: any = { status: newStatus }
    
    if (newStatus === 'completed') {
      updates.completedDate = new Date().toISOString().split('T')[0]
    } else {
      updates.completedDate = undefined
      updates.feedback = undefined
      updates.feedbackDate = undefined
    }
    
    dataStore.updateTask(taskId, updates)
    loadTasks()
  }

  const handleAddComment = () => {
    if (!selectedTask || !studentComment.trim()) return
    
    const updates = {
      studentComment: studentComment.trim(),
      studentCommentDate: new Date().toISOString().split('T')[0]
    }
    
    dataStore.updateTask(selectedTask.id, updates)
    setStudentComment('')
    setSelectedTask(null)
    setShowCommentDialog(false)
    loadTasks()
  }

  const openCommentDialog = (task: any) => {
    setSelectedTask(task)
    setStudentComment(task.studentComment || '')
    setShowCommentDialog(true)
  }

  if (!mounted) return null

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <DashboardLayout navigation={navigation} userRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Tareas y Compromisos</h1>
          <p className="text-muted-foreground mt-1">
            Acuerdos terapéuticos establecidos en tus sesiones psicológicas
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-sm text-muted-foreground">Total de Tareas</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 border-l-4 border-l-warning">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 border-l-4 border-l-success">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-sm text-muted-foreground">Completadas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Tareas Pendientes</CardTitle>
            <CardDescription>
              Compromisos terapéuticos que debes completar para tu bienestar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => handleToggleTask(task.id, task.status)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium leading-relaxed">{task.task}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{task.assignedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Asignada: {task.assignedDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Vence: {task.dueDate}</span>
                        </div>
                      </div>
                      
                      {task.studentComment && (
                        <div className="mt-2 p-3 bg-secondary/20 border border-secondary/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageCircle className="h-3 w-3 text-secondary" />
                            <p className="text-xs font-medium text-secondary">Mi reflexión:</p>
                            <span className="text-xs text-muted-foreground ml-auto">{task.studentCommentDate}</span>
                          </div>
                          <p className="text-sm text-foreground">{task.studentComment}</p>
                        </div>
                      )}
                      
                      {task.feedback && (
                        <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="h-3 w-3 text-primary" />
                            <p className="text-xs font-medium text-primary">Retroalimentación del psicólogo:</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{task.feedback}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant="warning">Pendiente</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openCommentDialog(task)}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {task.studentComment ? 'Editar' : 'Comentar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tienes tareas pendientes</p>
                <p className="text-sm mt-2">Excelente trabajo manteniendo tus compromisos al día</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Tareas Completadas</CardTitle>
            <CardDescription>
              Compromisos terapéuticos que has cumplido exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedTasks.length > 0 ? (
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-4 border border-border rounded-lg bg-muted/20"
                  >
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => handleToggleTask(task.id, task.status)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium line-through opacity-60 leading-relaxed">{task.task}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{task.assignedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <span>Completada: {task.completedDate}</span>
                        </div>
                      </div>
                      
                      {task.studentComment && (
                        <div className="mt-2 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageCircle className="h-3 w-3 text-secondary" />
                            <p className="text-xs font-medium text-secondary">Mi reflexión:</p>
                            <span className="text-xs text-muted-foreground ml-auto">{task.studentCommentDate}</span>
                          </div>
                          <p className="text-sm text-foreground/80">{task.studentComment}</p>
                        </div>
                      )}
                      
                      {task.feedback && (
                        <div className="mt-2 p-3 bg-success/5 border border-success/20 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-3 w-3 text-success" />
                              <p className="text-xs font-medium text-success">Retroalimentación del psicólogo:</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{task.feedbackDate}</span>
                          </div>
                          <p className="text-sm text-foreground">{task.feedback}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant="success">Completada</Badge>
                      {!task.feedback && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openCommentDialog(task)}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {task.studentComment ? 'Editar' : 'Comentar'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aún no has completado ninguna tarea</p>
                <p className="text-sm mt-2">Marca las tareas cuando las completes para registrar tu progreso</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Reflexión Personal</DialogTitle>
              <DialogDescription>
                Comparte tus pensamientos, dificultades o aprendizajes sobre esta tarea
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedTask && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{selectedTask.task}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="comment">Mi reflexión</Label>
                <Textarea
                  id="comment"
                  placeholder="Ejemplo: Esta semana practiqué la respiración 4-7-8 todas las noches. Al principio me costó concentrarme, pero después de 3 días empecé a sentirme más relajado antes de dormir..."
                  value={studentComment}
                  onChange={(e) => setStudentComment(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Tu psicólogo podrá leer esta reflexión en tu próxima sesión
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddComment} disabled={!studentComment.trim()}>
                  Guardar Reflexión
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

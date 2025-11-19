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
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { dataStore, type PsychologyReferral } from '@/lib/store'
import { Users, LayoutDashboard, Calendar, MessageSquare, ArrowRight, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'

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

const symptomOptions = [
  'Ansiedad',
  'Depresión',
  'Estrés académico',
  'Problemas de concentración',
  'Baja motivación',
  'Aislamiento social',
  'Problemas familiares',
  'Dificultades de adaptación',
  'Bajo rendimiento académico',
  'Problemas de sueño',
]

export default function TutorReferralsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [referrals, setReferrals] = useState<PsychologyReferral[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    studentId: '',
    reason: '',
    urgency: 'medium' as const,
    symptoms: [] as string[],
    previousSupport: '',
    academicImpact: '',
  })

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'tutor') {
      router.push('/login')
    }
    loadReferrals()
  }, [router])

  const loadReferrals = () => {
    const allReferrals = dataStore.getReferrals()
    setReferrals(allReferrals)
  }

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dataStore.addReferral({
      ...formData,
      referredBy: 'tutor-001',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    })
    setIsDialogOpen(false)
    setFormData({
      studentId: '',
      reason: '',
      urgency: 'medium',
      symptoms: [],
      previousSupport: '',
      academicImpact: '',
    })
    loadReferrals()
  }

  if (!mounted) return null

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Pendiente', variant: 'warning' as const },
      accepted: { label: 'Aceptada', variant: 'default' as const },
      in_progress: { label: 'En Proceso', variant: 'default' as const },
      completed: { label: 'Completada', variant: 'success' as const },
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      high: 'text-destructive',
      medium: 'text-warning',
      low: 'text-muted-foreground',
    }
    return colors[urgency as keyof typeof colors] || colors.medium
  }

  return (
    <DashboardLayout navigation={navigation} userRole="tutor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Derivaciones a Psicología</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las derivaciones de estudiantes al servicio de apoyo psicológico
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <ArrowRight className="h-4 w-4" />
                Nueva Derivación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Derivar Estudiante a Psicología</DialogTitle>
                <DialogDescription>
                  Completa el formulario de derivación con toda la información relevante
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
                    <Label htmlFor="urgency">Nivel de Urgencia</Label>
                    <Select value={formData.urgency} onValueChange={(value: any) => setFormData({...formData, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta - Requiere atención inmediata</SelectItem>
                        <SelectItem value="medium">Media - Atención en 1-2 semanas</SelectItem>
                        <SelectItem value="low">Baja - Seguimiento regular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo de la Derivación</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Describe brevemente por qué consideras necesaria la derivación..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Síntomas o Señales Observadas</Label>
                  <div className="grid grid-cols-2 gap-3 p-4 border border-border rounded-lg">
                    {symptomOptions.map(symptom => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={formData.symptoms.includes(symptom)}
                          onCheckedChange={() => handleSymptomToggle(symptom)}
                        />
                        <label htmlFor={symptom} className="text-sm cursor-pointer">
                          {symptom}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousSupport">Apoyo Previo Recibido</Label>
                  <Textarea
                    id="previousSupport"
                    value={formData.previousSupport}
                    onChange={(e) => setFormData({...formData, previousSupport: e.target.value})}
                    placeholder="¿Ha recibido apoyo psicológico anteriormente? ¿Qué intervenciones se han realizado?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicImpact">Impacto en el Rendimiento Académico</Label>
                  <Textarea
                    id="academicImpact"
                    value={formData.academicImpact}
                    onChange={(e) => setFormData({...formData, academicImpact: e.target.value})}
                    placeholder="¿Cómo está afectando la situación al desempeño académico del estudiante?"
                    rows={2}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Enviar Derivación
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Derivaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referrals.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {referrals.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Proceso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {referrals.filter(r => r.status === 'in_progress').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {referrals.filter(r => r.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Historial de Derivaciones</CardTitle>
            <CardDescription>
              Seguimiento del estado de las derivaciones realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ArrowRight className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay derivaciones registradas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map(referral => {
                  const student = students.find(s => s.id === referral.studentId)
                  const statusBadge = getStatusBadge(referral.status)
                  
                  return (
                    <div key={referral.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{student?.name}</h4>
                            <Badge variant={statusBadge.variant}>
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {referral.studentId} • Derivado el {referral.date}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 ${getUrgencyColor(referral.urgency)}`}>
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Urgencia {referral.urgency === 'high' ? 'Alta' : referral.urgency === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium mb-1">Motivo:</p>
                          <p className="text-sm text-foreground">{referral.reason}</p>
                        </div>
                        
                        {referral.symptoms.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Síntomas observados:</p>
                            <div className="flex flex-wrap gap-2">
                              {referral.symptoms.map(symptom => (
                                <Badge key={symptom} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium mb-1">Impacto académico:</p>
                          <p className="text-sm text-foreground">{referral.academicImpact}</p>
                        </div>

                        {referral.assignedPsychologist && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Asignado a: {referral.assignedPsychologist}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

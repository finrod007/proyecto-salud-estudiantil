"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Users, Calendar, FileText, CheckCircle2 } from "lucide-react"
import { dataStore } from "@/lib/store"

const navigation = [
  { name: "Inicio", href: "/psychopedagogue", icon: BookOpen },
  { name: "Derivaciones", href: "/psychopedagogue/referrals", icon: Users },
  { name: "Mis Estudiantes", href: "/psychopedagogue/students", icon: Users },
  { name: "Citas", href: "/psychopedagogue/sessions", icon: Calendar },
  { name: "Planes de Apoyo", href: "/psychopedagogue/plans", icon: FileText },
]

export default function PsychopedagogueSessions() {
  const [sessions, setSessions] = useState(dataStore.getPsychopedagogySessions())
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [openComplete, setOpenComplete] = useState(false)
  const [completionForm, setCompletionForm] = useState({
    observations: "",
    progress: "",
    nextSteps: "",
  })

  useEffect(() => {
    setSessions(dataStore.getPsychopedagogySessions())
  }, [])

  const students = dataStore.getStudents()

  const getStudentName = (studentId: string) => {
    return students.find((s) => s.studentId === studentId)?.name || "Estudiante"
  }

  const handleCompleteSession = () => {
    if (selectedSession) {
      dataStore.updatePsychopedagogySession(selectedSession.id, {
        ...completionForm,
        status: "completed",
      })
      setSessions(dataStore.getPsychopedagogySessions())
      setOpenComplete(false)
      setSelectedSession(null)
      setCompletionForm({
        observations: "",
        progress: "",
        nextSteps: "",
      })
    }
  }

  const scheduledSessions = sessions.filter((s) => s.status === "scheduled")
  const completedSessions = sessions.filter((s) => s.status === "completed")

  return (
    <DashboardLayout navigation={navigation} userRole="Psicopedagogo">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Citas Psicopedagógicas</h1>
          <p className="text-muted-foreground mt-2">Gestiona tus evaluaciones y seguimientos</p>
        </div>

        <Tabs defaultValue="scheduled" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="scheduled">Programadas ({scheduledSessions.length})</TabsTrigger>
            <TabsTrigger value="completed">Completadas ({completedSessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled" className="space-y-4">
            {scheduledSessions.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">No hay citas programadas</p>
                </CardContent>
              </Card>
            ) : (
              scheduledSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{getStudentName(session.studentId)}</CardTitle>
                        <CardDescription>
                          {session.date} - {session.time} ({session.duration} minutos)
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>
                          {session.type === "evaluation"
                            ? "Evaluación"
                            : session.type === "follow-up"
                              ? "Seguimiento"
                              : "Intervención"}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSession(session)
                            setOpenComplete(true)
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Completar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Objetivos:</Label>
                      <p className="text-sm mt-1">{session.objectives}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Actividades Planificadas:</Label>
                      <p className="text-sm mt-1">{session.activities}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSessions.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">No hay citas completadas</p>
                </CardContent>
              </Card>
            ) : (
              completedSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{getStudentName(session.studentId)}</CardTitle>
                        <CardDescription>
                          {session.date} - {session.time} ({session.duration} minutos)
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {session.type === "evaluation"
                          ? "Evaluación"
                          : session.type === "follow-up"
                            ? "Seguimiento"
                            : "Intervención"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Objetivos:</Label>
                      <p className="text-sm mt-1">{session.objectives}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Observaciones:</Label>
                      <p className="text-sm mt-1">{session.observations}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Progreso:</Label>
                      <p className="text-sm mt-1">{session.progress}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Próximos Pasos:</Label>
                      <p className="text-sm mt-1">{session.nextSteps}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={openComplete} onOpenChange={setOpenComplete}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Completar Cita</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Textarea
                  value={completionForm.observations}
                  onChange={(e) => setCompletionForm({ ...completionForm, observations: e.target.value })}
                  placeholder="Observaciones de la cita..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Progreso del Estudiante</Label>
                <Textarea
                  value={completionForm.progress}
                  onChange={(e) => setCompletionForm({ ...completionForm, progress: e.target.value })}
                  placeholder="Describe el progreso observado..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Próximos Pasos</Label>
                <Textarea
                  value={completionForm.nextSteps}
                  onChange={(e) => setCompletionForm({ ...completionForm, nextSteps: e.target.value })}
                  placeholder="Acciones a realizar en la siguiente cita..."
                  rows={4}
                />
              </div>
              <Button onClick={handleCompleteSession} className="w-full">
                Guardar y Completar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

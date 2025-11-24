"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Users, Calendar, FileText, Plus, ArrowLeft } from "lucide-react"
import { dataStore, type LearningDifficulty } from "@/lib/store"

const navigation = [
  { name: "Inicio", href: "/psychopedagogue", icon: BookOpen },
  { name: "Derivaciones", href: "/psychopedagogue/referrals", icon: Users },
  { name: "Mis Estudiantes", href: "/psychopedagogue/students", icon: Users },
  { name: "Citas", href: "/psychopedagogue/sessions", icon: Calendar },
  { name: "Planes de Apoyo", href: "/psychopedagogue/plans", icon: FileText },
]

export default function StudentProfilePsychopedagogue() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const [student] = useState(() => dataStore.getStudents().find((s) => s.id === Number(studentId)))
  const [sessions, setSessions] = useState(dataStore.getPsychopedagogySessions())
  const [plans, setPlans] = useState(dataStore.getSupportPlans())

  const [openSession, setOpenSession] = useState(false)
  const [openPlan, setOpenPlan] = useState(false)

  // Session form
  const [sessionForm, setSessionForm] = useState({
    date: "",
    time: "",
    duration: "60",
    type: "evaluation" as "evaluation" | "follow-up" | "intervention",
    objectives: "",
    activities: "",
  })

  // Plan form
  const [planForm, setPlanForm] = useState({
    difficulties: [] as LearningDifficulty[],
    generalObjectives: "",
    specificObjectives: "",
    strategies: "",
    recommendations: "",
    evaluationCriteria: "",
    reviewDate: "",
  })

  const [newDifficulty, setNewDifficulty] = useState({
    area: "reading" as "reading" | "memory" | "organization" | "attention" | "study",
    level: "medium" as "low" | "medium" | "high",
    description: "",
    observations: "",
  })

  useEffect(() => {
    setSessions(dataStore.getPsychopedagogySessions())
    setPlans(dataStore.getSupportPlans())
  }, [])

  if (!student) {
    return (
      <DashboardLayout navigation={navigation} userRole="Psicopedagogo">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Estudiante no encontrado</p>
          <Button onClick={() => router.push("/psychopedagogue/students")}>Volver</Button>
        </div>
      </DashboardLayout>
    )
  }

  const studentSessions = sessions.filter((s) => s.studentId === student.studentId)
  const studentPlans = plans.filter((p) => p.studentId === student.studentId)
  const activePlan = studentPlans.find((p) => p.status === "active")

  const handleCreateSession = () => {
    dataStore.addPsychopedagogySession({
      studentId: student.studentId,
      psychopedagogueId: "PSPED-001",
      ...sessionForm,
      observations: "",
      progress: "",
      nextSteps: "",
      status: "scheduled",
    })
    setSessions(dataStore.getPsychopedagogySessions())
    setOpenSession(false)
    setSessionForm({
      date: "",
      time: "",
      duration: "60",
      type: "evaluation",
      objectives: "",
      activities: "",
    })
  }

  const handleAddDifficulty = () => {
    if (newDifficulty.description) {
      setPlanForm({
        ...planForm,
        difficulties: [...planForm.difficulties, newDifficulty],
      })
      setNewDifficulty({
        area: "reading",
        level: "medium",
        description: "",
        observations: "",
      })
    }
  }

  const handleCreatePlan = () => {
    const specificObjectivesArray = planForm.specificObjectives.split("\n").filter((s) => s.trim())
    const strategiesArray = planForm.strategies.split("\n").filter((s) => s.trim())
    const recommendationsArray = planForm.recommendations.split("\n").filter((s) => s.trim())

    dataStore.addSupportPlan({
      studentId: student.studentId,
      psychopedagogueId: "PSPED-001",
      createdDate: new Date().toISOString().split("T")[0],
      difficulties: planForm.difficulties,
      generalObjectives: planForm.generalObjectives,
      specificObjectives: specificObjectivesArray,
      strategies: strategiesArray,
      recommendations: recommendationsArray,
      evaluationCriteria: planForm.evaluationCriteria,
      reviewDate: planForm.reviewDate,
      status: "active",
    })
    setPlans(dataStore.getSupportPlans())
    setOpenPlan(false)
    setPlanForm({
      difficulties: [],
      generalObjectives: "",
      specificObjectives: "",
      strategies: "",
      recommendations: "",
      evaluationCriteria: "",
      reviewDate: "",
    })
  }

  const areaLabels = {
    reading: "Lectura",
    memory: "Memoria",
    organization: "Organización",
    attention: "Atención",
    study: "Estudio",
  }

  const levelLabels = {
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
  }

  return (
    <DashboardLayout navigation={navigation} userRole="Psicopedagogo">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{student.name}</h1>
            <p className="text-muted-foreground mt-1">
              {student.studentId} - {student.program}
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="sessions">Citas</TabsTrigger>
            <TabsTrigger value="plans">Planes de Apoyo</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Estudiante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">ID de Estudiante</Label>
                    <p className="font-medium">{student.studentId}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Correo Electrónico</Label>
                    <p className="font-medium">{student.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Programa Académico</Label>
                    <p className="font-medium">{student.program}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Semestre</Label>
                    <p className="font-medium">{student.semester}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Plan Activo</Label>
                    {activePlan ? (
                      <Badge variant="default">Sí - Activo</Badge>
                    ) : (
                      <Badge variant="secondary">No hay plan activo</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Total de Citas</Label>
                    <p className="font-medium">{studentSessions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {activePlan && (
              <Card>
                <CardHeader>
                  <CardTitle>Plan de Apoyo Actual</CardTitle>
                  <CardDescription>Creado el {activePlan.createdDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Objetivo General</Label>
                    <p className="mt-1">{activePlan.generalObjectives}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Dificultades Identificadas</Label>
                    <div className="mt-2 space-y-2">
                      {activePlan.difficulties.map((diff, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge>{areaLabels[diff.area]}</Badge>
                          <Badge variant="outline">{levelLabels[diff.level]}</Badge>
                          <span className="text-sm">{diff.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Historial de Citas</h2>
              <Dialog open={openSession} onOpenChange={setOpenSession}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Programar Nueva Cita</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha</Label>
                        <Input
                          type="date"
                          value={sessionForm.date}
                          onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora</Label>
                        <Input
                          type="time"
                          value={sessionForm.time}
                          onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de Cita</Label>
                        <Select
                          value={sessionForm.type}
                          onValueChange={(value: any) => setSessionForm({ ...sessionForm, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="evaluation">Evaluación</SelectItem>
                            <SelectItem value="follow-up">Seguimiento</SelectItem>
                            <SelectItem value="intervention">Intervención</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duración (minutos)</Label>
                        <Input
                          value={sessionForm.duration}
                          onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Objetivos</Label>
                      <Textarea
                        value={sessionForm.objectives}
                        onChange={(e) => setSessionForm({ ...sessionForm, objectives: e.target.value })}
                        placeholder="Objetivos de la cita..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Actividades Planificadas</Label>
                      <Textarea
                        value={sessionForm.activities}
                        onChange={(e) => setSessionForm({ ...sessionForm, activities: e.target.value })}
                        placeholder="Actividades a realizar..."
                      />
                    </div>
                    <Button onClick={handleCreateSession} className="w-full">
                      Crear Cita
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {studentSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {session.date} - {session.time}
                        </CardTitle>
                        <CardDescription>
                          {session.type === "evaluation"
                            ? "Evaluación"
                            : session.type === "follow-up"
                              ? "Seguimiento"
                              : "Intervención"}{" "}
                          - {session.duration} minutos
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          session.status === "completed"
                            ? "default"
                            : session.status === "scheduled"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {session.status === "completed"
                          ? "Completada"
                          : session.status === "scheduled"
                            ? "Programada"
                            : "Cancelada"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Objetivos:</Label>
                      <p className="text-sm mt-1">{session.objectives}</p>
                    </div>
                    {session.activities && (
                      <div>
                        <Label className="text-muted-foreground">Actividades:</Label>
                        <p className="text-sm mt-1">{session.activities}</p>
                      </div>
                    )}
                    {session.observations && (
                      <div>
                        <Label className="text-muted-foreground">Observaciones:</Label>
                        <p className="text-sm mt-1">{session.observations}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {studentSessions.length === 0 && (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">No hay citas registradas</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Planes de Apoyo</h2>
              <Dialog open={openPlan} onOpenChange={setOpenPlan}>
                <DialogTrigger asChild>
                  <Button disabled={!!activePlan}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Plan de Apoyo Académico-Cognitivo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Dificultades de Aprendizaje</Label>
                      <Card className="p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Área</Label>
                              <Select
                                value={newDifficulty.area}
                                onValueChange={(value: any) => setNewDifficulty({ ...newDifficulty, area: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="reading">Lectura</SelectItem>
                                  <SelectItem value="memory">Memoria</SelectItem>
                                  <SelectItem value="organization">Organización</SelectItem>
                                  <SelectItem value="attention">Atención</SelectItem>
                                  <SelectItem value="study">Estudio</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Nivel</Label>
                              <Select
                                value={newDifficulty.level}
                                onValueChange={(value: any) => setNewDifficulty({ ...newDifficulty, level: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Bajo</SelectItem>
                                  <SelectItem value="medium">Medio</SelectItem>
                                  <SelectItem value="high">Alto</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Input
                              value={newDifficulty.description}
                              onChange={(e) => setNewDifficulty({ ...newDifficulty, description: e.target.value })}
                              placeholder="Describe la dificultad..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Observaciones</Label>
                            <Textarea
                              value={newDifficulty.observations}
                              onChange={(e) => setNewDifficulty({ ...newDifficulty, observations: e.target.value })}
                              placeholder="Observaciones adicionales..."
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleAddDifficulty}
                            variant="outline"
                            className="w-full bg-transparent"
                          >
                            Agregar Dificultad
                          </Button>
                        </div>
                      </Card>

                      {planForm.difficulties.length > 0 && (
                        <div className="space-y-2">
                          <Label>Dificultades Agregadas:</Label>
                          {planForm.difficulties.map((diff, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded">
                              <Badge>{areaLabels[diff.area]}</Badge>
                              <Badge variant="outline">{levelLabels[diff.level]}</Badge>
                              <span className="text-sm flex-1">{diff.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Objetivo General</Label>
                      <Textarea
                        value={planForm.generalObjectives}
                        onChange={(e) => setPlanForm({ ...planForm, generalObjectives: e.target.value })}
                        placeholder="Objetivo general del plan..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Objetivos Específicos (uno por línea)</Label>
                      <Textarea
                        value={planForm.specificObjectives}
                        onChange={(e) => setPlanForm({ ...planForm, specificObjectives: e.target.value })}
                        placeholder="- Objetivo 1&#10;- Objetivo 2&#10;- Objetivo 3"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Estrategias (una por línea)</Label>
                      <Textarea
                        value={planForm.strategies}
                        onChange={(e) => setPlanForm({ ...planForm, strategies: e.target.value })}
                        placeholder="- Estrategia 1&#10;- Estrategia 2"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Recomendaciones (una por línea)</Label>
                      <Textarea
                        value={planForm.recommendations}
                        onChange={(e) => setPlanForm({ ...planForm, recommendations: e.target.value })}
                        placeholder="- Recomendación 1&#10;- Recomendación 2"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Criterios de Evaluación</Label>
                      <Textarea
                        value={planForm.evaluationCriteria}
                        onChange={(e) => setPlanForm({ ...planForm, evaluationCriteria: e.target.value })}
                        placeholder="Criterios para evaluar el progreso..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha de Revisión</Label>
                      <Input
                        type="date"
                        value={planForm.reviewDate}
                        onChange={(e) => setPlanForm({ ...planForm, reviewDate: e.target.value })}
                      />
                    </div>

                    <Button onClick={handleCreatePlan} className="w-full" disabled={planForm.difficulties.length === 0}>
                      Crear Plan de Apoyo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {studentPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Plan de Apoyo Académico-Cognitivo</CardTitle>
                        <CardDescription>Creado: {plan.createdDate}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          plan.status === "active" ? "default" : plan.status === "completed" ? "secondary" : "outline"
                        }
                      >
                        {plan.status === "active"
                          ? "Activo"
                          : plan.status === "completed"
                            ? "Completado"
                            : "Suspendido"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground font-semibold">Dificultades Identificadas:</Label>
                      <div className="mt-2 space-y-2">
                        {plan.difficulties.map((diff, index) => (
                          <div key={index} className="p-3 border rounded space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge>{areaLabels[diff.area]}</Badge>
                              <Badge variant="outline">{levelLabels[diff.level]}</Badge>
                            </div>
                            <p className="text-sm">{diff.description}</p>
                            {diff.observations && <p className="text-sm text-muted-foreground">{diff.observations}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground font-semibold">Objetivo General:</Label>
                      <p className="mt-1">{plan.generalObjectives}</p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground font-semibold">Objetivos Específicos:</Label>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {plan.specificObjectives.map((obj, index) => (
                          <li key={index} className="text-sm">
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-muted-foreground font-semibold">Estrategias:</Label>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {plan.strategies.map((strat, index) => (
                          <li key={index} className="text-sm">
                            {strat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Label className="text-muted-foreground font-semibold">Recomendaciones:</Label>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {plan.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label className="text-muted-foreground">Fecha de Revisión:</Label>
                        <p className="font-medium">{plan.reviewDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {studentPlans.length === 0 && (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">No hay planes de apoyo creados</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

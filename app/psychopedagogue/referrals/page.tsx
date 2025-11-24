"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, FileText, Calendar, AlertCircle, Search, CheckCircle } from "lucide-react"
import { dataStore, type PsychopedagogyReferral } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const navigation = [
  { name: "Inicio", href: "/psychopedagogue", icon: BookOpen },
  { name: "Derivaciones", href: "/psychopedagogue/referrals", icon: AlertCircle },
  { name: "Mis Estudiantes", href: "/psychopedagogue/students", icon: Users },
  { name: "Citas", href: "/psychopedagogue/sessions", icon: Calendar },
  { name: "Planes de Apoyo", href: "/psychopedagogue/plans", icon: FileText },
]

export default function PsychopedagogueReferrals() {
  const [referrals, setReferrals] = useState<PsychopedagogyReferral[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = () => {
    setReferrals(dataStore.getPsychopedagogyReferrals())
  }

  const handleAcceptReferral = (id: string) => {
    dataStore.updatePsychopedagogyReferral(id, {
      status: "accepted",
      assignedPsychopedagogue: "psicopedagogo@sistema.edu",
    })
    loadReferrals()
  }

  const filteredReferrals = referrals.filter((ref) => {
    const student = dataStore.getStudents().find((s) => s.studentId === ref.studentId)
    return (
      student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.reason.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const pendingReferrals = filteredReferrals.filter((r) => r.status === "pending")
  const acceptedReferrals = filteredReferrals.filter((r) => r.status === "accepted" || r.status === "in_evaluation")

  return (
    <DashboardLayout navigation={navigation} userRole="Psicopedagogo">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Derivaciones</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las derivaciones de estudiantes para evaluación psicopedagógica
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, ID o motivo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pendientes ({pendingReferrals.length})</TabsTrigger>
            <TabsTrigger value="accepted">Aceptadas ({acceptedReferrals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingReferrals.map((referral) => {
              const student = dataStore.getStudents().find((s) => s.studentId === referral.studentId)
              return (
                <Card key={referral.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{student?.name || "Estudiante"}</CardTitle>
                        <CardDescription>
                          ID: {student?.studentId} | {student?.program}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          referral.urgency === "high"
                            ? "destructive"
                            : referral.urgency === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {referral.urgency === "high" ? "Alta" : referral.urgency === "medium" ? "Media" : "Baja"}{" "}
                        Prioridad
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Derivado por</p>
                        <p className="text-sm text-muted-foreground">
                          {referral.referredBy} ({referral.referrerRole === "psychologist" ? "Psicología" : "Tutoría"})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Fecha</p>
                        <p className="text-sm text-muted-foreground">{referral.date}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Motivo de derivación</p>
                      <p className="text-sm text-muted-foreground">{referral.reason}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Preocupaciones identificadas</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {referral.concerns.map((concern, index) => (
                          <Badge key={index} variant="outline">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Impacto académico</p>
                      <p className="text-sm text-muted-foreground">{referral.academicImpact}</p>
                    </div>

                    {referral.previousInterventions && (
                      <div>
                        <p className="text-sm font-medium mb-1">Intervenciones previas</p>
                        <p className="text-sm text-muted-foreground">{referral.previousInterventions}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => handleAcceptReferral(referral.id)} className="flex-1">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aceptar Derivación
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {pendingReferrals.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No hay derivaciones pendientes</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedReferrals.map((referral) => {
              const student = dataStore.getStudents().find((s) => s.studentId === referral.studentId)
              return (
                <Card key={referral.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{student?.name || "Estudiante"}</CardTitle>
                        <CardDescription>
                          ID: {student?.studentId} | {student?.program}
                        </CardDescription>
                      </div>
                      <Badge>{referral.status === "accepted" ? "Aceptada" : "En Evaluación"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Derivado por</p>
                        <p className="text-sm text-muted-foreground">
                          {referral.referredBy} ({referral.referrerRole === "psychologist" ? "Psicología" : "Tutoría"})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Fecha de aceptación</p>
                        <p className="text-sm text-muted-foreground">{referral.date}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Motivo</p>
                      <p className="text-sm text-muted-foreground">{referral.reason}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1 bg-transparent" asChild>
                        <a href={`/psychopedagogue/students/${student?.id}`}>Ver Perfil Completo</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {acceptedReferrals.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No hay derivaciones aceptadas</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

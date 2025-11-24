"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, FileText, Calendar, AlertCircle } from "lucide-react"
import { dataStore } from "@/lib/store"
import Link from "next/link"

const navigation = [
  { name: "Inicio", href: "/psychopedagogue", icon: BookOpen },
  { name: "Derivaciones", href: "/psychopedagogue/referrals", icon: AlertCircle },
  { name: "Mis Estudiantes", href: "/psychopedagogue/students", icon: Users },
  { name: "Citas", href: "/psychopedagogue/sessions", icon: Calendar },
  { name: "Planes de Apoyo", href: "/psychopedagogue/plans", icon: FileText },
]

export default function PsychopedagogueDashboard() {
  const [referrals, setReferrals] = useState(dataStore.getPsychopedagogyReferrals())
  const [sessions, setSessions] = useState(dataStore.getPsychopedagogySessions())
  const [plans, setPlans] = useState(dataStore.getSupportPlans())

  useEffect(() => {
    setReferrals(dataStore.getPsychopedagogyReferrals())
    setSessions(dataStore.getPsychopedagogySessions())
    setPlans(dataStore.getSupportPlans())
  }, [])

  const pendingReferrals = referrals.filter((r) => r.status === "pending").length
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled").length
  const activePlans = plans.filter((p) => p.status === "active").length
  const totalStudents = new Set(sessions.map((s) => s.studentId)).size

  return (
    <DashboardLayout navigation={navigation} userRole="Psicopedagogo">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Panel de Psicopedagogía</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona evaluaciones, planes de apoyo y acompañamiento académico
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Derivaciones Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReferrals}</div>
              <p className="text-xs text-muted-foreground mt-1">Requieren evaluación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">En seguimiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePlans}</div>
              <p className="text-xs text-muted-foreground mt-1">En implementación</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Derivaciones Recientes</CardTitle>
              <CardDescription>Estudiantes referidos para evaluación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.slice(0, 5).map((referral) => {
                  const student = dataStore.getStudents().find((s) => s.studentId === referral.studentId)
                  return (
                    <div key={referral.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{student?.name || "Estudiante"}</p>
                        <p className="text-xs text-muted-foreground">{referral.reason}</p>
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
                        {referral.urgency === "high" ? "Alta" : referral.urgency === "medium" ? "Media" : "Baja"}
                      </Badge>
                    </div>
                  )
                })}
                {referrals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay derivaciones pendientes</p>
                )}
              </div>
              <Link href="/psychopedagogue/referrals">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Ver todas las derivaciones
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Citas</CardTitle>
              <CardDescription>Evaluaciones y seguimientos programados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions
                  .filter((s) => s.status === "scheduled")
                  .slice(0, 5)
                  .map((session) => {
                    const student = dataStore.getStudents().find((s) => s.studentId === session.studentId)
                    return (
                      <div key={session.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{student?.name || "Estudiante"}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.date} - {session.time}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {session.type === "evaluation"
                            ? "Evaluación"
                            : session.type === "follow-up"
                              ? "Seguimiento"
                              : "Intervención"}
                        </Badge>
                      </div>
                    )
                  })}
                {sessions.filter((s) => s.status === "scheduled").length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay citas programadas</p>
                )}
              </div>
              <Link href="/psychopedagogue/sessions">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Ver todas las citas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

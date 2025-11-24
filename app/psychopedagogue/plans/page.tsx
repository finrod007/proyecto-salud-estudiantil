"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { BookOpen, Users, Calendar, FileText, Eye } from "lucide-react"
import { dataStore } from "@/lib/store"
import Link from "next/link"

const navigation = [
  { name: "Inicio", href: "/psychopedagogue", icon: BookOpen },
  { name: "Derivaciones", href: "/psychopedagogue/referrals", icon: Users },
  { name: "Mis Estudiantes", href: "/psychopedagogue/students", icon: Users },
  { name: "Citas", href: "/psychopedagogue/sessions", icon: Calendar },
  { name: "Planes de Apoyo", href: "/psychopedagogue/plans", icon: FileText },
]

export default function PsychopedagoguePlans() {
  const [plans, setPlans] = useState(dataStore.getSupportPlans())

  useEffect(() => {
    setPlans(dataStore.getSupportPlans())
  }, [])

  const students = dataStore.getStudents()

  const getStudentName = (studentId: string) => {
    return students.find((s) => s.studentId === studentId)?.name || "Estudiante"
  }

  const getStudentById = (studentId: string) => {
    return students.find((s) => s.studentId === studentId)
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

  const activePlans = plans.filter((p) => p.status === "active")
  const completedPlans = plans.filter((p) => p.status === "completed")

  return (
    <DashboardLayout navigation={navigation} userRole="Psicopedagogo">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Planes de Apoyo</h1>
          <p className="text-muted-foreground mt-2">Planes académico-cognitivos de tus estudiantes</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Planes Activos</CardTitle>
              <CardDescription>{activePlans.length} planes en implementación</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Planes Completados</CardTitle>
              <CardDescription>{completedPlans.length} planes finalizados</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Planes Activos</h2>
          <div className="space-y-4">
            {activePlans.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">No hay planes activos</p>
                </CardContent>
              </Card>
            ) : (
              activePlans.map((plan) => {
                const student = getStudentById(plan.studentId)
                return (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{getStudentName(plan.studentId)}</CardTitle>
                          <CardDescription>
                            Creado: {plan.createdDate} | Revisión: {plan.reviewDate}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Activo</Badge>
                          {student && (
                            <Link href={`/psychopedagogue/students/${student.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Ver Detalle
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Dificultades Identificadas:</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {plan.difficulties.map((diff, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Badge>{areaLabels[diff.area]}</Badge>
                              <Badge variant="outline">{levelLabels[diff.level]}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Objetivo General:</Label>
                        <p className="text-sm mt-1">{plan.generalObjectives}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Objetivos Específicos:</Label>
                        <ul className="mt-1 list-disc list-inside space-y-1">
                          {plan.specificObjectives.slice(0, 3).map((obj, index) => (
                            <li key={index} className="text-sm">
                              {obj}
                            </li>
                          ))}
                          {plan.specificObjectives.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              Y {plan.specificObjectives.length - 3} más...
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Planes Completados</h2>
          <div className="space-y-4">
            {completedPlans.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">No hay planes completados</p>
                </CardContent>
              </Card>
            ) : (
              completedPlans.map((plan) => {
                const student = getStudentById(plan.studentId)
                return (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{getStudentName(plan.studentId)}</CardTitle>
                          <CardDescription>
                            Creado: {plan.createdDate} | Completado: {plan.reviewDate}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Completado</Badge>
                          {student && (
                            <Link href={`/psychopedagogue/students/${student.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Ver Detalle
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-muted-foreground">Dificultades Trabajadas:</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {plan.difficulties.map((diff, index) => (
                            <Badge key={index} variant="outline">
                              {areaLabels[diff.area]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

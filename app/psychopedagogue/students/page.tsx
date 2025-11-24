"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Users, Calendar, Search, Eye, FileText } from "lucide-react"
import { dataStore } from "@/lib/store"
import Link from "next/link"

const navigation = [
  { name: "Inicio", href: "/psychopedagogue", icon: BookOpen },
  { name: "Derivaciones", href: "/psychopedagogue/referrals", icon: Users },
  { name: "Mis Estudiantes", href: "/psychopedagogue/students", icon: Users },
  { name: "Citas", href: "/psychopedagogue/sessions", icon: Calendar },
  { name: "Planes de Apoyo", href: "/psychopedagogue/plans", icon: FileText },
]

export default function PsychopedagogueStudents() {
  const [students] = useState(dataStore.getStudents())
  const [searchTerm, setSearchTerm] = useState("")
  const [sessions, setSessions] = useState(dataStore.getPsychopedagogySessions())
  const [plans, setPlans] = useState(dataStore.getSupportPlans())

  useEffect(() => {
    setSessions(dataStore.getPsychopedagogySessions())
    setPlans(dataStore.getSupportPlans())
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStudentSessions = (studentId: string) => {
    return sessions.filter((s) => s.studentId === studentId).length
  }

  const getStudentPlan = (studentId: string) => {
    return plans.find((p) => p.studentId === studentId && p.status === "active")
  }

  return (
    <DashboardLayout navigation={navigation} userRole="Psicopedagogo">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mis Estudiantes</h1>
            <p className="text-muted-foreground mt-2">Estudiantes en acompañamiento psicopedagógico</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, ID o programa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => {
            const sessionCount = getStudentSessions(student.studentId)
            const activePlan = getStudentPlan(student.studentId)

            return (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {student.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription>{student.studentId}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Programa:</span>
                      <span className="font-medium text-right">{student.program}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Semestre:</span>
                      <span className="font-medium">{student.semester}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Citas realizadas:</span>
                      <span className="font-medium">{sessionCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Plan activo:</span>
                      {activePlan ? <Badge variant="default">Sí</Badge> : <Badge variant="secondary">No</Badge>}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/psychopedagogue/students/${student.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Perfil
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No se encontraron estudiantes</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

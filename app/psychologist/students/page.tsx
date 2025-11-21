"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Mail,
} from "lucide-react"

const navigation = [
  { name: "Panel General", href: "/psychologist", icon: LayoutDashboard },
  { name: "Mis Estudiantes", href: "/psychologist/students", icon: Users },
  { name: "Sesiones", href: "/psychologist/sessions", icon: Calendar },
  { name: "Mensajes", href: "/psychologist/messages", icon: MessageSquare },
]

const students = [
  {
    id: 1,
    name: "Ana Martínez",
    studentId: "EST-1234",
    program: "Ingeniería de Sistemas",
    semester: "5to Semestre",
    risk: "high",
    currentMood: 2,
    moodTrend: "down",
    lastSession: "2024-01-15",
    nextSession: "2024-01-22",
    sessionsCount: 8,
    avatar: "AM",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    studentId: "EST-5678",
    program: "Administración de Empresas",
    semester: "3er Semestre",
    risk: "medium",
    currentMood: 3,
    moodTrend: "stable",
    lastSession: "2024-01-10",
    nextSession: "2024-01-24",
    sessionsCount: 5,
    avatar: "CR",
  },
  {
    id: 3,
    name: "Laura Gómez",
    studentId: "EST-9012",
    program: "Psicología",
    semester: "7mo Semestre",
    risk: "high",
    currentMood: 2,
    moodTrend: "down",
    lastSession: "2024-01-16",
    nextSession: "2024-01-20",
    sessionsCount: 12,
    avatar: "LG",
  },
  {
    id: 4,
    name: "Pedro Sánchez",
    studentId: "EST-3456",
    program: "Medicina",
    semester: "4to Semestre",
    risk: "low",
    currentMood: 4,
    moodTrend: "up",
    lastSession: "2024-01-12",
    nextSession: "2024-01-19",
    sessionsCount: 6,
    avatar: "PS",
  },
  {
    id: 5,
    name: "María López",
    studentId: "EST-7890",
    program: "Derecho",
    semester: "2do Semestre",
    risk: "medium",
    currentMood: 3,
    moodTrend: "stable",
    lastSession: "2024-01-14",
    nextSession: "2024-01-21",
    sessionsCount: 3,
    avatar: "ML",
  },
  {
    id: 6,
    name: "José Torres",
    studentId: "EST-2468",
    program: "Arquitectura",
    semester: "6to Semestre",
    risk: "low",
    currentMood: 4,
    moodTrend: "up",
    lastSession: "2024-01-11",
    nextSession: "2024-01-25",
    sessionsCount: 9,
    avatar: "JT",
  },
  {
    id: 7,
    name: "Sofía Ramírez",
    studentId: "EST-1357",
    program: "Diseño Gráfico",
    semester: "4to Semestre",
    risk: "low",
    currentMood: 5,
    moodTrend: "up",
    lastSession: "2024-01-13",
    nextSession: "2024-01-27",
    sessionsCount: 7,
    avatar: "SR",
  },
  {
    id: 8,
    name: "Diego Fernández",
    studentId: "EST-9753",
    program: "Contaduría",
    semester: "5to Semestre",
    risk: "medium",
    currentMood: 3,
    moodTrend: "down",
    lastSession: "2024-01-09",
    nextSession: "2024-01-23",
    sessionsCount: 4,
    avatar: "DF",
  },
]

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "high":
      return "destructive"
    case "medium":
      return "warning"
    case "low":
      return "success"
    default:
      return "outline"
  }
}

const getRiskLabel = (risk: string) => {
  switch (risk) {
    case "high":
      return "Alto Riesgo"
    case "medium":
      return "Riesgo Medio"
    case "low":
      return "Bajo Riesgo"
    default:
      return "Sin Evaluar"
  }
}

const getMoodEmoji = (mood: number) => {
  const emojis = ["😢", "😟", "😐", "🙂", "😊"]
  return emojis[mood - 1] || "❓"
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-success" />
    case "down":
      return <TrendingDown className="h-4 w-4 text-destructive" />
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

export default function MyStudentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRisk, setFilterRisk] = useState<string>("all")

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.program.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRisk = filterRisk === "all" || student.risk === filterRisk

    return matchesSearch && matchesRisk
  })

  const handleViewStudent = (studentId: number) => {
    router.push(`/psychologist/students/${studentId}`)
  }

  return (
    <DashboardLayout navigation={navigation} userRole="psychologist">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mis Estudiantes</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestiona y da seguimiento a todos tus estudiantes asignados
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-sm text-muted-foreground">Total Estudiantes</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 border-l-4 border-l-destructive">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{students.filter((s) => s.risk === "high").length}</div>
              <p className="text-sm text-muted-foreground">Alto Riesgo</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 border-l-4 border-l-warning">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{students.filter((s) => s.risk === "medium").length}</div>
              <p className="text-sm text-muted-foreground">Riesgo Medio</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 border-l-4 border-l-success">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{students.filter((s) => s.risk === "low").length}</div>
              <p className="text-sm text-muted-foreground">Bajo Riesgo</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, ID o programa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterRisk === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={filterRisk === "high" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk("high")}
                >
                  Alto Riesgo
                </Button>
                <Button
                  variant={filterRisk === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk("medium")}
                  className={filterRisk === "medium" ? "bg-warning hover:bg-warning/90" : ""}
                >
                  Medio
                </Button>
                <Button
                  variant={filterRisk === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk("low")}
                  className={filterRisk === "low" ? "bg-success hover:bg-success/90" : ""}
                >
                  Bajo Riesgo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {student.avatar}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>{student.studentId}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={getRiskColor(student.risk) as any} className="text-xs">
                    {getRiskLabel(student.risk)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Programa</p>
                    <p className="font-medium text-balance">{student.program}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Semestre</p>
                    <p className="font-medium">{student.semester}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getMoodEmoji(student.currentMood)}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estado Actual</p>
                      <p className="font-medium text-sm">
                        {student.currentMood === 5
                          ? "Excelente"
                          : student.currentMood === 4
                            ? "Bien"
                            : student.currentMood === 3
                              ? "Neutral"
                              : student.currentMood === 2
                                ? "Bajo"
                                : "Muy Bajo"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Tendencia:</span>
                    {getTrendIcon(student.moodTrend)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div>
                    <p className="text-muted-foreground text-xs">Última Sesión</p>
                    <p className="font-medium">
                      {new Date(student.lastSession).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Sesiones Totales</p>
                    <p className="font-medium">{student.sessionsCount}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button onClick={() => handleViewStudent(student.id)} className="flex-1 gap-2 sm:w-auto" size="sm">
                    <Eye className="h-4 w-4" />
                    Ver Ficha
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 sm:w-auto bg-transparent">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron estudiantes</h3>
              <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

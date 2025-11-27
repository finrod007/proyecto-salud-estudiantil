"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Heart,
  CheckCircle2,
  MessageSquare,
  LayoutDashboard,
  FileText,
  Clock,
  Plus,
  AlertCircle,
  X,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const navigation = [
  { name: "Mi Panel", href: "/student", icon: LayoutDashboard },
  { name: "Mi Estado Emocional", href: "/student/mood", icon: Heart },
  { name: "Mis Tareas", href: "/student/tasks", icon: CheckCircle2 },
  { name: "Mensajes", href: "/student/messages", icon: MessageSquare },
]

const moodData = [
  { date: "10 Ene", mood: 4 },
  { date: "12 Ene", mood: 4 },
  { date: "15 Ene", mood: 3 },
  { date: "17 Ene", mood: 2 },
  { date: "20 Ene", mood: 2 },
  { date: "22 Ene", mood: 3 },
  { date: "25 Ene", mood: 3 },
]

const upcomingAppointments = [
  {
    type: "Sesión Psicológica",
    with: "Dra. María González",
    date: "Mañana",
    time: "2:00 PM",
    location: "Consultorio 3",
  },
  {
    type: "Tutoría Académica",
    with: "Prof. Juan Pérez",
    date: "Viernes",
    time: "10:00 AM",
    location: "Sala de Tutorías 2",
  },
]

const pendingTasks = [
  {
    task: "Practicar técnicas de respiración",
    assignedBy: "Dra. María González",
    dueDate: "Diario",
    status: "completed",
  },
  {
    task: "Organizar horario de estudio semanal",
    assignedBy: "Dra. María González",
    dueDate: "Esta semana",
    status: "pending",
  },
  {
    task: "Revisar material de matemáticas",
    assignedBy: "Prof. Juan Pérez",
    dueDate: "Viernes",
    status: "pending",
  },
]

const getMoodEmoji = (mood: number) => {
  const emojis = ["😢", "😟", "😐", "😊", "😄"]
  return emojis[mood - 1] || "😐"
}

const currentMood = 3

export default function StudentDashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showSupportAlert, setShowSupportAlert] = useState(true)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem("userRole")
    if (role !== "student") {
      router.push("/login")
    }
  }, [router])

  if (!mounted) return null

  return (
    <DashboardLayout navigation={navigation} userRole="student">
      <div className="space-y-6 lg:space-y-8">
        {showSupportAlert && (
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
            <CardContent className="pt-4 pb-4 relative">
              <button
                onClick={() => setShowSupportAlert(false)}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Cerrar alerta"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-6">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
                  <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-primary animate-pulse" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">
                      Detectamos que podrías necesitar apoyo. Tu tutor está disponible. Puedes agendar ahora.
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-primary tracking-tight">No estás solo.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      className="gap-2 w-full sm:w-auto shadow-md"
                      onClick={() => router.push("/student/messages")}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Contactar Ahora
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 w-full sm:w-auto bg-transparent"
                      onClick={() => router.push("/student/mood")}
                    >
                      <Heart className="h-4 w-4" />
                      Registrar Cómo me Siento
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hola, Ana</h1>
            <p className="text-muted-foreground mt-1">¿Cómo te sientes hoy?</p>
          </div>
          <Button className="gap-2 w-full sm:w-auto" onClick={() => router.push("/student/mood")}>
            <Plus className="h-4 w-4" />
            Registrar Mi Estado
          </Button>
        </div>

        {/* Current Mood Card */}
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-muted-foreground">Mi Estado Actual</h3>
                <div className="flex items-center gap-4">
                  <span className="text-5xl sm:text-6xl">{getMoodEmoji(currentMood)}</span>
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold">{currentMood}/5</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Última actualización: Hoy</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
                onClick={() => router.push("/student/mood")}
              >
                Ver Historial
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mood Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Mi Evolución Emocional</CardTitle>
              <CardDescription>Últimos 15 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] sm:h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[0, 5]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Próximas Citas</CardTitle>
              <CardDescription>Tus sesiones programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg bg-muted/30"
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{appointment.type}</h4>
                      <p className="text-sm text-muted-foreground">Con {appointment.with}</p>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {appointment.date} • {appointment.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{appointment.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mis Tareas y Compromisos</CardTitle>
                <CardDescription>Acuerdos de tus sesiones</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/student/tasks")}>
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.status === "completed"}
                    className="mt-1 h-5 w-5 cursor-pointer"
                    readOnly
                  />
                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item.task}
                    </p>
                    <p className="text-xs text-muted-foreground">Asignado por: {item.assignedBy}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.status === "completed" ? "success" : "warning"}>
                      {item.status === "completed" ? "Completada" : item.dueDate}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Resources */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Centro de Ayuda</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Recursos de bienestar emocional y apoyo</p>
              <Button variant="outline" className="w-full bg-transparent">
                Explorar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-secondary mb-2" />
              <CardTitle className="text-lg">Contactar Apoyo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Comunícate con tu psicólogo o tutor</p>
              <Button variant="outline" className="w-full bg-transparent">
                Enviar Mensaje
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <FileText className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-lg">Mis Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Certificados y documentación personal</p>
              <Button variant="outline" className="w-full bg-transparent">
                Ver Archivos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

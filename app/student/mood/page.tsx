'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar, Heart, CheckCircle2, MessageSquare, LayoutDashboard, Save, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dataStore } from '@/lib/store'

const navigation = [
  { name: 'Mi Panel', href: '/student', icon: LayoutDashboard },
  { name: 'Mi Estado Emocional', href: '/student/mood', icon: Heart },
  { name: 'Mis Tareas', href: '/student/tasks', icon: CheckCircle2 },
  { name: 'Mensajes', href: '/student/messages', icon: MessageSquare },
]

const getMoodEmoji = (mood: number) => {
  const emojis = ['😢', '😟', '😐', '😊', '😄']
  return emojis[mood - 1] || '😐'
}

const getMoodLabel = (mood: number) => {
  const labels = ['Muy Mal', 'Mal', 'Regular', 'Bien', 'Muy Bien']
  return labels[mood - 1] || 'Regular'
}

export default function StudentMoodPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [moodHistory, setMoodHistory] = useState<any[]>([])
  const [moodData, setMoodData] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'student') {
      router.push('/login')
    }
    loadMoodData()
  }, [router])

  const loadMoodData = () => {
    const entries = dataStore.getMoodEntries('EST-1234')
    const history = entries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }),
        mood: entry.mood,
        comment: entry.comment,
      }))
    
    const chartData = entries
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-7)
      .map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short' 
        }),
        mood: entry.mood,
        label: new Date(entry.timestamp).toLocaleDateString('es-ES', { 
          month: 'short',
          day: 'numeric'
        }),
      }))

    setMoodHistory(history)
    setMoodData(chartData)
  }

  const handleSave = async () => {
    if (!selectedMood) return
    
    setSaving(true)
    
    dataStore.addMoodEntry({
      studentId: 'EST-1234',
      mood: selectedMood,
      comment: comment,
      date: new Date().toISOString(),
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaving(false)
    
    setSelectedMood(null)
    setComment('')
    
    loadMoodData()
    
    alert('Estado registrado exitosamente')
  }

  if (!mounted) return null

  return (
    <DashboardLayout navigation={navigation} userRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Estado Emocional</h1>
          <p className="text-muted-foreground mt-1">
            Registra cómo te sientes hoy y revisa tu evolución
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>¿Cómo te sientes hoy?</CardTitle>
            <CardDescription>
              Selecciona tu estado de ánimo y comparte tus pensamientos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Selecciona tu estado de ánimo</Label>
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`p-6 border-2 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105 ${
                      selectedMood === mood
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-5xl">{getMoodEmoji(mood)}</span>
                    <span className="text-sm font-medium">{getMoodLabel(mood)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="comment">¿Quieres compartir algo más? (Opcional)</Label>
              <Textarea
                id="comment"
                placeholder="Escribe aquí cómo te sientes, qué situaciones te afectan, o cualquier cosa que quieras compartir..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!selectedMood || saving}
              className="w-full gap-2"
            >
              {saving ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Registrar Estado
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mi Evolución</CardTitle>
                <CardDescription>
                  Gráfico de tu estado emocional en los últimos días
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">Últimos registros</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {moodData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>Registra tu primer estado de ánimo para ver tu evolución</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Historial de Registros</CardTitle>
            <CardDescription>
              Tus últimos registros emocionales y comentarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moodHistory.length > 0 ? (
              <div className="space-y-4">
                {moodHistory.map((entry, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <p className="font-semibold">{getMoodLabel(entry.mood)}</p>
                          <p className="text-sm text-muted-foreground">{entry.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{entry.mood}/5</Badge>
                    </div>
                    {entry.comment && (
                      <p className="text-sm text-foreground pl-12">{entry.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <p>Aún no has registrado ningún estado de ánimo</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

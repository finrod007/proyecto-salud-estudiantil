'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, LayoutDashboard, Calendar, MessageSquare, Send, Paperclip } from 'lucide-react'
import { dataStore } from '@/lib/store'

const navigation = [
  { name: 'Panel General', href: '/tutor', icon: LayoutDashboard },
  { name: 'Mis Estudiantes', href: '/tutor/students', icon: Users },
  { name: 'Tutorías', href: '/tutor/sessions', icon: Calendar },
  { name: 'Mensajes', href: '/tutor/messages', icon: MessageSquare },
]

const students = [
  { id: 'EST-1234', name: 'Ana Martínez', avatar: 'AM' },
  { id: 'EST-5678', name: 'Carlos Rodríguez', avatar: 'CR' },
  { id: 'EST-9012', name: 'Laura Gómez', avatar: 'LG' },
  { id: 'EST-3456', name: 'Pedro Sánchez', avatar: 'PS' },
  { id: 'EST-7890', name: 'María López', avatar: 'ML' },
]

export default function TutorMessagesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(students[0])
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'tutor') {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (mounted) {
      loadMessages()
    }
  }, [mounted, selectedStudent])

  const loadMessages = () => {
    const tutorMessages = dataStore.getMessages('TUT-001')
    const conversationMessages = tutorMessages.filter(
      m => m.from === selectedStudent.id || m.to === selectedStudent.id
    )
    setMessages(conversationMessages)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    dataStore.addMessage({
      from: 'TUT-001',
      to: selectedStudent.id,
      content: newMessage,
      read: false,
    })
    
    setNewMessage('')
    loadMessages()
  }

  if (!mounted) return null

  return (
    <DashboardLayout navigation={navigation} userRole="tutor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
          <p className="text-muted-foreground mt-1">
            Comunícate con tus estudiantes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          <Card className="border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle>Estudiantes</CardTitle>
              <CardDescription>Selecciona un estudiante para chatear</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {students.map((student) => {
                    const studentMessages = dataStore.getMessages('TUT-001').filter(
                      m => m.from === student.id || m.to === student.id
                    )
                    const unreadCount = studentMessages.filter(m => m.from === student.id && !m.read).length
                    
                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                          selectedStudent.id === student.id ? 'bg-muted' : ''
                        }`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{student.name}</h4>
                            {unreadCount > 0 && (
                              <span className="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{student.id}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-border/50 lg:col-span-2 flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedStudent.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedStudent.name}</CardTitle>
                  <CardDescription>{selectedStudent.id}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const isOwn = message.from === 'TUT-001'
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] space-y-1 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          } rounded-lg p-3`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs ${isOwn ? 'opacity-70' : 'text-muted-foreground'}`}>
                            {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No hay mensajes aún. Comienza una conversación</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <CardContent className="border-t border-border p-4">
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar, Heart, CheckCircle2, MessageSquare, LayoutDashboard, Send, Paperclip } from 'lucide-react'
import { dataStore } from '@/lib/store'

const navigation = [
  { name: 'Mi Panel', href: '/student', icon: LayoutDashboard },
  { name: 'Mi Estado Emocional', href: '/student/mood', icon: Heart },
  { name: 'Mis Tareas', href: '/student/tasks', icon: CheckCircle2 },
  { name: 'Mensajes', href: '/student/messages', icon: MessageSquare },
]

const conversations = [
  {
    id: 'psychologist-1',
    name: 'Dra. María González',
    role: 'Psicóloga',
    userId: 'PSY-001',
    avatar: 'MG',
  },
  {
    id: 'tutor-1',
    name: 'Prof. Juan Pérez',
    role: 'Tutor',
    userId: 'TUT-001',
    avatar: 'JP',
  },
]

export default function StudentMessagesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    if (role !== 'student') {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (mounted) {
      loadMessages()
    }
  }, [mounted, selectedConversation])

  const loadMessages = () => {
    const userMessages = dataStore.getMessages('EST-1234')
    const conversationMessages = userMessages.filter(
      m => m.from === selectedConversation.userId || m.to === selectedConversation.userId
    )
    setMessages(conversationMessages)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    dataStore.addMessage({
      from: 'EST-1234',
      to: selectedConversation.userId,
      content: newMessage,
      read: false,
    })
    
    setNewMessage('')
    loadMessages()
  }

  if (!mounted) return null

  return (
    <DashboardLayout navigation={navigation} userRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
          <p className="text-muted-foreground mt-1">
            Comunícate con tu psicólogo y tutor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          <Card className="border-border/50 lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversaciones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                      selectedConversation.id === conversation.id ? 'bg-muted' : ''
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {conversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-sm">{conversation.name}</h4>
                      <p className="text-xs text-muted-foreground">{conversation.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 lg:col-span-2 flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedConversation.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                  <CardDescription>{selectedConversation.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const isOwn = message.from === 'EST-1234'
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

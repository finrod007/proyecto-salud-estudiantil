export interface MoodEntry {
  id: string
  studentId: string
  mood: number
  comment: string
  date: string
  timestamp: number
}

export interface Session {
  id: string
  studentId: string
  psychologistId: string
  type: string
  date: string
  time: string
  duration: string
  location: string
  notes: string
  status: "pending" | "completed" | "cancelled"
  createdAt: number
  sessionNotes?: string
  agreements?: string[]
  studentMood?: number
  observations?: string
}

export interface Student {
  id: number
  name: string
  studentId: string
  program: string
  semester: string
  risk: "high" | "medium" | "low"
  currentMood: number
  moodTrend: "up" | "down" | "stable"
  lastSession: string
  nextSession: string
  sessionsCount: number
  avatar: string
  email: string
}

export interface Message {
  id: string
  from: string
  to: string
  content: string
  timestamp: number
  read: boolean
}

export interface Task {
  id: string
  studentId: string
  task: string
  assignedBy: string
  assignedDate: string
  dueDate: string
  status: "pending" | "completed"
  createdAt: number
  sessionId?: string
  feedback?: string
  feedbackDate?: string
  completedDate?: string
  studentComment?: string
  studentCommentDate?: string
}

export interface Tutoring {
  id: string
  studentId: string
  tutorId: string
  topic: string
  type: "academic" | "personal" | "career" | "study_skills"
  date: string
  time: string
  duration: string
  location: string
  notes: string
  attendance: "present" | "absent" | "justified"
  status: "scheduled" | "completed" | "cancelled"
  createdAt: number
}

export interface PsychologyReferral {
  id: string
  studentId: string
  referredBy: string
  reason: string
  urgency: "high" | "medium" | "low"
  symptoms: string[]
  previousSupport: string
  academicImpact: string
  date: string
  status: "pending" | "accepted" | "in_progress" | "completed"
  assignedPsychologist?: string
  createdAt: number
}

export interface LearningDifficulty {
  area: "reading" | "memory" | "organization" | "attention" | "study"
  level: "low" | "medium" | "high"
  description: string
  observations: string
}

export interface PsychopedagogySession {
  id: string
  studentId: string
  psychopedagogueId: string
  date: string
  time: string
  duration: string
  type: "evaluation" | "follow-up" | "intervention"
  objectives: string
  activities: string
  observations: string
  progress: string
  nextSteps: string
  status: "scheduled" | "completed" | "cancelled"
  createdAt: number
}

export interface SupportPlan {
  id: string
  studentId: string
  psychopedagogueId: string
  createdDate: string
  difficulties: LearningDifficulty[]
  generalObjectives: string
  specificObjectives: string[]
  strategies: string[]
  recommendations: string[]
  evaluationCriteria: string
  reviewDate: string
  status: "active" | "completed" | "suspended"
  createdAt: number
}

export interface PsychopedagogyReferral {
  id: string
  studentId: string
  referredBy: string
  referrerRole: "psychologist" | "tutor"
  reason: string
  concerns: string[]
  academicImpact: string
  previousInterventions: string
  urgency: "high" | "medium" | "low"
  date: string
  status: "pending" | "accepted" | "in_evaluation" | "completed"
  assignedPsychopedagogue?: string
  createdAt: number
}

class DataStore {
  private getKey(key: string): string {
    return `wellness_system_${key}`
  }

  getMoodEntries(studentId?: string): MoodEntry[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("mood_entries"))
    const entries: MoodEntry[] = data ? JSON.parse(data) : []
    return studentId ? entries.filter((e) => e.studentId === studentId) : entries
  }

  addMoodEntry(entry: Omit<MoodEntry, "id" | "timestamp">): MoodEntry {
    const entries = this.getMoodEntries()
    const newEntry: MoodEntry = {
      ...entry,
      id: `mood_${Date.now()}`,
      timestamp: Date.now(),
    }
    entries.push(newEntry)
    localStorage.setItem(this.getKey("mood_entries"), JSON.stringify(entries))
    return newEntry
  }

  getSessions(): Session[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("sessions"))
    return data ? JSON.parse(data) : []
  }

  addSession(session: Omit<Session, "id" | "createdAt">): Session {
    const sessions = this.getSessions()
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}`,
      createdAt: Date.now(),
    }
    sessions.push(newSession)
    localStorage.setItem(this.getKey("sessions"), JSON.stringify(sessions))
    return newSession
  }

  updateSession(id: string, updates: Partial<Session>): Session | null {
    const sessions = this.getSessions()
    const index = sessions.findIndex((s) => s.id === id)
    if (index === -1) return null

    sessions[index] = { ...sessions[index], ...updates }
    localStorage.setItem(this.getKey("sessions"), JSON.stringify(sessions))
    return sessions[index]
  }

  deleteSession(id: string): boolean {
    const sessions = this.getSessions()
    const filtered = sessions.filter((s) => s.id !== id)
    localStorage.setItem(this.getKey("sessions"), JSON.stringify(filtered))
    return filtered.length < sessions.length
  }

  getMessages(userId: string): Message[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("messages"))
    const messages: Message[] = data ? JSON.parse(data) : []
    return messages.filter((m) => m.from === userId || m.to === userId)
  }

  addMessage(message: Omit<Message, "id" | "timestamp">): Message {
    const messages = this.getMessages("all")
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: Date.now(),
    }
    const allMessages = [
      ...(localStorage.getItem(this.getKey("messages"))
        ? JSON.parse(localStorage.getItem(this.getKey("messages"))!)
        : []),
      newMessage,
    ]
    localStorage.setItem(this.getKey("messages"), JSON.stringify(allMessages))
    return newMessage
  }

  markMessageAsRead(id: string): void {
    const data = localStorage.getItem(this.getKey("messages"))
    if (!data) return
    const messages: Message[] = JSON.parse(data)
    const message = messages.find((m) => m.id === id)
    if (message) {
      message.read = true
      localStorage.setItem(this.getKey("messages"), JSON.stringify(messages))
    }
  }

  getTasks(studentId?: string): Task[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("tasks"))
    const tasks: Task[] = data ? JSON.parse(data) : []
    const filtered = studentId ? tasks.filter((t) => t.studentId === studentId) : tasks
    return filtered
  }

  addTask(task: Omit<Task, "id" | "createdAt">): Task {
    const tasks = this.getTasks()
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: Date.now(),
    }
    tasks.push(newTask)
    localStorage.setItem(this.getKey("tasks"), JSON.stringify(tasks))

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: this.getKey("tasks"),
        newValue: JSON.stringify(tasks),
      }),
    )

    return newTask
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) return null

    tasks[index] = { ...tasks[index], ...updates }
    localStorage.setItem(this.getKey("tasks"), JSON.stringify(tasks))

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: this.getKey("tasks"),
        newValue: JSON.stringify(tasks),
      }),
    )

    return tasks[index]
  }

  getStudents(): Student[] {
    return [
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
        email: "ana.martinez@university.edu",
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
        email: "carlos.rodriguez@university.edu",
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
        email: "laura.gomez@university.edu",
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
        email: "pedro.sanchez@university.edu",
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
        email: "maria.lopez@university.edu",
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
        email: "jose.torres@university.edu",
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
        email: "sofia.ramirez@university.edu",
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
        email: "diego.fernandez@university.edu",
      },
    ]
  }

  getTutoringSessions(): Tutoring[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("tutoring_sessions"))
    return data ? JSON.parse(data) : []
  }

  addTutoringSession(tutoring: Omit<Tutoring, "id" | "createdAt">): Tutoring {
    const sessions = this.getTutoringSessions()
    const newSession: Tutoring = {
      ...tutoring,
      id: `tutoring_${Date.now()}`,
      createdAt: Date.now(),
    }
    sessions.push(newSession)
    localStorage.setItem(this.getKey("tutoring_sessions"), JSON.stringify(sessions))
    return newSession
  }

  updateTutoringSession(id: string, updates: Partial<Tutoring>): Tutoring | null {
    const sessions = this.getTutoringSessions()
    const index = sessions.findIndex((s) => s.id === id)
    if (index === -1) return null

    sessions[index] = { ...sessions[index], ...updates }
    localStorage.setItem(this.getKey("tutoring_sessions"), JSON.stringify(sessions))
    return sessions[index]
  }

  getReferrals(): PsychologyReferral[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("referrals"))
    return data ? JSON.parse(data) : []
  }

  addReferral(referral: Omit<PsychologyReferral, "id" | "createdAt">): PsychologyReferral {
    const referrals = this.getReferrals()
    const newReferral: PsychologyReferral = {
      ...referral,
      id: `ref_${Date.now()}`,
      createdAt: Date.now(),
    }
    referrals.push(newReferral)
    localStorage.setItem(this.getKey("referrals"), JSON.stringify(referrals))
    return newReferral
  }

  updateReferral(id: string, updates: Partial<PsychologyReferral>): PsychologyReferral | null {
    const referrals = this.getReferrals()
    const index = referrals.findIndex((r) => r.id === id)
    if (index === -1) return null

    referrals[index] = { ...referrals[index], ...updates }
    localStorage.setItem(this.getKey("referrals"), JSON.stringify(referrals))
    return referrals[index]
  }

  getPsychopedagogyReferrals(): PsychopedagogyReferral[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("psychopedagogy_referrals"))
    return data ? JSON.parse(data) : []
  }

  addPsychopedagogyReferral(referral: Omit<PsychopedagogyReferral, "id" | "createdAt">): PsychopedagogyReferral {
    const referrals = this.getPsychopedagogyReferrals()
    const newReferral: PsychopedagogyReferral = {
      ...referral,
      id: `psych_ref_${Date.now()}`,
      createdAt: Date.now(),
    }
    referrals.push(newReferral)
    localStorage.setItem(this.getKey("psychopedagogy_referrals"), JSON.stringify(referrals))
    return newReferral
  }

  updatePsychopedagogyReferral(id: string, updates: Partial<PsychopedagogyReferral>): PsychopedagogyReferral | null {
    const referrals = this.getPsychopedagogyReferrals()
    const index = referrals.findIndex((r) => r.id === id)
    if (index === -1) return null

    referrals[index] = { ...referrals[index], ...updates }
    localStorage.setItem(this.getKey("psychopedagogy_referrals"), JSON.stringify(referrals))
    return referrals[index]
  }

  getPsychopedagogySessions(): PsychopedagogySession[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("psychopedagogy_sessions"))
    return data ? JSON.parse(data) : []
  }

  addPsychopedagogySession(session: Omit<PsychopedagogySession, "id" | "createdAt">): PsychopedagogySession {
    const sessions = this.getPsychopedagogySessions()
    const newSession: PsychopedagogySession = {
      ...session,
      id: `psych_session_${Date.now()}`,
      createdAt: Date.now(),
    }
    sessions.push(newSession)
    localStorage.setItem(this.getKey("psychopedagogy_sessions"), JSON.stringify(sessions))
    return newSession
  }

  updatePsychopedagogySession(id: string, updates: Partial<PsychopedagogySession>): PsychopedagogySession | null {
    const sessions = this.getPsychopedagogySessions()
    const index = sessions.findIndex((s) => s.id === id)
    if (index === -1) return null

    sessions[index] = { ...sessions[index], ...updates }
    localStorage.setItem(this.getKey("psychopedagogy_sessions"), JSON.stringify(sessions))
    return sessions[index]
  }

  getSupportPlans(): SupportPlan[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getKey("support_plans"))
    return data ? JSON.parse(data) : []
  }

  addSupportPlan(plan: Omit<SupportPlan, "id" | "createdAt">): SupportPlan {
    const plans = this.getSupportPlans()
    const newPlan: SupportPlan = {
      ...plan,
      id: `plan_${Date.now()}`,
      createdAt: Date.now(),
    }
    plans.push(newPlan)
    localStorage.setItem(this.getKey("support_plans"), JSON.stringify(plans))
    return newPlan
  }

  updateSupportPlan(id: string, updates: Partial<SupportPlan>): SupportPlan | null {
    const plans = this.getSupportPlans()
    const index = plans.findIndex((p) => p.id === id)
    if (index === -1) return null

    plans[index] = { ...plans[index], ...updates }
    localStorage.setItem(this.getKey("support_plans"), JSON.stringify(plans))
    return plans[index]
  }
}

export const dataStore = new DataStore()

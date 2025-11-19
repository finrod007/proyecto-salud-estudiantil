import { LoginForm } from '@/components/auth/login-form'
import { Brain } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-balance mb-2">Sistema de Bienestar Estudiantil</h1>
          <p className="text-muted-foreground text-pretty">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>
        <LoginForm />
        <div className="text-center mt-6">
          <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ¿Necesitas ayuda? Ver guía del sistema
          </Link>
        </div>
      </div>
    </div>
  )
}

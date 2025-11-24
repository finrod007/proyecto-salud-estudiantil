"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"

// Mock authentication - replace with real auth
const mockUsers = {
  "admin@sistema.edu": { password: "admin123", role: "admin" },
  "psicologo@sistema.edu": { password: "psi123", role: "psychologist" },
  "tutor@sistema.edu": { password: "tutor123", role: "tutor" },
  "estudiante@sistema.edu": { password: "est123", role: "student" },
  "psicopedagogo@sistema.edu": { password: "psico123", role: "psychopedagogue" },
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = mockUsers[email as keyof typeof mockUsers]

    if (user && user.password === password) {
      // Store role in localStorage for demo
      localStorage.setItem("userRole", user.role)
      localStorage.setItem("userEmail", email)

      // Redirect based on role
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "psychologist":
          router.push("/psychologist")
          break
        case "tutor":
          router.push("/tutor")
          break
        case "student":
          router.push("/student")
          break
        case "psychopedagogue":
          router.push("/psychopedagogue")
          break
      }
    } else {
      setError("Credenciales incorrectas. Por favor, intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tu correo electrónico y contraseña</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@sistema.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm text-muted-foreground hover:text-primary"
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <strong>Demo - Credenciales de prueba:</strong>
              <br />
              Admin: admin@sistema.edu / admin123
              <br />
              Apoyo Psicológico: psicologo@sistema.edu / psi123
              <br />
              Tutor: tutor@sistema.edu / tutor123
              <br />
              Estudiante: estudiante@sistema.edu / est123
              <br />
              Psicopedagogo: psicopedagogo@sistema.edu / psico123
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

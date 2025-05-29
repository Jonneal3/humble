"use client";

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted')
    setLoading(true)

    try {
      // Check Supabase connection using a simple health check
      const { data: healthCheck, error: healthError } = await supabase.auth.getSession()
      if (healthError) {
        console.error('Supabase connection error:', healthError)
        toast({
          title: "Connection Error",
          description: "Could not connect to the server. Please check your internet connection.",
          variant: "destructive",
        })
        return
      }

      console.log('Attempting login with:', { email })
      
      if (!email || !password) {
        console.error('Email or password is empty')
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login response:', { data, error })

      if (error) {
        console.error('Login error:', error)
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          })
        }
        return
      }

      if (data?.session) {
        console.log('Login successful, session:', data.session)
        // Force a hard refresh to ensure all auth state is updated
        window.location.href = '/designer-instances'
      } else {
        console.error('No session after successful login')
        toast({
          title: "Error",
          description: "Login successful but no session was created",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Unexpected error during login:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address first",
        variant: "destructive",
      })
      return
    }

    setIsResetting(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Reset Email Sent",
        description: "Check your email for the password reset link",
      })
    } catch (error) {
      console.error('Error sending reset email:', error)
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            console.log('Email changed:', e.target.value)
            setEmail(e.target.value)
          }}
          required
          disabled={loading || isResetting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            console.log('Password changed')
            setPassword(e.target.value)
          }}
          required
          disabled={loading || isResetting}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || isResetting}
          onClick={() => console.log('Button clicked')}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleResetPassword}
          disabled={loading || isResetting}
        >
          {isResetting ? "Sending reset email..." : "Forgot password?"}
        </Button>
      </div>
    </form>
  )
} 
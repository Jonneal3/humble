"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export default function Login() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/designer-instances')
      }
    }
    checkSession()
  }, [router, supabase])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Humble</h1>
        <LoginForm />
      </div>
    </main>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { isAdminEmail } from '@/lib/admin-auth'

type Mode = 'login' | 'forgot' | 'sent'

const NOT_AUTHORIZED_MESSAGE = 'This email is not approved for Travelholics admin access.'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/admin'

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(searchParams.get('unauthorized') ? NOT_AUTHORIZED_MESSAGE : '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createBrowserSupabase()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      if (!isAdminEmail(session.user.email)) {
        await supabase.auth.signOut()
        setError(NOT_AUTHORIZED_MESSAGE)
        return
      }
      router.replace('/admin')
    })
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createBrowserSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (!isAdminEmail(data.user?.email)) {
      await supabase.auth.signOut()
      setError(NOT_AUTHORIZED_MESSAGE)
      setLoading(false)
      return
    }
    router.replace(redirectTo)
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/update-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setMode('sent')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1812] px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Traveholic_logo_wordmark_white.png"
            alt="Travelholics"
            width={180}
            height={40}
            className="h-10 w-auto object-contain"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <span className="sr-only">Travelholics</span>
        </div>

        <div className="rounded-2xl bg-[#0f1f1b] border border-white/5 p-8">
          {mode === 'login' && (
            <>
              <h1 className="text-lg font-semibold text-white mb-6">Admin Sign In</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yotravelholic.com"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#10755A] py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
              <button
                onClick={() => { setMode('forgot'); setError('') }}
                className="mt-4 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Forgot password?
              </button>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h1 className="text-lg font-semibold text-white mb-2">Reset Password</h1>
              <p className="text-sm text-white/50 mb-6">
                Enter your email and we&apos;ll send a reset link and code.
              </p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yotravelholic.com"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#10755A] py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending…' : 'Send Reset Email'}
                </button>
              </form>
              <button
                onClick={() => { setMode('login'); setError('') }}
                className="mt-4 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                ← Back to sign in
              </button>
            </>
          )}

          {mode === 'sent' && (
            <>
              <div className="text-center">
                <div className="text-3xl mb-4">📬</div>
                <h1 className="text-lg font-semibold text-white mb-2">Check your email</h1>
                <p className="text-sm text-white/50 mb-6">
                  We sent a reset link and numeric code to <strong className="text-white/80">{email}</strong>.
                  You can use either — the code works even if your email client opens the link first.
                </p>
                <a
                  href="/admin/update-password"
                  className="block w-full rounded-lg border border-white/10 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:border-white/20 transition-colors mb-3"
                >
                  Enter code manually →
                </a>
                <button
                  onClick={handleForgot}
                  disabled={loading}
                  className="text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  {loading ? 'Sending…' : 'Send again'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'

type Mode = 'loading' | 'password' | 'code'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('loading')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const supabase = createBrowserSupabase()
    let settled = false
    const goPassword = () => {
      if (settled) return
      settled = true
      setMode('password')
    }
    const goCode = (msg?: string) => {
      if (settled) return
      settled = true
      if (msg) setInfo(msg)
      setMode('code')
    }

    // If the URL hash contains an error (pre-fetched link consumed by email scanner)
    // skip straight to code entry
    const hash = window.location.hash.slice(1)
    const hashParams = new URLSearchParams(hash)
    if (hashParams.get('error_code') || hashParams.get('error')) {
      goCode('Your reset link expired or was already used. Enter the reset code from your email instead.')
      return
    }

    // Listen for a recovery session from a valid link
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) goPassword()
    })

    // Also check if a session was already parsed from the URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) goPassword()
    })

    // Safety net: never spin forever — fall back to code entry after 3 seconds
    const timer = setTimeout(() => {
      goCode('Enter the reset code from your password reset email to continue.')
    }, 3000)

    return () => {
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [])

  const validatePasswords = useCallback(() => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return false
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return false
    }
    return true
  }, [password, confirm])

  // Path A — reset link worked, we have a recovery session
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validatePasswords()) return
    setLoading(true)
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/admin')
  }

  // Path B — verify OTP code from email, then set password
  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validatePasswords()) return
    if (code.trim().length < 6) {
      setError('Enter the reset code from your email.')
      return
    }
    setLoading(true)
    const supabase = createBrowserSupabase()
    const { error: verifyErr } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'recovery',
    })
    if (verifyErr) {
      setError('That code is invalid or expired. Request a new one below.')
      setLoading(false)
      return
    }
    const { error: updateErr } = await supabase.auth.updateUser({ password })
    if (updateErr) {
      setError(updateErr.message)
      setLoading(false)
      return
    }
    router.push('/admin')
  }

  async function resendCode() {
    setError('')
    setInfo('')
    if (!email.trim()) {
      setError('Enter your email first, then tap "Send a new code."')
      return
    }
    setResending(true)
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/update-password`,
    })
    setResending(false)
    if (error) {
      setError(error.message)
      return
    }
    setInfo('A new code and link were sent. Check your email (and spam).')
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
        </div>

        <div className="rounded-2xl bg-[#0f1f1b] border border-white/5 p-8">
          {mode === 'loading' && (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#10755A] border-t-transparent mb-4" />
              <p className="text-sm text-white/50">Verifying reset link…</p>
            </div>
          )}

          {mode === 'password' && (
            <>
              <h1 className="text-lg font-semibold text-white mb-2">Set New Password</h1>
              <p className="text-sm text-white/50 mb-6">Choose a strong password for your admin account.</p>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">New password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#10755A] py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving…' : 'Save New Password'}
                </button>
              </form>
            </>
          )}

          {mode === 'code' && (
            <>
              <h1 className="text-lg font-semibold text-white mb-2">Enter Reset Code</h1>
              {info && <p className="text-sm text-amber-400 mb-4">{info}</p>}
              <p className="text-sm text-white/50 mb-6">
                Enter the 8-digit code from your password reset email along with your email address and new password.
              </p>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
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
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Reset code</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={8}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="12345678"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/25 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">New password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#10755A] py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Verifying…' : 'Set New Password'}
                </button>
              </form>
              <div className="mt-4 border-t border-white/5 pt-4">
                <p className="text-xs text-white/40 mb-2">Need a new code?</p>
                <button
                  onClick={resendCode}
                  disabled={resending}
                  className="text-sm text-[#10755A] hover:text-[#0d9e6e] disabled:opacity-50 transition-colors"
                >
                  {resending ? 'Sending…' : 'Send a new code'}
                </button>
                {info && !error && <p className="text-xs text-emerald-400 mt-2">{info}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

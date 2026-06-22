'use client'

import { useState, useCallback, Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'

function UpdatePasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validatePasswords()) return
    if (code.trim().length < 6) {
      setError('Enter the code from your email.')
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
    setInfo('A new code was sent. Check your email (and spam).')
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
          <h1 className="text-lg font-semibold text-white mb-2">Reset Your Password</h1>
          {info && <p className="text-sm text-amber-400 mb-4">{info}</p>}
          <p className="text-sm text-white/50 mb-6">
            Enter the code from your email along with your email address and new password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
      </div>
    </div>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={null}>
      <UpdatePasswordForm />
    </Suspense>
  )
}

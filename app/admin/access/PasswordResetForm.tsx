'use client'

import { useState } from 'react'
import { Check, Eye, EyeOff, UserRound } from 'lucide-react'

const MIN_PASSWORD_LENGTH = 8

export default function PasswordResetForm({
  accountName,
  accountEmail,
}: {
  accountName: string
  accountEmail: string
}) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/access/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: accountEmail, password, confirmPassword }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.error ?? 'Could not update the password. Try again.')
        return
      }

      setPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setSuccess(`${accountName}'s password has been updated.`)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10755A] focus:border-transparent'

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10755A]/10 text-[#10755A]">
          <UserRound size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{accountName}</p>
          <p className="truncate text-sm text-gray-500">{accountEmail}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="new-password"
            className="block text-xs font-medium text-gray-600 mb-1.5"
          >
            New password
          </label>
          <input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-xs font-medium text-gray-600 mb-1.5"
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          {showPassword ? 'Hide password' : 'Show password'}
        </button>

        <p className="text-xs text-gray-400">
          At least {MIN_PASSWORD_LENGTH} characters. Memorable is fine — obvious is not.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-[#10755A]">
            <Check size={16} />
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#10755A] py-3 sm:py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  )
}

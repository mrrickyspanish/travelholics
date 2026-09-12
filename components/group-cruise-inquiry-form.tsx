'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Ship, Sparkles } from 'lucide-react'

const inputClass = 'mt-2 w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-base text-ink outline-none transition placeholder:text-stone/45 focus:border-emerald-mid focus:ring-0'
const labelClass = 'block text-base font-bold text-ink'

export default function GroupCruiseInquiryForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    cruiseStage: 'help', groupType: '', estimatedGroupSize: '', destination: '', preferredDates: '', budgetRange: '', cruiseLine: '', ship: '', sailingDate: '', notes: '',
    leaderName: '', email: '', phone: '', preferredContact: 'phone', smsConsent: false,
  })

  function set(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/group-cruise-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'group-cruises-page', estimatedGroupSize: form.estimatedGroupSize ? Number(form.estimatedGroupSize) : null }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to send your request.')
      router.push('/thank-you/group-cruise')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send your request.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="border-y border-ink/15 bg-[#fbf7ef]">
      <div className="grid gap-5 border-b border-ink/12 px-0 py-5 sm:grid-cols-[1fr_auto] sm:items-end sm:py-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-coral">Start planning your group cruise</p>
          <p className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-[-0.04em] text-royal-deep sm:text-4xl">
            {step === 1 ? 'Tell us about the trip.' : 'Tell us who is leading the crew.'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-stone/55">
          <span className={step >= 1 ? 'text-coral' : ''}>01 Trip</span>
          <span className="h-px w-8 bg-ink/15" />
          <span className={step >= 2 ? 'text-coral' : ''}>02 You</span>
        </div>
      </div>

      <div className="py-7 sm:py-9 lg:py-10">
        {step === 1 ? (
          <div className="space-y-9">
            <div>
              <p className="mb-4 text-sm font-bold text-ink">Where are you in the planning process?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => set('cruiseStage', 'help')}
                  className={`relative border p-5 text-left transition ${form.cruiseStage === 'help' ? 'border-emerald-mid bg-white shadow-[0_12px_32px_rgba(26,46,42,0.06)]' : 'border-ink/12 bg-transparent hover:border-ink/25'}`}
                >
                  <Sparkles className="mb-5 h-5 w-5 text-coral" />
                  <span className="block font-serif text-2xl font-semibold tracking-[-0.035em] text-royal-deep">Help me choose</span>
                  <span className="mt-2 block text-sm leading-6 text-stone">We have the people. Yolanda can help shape the cruise.</span>
                  {form.cruiseStage === 'help' ? <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-mid text-white"><Check size={13} /></span> : null}
                </button>
                <button
                  type="button"
                  onClick={() => set('cruiseStage', 'specific')}
                  className={`relative border p-5 text-left transition ${form.cruiseStage === 'specific' ? 'border-emerald-mid bg-white shadow-[0_12px_32px_rgba(26,46,42,0.06)]' : 'border-ink/12 bg-transparent hover:border-ink/25'}`}
                >
                  <Ship className="mb-5 h-5 w-5 text-emerald-mid" />
                  <span className="block font-serif text-2xl font-semibold tracking-[-0.035em] text-royal-deep">I have a cruise in mind</span>
                  <span className="mt-2 block text-sm leading-6 text-stone">Share what you already know and we will take it from there.</span>
                  {form.cruiseStage === 'specific' ? <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-mid text-white"><Check size={13} /></span> : null}
                </button>
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <label className={labelClass}>What are we celebrating or bringing together?<select className={inputClass} value={form.groupType} onChange={(e) => set('groupType', e.target.value)}><option value="">Choose one</option><option>Family reunion</option><option>Birthday</option><option>Friends trip</option><option>Church group</option><option>Wedding / celebration</option><option>Organization / club</option><option>Just because</option><option>Something else</option></select></label>
              <label className={labelClass}>About how many travelers?<input type="number" min="2" className={inputClass} value={form.estimatedGroupSize} onChange={(e) => set('estimatedGroupSize', e.target.value)} placeholder="20" /></label>
              <label className={labelClass}>Destination or region<input className={inputClass} value={form.destination} onChange={(e) => set('destination', e.target.value)} placeholder="Caribbean, Alaska, Mediterranean..." /></label>
              <label className={labelClass}>Preferred dates or timeframe<input className={inputClass} value={form.preferredDates} onChange={(e) => set('preferredDates', e.target.value)} placeholder="Summer 2027, June 10–17..." /></label>
              <label className={labelClass}>Rough per-person budget<select className={inputClass} value={form.budgetRange} onChange={(e) => set('budgetRange', e.target.value)}><option value="">Not sure yet</option><option value="Under $1,000">Under $1,000</option><option value="$1,000–$1,500">$1,000–$1,500</option><option value="$1,500–$2,500">$1,500–$2,500</option><option value="$2,500+">$2,500+</option></select></label>
            </div>

            {form.cruiseStage === 'specific' ? (
              <div className="border-y border-ink/12 bg-white/45 px-0 py-6 sm:px-5">
                <p className="mb-5 text-[10px] font-black uppercase tracking-[0.18em] text-coral">Perfect. What do you already know?</p>
                <div className="grid gap-5 sm:grid-cols-3">
                  <label className={labelClass}>Cruise line<input className={inputClass} value={form.cruiseLine} onChange={(e) => set('cruiseLine', e.target.value)} placeholder="Royal Caribbean" /></label>
                  <label className={labelClass}>Ship<input className={inputClass} value={form.ship} onChange={(e) => set('ship', e.target.value)} placeholder="Wonder of the Seas" /></label>
                  <label className={labelClass}>Sailing date<input type="date" className={inputClass} value={form.sailingDate} onChange={(e) => set('sailingDate', e.target.value)} /></label>
                </div>
              </div>
            ) : null}

            <label className={labelClass}>Anything else Yolanda should know?<textarea className={`${inputClass} min-h-28 resize-y`} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Tell us the vibe, must-haves, or anything that would make this trip special." /></label>

            <button type="button" onClick={() => setStep(2)} className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-black text-white transition hover:translate-y-[-1px] hover:bg-coral-deep sm:w-auto">Keep planning <ArrowRight size={17} /></button>
          </div>
        ) : (
          <div className="space-y-9">
            <div className="border-b border-ink/12 pb-7">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-coral">Almost there</p>
              <h3 className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.045em] text-royal-deep">How should Yolanda reach you?</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-stone">She will review your cruise vision and follow up in the way you prefer.</p>
            </div>

            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <label className={labelClass}>Full name *<input required className={inputClass} value={form.leaderName} onChange={(e) => set('leaderName', e.target.value)} autoComplete="name" /></label>
              <label className={labelClass}>Email *<input required type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /></label>
              <label className={labelClass}>Phone<input type="tel" className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" /></label>
              <label className={labelClass}>Best way to reach you *<select className={inputClass} value={form.preferredContact} onChange={(e) => set('preferredContact', e.target.value)}><option value="phone">Phone call</option><option value="text">Text</option><option value="email">Email</option></select></label>
            </div>

            {form.preferredContact === 'text' ? <label className="flex items-start gap-3 border-y border-ink/12 py-4 text-sm leading-6 text-stone"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#10755A]" checked={form.smsConsent} onChange={(e) => set('smsConsent', e.target.checked)} /><span>I agree to receive text messages from Travelholics about this group cruise inquiry. Message and data rates may apply.</span></label> : null}
            {error ? <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setStep(1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-bold text-ink transition hover:bg-white"><ArrowLeft size={17} /> Back</button>
              <button type="submit" disabled={loading || (form.preferredContact === 'text' && !form.smsConsent)} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-black text-white transition hover:translate-y-[-1px] hover:bg-coral-deep disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Sending…' : 'Start Planning My Group Cruise'} <Check size={17} /></button>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

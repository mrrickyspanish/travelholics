'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Ship, Sparkles } from 'lucide-react'
import { appendLeadAttribution } from '@/lib/lead-attribution'
import { validateGroupInquiryContact } from '@/lib/group-inquiry'

const inputClass = 'mt-2 w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-base text-ink outline-none transition placeholder:text-stone/45 focus:border-emerald-mid focus:ring-0'
const labelClass = 'block text-base font-bold text-ink'

export default function GroupCruiseInquiryForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const stepTitleRef = useRef<HTMLParagraphElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)
  const previousStep = useRef(step)
  const [form, setForm] = useState({
    cruiseStage: 'help', groupType: '', estimatedGroupSize: '', estimatedCabins: '', budgetPerPerson: '', destination: '', preferredDates: '', cruiseLine: '', ship: '', sailingDate: '', notes: '',
    leaderName: '', email: '', phone: '', preferredContact: 'email', smsConsent: false,
  })

  function set(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    const title = stepTitleRef.current
    title?.focus({ preventScroll: true })
    title?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }, [step])

  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  function changeStep(nextStep: number) {
    setError('')
    setStep(nextStep)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (loading) return
    if (step === 1) {
      changeStep(2)
      return
    }
    setError('')
    const validationError = validateGroupInquiryContact(form)
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/group-cruise-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, notes: appendLeadAttribution(form.notes), source: 'group-cruises-page', estimatedGroupSize: form.estimatedGroupSize ? Number(form.estimatedGroupSize) : null }),
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
    <form onSubmit={submit} aria-labelledby="group-inquiry-step-title" aria-busy={loading} className="border-y border-ink/15 bg-[#fbf7ef]">
      <div className="flex flex-col gap-4 border-b border-ink/12 px-0 py-5 sm:py-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">Start planning your group cruise</p>
          <p id="group-inquiry-step-title" ref={stepTitleRef} tabIndex={-1} className="mt-2 scroll-mt-28 font-serif text-3xl font-semibold leading-tight tracking-[-0.04em] text-royal-deep outline-none [text-wrap:balance] sm:text-4xl">
            {step === 1 ? 'Tell us about the trip.' : 'Tell us who is leading the crew.'}
          </p>
        </div>
        <div role="group" aria-label={`Step ${step} of 2`} className="flex items-center gap-3 text-sm font-black text-stone">
          <span aria-current={step === 1 ? 'step' : undefined} className={step === 1 ? 'text-coral-deep' : ''}>1. Trip details</span>
          <span aria-hidden="true" className="h-px w-6 bg-ink/15" />
          <span aria-current={step === 2 ? 'step' : undefined} className={step === 2 ? 'text-coral-deep' : ''}>2. Contact</span>
        </div>
      </div>

      <div className="py-7 sm:py-9 lg:py-10">
        {step === 1 ? (
          <div className="space-y-9">
            <fieldset className="min-w-0">
              <legend className="mb-4 text-lg font-bold text-ink">Where are you in the planning process?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => set('cruiseStage', 'help')}
                  aria-pressed={form.cruiseStage === 'help'}
                  className={`cruise-stage-choice relative border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-mid focus-visible:ring-offset-2 ${form.cruiseStage === 'help' ? 'border-emerald-mid bg-white shadow-[0_12px_32px_rgba(26,46,42,0.06)]' : 'border-ink/12 bg-transparent hover:border-ink/25'}`}
                >
                  <Sparkles className="mb-5 h-5 w-5 text-coral" />
                  <span className="block font-serif text-2xl font-semibold tracking-[-0.035em] text-royal-deep">Help me choose</span>
                  <span className="mt-2 block text-lg leading-7 text-stone">We have the people. Yolanda can help shape the cruise.</span>
                  {form.cruiseStage === 'help' ? <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-mid text-white"><Check size={13} /></span> : null}
                </button>
                <button
                  type="button"
                  onClick={() => set('cruiseStage', 'specific')}
                  aria-pressed={form.cruiseStage === 'specific'}
                  className={`cruise-stage-choice relative border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-mid focus-visible:ring-offset-2 ${form.cruiseStage === 'specific' ? 'border-emerald-mid bg-white shadow-[0_12px_32px_rgba(26,46,42,0.06)]' : 'border-ink/12 bg-transparent hover:border-ink/25'}`}
                >
                  <Ship className="mb-5 h-5 w-5 text-emerald-mid" />
                  <span className="block font-serif text-2xl font-semibold tracking-[-0.035em] text-royal-deep">I have a cruise in mind</span>
                  <span className="mt-2 block text-lg leading-7 text-stone">Share what you already know and we will take it from there.</span>
                  {form.cruiseStage === 'specific' ? <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-mid text-white"><Check size={13} /></span> : null}
                </button>
              </div>
            </fieldset>

            <p className="text-lg leading-7 text-stone">Only the group occasion is required in this step. Estimates are enough; leave undecided details blank.</p>
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <label className={labelClass}>What are we bringing together? *<select required className={inputClass} value={form.groupType} onChange={(e) => set('groupType', e.target.value)}><option value="">Choose one</option><option>Family reunion</option><option>Birthday</option><option>Friends trip</option><option>Church group</option><option>Wedding / celebration</option><option>Organization / club</option><option>Just because</option><option>Something else</option></select></label>
              <label className={labelClass}>About how many travelers?<input type="number" min="2" step="1" className={inputClass} value={form.estimatedGroupSize} onChange={(e) => set('estimatedGroupSize', e.target.value)} placeholder="For example, 20" /></label>
              <label className={labelClass}>About how many cabins?<input type="number" min="1" step="1" className={inputClass} value={form.estimatedCabins} onChange={(e) => set('estimatedCabins', e.target.value)} placeholder="For example, 10" /></label>
              <label className={labelClass}>Cruise budget per person<input maxLength={120} className={inputClass} value={form.budgetPerPerson} onChange={(e) => set('budgetPerPerson', e.target.value)} placeholder="$1,500-$2,000 before flights" /></label>
              <label className={labelClass}>Destination or region<input className={inputClass} value={form.destination} onChange={(e) => set('destination', e.target.value)} placeholder="Caribbean, Alaska, Mediterranean..." /></label>
              <label className={labelClass}>Preferred dates or timeframe<input className={inputClass} value={form.preferredDates} onChange={(e) => set('preferredDates', e.target.value)} placeholder="Summer 2027, June 10–17..." /></label>
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

            <label className={labelClass}>What kind of experience should this feel like?<textarea className={`${inputClass} min-h-28 resize-y`} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Tell Yolanda what matters most: celebration, relaxation, adventure, or a mix." /></label>

            <button type="submit" className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-base font-black text-white transition hover:translate-y-[-1px] hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-mid focus-visible:ring-offset-2 sm:w-auto">Next: your contact details <ArrowRight size={17} /></button>
          </div>
        ) : (
          <div className="space-y-9">
            <div className="border-b border-ink/12 pb-7">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Your trip so far</p>
              <p className="mt-3 text-lg leading-7 font-bold text-ink">{[form.groupType, form.estimatedGroupSize ? `${form.estimatedGroupSize} travelers` : '', form.estimatedCabins ? `${form.estimatedCabins} cabins` : '', form.destination, form.preferredDates].filter(Boolean).join(' · ')}</p>
              <button type="button" disabled={loading} onClick={() => changeStep(1)} className="mt-2 inline-flex min-h-11 items-center text-base font-bold text-emerald-mid underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-mid disabled:opacity-50">Edit trip details</button>
              <p className="mt-4 max-w-xl text-lg leading-7 text-stone">Yolanda will review your idea and follow up your way. Email is needed for your request confirmation.</p>
            </div>

            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <label className={labelClass}>Full name *<input required className={inputClass} value={form.leaderName} onChange={(e) => set('leaderName', e.target.value)} autoComplete="name" /></label>
              <label className={labelClass}>Email *<input required type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /></label>
              <label className={labelClass}>Phone{form.preferredContact !== 'email' ? ' *' : ' (optional)'}<input required={form.preferredContact !== 'email'} type="tel" className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" /></label>
              <label className={labelClass}>Best way to reach you *<select className={inputClass} value={form.preferredContact} onChange={(e) => set('preferredContact', e.target.value)}><option value="phone">Phone call</option><option value="text">Text</option><option value="email">Email</option></select></label>
            </div>

            {form.preferredContact === 'text' ? <label className="flex min-h-11 items-start gap-3 border-y border-ink/12 py-4 text-lg leading-7 text-stone"><input required type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#10755A]" checked={form.smsConsent} onChange={(e) => set('smsConsent', e.target.checked)} /><span>I agree to receive text messages from Travelholics about this group cruise inquiry. Message and data rates may apply.</span></label> : null}
            {error ? <p ref={errorRef} tabIndex={-1} role="alert" className="scroll-mt-28 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-lg leading-7 font-semibold text-red-700 focus:outline-none">{error}</p> : null}

            <p className="text-lg leading-7 text-stone">This starts a planning conversation. No cabins are reserved and no payment is collected here.</p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <button type="button" disabled={loading} onClick={() => changeStep(1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-base font-bold text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-mid disabled:opacity-50"><ArrowLeft size={17} /> Back</button>
              <button type="submit" disabled={loading} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-base font-black text-white transition hover:translate-y-[-1px] hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-mid focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Sending…' : 'Send my group cruise inquiry'} <Check size={17} /></button>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, CheckCircle2, Mail, Sparkles } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Your Group Cruise Is in Motion',
  robots: { index: false, follow: false },
}

export default function GroupCruiseThankYouPage() {
  const schedulingUrl = process.env.NEXT_PUBLIC_GROUP_CRUISE_SCHEDULING_URL
  const videoUrl = process.env.NEXT_PUBLIC_GROUP_CRUISE_THANK_YOU_VIDEO_URL

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand px-5 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral text-white shadow-lg shadow-coral/20"><Sparkles size={25} /></span>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-coral">Request received</p>
            <h1 className="mx-auto mt-3 max-w-4xl font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-royal-deep sm:text-6xl lg:text-7xl">Your group cruise is officially one step closer.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone sm:text-lg">Thanks for bringing Travelholics into the plan. Yolanda has your request and will help turn the idea into an experience your group can get excited about.</p>
          </div>

          <section className="mt-10 overflow-hidden rounded-[2rem] border border-ink/10 bg-cream shadow-[0_26px_80px_rgba(26,46,42,0.10)]">
            {videoUrl ? (
              <video controls playsInline className="aspect-video w-full bg-ink object-cover" poster="/images/about-port-of-call.jpg"><source src={videoUrl} /></video>
            ) : (
              <div className="relative aspect-video min-h-[280px] overflow-hidden bg-emerald-deep"><Image src="/images/about-port-of-call.jpg" alt="Yolanda from Travelholics" fill className="object-cover opacity-55" sizes="(max-width: 1024px) 92vw, 960px" /><div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/35 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8"><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">A note from Yolanda</p><h2 className="mt-2 font-serif text-3xl font-semibold">I&apos;m excited to hear what you have in mind.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/70">I&apos;ll review what you shared, then we&apos;ll talk through the group, the sailing, and the details that can make this cruise feel like yours.</p></div></div>
            )}
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {[['1', 'Yolanda reviews your request', 'She will look over the group, timing, and cruise direction you shared.'], ['2', 'You shape the trip together', 'You will connect, talk through the vision, and lock in the right sailing and details.'], ['3', 'Your group gets its home base', 'Once the trip is confirmed, Travelholics builds the personalized group experience.']].map(([number, title, copy]) => <article key={number} className="rounded-2xl border border-ink/10 bg-cream p-5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-mid text-xs font-black text-white">{number}</span><h2 className="mt-4 text-lg font-bold text-ink">{title}</h2><p className="mt-2 text-sm leading-6 text-stone">{copy}</p></article>)}
          </section>

          <section className="mt-8 rounded-[1.7rem] bg-emerald-deep p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div><p className="flex items-center gap-2 text-sm font-bold"><Mail size={17} className="text-coral" /> Check your inbox, too.</p><p className="mt-2 max-w-2xl text-sm leading-6 text-white/68">We sent a confirmation with the details you will want to reference later. That email closes the loop while Yolanda gets ready to connect.</p></div>
            {schedulingUrl ? <a href={schedulingUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white hover:bg-coral-deep sm:mt-0"><CalendarDays size={17} /> Schedule with Yolanda</a> : <div className="mt-5 flex shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white/75 sm:mt-0"><CheckCircle2 size={17} className="text-coral" /> Yolanda will follow up</div>}
          </section>

          <div className="mt-8 text-center"><Link href="/" className="text-sm font-bold text-emerald-mid hover:text-emerald-deep">Back to Travelholics</Link></div>
        </div>
      </main>
      <Footer />
    </>
  )
}

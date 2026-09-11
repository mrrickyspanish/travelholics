import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, CalendarDays, CheckCircle2, Heart, KeyRound, PartyPopper, Ship, Sparkles, UsersRound } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import GroupCruiseInquiryForm from '@/components/group-cruise-inquiry-form'

export const metadata: Metadata = {
  title: 'Group Cruises with Yolanda',
  description: 'Plan an unforgettable group cruise with Yolanda and Travelholics. From the first idea to a personalized trip hub, your group gets one organized, fun experience.',
  alternates: { canonical: '/group-cruises' },
}

const groupIdeas = [
  ['Family reunions', 'Get everybody together somewhere better than a banquet hall.'],
  ['Milestone birthdays', 'Turn the group chat into a real celebration at sea.'],
  ['Friends trips', 'Big energy, fewer logistics, better memories.'],
  ['Church & community groups', 'A shared experience with one organized home base.'],
]

const steps = [
  ['Dream it up', 'Tell Yolanda who is traveling, when you want to go, and what kind of cruise experience you are imagining.'],
  ['Build it together', 'Yolanda helps lock in the sailing, cabins, pricing, and the details that make the trip work for your group.'],
  ['Get your group hub', 'Once the cruise is set, your crew gets one personalized place for the itinerary, cabin choices, pricing, and next steps.'],
  ['Sail together', 'Travelholics keeps the group informed while Yolanda stays close to the experience from planning through departure.'],
]

const faqs = [
  ['How many people do I need for a group cruise?', 'It depends on the cruise line and sailing. Start with your estimated group size and Yolanda will help determine the best path.'],
  ['Do we have to know exactly which cruise we want?', 'No. You can come with a specific sailing in mind or ask Yolanda to help narrow down the right cruise for your group.'],
  ['Will everyone book through the group leader?', 'No. Once the group trip is set up, guests can review the trip and submit their own booking request to Travelholics.'],
  ['Does the group get one place for all the trip details?', 'Yes. Confirmed Travelholics group cruises receive a personalized trip hub with the information your group needs in one place.'],
]

export default function GroupCruisesPage() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-sand text-ink">
        <section className="relative min-h-[86vh] overflow-hidden bg-emerald-deep pt-28 text-white sm:pt-32 lg:pt-36">
          <div className="absolute inset-0 opacity-35" aria-hidden="true"><Image src="/images/about-with-travelers.jpg" alt="" fill priority className="object-cover" sizes="100vw" /></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep via-emerald-deep/92 to-emerald-deep/45" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[92rem] items-end gap-12 px-5 pb-20 sm:px-6 lg:grid-cols-[0.62fr_0.38fr] lg:px-10 lg:pb-28 xl:px-12">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm"><PartyPopper size={15} className="text-coral" /> Group Cruises by Travelholics</div>
              <h1 className="font-serif text-[clamp(3.25rem,8vw,7.3rem)] font-semibold leading-[0.91] tracking-[-0.055em]">Your people.<br /><span className="inline-block whitespace-nowrap text-[0.82em] text-coral">One unforgettable</span><br />cruise.</h1>
              <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/78 sm:text-xl">Bring the crew. Yolanda partners with you to shape the sailing, organize the details, and build a group experience that feels exciting from the first conversation to sail away.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><Link href="#start-planning" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-black/10 transition hover:bg-coral-deep">Start Planning Your Group Cruise <ArrowDown size={18} /></Link><span className="text-sm font-semibold text-white/55">No cruise picked yet? That is completely fine.</span></div>
            </div>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6"><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">The Travelholics difference</p><p className="mt-3 font-serif text-2xl font-semibold leading-tight">The woman you know from TikTok is the woman helping you plan it.</p><p className="mt-3 text-sm leading-6 text-white/70">Travelholics gives you a real partner, not a booking link and a good-luck email.</p></div>
          </div>
        </section>

        <section className="mx-auto max-w-[92rem] px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Who is this for?</p><h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep sm:text-5xl">If your people are ready, we can build the experience.</h2></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{groupIdeas.map(([title, copy], index) => <article key={title} className="flex flex-col items-center rounded-[1.7rem] border border-white/80 bg-cream p-6 text-center shadow-[0_16px_46px_rgba(26,46,42,0.06)]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">{index === 0 ? <Heart size={20} /> : index === 1 ? <PartyPopper size={20} /> : index === 2 ? <Sparkles size={20} /> : <UsersRound size={20} />}</span><h3 className="mt-5 text-lg font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-stone">{copy}</p></article>)}</div>
        </section>

        <section className="bg-cream py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-[92rem] gap-10 px-5 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:px-10 xl:px-12">
            <div className="relative min-h-[32rem] overflow-hidden rounded-[2rem] shadow-[0_28px_70px_rgba(26,46,42,0.13)]"><Image src="/images/about-port-of-call.jpg" alt="Yolanda and travelers enjoying a cruise experience" fill className="object-cover" sizes="(max-width: 1024px) 92vw, 40vw" /><div className="absolute inset-x-4 bottom-4 rounded-2xl bg-emerald-deep/92 p-5 text-white backdrop-blur-sm"><p className="text-xs font-black uppercase tracking-[0.14em] text-coral">Your cruise partner</p><p className="mt-2 font-serif text-2xl font-semibold">Yolanda is in this with you.</p></div></div>
            <div><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Experience you can actually use</p><h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep sm:text-5xl">Cruise knowledge is better when it comes with a person.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-stone">Yolanda brings 20+ years of travel experience, firsthand experience across 6+ cruise lines, and a community of 20K+ travelers who follow along for practical cruise advice. When you plan a group with Travelholics, that experience becomes part of your trip.</p><div className="mt-7 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-sand p-4"><p className="font-serif text-3xl font-semibold text-royal-deep">20+</p><p className="mt-1 text-xs font-bold text-stone">Years traveling</p></div><div className="rounded-2xl bg-sand p-4"><p className="font-serif text-3xl font-semibold text-royal-deep">6+</p><p className="mt-1 text-xs font-bold text-stone">Cruise lines sailed</p></div><div className="rounded-2xl bg-sand p-4"><p className="font-serif text-3xl font-semibold text-royal-deep">20K+</p><p className="mt-1 text-xs font-bold text-stone">Travel community</p></div></div></div>
          </div>
        </section>

        <section className="bg-emerald-deep py-16 text-white sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
            <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">How we get you onboard</p><h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">From “we should do a cruise” to “meet us on the Lido deck.”</h2></div>
            <div className="mt-10 grid gap-4 lg:grid-cols-4">{steps.map(([title, copy], index) => <article key={title} className="relative flex flex-col items-center rounded-[1.6rem] border border-white/12 bg-white/[0.07] p-6 text-center"><span className="text-5xl font-black leading-none text-coral/35">0{index + 1}</span><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{copy}</p></article>)}</div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[92rem] gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.4fr_0.6fr] lg:items-center lg:px-10 lg:py-24 xl:px-12">
          <div><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Your group gets its own home base</p><h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep sm:text-5xl">No more hunting through the group chat.</h2><p className="mt-5 text-base leading-7 text-stone">Once your cruise is locked in, Travelholics creates a personalized trip hub for the group. One place for the itinerary, cabin choices, group pricing, important dates, and booking requests.</p><div className="mt-6 space-y-3">{['Private group access code', 'Cabin choices with group pricing', 'Itinerary and important deadlines', 'One clear booking request flow'].map((item) => <p key={item} className="flex items-center gap-3 text-sm font-semibold text-ink"><CheckCircle2 size={18} className="text-emerald-mid" />{item}</p>)}</div><p className="mt-7 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-sm font-semibold text-coral-deep">One personalized place for your group to know what is happening, what comes next, and how to join the trip.</p></div>
          <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-cream p-4 shadow-[0_30px_90px_rgba(26,46,42,0.12)] sm:p-6"><div className="rounded-[1.5rem] bg-emerald-deep p-5 text-white sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-coral">The Johnson Family Cruise</p><h3 className="mt-2 font-serif text-3xl font-semibold">Eastern Caribbean · 2027</h3></div><KeyRound className="text-white/45" /></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Ship','Wonder'],['Sailing','Jun 12'],['Cabins','4 choices'],['Next up','Deposit']].map(([label, value]) => <div key={label} className="rounded-xl bg-white/10 p-3"><p className="text-[10px] font-black uppercase tracking-wide text-white/45">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>)}</div></div><div className="grid gap-3 pt-4 sm:grid-cols-2"><div className="rounded-2xl border border-ink/8 bg-white p-5"><p className="text-xs font-black uppercase tracking-wide text-stone">Cabin spotlight</p><p className="mt-2 text-lg font-bold text-ink">Ocean View Balcony</p><p className="mt-1 text-sm text-stone">Per-person + cabin total pricing</p></div><div className="rounded-2xl border border-ink/8 bg-white p-5"><p className="text-xs font-black uppercase tracking-wide text-stone">Day 3</p><p className="mt-2 text-lg font-bold text-ink">Perfect Day at CocoCay</p><p className="mt-1 text-sm text-stone">Arrival 7:00 AM · Sail away 5:00 PM</p></div></div></div>
        </section>

        <section className="bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-5 sm:px-6"><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Quick answers</p><h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep">Before you rally the crew.</h2></div><div className="mt-8 divide-y divide-ink/10 rounded-[1.6rem] border border-ink/10 bg-white px-5 sm:px-7">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none pr-8 text-base font-bold text-ink">{question}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-stone">{answer}</p></details>)}</div></div>
        </section>

        <section id="start-planning" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-[92rem] gap-8 px-5 sm:px-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-start lg:px-10 xl:px-12"><div className="lg:sticky lg:top-24"><p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Ready when you are</p><h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-royal-deep sm:text-5xl">Tell us about the group. We will build from there.</h2><p className="mt-5 text-base leading-7 text-stone">You do not need a perfect plan. Give Yolanda the starting point and she will help turn it into a cruise worth getting everybody together for.</p><div className="mt-7 flex items-center gap-3 rounded-2xl bg-cream p-4 text-sm text-stone"><CalendarDays size={21} className="shrink-0 text-emerald-mid" /><span>After you submit, you can optionally schedule time with Yolanda right away.</span></div></div><GroupCruiseInquiryForm /></div>
        </section>
      </main>
      <Footer />
    </>
  )
}

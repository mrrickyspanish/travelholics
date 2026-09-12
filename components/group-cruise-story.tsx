'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, CalendarDays, CheckCircle2, KeyRound, Ship, UsersRound } from 'lucide-react'
import GroupCruiseInquiryForm from '@/components/group-cruise-inquiry-form'

const occasions = [
  {
    title: 'Family reunions',
    copy: 'Everybody together. Nobody stuck hosting.',
    image: '/images/about-with-travelers.jpg',
    className: 'lg:col-span-7 lg:row-span-2',
  },
  {
    title: 'Milestone birthdays',
    copy: 'Make the birthday the destination.',
    image: '/images/dest-bahamas.jpg',
    className: 'lg:col-span-5',
  },
  {
    title: 'Friends trips',
    copy: 'The group chat finally leaves the group chat.',
    image: '/images/about-on-deck.jpg',
    className: 'lg:col-span-5',
  },
  {
    title: 'Church + community',
    copy: 'Shared time, shared memories, one organized plan.',
    image: '/images/dest-caribbean.jpg',
    className: 'lg:col-span-12',
  },
]

const steps = [
  {
    kicker: 'Dream it',
    title: 'Start with the people, not the perfect itinerary.',
    copy: 'Tell Yolanda who is coming, the kind of energy you want, and whatever details you already know. A fully formed cruise plan is not required.',
  },
  {
    kicker: 'Build it',
    title: 'Turn the idea into a cruise everyone can actually say yes to.',
    copy: 'Yolanda helps shape the sailing, cabin mix, pricing, timing, and the details that matter to your group.',
  },
  {
    kicker: 'Bring the crew',
    title: 'Give everybody one clear place to understand the trip.',
    copy: 'Once the cruise is set, your personalized Trip Hub keeps cabin choices, pricing, deadlines, and booking requests together.',
  },
  {
    kicker: 'Sail',
    title: 'Keep the excitement high and the logistics quiet.',
    copy: 'Travelholics stays close to the group through the planning window so everyone knows what comes next before sail away.',
  },
]

const faqs = [
  ['How many people do I need for a group cruise?', 'It depends on the cruise line and sailing. Start with your estimated group size and Yolanda will help determine the best path.'],
  ['Do we have to know exactly which cruise we want?', 'No. You can come with a specific sailing in mind or ask Yolanda to help narrow down the right cruise for your group.'],
  ['Will everyone book through the group leader?', 'No. Once the group trip is set up, guests can review the trip and submit their own booking request to Travelholics.'],
  ['Does the group get one place for all the trip details?', 'Yes. Confirmed Travelholics group cruises receive a personalized trip hub with the information your group needs in one place.'],
]

function ProcessVisual({ active }: { active: number }) {
  const imageForStep = active === 0 ? '/images/dest-caribbean.jpg' : active === 3 ? '/images/about-on-deck.jpg' : null

  return (
    <div className="relative min-h-[32rem] overflow-hidden rounded-[1.35rem] bg-[#0b2b25] shadow-[0_30px_90px_rgba(6,33,28,0.24)]">
      <AnimatePresence mode="wait">
        {imageForStep ? (
          <motion.div
            key={imageForStep}
            initial={{ opacity: 0.15, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.15, scale: 1.02 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            <Image src={imageForStep} alt="" fill className="object-cover" sizes="45vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06241f]/95 via-[#06241f]/28 to-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">{active === 0 ? 'The idea' : 'The payoff'}</p>
              <p className="mt-2 max-w-sm font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.045em]">
                {active === 0 ? 'Caribbean. Summer. Everybody in.' : 'This is what all the planning was for.'}
              </p>
            </div>
          </motion.div>
        ) : active === 1 ? (
          <motion.div key="build" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="absolute inset-0 p-7 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-coral">Build the right mix</p>
            <h3 className="mt-3 max-w-sm font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.045em]">Cabins people can compare without chasing screenshots.</h3>
            <div className="mt-8 border-t border-white/15">
              {[
                ['Interior', '$899 pp', 'Best value'],
                ['Ocean View', '$1,149 pp', 'More light'],
                ['Balcony', '$1,399 pp', 'Most requested'],
              ].map(([name, price, note], index) => (
                <div key={name} className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/15 py-5">
                  <div>
                    <p className="text-lg font-bold">{name}</p>
                    <p className="mt-1 text-sm text-white/50">{note}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl font-semibold text-coral">{price}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/38">sample</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="hub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="absolute inset-0 p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-6 border-b border-white/15 pb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-coral">Johnson Family Cruise</p>
                <p className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Eastern Caribbean · 2027</p>
              </div>
              <KeyRound className="mt-1 text-white/35" size={24} />
            </div>
            <div className="mt-6 grid grid-cols-3 border-y border-white/15 py-5 text-center">
              {[['26', 'Travelers'], ['4', 'Cabin types'], ['Jun 12', 'Sail date']].map(([value, label]) => (
                <div key={label} className="border-r border-white/15 px-2 last:border-r-0">
                  <p className="font-serif text-2xl font-semibold text-coral">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/42">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 space-y-3">
              {['Cabin pricing ready to compare', 'Deposit deadline · Oct 18', 'Booking request status updated'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/10 pb-3 text-sm text-white/72">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral text-[10px] font-black text-white">{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileCruiseCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('group-cruise-hero')
    const form = document.getElementById('start-planning')
    if (!hero || !form) return

    const update = () => {
      const heroBottom = hero.getBoundingClientRect().bottom
      const formTop = form.getBoundingClientRect().top
      setShow(heroBottom < 0 && formTop > window.innerHeight * 0.7)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <AnimatePresence>
      {show ? (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} className="fixed inset-x-4 bottom-4 z-40 md:hidden">
          <Link href="#start-planning" className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral px-5 py-3.5 text-sm font-black text-white shadow-[0_16px_50px_rgba(45,22,17,0.28)]">
            Plan my group cruise <ArrowRight size={17} />
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default function GroupCruiseStory() {
  const reduceMotion = useReducedMotion()
  const processRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const { scrollYProgress } = useScroll({ target: processRef, offset: ['start 70%', 'end 35%'] })
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <main className="overflow-hidden bg-[#f4efe4] text-ink">
      <section id="group-cruise-hero" className="relative min-h-[94svh] overflow-hidden bg-[#082d27] pt-28 text-white sm:pt-32 lg:pt-36">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden="true"
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/about-with-travelers.jpg"
        >
          <source src="https://bnjcpfocmgtmutfbanhs.supabase.co/storage/v1/object/public/Images/travel_updated_hero_vid_2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,32,27,.94)_0%,rgba(5,32,27,.75)_38%,rgba(5,32,27,.18)_74%,rgba(5,32,27,.38)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#06241f] via-[#06241f]/18 to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(94svh-7rem)] max-w-[92rem] flex-col justify-end px-5 pb-10 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16 xl:px-12">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="max-w-[74rem]">
            <div className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/62 sm:text-[11px]">
              <span className="h-px w-10 bg-coral" /> Group Cruises · Travelholics
            </div>
            <h1 className="font-serif text-[clamp(4rem,11vw,10.5rem)] font-semibold leading-[0.8] tracking-[-0.07em] text-white">
              <span className="block">Your people.</span>
              <span className="mt-2 block whitespace-nowrap text-[0.68em] text-coral sm:mt-3">One unforgettable cruise.</span>
            </h1>
          </motion.div>

          <div className="mt-8 grid gap-7 border-t border-white/20 pt-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.55fr)] lg:items-end">
            <p className="max-w-2xl text-lg font-medium leading-7 text-white/76 sm:leading-8">Bring the crew. Yolanda partners with you to shape the sailing, organize the details, and build a group experience that feels exciting from the first conversation to sail away.</p>
            <div className="lg:text-right">
              <p className="font-serif text-xl leading-tight text-white sm:text-2xl">The woman you know from TikTok is the woman helping you plan it.</p>
              <p className="mt-2 text-sm text-white/48">A real partner, not a booking link and a good-luck email.</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href="#start-planning" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-black text-white transition hover:translate-y-[-1px] hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">Start planning <ArrowDown size={17} /></Link>
            <span className="text-sm font-semibold text-white/50">No cruise picked yet? Perfectly fine.</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[92rem] px-5 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-32 xl:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-coral">Bring a reason. Or don&apos;t.</p>
            <h2 className="mt-4 max-w-[10ch] font-serif text-[clamp(3.2rem,6vw,6rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-royal-deep">The occasion is just the excuse.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-stone lg:justify-self-end">The point is getting your people out of the group chat and into a shared story. Travelholics helps turn the reason into the experience.</p>
        </div>

        <div className="mt-12 grid auto-rows-[18rem] gap-3 lg:grid-cols-12 lg:auto-rows-[15rem]">
          {occasions.map((item) => (
            <motion.article key={item.title} whileHover={reduceMotion ? undefined : { y: -3 }} transition={{ duration: 0.2 }} className={`group relative overflow-hidden rounded-[1.2rem] ${item.className}`}>
              <Image src={item.image} alt="" fill className="object-cover transition duration-700 group-hover:scale-[1.025]" sizes="(max-width: 1024px) 100vw, 60vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                <h3 className="font-serif text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{item.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/66">{item.copy}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-[#fbf7ef]">
        <div className="mx-auto grid max-w-[92rem] lg:grid-cols-[0.44fr_0.56fr]">
          <div className="relative min-h-[34rem] overflow-hidden lg:min-h-[46rem]">
            <Image src="/images/hero-yolanda.jpg" alt="Yolanda of Travelholics" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 44vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#082d27]/72 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/72 sm:bottom-8 sm:left-8">Your cruise partner · Yolanda</p>
          </div>
          <div className="flex flex-col justify-between px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-16 xl:px-16">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-coral">Experience with a face</p>
              <h2 className="mt-5 max-w-[11ch] font-serif text-[clamp(3.2rem,5.8vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-royal-deep">Cruise knowledge is better when it comes with a person.</h2>
              <p className="mt-7 max-w-xl text-lg leading-7 text-stone sm:leading-8">Yolanda brings 20+ years of travel experience, firsthand experience across 6+ cruise lines, and a community of 20K+ travelers who follow along for practical cruise advice. When you plan a group with Travelholics, that experience becomes part of your trip.</p>
            </div>

            <div className="mt-12 grid grid-cols-3 border-y border-ink/12 py-6">
              {[['20+', 'Years traveling'], ['6+', 'Cruise lines sailed'], ['20K+', 'Travel community']].map(([value, label]) => (
                <div key={label} className="border-r border-ink/12 px-3 first:pl-0 last:border-r-0 last:pr-0 sm:px-6">
                  <p className="font-serif text-3xl font-semibold tracking-[-0.04em] text-royal-deep sm:text-4xl">{value}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-stone/75 sm:text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={processRef} className="relative bg-[#082d27] py-20 text-white sm:py-28 lg:py-32">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
          <div className="max-w-4xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-coral">The process</p>
            <h2 className="mt-4 max-w-[13ch] font-serif text-[clamp(3.4rem,6.5vw,6.8rem)] font-semibold leading-[0.86] tracking-[-0.06em]">From “we should” to “what time are we meeting on deck?”</h2>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.52fr_0.48fr] lg:gap-16">
            <div className="relative pl-10 sm:pl-14">
              <div className="absolute bottom-0 left-[0.43rem] top-2 w-px bg-white/12 sm:left-[0.68rem]" />
              <motion.div style={{ height: progressHeight }} className="absolute left-[0.43rem] top-2 w-px origin-top bg-coral sm:left-[0.68rem]" />

              {steps.map((step, index) => (
                <motion.article
                  key={step.kicker}
                  onViewportEnter={() => setActiveStep(index)}
                  viewport={{ amount: 0.5 }}
                  className="relative min-h-[21rem] border-b border-white/12 py-10 first:pt-2 last:border-b-0 lg:min-h-[24rem]"
                >
                  <span className={`absolute -left-10 top-11 h-3.5 w-3.5 rounded-full border transition sm:-left-14 sm:h-5 sm:w-5 ${activeStep === index ? 'border-coral bg-coral' : 'border-white/28 bg-[#082d27]'}`} />
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-coral">0{index + 1} · {step.kicker}</p>
                  <h3 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-5xl">{step.title}</h3>
                  <p className="mt-5 max-w-lg text-lg leading-7 text-white/58">{step.copy}</p>
                </motion.article>
              ))}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-28">
                <ProcessVisual active={activeStep} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f4efe4] py-20 sm:py-28 lg:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-10 font-serif text-[16vw] font-semibold leading-none tracking-[-0.08em] text-emerald-mid/[0.045]">TRIP HUB</div>
        <div className="relative mx-auto grid max-w-[92rem] gap-12 px-5 sm:px-6 lg:grid-cols-[0.37fr_0.63fr] lg:items-center lg:px-10 xl:px-12">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-coral">Your group gets its own home base</p>
            <h2 className="mt-4 max-w-[9ch] font-serif text-[clamp(3.3rem,6vw,6.2rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-royal-deep">The group chat can go back to being fun.</h2>
            <p className="mt-6 max-w-md text-lg leading-7 text-stone sm:leading-8">Once your cruise is locked in, Travelholics creates a personalized Trip Hub for the group. One place for cabin choices, group pricing, important dates, itinerary details, and booking requests.</p>
            <div className="mt-8 space-y-3 border-t border-ink/12 pt-6">
              {['Private group access code', 'Cabin choices with transparent pricing', 'Important deadlines in one place', 'One clear booking request flow'].map((item) => (
                <p key={item} className="flex items-center gap-3 text-sm font-semibold text-ink"><CheckCircle2 size={17} className="text-emerald-mid" />{item}</p>
              ))}
            </div>
          </div>

          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24, rotateX: 4 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }} className="relative [perspective:1200px]">
            <div className="relative overflow-hidden rounded-[1.3rem] border border-ink/10 bg-[#0a3029] shadow-[0_40px_110px_rgba(21,58,49,0.22)]">
              <div className="flex items-center justify-between border-b border-white/12 px-5 py-4 text-white sm:px-7">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-coral" /><span className="h-2.5 w-2.5 rounded-full bg-white/22" /><span className="h-2.5 w-2.5 rounded-full bg-white/22" /></div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Travelholics Trip Hub</p>
              </div>
              <div className="grid lg:grid-cols-[0.38fr_0.62fr]">
                <div className="border-b border-white/12 p-6 text-white lg:border-b-0 lg:border-r sm:p-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-coral">Johnson Family Cruise</p>
                  <h3 className="mt-3 font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.045em]">Eastern Caribbean<br />2027</h3>
                  <div className="mt-7 space-y-4 border-t border-white/12 pt-5 text-sm text-white/58">
                    <p className="flex items-center gap-2"><Ship size={15} /> Wonder of the Seas</p>
                    <p className="flex items-center gap-2"><CalendarDays size={15} /> June 12–19</p>
                    <p className="flex items-center gap-2"><UsersRound size={15} /> 26 travelers</p>
                  </div>
                  <div className="mt-9 border-t border-white/12 pt-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/38">Next deadline</p>
                    <p className="mt-2 font-serif text-3xl font-semibold text-coral">Oct 18</p>
                    <p className="mt-1 text-sm text-white/52">Deposit due</p>
                  </div>
                </div>
                <div className="bg-[#fffaf2] p-5 sm:p-7">
                  <div className="grid grid-cols-3 border-y border-ink/10 py-4 text-center">
                    {[['4', 'Cabin choices'], ['18', 'Booked'], ['8', 'Planning']].map(([value, label]) => (
                      <div key={label} className="border-r border-ink/10 px-2 last:border-r-0">
                        <p className="font-serif text-2xl font-semibold text-royal-deep">{value}</p>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-stone/60">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="border border-ink/10 bg-white p-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-coral">Cabin spotlight</p>
                      <p className="mt-2 font-serif text-2xl font-semibold text-royal-deep">Ocean View Balcony</p>
                      <p className="mt-2 text-sm text-stone">$1,399 per person</p>
                    </div>
                    <div className="border border-ink/10 bg-white p-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-coral">Day 3</p>
                      <p className="mt-2 font-serif text-2xl font-semibold text-royal-deep">Perfect Day at CocoCay</p>
                      <p className="mt-2 text-sm text-stone">7:00 AM arrival</p>
                    </div>
                  </div>
                  <div className="mt-3 border border-ink/10 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-coral">Your next move</p>
                        <p className="mt-1 text-sm font-bold text-ink">Choose a cabin and send your booking request.</p>
                      </div>
                      <ArrowRight className="shrink-0 text-emerald-mid" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-[#fbf7ef] py-20 sm:py-24">
        <div className="mx-auto max-w-[78rem] px-5 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.36fr_0.64fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-coral">Quick answers</p>
              <h2 className="mt-4 font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.055em] text-royal-deep sm:text-6xl">Before you rally the crew.</h2>
            </div>
            <div className="border-t border-ink/15">
              {faqs.map(([question, answer], index) => (
                <details key={question} className="group border-b border-ink/15 py-5 sm:py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-bold text-ink sm:text-lg">
                    <span>{question}</span>
                    <span className="mt-1 text-coral transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 max-w-2xl pr-10 text-base leading-6 text-stone sm:text-lg sm:leading-7">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="start-planning" className="scroll-mt-24 bg-[#f4efe4] py-20 sm:py-28 lg:py-32">
        <div className="mx-auto grid max-w-[92rem] gap-12 px-5 sm:px-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-start lg:px-10 xl:px-12">
          <div className="lg:sticky lg:top-28">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-coral">Your turn</p>
            <h2 className="mt-4 max-w-[9ch] font-serif text-[clamp(3.3rem,5.8vw,6rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-royal-deep">Tell us who&apos;s coming. We&apos;ll build from there.</h2>
            <p className="mt-6 max-w-md text-lg leading-7 text-stone">You do not need a perfect plan. Give Yolanda the starting point and she will help turn it into a cruise worth getting everybody together for.</p>
            <p className="mt-8 flex items-start gap-3 border-t border-ink/12 pt-5 text-sm leading-6 text-stone"><CalendarDays size={19} className="mt-0.5 shrink-0 text-emerald-mid" />After you submit, you can optionally schedule time with Yolanda right away.</p>
          </div>
          <GroupCruiseInquiryForm />
        </div>
      </section>

      <MobileCruiseCTA />
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function GroupCruiseHeroMinimal() {
  const reduceMotion = useReducedMotion()
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('group-cruise-hero-minimal')
    const form = document.getElementById('start-planning')
    if (!hero || !form) return

    const update = () => {
      const heroBottom = hero.getBoundingClientRect().bottom
      const formTop = form.getBoundingClientRect().top
      setShowSticky(heroBottom < 0 && formTop > window.innerHeight * 0.7)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <>
      <section id="group-cruise-hero-minimal" className="relative min-h-[94svh] overflow-hidden bg-[#082d27] text-white">
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

        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,32,27,.72) 0%, rgba(5,32,27,.30) 43%, rgba(5,32,27,.06) 72%, rgba(5,32,27,.14) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#06241f]/90 via-[#06241f]/18 to-transparent" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[94svh] max-w-[92rem] flex-col justify-end px-5 pb-10 pt-28 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16 xl:px-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[78rem]"
          >
            <h1 className="max-w-[22ch] font-serif text-[clamp(3.4rem,7vw,6.75rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
              <span className="block">Your people. <span className="text-coral">One</span></span>
              <span className="block text-coral">unforgettable cruise.</span>
            </h1>

            <Link
              href="#start-planning"
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              Start Planning Your Group Cruise <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showSticky ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 md:hidden"
          >
            <Link
              href="#start-planning"
              className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral px-5 py-3.5 text-sm font-black text-white shadow-[0_16px_50px_rgba(45,22,17,0.28)]"
            >
              Plan my group cruise <ArrowRight size={17} />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      <section id="group-cruise-hero-minimal" className="relative min-h-[94svh] overflow-hidden bg-[#082d27] text-white">
        <Image
          src="/images/about-with-travelers.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div
          className="group-hero-shade absolute inset-0"
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

            <p className="mt-6 max-w-2xl text-lg leading-7 text-white/90 sm:leading-8">
              Yolanda helps you choose the sailing, coordinate cabins, and give every guest a clear next step. A rough headcount is enough to start.
            </p>
            <div className="group-hero-actions mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="#start-planning"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Plan my group cruise <ArrowRight size={17} />
              </Link>
              <Link href="#group-process" className="inline-flex min-h-11 items-center justify-center text-base font-bold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                How it works
              </Link>
            </div>
            <p className="mt-4 text-lg leading-7 text-white/90">Personal planning support. No added planning fee.</p>
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
              className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-coral px-5 py-3.5 text-base font-black text-white shadow-[0_16px_50px_rgba(45,22,17,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Plan my group cruise <ArrowRight size={17} />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

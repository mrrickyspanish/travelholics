'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarCheck,
  ChevronDown, Compass, ExternalLink, Instagram, Linkedin, Mail,
  PlayCircle, ShoppingBag, Sparkles, type LucideIcon,
} from 'lucide-react';

export type LaunchIcon =
  | 'sparkles' | 'calendar' | 'services' | 'work' | 'instagram'
  | 'linkedin' | 'mail' | 'compass' | 'shop' | 'external';

export type LaunchPreviewItem = {
  title: string;
  description: string;
  href: string;
  tag?: string;
};

export type LaunchAction = {
  id: string;
  label: string;
  eyebrow: string;
  href?: string;
  icon: LaunchIcon;
  featured?: boolean;
  previewStyle?: 'list' | 'cards';
  previewItems?: LaunchPreviewItem[];
};

export type LaunchGatewayItem = {
  number: string;
  title: string;
  description: string;
  href: string;
};

export type LaunchSocial = {
  label: string;
  href: string;
  icon: LaunchIcon;
};

export type LaunchConfig = {
  brandName: string;
  logoSrc: string;
  logoAlt: string;
  eyebrow: string;
  headline: string;
  accentHeadline: string;
  description: string;
  enterLabel: string;
  footerLabel: string;
  transitionLabel: string;
  gatewayEyebrow: string;
  gatewayHeadline: string;
  gatewayAccentHeadline: string;
  gatewayDescription: string;
  accentColor: string;
  accentRgb: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  /**
   * Optional looping background video. When set it replaces the drifting
   * colour wash; when omitted the ambient gradient layer is used instead.
   */
  backgroundVideoSrc?: string;
  /** Poster frame shown while the video buffers, and wherever it can't play. */
  backgroundPosterSrc?: string;
  actions: LaunchAction[];
  socials: LaunchSocial[];
  gatewayItems: LaunchGatewayItem[];
};

const icons: Record<LaunchIcon, LucideIcon> = {
  sparkles: Sparkles,
  calendar: CalendarCheck,
  services: BriefcaseBusiness,
  work: PlayCircle,
  instagram: Instagram,
  linkedin: Linkedin,
  mail: Mail,
  compass: Compass,
  shop: ShoppingBag,
  external: ExternalLink,
};

export default function LaunchExperience({ config }: { config: LaunchConfig }) {
  const router = useRouter();
  const [panel, setPanel] = useState<string | null>(null);
  const [siteMode, setSiteMode] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroComplete(true), 1050);
    return () => window.clearTimeout(timer);
  }, []);

  const transitionTo = (href: string) => {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      window.location.assign(href);
      return;
    }
    setDestination(href);
    window.setTimeout(() => router.push(href), 720);
  };

  const variables = {
    '--launch-accent': config.accentColor,
    '--launch-accent-rgb': config.accentRgb,
    '--launch-secondary': config.secondaryColor,
    '--launch-bg': config.backgroundColor,
    '--launch-surface': config.surfaceColor,
  } as React.CSSProperties;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--launch-bg)] text-[#123B45]" style={variables}>
      <AmbientBackground
        videoSrc={config.backgroundVideoSrc}
        posterSrc={config.backgroundPosterSrc}
      />
      <AnimatePresence>
        {!introComplete && (
          <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--launch-bg)]" exit={{ opacity: 0 }}>
            <motion.div className="h-24 w-24 rounded-full border border-[var(--launch-accent)]"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.35, 1], opacity: [0, 1, 0.6] }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!siteMode ? (
          <motion.section key="launch"
            className="relative z-10 mx-auto flex min-h-screen w-full max-w-[500px] flex-col px-4 py-6 sm:px-6 sm:py-10"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}>
            <motion.button layoutId="launch-gateway" type="button" onClick={() => setSiteMode(true)}
              className="relative mb-4 overflow-hidden rounded-[30px] border border-[#E5D2B3]/70 px-6 py-7 text-left shadow-[0_24px_60px_rgba(74,53,28,0.14)] backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--launch-surface) 90%, transparent)',
              }}
              whileTap={{ scale: 0.985 }}>
              <motion.div className="absolute inset-y-0 left-[-32%] w-[32%] bg-gradient-to-r from-transparent via-[#FFF8EA]/45 to-transparent"
                animate={{ x: ['0%', '420%'] }} transition={{ duration: 4.2, repeat: Infinity, repeatDelay: 1.5 }} />
              <div className="relative mx-auto h-[66px] w-[280px] max-w-full overflow-hidden rounded-2xl bg-[#087F83] shadow-sm">
                <Image
                  src={config.logoSrc}
                  alt={config.logoAlt}
                  fill
                  priority
                  className="scale-[1.7] object-cover object-center"
                  sizes="280px"
                />
              </div>
              <div className="relative mt-5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--launch-accent)]">{config.eyebrow}</p>
                <span aria-hidden="true" className="mx-auto mt-3 block h-[3px] w-9 rounded-full bg-coral" />
                <h1 className="mt-3 text-[2.05rem] font-semibold leading-[1.02] tracking-[-0.045em] text-[#123B45] sm:text-[2.3rem]">
                  {config.headline}
                  <span className="block font-normal text-[var(--launch-accent)]">{config.accentHeadline}</span>
                </h1>
                <p className="mx-auto mt-4 max-w-[35ch] text-sm leading-6 text-[#315862]">{config.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--launch-accent)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.17em] text-white shadow-lg">
                  {config.enterLabel}
                  <motion.span className="text-coral" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={15} />
                  </motion.span>
                </span>
              </div>
            </motion.button>

            <div className="space-y-3">
              {config.actions.map((action) => {
                const Icon = icons[action.icon];
                const open = panel === action.id;
                if (!action.previewItems?.length) {
                  return (
                    <motion.button key={action.id} type="button" onClick={() => action.href && transitionTo(action.href)}
                      className={`flex min-h-[78px] w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left shadow-[0_12px_34px_rgba(74,53,28,0.09)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${action.featured ? 'border-[var(--launch-accent)] bg-[var(--launch-accent)] text-white' : 'border-[#E5D2B3]/65 bg-[#F4E8D5]/84 text-[#123B45]'}`}
                      whileTap={{ scale: 0.975 }}>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.featured ? 'bg-white/15' : 'bg-[#FDFCF9]/85 text-[var(--launch-accent)]'}`}><Icon size={21} /></span>
                      <span className="flex-1">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">{action.eyebrow}</span>
                        <span className="mt-1 block text-[15px] font-semibold">{action.label}</span>
                      </span>
                      <ArrowUpRight className={action.featured ? undefined : 'text-coral'} size={19} />
                    </motion.button>
                  );
                }
                return (
                  <motion.div key={action.id} layout className="overflow-hidden rounded-2xl border border-[#E5D2B3]/65 bg-[#F4E8D5]/84 text-[#123B45] shadow-[0_12px_34px_rgba(74,53,28,0.09)] backdrop-blur-xl">
                    <button type="button" onClick={() => setPanel(open ? null : action.id)} className="flex min-h-[78px] w-full items-center gap-4 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-coral">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDFCF9]/85 text-[var(--launch-accent)]"><Icon size={21} /></span>
                      <span className="flex-1">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#55737A]">{action.eyebrow}</span>
                        <span className="mt-1 block text-[15px] font-semibold">{action.label}</span>
                      </span>
                      <motion.span className={open ? 'text-coral' : 'text-[#315862]'} animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={19} /></motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          <div className={action.previewStyle === 'cards' ? 'grid gap-2 p-3 pt-0 sm:grid-cols-3' : 'grid gap-2 p-3 pt-0'}>
                            {action.previewItems.map((item, index) => (
                              <motion.button key={item.title} type="button" onClick={() => transitionTo(item.href)}
                                className="relative rounded-xl border border-[#DCC5A2]/40 bg-[#FDFCF9]/90 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                                <span className="block text-sm font-semibold">{item.title}</span>
                                <span className="mt-1 block text-xs leading-5 text-[#55737A]">{item.description}</span>
                                <ArrowUpRight className="absolute bottom-3 right-3 text-coral" size={16} />
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {config.socials.map((item) => {
                const Icon = icons[item.icon];
                return (
                  <motion.a key={item.label} href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex min-h-[66px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#E5D2B3]/65 bg-[#F4E8D5]/82 text-xs text-[#315862] shadow-[0_10px_28px_rgba(74,53,28,0.07)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                    whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}>
                    <Icon size={18} />{item.label}
                  </motion.a>
                );
              })}
            </div>
            <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55737A]">{config.footerLabel}</p>
          </motion.section>
        ) : (
          <motion.section key="site" className="relative z-20 flex min-h-screen flex-col bg-[var(--launch-bg)] text-[#123B45]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.header layoutId="launch-gateway" className="border-b border-[#DCC5A2]/40 bg-[var(--launch-surface)] px-5 pb-10 pt-6 sm:px-10 sm:pb-14">
              <div className="mx-auto max-w-6xl">
                <button type="button" onClick={() => setSiteMode(false)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[#DCC5A2]/55 bg-[#FDFCF9] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#315862] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral">
                  <ArrowLeft className="text-coral" size={15} /> Back to Launch
                </button>
                <div className="mt-14 max-w-3xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--launch-accent)]">{config.gatewayEyebrow}</p>
                  <h2 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#123B45] sm:text-7xl">
                    {config.gatewayHeadline}
                    <span className="block font-normal text-[var(--launch-accent)]">{config.gatewayAccentHeadline}</span>
                  </h2>
                  <p className="mt-6 max-w-2xl text-base leading-7 text-[#55737A] sm:text-lg">{config.gatewayDescription}</p>
                </div>
              </div>
            </motion.header>
            <div className="mx-auto grid w-full max-w-6xl flex-1 gap-4 px-4 py-5 sm:grid-cols-2 sm:px-8 sm:py-8">
              {config.gatewayItems.map((item) => (
                <motion.button key={item.number} type="button" onClick={() => transitionTo(item.href)}
                  className="relative min-h-60 rounded-[26px] border border-[#E5D2B3]/65 bg-[#F4E8D5]/88 p-6 text-left shadow-[0_18px_50px_rgba(74,53,28,0.09)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                  whileHover={{ y: -6 }} whileTap={{ scale: 0.985 }}>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--launch-accent)]">{item.number}</span>
                  <h3 className="mt-8 text-3xl font-semibold leading-none">{item.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#55737A]">{item.description}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--launch-accent)]">Continue <ArrowRight className="text-coral" size={15} /></span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {destination && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--launch-bg)]"
            initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 0.62 }}>
            <div className="text-center">
              <motion.div className="mx-auto h-3 w-3 rounded-full bg-coral" animate={{ scale: [1, 5, 1] }} />
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--launch-accent)]">{config.transitionLabel}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/**
 * Background layer. With a video source it plays the brand's hero footage under
 * a minimal shoreline scrim that preserves the water and only settles into the
 * page neutral near the bottom. Without video it falls back to a warm ambient wash.
 */
function AmbientBackground({
  videoSrc,
  posterSrc,
}: {
  videoSrc?: string;
  posterSrc?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [videoSrc]);

  if (videoSrc) {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(8,79,88,0.06) 0%, rgba(39,170,172,0.02) 24%, transparent 58%, rgba(253,252,249,0.30) 84%, var(--launch-bg) 100%)',
          }} />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden bg-[var(--launch-bg)]">
      <motion.div
        className="absolute -left-[30%] top-[-14%] h-[54rem] w-[54rem] rounded-full blur-[105px]"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--launch-accent-rgb), 0.18) 0%, rgba(var(--launch-accent-rgb), 0) 70%)',
        }}
        animate={{ x: ['0%', '35%', '5%'], y: ['0%', '18%', '4%'], scale: [1, 1.14, 1] }}
        transition={{ duration: 14, repeat: Infinity }} />

      <motion.div
        className="absolute -right-[40%] bottom-[-20%] h-[50rem] w-[50rem] rounded-full opacity-40 blur-[115px]"
        style={{
          background: 'radial-gradient(circle, #E9D0A8 0%, transparent 70%)',
        }}
        animate={{ x: ['0%', '-30%', '-8%'], y: ['0%', '-24%', '-4%'] }}
        transition={{ duration: 17, repeat: Infinity }} />

      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8EA]/20 via-transparent to-[#F4E8D5]/55" />
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { track } from '@vercel/analytics';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Compass,
  Mail,
  MessageSquare,
  PlayCircle,
  Ship,
  ShoppingBag,
  Instagram,
  type LucideIcon,
} from 'lucide-react';
import { useLiveStatus } from '@/hooks/useLiveStatus';
import { TIKTOK_LIVE_URL } from '@/lib/liveSchedule';
import wordmarkStyles from '@/components/travelholics-wordmark.module.css';

export type LaunchIcon =
  | 'compass'
  | 'ship'
  | 'video'
  | 'guides'
  | 'shop'
  | 'mail'
  | 'message'
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'facebook';

export type LaunchPreviewItem = {
  title: string;
  description: string;
  href: string;
  /** Small chip above the title — e.g. "Most booked", "Free". */
  tag?: string;
};

export type LaunchAction = {
  id: string;
  label: string;
  eyebrow: string;
  /** Direct-navigation actions set href. Actions with previewItems expand instead. */
  href?: string;
  icon: LaunchIcon;
  featured?: boolean;
  previewItems?: LaunchPreviewItem[];
  /** Link rendered at the bottom of an expanded panel — "See all guides". */
  previewFooter?: { label: string; href: string };
  /** Fine print inside an expanded panel, e.g. affiliate disclosure. */
  note?: string;
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
  /** Host portrait shown in the hero card — the trust signal for bio-link traffic. */
  portraitSrc: string;
  portraitAlt: string;
  hostName: string;
  hostTitle: string;
  eyebrow: string;
  headline: string;
  accentHeadline: string;
  description: string;
  /** Primary CTA — sends the visitor into the full site. */
  enterLabel: string;
  enterHref: string;
  transitionLabel: string;
  /** Where the live rail points when Yolanda is not currently on TikTok Live. */
  liveScheduleHref: string;
  footerNote: string;
  footerLinks: { label: string; href: string }[];
  accentColor: string;
  accentRgb: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  backgroundVideoSrc?: string;
  backgroundPosterSrc?: string;
  actions: LaunchAction[];
  socials: LaunchSocial[];
};

/**
 * Glass levels. These used to live in app/go/go-visibility.module.css as
 * `!important` overrides keyed off DOM structure (`section > button:first-of-type
 * + div > button:first-child`), which silently detached from the design the
 * moment this component's markup moved. They are ordinary values now.
 */
const SURFACE = {
  hero: 'color-mix(in srgb, var(--launch-surface) 76%, transparent)',
  featured: 'color-mix(in srgb, var(--launch-accent) 86%, transparent)',
  action: 'rgb(244 232 213 / 70%)',
  panel: 'rgb(244 232 213 / 72%)',
  social: 'rgb(244 232 213 / 68%)',
  item: 'rgb(253 252 249 / 86%)',
} as const;

const lucideIcons: Partial<Record<LaunchIcon, LucideIcon>> = {
  compass: Compass,
  ship: Ship,
  video: PlayCircle,
  guides: BookOpen,
  shop: ShoppingBag,
  mail: Mail,
  message: MessageSquare,
  instagram: Instagram,
};

/* Brand marks lucide does not ship. Paths match components/footer.tsx. */
function TikTokMark({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
    </svg>
  );
}

function FacebookMark({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function YouTubeMark({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
    </svg>
  );
}

function LaunchIconGlyph({ name, size = 20 }: { name: LaunchIcon; size?: number }) {
  if (name === 'tiktok') return <TikTokMark size={size} />;
  if (name === 'facebook') return <FacebookMark size={size} />;
  if (name === 'youtube') return <YouTubeMark size={size} />;
  const Glyph = lucideIcons[name] ?? Compass;
  return <Glyph size={size} aria-hidden="true" />;
}

const isExternal = (href: string) =>
  /^(https?:|mailto:|tel:|sms:)/.test(href);

/** False during SSR and on the hydrating render, true from then on. */
const noopSubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export default function LaunchExperience({ config }: { config: LaunchConfig }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const live = useLiveStatus();
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);
  const navTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (navTimer.current !== null) window.clearTimeout(navTimer.current);
    },
    [],
  );

  /**
   * Every outbound tap from /go runs through here so the destination is
   * recorded once and internal navigation gets the wipe transition. Modified
   * clicks (new tab, middle click) are left alone by the callers.
   */
  const navigate = useCallback(
    (id: string, href: string) => {
      track('go_exit', { id, href });

      if (isExternal(href)) {
        window.location.assign(href);
        return;
      }

      // A second tap while the wipe is running would queue a duplicate push.
      if (leaving) return;

      setLeaving(href);
      navTimer.current = window.setTimeout(
        () => router.push(href),
        reduceMotion ? 0 : 620,
      );
    },
    [leaving, reduceMotion, router],
  );

  const variables = {
    '--launch-accent': config.accentColor,
    '--launch-accent-rgb': config.accentRgb,
    '--launch-secondary': config.secondaryColor,
    '--launch-bg': config.backgroundColor,
    '--launch-surface': config.surfaceColor,
  } as React.CSSProperties;

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[var(--launch-bg)] text-ink"
      style={variables}
    >
      <AmbientBackground
        videoSrc={config.backgroundVideoSrc}
        posterSrc={config.backgroundPosterSrc}
        reduceMotion={Boolean(reduceMotion)}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[34rem] flex-col px-4 py-7 sm:px-6 sm:py-12 lg:max-w-6xl lg:flex-row lg:items-start lg:gap-10 lg:py-16 xl:gap-14">
        {/* Brand card — sticky beside the link stack once there is room for two columns. */}
        <motion.section
          className="lg:sticky lg:top-16 lg:w-[46%] lg:shrink-0"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="relative overflow-hidden rounded-[2rem] border border-[#E5D2B3]/60 px-6 py-8 text-center shadow-[0_24px_60px_rgba(74,53,28,0.13)] backdrop-blur-2xl sm:px-8 sm:py-10"
            style={{ backgroundColor: SURFACE.hero }}
          >
            {/* Always in the tree — framer's useReducedMotion resolves on the
                client's first render, so conditionally *rendering* this would
                mismatch the server HTML. Only the animation is gated. */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-[-32%] w-[32%] bg-gradient-to-r from-transparent via-[#FFF8EA]/36 to-transparent"
              animate={reduceMotion ? undefined : { x: ['0%', '420%'] }}
              transition={{ duration: 4.2, repeat: Infinity, repeatDelay: 1.5 }}
            />

            <Link
              href="/"
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                event.preventDefault();
                navigate('wordmark', '/');
              }}
              className="relative mx-auto block w-[15rem] max-w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
              aria-label={`${config.brandName} home`}
            >
              <span className={`${wordmarkStyles.frame} w-full`}>
                <Image
                  src={config.logoSrc}
                  alt={config.logoAlt}
                  fill
                  priority
                  className={`${wordmarkStyles.source} ${wordmarkStyles.teal}`}
                  sizes="240px"
                />
              </span>
            </Link>

            <div className="relative mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--launch-accent)]">
                {config.eyebrow}
              </p>
              <span
                aria-hidden="true"
                className="mx-auto mt-3 block h-[3px] w-9 rounded-full bg-coral"
              />
              <h1 className="mt-4 font-serif text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-ink sm:text-[2.6rem]">
                {config.headline}
                <span className="block font-normal text-[var(--launch-accent)]">
                  {config.accentHeadline}
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-[36ch] type-body text-ink/72">
                {config.description}
              </p>

              {/* Who is behind the account — the audit's "face of the brand" ask. */}
              <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-[#DCC5A2]/50 bg-[#FDFCF9]/70 py-1.5 pl-1.5 pr-4 backdrop-blur-lg">
                <Image
                  src={config.portraitSrc}
                  alt={config.portraitAlt}
                  width={80}
                  height={80}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="text-left leading-tight">
                  <span className="block text-sm font-bold text-ink">
                    {config.hostName}
                  </span>
                  <span className="block text-xs font-semibold text-ink/60">
                    {config.hostTitle}
                  </span>
                </span>
              </div>

              <Link
                href={config.enterHref}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                  event.preventDefault();
                  navigate('enter-site', config.enterHref);
                }}
                className="mt-7 inline-flex min-h-[3rem] items-center gap-2 rounded-full bg-[var(--launch-accent)] px-7 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
              >
                {config.enterLabel}
                <motion.span
                  className="text-coral"
                  animate={reduceMotion ? undefined : { x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </motion.span>
              </Link>
            </div>
          </div>

          <LiveRail
            live={live}
            scheduleHref={config.liveScheduleHref}
            reduceMotion={Boolean(reduceMotion)}
            onNavigate={navigate}
          />
        </motion.section>

        {/* Link stack */}
        <div className="mt-4 flex-1 lg:mt-0">
          <h2 className="sr-only">Travelholics links</h2>
          <div className="space-y-3">
            {config.actions.map((action) => (
              <ActionRow
                key={action.id}
                action={action}
                open={openPanel === action.id}
                reduceMotion={Boolean(reduceMotion)}
                onToggle={() =>
                  setOpenPanel((current) =>
                    current === action.id ? null : action.id,
                  )
                }
                onNavigate={navigate}
              />
            ))}
          </div>

          <nav aria-label="Follow Travelholics" className="mt-4 grid grid-cols-3 gap-2">
            {config.socials.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                onClick={() => track('go_exit', { id: `social-${item.label}`, href: item.href })}
                className="flex min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#E5D2B3]/55 text-sm font-semibold text-ink/72 shadow-[0_10px_28px_rgba(74,53,28,0.07)] backdrop-blur-xl transition-colors hover:text-[var(--launch-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                style={{ backgroundColor: SURFACE.social }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
              >
                <LaunchIconGlyph name={item.icon} size={19} />
                {item.label}
              </motion.a>
            ))}
          </nav>

          <footer className="mt-7 text-center">
            <p className="type-caption text-ink/55">
              © {new Date().getFullYear()} {config.footerNote}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {config.footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="type-caption font-semibold text-ink/45 underline-offset-4 transition-colors hover:text-[var(--launch-accent)] hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {leaving && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--launch-bg)]"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(100% 0 0 0)' }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: reduceMotion ? 0.15 : 0.62 }}
            role="status"
            aria-live="polite"
          >
            <div className="text-center">
              <motion.div
                className="mx-auto h-3 w-3 rounded-full bg-coral"
                animate={reduceMotion ? undefined : { scale: [1, 5, 1] }}
              />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-[var(--launch-accent)]">
                {config.transitionLabel}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/**
 * TikTok Live is the reason most of this page's traffic exists, so the rail
 * always says something: on air now, starting shortly, or when to come back.
 * `useLiveStatus` returns null until mount (the server cannot know the
 * visitor's clock), and the placeholder keeps the layout from shifting.
 */
function LiveRail({
  live,
  scheduleHref,
  reduceMotion,
  onNavigate,
}: {
  live: ReturnType<typeof useLiveStatus>;
  scheduleHref: string;
  reduceMotion: boolean;
  onNavigate: (id: string, href: string) => void;
}) {
  if (!live) {
    return <div className="mt-3 h-[3.75rem]" aria-hidden="true" />;
  }

  const isLive = live.state === 'live';
  const isSoon = live.state === 'soon';
  const href = isLive ? TIKTOK_LIVE_URL : scheduleHref;

  const eyebrow = isLive
    ? 'Live now on TikTok'
    : isSoon
      ? `Live in ${live.minutesUntilNext} min`
      : 'Next live on TikTok';

  const detail = isLive
    ? (live.show?.name ?? 'Tap in')
    : `${live.nextShow.name} · ${live.nextShow.timeLabel}`;

  const shell = isLive
    ? 'border-coral bg-coral text-white'
    : isSoon
      ? 'border-ink bg-ink text-white'
      : 'border-[#E5D2B3]/55 text-ink';

  const content = (
    <>
      <span
        className={`relative flex h-2.5 w-2.5 shrink-0 ${isLive ? 'text-white' : 'text-coral'}`}
        aria-hidden="true"
      >
        {isLive && !reduceMotion && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70" />
        )}
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
      </span>
      <span className="flex-1 text-left leading-tight">
        <span
          className={`block text-xs font-bold uppercase tracking-[0.14em] ${
            isLive || isSoon ? 'text-white/75' : 'text-ink/55'
          }`}
        >
          {eyebrow}
        </span>
        <span className="mt-0.5 block text-sm font-bold">{detail}</span>
      </span>
      <ArrowUpRight
        size={18}
        className={isLive || isSoon ? 'text-white' : 'text-coral'}
        aria-hidden="true"
      />
    </>
  );

  const className = `mt-3 flex min-h-[3.75rem] w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_34px_rgba(74,53,28,0.09)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 ${shell}`;

  if (isLive) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={() => track('go_exit', { id: 'live-now', href })}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        onNavigate('live-schedule', href);
      }}
      className={className}
      style={isSoon ? undefined : { backgroundColor: SURFACE.action }}
    >
      {content}
    </Link>
  );
}

function ActionRow({
  action,
  open,
  reduceMotion,
  onToggle,
  onNavigate,
}: {
  action: LaunchAction;
  open: boolean;
  reduceMotion: boolean;
  onToggle: () => void;
  onNavigate: (id: string, href: string) => void;
}) {
  const rowInner = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          action.featured ? 'bg-white/15' : 'bg-[#FDFCF9]/78 text-[var(--launch-accent)]'
        }`}
        aria-hidden="true"
      >
        <LaunchIconGlyph name={action.icon} size={21} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-xs font-bold uppercase tracking-[0.12em] ${
            action.featured ? 'text-white/70' : 'text-ink/55'
          }`}
        >
          {action.eyebrow}
        </span>
        <span className="mt-1 block text-base font-bold leading-snug">
          {action.label}
        </span>
      </span>
    </>
  );

  const rowClass =
    'flex min-h-[5rem] w-full items-center gap-4 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-coral';

  if (!action.previewItems?.length) {
    return (
      <motion.div whileTap={reduceMotion ? undefined : { scale: 0.985 }}>
        <Link
          href={action.href ?? '/'}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey) return;
            event.preventDefault();
            onNavigate(action.id, action.href ?? '/');
          }}
          className={`${rowClass} rounded-2xl border shadow-[0_12px_34px_rgba(74,53,28,0.09)] backdrop-blur-xl transition-transform hover:-translate-y-0.5 ${
            action.featured
              ? 'border-[var(--launch-accent)] text-white'
              : 'border-[#E5D2B3]/55 text-ink'
          }`}
          style={{
            backgroundColor: action.featured ? SURFACE.featured : SURFACE.action,
          }}
        >
          {rowInner}
          <ArrowUpRight
            className={action.featured ? 'text-white' : 'text-coral'}
            size={20}
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    );
  }

  const panelId = `launch-panel-${action.id}`;

  return (
    <motion.div
      layout={reduceMotion ? false : true}
      className="overflow-hidden rounded-2xl border border-[#E5D2B3]/55 text-ink shadow-[0_12px_34px_rgba(74,53,28,0.09)] backdrop-blur-xl"
      style={{ backgroundColor: SURFACE.panel }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={rowClass}
      >
        {rowInner}
        <motion.span
          className={open ? 'text-coral' : 'text-ink/60'}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          aria-hidden="true"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
          >
            <div className="grid gap-2 p-3 pt-0">
              {action.previewItems.map((item, index) => (
                <motion.div
                  key={item.href + item.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.06 }}
                >
                  <Link
                    href={item.href}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                      event.preventDefault();
                      onNavigate(`${action.id}:${item.title}`, item.href);
                    }}
                    className="relative flex items-center gap-3 rounded-xl border border-[#DCC5A2]/35 p-3.5 pr-11 text-left backdrop-blur-lg transition-colors hover:border-[var(--launch-accent)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                    style={{ backgroundColor: SURFACE.item }}
                  >
                    <span className="min-w-0">
                      {item.tag && (
                        <span className="mb-1.5 inline-block rounded-full bg-[var(--launch-accent)]/12 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--launch-accent)]">
                          {item.tag}
                        </span>
                      )}
                      <span className="block text-base font-bold leading-snug">
                        {item.title}
                      </span>
                      <span className="mt-1 block type-caption text-ink/60">
                        {item.description}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-coral"
                      size={17}
                      aria-hidden="true"
                    />
                  </Link>
                </motion.div>
              ))}

              {action.previewFooter && (
                <Link
                  href={action.previewFooter.href}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                    event.preventDefault();
                    onNavigate(`${action.id}:all`, action.previewFooter!.href);
                  }}
                  className="mt-0.5 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold uppercase tracking-[0.1em] text-[var(--launch-accent)] transition-colors hover:bg-[var(--launch-accent)]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                >
                  {action.previewFooter.label}
                  <ArrowRight size={15} className="text-coral" aria-hidden="true" />
                </Link>
              )}

              {action.note && (
                <p className="px-1 pb-0.5 type-caption text-ink/45">{action.note}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * The still shoreline frame is always the base layer: it is what renders on
 * the server, what a reduced-motion visitor keeps, and what shows through if
 * the remote clip fails. The video mounts on top only after hydration —
 * rendering it during SSR and then swapping it for the poster is a hydration
 * mismatch, and deferring it keeps a ~2 MB request off the critical path.
 */
function AmbientBackground({
  videoSrc,
  posterSrc,
  reduceMotion,
}: {
  videoSrc?: string;
  posterSrc?: string;
  reduceMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isClient = useIsClient();
  const [videoReady, setVideoReady] = useState(false);

  const showVideo = isClient && Boolean(videoSrc) && !reduceMotion;

  useEffect(() => {
    if (!showVideo) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [showVideo, videoSrc]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {posterSrc ? (
        <Image
          src={posterSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-72"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8EA]/20 via-transparent to-[#F4E8D5]/55" />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full scale-[1.02] object-cover object-center transition-opacity duration-700 ${
            videoReady ? 'opacity-72' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          onPlaying={() => setVideoReady(true)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(8,79,88,0.045) 0%, rgba(39,170,172,0.015) 24%, transparent 60%, rgba(253,252,249,0.24) 86%, var(--launch-bg) 100%)',
        }}
      />
    </div>
  );
}

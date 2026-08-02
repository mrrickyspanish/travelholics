'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { isOwnerEmail } from '@/lib/admin-auth'
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  BookOpen,
  Map,
  ShoppingBag,
  KeyRound,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/planner', label: 'Content Planner', icon: ClipboardList },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/encyclopedia', label: 'Encyclopedia', icon: BookOpen },
  { href: '/admin/trip-pages', label: 'Trip Pages', icon: Map },
  { href: '/admin/shop', label: 'Shop', icon: ShoppingBag },
]

// Owner-only. The page and its API endpoint re-check this on the server.
const OWNER_NAV_ITEMS: NavItem[] = [
  { href: '/admin/access', label: 'Admin Access', icon: KeyRound },
]

function Logo() {
  return (
    <Link href="/admin" className="block">
      <Image
        src="/images/Traveholic_logo_wordmark_white.png"
        alt="Travelholics"
        width={140}
        height={32}
        className="h-7 w-auto object-contain lg:h-8"
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
          ;(e.target as HTMLImageElement).parentElement!.insertAdjacentHTML(
            'beforeend',
            '<span class="text-white font-semibold text-sm">Travelholics</span>'
          )
        }}
      />
    </Link>
  )
}

export default function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [confirmSignOut, setConfirmSignOut] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navItems = useMemo(
    () => (isOwnerEmail(userEmail) ? [...NAV_ITEMS, ...OWNER_NAV_ITEMS] : NAV_ITEMS),
    [userEmail]
  )

  // Close the drawer whenever navigation happens
  useEffect(() => {
    setDrawerOpen(false)
    setConfirmSignOut(false)
  }, [pathname])

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  async function handleSignOut() {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const currentSection =
    navItems.find(({ href, exact }) => isActive(href, exact))?.label ?? 'Admin'

  const sidebarContent = (
    <>
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 lg:py-2.5 text-[15px] lg:text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? 'bg-[#10755A] text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white active:bg-white/10'
            }`}
          >
            <Icon size={18} className="shrink-0" />
            {label}
          </Link>
        ))}

        <a
          href="https://yotravelholic.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-3 lg:py-2.5 text-[15px] lg:text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors mt-4"
        >
          <ExternalLink size={18} className="shrink-0" />
          View Site
        </a>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="truncate text-xs text-white/40 mb-3">{userEmail}</p>
        {confirmSignOut ? (
          <div className="space-y-1.5">
            <p className="text-xs text-white/60 mb-2">Sure?</p>
            <button
              onClick={handleSignOut}
              className="w-full rounded-md bg-red-600/80 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 transition-colors"
            >
              Yes, sign out
            </button>
            <button
              onClick={() => setConfirmSignOut(false)}
              className="w-full rounded-md px-3 py-2 text-xs font-medium text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmSignOut(true)}
            className="flex w-full items-center gap-2 rounded-md py-1 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        )}
      </div>
    </>
  )

  return (
    <div className="admin-shell flex h-dvh flex-col overflow-hidden bg-[#0f1f1b] lg:flex-row">
      {/* Mobile top bar */}
      <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[#0b1812] px-2 pt-[env(safe-area-inset-top)] lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="rounded-lg p-2.5 text-white/70 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="pointer-events-none absolute inset-x-14 top-[env(safe-area-inset-top)] flex h-14 items-center justify-center">
          <span className="truncate text-[15px] font-semibold text-white">{currentSection}</span>
        </div>
        <a
          href="https://yotravelholic.com"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg p-2.5 text-white/50 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors"
          aria-label="View site"
        >
          <ExternalLink size={19} />
        </a>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-[#0b1812] border-r border-white/5 lg:flex">
        <div className="flex h-16 items-center px-5 border-b border-white/5">
          <Logo />
        </div>
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-[#0b1812] shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-4 pt-[env(safe-area-inset-top)]">
              <Logo />
              <button
                onClick={() => setDrawerOpen(false)}
                className="-mr-2 rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-white">
        {children}
      </main>
    </div>
  )
}

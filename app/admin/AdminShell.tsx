'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  ShoppingBag,
  ExternalLink,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/encyclopedia', label: 'Encyclopedia', icon: BookOpen },
  { href: '/admin/shop', label: 'Shop', icon: ShoppingBag },
]

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

  async function handleSignOut() {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1f1b]">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col bg-[#0b1812] border-r border-white/5">
        {/* Logo */}
        <div className="flex h-16 items-center px-5 border-b border-white/5">
          <Link href="/admin" className="block">
            <Image
              src="/images/Traveholic_logo_wordmark_white.png"
              alt="Travelholics"
              width={140}
              height={32}
              className="h-8 w-auto object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
                ;(e.target as HTMLImageElement).parentElement!.insertAdjacentHTML(
                  'beforeend',
                  '<span class="text-white font-semibold text-sm">Travelholics</span>'
                )
              }}
            />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? 'bg-[#10755A] text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}

          <a
            href="https://yotravelholic.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors mt-4"
          >
            <ExternalLink size={17} />
            View Site
          </a>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 px-4 py-4">
          <p className="truncate text-xs text-white/40 mb-3">{userEmail}</p>
          {confirmSignOut ? (
            <div className="space-y-1.5">
              <p className="text-xs text-white/60 mb-2">Sure?</p>
              <button
                onClick={handleSignOut}
                className="w-full rounded-md bg-red-600/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors"
              >
                Yes, sign out
              </button>
              <button
                onClick={() => setConfirmSignOut(false)}
                className="w-full rounded-md px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmSignOut(true)}
              className="flex w-full items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-white">{children}</main>
    </div>
  )
}

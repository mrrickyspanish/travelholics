import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import GroupCruiseHeroMinimal from '@/components/group-cruise-hero-minimal'
import GroupCruiseStory from '@/components/group-cruise-story'
import { CruiseLineStrip } from '@/components/cruise-line-strip'
import '../mobile-polish.css'

export const metadata: Metadata = {
  title: 'Group Cruises with Yolanda',
  description: 'Plan a group cruise with Yolanda Harris. Compare sailings, coordinate cabins, and give every guest a clear next step with no added planning fee.',
  alternates: { canonical: '/group-cruises' },
  openGraph: {
    title: 'Group Cruise Planning with Yolanda | Travelholics',
    description: 'Bring your people. Yolanda helps with the sailing, cabins, and booking details, with no added planning fee.',
    url: '/group-cruises',
    type: 'website',
  },
}

export default function GroupCruisesPage() {
  return (
    <>
      <Header />
      <main className="group-cruise-mobile-optimized overflow-x-clip bg-[#f4efe4] text-ink">
        <GroupCruiseHeroMinimal />
        <CruiseLineStrip />
        <GroupCruiseStory />
      </main>
      <Footer />
    </>
  )
}

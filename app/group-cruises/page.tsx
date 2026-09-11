import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import GroupCruiseHeroMinimal from '@/components/group-cruise-hero-minimal'
import GroupCruiseStory from '@/components/group-cruise-story'
import { CruiseLineStrip } from '@/components/cruise-line-strip'
import '../mobile-polish.css'

export const metadata: Metadata = {
  title: 'Group Cruises with Yolanda',
  description: 'Plan an unforgettable group cruise with Yolanda and Travelholics. From the first idea to a personalized trip hub, your group gets one organized, fun experience.',
  alternates: { canonical: '/group-cruises' },
}

export default function GroupCruisesPage() {
  return (
    <>
      <Header />
      <GroupCruiseHeroMinimal />
      <CruiseLineStrip />
      <div className="group-cruise-story-restraint group-cruise-mobile-optimized">
        <style>{`.group-cruise-story-restraint #group-cruise-hero { display: none; }`}</style>
        <GroupCruiseStory />
      </div>
      <Footer />
    </>
  )
}

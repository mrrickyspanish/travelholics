import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import GroupCruiseStory from '@/components/group-cruise-story'

export const metadata: Metadata = {
  title: 'Group Cruises with Yolanda',
  description: 'Plan an unforgettable group cruise with Yolanda and Travelholics. From the first idea to a personalized trip hub, your group gets one organized, fun experience.',
  alternates: { canonical: '/group-cruises' },
}

export default function GroupCruisesPage() {
  return (
    <>
      <Header />
      <GroupCruiseStory />
      <Footer />
    </>
  )
}

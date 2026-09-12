import { redirect } from 'next/navigation'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import GroupTripWizard, { type GroupTripInquiryPrefill } from './GroupTripWizard'

export default async function NewGroupTripPage({ searchParams }: { searchParams: Promise<{ inquiry?: string }> }) {
  const { inquiry } = await searchParams
  let initialInquiry: GroupTripInquiryPrefill | null = null

  if (inquiry) {
    const supabase = createSupabaseAdmin()
    const { data } = await supabase
      .from('group_cruise_inquiries')
      .select('id,status,leader_name,email,phone,group_type,estimated_group_size,destination,preferred_dates,cruise_line,ship,sailing_date,converted_trip_id')
      .eq('id', inquiry)
      .maybeSingle()

    if (!data) redirect('/admin/group-trips')
    if (data.converted_trip_id) redirect(`/admin/group-trips/${data.converted_trip_id}`)
    if (data.status === 'closed_lost') redirect(`/admin/group-trips?inquiry=${data.id}`)
    initialInquiry = data as GroupTripInquiryPrefill
  }

  return <GroupTripWizard initialInquiry={initialInquiry} />
}

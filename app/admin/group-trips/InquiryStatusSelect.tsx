'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { INQUIRY_STATUSES, type InquiryStatus } from '@/types/group-trips'

const labels: Record<InquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  planning: 'Planning',
  confirmed: 'Confirmed',
  closed_lost: 'Closed / Lost',
}

export default function InquiryStatusSelect({ inquiryId, initialStatus }: { inquiryId: string; initialStatus: InquiryStatus }) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [busy, setBusy] = useState(false)

  async function change(next: InquiryStatus) {
    const previous = status
    setStatus(next)
    setBusy(true)
    const response = await fetch(`/api/admin/group-cruise-inquiries/${inquiryId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }),
    })
    if (!response.ok) {
      setStatus(previous)
    } else {
      router.refresh()
    }
    setBusy(false)
  }

  return <select aria-label="Inquiry status" disabled={busy} value={status} onChange={(e) => change(e.target.value as InquiryStatus)} className="rounded-xl border border-[#dce4e0] bg-white px-3 py-2 text-xs font-bold text-[#31453e] outline-none focus:border-[#10755A] disabled:opacity-50">{INQUIRY_STATUSES.map((value) => <option key={value} value={value}>{labels[value]}</option>)}</select>
}

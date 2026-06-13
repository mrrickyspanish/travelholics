import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function AdminShopPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Shop</h1>
      <p className="text-gray-500 text-sm mb-6">Travelholics merch management</p>
      <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm mb-4">Shop admin coming in the next phase.</p>
        <a
          href="/shop"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#10755A] font-medium hover:underline"
        >
          <ExternalLink size={14} />
          View live shop
        </a>
      </div>
    </div>
  )
}

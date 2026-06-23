'use client'

import { useRef, useState, type DragEvent } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { ImagePlus, Loader2, X } from 'lucide-react'

const BUCKET = 'article-covers'

interface Props {
  value: string
  onChange: (url: string) => void
  alt?: string
}

export function CoverImageUploader({ value, onChange, alt }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('That file isn’t an image — try a JPG, PNG, or WEBP.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const supabase = createBrowserSupabase()
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed — try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  if (value) {
    return (
      <div className="inline-block relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt={alt || 'Cover preview'}
          className="h-32 w-48 rounded-lg object-cover border border-gray-200"
        />
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Remove cover image"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex h-32 w-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 text-center text-sm transition-colors ${
          dragOver ? 'border-[#10755A] bg-emerald-50' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        {uploading ? (
          <Loader2 size={20} className="animate-spin text-gray-400" />
        ) : (
          <>
            <ImagePlus size={20} className="text-gray-400" />
            <span className="text-gray-500">Drop image here or click to browse</span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) uploadFile(file)
          e.target.value = ''
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

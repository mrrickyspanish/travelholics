"use client"

import { useEffect, useRef, useState } from 'react'
import { EditorContent, type JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { ImagePlus, Link2, List, ListOrdered, Minus, Quote, Video, Bold, Italic, Heading2, Heading3 } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { ArticleImage, ArticleVideo } from '@/lib/tiptap/travel-media'

type Props = {
  value: JSONContent
  onChange: (value: JSONContent) => void
}

const BUCKET = 'article-covers'

function Button({ title, active, onClick, children }: { title: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition-colors ${active ? 'bg-[#10755A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )
}

export default function TravelArticleEditor({ value, onChange }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<'image' | 'video' | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      Placeholder.configure({ placeholder: 'Write the article here…' }),
      ArticleImage,
      ArticleVideo,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: 'min-h-[480px] px-5 py-5 text-base leading-7 text-gray-800 outline-none [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-3 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#10755A] [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_hr]:my-8 [&_figure]:my-6 [&_img]:mx-auto [&_img]:max-h-[520px] [&_img]:rounded-xl [&_img]:object-cover [&_video]:my-6 [&_video]:w-full [&_video]:rounded-xl',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) editor.commands.setContent(value)
  }, [editor, value])

  async function upload(file: File, kind: 'image' | 'video') {
    if (!editor) return
    const limit = kind === 'image' ? 10 : 50
    if (file.size > limit * 1024 * 1024) {
      window.alert(`${kind === 'image' ? 'Image' : 'Video'} must be under ${limit} MB.`)
      return
    }
    setUploading(kind)
    try {
      const supabase = createBrowserSupabase()
      const ext = file.name.split('.').pop()?.toLowerCase() || (kind === 'image' ? 'jpg' : 'mp4')
      const path = `article-media/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      const caption = window.prompt(kind === 'image' ? 'Caption (optional)' : 'Video caption (optional)', '') || ''
      if (kind === 'image') {
        const alt = window.prompt('Alt text for accessibility', caption || file.name.replace(/\.[^.]+$/, '')) || caption || 'Article image'
        editor.chain().focus().insertContent({ type: 'image', attrs: { src: data.publicUrl, alt, caption, size: 'wide' } }).run()
      } else {
        editor.chain().focus().insertContent({ type: 'articleVideo', attrs: { src: data.publicUrl, caption } }).run()
      }
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  if (!editor) return <div className="rounded-xl border border-gray-200 p-6 text-sm text-gray-400">Loading editor…</div>

  const chain = () => editor.chain().focus()

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="sticky top-0 z-20 flex flex-wrap gap-1.5 border-b border-gray-200 bg-gray-50/95 p-2 backdrop-blur">
        <Button title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Button>
        <Button title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Button>
        <Button title="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}><Bold size={16} /></Button>
        <Button title="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}><Italic size={16} /></Button>
        <Button title="Bulleted list" active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()}><List size={16} /></Button>
        <Button title="Numbered list" active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()}><ListOrdered size={16} /></Button>
        <Button title="Quote" active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()}><Quote size={16} /></Button>
        <Button title="Divider" onClick={() => chain().setHorizontalRule().run()}><Minus size={16} /></Button>
        <Button title="Add link" active={editor.isActive('link')} onClick={() => {
          const current = editor.getAttributes('link').href || ''
          const href = window.prompt('Link URL', current)
          if (href === null) return
          if (!href.trim()) chain().unsetLink().run()
          else chain().extendMarkRange('link').setLink({ href: href.trim() }).run()
        }}><Link2 size={16} /></Button>
        <Button title={uploading === 'image' ? 'Uploading image…' : 'Add image'} onClick={() => imageInputRef.current?.click()}><ImagePlus size={16} /></Button>
        <Button title={uploading === 'video' ? 'Uploading video…' : 'Add video'} onClick={() => videoInputRef.current?.click()}><Video size={16} /></Button>
      </div>

      <EditorContent editor={editor} />

      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) upload(file, 'image')
        e.target.value = ''
      }} />
      <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) upload(file, 'video')
        e.target.value = ''
      }} />
    </div>
  )
}

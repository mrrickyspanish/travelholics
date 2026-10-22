import type { JSONContent } from '@tiptap/react'
import type { Block } from '@/lib/articles'

function textNode(text: string): JSONContent {
  return { type: 'text', text }
}

function inlineToText(node: JSONContent): string {
  if (node.type === 'text') {
    let out = node.text ?? ''
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') out = `**${out}**`
      if (mark.type === 'italic') out = `*${out}*`
      if (mark.type === 'link') out = `[${out}](${mark.attrs?.href ?? ''})`
    }
    return out
  }
  return (node.content ?? []).map(inlineToText).join('')
}

function plainInline(text: string): JSONContent[] {
  return [textNode(text)]
}

export function blocksToTipTap(blocks: Block[] | null | undefined): JSONContent {
  const content: JSONContent[] = []
  for (const block of blocks ?? []) {
    if (block.type === 'p') content.push({ type: 'paragraph', content: plainInline(block.text) })
    else if (block.type === 'h2') content.push({ type: 'heading', attrs: { level: 2 }, content: plainInline(block.text) })
    else if (block.type === 'h3') content.push({ type: 'heading', attrs: { level: 3 }, content: plainInline(block.text) })
    else if (block.type === 'quote') content.push({ type: 'blockquote', content: [{ type: 'paragraph', content: plainInline(block.text) }] })
    else if (block.type === 'list') content.push({ type: 'bulletList', content: block.items.map((item) => ({ type: 'listItem', content: [{ type: 'paragraph', content: plainInline(item) }] })) })
    else if (block.type === 'ordered-list') content.push({ type: 'orderedList', content: block.items.map((item) => ({ type: 'listItem', content: [{ type: 'paragraph', content: plainInline(item) }] })) })
    else if (block.type === 'img') content.push({ type: 'image', attrs: { src: block.src, alt: block.alt, caption: block.caption ?? null, size: block.size ?? 'wide' } })
    else if (block.type === 'video') content.push({ type: 'articleVideo', attrs: { src: block.src, caption: block.caption ?? null } })
    else if (block.type === 'divider') content.push({ type: 'horizontalRule' })
  }
  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] }
}

export function tipTapToBlocks(doc: JSONContent): Block[] {
  const blocks: Block[] = []
  for (const node of doc.content ?? []) {
    if (node.type === 'paragraph') {
      const text = inlineToText(node).trim()
      if (text) blocks.push({ type: 'p', text })
    } else if (node.type === 'heading') {
      const text = inlineToText(node).trim()
      if (!text) continue
      blocks.push(node.attrs?.level === 3 ? { type: 'h3', text } : { type: 'h2', text })
    } else if (node.type === 'blockquote') {
      const text = (node.content ?? []).map(inlineToText).join(' ').trim()
      if (text) blocks.push({ type: 'quote', text })
    } else if (node.type === 'bulletList' || node.type === 'orderedList') {
      const items = (node.content ?? []).map((li) => (li.content ?? []).map(inlineToText).join(' ').trim()).filter(Boolean)
      blocks.push(node.type === 'orderedList' ? { type: 'ordered-list', items } : { type: 'list', items })
    } else if (node.type === 'image' && node.attrs?.src) {
      blocks.push({ type: 'img', src: String(node.attrs.src), alt: String(node.attrs.alt ?? node.attrs.caption ?? 'Article image'), caption: node.attrs.caption ? String(node.attrs.caption) : undefined, size: (node.attrs.size as 'column'|'wide'|'full') ?? 'wide' })
    } else if (node.type === 'articleVideo' && node.attrs?.src) {
      blocks.push({ type: 'video', src: String(node.attrs.src), caption: node.attrs.caption ? String(node.attrs.caption) : undefined })
    } else if (node.type === 'horizontalRule') blocks.push({ type: 'divider' })
  }
  return blocks
}


export function blocksToPlainText(blocks: Block[]): string {
  return blocks.map((block) => {
    if (block.type === 'p' || block.type === 'h2' || block.type === 'h3' || block.type === 'quote') return block.text
    if (block.type === 'list' || block.type === 'ordered-list') return block.items.join('\n')
    if (block.type === 'img') return block.caption ?? block.alt
    if (block.type === 'video') return block.caption ?? ''
    return ''
  }).filter(Boolean).join('\n\n')
}

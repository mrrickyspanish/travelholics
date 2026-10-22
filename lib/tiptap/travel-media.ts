import Image from '@tiptap/extension-image'
import { Node, mergeAttributes } from '@tiptap/core'

export const ArticleImage = Image.extend({
  name: 'image',
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
      size: { default: 'wide' },
    }
  },
})

export const ArticleVideo = Node.create({
  name: 'articleVideo',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: '' },
      caption: { default: null },
    }
  },
  parseHTML() {
    return [{ tag: 'video[data-article-video]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes, { 'data-article-video': 'true', controls: 'true', playsinline: 'true' })]
  },
})

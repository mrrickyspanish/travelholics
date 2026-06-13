import Image from 'next/image';
import Link from 'next/link';
import { Block } from '@/lib/articles';

interface Props {
  blocks: Block[];
}

export function ArticleBody({ blocks }: Props) {
  return (
    <div className="space-y-6 text-ink">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} className="text-base sm:text-lg leading-relaxed text-ink/90">
                {block.text}
              </p>
            );

          case 'h2':
            return (
              <h2 key={i} className="font-serif text-2xl sm:text-3xl font-semibold text-ink mt-10 mb-2 first:mt-0">
                {block.text}
              </h2>
            );

          case 'h3':
            return (
              <h3 key={i} className="font-serif text-xl sm:text-2xl font-semibold text-ink mt-8 mb-1">
                {block.text}
              </h3>
            );

          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 border-[#10755A] pl-5 py-1 my-8">
                <p className="font-serif text-xl sm:text-2xl italic text-ink/80 leading-snug mb-2">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.attribution && (
                  <cite className="text-sm text-stone not-italic font-semibold">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            );

          case 'list':
            return (
              <ul key={i} className="space-y-2 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-base sm:text-lg text-ink/90">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#10755A]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case 'img':
            return (
              <figure key={i} className="my-8">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-sand">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 720px"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-sm text-stone mt-2">{block.caption}</figcaption>
                )}
              </figure>
            );

          case 'divider':
            return (
              <div key={i} className="flex items-center justify-center my-10" aria-hidden="true">
                <span className="text-stone/40 text-2xl tracking-widest">· · ·</span>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

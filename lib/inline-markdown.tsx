import Link from 'next/link';
import type { ReactNode } from 'react';

const LINK_CLASS = 'text-[#10755A] underline hover:text-[#0d6a51]';

// Matches, in priority order: **bold**, markdown [text](url) links, bare
// https:// URLs, and bare mentions of the site's own domain.
const INLINE_PATTERN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+)|\b(yotravelholic\.com(?:\/[^\s)]*)?)/g;

function splitTrailingPunctuation(raw: string): [string, string] {
  const m = raw.match(/^(.*[^.,!?;:])([.,!?;:]+)$/);
  return m ? [m[1], m[2]] : [raw, ''];
}

function resolveLink(rawUrl: string): { internal: boolean; href: string } {
  if (rawUrl.startsWith('/')) return { internal: true, href: rawUrl };
  const withScheme = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  try {
    const u = new URL(withScheme);
    if (u.hostname === 'yotravelholic.com' || u.hostname === 'www.yotravelholic.com') {
      return { internal: true, href: `${u.pathname}${u.search}${u.hash}` };
    }
    return { internal: false, href: withScheme };
  } catch {
    return { internal: false, href: rawUrl };
  }
}

function renderLink(label: string, rawUrl: string, key: number): ReactNode {
  const { internal, href } = resolveLink(rawUrl);
  return internal ? (
    <Link key={key} href={href} className={LINK_CLASS}>
      {label}
    </Link>
  ) : (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      {label}
    </a>
  );
}

// Parses **bold**, markdown [text](url) links, and bare URLs/yotravelholic.com
// mentions out of the AI generator's plain-text output — the generator never
// emits real HTML/markdown elements, so without this the public site prints
// literal asterisks and dead text instead of emphasis and working links.
export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(renderLink(match[2], match[3], key++));
    } else {
      const [url, trailing] = splitTrailingPunctuation(match[4] ?? match[5]);
      nodes.push(renderLink(url, url, key++));
      if (trailing) nodes.push(trailing);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return nodes;
}

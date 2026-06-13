"use client";

import { useState } from 'react';
import { Mail } from 'lucide-react';

export function ArticleNewsletterCta() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'blog-article-cta',
          consent_text: 'Subscribed via blog article newsletter CTA',
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <aside className="bg-[#1F2D86] rounded-2xl px-6 py-8 sm:px-10 sm:py-10 text-cream my-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <Mail className="h-5 w-5 text-cream" />
        </div>
        <div>
          <p className="font-script text-xl text-[#F4C4CC]">Stay in the loop</p>
          <h2 className="font-serif text-2xl font-semibold">
            Get trip blogs, cruise news & deals — free
          </h2>
        </div>
      </div>

      {status === 'success' ? (
        <p className="text-cream/80 text-base">
          You&apos;re in! Watch your inbox for the next post from Yolanda.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="article-cta-email" className="sr-only">Email address</label>
          <input
            id="article-cta-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-base"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 rounded-xl bg-[#F26A75] text-white font-bold text-sm hover:bg-[#D9505C] transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe Free'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-[#F4C4CC] text-sm mt-2">Something went wrong — try again or email us directly.</p>
      )}
    </aside>
  );
}

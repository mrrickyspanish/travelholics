"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────── */
type CheckoutState = "idle" | "pending" | "error";

/* ─── Magnet Buy Button ──────────────────────────────────── */
function MagnetBuyButton({ productId, label }: { productId: string; label: string }) {
  const [state, setState] = useState<CheckoutState>("idle");

  const handleClick = async () => {
    setState("pending");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, color: "Standard", size: "One Size", quantity: 1 }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Unable to start checkout.");
      window.location.href = data.url;
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === "pending"}
      className="coming-soon-cta"
      style={{ cursor: state === "pending" ? "wait" : "none" }}
    >
      <span>{state === "pending" ? "Opening…" : state === "error" ? "Try Again" : label}</span>
      <span className="cta-arrow" aria-hidden />
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ShopComingSoon() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  const [notifyName, setNotifyName] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyState, setNotifyState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState(false);

  /* Custom cursor */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    const lerp = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`;
      }
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".cs-reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("cs-in"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));

    /* Lookbook card stagger */
    document.querySelectorAll<HTMLElement>(".lb-card").forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.7s ${i * 0.06}s ease, transform 0.7s ${i * 0.06}s ease`;
      const o2 = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
        }),
        { threshold: 0.08 }
      );
      o2.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.includes("@")) { setEmailError(true); return; }
    setEmailError(false);
    setNotifyState("pending");
    try {
      const res = await fetch("/api/shop-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: notifyName, email: notifyEmail }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error);
      setNotifyState("success");
    } catch {
      setNotifyState("error");
    }
  };

  return (
    <>
      {/* ── Scoped styles ──────────────────────────────────── */}
      <style>{`
        .cs-page { background: #111010; color: #F4EFE8; font-family: 'Jost', sans-serif; font-weight: 300; overflow-x: hidden; cursor: none; }
        .cs-cursor { width:10px;height:10px;border-radius:50%;background:#C05C2E;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;transition:width .3s,height .3s,background .3s;transform:translate(-50%,-50%); }
        .cs-ring { width:36px;height:36px;border-radius:50%;border:1px solid rgba(244,239,232,.4);position:fixed;top:0;left:0;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .3s,height .3s; }
        .cs-page a:hover ~ .cs-cursor, .cs-page button:hover ~ .cs-cursor { width:18px;height:18px;background:#A8865A; }

        .cs-nav { position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:32px 52px; }
        .cs-nav-logo { font-family:'Jost',sans-serif;font-weight:200;font-size:.7rem;letter-spacing:.35em;text-transform:uppercase;color:#F4EFE8;opacity:.85;text-decoration:none; }
        .cs-nav-right { display:flex;align-items:center;gap:28px; }
        .cs-nav-link { font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:rgba(244,239,232,.5);text-decoration:none;transition:color .3s;cursor:none; }
        .cs-nav-link:hover { color:#F4EFE8; }

        .cs-hero { min-height:100vh;position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:0 52px 64px;overflow:hidden; }
        .cs-hero-bg { position:absolute;inset:0;z-index:0; }
        .cs-hero-sun { position:absolute;top:14%;right:24%;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(255,235,160,.9) 0%,rgba(255,170,60,.4) 45%,transparent 70%);box-shadow:0 0 80px 20px rgba(255,190,60,.25);z-index:1; }
        .cs-hero-horizon { position:absolute;top:52%;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.08) 30%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.08) 70%,transparent 100%);z-index:1; }
        .cs-hero-content { position:relative;z-index:2; }
        .cs-eyebrow { font-family:'Jost',sans-serif;font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;color:#A8865A;margin-bottom:16px;opacity:0;animation:csUp 1s .3s forwards; }
        .cs-title { font-family:'Bebas Neue',sans-serif;font-size:clamp(5rem,14vw,15rem);line-height:.88;letter-spacing:.01em;color:#F4EFE8;margin-bottom:0;opacity:0;animation:csUp 1s .5s forwards; }
        .cs-outlined { -webkit-text-stroke:1.5px #F4EFE8;color:transparent;font-family:'Bebas Neue',sans-serif;font-size:clamp(5rem,14vw,15rem);line-height:.88; }
        .cs-hero-bottom { display:flex;align-items:flex-end;justify-content:space-between;margin-top:40px;opacity:0;animation:csUp 1s .9s forwards; }
        .cs-hero-sub { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1rem,1.4vw,1.3rem);font-weight:300;color:rgba(244,239,232,.75);max-width:320px;line-height:1.6; }

        .coming-soon-cta { display:inline-flex;align-items:center;gap:14px;font-family:'Jost',sans-serif;font-size:.65rem;font-weight:400;letter-spacing:.25em;text-transform:uppercase;color:#F4EFE8;background:none;border:1px solid rgba(244,239,232,.35);padding:16px 28px;cursor:none;text-decoration:none;transition:border-color .4s,background .4s;position:relative;overflow:hidden; }
        .coming-soon-cta::before { content:'';position:absolute;inset:0;background:#C05C2E;transform:scaleX(0);transform-origin:left;transition:transform .4s ease;z-index:0; }
        .coming-soon-cta:hover::before { transform:scaleX(1); }
        .coming-soon-cta:hover { border-color:#C05C2E; }
        .coming-soon-cta span { position:relative;z-index:1; }
        .cta-arrow { width:20px;height:1px;background:currentColor;position:relative;transition:width .3s; }
        .cta-arrow::after { content:'';position:absolute;right:0;top:-3px;width:6px;height:6px;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(-45deg); }
        .coming-soon-cta:hover .cta-arrow { width:30px; }

        .cs-scroll-hint { display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:16px; }
        .cs-scroll-line { width:1px;height:48px;background:linear-gradient(to bottom,rgba(244,239,232,.5),transparent);animation:csPulse 2s ease-in-out infinite; }
        .cs-scroll-label { font-size:.5rem;letter-spacing:.3em;text-transform:uppercase;color:rgba(244,239,232,.4); }

        .cs-strip { background:#F4EFE8;padding:28px 52px;display:flex;align-items:center;justify-content:space-between; }
        .cs-strip-text { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:#111010;opacity:.5; }
        .cs-strip-label { font-size:.55rem;letter-spacing:.35em;text-transform:uppercase;color:#C05C2E; }

        .cs-lookbook { background:#F4EFE8;padding:80px 0 0; }
        .cs-lb-head { padding:0 52px 64px;display:flex;align-items:flex-end;justify-content:space-between; }
        .cs-lb-head h2 { font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,7vw,7rem);line-height:.9;color:#111010; }
        .cs-lb-head h2 em { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.55em;display:block;color:#C05C2E;font-weight:300;letter-spacing:.05em;margin-bottom:8px; }
        .cs-lb-copy { max-width:280px;font-size:.75rem;line-height:1.9;color:rgba(17,16,16,.5);letter-spacing:.03em; }

        .lb-row-1 { display:grid;grid-template-columns:2fr 1fr;gap:4px;margin-bottom:4px; }
        .lb-row-2 { display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:4px;margin-bottom:4px; }
        .lb-row-3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:4px; }
        .lb-row-4 { margin-bottom:0; }

        .lb-card { position:relative;overflow:hidden; }
        .lb-card img { width:100%;display:block;transition:transform .7s ease;object-fit:cover; }
        .lb-card:hover img { transform:scale(1.04); }
        .lb-overlay { position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:28px 32px;background:linear-gradient(to top,rgba(17,16,16,.5) 0%,transparent 50%);opacity:0;transition:opacity .4s; }
        .lb-card:hover .lb-overlay { opacity:1; }
        .lb-overlay-tag { font-size:.5rem;letter-spacing:.3em;text-transform:uppercase;color:#A8865A;margin-bottom:6px; }
        .lb-overlay-title { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.4rem;font-weight:300;color:#fff;line-height:1.2; }
        .lb-num { font-family:'Bebas Neue',sans-serif;font-size:4rem;color:rgba(255,255,255,.1);line-height:1;position:absolute;bottom:28px;left:32px;z-index:3; }
        .lb-text-card { background:#1C3A4A;display:flex;flex-direction:column;justify-content:flex-end;padding:36px; }
        .lb-text-eyebrow { font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;color:#A8865A;margin-bottom:16px; }
        .lb-text-title { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:2rem;font-weight:300;color:#F4EFE8;line-height:1.3;margin-bottom:20px; }
        .lb-text-body { font-size:.7rem;line-height:1.8;color:rgba(244,239,232,.55);letter-spacing:.03em; }

        /* Lookbook shop card */
        .lb-shop-card { background:#F4EFE8;display:flex;flex-direction:column;padding:28px 24px 24px;height:380px;overflow:hidden; }
        .lb-shop-eyebrow { font-size:.5rem;letter-spacing:.35em;text-transform:uppercase;color:#C05C2E;margin-bottom:16px; }
        .lb-shop-items { display:flex;flex-direction:column;flex:1;gap:0; }
        .lb-shop-item { display:flex;flex-direction:column;flex:1;align-items:flex-start;gap:4px; }
        .lb-shop-img-wrap { position:relative;width:100%;height:80px;flex-shrink:0; }
        .lb-shop-name { font-family:'Cormorant Garamond',serif;font-size:.85rem;font-weight:400;line-height:1.25;color:#111010;margin:0; }
        .lb-shop-name em { font-style:italic;font-weight:300;color:rgba(17,16,16,.55); }
        .lb-shop-price { font-family:'Jost',sans-serif;font-size:.6rem;font-weight:300;letter-spacing:.12em;color:#A8865A;margin:0; }
        .lb-shop-divider { height:1px;background:rgba(17,16,16,.1);margin:10px 0; }
        .lb-shop-card .coming-soon-cta { font-size:.5rem;padding:8px 14px;border-color:rgba(17,16,16,.25);color:#111010;gap:8px;margin-top:4px; }
        .lb-shop-card .coming-soon-cta::before { background:#C05C2E; }
        .lb-shop-card .coming-soon-cta:hover { color:#F4EFE8;border-color:#C05C2E; }
        .lb-shop-card .cta-arrow { background:currentColor; }

        /* Available Now */
        .cs-available { background:#111010;padding:80px 52px;border-top:1px solid rgba(244,239,232,.08); }
        .cs-available-head { text-align:center;margin-bottom:56px; }
        .cs-available-kicker { font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:#C05C2E;margin-bottom:16px; }
        .cs-available-title { font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,5vw,5rem);line-height:.9;color:#F4EFE8; }
        .cs-available-title em { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.6em;color:#A8865A;font-weight:300; }
        .cs-available-sub { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(244,239,232,.35);margin-top:16px; }
        .cs-magnet-grid { display:grid;grid-template-columns:1fr 1fr;gap:4px;max-width:800px;margin:0 auto; }
        .cs-magnet-card { background:#111010;overflow:hidden;display:flex;flex-direction:column; }
        .cs-magnet-img { position:relative;aspect-ratio:1;background:#1a1a1a; }
        .cs-magnet-body { padding:28px 28px 24px;display:flex;flex-direction:column;gap:12px;flex:1; }
        .cs-magnet-badge { font-size:.5rem;letter-spacing:.3em;text-transform:uppercase;color:#A8865A; }
        .cs-magnet-name { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.4rem;font-weight:300;color:#F4EFE8;line-height:1.2; }
        .cs-magnet-desc { font-size:.65rem;line-height:1.8;color:rgba(244,239,232,.45);letter-spacing:.02em;flex:1; }
        .cs-magnet-price { font-family:'Jost',sans-serif;font-weight:300;font-size:.8rem;letter-spacing:.1em;color:#A8865A; }
        .cs-magnet-cta { margin:0 24px 24px;display:flex;align-items:center;justify-content:center;gap:12px;background:none;border:1px solid rgba(244,239,232,.25);color:#F4EFE8;font-family:'Jost',sans-serif;font-size:.6rem;font-weight:400;letter-spacing:.25em;text-transform:uppercase;padding:14px 24px;transition:border-color .4s,background .4s;position:relative;overflow:hidden;cursor:none; }
        .cs-magnet-cta::before { content:'';position:absolute;inset:0;background:#C05C2E;transform:scaleX(0);transform-origin:left;transition:transform .4s ease; }
        .cs-magnet-cta:hover::before { transform:scaleX(1); }
        .cs-magnet-cta:hover { border-color:#C05C2E; }
        .cs-magnet-cta span { position:relative;z-index:1; }

        /* Notify */
        .cs-notify { background:#111010;padding:100px 52px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;border-top:1px solid rgba(244,239,232,.08); }
        .cs-notify-left h3 { font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,6vw,5.5rem);line-height:.9;color:#F4EFE8;margin-bottom:24px; }
        .cs-notify-left p { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:rgba(244,239,232,.4);line-height:1.7;max-width:340px; }
        .cs-notify-input { background:none;border:none;border-bottom:1px solid rgba(244,239,232,.18);padding:18px 0;font-family:'Jost',sans-serif;font-size:.8rem;font-weight:300;letter-spacing:.05em;color:#F4EFE8;outline:none;transition:border-color .3s;width:100%; }
        .cs-notify-input::placeholder { color:rgba(244,239,232,.25); }
        .cs-notify-input:focus { border-color:#C05C2E; }
        .cs-notify-input.err { border-color:#C05C2E; }
        .cs-notify-btn { margin-top:32px;display:inline-flex;align-items:center;gap:16px;background:#F4EFE8;color:#111010;border:none;padding:18px 32px;font-family:'Jost',sans-serif;font-size:.6rem;font-weight:400;letter-spacing:.25em;text-transform:uppercase;cursor:none;align-self:flex-start;transition:background .3s;position:relative;overflow:hidden; }
        .cs-notify-btn::before { content:'';position:absolute;inset:0;background:#C05C2E;transform:scaleX(0);transform-origin:left;transition:transform .4s ease; }
        .cs-notify-btn:hover::before { transform:scaleX(1); }
        .cs-notify-btn:hover { color:#F4EFE8; }
        .cs-notify-btn span { position:relative;z-index:1; }
        .cs-notify-note { margin-top:16px;font-size:.58rem;letter-spacing:.08em;color:rgba(244,239,232,.22); }
        .cs-notify-success { margin-top:16px;font-size:.65rem;letter-spacing:.1em;color:#C05C2E; }
        .cs-notify-error { margin-top:16px;font-size:.65rem;letter-spacing:.08em;color:#C05C2E; }

        .cs-footer { background:#111010;padding:40px 52px;display:flex;align-items:center;justify-content:space-between; }
        .cs-footer-logo { font-family:'Jost',sans-serif;font-weight:200;font-size:.65rem;letter-spacing:.4em;text-transform:uppercase;color:rgba(244,239,232,.3); }
        .cs-footer-link { font-size:.58rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(244,239,232,.25);text-decoration:none;transition:color .3s;cursor:none; }
        .cs-footer-link:hover { color:#A8865A; }

        .cs-reveal { opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s ease; }
        .cs-in { opacity:1;transform:translateY(0); }

        @keyframes csUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes csPulse { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }

        @media(max-width:900px){
          .cs-nav{padding:24px}
          .cs-hero{padding:0 24px 52px}
          .cs-hero-bottom{flex-direction:column;align-items:flex-start;gap:24px}
          .cs-strip{padding:20px 24px}
          .cs-lb-head{flex-direction:column;gap:24px;padding:0 24px 48px}
          .lb-row-1,.lb-row-2,.lb-row-3{grid-template-columns:1fr}
          .lb-row-1 .lb-card,.lb-row-2 .lb-card,.lb-row-3 .lb-card{height:280px}
          .lb-row-1 .lb-card img,.lb-row-2 .lb-card img,.lb-row-3 .lb-card img{height:280px}
          .lb-shop-card{height:auto}
          .cs-available{padding:60px 24px}
          .cs-magnet-grid{grid-template-columns:1fr}
          .cs-notify{grid-template-columns:1fr;gap:48px;padding:72px 24px}
          .cs-footer{flex-direction:column;gap:16px;padding:32px 24px}
        }
      `}</style>

      <div className="cs-page">
        <div className="cs-cursor" ref={cursorRef} />
        <div className="cs-ring" ref={ringRef} />

        {/* ── Nav ────────────────────────────────────────────── */}
        <nav className="cs-nav">
          <Link href="/" className="cs-nav-logo">Travelholics</Link>
          <div className="cs-nav-right">
            <a href="https://yotravelholic.com" className="cs-nav-link" target="_blank" rel="noopener noreferrer">yotravelholic.com</a>
            <a href="#notify" className="cs-nav-link">Get Notified</a>
          </div>
        </nav>

        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="cs-hero">
          <div className="cs-hero-bg" style={{
            background: `
              linear-gradient(to bottom, rgba(17,16,16,.15) 0%, rgba(17,16,16,0) 30%, rgba(17,16,16,0) 50%, rgba(17,16,16,.72) 100%),
              radial-gradient(ellipse 80% 60% at 65% 35%, rgba(160,120,70,.55) 0%, transparent 65%),
              radial-gradient(ellipse 50% 70% at 20% 70%, rgba(28,58,74,.6) 0%, transparent 60%),
              linear-gradient(160deg, #3a6b8a 0%, #1c3a4a 30%, #2d1a0e 65%, #1a0d06 100%)
            `
          }}>
            <Image
              src="/images/hero_th_background.png"
              alt=""
              fill
              className="object-cover mix-blend-overlay opacity-40"
              priority
              aria-hidden
            />
          </div>
          <div className="cs-hero-sun" />
          <div className="cs-hero-horizon" />

          <div className="cs-hero-content">
            <p className="cs-eyebrow">The First Drop &nbsp;·&nbsp; Shop Coming Soon</p>
            <div className="cs-title">
              SHOP<br />
              <span style={{ display: "flex", alignItems: "flex-end", gap: "0.06em" }}>
                <span>IS&nbsp;</span>
                <span className="cs-outlined">COM</span>
                <span>ING</span>
              </span>
            </div>
            <div className="cs-hero-bottom">
              <p className="cs-hero-sub">
                Curated pieces for the traveler<br />
                who lives in the experience.
              </p>
              <div style={{ textAlign: "right" }}>
                <div className="cs-scroll-hint">
                  <div className="cs-scroll-line" />
                  <span className="cs-scroll-label">Scroll</span>
                </div>
                <a href="#lookbook" className="coming-soon-cta" style={{ marginTop: 20, display: "inline-flex" }}>
                  <span>Explore the Look Book</span>
                  <span className="cta-arrow" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Strip ──────────────────────────────────────────── */}
        <div className="cs-strip">
          <span className="cs-strip-text">Drop 01 — The Vacation Edit</span>
          <span className="cs-strip-label">Look Book Below ↓</span>
        </div>

        {/* ── Lookbook ───────────────────────────────────────── */}
        <section className="cs-lookbook" id="lookbook">
          <div className="cs-lb-head cs-reveal">
            <h2>
              <em>Drop 01</em>
              THE<br />LOOK<br />BOOK
            </h2>
            <p className="cs-lb-copy">
              Every piece starts with a feeling. The warmth of a deck at golden hour. Salt air at a new port. The ease of being exactly where you&apos;re supposed to be. This is what that looks like, worn.
            </p>
          </div>

          {/* Row 1: wide + portrait */}
          <div className="lb-row-1">
            <div className="lb-card">
              <Image src="/images/travelholics_lifestyle_canvas-tote-portside.png" alt="Canvas Tote Portside" width={1200} height={560} style={{ height: 560, objectFit: "cover" }} />
              <div className="lb-overlay">
                <div className="lb-overlay-tag">Lifestyle</div>
                <div className="lb-overlay-title">Canvas Tote<br />Portside</div>
              </div>
              <div className="lb-num">01</div>
            </div>
            <div className="lb-card">
              <Image src="/images/travelholics_lifestyle_couple-beach-tees.png" alt="Couple Beach Tees" width={600} height={560} style={{ height: 560, objectFit: "cover" }} />
              <div className="lb-overlay">
                <div className="lb-overlay-tag">Lifestyle</div>
                <div className="lb-overlay-title">Couple Beach<br />Tees</div>
              </div>
            </div>
          </div>

          {/* Row 2: three columns */}
          <div className="lb-row-2">
            <div className="lb-card">
              <Image src="/images/travelholics_lifestyle_linen-shirt-cruise-deck.png" alt="Linen Shirt Cruise Deck" width={600} height={380} style={{ height: 380, objectFit: "cover" }} />
              <div className="lb-overlay">
                <div className="lb-overlay-tag">Lifestyle</div>
                <div className="lb-overlay-title">Linen Shirt<br />Cruise Deck</div>
              </div>
            </div>
            <div className="lb-card">
              <Image src="/images/travelholics_lifestyle_compass-tee-backview.png" alt="Compass Tee Backview" width={800} height={380} style={{ height: 380, objectFit: "cover" }} />
              <div className="lb-overlay">
                <div className="lb-overlay-tag">Lifestyle</div>
                <div className="lb-overlay-title">Compass Tee<br />Backview</div>
              </div>
              <div className="lb-num">02</div>
            </div>
            <div className="lb-shop-card">
              <div className="lb-shop-eyebrow">Available Now</div>
              <div className="lb-shop-items">
                <div className="lb-shop-item">
                  <div className="lb-shop-img-wrap">
                    <Image src="/images/travelholics_product_cruise-life-magnet-on-journal.png" alt="Cruise Life Door Magnet" fill className="object-contain" />
                  </div>
                  <p className="lb-shop-name">Cruise Ticket<br /><em>Door Magnet</em></p>
                  <p className="lb-shop-price">$19.99</p>
                  <MagnetBuyButton productId="merch-magnet-ticket-pacific" label="Buy Now" />
                </div>
                <div className="lb-shop-divider" />
                <div className="lb-shop-item">
                  <div className="lb-shop-img-wrap">
                    <Image src="/images/travelholics_mockup_pacific-mexican-door-magnet.png" alt="Pacific Mexican Door Magnet" fill className="object-contain" />
                  </div>
                  <p className="lb-shop-name">Pacific Mexican<br /><em>Door Magnet</em></p>
                  <p className="lb-shop-price">$19.99</p>
                  <MagnetBuyButton productId="merch-magnet-mexican-pacific" label="Buy Now" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: editorial + text card + photo */}
          <div className="lb-row-3">
            <div className="lb-card">
              <Image src="/images/why-insider-secrets.jpg" alt="Formal couple, chandelier" width={600} height={400} style={{ height: 400, objectFit: "cover" }} />
              <div className="lb-overlay">
                <div className="lb-overlay-tag">Detail</div>
                <div className="lb-overlay-title">The<br />Warmth</div>
              </div>
            </div>
            <div className="lb-card lb-text-card" style={{ height: 400 }}>
              <div className="lb-text-eyebrow">Travelholics · Drop 01</div>
              <div className="lb-text-title">&ldquo;The pieces<br />find you<br />at the dock.&rdquo;</div>
              <div className="lb-text-body">Limited run. Built for the traveler who already knows where they&apos;re going next.</div>
            </div>
            <div className="lb-card">
              <Image src="/images/about-on-deck.jpg" alt="Sunset deck selfie" width={600} height={400} style={{ height: 400, objectFit: "cover" }} />
              <div className="lb-overlay">
                <div className="lb-overlay-tag">Lifestyle</div>
                <div className="lb-overlay-title">Port Day<br />Essentials</div>
              </div>
              <div className="lb-num">03</div>
            </div>
          </div>

          {/* Row 4: full-width bucket hat tease */}
          <div className="lb-row-4">
            <div className="lb-card">
              <Image src="/images/dest-alaska-glaciers.jpg" alt="Alaska glaciers" width={1800} height={500} style={{ height: 500, objectFit: "cover" }} />
              <div className="lb-overlay" style={{ opacity: 1, background: "linear-gradient(to top, rgba(17,16,16,.65) 0%, transparent 60%)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div className="lb-overlay-tag">The Full Edit</div>
                    <div className="lb-overlay-title" style={{ fontSize: "2rem" }}>Drop 01 — Coming Soon</div>
                  </div>
                  <a href="#notify" style={{ fontSize: ".55rem", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,.25)", paddingBottom: 4, cursor: "none" }}>
                    Get Notified ↓
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── Notify ─────────────────────────────────────────── */}
        <section className="cs-notify" id="notify">
          <div className="cs-notify-left cs-reveal">
            <h3>FIRST<br />ACCESS.</h3>
            <p>Drop 01 is limited. Subscribers get in before everyone else — no spam, just the launch call.</p>
          </div>
          <div className="cs-reveal">
            {notifyState === "success" ? (
              <p className="cs-notify-success" style={{ fontSize: "1rem", lineHeight: 1.6 }}>
                ✓ You&apos;re on the list.<br />See you at launch.
              </p>
            ) : (
              <form onSubmit={handleNotify} style={{ display: "flex", flexDirection: "column" }}>
                <input
                  className="cs-notify-input"
                  type="text"
                  placeholder="First Name"
                  value={notifyName}
                  onChange={(e) => setNotifyName(e.target.value)}
                />
                <input
                  className={`cs-notify-input${emailError ? " err" : ""}`}
                  type="email"
                  placeholder="Email Address"
                  value={notifyEmail}
                  onChange={(e) => { setNotifyEmail(e.target.value); setEmailError(false); }}
                  style={{ marginTop: 0 }}
                />
                <button type="submit" className="cs-notify-btn" disabled={notifyState === "pending"}>
                  <span>{notifyState === "pending" ? "Saving…" : "Notify Me at Launch →"}</span>
                </button>
                {notifyState === "error" && (
                  <p className="cs-notify-error">Something went wrong — please try again.</p>
                )}
                <p className="cs-notify-note">No spam. First access when the shop goes live.</p>
              </form>
            )}
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="cs-footer">
          <Link href="/" className="cs-footer-logo">Travelholics</Link>
          <a href="https://yotravelholic.com" className="cs-footer-link" target="_blank" rel="noopener noreferrer">yotravelholic.com</a>
          <Link href="/shop-full" className="cs-footer-link">Full Shop Preview</Link>
        </footer>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { supabase } from "@/lib/supabase";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["700", "900"],
});

type TravelReason =
  | "Vacation"
  | "Honeymoon"
  | "Anniversary"
  | "Family Reunion"
  | "Birthday"
  | "Other";
type FormState = "idle" | "submitting" | "success" | "error";
type AnimPhase = "gift" | "revealed";

const CONFETTI_COLORS = [
  "#10553C",
  "#0D2D4A",
  "#D4A853",
  "#1a7a56",
  "#0d6e9e",
  "#2DD4A0",
];

const TRAVEL_OPTIONS: TravelReason[] = [
  "Vacation",
  "Honeymoon",
  "Anniversary",
  "Family Reunion",
  "Birthday",
  "Other",
];

export default function DuckHuntPage() {
  const [animPhase, setAnimPhase] = useState<AnimPhase>("gift");
  const [boxBounce, setBoxBounce] = useState(false);
  const [boxShake, setBoxShake] = useState(false);
  const [lidGone, setLidGone] = useState(false);
  const [d1Visible, setD1Visible] = useState(false);
  const [d2Visible, setD2Visible] = useState(false);
  const [d3Visible, setD3Visible] = useState(false);
  const [duckFloat, setDuckFloat] = useState(false);

  const [travelReason, setTravelReason] = useState<TravelReason>("Vacation");
  const [formState, setFormState] = useState<FormState>("idle");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");

  async function fireConfetti() {
    if (typeof window === "undefined") return;
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 300,
      spread: 100,
      origin: { x: 0.5, y: 0.45 },
      colors: CONFETTI_COLORS,
      startVelocity: 55,
      gravity: 0.8,
      scalar: 1.2,
      ticks: 200,
    });
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { x: 0.1, y: 0.5 },
        colors: CONFETTI_COLORS,
        startVelocity: 45,
        angle: 60,
        gravity: 0.85,
      });
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { x: 0.9, y: 0.5 },
        colors: CONFETTI_COLORS,
        startVelocity: 45,
        angle: 120,
        gravity: 0.85,
      });
    }, 150);
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 160,
        origin: { x: 0.3, y: 0 },
        colors: CONFETTI_COLORS,
        startVelocity: 20,
        gravity: 0.6,
        scalar: 0.9,
      });
      confetti({
        particleCount: 120,
        spread: 160,
        origin: { x: 0.7, y: 0 },
        colors: CONFETTI_COLORS,
        startVelocity: 20,
        gravity: 0.6,
        scalar: 0.9,
      });
    }, 350);
  }

  useEffect(() => {
    const t1 = setTimeout(() => setBoxBounce(true), 300);
    const t2 = setTimeout(() => {
      setBoxBounce(false);
      setBoxShake(true);
    }, 1400);
    const t3 = setTimeout(() => {
      setBoxShake(false);
      setLidGone(true);
      fireConfetti();
    }, 1900);
    const t4 = setTimeout(() => {
      setAnimPhase("revealed");
      setD1Visible(true);
    }, 2700);
    const t5 = setTimeout(() => setD2Visible(true), 2900);
    const t6 = setTimeout(() => setD3Visible(true), 3250);
    const t7 = setTimeout(() => setDuckFloat(true), 3600);
    return () => [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");

    if (website.trim()) {
      setFormState("success");
      return;
    }

    const queryParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const duckNumber = queryParams?.get("duck")?.trim() || null;
    const batch = queryParams?.get("batch")?.trim() || null;
    const ship = queryParams?.get("ship")?.trim() || null;
    const source = queryParams?.get("source")?.trim() || null;

    try {
      if (supabase) {
        const { error } = await supabase.from("duck_hunt_leads").insert([
          {
            first_name: firstName,
            email,
            city: city || null,
            travel_reason: travelReason,
            duck_number: duckNumber,
            batch,
            ship,
            source,
          },
        ]);
        if (error) throw error;
      }
      setFormState("success");
      fireConfetti();
    } catch (err) {
      console.error("Duck hunt submission error:", err);
      setFormState("error");
    }
  }

  return (
    <>
      <style>{`
        @keyframes boxBounce {
          0%,100% { transform: translateY(0) scaleX(1) scaleY(1); }
          20%      { transform: translateY(-50px) scaleX(0.95) scaleY(1.05); }
          40%      { transform: translateY(0) scaleX(1.05) scaleY(0.95); }
          60%      { transform: translateY(-28px) scaleX(0.97) scaleY(1.03); }
          80%      { transform: translateY(0) scaleX(1.02) scaleY(0.98); }
        }
        @keyframes boxShake {
          0%,100% { transform: rotate(0deg); }
          20%     { transform: rotate(-5deg) translateX(-4px); }
          40%     { transform: rotate(5deg) translateX(4px); }
          60%     { transform: rotate(-4deg) translateX(-3px); }
          80%     { transform: rotate(4deg) translateX(3px); }
        }
        @keyframes lidFly {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(-300px) rotate(-28deg) scale(0.8); opacity: 0; }
        }
        @keyframes duckPop {
          0%   { transform: translateY(50px) scale(0.4); opacity: 0; }
          65%  { transform: translateY(-10px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes duckFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="bg-[#FAF9F6] text-gray-900 antialiased overflow-x-hidden min-h-screen">
        <nav className="fixed top-0 w-full z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E2DDD6] flex justify-between items-center px-6 h-16">
          <span
            className={`${playfair.className} text-xl font-black text-[#0D2D4A] tracking-widest uppercase`}
          >
            Travelholics
          </span>
          <div className="w-8 h-8 rounded-full bg-[#10553C] flex items-center justify-center text-sm">
            🦆
          </div>
        </nav>

        <main className="w-full max-w-[390px] mx-auto bg-[#FAF9F6] overflow-hidden pt-16 pb-16">
          <section className="relative min-h-[700px] flex flex-col justify-center items-center px-8 py-16 overflow-hidden">
            <div
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "rgba(16,85,60,.25)" }}
            />
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "rgba(13,100,150,.18)" }}
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
              <svg width="360" height="360" viewBox="0 0 360 360" fill="none">
                <g stroke="#0D2D4A">
                  <circle cx="180" cy="180" r="60" strokeWidth=".8" />
                  <circle cx="180" cy="180" r="110" strokeWidth=".8" />
                  <circle cx="180" cy="180" r="160" strokeWidth=".6" />
                  <line x1="180" y1="0" x2="180" y2="360" strokeWidth=".8" />
                  <line x1="0" y1="180" x2="360" y2="180" strokeWidth=".8" />
                  <line x1="0" y1="0" x2="360" y2="360" strokeWidth=".6" />
                  <line x1="360" y1="0" x2="0" y2="360" strokeWidth=".6" />
                </g>
              </svg>
            </div>

            {animPhase === "gift" && (
              <div className="relative z-10 flex flex-col items-center">
                <div
                  style={{
                    animation: boxBounce
                      ? "boxBounce 1.1s cubic-bezier(.36,.07,.19,.97)"
                      : boxShake
                        ? "boxShake 0.45s ease-in-out"
                        : "none",
                  }}
                  className="relative"
                >
                  <div
                    style={{
                      animation: lidGone
                        ? "lidFly 0.45s cubic-bezier(.17,.67,.35,1.2) forwards"
                        : "none",
                    }}
                    className="absolute -left-2 -top-8 w-[116px] h-7 bg-[#10553C] rounded-t-md z-10"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-[7px] bg-white/10" />
                    </div>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-0.5 items-end">
                      <div className="w-[22px] h-[18px] border-[5px] border-[#D4A853] rounded-full -rotate-[35deg]" />
                      <div className="w-3 h-3 bg-[#D4A853] rounded-full mb-0.5 z-10 relative" />
                      <div className="w-[22px] h-[18px] border-[5px] border-[#D4A853] rounded-full rotate-[35deg]" />
                    </div>
                  </div>

                  <div
                    className="w-[100px] h-[86px] bg-white rounded-b-md relative overflow-hidden border border-t-0 border-[#E2DDD6]"
                    style={{ boxShadow: "0 10px 30px rgba(13,45,74,.1)" }}
                  >
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[9px] bg-[#10553C]/15" />
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D4A853]/30" />
                  </div>
                </div>

                <p className="text-[#10553C]/65 text-[13px] font-bold uppercase tracking-[.2em] mt-9">
                  Something&apos;s inside...
                </p>
              </div>
            )}

            {animPhase === "revealed" && (
              <div className="relative z-10 text-center px-2">
                <div
                  style={{
                    animation: d1Visible ? "fadeUp .5s ease forwards" : "none",
                    opacity: 0,
                  }}
                  className="inline-block border border-[#10553C]/25 rounded-full px-5 py-2.5 mb-8 bg-[#10553C]/6"
                >
                  <span className="text-[#10553C] text-[11px] font-bold uppercase tracking-[.3em]">
                    Official Travelholics Duck Find
                  </span>
                </div>

                <div
                  style={{
                    animation: !d2Visible
                      ? "none"
                      : duckFloat
                        ? "duckFloat 3s ease-in-out infinite"
                        : "duckPop .65s cubic-bezier(.22,.61,.36,1) forwards",
                    opacity: d2Visible ? 1 : 0,
                    filter: "drop-shadow(0 8px 24px rgba(13,45,74,.15))",
                  }}
                  className="text-[96px] leading-none mb-9 block"
                >
                  🦆
                </div>

                <div
                  style={{
                    animation: d3Visible ? "fadeUp .6s ease forwards" : "none",
                    opacity: 0,
                  }}
                >
                  <h1
                    className={`${playfair.className} text-[48px] font-black text-[#0D2D4A] leading-[1.05] mb-2`}
                  >
                    You found it.
                  </h1>

                  <h2
                    className={`${playfair.className} text-[40px] font-bold italic leading-none mb-7`}
                    style={{ color: "#0E9E72" }}
                  >
                    Now claim it.
                  </h2>

                  <p className="text-[#3A5244] text-[17px] leading-[1.85] max-w-[290px] mx-auto mb-9">
                    We&apos;re fellow cruisers who hide ducks for curious
                    travelers. You found ours — and we&apos;re mailing you a
                    real gift, on us.
                  </p>

                  <a
                    href="#form"
                    className="block w-full py-5 bg-[#10553C] text-[#FAF9F6] font-extrabold text-[15px] tracking-[.1em] uppercase rounded-[4px] text-center active:scale-[.98] transition-transform"
                  >
                    Claim My Gift →
                  </a>

                  <p className="text-[#9AA89F] text-[13px] mt-3.5">
                    No purchase necessary. Just a gift from us to you.
                  </p>
                </div>
              </div>
            )}
          </section>

          {formState !== "success" && (
            <section className="px-6 py-16 bg-[#FAF9F6]" id="form">
              <div className="mb-10">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-[3px] h-[72px] bg-[#10553C] rounded-full shrink-0 mt-1" />
                  <div>
                    <div
                      className={`${playfair.className} text-[32px] font-black text-[#0D2D4A] leading-none`}
                    >
                      Where should
                    </div>
                    <div
                      className={`${playfair.className} text-[32px] font-bold italic leading-none mt-1`}
                      style={{ color: "#0E9E72" }}
                    >
                      we send it?
                    </div>
                  </div>
                </div>
                <p className="text-[#6B8077] text-[15px] leading-relaxed ml-[15px]">
                  We&apos;ll follow up by email to get your mailing address.
                </p>
              </div>

              <form className="space-y-8 relative" onSubmit={handleSubmit}>
                <div className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div>
                  <div className="text-[9px] font-bold text-[#10553C] uppercase tracking-[.25em] mb-2">
                    First Name
                  </div>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full bg-transparent border-b-[1.5px] border-[#C8C4BC] py-3 text-[17px] text-[#0D2D4A] placeholder:text-[#C8C4BC] focus:outline-none focus:border-[#10553C] transition-colors"
                  />
                </div>

                <div>
                  <div className="text-[9px] font-bold text-[#10553C] uppercase tracking-[.25em] mb-2">
                    Email Address
                  </div>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full bg-transparent border-b-[1.5px] border-[#C8C4BC] py-3 text-[17px] text-[#0D2D4A] placeholder:text-[#C8C4BC] focus:outline-none focus:border-[#10553C] transition-colors"
                  />
                </div>

                <div>
                  <div className="text-[9px] font-bold text-[#10553C] uppercase tracking-[.25em] mb-2">
                    Where Are You From?
                  </div>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City, State"
                    className="w-full bg-transparent border-b-[1.5px] border-[#C8C4BC] py-3 text-[17px] text-[#0D2D4A] placeholder:text-[#C8C4BC] focus:outline-none focus:border-[#10553C] transition-colors"
                  />
                </div>

                <div>
                  <div className="text-[9px] font-bold text-[#10553C] uppercase tracking-[.25em] mb-3">
                    What&apos;s the Occasion?
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTravelReason(option)}
                        className={`px-4 py-2 text-[11px] font-bold rounded-[2px] tracking-[.05em] transition-all border ${
                          travelReason === option
                            ? "bg-[#0D2D4A] text-[#FAF9F6] border-[#0D2D4A]"
                            : "bg-transparent text-[#0D2D4A] border-[#C8C4BC] hover:border-[#0D2D4A]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {formState === "error" && (
                  <p className="text-red-500 text-[15px] text-center">
                    Something went wrong — please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full py-5 bg-[#10553C] text-[#FAF9F6] font-extrabold text-[15px] tracking-[.1em] uppercase rounded-[4px] active:scale-[.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === "submitting" ? "Sending..." : "Send My Gift"}
                </button>
              </form>
            </section>
          )}

          {formState === "success" && (
            <section className="bg-[#0D2D4A] px-8 py-16 flex flex-col items-center text-center">
              <div className="text-[56px] mb-6">🎉</div>

              <h2
                className={`${playfair.className} text-[36px] font-black text-[#F7F4EF] leading-tight mb-2`}
              >
                You&apos;re officially
              </h2>
              <h2
                className={`${playfair.className} text-[36px] font-bold italic mb-6`}
                style={{ color: "#0E9E72" }}
              >
                one of us.
              </h2>

              <p className="text-[#F7F4EF]/60 text-[17px] leading-[1.85] max-w-[280px] mb-12">
                We&apos;ll send you an email to grab your mailing address —
                then your gift ships out to you.
              </p>

              <div className="w-full space-y-3 text-left">
                <div className="flex gap-4 items-start p-5 border border-[#D4A853]/15 rounded-[4px]">
                  <div className="w-7 h-7 bg-[#D4A853] rounded-full flex items-center justify-center text-[#0D2D4A] font-black text-[11px] shrink-0">
                    1
                  </div>
                  <div>
                    <div className="text-[#F7F4EF] font-bold text-[16px] mb-1">
                      Check your inbox
                    </div>
                    <div className="text-[#F7F4EF]/45 text-[14px] leading-relaxed">
                      Look for an email from us — we&apos;ll ask for your
                      mailing address there to ship your gift.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-5 border border-[#D4A853]/15 rounded-[4px]">
                  <div className="w-7 h-7 bg-[#D4A853] rounded-full flex items-center justify-center text-[#0D2D4A] font-black text-[11px] shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-[#F7F4EF] font-bold text-[16px] mb-1">
                      Follow us on TikTok
                    </div>
                    <div className="text-[#F7F4EF]/45 text-[14px] leading-relaxed">
                      Cruise tips, deals, and trip ideas @rjsmom1 — come sail
                      with us.
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="mt-12 text-[#D4A853] font-extrabold text-[15px] tracking-[.08em] uppercase flex items-center gap-2"
              >
                Explore Travelholics →
              </Link>
            </section>
          )}
        </main>

        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>
    </>
  );
}

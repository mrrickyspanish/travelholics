"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";

type TravelReason = "Vacation" | "Honeymoon" | "Anniversary" | "Family Reunion" | "Birthday" | "Other";
type FormState = "idle" | "submitting" | "success" | "error";

export default function DuckHuntPage() {
  const [travelReason, setTravelReason] = useState<TravelReason>("Vacation");
  const [formState, setFormState] = useState<FormState>("idle");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const duckCount = 47;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");

    try {
      if (supabase) {
        const { error } = await supabase.from("duck_hunt_leads").insert([
          {
            first_name: firstName,
            email,
            city: city || null,
            travel_reason: travelReason,
          },
        ]);
        if (error) throw error;
      }
      setFormState("success");
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error("Duck hunt submission error:", err);
      setFormState("error");
    }
  }

  const travelOptions: TravelReason[] = ["Vacation", "Honeymoon", "Anniversary", "Family Reunion", "Birthday", "Other"];

  return (
    <div className="bg-gray-50 text-gray-900 antialiased overflow-x-hidden min-h-screen">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center px-6 h-16">
        <div className="text-2xl font-black text-blue-900 tracking-[0.2em] font-serif uppercase">
          DUCK HUNT
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-[10px] text-white font-bold border-2 border-white/20">
            🦆
          </div>
        </div>
      </nav>

      <main className="w-full max-w-[390px] mx-auto bg-gray-50 overflow-hidden pt-16 pb-32">
        {/* HERO */}
        <section className="relative min-h-[700px] flex flex-col justify-center px-8 py-16 bg-blue-900 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20 50 10 T 100 10' fill='none' stroke='white' stroke-opacity='0.08' stroke-width='2'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative z-10 text-center">
            <div className="mb-8 transform scale-150 drop-shadow-[0_20px_40px_rgba(245,158,11,0.3)]">
              <span className="text-8xl">🦆</span>
            </div>
            <p className="text-amber-400 font-extrabold uppercase tracking-[0.25em] text-xs mb-4">
              You found something special
            </p>
            <h1 className="text-4xl font-black text-white leading-tight mb-6 tracking-tighter">
              You found a{" "}
              <span className="text-emerald-400 italic">Travelholics duck!</span>
            </h1>
            <p className="text-blue-200 text-lg font-light leading-relaxed mb-10 max-w-[280px] mx-auto">
              We're fellow cruisers who love hiding ducks — and you found ours. Fill out the form below and we'll mail you a real gift, on us.
            </p>
            <div className="inline-flex items-center gap-3 bg-amber-900/30 backdrop-blur-sm px-5 py-4 rounded-full border border-amber-500/20 mb-12">
              <span className="text-2xl">🎁</span>
              <span className="text-amber-300 font-bold text-sm tracking-wide">
                We're mailing you a real gift — no catch
              </span>
            </div>
            <a
              href="#form"
              className="block w-full py-5 bg-emerald-700 text-white font-extrabold text-lg rounded-xl shadow-[0_10px_30px_rgba(5,150,105,0.4)] hover:shadow-amber-500/20 transition-all active:scale-95 text-center"
            >
              Claim My Reward →
            </a>
          </div>
        </section>

        {/* LEAD CAPTURE FORM */}
        {formState !== "success" && (
          <section className="px-6 py-20 bg-gray-50" id="form">
            <div className="bg-[#0d2744] rounded-[2.5rem] p-8 border border-[#1a5f7a] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl text-white">⛵</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2 leading-none">
                Where should
              </h2>
              <h2 className="text-3xl font-serif italic text-emerald-300 mb-8">
                we send it?
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2 px-1">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#162e6e]/40 border-none rounded-2xl py-4 px-5 text-white placeholder:text-blue-300/30 focus:ring-2 focus:ring-amber-400 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2 px-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@travelholic.com"
                    className="w-full bg-[#162e6e]/40 border-none rounded-2xl py-4 px-5 text-white placeholder:text-blue-300/30 focus:ring-2 focus:ring-amber-400 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2 px-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#162e6e]/40 border-none rounded-2xl py-4 px-5 text-white placeholder:text-blue-300/30 focus:ring-2 focus:ring-amber-400 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2 px-1">
                    Where Are You From?
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City, State"
                    className="w-full bg-[#162e6e]/40 border-none rounded-2xl py-4 px-5 text-white placeholder:text-blue-300/30 focus:ring-2 focus:ring-amber-400 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2 px-1">
                    What&apos;s the Occasion?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {travelOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTravelReason(option)}
                        className={`px-4 py-2 text-white text-xs font-bold rounded-full transition-all ${
                          travelReason === option
                            ? "bg-emerald-700 shadow-lg shadow-emerald-900/40"
                            : "bg-blue-900 border border-blue-400/30 hover:bg-blue-800"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {formState === "error" && (
                  <p className="text-red-400 text-sm text-center">
                    Something went wrong — please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full py-5 bg-emerald-700 text-white font-extrabold text-lg rounded-2xl shadow-xl mt-4 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === "submitting" ? "Sending…" : "Send My Gift"}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* SUCCESS STATE */}
        {formState === "success" && (
          <section className="px-8 py-20 bg-gray-50 flex flex-col items-center text-center">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl scale-150" />
              <div className="relative bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-5xl">🎉</span>
              </div>
            </div>
            <h2 className="text-4xl font-black text-blue-900 leading-tight mb-4">
              You&apos;re officially
              <br />
              <span className="italic text-emerald-700">one of us.</span>
            </h2>
            <p className="text-gray-500 mb-12 max-w-[280px]">
              You're duck #{duckCount} found on this voyage! Your exclusive Travelholics gift is on its way.
            </p>
            <div className="w-full space-y-4 text-left">
              <div className="bg-white p-6 rounded-3xl flex items-start gap-5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Check your inbox</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Look for an email from us — we'll ask for your mailing address there to ship your gift.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl flex items-start gap-5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Follow us on TikTok</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    We post cruise tips, deals, and trip ideas @rjsmom1 — come sail with us.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="mt-16 text-emerald-700 font-extrabold flex items-center gap-2"
            >
              Explore Travelholics →
            </Link>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-2 pb-6 bg-white/90 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(30,58,138,0.06)] z-50">
        <div className="flex flex-col items-center justify-center bg-emerald-50 text-emerald-700 rounded-2xl px-4 py-1.5">
          <span className="text-xl">🎯</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Hunt</span>
        </div>
        <div className="flex flex-col items-center justify-center text-blue-400 hover:text-amber-500 transition-all">
          <span className="text-xl">🏅</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Prizes</span>
        </div>
        <div className="flex flex-col items-center justify-center text-blue-400 hover:text-amber-500 transition-all">
          <span className="text-xl">🗺️</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Map</span>
        </div>
        <div className="flex flex-col items-center justify-center text-blue-400 hover:text-amber-500 transition-all">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
        </div>
      </nav>

      {/* Global grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

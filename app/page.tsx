import Image from "next/image";
import Link from "next/link";
import { Anchor, Menu, ShieldCheck, Star, Users, BadgeCheck, ShipWheel, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";

const proofPoints = [
  { icon: ShipWheel, value: "20", label: "Years at Sea" },
  { icon: Users, value: "500+", label: "Happy Travelers" },
  { icon: Anchor, value: "6", label: "Cruise Lines" },
  { icon: BadgeCheck, value: "No", label: "Booking Fees" },
];

const paths = [
  {
    title: "Plan a Cruise",
    copy: "Tell us where you want to go. We’ll help you find the right cruise, cabin, and travel experience.",
    cta: "Start Planning",
    href: "#contact",
    image: "/images/about-on-deck.jpg",
  },
  {
    title: "Join a Group Trip",
    copy: "Travel with amazing people through curated experiences, shared memories, and stress-free coordination.",
    cta: "See Upcoming Trips",
    href: "#group-trips",
    image: "/images/about-with-travelers.jpg",
  },
  {
    title: "Shop Travel Picks",
    copy: "Browse cruise must-haves, travel essentials, and curated finds Yolanda actually recommends.",
    cta: "Shop Now",
    href: "/shop",
    image: "/images/why-insider-secrets.jpg",
  },
];

export default function Home() {
  return (
    <main className="bg-[#fffcf6] text-slate-900">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Image src="/images/travelholics_logo_circular.png" alt="Travelholics" width={58} height={58} className="rounded-full" />
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#about">About</a><a href="#group-trips">Group Trips</a><a href="#travel-picks">Travel Picks</a><a href="#testimonials">Testimonials</a><a href="#contact">Contact</a>
          </nav>
          <a href="#contact" className="rounded-xl bg-[#ef476f] px-4 py-2 text-white font-semibold text-sm">Plan My Cruise</a>
          <button className="md:hidden text-slate-700" aria-label="Menu"><Menu size={22} /></button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <Image src="/images/Travelholics_background.png" alt="Cruise deck" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff9ee]/95 via-[#fff9ee]/82 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 md:py-24 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#10284a]">Curated Cruises.<br/>Real Experience.<br/><span className="text-[#ef476f]">Stress-Free Planning.</span></h1>
            <p className="mt-4 max-w-xl text-lg text-slate-700">Personalized cruise planning, unforgettable group trips, and hand-picked travel finds so you can travel more and worry less.</p>
            <div className="mt-6 flex flex-wrap gap-3"><a href="#contact" className="rounded-xl bg-[#ef476f] px-5 py-3 text-white font-semibold">Plan My Cruise</a><a href="#group-trips" className="rounded-xl border-2 border-[#0ea5a3] px-5 py-3 text-[#0f766e] font-semibold bg-white/90">Explore Group Trips</a></div>
          </div>
          <div className="justify-self-center w-full max-w-sm bg-white/95 rounded-2xl p-4 border border-slate-200 shadow-xl">
            <Image src="/images/hero-yolanda.jpg" alt="Yolanda" width={480} height={480} className="rounded-xl w-full h-64 object-cover" />
            <h3 className="text-3xl mt-3 text-[#ef476f] font-semibold">Hi, I’m Yolanda!</h3>
            <p className="font-semibold text-[#10284a]">Your Cruise Curator & Travel Partner</p>
            <p className="mt-2 text-sm text-slate-600">20+ years in travel and hospitality helping travelers create memories that last a lifetime.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-3 relative z-10"><div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl border border-slate-200 shadow-lg">
        {proofPoints.map(({ icon: Icon, value, label }) => <div key={label} className="p-5 text-center border-r last:border-r-0 odd:border-r md:odd:border-r">
          <Icon className="mx-auto text-[#0ea5a3]" /><div className="text-4xl mt-2 font-bold text-[#10284a]">{value}</div><div className="text-sm text-slate-600">{label}</div>
        </div>)}
      </div></section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <p className="uppercase tracking-[0.2em] text-[#0f766e] font-semibold text-sm text-center">Choose Your Path</p>
        <h2 className="text-4xl font-bold text-[#10284a] text-center mt-2">How Can We Help You Travel?</h2>
        <div className="grid md:grid-cols-3 gap-5 mt-8">{paths.map((card)=><article key={card.title} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
          <Image src={card.image} alt={card.title} width={600} height={350} className="h-44 w-full object-cover"/><div className="p-5"><h3 className="text-2xl font-bold text-[#10284a]">{card.title}</h3><p className="mt-2 text-slate-600">{card.copy}</p><Link href={card.href} className="inline-block mt-4 text-[#0f766e] font-semibold">{card.cta} →</Link></div>
        </article>)}</div>
      </section>

      <section id="about" className="bg-white py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-3 gap-8 items-center">
        <Image src="/images/about-port-of-call.jpg" alt="Yolanda" width={480} height={540} className="rounded-2xl w-full h-full object-cover"/>
        <div><p className="uppercase tracking-[0.2em] text-[#0f766e] font-semibold text-sm">Meet Yolanda</p><h2 className="text-4xl font-bold text-[#10284a] mt-2">Your Trusted Cruise Curator</h2><p className="mt-4 text-slate-700">I’m Yolanda Harris, your cruise lover, travel expert, and go-to person for unforgettable journeys. With over 20 years in travel and hospitality, I help travelers plan with confidence, connect deeply, and enjoy every step of the experience.</p><p className="mt-3 text-slate-700">Whether you’re cruising for the first time or the fiftieth, I treat every trip like it’s my own.</p></div>
        <div className="bg-[#f8fbff] rounded-2xl p-6 border border-slate-200"><ul className="space-y-3 text-slate-700">{["20+ Years in Travel & Hospitality","Certified Cruise Specialist","Preferred Partner with Top Cruise Lines","Group Travel Expert","Personalized, Hands-On Service"].map((item)=><li key={item} className="flex gap-2"><ShieldCheck className="text-[#0ea5a3] mt-0.5" size={18}/><span>{item}</span></li>)}</ul></div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-center"><div><p className="uppercase tracking-[0.2em] text-[#0f766e] font-semibold text-sm">Where We’ve Been</p><h2 className="text-4xl font-bold text-[#10284a] mt-2">Where We’re Going Next</h2><p className="mt-4 text-slate-700">From the turquoise waters of the Caribbean to Alaska, Europe, and beyond, these are some of our favorite destinations and what’s coming up next.</p><a className="inline-block mt-5 rounded-xl border-2 border-[#0ea5a3] px-4 py-2 text-[#0f766e] font-semibold" href="#">Explore Destinations</a></div><div className="rounded-2xl bg-[#dff2f7] border border-slate-200 p-6"><div className="grid grid-cols-2 gap-4 text-[#10284a] font-semibold">{["Caribbean","Alaska","Europe","Asia","Australia"].map((d)=><div key={d} className="flex gap-2"><MapPin className="text-[#ef476f]" size={18}/>{d}</div>)}</div></div></div></section>

      <section id="group-trips" className="bg-white py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><p className="uppercase tracking-[0.2em] text-[#0f766e] font-semibold text-sm text-center">Group Cruise Experiences</p><h2 className="text-4xl font-bold text-[#10284a] text-center mt-2">Travel Better Together</h2><div className="mt-8 grid md:grid-cols-5 gap-4 overflow-x-auto">{["Amazing Destinations","Fun & Connection","Unforgettable Moments","Epic Adventures","Lifelong Memories"].map((t,i)=><article key={t} className="min-w-[220px]"><Image src="/images/about-with-travelers.jpg" alt={t} width={300} height={180} className="rounded-xl w-full h-36 object-cover"/><p className="text-sm text-center mt-2 font-semibold">{t}</p></article>)}</div><div className="text-center mt-6"><a href="#contact" className="inline-block rounded-xl bg-[#ef476f] px-5 py-3 text-white font-semibold">View Upcoming Group Trips</a></div></div></section>

      <section id="travel-picks" className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><p className="uppercase tracking-[0.2em] text-[#0f766e] font-semibold text-sm">Travel Picks + Merch</p><h2 className="text-4xl font-bold text-[#10284a] mt-2">Shop Our Favorite Finds</h2><p className="mt-3 text-slate-700">Travel-tested, creator-approved, and perfect for your next adventure.</p><a href="/shop" className="inline-block mt-5 rounded-xl border-2 border-[#0ea5a3] px-4 py-2 text-[#0f766e] font-semibold">Shop All Picks</a></div></section>

      <section id="testimonials" className="bg-white py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><p className="uppercase tracking-[0.2em] text-[#0f766e] font-semibold text-sm text-center">What Travelers Are Saying</p><h2 className="text-4xl font-bold text-[#10284a] text-center mt-2">Real People. Real Memories.</h2><div className="grid md:grid-cols-3 gap-4 mt-8">{["Yolanda made our cruise effortless and unforgettable!","Best group trip we’ve ever taken.","Professional, warm, and full of insider tips."].map((q,i)=><article key={i} className="rounded-2xl border border-slate-200 p-5"><div className="flex text-[#ef476f]">{Array.from({length:5}).map((_,k)=><Star key={k} size={16} fill="currentColor"/>)}</div><p className="mt-3 text-slate-700">“{q}”</p><p className="mt-3 text-sm font-semibold text-slate-500">Traveler {i+1} • Cruise Guest</p></article>)}</div></div></section>

      <ContactForm />
      <Footer />
    </main>
  );
}

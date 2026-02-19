

credentials.tsx
55 lines

tsx


hero.tsx
198 lines

tsx


why-travelholics.tsx
59 lines

tsx


footer.tsx
85 lines

tsx


social-proof.tsx
68 lines

tsx


timeline.tsx
72 lines

tsx

attached

10:33 PM

Identified uploaded files, anticipated forthcoming request
Identified uploaded files, anticipated forthcoming request

Got the files, Ricky. I see the full component set for Yolanda's Travelholics cruise site — hero with lead form, credentials, why section, social proof, timeline, and footer. What are we doing with these?

Travelholics — Project Handoff Brief
Who This Is For
This is a Creative Eye Studios project built for Yolanda (Ricky's mom), a certified cruise specialist. The site is live on Vercel and targets TikTok-driven traffic (@rjsmom1).
Current State
* Live URL: https://travelholics-26s0mz13u-creativeeyemm.vercel.app/
* Repo: github.com/mrrickyspanish/travelholics (branch: main)
* Status: Successfully deployed after fixing a missing clsx + tailwind-merge dependency in package.json
Stack
* Next.js 16.1.6 (App Router, Turbopack)
* TypeScript
* Tailwind CSS v4
* Framer Motion
* Supabase (form submissions → cruise_inquiries table)
* Vercel hosting
* Lucide React icons
* cn() utility via clsx + tailwind-merge in lib/utils.ts
Design System ("Emerald Voyage")
* Primary: Emerald #059669
* Accent: Warm Gold #f59e0b
* Headers: Deep Navy #1e3a8a
* Background: Cream/Sand warm tones
* Fonts: Geist Sans (body), Playfair Display (accents)
* Style: Sophisticated cruise expert — not resort-beachy, not SaaS
Component Structure

app/
  layout.tsx       ← fonts, metadata, scroll-smooth
  page.tsx         ← assembles all sections

components/
  hero.tsx         ← split layout, form, TikTok badge
  credentials.tsx  ← 4 credential cards
  why-travelholics.tsx ← 3 benefit cards
  social-proof.tsx ← testimonials (placeholder avatars from pravatar.cc)
  timeline.tsx     ← 4-step process + CTA
  footer.tsx       ← 3-col, links to /privacy + /terms
What Was Reviewed
Ricky pulled up the live page and compared it against premium travel advisor sites. The verdict:
Structurally competitive. Visually behind.
Key gaps identified:
1. No hero photography — reads like SaaS, not travel
2. Placeholder avatars (pravatar.cc) still in testimonials
3. TikTok handle is static text, not a linked CTA
4. /privacy and /terms pages likely 404
5. Form success state unconfirmed
6. Copy is functional but not emotionally aspirational
The Ask
Build an upgraded version of the full component suite. Ricky is attaching all 6 component files (hero.tsx, credentials.tsx, why-travelholics.tsx, social-proof.tsx, timeline.tsx, footer.tsx).
The upgrade should:
* Preserve existing Supabase form wiring and submission logic
* Elevate visual storytelling — cinematic feel, destination imagery via Unsplash or next/image
* Upgrade copy to be more aspirational (travel emotion, not feature list)
* Fix TikTok handle → real linked CTA
* Replace pravatar avatars with something cleaner
* Keep the Emerald Voyage palette and animation patterns intact
* Deliver full, paste-ready component files — no fragments
Ricky's Standard
* Full files only — no excerpts
* No assumptions — if something's unclear, ask
* Deployment-ready output
* Reference existing code before writing new code
* Creative Eye Studios quality bar

Show more
10:36 PM

Architected cinematic component upgrades preserving existing logic and design system
Architected cinematic component upgrades preserving existing logic and design system






Let me build out the full upgraded suite. Six files, deployment-ready, preserving all Supabase logic.


Synthesized project scope and prepared component delivery briefing
Synthesized project scope and prepared component delivery briefing








All six files — drop-in replacements, full Supabase logic preserved. Here's what changed across the suite:

hero.tsx — Cinematic Unsplash background with multi-layer gradient overlays (no more SaaS feel). Copy is now emotionally driven ("Your Next Chapter Starts at Sea"). TikTok handle is a real linked CTA with actual TikTok SVG icon and target="_blank". Pravatar avatars replaced with colored initial badges. Form logic and mailto fallback untouched.

credentials.tsx — Flipped from white cards to a navy section with glass-morphism cards and stat callouts (20+, 6, 500+, 30+). Creates visual contrast between sections. Dot-grid texture background for depth.

why-travelholics.tsx — Each card now has an Unsplash destination image header (beach, cliffs, cruise deck). Copy upgraded from feature-list to aspirational ("Secrets Only Insiders Know", "You Pack. I Handle Everything Else."). Section ID #why added for footer nav.

social-proof.tsx — Pravatar images replaced with branded initial avatars using the Emerald Voyage palette colors. Testimonials expanded with more detail and cruise line names. Proper #testimonials section ID.

timeline.tsx — Step numbers now use gold accent badges on the icon circles. Connector line uses gradient fade. Copy is warmer ("Tell Me Your Dream", "Pack Your Bags"). #process section ID added.

footer.tsx — Fixed the Â© and â¤ï¸ encoding bugs. TikTok uses real SVG icon with working link. Badge placeholders now show CLIA/RCCL/CCL labels. Creative Eye Studios is now a linked credit. Footer nav links match the new section IDs.

Everything respects the Emerald Voyage palette, existing animation patterns, and "use client" directives. Paste straight into components/ and push.

Hero
Code · TSX 
Credentials
Code · TSX 
Why travelholics
Code · TSX 
Social proof
Code · TSX 
Timeline
Code · TSX 
Footer
Code · TSX 
i think this looks really really good. but have to ask where is the personalization for Yolanda. the site is so strong but where would we add her so folks knowthis is HERS and not a random travel site.

10:56 PM

Identified key touchpoints to infuse Yolanda's authentic presence throughout
Identified key touchpoints to infuse Yolanda's authentic presence throughout



Great instinct — and honestly that's the gap that separates a polished template from a site that converts TikTok traffic. People clicking through from @rjsmom1 need to land and immediately see the person they followed. Right now the site talks about Yolanda but never shows her.

Here's where I'd inject her presence:

1. Hero — Photo of Yolanda on a cruise. The left column copy says "I'm Yolanda" but there's no face. A professional or candid shot of her on deck, at a port, or even a warm headshot layered into the hero would immediately build trust. TikTok audiences are following a person — they need to see that person the second they land.

2. Dedicated "Meet Your Travel Partner" section — sits between Credentials and Why Travelholics. A split layout: her photo on one side, her personal story on the other. Not a résumé — the why. How she fell in love with cruising, the first trip that changed everything, why she still gets excited helping families plan. This is the emotional anchor of the whole site.

3. Testimonials that name her directly — we already have this partially ("Yolanda found us..."), but leaning harder into it with a small circular photo of her next to a pull quote like "I treat every trip like it's my own family boarding that ship" above the testimonial grid would reinforce it.

4. Footer brand mark — swap the generic Anchor icon for her headshot in a small circle next to "Travelholics." Subtle but powerful.

The biggest unlock is photos. Does Yolanda have any of these available — cruise shots, port photos, a professional headshot? Even good TikTok stills would work. Once I know what assets we're working with, I'll build the "Meet Yolanda" section and update the hero to feature her.

for sure: 2. Dedicated "Meet Your Travel Partner" section — sits between Credentials and Why Travelholics. A split layout: her photo on one side, her personal story on the other. Not a résumé — the why. How she fell in love with cruising, the first trip that changed everything, why she still gets excited helping families plan. This is the emotional anchor of the whole site.

Testimonials that name her directly — we already have this partially ("Yolanda found us..."), but leaning harder into it with a small circular photo of her next to a pull quote like "I treat every trip like it's my own family boarding that ship" above the testimonial grid would reinforce it.
Testimonials that name her directly — we already have this partially ("Yolanda found us..."), but leaning harder into it with a small circular photo of her next to a pull quote like "I treat every trip like it's my own family boarding that ship" above the testimonial grid would reinforce it. - ok sounds good.
we are finalizing a logo just fyi. she def has photos we can use. you can design the next round knowing we want to feature her more per your outline. what are some top performing individual travel agent sites doing?

Show more
10:58 PM

Researched exemplary travel agent sites before designing personalized components
Researched exemplary travel agent sites before designing personalized components

Good call — let me pull some competitive intel before building so we're designing from what's actually converting, not guessing.


Synthesized industry patterns to personalize travel advisor branding strategy
Synthesized industry patterns to personalize travel advisor branding strategy











Solid research. Here's what the top-performing individual advisor sites are doing — and how it applies to Yolanda's site:

The patterns that convert:

The sites that actually book clients — Milk + Honey Travels, Earth + Ocean Travel Co, and Erin Lindeman's site 
Site Builder Report
 — all share a common thread: the advisor IS the brand. Fora's own guidance to advisors emphasizes adopting a conversational tone, including a headshot, sharing favorite destinations and travel style, and using authenticity to build trust 
Fora Travel
. The best-performing profiles spotlight expertise through personal travel guides and trip reports that highlight first-hand experience 
Fora Travel
.

The most effective travel advisor brands share personal travel stories that help potential clients understand expertise, relate to experiences, and build trust 
Ptntravel
. The consistent advice is that your story should be featured prominently on your site and integrated naturally into content — not as a résumé but as an emotional connection 
Ptntravel
.

What this means for Travelholics specifically:

The sites winning aren't the ones with the prettiest stock photos — they're the ones where you land and immediately feel like you know the person. A warm, nurturing brand voice is ideal for family travel and cruise specialists, with ocean blues and sandy beiges reinforcing the niche 
Ptntravel
 — which maps perfectly to the Emerald Voyage palette you already have.

Including an introduction for the travel agent is a key way to build trust 
WebCitz
, and gorgeous photography combined with crisp typography and visible passion behind the brand is what separates standout sites from templates 
Site Builder Report
.

The play for Yolanda:

Her TikTok audience already knows her face and voice. The site needs to feel like an extension of that relationship — not a corporate landing page they've never seen before. The "Meet Yolanda" section and personalized testimonial header will bridge that gap.

Let me build both components now.


Synthesized site redesign strategy emphasizing personal agent branding
Synthesized site redesign strategy emphasizing personal agent branding






Two files — one brand new, one updated.

meet-yolanda.tsx (NEW — drops between Credentials and Why Travelholics)

This is the emotional anchor of the site. Split layout: photo on the left, her origin story on the right. The copy is written in first person, conversational, not résumé-style — modeled after what the top-performing advisor sites do. It opens with "My first cruise changed everything" and closes with "I treat every voyage like it's my own family boarding that ship."

The photo container has a clear placeholder with instructions for swapping in her real image. There's a floating "20+ Years" accent card, trust badges (CLIA Certified, 500+ Travelers), and dual CTAs — one to scroll to the form, one linking to TikTok.

social-proof.tsx (UPDATED — adds Yolanda's personal pull quote)

Now features a centered quote card above the testimonial grid with her quote: "I treat every trip like it's my own family boarding that ship." Includes a placeholder for her headshot that's easy to swap in. The testimonials below it reinforce her name directly in the client stories.

For page.tsx, the section order should now be:

tsx
<Hero />
<Credentials />
<MeetYolanda />        {/* NEW — import from "@/components/meet-yolanda" */}
<WhyTravelholics />
<SocialProof />        {/* UPDATED */}
<Timeline />
<Footer />
Once Yolanda sends over photos — even good TikTok stills or a cruise port shot — search for the REPLACE comments in both files. That's where the next/image components drop in. The moment her face is on that site, conversion from TikTok traffic goes up significantly.

Meet yolanda
Code · TSX 
Social proof
Code · TSX 
ok. we need a rebasing then. I like the feedback and agree. it needs to focus/feature yolanda first. not yolanda behind a brand. thats a different home page to me all together.  https://www.milkandhoneytravels.com/ is prob the closest thing to a modern travel advisor site. I would obviously crank that up 4x but in respectful and intentional ways. we need more imagery spots for me to swap out with my mo. we need to think through graphics and animations (i can see building a traveling cartoonish cruise ship saling down the ocean that triggeres one you hti a certain spot on the page. things LIKE that. these travel pages are simple in nature but youre right. its "whose organizing this?" Do they know wth theyre doing. prove it. ok im in how do I contact them

11:12 PM

Architected Yolanda-centric homepage redesign with immersive visuals
Architected Yolanda-centric homepage redesign with immersive visuals



Let me study the reference site first, then rebuild the whole thing.


Architected Yolanda-first homepage redesign with strategic user journey mapping
Architected Yolanda-first homepage redesign with strategic user journey mapping





I hear you. Full rebase. The current version is a brand site that happens to mention Yolanda. What you're describing is a Yolanda site that happens to be called Travelholics — and that's exactly what converts TikTok traffic.

Let me study that Milk + Honey structure, then rebuild the entire page around the journey you just described:

Who is she → Can she actually do this → Prove it → I'm in → Take my info


Architected Yolanda-centric homepage with animated elements and expandable imagery
Architected Yolanda-centric homepage with animated elements and expandable imagery




Let me build the full rebased vision as a live preview first so you can see and feel it, then I'll output the component files for your Next.js project.


Synthesized website redesign strategy emphasizing personal brand prominence
Synthesized website redesign strategy emphasizing personal brand prominence


Scroll through that. Here's what you're looking at — the full rebased Travelholics, built around the journey you described:

The flow:

Hero — Yolanda's photo IS the hero. Left side is her portrait (placeholder ready to swap), right side is "I'm Yolanda. I plan dream cruises." Not a brand. A person. TikTok CTA is right there because that's where the traffic comes from.
Trust Strip — Dark navy bar with cruise line certifications. Quick credibility gut-check before they scroll deeper.
My Story — Editorial split: her origin story on the left ("It started with one cruise that changed everything"), three swappable photo spots on the right — her on deck, at a port, with travelers. This is where the Milk + Honey "I'm Brianna" energy lives, but cranked up with the photo mosaic grid.
Destination Mosaic — Five image placeholder spots in a magazine-style grid. "I don't just book destinations. I've lived them." This is where you drop in Caribbean, Alaska, Mediterranean shots and it instantly feels like a travel editorial.
🚢 The Sailing Ship — Scroll-triggered animated cruise ship that sails across the screen when you hit it. Smoke puffs, flag waving, wake trail behind it. This is the moment people screenshot and share.
Why Work With Me — Three cards, each with an image swap spot at the top. The copy hits harder because by now they already trust her — this just seals it.
Testimonials — Yolanda's pull quote anchors the section, then client reviews reinforce it. Every testimonial names her directly.
Second Ship — The animation fires again between Process and the form.
Process — Four clean steps. "Tell Me Your Dream" → "Pack Your Bags."
Contact Form — Navy background, Yolanda's face next to the form with "Replies within 24 hours." The form moved from the hero to the bottom because the page earned the right to ask for info by this point.
Image swap spots (11 total): Hero portrait, 3 story photos, 5 destination mosaic, 3 benefit card headers. Every one is clearly labeled with what photo to drop in.

Want me to break this into the individual Next.js component files for your repo, or do you want to refine the layout and copy first?

Travelholics rebase
Code · JSX 
love it. now...

Here’s a tailored, copy‑paste‑ready prompt you can use specifically for your mom’s travel agent website to get high‑value UX and design feedback:
You are a Senior UX/UI Designer and Conversion Specialist with deep experience in travel and booking websites (travel agencies, tour operators, OTAs, and destination sites). Your job is to audit and improve a small business travel agent’s website, with a focus on making it easier for visitors to inquire and book, especially on mobile.
I’ll provide you with:
* The website URL (and any key pages, like homepage, destination pages, and contact/booking forms)
* A short description of my mom’s travel business and her ideal clients
Your tasks:
1. Quick Diagnosis (1–2 paragraphs)
   * Give an overall assessment of the site’s UX, visual design, and clarity of value proposition for a travel agency.
   * Call out the biggest strengths and the most critical weaknesses that could hurt inquiries or bookings.
2. Homepage & Above-the-Fold
   * Evaluate how clearly the site explains who she serves, what she specializes in, and what the primary action should be (call, email, quote request, book a call, etc.).
   * Suggest specific changes to hero section copy, imagery, primary CTA, and layout to reduce confusion and encourage inquiries.
3. Navigation & Information Architecture
   * Assess whether key content is easy to find (destinations, packages, services, testimonials, “About,” contact/quote).
   * Recommend a simple, clear menu structure and labeling strategy for a solo or small travel agent business.
4. Service, Destination, and Package Pages
   * Review how trips/services are presented: level of detail, benefits, pricing transparency, FAQs, and trust elements (reviews, certifications, affiliations).
   * Suggest improvements based on travel UX best practices like clear inclusions/exclusions, key highlights, maps, and itinerary overviews.
5. Booking & Inquiry Flow
   * Analyze how a user would currently inquire or start a booking (forms, phone, email, WhatsApp, etc.).
   * Propose a simplified, step‑by‑step flow with minimal friction (fewest fields, clear progress, clear next steps) optimized for conversion.
6. Mobile UX & Performance
   * Evaluate responsiveness, tap targets, readability, and layout on mobile.
   * Provide concrete recommendations for mobile‑first improvements (sticky contact/quote button, simplified nav, collapsible sections, speed optimizations).
7. Visual Design & Brand Feel
   * Critique typography, color choices, imagery, and spacing with the goal of feeling modern, trustworthy, and aspirational, without looking like a generic OTA.
   * Suggest specific visual improvements (e.g., use of white space, hero images, destination photography, icon usage).
8. Trust, Credibility, and Social Proof
   * Identify where and how to better surface testimonials, reviews, certifications, partnerships, and guarantees to reduce anxiety and increase trust.
9. Content & Messaging
   * Review the tone and clarity of copy, making sure it speaks to her ideal clients (e.g., families, luxury travelers, group travel, cruises, etc.).
   * Suggest improved headlines, section titles, and key messages that emphasize her expertise, personal service, and the benefits of using a travel agent instead of DIY booking.
10. Prioritized Action Roadmap
   * Provide a prioritized list of changes grouped into:
      * “High impact, low effort” (quick wins)
      * “Medium effort, high impact”
      * “Longer‑term improvements”
   * For each, briefly explain why it matters for bookings, usability, or trust.
Throughout your analysis, use plain language, avoid jargon, and assume the site will likely be edited in something like WordPress, Wix, or Squarespace by a non‑developer. When giving suggestions, be as specific and concrete as possible (e.g., “Change this button label to ___,” “Move this section above ___,” “Combine these two menu items into ___”).

Show more
11:25 PM

Prepared to audit Travelholics design against live deployment
Prepared to audit Travelholics design against live deployment

Let me audit the live site first, then map everything against the rebase.


Assembled comprehensive UX audit framework for travel website
Assembled comprehensive UX audit framework for travel website




Now let me compile the full audit into a deliverable you can reference and share.


Assembled comprehensive UX audit framework for travel website
Assembled comprehensive UX audit framework for travel website



Two deliverables — the audit doc and the live rebase prototype.

The audit covers all 10 areas from your prompt against both the live site and the rebase, backed by the competitive research and conversion data. Here's the high-level takeaway from running this through the full framework:

The diagnosis in one sentence: The site earns a B+ for structure and a D for identity — and identity is what converts TikTok traffic.

The three findings that should drive every decision going forward:

1. The form moved to the bottom isn't a downgrade — it's the whole strategy. Travel is a high-consideration purchase. The industry average conversion rate sits around 4.7%, and sites that build trust before asking for info consistently outperform those that lead with forms. The rebase restructures the entire page as a funnel: Who is she → Can she do this → Prove it → I'm in → Take my info. By the time someone hits that form, it's a warm handoff, not a cold ask.

2. One photo shoot fills 11 placeholder spots. Every visual gap on the rebased site is waiting for the same thing — real photos of Yolanda. On deck, at a port, with travelers, headshot for the pull quote. That's the single highest-ROI investment for this site right now.

3. The cruise line trust strip is the quickest win that exists. Dark navy bar, six cruise line names, takes 15 minutes to implement. It's the thing visitors see before they scroll and it immediately answers "is this person legit." The live site buries CLIA in the footer — the rebase puts it front and center.

The roadmap at the bottom of the doc is grouped by effort level so you can sequence the work. Want me to start breaking the rebase into the actual Next.js component files for your repo?

Travelholics ux audit
Document · MD 
Travelholics rebase
Code · JSX 
yes. begin

11:30 PM

Architected modular Next.js component structure for Travelholics design
Architected modular Next.js component structure for Travelholics design




Let me build all 10 component files for the rebased architecture. Full TypeScript, Tailwind, Framer Motion — matching your existing stack.


Inventoried completed components and strategized remaining implementation tasks
Inventoried completed components and strategized remaining implementation tasks












Building the remaining pieces — sticky header, mobile CTA, wave divider, and the page.tsx that wires everything together.


Assembled resources and prepared comprehensive summary
Assembled resources and prepared comprehensive summary






14 files ready for your repo. Here's the full component map and where everything goes:

Drop into /components/:

File	Role
sticky-header.tsx	Transparent → solid nav, mobile hamburger drawer
mobile-cta.tsx	Sticky bottom "Plan My Trip" bar, appears after hero scroll
hero.tsx	Yolanda-first split layout, photo placeholder left, copy + CTAs right
trust-strip.tsx	Navy bar with 6 cruise line certifications
my-story.tsx	Origin story + 3-photo grid with swap spots
wave-divider.tsx	SVG wave transition, configurable from/to colors
destination-mosaic.tsx	5-spot magazine grid with labeled placeholders
ship-divider.tsx	Scroll-triggered animated ship sailing across viewport
why-travelholics.tsx	3 benefit cards with image headers + aspirational copy
social-proof.tsx	Yolanda pull quote + 3 client testimonials with cruise line tags
timeline.tsx	4 warm steps with gold badges + connector line
contact-form.tsx	Navy section, Supabase wiring preserved, "Let's Set Sail" CTA
footer.tsx	Fixed encoding, TikTok linked, Creative Eye credit
Drop into /app/:

File	Role
page.tsx	Assembles everything in the trust journey order
Notes for integration:

The old credentials.tsx and meet-yolanda.tsx from the first build are replaced by trust-strip.tsx and my-story.tsx respectively — you can delete the old ones
contact-form.tsx preserves your existing @/lib/supabase import and cruise_inquiries table insert
Every image swap spot is commented with the exact <Image> replacement code
11 photo placeholders total across the site waiting for Yolanda's shots
Page
Code · TSX 
Sticky header
Code · TSX 
Mobile cta
Code · TSX 
Hero
Code · TSX 
Trust strip
Code · TSX 
My story
Code · TSX 
Wave divider
Code · TSX 
Destination mosaic
Code · TSX 
Ship divider
Code · TSX 
Why travelholics
Code · TSX 
Social proof
Code · TSX 
Timeline
Code · TSX 
Contact form
Code · TSX 
Footer
Code · TSX 





Claude is AI and can make mistakes. Please double-check responses.
Hero · TSX
Copy

"use client";

import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center bg-[#FAF9F6] overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1e3a8a 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-6 py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Yolanda's Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            {/* Decorative frame offset */}
            <div className="absolute -top-3 -left-3 right-3 bottom-3 border-2 border-[#f59e0b]/20 rounded-[20px] -z-10" />

            {/* Main photo container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#059669]/10 via-[#1e3a8a]/5 to-[#f59e0b]/10 border-2 border-dashed border-[#059669]/20">
              {/*
                REPLACE with Yolanda's actual photo:
                <Image
                  src="/images/yolanda-hero.jpg"
                  alt="Yolanda — Certified Cruise Specialist and founder of Travelholics"
                  fill
                  className="object-cover"
                  priority
                />
              */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-[#059669]/15 flex items-center justify-center mb-4">
                  <Anchor size={36} className="text-[#059669]" />
                </div>
                <p className="text-[#1e3a8a] font-bold text-lg mb-1">
                  Yolanda&apos;s Photo
                </p>
                <p className="text-slate-400 text-sm">
                  Hero portrait — cruise, port, or professional shot
                </p>
              </div>
            </div>

            {/* Floating years badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-4 -right-4 lg:-right-6 bg-[#059669] text-white rounded-2xl px-5 py-3 shadow-xl shadow-emerald-900/30"
            >
              <p className="text-3xl font-extrabold leading-none">20+</p>
              <p className="text-xs text-emerald-100 mt-0.5">
                Years at Sea
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Intro Copy */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#059669]/10 text-[#059669] text-sm font-semibold mb-6"
            >
              <Anchor size={14} />
              <span className="uppercase tracking-wider text-xs">
                Certified Cruise Specialist
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] leading-[1.05] tracking-tight mb-6"
            >
              I&apos;m Yolanda.
              <br />
              <span className="text-[#059669]">I plan dream cruises.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg lg:text-xl text-slate-500 leading-relaxed max-w-lg mb-8"
            >
              For over two decades, I&apos;ve been the person families call when
              they want a cruise that&apos;s actually unforgettable — not just
              okay. I handle every detail so you can focus on making memories.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <button
                onClick={scrollToContact}
                className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Plan My Trip ✦
              </button>
              <a
                href="https://www.tiktok.com/@rjsmom1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-[#059669] bg-white text-[#1e3a8a] font-bold px-6 py-4 rounded-xl transition-all hover:-translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" />
                </svg>
                Follow @rjsmom1
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  { bg: "bg-[#059669]", text: "YT" },
                  { bg: "bg-[#f59e0b]", text: "MR" },
                  { bg: "bg-[#1e3a8a]", text: "SJ" },
                  { bg: "bg-rose-500", text: "ED" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${a.bg} border-2 border-[#FAF9F6] flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {a.text}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-[#1e3a8a] font-bold">500+</span> happy
                travelers
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
File attachment - Claude

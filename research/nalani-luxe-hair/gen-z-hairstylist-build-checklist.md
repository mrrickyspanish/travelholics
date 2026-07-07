# Nalani Luxe Hair — Build Checklist for Claude Code Sessions

This checklist translates the full ecosystem research into actionable tasks. Use it to guide the MVP build and subsequent iterations. Each item is scoped to a specific build decision.

---

## 1. Site Architecture (5 Pages)

| Page | Primary Purpose | Must-Have Sections |
| :--- | :--- | :--- |
| **Home** | First impression + conversion entry | Hero (value prop + CTA), Featured Services (3–4 cards), Founder teaser, Testimonials |
| **Services & Pricing** | Decision support | Visual card grid by category; each card: photo, name, starting price, duration, "Select" |
| **Portfolio** | Trust building | Instagram-style grid, filterable by style; real photos only, no stock |
| **Policies & FAQ** | Objection handling | Cancellation policy, deposit rules, no-show fee, prep instructions, "For Parents" section |
| **About** | Connection + credibility | Founder story in her voice, real photo, training/experience note, social links |

---

## 2. Mobile-First UX Checklist

All design decisions start from a 375px viewport. Verify each item on a real device before shipping.

- Sticky "Book Now" bar visible at all times on mobile (bottom of screen).
- All tap targets ≥ 44×44 pixels.
- Page load time under 3 seconds (compress all images before upload).
- Navigation: hamburger menu or bottom tab bar — not a full desktop nav.
- Hero section value proposition visible without scrolling on a standard phone.
- Dark mode support (optional for MVP, strong signal of design quality for Gen Z).

---

## 3. Booking Flow Requirements

The booking flow must complete in four steps with no account creation required.

**Step 1 — Service Selection:** Visual card grid. Each card shows a real photo, style name, starting price, and duration. "Select" initiates the flow.

**Step 2 — Date & Time:** Custom calendar component (not native browser input). Gray out unavailable dates. Show "Join Waitlist" when a date is fully booked. Lock the selected slot for 10 minutes during checkout.

**Step 3 — Intake Form:** Collect name, phone (`type="tel"`), email (`type="email"`), hair length (dropdown), brief hair history (text field), and inspiration photo upload (`accept="image/*" capture="environment"`). Maximum six fields. Enable auto-fill.

**Step 4 — Deposit & Confirmation:** Show full price breakdown (total, deposit due now, balance due at appointment). Display cancellation policy with a required checkbox. Support Apple Pay and Google Pay. On success: send automated SMS confirmation with prep instructions within 2 minutes.

---

## 4. Key Components to Build

| Component | Notes |
| :--- | :--- |
| `ServiceCard` | image, name, startingPrice, duration, onSelect handler |
| `BookingFlow` | Multi-step wizard; maintains state across steps |
| `PortfolioGrid` | Lazy-loaded, filterable by style category |
| `PolicyAccordion` | Collapsible sections; friendly, non-aggressive language |
| `TestimonialSlider` | Auto-rotating, touch-swipeable |
| `StickyBookingCTA` | Fixed bottom bar on mobile only |
| `WaitlistForm` | Triggered on fully booked dates |

---

## 5. Booking Platform Integration

**Recommended: GlossGenius** (beauty-industry-specific, mobile-first, flat-rate pricing, supports deposits + intake forms + automated reminders). Alternative: Square Appointments (free solo tier, broader integrations, less beauty-specific UI).

Integration must support: deposit collection at booking time (50% of service total), intake form with photo upload, automated SMS/email reminders (24 hours before, 2 hours before), post-appointment follow-up with review link.

---

## 6. Trust Signals Checklist

**For Teen Clients:** Real before-and-after portfolio photos. Transparent pricing on every service. Active social links (TikTok + Instagram). Founder story that is authentic and relatable.

**For Parents:** "For Parents" FAQ section covering: what the booking process looks like, how payment works, drop-off and pick-up process, and direct contact method. Secure payment badges at checkout. Clear cancellation policy framed as mutual respect, not punishment.

---

## 7. Analytics Events (Instrument from Day One)

Track these events in Google Analytics 4 or equivalent from the first day of launch.

| Event | Trigger |
| :--- | :--- |
| `page_view` | Every page load |
| `click_book_now` | Any CTA click; include `source_section` property |
| `select_service` | Service card selection |
| `start_checkout` | Entering payment step |
| `complete_booking` | Successful deposit payment |
| `booking_abandoned` | Exiting flow before completion; include `last_step` |
| `waitlist_join` | Joining a waitlist |

---

## 8. Social Integration Checklist

- Bio link on TikTok and Instagram points directly to the mobile booking page (not the homepage).
- Google Business Profile is complete with current photos, hours, and a booking link.
- Post-appointment automated SMS includes a direct link to leave a Google review.
- Website footer includes prominent TikTok and Instagram icons.

---

## 9. Seasonal Content Triggers (Build Awareness)

Build these dates into the content calendar and consider surfacing seasonal messaging on the website homepage during peak windows.

| Season | Window | Content Angle |
| :--- | :--- | :--- |
| Back-to-School | Late July – Early September | Fresh protective styles; parent-friendly booking |
| Homecoming | September – October | Event-ready styles; limited availability messaging |
| Holiday | November – December | Polished looks; gift card promotion |
| Prom & Graduation | April – June | High-stakes event styles; advance booking urgency |
| Summer | June – August | Vacation-ready protective styles; portfolio building |

---

## 10. Post-Launch Experiments (Priority Order)

1. **CTA Copy Test:** "Book Now" vs. "Secure Your Spot" vs. "Check Availability."
2. **Intake Form Timing:** Photo upload during booking vs. in a post-booking follow-up email.
3. **Pricing Display:** Exact price vs. "Starting at" for complex styles.
4. **Social Proof at Checkout:** Test adding testimonials to the payment step.
5. **Parent FAQ Visibility:** Dedicated nav link vs. embedded in the FAQ page.

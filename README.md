# Travelholics - Cruise Planning Landing Page

Expert cruise planning website for Travelholics, specializing in Royal Caribbean cruises and family/group travel.

## 🎨 Brand Colors

- **Emerald Green**: `#059669` (Primary/CTAs)
- **Deep Emerald**: `#047857` (Hover states)
- **Soft Emerald**: `#d1fae5` (Backgrounds)
- **Warm Gold**: `#f59e0b` (Accents)
- **Deep Navy**: `#1e3a8a` (Text/Headers)
- **Ocean Teal**: `#0891b2` (Secondary)
- **Neutrals**: Cream `#faf8f3`, Sand `#e7e5e4`, Charcoal `#292524`

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (form submissions)
- **Deployment**: Vercel

## 📦 Project Structure

```
travelholics/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   ├── globals.css         # Global styles + Tailwind
│   ├── privacy/page.tsx    # Privacy policy
│   └── terms/page.tsx      # Terms of service
├── components/
│   ├── hero.tsx            # Hero section with form
│   ├── credentials.tsx     # Experience highlights
│   ├── why-travelholics.tsx # Benefits section
│   ├── social-proof.tsx    # Testimonials
│   ├── timeline.tsx        # Process steps
│   └── footer.tsx          # Footer with links
├── lib/
│   ├── utils.ts            # Utility functions (cn)
│   └── supabase.ts         # Supabase client config
└── ...config files
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key

# Contact Email (for mailto: form V1)
NEXT_PUBLIC_CONTACT_EMAIL=your_email@example.com

# Server Email Notifications
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Travelholics <hello@yourdomain.com>

# USPS address verification (optional — Duck Hunt shipping addresses)
# Free credentials from https://developer.usps.com. Leave unset and
# addresses are still format-checked, just not verified against USPS.
USPS_CONSUMER_KEY=your_usps_consumer_key
USPS_CONSUMER_SECRET=your_usps_consumer_secret

# Scheduled jobs. Vercel only sends the Authorization header when this is set,
# and /api/cron/group-trip-reminders rejects every request without it.
CRON_SECRET=a_long_random_string_you_generate

# Optional. Signs newsletter unsubscribe links. Falls back to
# SUPABASE_SERVICE_ROLE_KEY when unset; changing it invalidates links in
# already-delivered email.
NEWSLETTER_UNSUBSCRIBE_SECRET=another_long_random_string
```

### 3. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API to get your project URL and anon key
4. Run this SQL in the SQL Editor:

```sql
-- Create cruise_inquiries table
create table cruise_inquiries (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source text default 'website'
);

-- Enable Row Level Security
alter table cruise_inquiries enable row level security;

-- Create policy to allow inserts from anyone
create policy "Allow public inserts"
  on cruise_inquiries
  for insert
  to anon
  with check (true);

-- Create policy to allow authenticated reads (for future admin dashboard)
create policy "Allow authenticated reads"
  on cruise_inquiries
  for select
  to authenticated
  using (true);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Browser validation

With the development server running, install Chromium once with `npx playwright install chromium`, then run:

```bash
npm run check:home-ux
npm run check:orphans
npm run check:type-floor
```

`check:home-ux` covers responsive layouts, keyboard navigation, reduced motion,
no-JavaScript content, campaign attribution, and contact validation/failure/retry.
It also checks scroll-driven section scaling, stable layout height, full-width
desktop group presentation, high-resolution coastal imagery, and live
motion-preference changes.
It intercepts lead and email requests with synthetic data; it does not send live inquiries.
For an existing system Chromium, set `PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium`.
Set `UX_BASE_URL` to check another local server with `check:home-ux`.

## 📧 Form Submission Flow (V1)

### Newsletter and Duck Hunt production setup

The Duck Hunt prize opt-in and footer newsletter signup require the Supabase newsletter schema to exist before production submissions will work. Run `supabase/migrations/20260602_add_newsletter_subscribers.sql` in the Supabase SQL Editor, or run the full `supabase_schema.sql` for a fresh Supabase project.

For production on Vercel, confirm these environment variables are set:

| Variable | Required For |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Connecting the site and API routes to Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase inserts and browser-safe access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side upserts, duplicate subscriber handling, Duck Hunt lead-to-subscriber linking, and owner-only admin password resets at `/admin/access` |
| `RESEND_API_KEY` | Email notifications for forms and newsletter signups |
| `RESEND_FROM_EMAIL` | Branded sender address once the sending domain is verified in Resend |
| `NEWSLETTER_AUTOREPLY_ENABLED` | Optional. Set to `false` to disable subscriber confirmation emails |
| `USPS_CONSUMER_KEY` | Optional. Verifying Duck Hunt shipping addresses against the USPS Addresses API. Named as developer.usps.com issues it |
| `USPS_CONSUMER_SECRET` | Optional. Pairs with `USPS_CONSUMER_KEY` |
| `USPS_API_BASE` | Optional. Defaults to `https://apis.usps.com`; set to `https://apis-tem.usps.com` for USPS's test environment |
| `CRON_SECRET` | **Required for scheduled jobs.** Without it `/api/cron/group-trip-reminders` returns 401 on every run and no reminder is ever sent |
| `NEWSLETTER_UNSUBSCRIBE_SECRET` | Optional. Signs unsubscribe links; falls back to `SUPABASE_SERVICE_ROLE_KEY` |

### Duck Hunt address verification

Shipping addresses are always format-checked on the server (`lib/address-validation.ts`,
covered by `npm run check:address`). With `USPS_CONSUMER_KEY` / `USPS_CONSUMER_SECRET` set they
are additionally checked against the USPS Addresses API.

The USPS check is advisory and fails open. If it is unconfigured, USPS is unreachable, or
the request times out, the claim still goes through and the row is recorded as `unchecked` —
nobody loses a prize because a third-party API had a bad afternoon. An address USPS will not
confirm is offered back to the entrant once ("use this address anyway") and recorded as
`unconfirmed_accepted`, so `duck_hunt_leads.address_verification` is the queue of rows worth
a human glance before postage.

Newsletter signup notifications are sent to `news@yotravelholic.com` with a BCC to `ricky@creativeeyestudios.com`. If `RESEND_API_KEY` is missing, newsletter records can still be saved, but the notification email is skipped.
Subscribers also receive a confirmation response email by default. To disable that behavior while using external campaigns, set `NEWSLETTER_AUTOREPLY_ENABLED=false`.

Currently using an automatic server-side flow:

1. **User submits form** → Data is saved to Supabase where applicable
2. **Server route sends email** → `/app/api/submit-form/route.ts` delivers the message through Resend
3. **You receive:** Form data at hello@yotravelholic.com with a BCC to ricky@creativeeyestudios.com

### Fast Follow: Resend API (V2)

To configure the automatic email notifications:

1. Sign up at [resend.com](https://resend.com) (free tier: 3K emails/month)
2. Get your API key
3. Add to `.env.local`: `RESEND_API_KEY=your_key`
4. Optionally add `RESEND_FROM_EMAIL=Travelholics <you@yourdomain.com>` if you have a verified sender

## 🌐 Deployment to Vercel

### Via GitHub (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial Travelholics site"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Configure Domain:**
   - In Vercel project settings → Domains
  - Add `yotravelholic.com` and `www.yotravelholic.com`
   - Copy the DNS records provided

4. **Update DNS at Domain Registrar:**
   - Add the A record or CNAME provided by Vercel
   - Wait 24-48 hours for DNS propagation

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
# Follow prompts to deploy
```

## 📊 Viewing Form Submissions

### Option 1: Supabase Dashboard
1. Go to your Supabase project
2. Navigate to Table Editor → `cruise_inquiries`
3. View all submissions with timestamps

### Option 2: Build Admin Dashboard (Future)
Create a simple admin page with authentication to view and manage inquiries.

## 🎯 Key Features

- **Form-First Design**: Above-the-fold contact form for immediate conversion
- **TikTok Integration**: Optimized for traffic from @rjsmom1
- **Mobile Responsive**: Fully responsive design for all devices
- **Performance**: Optimized images, animations, and load times
- **SEO Ready**: Proper meta tags, semantic HTML, and structured data
- **Accessible**: WCAG 2.1 compliant with keyboard navigation

## 🎨 Customization Guide

### Updating Content

**Hero Headline:** Edit `components/hero.tsx` line 60-64  
**Benefits:** Edit `benefits` array in `components/why-travelholics.tsx`  
**Testimonials:** Edit `testimonials` array in `components/social-proof.tsx`  
**Process Steps:** Edit `steps` array in `components/timeline.tsx`

### Changing Colors

Edit `tailwind.config.ts` to update the color palette.

### Adding Logo

1. Add logo file to `/public/logo.png`
2. Update `components/hero.tsx` to include logo image
3. Update `components/footer.tsx` to replace text with logo

## 📱 Social Media Links

TikTok: [@rjsmom1](https://www.tiktok.com/@rjsmom1)

## 🐛 Troubleshooting

**Form not submitting?**
- Check that Supabase environment variables are set correctly
- Verify the `cruise_inquiries` table exists in Supabase
- Check browser console for errors

**Mailto: not opening?**
- This is expected behavior - requires user to have email client configured
- Consider upgrading to Resend API for automated emails

**Images not loading?**
- Verify Unsplash URLs are accessible
- Replace with your own images in `/public` folder

## 📈 Analytics Setup (Optional)

### Google Analytics
1. Get your GA4 Measurement ID
2. Add to `app/layout.tsx` using next/script
3. Add tracking events to form submission

### Vercel Analytics
Already included - just enable in Vercel dashboard

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Keep Supabase anon key public-facing (it's designed for this)
- Enable RLS (Row Level Security) policies in Supabase
- Use service role key only for server-side operations

## 📞 Support

Questions? Contact: info@creativeeyestudios.com

## 📄 License

© 2025 Travelholics. All rights reserved.

---

Built with ❤️ by Creative Eye Studios


### Newsletter unsubscribe

Every signup form on the site promises "I understand I can unsubscribe anytime".
`/unsubscribe` is where that promise is kept.

Links are signed. The token is an HMAC of the recipient's address
(`lib/newsletter-unsubscribe-token.ts`), so a link only works for the address it
was issued for — without that, anyone who can guess an address could unsubscribe
that person, or walk a list and unsubscribe everybody. `npm run check:unsubscribe`
covers the forgery cases: wrong address, wrong key, truncated, padded, flipped
character, and garbage.

List email carries both halves of the mechanism:

- a visible **Unsubscribe** link in the footer, and
- `List-Unsubscribe` / `List-Unsubscribe-Post` headers (RFC 2369 / RFC 8058), which
  give Gmail and Outlook their native unsubscribe control. That control is what
  keeps recipients off the "mark as spam" button, which is what damages sending
  reputation.

The endpoint accepts a JSON post from the confirmation page, a plain form post
(so it still works with JavaScript off — mail clients often open links in a
stripped-down webview), and the one-click header post. A browser navigation is
redirected to a confirmation page; a mail client gets a plain 200.

Unsubscribing sets `consent_status = 'unsubscribed'` and stamps `unsubscribed_at`.
**Any future send must filter on `consent_status = 'subscribed'`.** Re-subscribing
is still possible through any opt-in form, which is deliberate: each of those forms
carries its own consent text, so a later opt-in is genuine re-consent.


### Email drip campaigns

Supabase is the only subscriber list. Nothing is mirrored into a hosted email
tool, because a second copy means two answers to "has this person
unsubscribed" — and the wrong answer mails someone who asked you to stop.

`/api/cron/email-campaigns` runs hourly and does two things per active
campaign: enrols eligible new subscribers, then sends at most one due step per
enrollment.

Four rules carry the safety of this, each covered by
`npm run check:email-campaigns`:

1. **One row per (enrollment, step), enforced by a unique constraint.** The
   worker *claims* a send by inserting that row **before** calling Resend, so a
   retry, an overlapping run or a second worker collides on the constraint
   instead of sending twice.
2. **`enroll_from` bounds enrollment.** A campaign only ever reaches
   subscribers who joined at or after it went live. Without this, activating a
   campaign would enrol the whole back catalogue and mail years of subscribers
   at once — which is how a sending reputation dies in an afternoon.
3. **Consent is re-checked immediately before each send**, not just at
   enrollment. Anyone who unsubscribed mid-drip has their enrollment cancelled.
4. **One step per run.** A long-overdue enrollment catches up at one email per
   hour rather than firing the whole sequence in a minute.

A send stuck at `pending` means the worker died after handing the message to
Resend. It is deliberately **not** retried: Resend may already have delivered
it, and a duplicate is worse than a miss. Only `failed` rows retry, up to
`MAX_SEND_ATTEMPTS`.

Campaigns ship as `status = 'draft'` and send nothing. Activating one is a
deliberate act:

```sql
update public.email_campaigns
   set status = 'active', enroll_from = now()
 where slug = 'cruise-life-welcome';
```

Set `enroll_from = now()` as you activate, so the drip starts with the people
who join next rather than everyone who ever joined.

Bodies live in `lib/email-campaign-templates.ts`, keyed by `template_key`.
`renderCampaignEmail` appends the unsubscribe footer, so no drip email can be
assembled without one.

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

# Contact Email (for mailto: form V1)
NEXT_PUBLIC_CONTACT_EMAIL=your_email@example.com
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

## 📧 Form Submission Flow (V1)

Currently using a hybrid approach:

1. **User submits form** → Data saved to Supabase `cruise_inquiries` table
2. **Triggers mailto:** link → Opens user's email client with pre-filled email to you
3. **You receive:** Form data via email with all inquiry details

### Fast Follow: Resend API (V2)

To upgrade to automated email notifications:

1. Sign up at [resend.com](https://resend.com) (free tier: 3K emails/month)
2. Get your API key
3. Add to `.env.local`: `RESEND_API_KEY=your_key`
4. Create `/app/api/submit-inquiry/route.ts` using Resend SDK
5. Update form submission in `components/hero.tsx` to call API route

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
   - Add `yotravelholics.com` and `www.yotravelholics.com`
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
-- ============================================================
-- Articles table — Travelholics content engine
-- Categories: trip-blog | cruise-news | deal | shop-announcement
-- ============================================================

CREATE TABLE IF NOT EXISTS public.articles (
  id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  slug                TEXT                     NOT NULL UNIQUE,
  title               TEXT                     NOT NULL,
  subtitle            TEXT,
  excerpt             TEXT,
  body                JSONB                    NOT NULL DEFAULT '[]'::jsonb,
  category            TEXT
                          CHECK (category IS NULL OR category IN ('trip-blog', 'cruise-news', 'deal', 'shop-announcement')),
  author              TEXT                     NOT NULL DEFAULT 'Yolanda',
  cover_image         TEXT,
  cover_alt           TEXT,
  tags                TEXT[]                   NOT NULL DEFAULT '{}'::TEXT[],
  featured            BOOLEAN                  NOT NULL DEFAULT false,
  published           BOOLEAN                  NOT NULL DEFAULT false,
  published_at        TIMESTAMP WITH TIME ZONE,
  meta_title          TEXT,
  meta_description    TEXT,
  deal_expires_at     TIMESTAMP WITH TIME ZONE,
  deal_original_price TEXT,
  deal_sale_price     TEXT,
  cta_label           TEXT,
  cta_url             TEXT,
  -- AI article-generator admin workflow (drafts, pre-publish)
  content             TEXT,
  seo_title           TEXT,
  seo_description     TEXT,
  topic_cluster       TEXT,
  keyword             TEXT,
  scenario            TEXT,
  status              TEXT                     NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'published', 'archived')),
  word_count          INTEGER,
  compliance_flags    TEXT[]                   NOT NULL DEFAULT '{}'::TEXT[],
  is_voice_example    BOOLEAN                  NOT NULL DEFAULT false
);

DROP TRIGGER IF EXISTS set_articles_updated_at ON public.articles;
CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS articles_category_idx     ON public.articles (category);
CREATE INDEX IF NOT EXISTS articles_published_idx    ON public.articles (published, published_at DESC);
CREATE INDEX IF NOT EXISTS articles_slug_idx         ON public.articles (slug);
CREATE INDEX IF NOT EXISTS articles_status_idx       ON public.articles (status);
CREATE INDEX IF NOT EXISTS articles_featured_idx     ON public.articles (featured);
CREATE INDEX IF NOT EXISTS articles_tags_idx         ON public.articles USING GIN (tags);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated can manage articles"  ON public.articles;

CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "Authenticated can manage articles"
  ON public.articles FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- Seed: example articles for all four categories
-- ============================================================

INSERT INTO public.articles (
  slug, title, subtitle, excerpt, body, category, author,
  tags, featured, published, published_at,
  meta_title, meta_description, cta_label, cta_url,
  deal_expires_at, deal_original_price, deal_sale_price
) VALUES

(
  'first-alaskan-cruise-what-no-one-told-us',
  'Our First Alaskan Cruise — What No One Told Us',
  'From Ketchikan to Glacier Bay: the raw, real story',
  'We booked Alaska on a whim. Seven days later, I came home a completely different traveler. Here''s everything I wish someone had told me before we set sail.',
  '[
    {"type":"p","text":"Alaska was never on our radar. We were Caribbean people — sun, sand, and rum punch. Then a client called me raving about Glacier Bay, and something clicked. Within 48 hours we had booked a 7-night Norwegian cruise roundtrip from Seattle. Best impulsive decision we have ever made."},
    {"type":"h2","text":"Pack for Four Seasons in One Day"},
    {"type":"p","text":"I cannot stress this enough: Alaska''s weather has a sense of humor. Our first port, Ketchikan, greeted us with light drizzle and 55°F. By noon it was 68°F and sunny. By 4pm, back to drizzle. Layers are not optional — they are survival gear."},
    {"type":"quote","text":"The moment Glacier Bay came into view, every single passenger went silent. You could hear calving ice hitting the water from half a mile away.","attribution":"Yolanda, aboard Norwegian Encore"},
    {"type":"h2","text":"Glacier Bay is Not a Destination — It''s a Religion"},
    {"type":"p","text":"Every nature doc you have ever seen about Alaska? It undersells it. The ship slows to a crawl as you enter the national park. Park rangers come aboard and narrate the entire 8-hour transit. It is completely included in your cruise — no extra charge, no tender boat. Just you, standing on deck, jaw somewhere on the floor."},
    {"type":"h2","text":"The Wildlife Situation"},
    {"type":"p","text":"We saw humpback whales breaching on Day 2, a brown bear on the Juneau shore during a whale watching excursion, and bald eagles literally everywhere. I stopped counting at 30. If wildlife is your thing, Alaska will ruin everywhere else for you."},
    {"type":"list","items":["Book whale watching in Juneau early — they fill up fast","Skagway''s White Pass railway is worth every penny","Ketchikan''s Creek Street is touristy but genuinely fun","Glacier Bay transit day is the highlight — stay on deck all day"]},
    {"type":"p","text":"If you have been on the fence about Alaska, get off the fence. I''m booking again next summer and I want you on that ship with me. Let''s plan it together."}
  ]'::jsonb,
  'trip-blog', 'Yolanda',
  ARRAY['alaska', 'norwegian cruise', 'glacier bay', 'first-timer'],
  true, true, '2026-05-18 10:00:00+00',
  'Our First Alaskan Cruise — What No One Told Us | Travelholics',
  'Yolanda shares the honest story of her first Alaskan cruise — packing tips, Glacier Bay, and wildlife that changed everything.',
  'Plan Your Alaska Cruise', '/cruises/alaska',
  NULL, NULL, NULL
),

(
  '48-hours-in-cozumel-cruise-port-guide',
  '48 Hours in Cozumel: A Cruise Port Insider''s Guide',
  'Skip the tourist traps. Here''s where locals actually go.',
  'Cozumel is one of the most visited cruise ports in the Caribbean — and most people only scratch the surface. After six visits, I finally know what to skip and what to savor.',
  '[
    {"type":"p","text":"Let me be honest with you: the first three times I visited Cozumel, I did it wrong. I stayed near the pier, overpaid for tourist-trap restaurants, and thought I had seen everything. It took a locals-only tour guide named Carlos to show me what Cozumel actually is."},
    {"type":"h2","text":"The Reefs Are the Real Star"},
    {"type":"p","text":"Cozumel sits on the second-largest barrier reef in the world. If you have never snorkeled or dived here, you are missing the entire point of stopping here. Palancar Reef is jaw-dropping — visibility often exceeds 100 feet, the coral formations are massive, and the fish life is absurd in the best way."},
    {"type":"list","items":["Palancar Reef for snorkeling/diving (book through a local operator, not the ship)","Punta Sur Eco Beach Park for the lighthouse and crocodile lagoon","Mercado Municipal for fresh ceviche at local prices","Nachi Cocom beach club if you want a day-pass beach experience"]},
    {"type":"h2","text":"The Food Situation"},
    {"type":"p","text":"The stretch right by the pier is designed for tourists and priced accordingly. Walk five blocks inland and the prices drop by half and the quality doubles. I always hit a local cocina económica for fish tacos that cost less than my morning coffee back home."},
    {"type":"quote","text":"The ceviche at Mercado Municipal changed my life. I am not being dramatic. I think about it regularly.","attribution":"Yolanda"},
    {"type":"h2","text":"What to Actually Skip"},
    {"type":"p","text":"The all-inclusive beach clubs nearest the pier are convenient but crowded. The tequila tasting tours are fun but overpriced. Rent a moped or golf cart instead and explore the island''s eastern undeveloped coast — totally free and absolutely stunning."},
    {"type":"p","text":"Ready to get Cozumel right? I can build you an itinerary that actually reflects the real island. Reach out and let''s talk."}
  ]'::jsonb,
  'trip-blog', 'Yolanda',
  ARRAY['cozumel', 'caribbean', 'cruise port', 'mexico', 'snorkeling'],
  false, true, '2026-05-28 09:00:00+00',
  '48 Hours in Cozumel: A Cruise Port Insider''s Guide | Travelholics',
  'After six visits to Cozumel, Yolanda shares what to skip, where locals eat, and why the reef changes everything.',
  'Plan a Caribbean Cruise', '/cruises/caribbean',
  NULL, NULL, NULL
),

(
  'royal-caribbean-icon-class-2026-whats-new',
  'Royal Caribbean''s Icon Class: Everything That''s Changed for 2026',
  'Bigger ships, bolder features, and a few things that surprised us',
  'Royal Caribbean''s Icon-class ships are redefining what a cruise ship can be. Here''s the full breakdown of new amenities, what lives up to the hype, and what to book first.',
  '[
    {"type":"p","text":"Royal Caribbean has been making waves — literally — with its Icon-class ships. These are the largest passenger vessels ever built, and they are packed with features that were unthinkable on a cruise ship five years ago. Here''s the honest rundown."},
    {"type":"h2","text":"The Headliners: What''s Actually New"},
    {"type":"list","items":["Category 6 waterslide complex — six slides, one drop tower","The Hideaway: adults-only area with its own pool and beach club feel","Surfside neighborhood: family-focused zone with its own aqua park","The Pearl: a seven-story art installation you have to see to believe","Royal Promenade 2.0: 40% larger with new dining and retail concepts"]},
    {"type":"h2","text":"The Dining Scene Has Leveled Up"},
    {"type":"p","text":"Icon class brings 40+ dining options. The standouts per passenger reports: Pier 7 (seafood-forward, included), El Loco Fresh (Mexican, also included), and Izumi Hibachi (specialty, worth the upcharge). The Windjammer buffet got a complete redesign with better flow and more live cooking stations."},
    {"type":"quote","text":"I''ve been on 14 cruises. This is the first time I genuinely didn''t know where to look first.","attribution":"Travelholics client, sailed May 2026"},
    {"type":"h2","text":"What to Book the Moment You Board"},
    {"type":"p","text":"Specialty dining reservations for Wonderland and Izumi fill up within the first two hours of embarkation. The Flowrider surf simulator books out by Day 1 afternoon. Basically: have your list ready before you walk the gangway."},
    {"type":"p","text":"I can help you find the right sailing date and cabin category. Reach out and we''ll find your Icon-class sweet spot."}
  ]'::jsonb,
  'cruise-news', 'Yolanda',
  ARRAY['royal caribbean', 'icon class', 'new ships', 'family cruising', '2026'],
  true, true, '2026-06-03 11:00:00+00',
  'Royal Caribbean Icon Class 2026: Everything That''s Changed | Travelholics',
  'Yolanda''s full breakdown of Royal Caribbean''s Icon-class ships — what''s new, what''s worth it, and what to book first.',
  'Plan Your Royal Caribbean Cruise', '/#contact',
  NULL, NULL, NULL
),

(
  'carnival-jubilee-galveston-texas-homeport',
  'Carnival Jubilee Calls Galveston Home — What Texas Cruisers Need to Know',
  'No-fly cruising from the Gulf Coast just got a serious upgrade',
  'Carnival''s newest mega-ship has made Galveston its home port, and it''s a game-changer for Texas families who want an amazing vacation without setting foot in an airport.',
  '[
    {"type":"p","text":"For years, Texas cruisers drove to Galveston, boarded a solid but aging fleet, and felt a little wistful scrolling through photos of ships sailing from Miami or Port Canaveral. That''s over now. Carnival Jubilee — Carnival''s newest Excel-class ship — officially calls Galveston home, and it is worth the drive from anywhere in the state."},
    {"type":"h2","text":"What Makes Jubilee Different"},
    {"type":"p","text":"Jubilee is Carnival''s Excel-class ship, which means it''s their flagship line with all the marquee features: BOLT the roller coaster at sea, the Currents pool deck, Lido Beach Club, and eight neighborhood zones spread across the ship."},
    {"type":"list","items":["BOLT roller coaster — 800 feet of track, up to 40 mph, 187 feet above sea level","Summer Landing neighborhood with a family lagoon pool","Bonsai Teppanyaki specialty restaurant","Dr. Seuss WaterWorks aqua park","New Year''s Eve sailings are already selling fast"]},
    {"type":"h2","text":"The Galveston Port Experience"},
    {"type":"p","text":"One thing Texas cruisers know well: Galveston embarkation can be slow if you show up at the wrong time. With Jubilee drawing larger crowds, arriving at your assigned time window is more important than ever."},
    {"type":"h2","text":"Itineraries Out of Galveston"},
    {"type":"p","text":"Jubilee sails 7-night Western Caribbean itineraries hitting Cozumel, Belize City, Mahogany Bay, and Costa Maya — some of the best snorkeling and beach destinations in the Caribbean, all reachable without a flight."},
    {"type":"p","text":"I''ve helped over a dozen Texas families book Jubilee sailings already. If you''re thinking about it, now is the time — holiday sailings are filling fast."}
  ]'::jsonb,
  'cruise-news', 'Yolanda',
  ARRAY['carnival', 'jubilee', 'galveston', 'texas', 'no-fly cruise'],
  false, true, '2026-06-08 09:00:00+00',
  'Carnival Jubilee in Galveston: What Texas Cruisers Need to Know | Travelholics',
  'Carnival''s newest Excel-class ship is homeported in Galveston. What Texas cruisers need to know about sailings, features, and booking.',
  'Book a Galveston Cruise', '/#contact',
  NULL, NULL, NULL
),

(
  'norwegian-early-booking-deal-save-35',
  'Save Up to 35% on Norwegian Cruise Line — Early Booking Window Closes June 30',
  'Free at Sea + early booking savings = the best time to lock in 2026-2027 sailings',
  'Norwegian is running one of their strongest early booking promotions of the year, and it stacks with their Free at Sea amenity package. Here''s exactly what''s included and how to make the most of it.',
  '[
    {"type":"p","text":"Norwegian Cruise Line has launched their summer early booking event, and I want to make sure you don''t sleep on this one. The savings are real, the deadline is firm (June 30, 2026), and the Free at Sea package makes it genuinely one of the better cruise values on the market right now."},
    {"type":"h2","text":"What''s Included in This Deal"},
    {"type":"list","items":["Up to 35% off cruise fare on select sailings","Free at Sea: specialty dining, beverage package, internet minutes, shore excursion credit, and friends sail free","Kids sail free on select sailings","Reduced deposits through the booking window"]},
    {"type":"h2","text":"Best Itineraries for This Offer"},
    {"type":"list","items":["7-night Eastern Caribbean on Norwegian Encore (Miami homeport)","10-night Western Mediterranean on Norwegian Epic (Barcelona roundtrip)","14-night Panama Canal crossing on Norwegian Sun (seasonal)","5-night Bahamas on Norwegian Sky (great entry-level option)"]},
    {"type":"quote","text":"The Free at Sea beverage package alone covers $100-$150 per person per day in value if you use it. Stacked with the fare discount, this is genuinely the math working in your favor.","attribution":"Yolanda"},
    {"type":"h2","text":"Fine Print You Should Know"},
    {"type":"p","text":"Free at Sea gratuities are not included in the package — budget about $20/person/day for gratuities on the beverage package. The shore excursion credit is typically $50 per port per stateroom, not per person."},
    {"type":"p","text":"Book by June 30, 2026 to lock in these rates. I can help you choose the right sailing, cabin category, and maximize the Free at Sea package. Reach out today."}
  ]'::jsonb,
  'deal', 'Yolanda',
  ARRAY['norwegian cruise line', 'deal', 'free at sea', 'early booking', 'savings'],
  true, true, '2026-06-10 08:00:00+00',
  'Save 35% on Norwegian Cruise Line — Early Booking Ends June 30 | Travelholics',
  'Norwegian''s early booking event stacks 35% savings with Free at Sea amenities. Yolanda breaks down which sailings offer the best value.',
  'Claim This Deal', '/#contact',
  '2026-06-30 23:59:59+00', 'Regular Rate', 'Up to 35% Off'
),

(
  'caribbean-flash-sale-499-7-night',
  'Flash Sale: 7-Night Caribbean Cruises From $499 Per Person',
  'Multiple lines, multiple dates — but these prices won''t last',
  'Several major cruise lines just dropped flash pricing on 7-night Caribbean sailings starting at $499 per person. Here''s which ones are actually worth grabbing.',
  '[
    {"type":"p","text":"Every few months, the cruise industry releases what I call real flash sales — not the constant promotional noise, but actual below-market pricing that disappears within 48-72 hours. We''re in one of those windows right now, and I want to walk you through what''s worth your attention."},
    {"type":"h2","text":"What''s Actually on Sale"},
    {"type":"list","items":["Carnival Freedom: 7-night Eastern Caribbean from Miami — from $499/person (interior)","Royal Caribbean Harmony of the Seas: 7-night from Port Canaveral — from $549/person","MSC Seashore: 7-night Western Caribbean from Miami — from $479/person","Celebrity Reflection: 7-night Southern Caribbean from Ft. Lauderdale — from $649/person (includes Classic Drinks package)"]},
    {"type":"h2","text":"Which One Should You Book?"},
    {"type":"list","items":["Best for families: Harmony of the Seas (FlowRider, water slides, zip line)","Best for couples: Celebrity Reflection (more refined, included drinks, quieter vibe)","Best value: MSC Seashore ($479 is genuinely low for a 7-night)","Best for first-timers: Carnival Freedom (fun, friendly, easy to navigate)"]},
    {"type":"quote","text":"Interior cabins at these prices are a legitimately good deal. You are on the ship for dinner, shows, and sleeping — you don''t need a window for that. Spend the savings on a specialty dinner.","attribution":"Yolanda"},
    {"type":"p","text":"These prices require availability confirmation and move fast. Some dates have already sold interior cabins at the flash price and only have ocean view remaining. Contact me directly and I will pull live inventory for your preferred dates."},
    {"type":"p","text":"These deals close by Sunday night. Do not wait."}
  ]'::jsonb,
  'deal', 'Yolanda',
  ARRAY['flash sale', 'caribbean', 'deal', 'budget cruise', '7-night'],
  false, true, '2026-06-12 07:00:00+00',
  'Flash Sale: 7-Night Caribbean Cruises from $499 | Travelholics',
  'Multiple cruise lines have released flash pricing on 7-night Caribbean sailings. Yolanda breaks down which deals are worth grabbing before they disappear.',
  'Lock In This Price', '/#contact',
  '2026-06-15 23:59:59+00', 'Regular rates from $899', 'From $499/person'
),

(
  'new-cruise-door-magnets-collection-2026',
  'New! Travelholics Cruise Door Magnets — 6 New Designs Just Dropped',
  'Personalize your stateroom door and never lose your cabin again',
  'Our cruise door magnet collection just expanded with 6 new designs, including the most-requested ''Yolanda''s Crew'' style we''ve ever offered.',
  '[
    {"type":"p","text":"You asked, we listened. Our door magnet collection — one of our best-selling cruise accessories — just grew by six designs, and they are available right now in the shop. Whether you''re marking your door so the family can find their cabin or just want to add personality to your stateroom entrance, these are the way to do it."},
    {"type":"h2","text":"What''s New"},
    {"type":"list","items":["Tropical Fish Set (4-piece): bright, colorful, waterproof-rated magnets","''Yolanda''s Crew'' name board: personalized with your family name","Anchor & Waves minimal set: clean navy and white, works on any ship","Cruise Mode: ON banner: perfect first-day door decoration","Bon Voyage Confetti set: festive, eye-catching, great for celebrations","Ship silhouette series: cruise line-specific designs (more ships coming)"]},
    {"type":"h2","text":"Why Door Magnets?"},
    {"type":"p","text":"Most cruise ship doors are metal and magnet-friendly. A set of distinctive magnets makes your cabin door unmistakable in a hallway where every door looks the same — especially useful with kids, groups, or anyone who''s had one too many sea breezes at the pool bar."},
    {"type":"quote","text":"My group of 12 used the magnets on our Mediterranean sailing and it was genuinely a life saver. Everyone found the meeting spot every single time.","attribution":"Travelholics customer, Med sailing 2025"},
    {"type":"h2","text":"Shipping & Details"},
    {"type":"p","text":"All magnets ship within 3 business days. Orders over $35 qualify for free standard shipping. Sets are waterproof-rated and tested for outdoor use."},
    {"type":"p","text":"Shop the full collection in the Travelholics store. We''re restocking the bestsellers weekly so check back if something''s sold out."}
  ]'::jsonb,
  'shop-announcement', 'Yolanda',
  ARRAY['shop', 'door magnets', 'cruise accessories', 'new arrivals'],
  false, true, '2026-06-05 10:00:00+00',
  'New Cruise Door Magnets — 6 New Designs | Travelholics Shop',
  'Travelholics just dropped 6 new cruise door magnet designs. Available now in the shop.',
  'Shop Door Magnets', '/shop',
  NULL, NULL, NULL
),

(
  'travelholics-hoodie-summer-2026-drop',
  'The Travelholics Hoodie Is Back — Summer 2026 Edition',
  'Limited run, new color ways built for sea-day breezes',
  'Our best-selling hoodie just got a summer makeover. Three new colorways designed for sea-day lounging, cool dining rooms, and airport layovers.',
  '[
    {"type":"p","text":"Sea days have a dress code. It''s not formal night, it''s not shorts weather — it''s the time when you want something comfortable, presentable, and warm enough for the wind chill at the bow. That''s exactly what our Travelholics Hoodie was designed for, and the Summer 2026 edition is our best version yet."},
    {"type":"h2","text":"What''s New This Season"},
    {"type":"list","items":["Three new colorways: Glacier Mist (pale blue), Coral Sunset (dusty rose), and Midnight Navy","Same heavyweight 80/20 cotton-poly blend — substantial but not stifling","New embroidered anchor detail on the left sleeve","Slightly relaxed fit by popular request"]},
    {"type":"h2","text":"Why This Hoodie Works on a Cruise"},
    {"type":"p","text":"Cruise ship air conditioning is legendarily aggressive. The dining rooms, theaters, and casinos are kept at temperatures that would make a polar bear reach for a sweater. A quality hoodie is not optional — it is cruise packing infrastructure. This one packs flat, washes well, and looks intentional rather than thrown-on."},
    {"type":"quote","text":"I wore mine every single sea day. It became my cruise uniform and I got compliments on it in the elevator multiple times.","attribution":"Travelholics customer, Alaskan sailing 2025"},
    {"type":"h2","text":"Sizing & Availability"},
    {"type":"p","text":"Available in sizes XS through 3XL. We have stocked deeper in M, L, and XL this time based on the last run. Limited quantities on each colorway — when a color sells out, that''s it for this season."},
    {"type":"p","text":"Grab yours in the shop before the colorways you want are gone. Free shipping on orders over $75."}
  ]'::jsonb,
  'shop-announcement', 'Yolanda',
  ARRAY['shop', 'hoodie', 'merch', 'new arrivals', 'summer 2026'],
  true, true, '2026-06-11 09:00:00+00',
  'Travelholics Hoodie Summer 2026 Edition | Travelholics Shop',
  'The Travelholics Hoodie is back in three new summer colorways. Limited run, heavyweight quality. Perfect for sea days and cool dining rooms.',
  'Shop Hoodies', '/shop',
  NULL, NULL, NULL
);

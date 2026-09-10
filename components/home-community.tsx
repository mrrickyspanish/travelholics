import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play, Youtube } from "lucide-react";
import { FaTiktok, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { VideoEmbed } from "@/components/video-embed";
import { SUBSCRIBE_URL } from "@/lib/youtube";
import { TIKTOK_PROFILE_URL } from "@/lib/liveSchedule";
import { type Article, formatDate } from "@/lib/articles";
import styles from "./home-community.module.css";

export function HomeHero() {
  return <section className={styles.hero}>
    <Image src="/images/Charlotte_Amalie_StThomas.jpg" alt="" fill priority sizes="100vw" className={styles.scenery} />
    <div className={styles.heroInner}>
      <div>
        <p className={styles.eyebrow}>Cruise life with Yolanda</p>
        <h1>You found your <span>cruise people.</span></h1>
        <p className={styles.intro}>The ship talk. The packing debates. The next trip you can’t stop thinking about. You’re in good company here.</p>
        <div className={styles.actions}><a href="#crew" className={styles.primary}>Join the Crew <ArrowDown size={18} /></a><a href="#videos" className={styles.lightLink}><Play size={17} /> Meet Yolanda on video</a></div>
        <p className={styles.heroNote}>Free cruise tips and good company. No trip booked? Come anyway.</p>
      </div>
      <div className={styles.portrait}>
        <Image src="/images/hero-yolanda.jpg" alt="Yolanda Harris, your Travelholics host" fill priority sizes="(max-width: 760px) 90vw, 40vw" />
        <div><p>Hey, I’m Yolanda.</p><span>Always thinking about the next cruise.</span></div>
      </div>
    </div>
    <div className={styles.ribbon}>Good ships. <span>Good people.</span> Great stories.</div>
  </section>;
}

export function HomeVideo() {
  return <section id="videos" className={styles.section} aria-labelledby="home-video-title"><div className={styles.videoLayout}>
    <div><p className={styles.script}>A little advice. A lot of personality.</p><h2 id="home-video-title">Before you pack,<br />hang with Yo.</h2><p className={styles.body}>First cruise or number fifty, your suitcase probably has a few things it doesn’t need. Yolanda walks through what to bring, what to skip, and how to leave the overpacking at home.</p><a className={styles.textLink} href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer"><Youtube size={21} /> Subscribe on YouTube <ArrowUpRight size={18} /></a></div>
    <div className={styles.theater}><VideoEmbed id="N4O_Km9eqFk" title="10 Things to Pack for a Cruise First-Timers Forget" format="long" sizes="(max-width: 760px) 90vw, 55vw" /><p>Start here</p><h3>10 Things to Pack for a Cruise First-Timers Forget</h3><Link href="/videos">More from Yolanda <ArrowUpRight size={16} /></Link></div>
  </div></section>;
}

export function HomeCommunity() {
  return <section id="crew" className={styles.crew} aria-labelledby="crew-title">
    <div className={styles.crewGrid}><div><p className={styles.eyebrow}>The Cruise Life List</p><h2 id="crew-title">Your next trip starts <span>between trips.</span></h2><p className={styles.body}>Join Yolanda’s email crew for practical cruise tips, deals worth a look, and Travelholics shop drops. Keep a little vacation in your inbox.</p><p className={styles.small}>Free to join. Unsubscribe anytime.</p></div><div className={styles.signup}><NewsletterSignup source="homepage-community" community /></div></div>
    <div className={styles.socials}>
      <div><p className={styles.script}>Come for the tips. Stay for the conversation.</p><p>Find your favorite way to hang with Yolanda.</p></div>
      <a href={TIKTOK_PROFILE_URL} target="_blank" rel="noopener noreferrer"><FaTiktok size={24} /><span><strong>TikTok</strong><small>Cruise talk & live conversations</small></span><ArrowUpRight size={20} /></a>
      <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer"><Youtube size={28} /><span><strong>YouTube</strong><small>Packing, ship rankings & real advice</small></span><ArrowUpRight size={20} /></a>
    </div>
    <div className={styles.otherSocials}><span>Also find us on</span><a href="https://www.facebook.com/yotravelholic" target="_blank" rel="noopener noreferrer"><FaFacebookF /> Facebook</a><a href="https://www.instagram.com/yotravelholic" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a></div>
  </section>;
}

export function HomeStories({ articles }: { articles: Article[] }) {
  return <section id="testimonials" className={styles.section} aria-labelledby="stories-title">
    <div className={styles.sectionHeading}><div><p className={styles.script}>The people make the trip.</p><h2 id="stories-title">More than a camera roll.</h2></div><Link className={styles.textLink} href="/blog">Yolanda’s journal <ArrowUpRight size={18} /></Link></div>
    {articles.length > 0 && <div className={styles.stories}>{articles.map(article => <Link href={`/blog/${article.slug}`} className={styles.story} key={article.id}>
      {article.cover_image && <div className={styles.storyImage}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={article.cover_image} alt={article.cover_alt ?? article.title} loading="lazy" /></div>}
      <p className={styles.small}>{formatDate(article.published_at)}</p><h3>{article.title}</h3><p>{article.excerpt}</p><span className={styles.textLink}>Read the story <ArrowUpRight size={18} /></span>
    </Link>)}</div>}
    <div className={styles.memories}>
      <article><div className={styles.memoryImage}><Image src="/images/testimonials/barnes_cruise_travelholic.JPG" alt="The Barnes family’s Caribbean cruise memories" fill sizes="(max-width: 760px) 40vw, 25vw" /></div><div><p className={styles.small}>RJ Barnes · Caribbean honeymoon · 2017</p><blockquote>“Yolanda helped us plan a honeymoon cruise that felt easy from start to finish.”</blockquote><p>A ship, excursions, and details matched to the trip they wanted.</p></div></article>
      <article><div className={styles.memoryImage}><Image src="/images/testimonials/willis_cruise_travelholic.jpg" alt="Tijuana Willis on her cruise" fill sizes="(max-width: 760px) 40vw, 25vw" /></div><div><p className={styles.small}>Tijuana Willis · Mediterranean · Repeat guest</p><blockquote>“For years, Yolanda has planned my cruise vacations, and every trip has been exceptional.”</blockquote><p>Personal recommendations that keep her coming back.</p></div></article>
    </div>
    <div className={styles.storyInvite}><p>Your next cruise story belongs here, too.</p><a href="#crew" className={styles.textLink}>Come join the Crew <ArrowUpRight size={18} /></a></div>
  </section>;
}

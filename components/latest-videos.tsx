import Link from "next/link";
import { ArrowUpRight, Youtube } from "lucide-react";
import { VideoEmbed } from "@/components/video-embed";
import { SUBSCRIBE_URL, type Video } from "@/lib/youtube";
import { videoNextStep } from "@/lib/youtube-catalog";

type LatestVideosProps = { featured: Video | null; shorts: Video[] };

export const LatestVideos = ({ featured, shorts }: LatestVideosProps) => {
  if (!featured && shorts.length === 0) return null;
  return (
    <section id="videos" className="home-videos" aria-labelledby="videos-title">
      <div className="home-container home-video-layout">
        <div className="home-video-intro">
          <div><p className="home-eyebrow">Travelholics TV</p><h2 id="videos-title" className="home-heading">Watch before you book.</h2></div>
          <div><p className="home-body">Ship rankings, cruise pricing, packing calls, port days, and the little things Yolanda wishes somebody had told you before embarkation.</p><div className="home-video-actions"><a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" className="home-button"><Youtube size={16} /> Subscribe</a><Link href="/videos" className="home-text-link">All videos <ArrowUpRight size={16} /></Link></div></div>
        </div>
        {featured && (
          <div className="home-featured-video">
            <VideoEmbed id={featured.id} title={featured.title} format="long" sizes="(min-width: 1024px) 54rem, 90vw" />
            <div className="home-video-caption"><p className="home-eyebrow">Featured lesson</p><h3>{featured.title}</h3>{featured.blurb && <p className="home-body">{featured.blurb}</p>}<Link href={videoNextStep(featured.id).href} className="home-text-link">{videoNextStep(featured.id).label} <ArrowUpRight size={16} /></Link></div>
          </div>
        )}
        {shorts.length > 0 && (
          <div className="home-shorts"><p className="home-eyebrow">Quick cruise answers</p><ul>{shorts.map(short => <li key={short.id}><VideoEmbed id={short.id} title={short.title} format="short" sizes="(min-width: 768px) 10rem, 29vw" /><p>{short.title}</p></li>)}</ul></div>
        )}
      </div>
    </section>
  );
};

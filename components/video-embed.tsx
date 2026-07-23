"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { embedUrl, thumbUrl, type VideoFormat } from "@/lib/youtube";

type VideoEmbedProps = {
  id: string;
  title: string;
  format: VideoFormat;
  /** next/image `sizes` hint for the poster. */
  sizes?: string;
  /** Load a higher-priority poster (use for the hero video). */
  priority?: boolean;
};

/**
 * Click-to-play YouTube facade. Renders a lightweight poster + play button and
 * only mounts the (cookie-free) iframe once the visitor presses play, so no
 * third-party player JS loads on page arrival.
 */
export function VideoEmbed({ id, title, format, sizes, priority }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const aspect = format === "short" ? "aspect-[9/16]" : "aspect-video";

  return (
    <div className={`relative ${aspect} w-full overflow-hidden rounded-[1.25rem] bg-ink`}>
      {playing ? (
        <iframe
          src={embedUrl(id)}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
        >
          <Image
            src={thumbUrl(id)}
            alt=""
            fill
            sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent"
            aria-hidden="true"
          />
          <span
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-coral text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" strokeWidth={0} />
          </span>
        </button>
      )}
    </div>
  );
}

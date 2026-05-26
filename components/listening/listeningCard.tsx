"use client";

import { Disc, Waveform } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Image from "next/image";

interface ListeningCardProps {
  readonly coverArt: string;
  readonly label: string;
  readonly trackName: string;
  readonly artist: string;
  readonly isPlaying: boolean;
}

export default function ListeningCard({
  coverArt,
  label,
  trackName,
  artist,
  isPlaying,
}: ListeningCardProps) {
  return (
    <div className="listening flex items-start gap-4 min-w-0 max-w-[300px] min-[1440px]:max-w-[400px] min-[2560px]:max-w-[20vw]">
      {/* Cover art — small, graphic */}
      <motion.div
        className="relative h-[56px] w-[56px] min-[2560px]:h-[3.5vw] min-[2560px]:w-[3.5vw] shrink-0 rounded-lg overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Image
          className="h-full w-full object-cover"
          src={coverArt}
          alt="Cover art"
          width={56}
          height={56}
        />
        {isPlaying && (
          <motion.div
            className="absolute inset-0 bg-poster-dark/20 flex items-center justify-center"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Waveform
              size={20}
              weight="bold"
              className="text-poster-cream"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Track info — typographic */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="flex items-center gap-1.5 text-poster-dark/40 text-[0.65rem] min-[2560px]:text-[0.7vw] font-bold uppercase tracking-[0.15em]">
          {isPlaying ? (
            <Disc
              size={12}
              weight="bold"
              className="animate-spin"
              style={{ animationDuration: "3s" }}
            />
          ) : null}
          {label}
        </span>
        <span className="font-bold text-poster-dark text-sm min-[2560px]:text-[1vw] leading-tight truncate">
          {trackName}
        </span>
        <span className="text-poster-dark/45 text-[0.7rem] min-[2560px]:text-[0.8vw] uppercase tracking-widest truncate">
          {artist}
        </span>
      </div>
    </div>
  );
}

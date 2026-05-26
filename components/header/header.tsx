import { headers } from "next/headers";
import Image from "next/image";

import type { IHeaderContent } from "@/components/header/header.d";
import Social from "@/components/social/social";
import Status from "@/components/status/status";
import TextScramble from "@/components/textScramble/textScramble";

async function getData() {
  try {
    const response = await fetch(
      (process.env.APP_ENV === "development"
        ? process.env.URL_STATUS_API_DEV
        : process.env.URL_STATUS_API_PROD) as string,
      {
        cache: "force-cache",
        next: {
          revalidate: 5,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  } catch (error) {
    console.error("components/status", error);
  }
}

export default async function Header() {
  const data = await getData().then((data) => data);

  const headersData = await headers();
  const host = headersData.get("host") || "skvggor";
  const rawHost = host.split(":")[0];
  const _domain =
    process.env.SITE_DOMAIN ||
    (rawHost === "localhost" ? "skvggor.dev" : rawHost);

  const headerContent: IHeaderContent = {
    title: "Marcos Lima",
    currentPosition: [],
    image: {
      src: "/profile.jpg",
      alt: "Marcos Lima",
      width: 200,
      height: 200,
    },
    statusFromAPI: {
      time: data.time,
      status: data.status,
    },
  };

  return (
    <header className="site-header flex flex-col items-start w-full gap-6">
      <div
        className="flex items-center gap-4 animate-fade-in-up"
        style={{ animationDelay: "0.05s" }}
      >
        <section className="avatar h-14 w-14 shrink-0 rounded-sm">
          <Image
            src={headerContent.image.src}
            alt={headerContent.image.alt}
            width={headerContent.image.width}
            height={headerContent.image.height}
            className="aspect-square border-2 border-poster-dark/20 h-full object-cover rounded-sm w-full grayscale transition-all duration-500 hover:grayscale-0 hover:border-poster-dark/40"
          />
        </section>

        <div>
          <h1 className="font-bold text-[clamp(1.6rem,3vw,2.4rem)] text-poster-dark leading-none tracking-tight">
            {headerContent.title}
          </h1>
          <TextScramble
            text={_domain}
            delay={0.4}
            duration={800}
            className="text-[0.65rem] text-poster-dark/30 uppercase tracking-[0.2em]"
          />
        </div>
      </div>

      <p
        className="text-[clamp(0.85rem,1.1vw,1rem)] text-poster-dark/50 leading-relaxed max-w-[420px] min-[1440px]:max-w-[560px] text-pretty animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        Father of two, software developer, fixed gear cyclist and music
        collector based in Brazil.
      </p>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0.35s" }}
      >
        <Social />
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0.5s" }}
      >
        <Status dataFromAPI={headerContent.statusFromAPI} />
      </div>
    </header>
  );
}

import { headers } from "next/headers";
import Image from "next/image";

import type {
  IHeaderContent,
  IStatusIndicator,
} from "@/components/header/header.d";
import Social from "@/components/social/social";
import Status from "@/components/status/status";

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

  const statusIndicators: Record<string, IStatusIndicator> = {
    weekend: { indicatorBg: "bg-green-700", animate: "animate-ping" },
    sleep: { indicatorBg: "bg-poster-mid", animate: "animate-none" },
    lunch: { indicatorBg: "bg-poster-dark", animate: "animate-ping" },
    work: { indicatorBg: "bg-red-800", animate: "animate-ping" },
    free: { indicatorBg: "bg-green-700", animate: "animate-ping" },
    listening: { indicatorBg: "bg-violet-800", animate: "animate-ping" },
  };

  return (
    <header className="site-header flex flex-col items-start w-full gap-6">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <section className="avatar relative h-12 w-12 shrink-0 rounded-full">
          <Image
            src={headerContent.image.src}
            alt={headerContent.image.alt}
            width={headerContent.image.width}
            height={headerContent.image.height}
            className="aspect-square border-2 border-poster-dark/15 h-full object-cover rounded-full w-full"
          />
          <span
            className={`absolute ${statusIndicators[`${headerContent.statusFromAPI.status}`].indicatorBg} border-poster-bg border-[1.5px] bottom-0 h-3 right-0 rounded-full z-[2] w-3`}
          />
          <span
            className={`absolute ${statusIndicators[`${headerContent.statusFromAPI.status}`].animate} ${statusIndicators[`${headerContent.statusFromAPI.status}`].indicatorBg} bottom-0 h-3 right-0 rounded-full z-[1] w-3`}
          />
        </section>

        <div>
          <h1 className="font-bold text-[clamp(1.6rem,3vw,2.4rem)] text-poster-dark leading-none tracking-tight">
            {headerContent.title}
          </h1>
          <span className="text-[0.65rem] text-poster-dark/30 uppercase tracking-[0.2em]">
            {_domain}
          </span>
        </div>
      </div>

      <p className="text-[clamp(0.85rem,1.1vw,1rem)] text-poster-dark/50 leading-relaxed max-w-[420px] min-[1440px]:max-w-[560px] text-pretty">
        Father of two, software developer, fixed gear cyclist and music
        collector based in Brazil.
      </p>

      {/* Social */}
      <Social />

      {/* Status */}
      <Status dataFromAPI={headerContent.statusFromAPI} />
    </header>
  );
}

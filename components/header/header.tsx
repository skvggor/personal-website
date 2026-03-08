import { headers } from "next/headers";
import Image from "next/image";

import type {
  IHeaderContent,
  IStatusIndicator,
} from "@/components/header/header.d";
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
  const _domain = host.split(":")[0].split(".")[0];

  const headerContent: IHeaderContent = {
    title: _domain,
    currentPosition: [
      <span key="bio">
        <span style={{ whiteSpace: "nowrap" }}>
          father of two wonderful girls
        </span>{" "}
        <span style={{ whiteSpace: "nowrap" }}>* sk8boarder</span>{" "}
        <span style={{ whiteSpace: "nowrap" }}>* music collector</span>{" "}
        <span style={{ whiteSpace: "nowrap" }}>* street runner</span>{" "}
        <span style={{ whiteSpace: "nowrap" }}>* cyclist #fixedgear</span>{" "}
        <span style={{ whiteSpace: "nowrap" }}>* linux since 2009</span>{" "}
        <span style={{ whiteSpace: "nowrap" }}>* senior sw dev at</span>{" "}
      </span>,
      <a
        key="employer"
        href="https://www.radixeng.com/"
        target="_blank"
        aria-label="New window link."
        className="link
          text-sky-500
          underline"
        rel="noreferrer"
      >
        @radixeng
      </a>,
    ],
    image: {
      src: "/me.jpeg",
      alt: "avatar",
      width: 200,
      height: 200,
    },
    statusFromAPI: {
      time: data.time,
      status: data.status,
    },
  };

  const statusIndicators: Record<string, IStatusIndicator> = {
    weekend: { indicatorBg: "bg-green-500", animate: "animate-ping" },
    sleep: { indicatorBg: "bg-gray-400", animate: "animate-none" },
    lunch: { indicatorBg: "bg-sky-300", animate: "animate-ping" },
    work: { indicatorBg: "bg-red-700", animate: "animate-ping" },
    free: { indicatorBg: "bg-green-500", animate: "animate-ping" },
    listening: { indicatorBg: "bg-violet-600", animate: "animate-ping" },
  };

  return (
    <header
      className="site-header
        flex
        flex-col
        items-center
        justify-center
        w-full"
    >
      <section
        className="avatar
          h-[clamp(6rem,10vw,8rem)]
          mb-3
          relative
          rounded-full
          w-[clamp(6rem,10vw,8rem)]"
      >
        <Image
          src={headerContent.image.src}
          alt={headerContent.image.alt}
          width={headerContent.image.width}
          height={headerContent.image.height}
          className="image-avatar
            aspect-square
            border-2
            border-gray-700
            h-full
            object-cover
            p-0.5
            rounded-full
            w-full"
        />

        <span
          className={`icon-status
            absolute
            ${statusIndicators[`${headerContent.statusFromAPI.status}`].indicatorBg}
            border-[#020817]
            border-2
            bottom-2
            duration-500
            h-[clamp(1rem,2vw,1.25rem)]
            right-1
            rounded-full
            transition-all
            z-[2]
            w-[clamp(1rem,2vw,1.25rem)]`}
        />
        <span
          className={`icon-status-ping
            absolute
            ${statusIndicators[`${headerContent.statusFromAPI.status}`].animate}
            ${statusIndicators[`${headerContent.statusFromAPI.status}`].indicatorBg}
            bottom-2
            duration-1000
            ease-in-out
            h-[clamp(1rem,2vw,1.25rem)]
            right-1
            rounded-full
            transition
            w-[clamp(1rem,2vw,1.25rem)]
            z-[1]`}
        />
      </section>

      <section
        className="holder-text
          flex
          flex-col
          items-center
          w-full"
      >
        <h1
          className="name
            font-medium
            text-[clamp(2.5rem,5vw,4rem)]
            text-sky-300
            uppercase
            tracking-[clamp(0.5rem,1vw,1rem)]"
        >
          {headerContent.title}
        </h1>

        <section
          className="flex
            place-content-center
            px-4
            py-3
            rounded-2xl
            w-full
            max-w-[500px]"
        >
          <h2
            className="current-position
              font-normal
              text-center
              text-[clamp(0.75rem,1.5vw,1.125rem)]
              text-sky-300
              leading-[clamp(1.25rem,2vw,1.75rem)]
              py-1"
            style={{
              wordBreak: "keep-all",
              overflowWrap: "break-word",
            }}
          >
            {headerContent.currentPosition}
          </h2>
        </section>

        <section className="holder-status ml-3">
          <Status dataFromAPI={headerContent.statusFromAPI} />
        </section>
      </section>
    </header>
  );
}

import { Bicycle } from "@phosphor-icons/react/dist/ssr";

import AnimatedNumber from "@/components/animatedNumber/animatedNumber";
import Loading from "@/components/loading/loading";
import type { IStrava } from "./strava.d";

async function getData(_type: string) {
  try {
    const response = await fetch(
      (process.env.APP_ENV === "development"
        ? process.env.URL_STRAVA_API_DEV
        : process.env.URL_STRAVA_API_PROD) as string,
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

    const data = await response.json();
    return data?.distance;
  } catch (error) {
    console.error("components/strava", error);
  }
}

interface StravaProps {
  type: "run" | "ride";
}

export default async function Strava({ type }: StravaProps) {
  const stravaContent: IStrava = {
    currentYear: new Date().getFullYear(),
    distance: await getData(type),
  };

  return stravaContent.distance != null ? (
    <div className="sport flex items-center gap-2">
      <Bicycle
        size={18}
        weight="bold"
        className="text-poster-dark/50"
      />
      <span className="text-sm font-bold text-poster-dark/70">
        <AnimatedNumber
          target={Number.parseFloat(stravaContent.distance)}
          decimals={1}
          suffix=" km"
        />
      </span>
      <span className="text-poster-dark/30 text-[0.7rem] uppercase tracking-widest">
        {stravaContent.currentYear}
      </span>
    </div>
  ) : (
    <Loading serviceName="strava" />
  );
}

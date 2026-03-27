import DirectionsBike from "@mui/icons-material/DirectionsBike";
import DirectionsRun from "@mui/icons-material/DirectionsRun";

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
  color?: string;
}

export default async function Strava({ type, color = "#0ea5e9" }: StravaProps) {
  const stravaContent: IStrava = {
    currentYear: new Date().getFullYear(),
    distance: await getData(type),
  };

  const _icon = type === "run" ? <DirectionsRun /> : <DirectionsBike />;

  return stravaContent.distance != null ? (
    <div
      className="sport
        flex
        flex-row
        items-center
        justify-center
        mb-3
        p-3
        rounded-xl
        w-full
        min-[1600px]:h-auto
        min-[1600px]:justify-center
        min-[1600px]:mb-0
        min-[1600px]:mr-3
        min-[1600px]:w-auto"
    >
      <div
        className="icon
          mr-3"
      >
        {type === "run" ? (
          <DirectionsRun
            sx={{
              color,
              width: 40,
              height: 40,
            }}
          />
        ) : (
          <DirectionsBike
            sx={{
              color,
              width: 40,
              height: 40,
            }}
          />
        )}
      </div>

      <div
        className="total
          flex
          flex-col"
      >
        <h3
          className="year
            font-bold
            mb-1
            text-sm
            text-white"
        >
          {stravaContent.currentYear}
        </h3>

        <span
          className="distance
            font-light
            text-lg
            text-white/50"
        >
          <AnimatedNumber
            target={Number.parseFloat(stravaContent.distance)}
            decimals={1}
            suffix=" km"
          />
        </span>
      </div>
    </div>
  ) : (
    <Loading serviceName="api strava" />
  );
}

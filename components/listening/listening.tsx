import ListeningCard from "@/components/listening/listeningCard";
import ListeningLabel from "@/components/listening/listeningLabel";
import Loading from "@/components/loading/loading";

async function getData() {
  try {
    const response = await fetch(
      (process.env.APP_ENV === "development"
        ? process.env.URL_LASTFM_API_DEV
        : process.env.URL_LASTFM_API_PROD) as string,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  } catch (error) {
    console.error("components/listening", error);
  }
}

export default async function Listening() {
  const currentTrack = await getData().then(
    (data) => data?.recenttracks?.track[0],
  );

  const listeningContent = {
    coverArt:
      currentTrack?.image.reduce(
        (
          acc: string,
          image: {
            size: string;
            "#text": string;
          },
        ) => {
          let result = acc;

          if (image.size === "large") result = image["#text"];

          return result;
        },
        "",
      ) || "/default-cover-art.webp",
    artist: currentTrack?.artist["#text"],
    track: currentTrack?.name,
    status: currentTrack?.["@attr"]?.nowplaying,
  };

  const isPlaying = !!listeningContent.status;

  return currentTrack ? (
    <ListeningCard
      coverArt={listeningContent.coverArt}
      label={<ListeningLabel isPlaying={isPlaying} />}
      trackName={listeningContent.track}
      artist={listeningContent.artist}
      isPlaying={isPlaying}
    />
  ) : (
    <Loading serviceName="last.fm" />
  );
}

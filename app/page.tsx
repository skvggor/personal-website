import AnnouncementBar from "@/components/announcementBar/announcementBar";
import Header from "@/components/header/header";
import Listening from "@/components/listening/listening";
import Mastodon from "@/components/mastodon/mastodon";
import OmakaseSeal from "@/components/omakaseSeal/omakaseSeal";
import PageTransition from "@/components/pageTransition/pageTransition";
import SashikoBackground from "@/components/sashikoBackground/sashikoBackground";
import SeigaihaBand from "@/components/seigaihaBand/seigaihaBand";
import Strava from "@/components/strava/strava";
import ThemeSelector from "@/components/themeSelector/themeSelector";
import { getAnnouncementBarConfig } from "@/lib/announcement";

export const dynamic = "force-dynamic";

export default async function Home() {
  const announcementConfig = await getAnnouncementBarConfig();

  return (
    <>
      <SashikoBackground />
      <SeigaihaBand />
      <OmakaseSeal />

      <PageTransition>
        <ThemeSelector />
        <div className="relative z-10 flex h-dvh flex-col justify-between">
          <div className="relative flex-1 min-h-0">
            <main className="h-full overflow-y-auto px-8 pt-12 pb-20 min-[1440px]:px-[8vw] min-[1440px]:pt-[8vh] min-[2560px]:px-[6vw] min-[2560px]:pt-[6vh] max-w-[550px] min-[1440px]:max-w-[700px] min-[2560px]:max-w-[35vw]">
              <Header />
            </main>
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, var(--poster-bg))",
              }}
            />
          </div>

          <div className="shrink-0 px-8 min-[1440px]:px-[8vw] min-[2560px]:px-[6vw]">
            <AnnouncementBar config={announcementConfig} />

            <footer className="py-6 min-[2560px]:py-7 border-t border-poster-dark/8">
              <div className="flex flex-col gap-4 min-[2560px]:gap-4">
                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: "0.7s" }}
                >
                  <Strava type="ride" />
                </div>
                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: "0.85s" }}
                >
                  <Listening />
                </div>
              </div>
              <Mastodon />
            </footer>
          </div>
        </div>
      </PageTransition>
    </>
  );
}

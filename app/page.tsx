import AnnouncementBar from "@/components/announcementBar/announcementBar";
import Header from "@/components/header/header";
import Listening from "@/components/listening/listening";
import Mastodon from "@/components/mastodon/mastodon";
import OmakaseSeal from "@/components/omakaseSeal/omakaseSeal";
import SashikoBackground from "@/components/sashikoBackground/sashikoBackground";
import ScrollReveal from "@/components/scrollReveal/scrollReveal";
import Strava from "@/components/strava/strava";
import ThemeSelector from "@/components/themeSelector/themeSelector";
import { getAnnouncementBarConfig } from "@/lib/announcement";

export const dynamic = "force-dynamic";

export default async function Home() {
  const announcementConfig = await getAnnouncementBarConfig();

  return (
    <>
      <SashikoBackground />
      <OmakaseSeal />
      <ThemeSelector />

      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        <main className="px-8 pt-12 min-[1440px]:px-[8vw] min-[1440px]:pt-[8vh] max-w-[550px] min-[1440px]:max-w-[700px]">
          <ScrollReveal delay={0.1}>
            <Header />
          </ScrollReveal>
        </main>

        <div className="px-8 min-[1440px]:px-[8vw]">
          <AnnouncementBar config={announcementConfig} />

          <footer className="py-6 border-t border-poster-dark/8">
            <ScrollReveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-8 min-[768px]:gap-12">
                <Strava type="ride" />
                <Listening />
              </div>
            </ScrollReveal>
            <Mastodon />
          </footer>
        </div>
      </div>
    </>
  );
}

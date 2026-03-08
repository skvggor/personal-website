import AboutMe from "@/components/aboutMe/aboutMe";
import BackgroundTopographic from "@/components/backgroundTopographic/backgroundTopographic";
import Header from "@/components/header/header";
import Listening from "@/components/listening/listening";
import MadeBy from "@/components/madeBy/madeBy";
import Mastodon from "@/components/mastodon/mastodon";
import Social from "@/components/social/social";
import Strava from "@/components/strava/strava";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 bg-gray-950 -z-10" />
      <BackgroundTopographic />
      <main
        className="main-content
        relative
        z-10
        flex
        flex-col
        min-[1600px]:flex-row
        h-screen
        overflow-hidden"
      >
        <div className="flex-1 flex flex-col items-center h-full border-b min-[1600px]:border-b-0 min-[1600px]:border-r border-gray-800 p-6 gap-8 min-[1600px]:gap-4 place-content-center">
          <Header />
        </div>

        <div className="flex-1 flex flex-col items-center h-full border-b min-[1600px]:border-b-0 min-[1600px]:border-r border-gray-800 p-6 gap-8 min-[1600px]:gap-4 place-content-center">
          <AboutMe />
          <Social />
        </div>

        <div className="flex-1 flex flex-col items-center h-full p-6 gap-8 min-[1600px]:gap-4 place-content-center">
          <div
            className="holder
            flex
            flex-col
            items-center
            justify-center
            gap-8
            min-[1600px]:gap-4
            max-w-[1024px]"
          >
            <Strava type="ride" />
            <Listening />
          </div>

          <MadeBy />
          <Mastodon />
        </div>
      </main>
    </>
  );
}

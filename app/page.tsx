import AboutMe from "@/components/aboutMe/aboutMe";
import Background from "@/components/background/background";
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
      <Background />
      <main
        className="main-content
        bg-gray-950
        flex
        flex-col
        justify-between
        min-h-[100dvh]
        pt-10
        px-3
        md:pt-12
        md:px-5
        tall:min-h-[768px]"
      >
        <Header />

        <section
          className="site-content
          flex
          flex-col
          items-center
          justify-center
          w-full"
        >
          <AboutMe />
          <Social />
        </section>

        <footer
          className="site-footer
          flex
          flex-col
          items-center
          justify-center"
        >
          <div
            className="holder
            flex
            flex-col
            items-center
            items-stretch
            justify-center
            max-w-[1024px]
            md:flex-row"
          >
            <Strava type="ride" />
            <Listening />
          </div>

          <MadeBy />
          <Mastodon />
        </footer>
      </main>
    </>
  );
}

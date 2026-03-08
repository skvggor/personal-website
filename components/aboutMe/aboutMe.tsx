import type { IAboutMe } from "@/components/aboutMe/aboutMe.d";

export default function AboutMe() {
  const aboutMeContent: IAboutMe = { title: ["Keep in touch with me"] };

  return (
    <section
      className="about-me
        flex
        flex-col
        items-center
        justify-center"
    >
      <h2
        className="title
          font-bold
          text-[clamp(1.5rem,3vw,2.5rem)]
          text-sky-300"
      >
        {aboutMeContent.title}
      </h2>
    </section>
  );
}

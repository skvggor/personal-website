import Image from "next/image";

import type { ISocial } from "@/components/social/social.d";

export default function Social() {
  const socialContent: ISocial = {
    links: [
      {
        id: 1,
        title: "YouTube",
        href: "https://youtube.com/@skvggor",
        icon: "/icons/youtube.svg",
      },
      {
        id: 2,
        title: "GitHub",
        href: "https://github.com/skvggor",
        icon: "/icons/github.svg",
      },
      {
        id: 3,
        title: "LinkedIn",
        href: "https://www.linkedin.com/in/marcker",
        icon: "/icons/linkedin.svg",
      },
      {
        id: 4,
        title: "Strava",
        href: "https://www.strava.com/athletes/18616728",
        icon: "/icons/strava.svg",
      },
    ],
  };

  const renderSocialLinks = socialContent.links.map((link) => (
    <li
      key={link.id}
      className="item"
    >
      <a
        className="link block p-2 rounded-full transition-all"
        href={link.href}
        title={link.title}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={link.icon}
          alt={link.title}
          width={28}
          height={28}
          className="w-7 h-7 transition-transform duration-300 hover:scale-110"
        />
      </a>
    </li>
  ));

  return (
    <section
      className="social
        flex
        flex-col
        items-center
        justify-center"
    >
      <ul
        className="icon-list
          gap-x-5
          grid
          grid-cols-4
          md:gap-x-6"
      >
        {renderSocialLinks}
      </ul>
    </section>
  );
}

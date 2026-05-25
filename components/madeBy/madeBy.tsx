import type { IMadeBy } from "@/components/madeBy/madeBy.d";

export default function MadeBy() {
  const contentMadeBy: IMadeBy = { label: "Made by", author: "Marcos Lima" };

  return (
    <span className="made-by text-[0.7rem] text-poster-dark/35 uppercase tracking-[0.15em]">
      {contentMadeBy.label}{" "}
      <a
        className="font-bold text-poster-dark/50 underline decoration-poster-dark/15 underline-offset-2 transition-all hover:text-poster-dark hover:decoration-poster-dark/40"
        href="https://github.com/skvggor"
      >
        {contentMadeBy.author}
      </a>{" "}
      · BR
    </span>
  );
}

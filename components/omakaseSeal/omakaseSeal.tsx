export default function OmakaseSeal() {
  const characters = ["お", "ま", "か", "せ"];

  return (
    <>
      {/* Desktop: vertical hero on the right */}
      <div
        className="pointer-events-none fixed right-[6vw] min-[2560px]:right-[8vw] top-0 z-10 hidden h-screen items-center min-[1440px]:flex animate-breathe"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-0">
          {characters.map((character, index) => (
            <span
              key={character}
              className="block leading-none text-poster-dark/10 animate-fade-in-up"
              style={{
                fontFamily: "var(--font-shippori)",
                fontSize: "clamp(8rem, 12vw, 14rem)",
                fontWeight: 700,
                animationDelay: `${0.8 + index * 0.15}s`,
              }}
            >
              {character}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile: horizontal watermark behind content */}
      <div
        className="pointer-events-none fixed left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 min-[1440px]:hidden"
        aria-hidden="true"
      >
        <span
          className="block whitespace-nowrap text-poster-dark/6"
          style={{
            fontFamily: "var(--font-shippori)",
            fontSize: "clamp(6rem, 30vw, 12rem)",
            fontWeight: 700,
            animation:
              "scale-in 1s ease-out 0.6s both, breathe 8s ease-in-out 1.6s infinite",
          }}
        >
          おまかせ
        </span>
      </div>
    </>
  );
}

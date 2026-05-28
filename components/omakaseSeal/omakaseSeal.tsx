export default function OmakaseSeal() {
  const characters = ["お", "ま", "か", "せ"];

  return (
    <div
      className="pointer-events-none fixed right-[6vw] min-[2560px]:right-[8vw] top-0 z-0 flex h-screen items-center animate-breathe"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-0">
        {characters.map((character, index) => (
          <span
            key={character}
            className="block leading-none text-poster-dark/10 animate-fade-in-up"
            style={{
              fontFamily: "var(--font-shippori)",
              fontSize: "clamp(4.5rem, 12vw, 14rem)",
              fontWeight: 700,
              animationDelay: `${0.8 + index * 0.15}s`,
            }}
          >
            {character}
          </span>
        ))}
      </div>
    </div>
  );
}

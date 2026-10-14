export default function Loading() {
  return (
    <main
      className="flex min-h-dvh items-center justify-center bg-poster-bg"
      aria-busy="true"
      aria-label="Loading"
    >
      <span
        className="text-7xl font-bold text-poster-dark/15"
        style={{ fontFamily: "var(--font-shippori)" }}
      >
        おまかせ
      </span>
    </main>
  );
}

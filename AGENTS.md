<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Guidance for AI agents (and humans) working in this repository. Read this before editing.

This is the personal website of Marcos Lima (skvggor) — a single-page Next.js site with a Japanese constructivist / おまかせ (omakase) poster aesthetic.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript 7**, strict
- **Tailwind CSS 4** (via `@tailwindcss/postcss`; directives live in `app/globals.css`)
- **Motion** (Framer Motion) and **Phosphor Icons**
- **Biome 2.x** — the only linter/formatter (no ESLint/Prettier)
- **Vitest 4** with jsdom and v8 coverage

`output: "standalone"` is enabled for the Docker build. Remote `next/image` hosts are allow-listed in `next.config.ts` (Last.fm).

## Path alias

`@/*` maps to the repository root (see `tsconfig.json`, mirrored in `vitest.config.mts`). Always import with `@/...`; relative imports are only acceptable within the same directory.

## Project layout

```
app/          App Router. Root layout, page, globals.css, robots.ts, sitemap.ts.
              Routes under app/study/ are noindex experiments.
components/   React components, grouped one folder per feature.
lib/          Framework-agnostic utilities: i18n, transitions, particles.
content/      Markdown content (e.g. announcement-bar.md).
public/       Static assets.
scripts/      Docker entrypoint and screenshot tooling.
proxy.ts      Per-request interceptor (this is the middleware equivalent).
```

### Component conventions

There are two coexisting styles — match the neighbours of the file you edit:

- **Legacy feature components** ship as a pair: `feature/feature.tsx` (implementation) + `feature/feature.d.ts` (props/content interfaces).
- **Newer components** keep types co-located in the single `.tsx`/`.ts` file. Prefer this for new work.

### `lib/particles` vs `components/study/particles`

The particle-morphing subsystem is split by responsibility:

- `lib/particles/*.ts` — pure, framework-agnostic math (extraction, easing, noise, concrete relief, timeline, aspect correction, runtime helpers). No DOM, fully unit-tested.
- `components/study/particles/` — the DOM/WebGL glue: `pipeline.ts` (image + font loading), `webgl.ts` (shader/buffer/attribute helpers), `useParticleMorphCanvas.ts` (the render-loop hook), `particleMorph.tsx` (thin presentational component), `shaders.ts` (GLSL).

Keep that boundary: pure logic belongs in `lib/particles`, side effects in the component layer.

## Styling and theming

- Six color themes (Terracotta, Sumi, Matcha, Washi, Ai, Sakura) defined as CSS custom properties in `app/globals.css`, switched via the `data-theme` attribute on `<html>`.
- A no-flash bootstrap script in `app/layout.tsx` reads the saved theme from `localStorage` before paint. Do not remove it.
- Fonts are loaded with `next/font/google` and exposed as CSS variables (`--font-shippori`, `--font-vt323`).

## Internationalization

`lib/i18n/context.tsx` provides a client `LanguageProvider` with `locale` (`"en"` | `"pt-BR"`) and a `t(key, replacements?)` function. Messages live in `lib/i18n/messages/en.json` and `pt-BR.json`. Browser locale is auto-detected. When adding copy, add it to both message files.

## Testing

- `lib/particles/**/*.ts` and `components/study/**/*.{ts,tsx}` are measured for coverage.
- Global thresholds: **80%** statements / branches / functions / lines. Aim for ≥80% on every changed file.
- Component/DOM tests must start with `// @vitest-environment jsdom`.
- Never use `any` in tests — use real types or `Partial`/`Pick` utilities for mocks.

## Commands

```bash
npm run dev              # dev server (Turbopack)
npm run build            # type-check + production build
npm run type-check       # tsc --noEmit
npm run lint             # biome check .
npm test                 # vitest run
npm run test:watch       # vitest
npm run test:coverage    # vitest run --coverage
```

## Engineering rules (project-wide)

- Code and identifiers are in **English**. Communicate with the maintainer in Portuguese.
- No throwaway comments; be concise. Use full, descriptive names (no abbreviations except established/industry ones).
- Prefer pure, unit-testable functions; keep React components thin.
- Never commit with conventional-commit prefixes (`feat:`, `chore:`, …) or attribution trailers.

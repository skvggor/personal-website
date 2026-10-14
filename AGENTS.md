# Project guide

Personal website built with Next.js 16, React 19, TypeScript 7, Tailwind CSS 4,
Motion, Phosphor Icons, Biome and Vitest.

## Rules

- Read the relevant Next.js guide in `node_modules/next/dist/docs/` before changing
  Next.js APIs.
- Use strict TypeScript and the `@/*` path alias. Relative imports are only for
  files in the same directory.
- Keep pure particle math in `lib/particles` and DOM/WebGL integration in
  `components/particles`.
- Components should stay thin and new types should be colocated. Match existing
  conventions when editing legacy files.
- Preserve themes and the no-flash theme bootstrap in `app/globals.css` and
  `app/layout.tsx`. Add translations to both message files in
  `lib/i18n/messages/`.
- Write code and identifiers in English. Avoid unnecessary comments and `any`.

## Validation

```bash
npm run lint
npm run type-check
npm test
npm run build
```

Maintain at least 80% coverage. Use the `jsdom` Vitest environment for DOM tests.

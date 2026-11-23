# moeabahre.com

Personal site and portfolio of Mohammad (Moe) Abahre. Arabic and English.

Built with Astro, GSAP and Lenis. Fonts are self-hosted (Archivo, Alexandria).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321/en/  and  /ar/
```

`npm run build` writes the static site to `dist/`. `npm run preview` serves that build.

## Where things live

The design source is the Figma file "Moe Ali Web Site V26" (page "Home Page UI").

- All text, English and Arabic: `src/i18n/content.ts`
- The page: `src/pages/[lang]/index.astro`
- Styles (desktop sizes are the Figma values × `--u`): `src/styles/global.css`
- Motion and header behaviour: `src/scripts/main.ts`

## Fonts

The design uses Lama Sans (licensed). `src/styles/fonts.css` uses the copy installed on the machine first,
then `/public/fonts/LamaSans-*.woff2` if those files are added, and otherwise falls back to Archivo and Alexandria.
Add the woff2 files to `public/fonts/` with the names listed in that file so every visitor sees Lama Sans.

## Still needed

- `public/cv.pdf` for the Download CV links.

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

- Text in both languages: `src/i18n/strings.ts`
- Projects, career path, services: `src/data/work.ts`
- Sections: `src/components/`
- Motion, cursor, project peek: `src/scripts/main.ts`
- Portrait lens: `src/scripts/lens.ts`
- Styles: `src/styles/global.css`

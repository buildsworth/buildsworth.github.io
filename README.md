# BuildsWorth

[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify&logoColor=white)](https://app.netlify.com/sites/buildsworthdc/deploys)
[![Live site](https://img.shields.io/badge/live-buildsworthdc.com-12281f)](https://buildsworthdc.com)

Marketing site for **BuildsWorth** — architecture, structure, interiors, and landscaping in Dhanbad.

**Live:** [buildsworthdc.com](https://buildsworthdc.com)

Performance before/after: see [PERFORMANCE.md](./PERFORMANCE.md).

## Stack

- [Astro](https://astro.build) + React (gallery lightbox)
- Sharp image pipeline + FFmpeg for the hero video
- Static host on [GitHub Pages](https://pages.github.com/) ([buildsworth.github.io](https://buildsworth.github.io/)); also deployable on Netlify

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

`npm run dev` and `npm run build` both run `scripts/optimize-images.mjs` first (WebP media, favicon, brand logo, OG share card, compressed showcase video).

```bash
npm run images   # regenerate media only
npm run build    # production build → dist/
npm run preview  # preview the build
```

## Project layout

| Path | Purpose |
|------|---------|
| `src/` | Pages, layout, components, styles |
| `resource/` | Source images, fonts, and video |
| `scripts/optimize-images.mjs` | Media + OG card generation |
| `scripts/cutout-portraits.py` | Optional rembg cutouts for team / associates |
| `public/` | Generated assets (`og.png`, `favicon.png`, `/media`, `/video`) |
| `netlify.toml` | Build command, publish dir, security headers |

## Deploy

### GitHub Pages (this repo)

Pushes to `main` run [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) (`npm run build` → `dist`).

**One-time setup** (needs repo admin): Settings → Pages → Build and deployment → Source → **GitHub Actions**.  
Until that is set, GitHub still runs the legacy Jekyll job on `main` (kept green via `_config.yml` excludes).

### Netlify (optional)

`netlify.toml` publishes `dist` the same way (`npm run build`).

For the live green/red **deploy status** badge from Netlify: Site settings → General → Status badges → paste that markdown in place of the Netlify badge above.

## Licence

See [LICENSE](./LICENSE).

# BuildsWorth performance benchmark

Scan dates: **25 September 2026**.

| Phase | Target |
| --- | --- |
| **Initial** | Live old static site at [buildsworthdc.com](https://buildsworthdc.com/) |
| **Current** | Astro static production preview (`dist/` via `astro preview`) |

Tooling: Lighthouse 13 (mobile slow-4G + desktop presets).

---

## Scores

| Metric | Initial | Current | Change |
| --- | ---: | ---: | ---: |
| Performance (mobile) | 42 | **79** | +37 |
| Performance (desktop) | 69 | **99** | +30 |
| Accessibility | 89 | **97** | +8 |
| Best practices | 77 | **100** | +23 |
| SEO | 100 | **100** | — |

## Core Web Vitals

| Metric | Initial | Current | Change |
| --- | ---: | ---: | ---: |
| FCP mobile | 4.5 s | **1.4 s** | −69% |
| LCP mobile | 13.0 s | **5.5 s** | −58% |
| Speed Index mobile | 5.9 s | **1.4 s** | −76% |
| TBT mobile | 780 ms | **0 ms** | −100% |
| CLS mobile | ~0 | **0** | — |
| FCP desktop | 1.9 s | **0.3 s** | −84% |
| LCP desktop | 3.5 s | **1.0 s** | −71% |
| TBT desktop | 40 ms | **0 ms** | −100% |

## Payload

| Asset | Initial | Current | Change |
| --- | ---: | ---: | ---: |
| Page transfer (mobile, Lighthouse) | ~29.8 MB | **~4.0 MB** | −87% |
| Page transfer (desktop) | ~34.3 MB | **~4.1 MB** | −88% |
| Hero video (`showcase.mp4`) | 22.5 MB | **5.25 MB** | −77% |
| Shipped site total | ~41.1 MB (old repo) | **~9.5 MB** (`dist/`) | −77% |
| Hero poster WebP | — | **88 KB** | — |

### What drove the weight cut

- Hero video re-encoded (CRF 28, 1280 max, no audio)
- Gallery / team / clientele images → WebP with max width caps
- Dropped CDN UI kits (Boxicons, Font Awesome, Remix, Animate.css, Swiper)
- Astro ships HTML + small CSS/JS; React only for the lightbox

## Remaining bottleneck

Mobile LCP is still **5.5 s** under slow-4G throttling. The hero MP4 still dominates the network (~3 MB of the ~4 MB Lighthouse transfer). The poster is only 88 KB.

Possible next steps: shorter/lighter hero loop, start video after first paint, or lazy-load below-fold gallery tiles harder.

## Method notes

- Initial run audited the **live** Netlify site (old `index.html` stack).
- Current run audited the **production** preview — not `astro dev` (Vite HMR/toolbar scripts inflate FCP/LCP and are not shipped).
- Interactive charts: open the Cursor canvas `performance-benchmark-compare.canvas.tsx` beside chat.

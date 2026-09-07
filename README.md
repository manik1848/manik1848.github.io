# Portfolio

Personal site for Manikandan Prakash. React 19 + Vite 7 + TypeScript + Tailwind v4,
deployed to GitHub Pages by GitHub Actions.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run og         # regenerate public/og.png from scripts/og-card.html
```

## Content

Home page copy lives in [`src/data/content.ts`](src/data/content.ts), case study copy in
[`src/data/cases.ts`](src/data/cases.ts). Nothing is hardcoded in the components, so editing those
two files updates the whole site. Keep them in sync with `resume.html` in the parent folder so the
site and the PDF never contradict each other.

## Case studies

Three long-form pages, built as real pages rather than client-side routes so each has its own
`<title>`, description, canonical URL and preview card:

| URL | Source |
|---|---|
| `/case/tenant-isolation/` | LFH multi-tenant ERP |
| `/case/video-pipeline/` | OTT ingest, transcode and live streaming |
| `/case/dispatch-engine/` | Ride-hailing dispatch |

To add another: append an entry to `src/data/cases.ts`, add `src/pages/<slug>.tsx` (copy an
existing one), add `case/<slug>/index.html`, register it in `build.rollupOptions.input` in
`vite.config.ts`, add a card to `scripts/build-og.mjs`, and add the URL to `public/sitemap.xml`.

## Deploying to GitHub Pages

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

After that, every push to `main` builds and deploys via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Live URL: `https://manik1848.github.io/`

The site is configured for a user page (repo named `manik1848.github.io`) in `.env`:

```
VITE_BASE=/
VITE_SITE_URL=https://manik1848.github.io
```

If this ever moves back to a project page, change those two lines to `/<repo-name>/` and
`https://manik1848.github.io/<repo-name>`, then update the absolute URLs in `public/robots.txt`
and `public/sitemap.xml` to match.

### Custom domain

Add a `public/CNAME` file containing the bare domain, set the domain under Settings → Pages, and
set `VITE_SITE_URL=https://yourdomain.com`.

## SEO and link previews

Every page carries a real meta description, canonical URL, Open Graph and Twitter card tags, and
JSON-LD (Person on the home page, TechArticle on each case study).

Preview images are generated, not hand-made: `npm run og` renders every card defined in
`scripts/build-og.mjs` through the `scripts/og-card.html` template with headless Chrome, writing
`public/og.png` plus one `og-<slug>.png` per case study. Needs Chrome installed; override the
binary with `CHROME_PATH=... npm run og`.

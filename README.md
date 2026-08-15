# Bulk SMS Platform Landing Site

Marketing/landing website for Zentive, a direct-to-carrier bulk SMS platform for the
Kenyan market, built by Xtranet Communications Limited. Built with Next.js 14 (App
Router), TypeScript, and Tailwind CSS, with SEO, AEO (answer engines), and GEO
(generative/AI engines) optimization built in from the start.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Fonts:** Space Grotesk (display), Inter (body), IBM Plex Mono (technical/data),
  loaded via `next/font/google`

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

```bash
npm run build      # production build — also generates sitemap.xml, robots.txt, llms.txt
npm run start       # serve the production build locally
```

`npm run build` requires network access to `fonts.googleapis.com`, since Next.js
self-hosts Google Fonts at build time.

## Configuration

All brand and contact details live in a single file: **`lib/site-config.ts`**. Product
name, company name, domain, contact email/phone, and address are defined there and
referenced throughout the app, so rebranding or repointing the site only requires
editing that one file.

## Project structure

```table
app/
  layout.tsx        Root layout — fonts, global metadata, Organization + SoftwareApplication JSON-LD
  page.tsx           Homepage — hero, features, glossary, how-it-works, use cases, FAQ, CTA
  globals.css         Tailwind entry point + base styles
  sitemap.ts          Generates /sitemap.xml
  robots.ts            Generates /robots.txt
  llms.txt/route.ts    Generates /llms.txt (structured summary for AI answer engines)
components/
  SiteHeader.tsx        Sticky nav + primary CTA
  SiteFooter.tsx         Footer with compliance and contact info
  RouteDiagram.tsx        Custom SVG comparing direct-SMPP routing vs. aggregator routing
  FaqItem.tsx              Accessible FAQ accordion item (native <details>/<summary>)
lib/
  site-config.ts        Single source of truth for brand/contact/config values
```

## SEO / AEO / GEO implementation

- **Structured data:** `Organization` and `SoftwareApplication` JSON-LD in the root
  layout; `FAQPage` JSON-LD on the homepage.
- **Sitemap & robots:** generated dynamically from `app/sitemap.ts` and `app/robots.ts`.
  `robots.ts` explicitly allows standard search crawlers as well as AI/answer-engine
  crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User,
  ClaudeBot, Claude-User, Google-Extended, Applebot-Extended).
- **`llms.txt`:** a structured plain-text summary of the platform (status, key facts,
  differentiators, contact info) served at `/llms.txt`, generated from `site-config.ts`
  so it can't drift out of sync with the rest of the site.
- **Answer-first content:** FAQ and glossary sections lead with direct, quotable answers
  immediately after each heading, formatted for extraction by featured snippets and AI
  answer engines.

## Design system

- **Palette:** warm off-white "paper" background, near-black "ink" for text and dark
  sections, a burnt-amber "signal" accent for CTAs and the route diagram, a deep teal
  "wire" accent for compliance/trust markers.
- **Type:** Space Grotesk for headings, Inter for body copy, IBM Plex Mono for data
  points, labels, and the route diagram.
- Tokens are defined in `tailwind.config.js`.

## Scripts

| Command         | Description                          |
| --------------- | -------------------------------------|
| `npm run dev`   | Start the local development server   |
| `npm run build` | Create a production build            |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Deployment

Standard Next.js app — deployable to any Node-compatible host with zero
additional configuration.

## Roadmap

- Pricing page (pending confirmed per-message rates)
- API reference page (pending a stable public API)
- Testimonials / social proof section (pending pilot clients)
- Blog / content hub for longer-form SEO and GEO content

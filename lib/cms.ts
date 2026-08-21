import { siteConfigDefaults, type SiteConfig } from "@/lib/site-config";

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:8000";

// How long a cached response is served before Next.js revalidates it in the
// background (ISR). 60s means a CMS edit shows up on the live site within a
// minute, without a redeploy. Tune per how "live" this needs to feel.
const REVALIDATE_SECONDS = 60;

async function cmsFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // CMS unreachable (down, network issue, wrong URL) — caller falls back.
    return null;
  }
}

// ---- Site settings --------------------------------------------------

interface CmsSettings {
  product_name: string;
  company_name: string;
  tagline: string;
  domain: string;
  contact_email: string;
  contact_phone: string;
  street_address: string;
  address_locality: string;
  address_country: string;
  regulator: string;
  licence: string;
  data_law: string;
  social_linkedin: string;
  social_x: string;
}

/**
 * Returns the site config in the shape every component already expects.
 * Any field missing or empty from the CMS falls back to the static default
 * for that field individually — a partially-filled-in settings screen
 * doesn't take down the whole site, just that one field.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  const cms = await cmsFetch<CmsSettings>("/api/v1/public/settings");
  if (!cms) return siteConfigDefaults;

  const pick = (cmsValue: string | undefined, fallback: string) =>
    cmsValue && cmsValue.trim() !== "" ? cmsValue : fallback;

  return {
    productName: pick(cms.product_name, siteConfigDefaults.productName),
    companyName: pick(cms.company_name, siteConfigDefaults.companyName),
    tagline: pick(cms.tagline, siteConfigDefaults.tagline),
    domain: pick(cms.domain, siteConfigDefaults.domain),
    contactEmail: pick(cms.contact_email, siteConfigDefaults.contactEmail),
    contactPhone: pick(cms.contact_phone, siteConfigDefaults.contactPhone),
    streetAddress: pick(cms.street_address, siteConfigDefaults.streetAddress),
    addressLocality: pick(
      cms.address_locality,
      siteConfigDefaults.addressLocality,
    ),
    addressCountry: pick(
      cms.address_country,
      siteConfigDefaults.addressCountry,
    ),
    regulator: pick(cms.regulator, siteConfigDefaults.regulator),
    licence: pick(cms.licence, siteConfigDefaults.licence),
    dataLaw: pick(cms.data_law, siteConfigDefaults.dataLaw),
    social: {
      linkedin: pick(cms.social_linkedin, siteConfigDefaults.social.linkedin),
      x: pick(cms.social_x, siteConfigDefaults.social.x),
    },
  };
}

// ---- FAQs -------------------------------------------------------------

export interface Faq {
  id: number;
  question: string;
  answer: string;
  sort_order?: number;
  is_published?: boolean;
}

// Same content that used to be hardcoded in page.tsx — now the fallback
// rather than the source of truth.
export const faqFallback: Faq[] = [
  {
    id: 1,
    question:
      "How is this different from a bulk SMS aggregator or CPaaS provider?",
    answer:
      "Most bulk SMS providers in Kenya relay your traffic through their own upstream carrier relationships and charge a margin on top. This platform connects directly to the MNO's SMSC over SMPP, so routing, cost, compliance, and data handling stay in one place instead of passing through a reseller.",
  },
  {
    id: 2,
    question: "Which mobile networks are supported?",
    answer:
      "Safaricom is the first direct SMPP integration. The platform's routing layer is built to extend to Airtel and Telkom without an architectural change.",
  },
  {
    id: 3,
    question: "Is this compliant with Kenyan telecoms regulation?",
    answer:
      "The platform operates under a CA Communications Service Provider (CSP) licence. It enforces CAK-mandated sending-time windows for promotional messages, maintains an opt-out/DND list automatically, and requires sender IDs to be pre-approved and mapped to a verified account before use.",
  },
  {
    id: 4,
    question: "How is subscriber data protected?",
    answer:
      "Contact data and message content are encrypted at rest, all client-facing traffic runs over TLS, and handling of subscriber phone numbers and message content complies with the Kenya Data Protection Act, 2019.",
  },
  {
    id: 5,
    question: "How do I integrate — API or dashboard?",
    answer:
      "Both. A REST API (single send, bulk send, delivery-status lookup, webhook registration) covers programmatic integration, with a sandbox environment for testing. The web portal covers campaign creation, contact-list management, and reporting for non-technical users.",
  },
  {
    id: 6,
    question: "How is message delivery tracked?",
    answer:
      "Every submitted message gets a delivery report (DLR) from the network, captured and exposed in real time — at the individual message level and rolled up into campaign-level analytics you can export.",
  },
  {
    id: 7,
    question: "How does billing work?",
    answer:
      "Billing runs on a prepaid wallet: top up, and balance is deducted per successfully routed message. Every top-up and deduction is recorded in a full transaction ledger, visible in real time.",
  },
  {
    id: 8,
    question: "What throughput can I expect?",
    answer:
      "The initial target is 10–30 transactions per second (TPS) per SMPP bind. Throughput scales horizontally by adding further binds and worker instances as volume grows, without changing how you integrate.",
  },
];

export async function getFaqs(): Promise<Faq[]> {
  const cms = await cmsFetch<Faq[]>("/api/v1/public/faqs");
  const publishedFaqs = cms
    ?.filter((faq) => faq.is_published !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return publishedFaqs && publishedFaqs.length > 0
    ? publishedFaqs
    : faqFallback;
}

// ---- Testimonials -------------------------------------------------------

export interface Testimonial {
  id: number;
  client_name: string;
  client_role: string | null;
  client_org: string | null;
  logo_url: string | null;
  quote: string;
}

/**
 * No fallback data on purpose — there are no real testimonials yet. The
 * section that renders these should check for an empty array and render
 * nothing at all rather than show a fake or empty-looking section.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  return (await cmsFetch<Testimonial[]>("/api/v1/public/testimonials")) ?? [];
}

// ---- Blog posts ---------------------------------------------------------

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  body: string; // sanitized HTML, safe to render — see app/blog/[slug]/page.tsx
  seo_title: string | null;
  seo_description: string | null;
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  return (await cmsFetch<BlogPostSummary[]>("/api/v1/public/blog-posts")) ?? [];
}

export async function getBlogPost(
  slug: string,
): Promise<BlogPostDetail | null> {
  return cmsFetch<BlogPostDetail>(
    `/api/v1/public/blog-posts/${encodeURIComponent(slug)}`,
  );
}

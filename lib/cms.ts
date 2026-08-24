import { siteConfigDefaults, type SiteConfig } from "@/lib/site-config";

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:8000";

// How long a cached response is served before Next.js revalidates it in the
// background (ISR). 60s means a CMS edit shows up on the live site within a
// minute, without a redeploy. Tune per how "live" this needs to feel.
const REVALIDATE_SECONDS = 20;

async function cmsFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(
        `[cms] ${CMS_API_URL}${path} returned ${res.status}, falling back`,
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    // CMS unreachable (down, network issue, wrong URL) — caller falls back.
    // Logged rather than swallowed silently: a misconfigured CMS_API_URL or
    // a CMS that isn't running looks identical to a real outage from here,
    // and both were previously indistinguishable from "the CMS has no data."
    console.error(
      `[cms] fetch failed for ${CMS_API_URL}${path}, falling back:`,
      err,
    );
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

// ---- Page content (hero, features, security, etc.) --------------------

export interface HeroContent {
  eyebrow: string;
  headline_before: string;
  headline_highlight: string;
  headline_after: string;
  subhead: string;
  primary_cta_label: string;
  secondary_cta_label: string;
  trust_stats: { label: string; value: string }[];
}

export interface FeatureGroup {
  category: string;
  items: string[];
}
export interface FeaturesContent {
  heading: string;
  groups: FeatureGroup[];
}

export interface SecurityBulletContent {
  icon: string; // key into ICON_MAP — see components/SecurityIcon.tsx
  title: string;
  body: string;
}
export interface SecurityContent {
  heading: string;
  bullets: SecurityBulletContent[];
}

export interface GlossaryItem {
  title: string;
  body: string;
}
export interface GlossaryContent {
  items: GlossaryItem[];
}

export interface Step {
  n: string;
  title: string;
  badges: string[];
  body: string;
}
export interface HowItWorksContent {
  heading: string;
  subhead: string;
  steps: Step[];
}

export interface ApiEndpoint {
  method: string;
  path: string;
  desc: string;
}
export interface EngineeringContent {
  heading: string;
  bullets: string[];
  cta_label: string;
  api_endpoints: ApiEndpoint[];
}

export interface Stat {
  value: string;
  label: string;
}
export interface StatsContent {
  items: Stat[];
}

export interface ClientSegment {
  segment: string;
  body: string;
  scenarios: string[];
}
export interface UseCasesContent {
  heading: string;
  closing_line: string;
  segments: ClientSegment[];
}

export interface FinalCtaContent {
  headline: string;
  body: string;
  cta_label: string;
}

export interface PageContent {
  hero: HeroContent;
  features: FeaturesContent;
  security: SecurityContent;
  glossary: GlossaryContent;
  how_it_works: HowItWorksContent;
  engineering: EngineeringContent;
  stats: StatsContent;
  use_cases: UseCasesContent;
  final_cta: FinalCtaContent;
}

// Fallback defaults — kept in sync with PageSectionSeeder.php by hand.
// If the CMS is unreachable, or a specific section key is missing/wasn't
// seeded yet, the corresponding piece here is used instead. Each section
// falls back independently, same as everywhere else in this file.
const pageContentFallback: PageContent = {
  hero: {
    eyebrow: "Bulk SMS Platform, built for Kenyan Enterprises",
    headline_before: "Send bulk SMS over a ",
    headline_highlight: "direct SMPP connection",
    headline_after: " to the network — not through an aggregator.",
    subhead:
      "{productName} connects straight to the MNO's SMSC, starting with Safaricom. That means direct control over routing, cost, compliance, and your data — with real-time delivery reports and CAK-compliant sender governance built in from day one.",
    primary_cta_label: "Request early access",
    secondary_cta_label: "See the platform",
    trust_stats: [
      { label: "Licensed", value: "CA CSP" },
      { label: "Connection", value: "Direct SMPP" },
      { label: "Uptime target", value: "99.9%" },
    ],
  },
  features: {
    heading:
      "Everything a compliance-conscious sender needs — nothing you have to build yourself.",
    groups: [
      {
        category: "Core messaging",
        items: [
          "Single & bulk SMS send via API or portal",
          "Scheduled and recurring campaigns",
          "Two-way messaging with automated keyword replies",
          "Long/concatenated SMS and Unicode support",
          "Multiple sender IDs per account",
        ],
      },
      {
        category: "Compliance & trust",
        items: [
          "Opt-out / DND list management",
          "CAK sending-window enforcement",
          "Sender-ID approval workflow",
          "Prohibited-content filtering",
        ],
      },
      {
        category: "Account & billing",
        items: [
          "Prepaid wallet with real-time balance",
          "Multi-user accounts with role-based access",
          "Full transaction ledger",
        ],
      },
      {
        category: "Reporting & analytics",
        items: [
          "Real-time delivery reports (DLR)",
          "Campaign-level analytics dashboards",
          "Exportable reports",
        ],
      },
      {
        category: "Developer tools",
        items: [
          "REST API with API-key authentication",
          "Webhooks for delivery/status events",
          "Sandbox / test environment",
        ],
      },
      {
        category: "Reliability",
        items: [
          "Automatic failover and retry logic",
          "Queue-based architecture absorbs traffic bursts",
          "99.9% uptime target",
        ],
      },
    ],
  },
  security: {
    heading: "Built to survive review, not just a demo.",
    bullets: [
      {
        icon: "lock",
        title: "TLS in transit",
        body: "All client-facing API and portal traffic runs over TLS.",
      },
      {
        icon: "shield-check",
        title: "Encrypted at rest",
        body: "Contact data and message content are encrypted in storage.",
      },
      {
        icon: "key-round",
        title: "RBAC + key rotation",
        body: "Role-based access for portal/admin users; per-client API keys support rotation.",
      },
      {
        icon: "scroll-text",
        title: "Kenya DPA, 2019",
        body: "Subscriber data handling complies with the Kenya Data Protection Act, 2019.",
      },
      {
        icon: "clock-3",
        title: "CAK sending rules",
        body: "Sending-window and DND opt-out rules are enforced automatically, not manually.",
      },
      {
        icon: "list-checks",
        title: "Rate limits + audit log",
        body: "Per-account rate limiting, prohibited-content filtering, full audit logging of submissions.",
      },
    ],
  },
  glossary: {
    items: [
      {
        title: "What is SMPP?",
        body: "SMPP (Short Message Peer-to-Peer) is the industry-standard protocol used to exchange SMS traffic between an application and a mobile network's SMSC. {productName} holds a persistent SMPP v3.4 bind directly to the MNO, rather than sending through a reseller's own SMPP connection.",
      },
      {
        title: "What is a DLR?",
        body: "A DLR (delivery report) is the confirmation sent back by the network stating whether a message reached the handset. Every message sent through the platform gets a DLR captured and matched back to it in real time.",
      },
      {
        title: "What is sender-ID governance?",
        body: "It's the approval process that maps an alphanumeric sender name (e.g. your business name) to a verified account before it can be used, so recipients can trust who a message is really from and spoofed sender names are rejected.",
      },
      {
        title: "What is a prepaid wallet?",
        body: "You top up your account, and each successfully delivered message deducts from your balance. Every top-up and deduction is recorded in a transaction ledger you can view and export.",
      },
    ],
  },
  how_it_works: {
    heading: "Two ways in. One direct route to the network.",
    subhead:
      "However a message reaches the platform — API or portal — it leaves the same way: over our own SMPP bind, straight to the MNO. Nothing resold in between.",
    steps: [
      {
        n: "01",
        title: "Send — your way in",
        badges: ["REST API", "Web portal"],
        body: "Developers integrate against the REST API — single send, bulk send via JSON/CSV, webhooks. Campaign teams use the web portal instead. Same platform, same routing, underneath either one.",
      },
      {
        n: "02",
        title: "Route — direct to the network",
        badges: ["Direct SMPP bind"],
        body: "No resale hop. The message goes out over our own persistent SMPP v3.4 bind straight to the MNO's SMSC — Safaricom first — the same connection every time, not resold third-party capacity.",
      },
      {
        n: "03",
        title: "Confirm",
        badges: ["Confirmation DLR's"],
        body: "A delivery report (DLR) comes back from the network and is matched to the original message.",
      },
      {
        n: "04",
        title: "Report",
        badges: [],
        body: "Delivery status, campaign analytics, and wallet usage are all visible in real time in the dashboard.",
      },
    ],
  },
  engineering: {
    heading: "A REST API, not a black box.",
    bullets: [
      "API-key authentication, with rotation support",
      "Webhooks for delivery/status events",
      "Sandbox environment, isolated from your live wallet and traffic",
      "Standard REST/JSON — fits whatever stack you're already running",
    ],
    cta_label: "Get API access",
    api_endpoints: [
      { method: "POST", path: "/v1/sms/send", desc: "Submit a single SMS" },
      {
        method: "POST",
        path: "/v1/sms/bulk",
        desc: "Submit a batch (JSON or CSV)",
      },
      {
        method: "GET",
        path: "/v1/sms/status/{message_id}",
        desc: "Delivery status lookup",
      },
      {
        method: "POST",
        path: "/v1/webhooks/register",
        desc: "Register a DLR callback URL",
      },
      {
        method: "GET",
        path: "/v1/account/balance",
        desc: "Current wallet balance",
      },
      {
        method: "POST",
        path: "/v1/sender-ids",
        desc: "Request sender-ID registration",
      },
      {
        method: "GET",
        path: "/v1/reports/campaigns/{id}",
        desc: "Campaign delivery/analytics",
      },
      {
        method: "POST",
        path: "/v1/optout",
        desc: "Register a recipient opt-out (DND)",
      },
    ],
  },
  stats: {
    items: [
      { value: "10–30 TPS", label: "per SMPP bind" },
      { value: "Horizontal", label: "scaling via additional binds & workers" },
      { value: "99.9%", label: "uptime target, excl. scheduled maintenance" },
      { value: "Queue-based", label: "architecture absorbs traffic bursts" },
    ],
  },
  use_cases: {
    heading:
      "Built for traffic that has to arrive — and traffic that has to obey the rules.",
    closing_line:
      "Campaign and ops teams manage sends, contact lists, and delivery reports directly in the portal; engineering teams that want it wired into their own systems integrate the same functionality through the API.",
    segments: [
      {
        segment: "Banks & SACCOs",
        body: "Transaction alerts, OTPs, and statement notifications where delivery has to be immediate, auditable, and never queued behind a promotional blast.",
        scenarios: [
          "One-time passcodes for login and transaction approval",
          "Real-time debit/credit and low-balance alerts",
          "Statement and mini-statement notifications",
          "Loan repayment and arrears reminders",
        ],
      },
      {
        segment: "Retail & Enterprise",
        body: "Promotional and operational messaging at volume, sent through a system that enforces CAK sending-window and opt-out rules automatically instead of leaving compliance to whoever hits send.",
        scenarios: [
          "Scheduled promotional campaigns to segmented contact lists",
          "Order confirmations and delivery notifications",
          "Appointment, renewal, and payment reminders",
          "Internal staff and operational alerts",
        ],
      },
    ],
  },
  final_cta: {
    headline: "Get early access before general availability.",
    body: "We're onboarding a small number of pilot clients ahead of go-live — particularly banks, SACCOs, and enterprises with recurring, high-volume messaging needs. Pilot clients get preferential pricing, direct input into the roadmap, and dedicated onboarding support. Tell us about your sending volume and use case.",
    cta_label: "Request early access",
  },
};

/**
 * True if every string in this value is blank and every array is empty —
 * i.e. the section technically has content, but nothing a visitor would
 * actually see. Distinct from "genuinely missing," which cmsFetch already
 * handles by returning null.
 *
 * This exists because a CMS response of `{}` or `{ heading: "", bullets: [] }`
 * is still a truthy object — without this check, an accidentally-emptied
 * section in the admin renders as a blank section on the live site instead
 * of falling back to the default copy, which is exactly the bug this fixes.
 */
function isDeeplyEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every(isDeeplyEmpty);
  }
  return false; // numbers, booleans, etc. count as meaningful content
}

export async function getPageContent(): Promise<PageContent> {
  const cms = await cmsFetch<Partial<Record<keyof PageContent, unknown>>>(
    "/api/v1/public/page-content",
  );

  // Each section falls back independently — a CMS that only has 3 of the 9
  // sections filled in still renders the other 6 correctly from defaults,
  // rather than the whole page falling back just because one key is empty.
  // "Falls back" means: missing entirely, OR present but deeply empty
  // (every field blank) — a partial edit that leaves *some* real content
  // is respected as-is, even if it renders sparser than the default.
  const keys = Object.keys(pageContentFallback) as (keyof PageContent)[];
  const result = {} as PageContent;
  for (const key of keys) {
    const value = cms?.[key];
    const useValue =
      value && typeof value === "object" && !isDeeplyEmpty(value);
    (result as unknown as Record<string, unknown>)[key] = useValue
      ? value
      : pageContentFallback[key];
  }
  return result;
}

/**
 * Replaces {productName} tokens in CMS-authored copy. Section content is
 * stored with a literal "{productName}" placeholder (see the seeder)
 * rather than the actual product name, so a rebrand doesn't require
 * editing every section that happens to mention the product by name.
 */
export function interpolate(text: string, siteConfig: SiteConfig): string {
  return text.replace(/\{productName\}/g, siteConfig.productName);
}

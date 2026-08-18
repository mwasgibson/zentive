/**
 * SITE CONFIG
 *
 * Values marked "ASSUMED" below are my best default, not a confirmed fact —
 * confirm or correct them, they're the only ones that were guessed.
 */
export const siteConfig = {
  // ---- Identity -----------------------------------------------------
  productName: "Zentive",
  companyName: "Xtranet Communications Limited",
  tagline: "Direct-to-carrier bulk SMS for Kenyan businesses",

  // ---- Domain / URLs --------------------------------------------------
  // ASSUMED: no dedicated Zentive domain confirmed yet, so this defaults to
  // a subdomain of the parent company's real, existing domain. Swap this
  // the moment a standalone domain (e.g. zentive.co.ke) is registered.
  domain: "https://zentive.xtranet.co.ke",
  // ASSUMED: product-specific inbox pattern under the real xtranet.co.ke
  // domain. Xtranet's general inbox is info@xtranet.co.ke if you'd rather
  // route early-access enquiries there instead until a dedicated inbox exists.
  contactEmail: "info@xtranet.co.ke",
  // Real Xtranet Communications Limited line (from xtranet.co.ke). Swap for
  // a dedicated Zentive sales/support line once one exists.
  contactPhone: "+254 020 2490999",

  // ---- Location (real — from xtranet.co.ke) ----------------------------
  streetAddress: "TRV Building, 7th Floor, Muthithi Road, Westlands",
  addressLocality: "Nairobi",
  addressCountry: "KE",

  // ---- Regulatory / trust signals (from the technical spec) -----------
  regulator: "Communications Authority of Kenya (CAK)",
  licence: "CA Communications Service Provider (CSP) licence",
  dataLaw: "Kenya Data Protection Act, 2019",

  // ---- Socials -----------------------------------------------------
  // Left blank: xtranet.co.ke's Facebook/X/LinkedIn/Instagram accounts are
  // the parent company's corporate socials, not Zentive-specific. Fill in
  // if/when Zentive gets its own, or replace with Xtranet's if you'd rather
  // borrow their existing audience for now.
  social: {
    linkedin: "",
    x: "",
  },
} as const;

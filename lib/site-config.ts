/**
 * SITE CONFIG DEFAULTS — the fallback used when the CMS is unreachable.
 *
 * This used to be the live source of truth for every value on the site.
 * Since the CMS wiring (lib/cms.ts), it's the fallback instead — the CMS's
 * "Site settings" screen is now where these values actually get edited day
 * to day. Update this file only when you want to change what the site
 * shows if the CMS API can't be reached at all.
 *
 * Values here reflect what's currently seeded in the CMS
 * (SiteSettingSeeder.php) — keep the two in sync if either changes.
 */
export interface SiteConfig {
  productName: string;
  companyName: string;
  tagline: string;
  domain: string;
  contactEmail: string;
  contactPhone: string;
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
  regulator: string;
  licence: string;
  dataLaw: string;
  social: {
    linkedin: string;
    x: string;
  };
}

export const siteConfigDefaults: SiteConfig = {
  productName: "Zentive",
  companyName: "Xtranet Communications Limited",
  tagline: "Direct-to-carrier bulk SMS for Kenyan businesses",
  domain: "https://zentive.xtranet.co.ke",
  contactEmail: "info@xtranet.co.ke",
  contactPhone: "+254 020 2490999",
  streetAddress: "TRV Building, 7th Floor, Muthithi Road, Westlands",
  addressLocality: "Nairobi",
  addressCountry: "KE",
  regulator: "Communications Authority of Kenya (CAK)",
  licence: "CA Communications Service Provider (CSP) licence",
  dataLaw: "Kenya Data Protection Act, 2019",
  social: {
    linkedin: "",
    x: "",
  },
};

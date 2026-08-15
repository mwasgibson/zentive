import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-paper/80">
      <div className="section grid gap-10 py-14 md:grid-cols-3">
        <div>
          <a href="#top" className="logo font-display text-2xl font-semibold tracking-tight text-paper hover:text-paper/80">
            {siteConfig.productName}
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
            A directly-operated bulk SMS platform for the Kenyan market — built on a direct SMPP
            connection to the MNO, not resold through an aggregator.
          </p>
        </div>
        <div>
          <p className="eyebrow text-paper/50">Compliance</p>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
            <li>{siteConfig.licence}</li>
            <li>{siteConfig.dataLaw}</li>
            <li>CAK sending-window &amp; consent rules</li>
          </ul>
        </div>
        <div id="contact">
          <p className="eyebrow text-paper/50">Talk to us</p>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-paper">
                {siteConfig.contactEmail}
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.contactPhone}`} className="hover:text-paper">
                {siteConfig.contactPhone}
              </a>
            </li>
            <li>{siteConfig.addressLocality}, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="section flex flex-col gap-2 border-t border-paper/10 py-6 text-xs text-paper/65 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.
        </p>
        <p>Nairobi, Kenya</p>
      </div>
    </footer>
  );
}
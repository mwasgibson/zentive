import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { href: "#platform", label: "Platform" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/90 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-8">
        <a href="#top" className="group relative inline-flex items-center">
          <div className="relative rounded-2xl rounded-bl-sm bg-ink px-3.5 py-1.5 text-paper shadow-sm transition-transform group-hover:scale-[1.02]">
            <span className="font-display text-lg font-bold tracking-tight text-paper">
              {siteConfig.productName}
            </span>
          </div>
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a href={`mailto:${siteConfig.contactEmail}`} className="btn-primary">
          Request early access
        </a>
      </div>
    </header>
  );
}
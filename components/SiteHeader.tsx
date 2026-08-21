import Link from "next/link";
import { getSiteConfig } from "@/lib/cms";

const navItems = [
  { href: "/#platform", label: "Platform" },
  { href: "/#security", label: "Security" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#use-cases", label: "Use cases" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export async function SiteHeader() {
  const siteConfig = await getSiteConfig();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/90 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-8 relative">
        <a href="#top" className="group relative inline-flex items-center">
          <div className="relative rounded-2xl rounded-bl-sm bg-ink px-3.5 py-1.5 text-paper shadow-sm transition-transform group-hover:scale-[1.02]">
            <span className="font-display text-lg font-bold tracking-tight text-paper">
              {siteConfig.productName}
            </span>
          </div>
        </a>
        <nav
          className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

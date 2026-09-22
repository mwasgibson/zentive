"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/#platform", label: "Platform" },
  { href: "/#security", label: "Security" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#use-cases", label: "Use cases" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      <div className="relative flex h-16 w-full items-center justify-between px-4 sm:px-8">
        <a href="#top" className="group relative z-50 inline-flex items-center">
          <div className="relative rounded-2xl rounded-bl-sm bg-ink/95 px-3.5 py-1.5 text-paper shadow-sm transition-transform duration-200 group-hover:scale-[1.02]">
            <span className="font-display text-lg font-bold tracking-tight text-paper">
              {productName}
            </span>
          </div>
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex"
          aria-label="Primary"
        >
          <div className="flex items-center gap-6 rounded-full border border-border/60 bg-paper/70 px-5 py-2 backdrop-blur">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-paper/80 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          <div className="flex w-4 flex-col gap-[5px]">
            <span
              className={[
                "h-[1.5px] w-full bg-ink transition-transform duration-300",
                open ? "translate-y-[6.5px] rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-[1.5px] w-full bg-ink transition-opacity duration-200",
                open ? "opacity-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-[1.5px] w-full bg-ink transition-transform duration-300",
                open ? "-translate-y-[6.5px] -rotate-45" : "",
              ].join(" ")}
            />
          </div>
        </button>
      </div>

      <div
        className={[
          "fixed inset-0 z-40 bg-paper/95 transition-opacity duration-300 md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!open}
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-6"
          aria-label="Mobile"
        >
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-semibold text-ink transition-colors hover:text-signal-dark"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 350ms ease ${80 + i * 40}ms, transform 350ms ease ${80 + i * 40}ms`,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useRef, useState } from "react";
import { Magnetic } from "@/components/Magnetic";

/**
 * CTA button that resists the void pull, then on click flies into the
 * center of the void image before opening mailto.
 */
export function CtaAccessButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [flying, setFlying] = useState(false);

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (flying) {
      e.preventDefault();
      return;
    }

    // Reduced motion → go straight to mail
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // allow default mailto
    }

    e.preventDefault();

    const btn = e.currentTarget;
    const voidEl = document.querySelector(".cta-void") as HTMLElement | null;
    const section = btn.closest(".cta-section") as HTMLElement | null;

    // Fallback if void isn't on screen (mobile)
    if (!voidEl || !section || getComputedStyle(voidEl).display === "none") {
      window.location.href = href;
      return;
    }

    const btnRect = btn.getBoundingClientRect();
    const voidRect = voidEl.getBoundingClientRect();

    // Center of the void media
    const targetX = voidRect.left + voidRect.width * 0.55;
    const targetY = voidRect.top + voidRect.height * 0.5;
    const startX = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;

    const dx = targetX - startX;
    const dy = targetY - startY;

    setFlying(true);

    // Fly via transform on the magnetic layer if present, else the anchor
    const layer =
      (btn.closest("[style*=\"transform\"]") as HTMLElement | null) ??
      (btn.parentElement as HTMLElement | null) ??
      btn;

    layer.style.transition =
      "transform 780ms cubic-bezier(0.4, 0, 0.2, 1), opacity 780ms ease";
    layer.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.35)`;
    layer.style.opacity = "0";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "60";

    window.setTimeout(() => {
      window.location.href = href;
      // Reset after a beat in case mailto doesn't leave the page
      window.setTimeout(() => {
        layer.style.transition = "none";
        layer.style.transform = "";
        layer.style.opacity = "";
        layer.style.pointerEvents = "";
        layer.style.zIndex = "";
        setFlying(false);
      }, 600);
    }, 800);
  }

  return (
    <div ref={wrapRef} className={`cta-resist${flying ? " cta-resist--flying" : ""}`}>
      <Magnetic bounds="section">
        <a
          href={href}
          className="btn-primary group shrink-0"
          onClick={onClick}
        >
          <span>{label}</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
      </Magnetic>
    </div>
  );
}

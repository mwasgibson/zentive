"use client";

/**
 * Full-section void media.
 * NASA public-domain visualization of space falling into a black hole
 * (stars + gravitational pull — not a spinning ring crop).
 * Credit: NASA Goddard.
 */
export function CtaVoid() {
  return (
    <div className="cta-void" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="cta-void__media"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Black_hole_representation.gif/960px-Black_hole_representation.gif"
        alt=""
        width={960}
        height={554}
        decoding="async"
      />
    </div>
  );
}

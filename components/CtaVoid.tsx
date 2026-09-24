"use client";

/**
 * Real media void — NASA public-domain black-hole visualization GIF.
 * Anchored at the right edge of the CTA row, fills left toward the button.
 * Credit: NASA Goddard / Jeremy Schnittman (public domain).
 */
export function CtaVoid() {
  return (
    <div className="cta-void" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="cta-void__media"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/BH_Accretion_Disk_Sim_360_Continuous.gif/500px-BH_Accretion_Disk_Sim_360_Continuous.gif"
        alt=""
        width={500}
        height={500}
        decoding="async"
      />
    </div>
  );
}

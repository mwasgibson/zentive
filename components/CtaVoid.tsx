"use client";

/**
 * Galaxy / space cinemagraph — sits from the right edge up to the button.
 * Put the Pixabay GIF at public/cta-void.gif
 * (https://pixabay.com/gifs/space-universe-galaxy-cinemagraph-1182/)
 */
export function CtaVoid() {
  return (
    <div className="cta-void" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="cta-void__media"
        src="/cta-void.gif"
        alt=""
        decoding="async"
      />
    </div>
  );
}

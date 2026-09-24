"use client";

/**
 * Void starts at the right edge of the CTA row and fills left toward the button.
 * Dark mass + stretched rays pulling inward — not a floating circle in open space.
 */
export function CtaVoid() {
  // Rays stretch from the dense right core leftward toward the button
  const rays = [
    { y: 18, x1: 92, x2: 28, w: 1.2 },
    { y: 28, x1: 95, x2: 18, w: 0.9 },
    { y: 38, x1: 98, x2: 35, w: 1.4 },
    { y: 48, x1: 100, x2: 12, w: 1.1 },
    { y: 58, x1: 97, x2: 22, w: 0.8 },
    { y: 68, x1: 99, x2: 30, w: 1.3 },
    { y: 78, x1: 94, x2: 15, w: 1.0 },
    { y: 88, x1: 96, x2: 40, w: 0.85 },
    { y: 12, x1: 90, x2: 45, w: 0.7 },
    { y: 95, x1: 93, x2: 38, w: 0.75 },
  ];

  return (
    <div className="cta-void" aria-hidden>
      <svg
        className="cta-void__svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Dense at the right edge, fades as it reaches left (toward button) */}
          <linearGradient id="void-fill" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#050505" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#0a0a0a" stopOpacity="0.7" />
            <stop offset="65%" stopColor="#141414" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#141414" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="void-core" cx="92%" cy="50%" r="45%">
            <stop offset="0%" stopColor="#000000" stopOpacity="1" />
            <stop offset="40%" stopColor="#0a0a0a" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#141414" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#141414" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Mass filling from the right */}
        <rect x="0" y="0" width="100" height="100" fill="url(#void-fill)" />
        <ellipse cx="88" cy="50" rx="28" ry="42" fill="url(#void-core)" />

        {/* Stretched rays pulling left toward the button */}
        {rays.map((r, i) => (
          <line
            key={i}
            className="cta-void__ray"
            x1={r.x1}
            y1={r.y}
            x2={r.x2}
            y2={r.y + (i % 2 === 0 ? -2 : 2)}
            stroke="rgba(20,20,20,0.55)"
            strokeWidth={r.w}
            strokeLinecap="round"
            style={{ animationDelay: `${(i % 5) * 0.4}s` }}
          />
        ))}

        {/* Hard core at the far right edge */}
        <ellipse cx="96" cy="50" rx="8" ry="18" fill="#000" />
      </svg>
    </div>
  );
}

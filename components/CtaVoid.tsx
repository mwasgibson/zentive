"use client";

/**
 * Dark void tucked under the CTA button.
 * Black core + stretched star streaks (no orange).
 */
export function CtaVoid() {
  // Fixed star positions — radial streaks that stretch outward from the core
  const stars = [
    { a: 12, r: 42, len: 18 },
    { a: 38, r: 48, len: 22 },
    { a: 55, r: 40, len: 14 },
    { a: 78, r: 52, len: 26 },
    { a: 105, r: 45, len: 16 },
    { a: 130, r: 50, len: 20 },
    { a: 155, r: 38, len: 12 },
    { a: 178, r: 55, len: 24 },
    { a: 200, r: 44, len: 18 },
    { a: 225, r: 50, len: 22 },
    { a: 250, r: 42, len: 15 },
    { a: 275, r: 48, len: 20 },
    { a: 300, r: 40, len: 14 },
    { a: 325, r: 53, len: 25 },
    { a: 25, r: 60, len: 10 },
    { a: 95, r: 62, len: 12 },
    { a: 165, r: 58, len: 11 },
    { a: 240, r: 61, len: 13 },
    { a: 310, r: 59, len: 10 },
  ];

  const cx = 100;
  const cy = 100;

  return (
    <div className="cta-void" aria-hidden>
      <svg
        className="cta-void__svg"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="void-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="1" />
            <stop offset="55%" stopColor="#0a0a0a" stopOpacity="0.95" />
            <stop offset="78%" stopColor="#141414" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#141414" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="void-rim" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="62%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="78%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft dark pull */}
        <circle cx={cx} cy={cy} r="88" fill="url(#void-core)" />

        {/* Stretched stars — lines from near-core outward */}
        {stars.map((s, i) => {
          const rad = (s.a * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * s.r;
          const y1 = cy + Math.sin(rad) * s.r;
          const x2 = cx + Math.cos(rad) * (s.r + s.len);
          const y2 = cy + Math.sin(rad) * (s.r + s.len);
          return (
            <line
              key={i}
              className="cta-void__star"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(20,20,20,0.45)"
              strokeWidth={i % 3 === 0 ? 1.2 : 0.7}
              strokeLinecap="round"
              style={{ animationDelay: `${(i % 7) * 0.35}s` }}
            />
          );
        })}

        {/* Thin rim */}
        <circle cx={cx} cy={cy} r="32" fill="url(#void-rim)" />
        <circle cx={cx} cy={cy} r="28" fill="#050505" />
      </svg>
    </div>
  );
}

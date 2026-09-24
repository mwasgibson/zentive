"use client";

/**
 * EHT-style void: black shadow + photon ring + warm accretion disk.
 * Matches how people recognise a real gravitational void (M87 / NASA).
 * Pure SVG — no canvas particles.
 */
export function CtaVoid() {
  return (
    <div className="cta-void" aria-hidden>
      <svg
        className="cta-void__svg"
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Accretion disk — orange/amber like EHT imagery */}
          <radialGradient id="void-disk" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0a0a" stopOpacity="1" />
            <stop offset="28%" stopColor="#0a0a0a" stopOpacity="1" />
            <stop offset="32%" stopColor="#c45f12" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#e2711d" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#8b4510" stopOpacity="0.25" />
            <stop offset="72%" stopColor="#141414" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#141414" stopOpacity="0" />
          </radialGradient>

          {/* Photon ring glow */}
          <radialGradient id="void-ring" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff5e6" stopOpacity="0" />
            <stop offset="30%" stopColor="#fff5e6" stopOpacity="0" />
            <stop offset="34%" stopColor="#ffe0b2" stopOpacity="0.85" />
            <stop offset="38%" stopColor="#e2711d" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#c45f12" stopOpacity="0" />
          </radialGradient>

          {/* Soft outer haze */}
          <radialGradient id="void-haze" cx="50%" cy="50%" r="50%">
            <stop offset="50%" stopColor="#141414" stopOpacity="0" />
            <stop offset="78%" stopColor="#141414" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#141414" stopOpacity="0" />
          </radialGradient>

          <filter id="void-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Haze */}
        <ellipse cx="160" cy="100" rx="150" ry="95" fill="url(#void-haze)" />

        {/* Disk (slightly elliptical — edge-on bias like NASA views) */}
        <ellipse
          className="cta-void__disk"
          cx="160"
          cy="100"
          rx="110"
          ry="72"
          fill="url(#void-disk)"
          filter="url(#void-blur)"
        />

        {/* Photon ring */}
        <ellipse
          className="cta-void__ring"
          cx="160"
          cy="100"
          rx="48"
          ry="48"
          fill="url(#void-ring)"
        />

        {/* Event-horizon shadow */}
        <circle cx="160" cy="100" r="36" fill="#050505" />

        {/* Thin bright ring edge */}
        <circle
          cx="160"
          cy="100"
          r="37.5"
          fill="none"
          stroke="rgba(255, 224, 178, 0.35)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

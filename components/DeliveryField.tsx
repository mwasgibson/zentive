/**
 * Ambient delivery-status labels in the hero.
 * Pure CSS cycle (no React state) so taps / re-renders never restart or
 * spawn labels. Words keep rotating: Queued → Sending → Sent → …
 */
const STATUSES = ["Queued", "Sending", "Sent", "Delivered", "Failed"] as const;

const STATUS_FIELDS = [
  { x: "6%", y: "18%", delay: 0, color: "wire" },
  { x: "88%", y: "12%", delay: 1.4, color: "signal-dark" },
  { x: "94%", y: "58%", delay: 2.8, color: "wire" },
  { x: "12%", y: "78%", delay: 0.7, color: "signal-dark" },
  { x: "72%", y: "84%", delay: 2.1, color: "wire" },
  { x: "38%", y: "8%", delay: 3.5, color: "signal-dark" },
  { x: "58%", y: "94%", delay: 0.3, color: "wire" },
  { x: "22%", y: "42%", delay: 2.5, color: "signal-dark" },
] as const;

const COLOR_CLASS = {
  wire: "text-wire",
  "signal-dark": "text-signal-dark",
} as const;

// Full cycle length in seconds (must match CSS)
const CYCLE = 10;
const SLOT = CYCLE / STATUSES.length; // 2s per status

export function DeliveryField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {STATUS_FIELDS.map((field) => (
        <span
          key={`${field.x}-${field.y}`}
          className="delivery-status-slot"
          style={{
            left: field.x,
            top: field.y,
          }}
        >
          {STATUSES.map((label, i) => (
            <span
              key={label}
              className={`delivery-status ${COLOR_CLASS[field.color]}`}
              style={
                {
                  // Stagger field start + which status is showing
                  animationDelay: `${field.delay + i * SLOT}s`,
                } as React.CSSProperties
              }
            >
              {label}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

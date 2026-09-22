"use client";

/**
 * Ambient delivery-status labels in the hero.
 * Each field keeps a fixed label so CSS fade cycles aren’t restarted by
 * React text updates (which also made words flash on re-render / tap).
 */
const STATUS_FIELDS = [
  { x: "6%", y: "18%", delay: 0, color: "wire", label: "Queued" },
  { x: "88%", y: "12%", delay: 1400, color: "signal-dark", label: "Delivered" },
  { x: "94%", y: "58%", delay: 2800, color: "wire", label: "Sending" },
  { x: "12%", y: "78%", delay: 700, color: "signal-dark", label: "Failed" },
  { x: "72%", y: "84%", delay: 2100, color: "wire", label: "Sent" },
  { x: "38%", y: "8%", delay: 3500, color: "signal-dark", label: "Queued" },
  { x: "58%", y: "94%", delay: 300, color: "wire", label: "Delivered" },
  { x: "22%", y: "42%", delay: 2500, color: "signal-dark", label: "Sending" },
] as const;

const COLOR_CLASS = {
  wire: "text-wire",
  "signal-dark": "text-signal-dark",
} as const;

export function DeliveryField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {STATUS_FIELDS.map((field) => (
        <span
          key={`${field.x}-${field.y}`}
          className={`delivery-status ${COLOR_CLASS[field.color]}`}
          style={
            {
              left: field.x,
              top: field.y,
              "--delivery-delay": `${field.delay}ms`,
            } as React.CSSProperties
          }
        >
          {field.label}
        </span>
      ))}
    </div>
  );
}

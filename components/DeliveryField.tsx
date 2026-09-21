"use client";

import { useEffect, useState } from "react";

const STATUSES = ["Queued", "Sending", "Sent", "Delivered", "Failed"] as const;

const STATUS_FIELDS = [
  { x: "6%", y: "18%", delay: 0, color: "wire", phase: 0 },
  { x: "88%", y: "12%", delay: 1400, color: "signal-dark", phase: 3 },
  { x: "94%", y: "58%", delay: 2800, color: "wire", phase: 1 },
  { x: "12%", y: "78%", delay: 700, color: "signal-dark", phase: 4 },
  { x: "72%", y: "84%", delay: 2100, color: "wire", phase: 2 },
  { x: "38%", y: "8%", delay: 3500, color: "signal-dark", phase: 0 },
  { x: "58%", y: "94%", delay: 300, color: "wire", phase: 3 },
  { x: "22%", y: "42%", delay: 2500, color: "signal-dark", phase: 1 },
] as const;

const COLOR_CLASS = {
  wire: "text-wire",
  "signal-dark": "text-signal-dark",
} as const;

export function DeliveryField() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % STATUSES.length);
    }, 2200); // slower cycle: ~2.2s per status

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
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
          {STATUSES[(statusIndex + field.phase) % STATUSES.length]}
        </span>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const STATUSES = ["Queued", "Sending", "Sent", "Delivered", "Failed"] as const;

const COLOR_CLASS = {
  wire: "text-wire",
  "signal-dark": "text-signal-dark",
} as const;

type Particle = {
  id: number;
  x: number;
  y: number;
  label: (typeof STATUSES)[number];
  color: keyof typeof COLOR_CLASS;
};

function randomParticle(id: number): Particle {
  return {
    id,
    // Keep off the very edges so labels aren’t clipped
    x: 4 + Math.random() * 90,
    y: 6 + Math.random() * 86,
    label: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    color: Math.random() > 0.5 ? "wire" : "signal-dark",
  };
}

/** Lifetime of one label — must match CSS animation duration */
const LIFE_MS = 4200;
/** How often a new label appears */
const SPAWN_MS = 850;

export function DeliveryField() {
  const [items, setItems] = useState<Particle[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const spawn = () => {
      const id = ++nextId.current;
      setItems((prev) => [...prev, randomParticle(id)].slice(-10));
      window.setTimeout(() => {
        setItems((prev) => prev.filter((p) => p.id !== id));
      }, LIFE_MS);
    };

    // A few on first paint so the field isn’t empty
    spawn();
    const t1 = window.setTimeout(spawn, 200);
    const t2 = window.setTimeout(spawn, 450);

    const interval = window.setInterval(spawn, SPAWN_MS);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {items.map((item) => (
        <span
          key={item.id}
          className={`delivery-status ${COLOR_CLASS[item.color]}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}

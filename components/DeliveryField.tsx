"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

function randomMeta(id: number, x: number, y: number): Particle {
  return {
    id,
    x,
    y,
    label: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    color: Math.random() > 0.5 ? "wire" : "signal-dark",
  };
}

function randomPosition(): { x: number; y: number } {
  return {
    x: 4 + Math.random() * 90,
    y: 6 + Math.random() * 86,
  };
}

/** Lifetime of one label — must match CSS animation duration */
const LIFE_MS = 4200;
/** How often a new label appears on its own */
const SPAWN_MS = 850;

/** Elements that should NOT trigger a spawn when tapped */
const INTERACTIVE =
  'a, button, input, textarea, select, summary, [role="button"], [data-no-spawn]';

export function DeliveryField() {
  const [items, setItems] = useState<Particle[]>([]);
  const nextId = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const spawnAt = useCallback((x: number, y: number) => {
    const id = ++nextId.current;
    // Clamp so labels stay inside the field
    const cx = Math.min(96, Math.max(2, x));
    const cy = Math.min(96, Math.max(2, y));
    setItems((prev) => [...prev, randomMeta(id, cx, cy)].slice(-14));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }, LIFE_MS);
  }, []);

  // Auto-spawn at random positions (never stops)
  useEffect(() => {
    const spawn = () => {
      const { x, y } = randomPosition();
      spawnAt(x, y);
    };

    spawn();
    const t1 = window.setTimeout(spawn, 200);
    const t2 = window.setTimeout(spawn, 450);
    const interval = window.setInterval(spawn, SPAWN_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [spawnAt]);

  // Tap / click empty space in the hero → spawn at that point
  useEffect(() => {
    const field = rootRef.current;
    const section = field?.parentElement;
    if (!section) return;

    const onPointerDown = (e: PointerEvent) => {
      // Ignore real UI controls
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(INTERACTIVE)) return;
      // Ignore the route diagram card
      if (target.closest(".card")) return;

      const rect = section.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spawnAt(x, y);
    };

    section.addEventListener("pointerdown", onPointerDown);
    return () => section.removeEventListener("pointerdown", onPointerDown);
  }, [spawnAt]);

  return (
    <div
      ref={rootRef}
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

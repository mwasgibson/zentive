"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STATUSES = ["Queued", "Sending", "Sent", "Delivered", "Failed"] as const;

/** Visual variants so bubbles don’t all look the same */
const BUBBLE_VARIANTS = [
  "bubble-a", // ink fill, paper text, tail bottom-left
  "bubble-b", // paper fill, border, tail bottom-right
  "bubble-c", // signal tint fill, tail bottom-left
  "bubble-d", // wire tint fill, tail bottom-right
  "bubble-e", // outline only, tail top-left
] as const;

type Particle = {
  id: number;
  x: number;
  y: number;
  label: (typeof STATUSES)[number];
  variant: (typeof BUBBLE_VARIANTS)[number];
};

function makeParticle(id: number, x: number, y: number): Particle {
  return {
    id,
    x,
    y,
    label: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    variant: BUBBLE_VARIANTS[Math.floor(Math.random() * BUBBLE_VARIANTS.length)],
  };
}

function randomPosition(): { x: number; y: number } {
  return {
    x: 4 + Math.random() * 88,
    y: 6 + Math.random() * 84,
  };
}

const LIFE_MS = 4200;
const SPAWN_MS = 850;

const INTERACTIVE =
  'a, button, input, textarea, select, summary, [role="button"], [data-no-spawn]';

export function DeliveryField() {
  const [items, setItems] = useState<Particle[]>([]);
  const nextId = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const spawnAt = useCallback((x: number, y: number) => {
    const id = ++nextId.current;
    const cx = Math.min(94, Math.max(2, x));
    const cy = Math.min(94, Math.max(2, y));
    setItems((prev) => [...prev, makeParticle(id, cx, cy)].slice(-14));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }, LIFE_MS);
  }, []);

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

  useEffect(() => {
    const field = rootRef.current;
    const section = field?.parentElement;
    if (!section) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(INTERACTIVE)) return;
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
          className={`delivery-bubble ${item.variant}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
        >
          <span className="delivery-bubble-text">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

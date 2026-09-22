"use client";

import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";

/**
 * Brightens / lifts opacity when the cursor is near. No borders, no lift.
 * For glossary cards and how-it-works steps.
 */
export function Proximity({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const onEnter = useCallback(() => setActive(true), []);
  const onLeave = useCallback(() => setActive(false), []);

  // Optional: stronger response when closer to center
  const onMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy));
    ref.current.style.setProperty("--prox", String(1 - dist * 0.35));
  }, []);

  return (
    <div
      ref={ref}
      className={`proximity ${active ? "is-near" : ""} ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      style={{ "--prox": active ? 1 : 0.72 } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

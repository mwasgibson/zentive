"use client";

import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
  type CSSProperties,
} from "react";

/**
 * Brightens when the cursor is near. No borders, no lift.
 */
export function Proximity({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const onEnter = useCallback(() => setActive(true), []);
  const onLeave = useCallback(() => setActive(false), []);

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
      style={
        {
          ...style,
          "--prox": active ? 1 : 0.72,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

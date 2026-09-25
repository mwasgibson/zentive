"use client";

import {
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent,
  type CSSProperties,
} from "react";

/**
 * Sets --spot-x / --spot-y on the section so CSS can render a soft radial
 * highlight that follows the cursor. Used on dark sections only.
 */
export function MouseSpotlight({
  children,
  className = "",
  id,
  as: Component = "section",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
  }, []);

  return (
    <Component
      ref={ref as React.RefObject<any>}
      id={id}
      className={`mouse-spotlight ${className}`}
      onMouseMove={onMove}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "40%",
        } as CSSProperties
      }
    >
      {children}
    </Component>
  );
}

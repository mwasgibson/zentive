"use client";

import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";

/**
 * Soft magnetic pull toward the cursor. Range is small so it feels alive
 * without fighting the user. Disabled under prefers-reduced-motion.
 */
export function Magnetic({
  children,
  className = "",
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (reduce || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setOffset({
        x: (e.clientX - cx) * strength,
        y: (e.clientY - cy) * strength,
      });
    },
    [reduce, strength],
  );

  const onLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 && offset.y === 0
          ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)"
          : "transform 90ms linear",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

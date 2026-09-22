"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react";

/**
 * Magnetic pull toward the cursor. Snaps back to origin on leave.
 */
export function Magnetic({
  children,
  className = "",
  strength = 0.55,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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

  const atRest = offset.x === 0 && offset.y === 0;

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: atRest
          ? "transform 500ms cubic-bezier(0.34, 1.4, 0.64, 1)"
          : "transform 70ms linear",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

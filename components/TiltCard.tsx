"use client";

import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";

/**
 * 3D tilt following the cursor. Snaps back on leave.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
  });
  const [active, setActive] = useState(false);

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * maxTilt * 2;
      const rotX = (0.5 - py) * maxTilt * 2;
      setActive(true);
      setStyle({
        transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`,
      });
    },
    [maxTilt],
  );

  const onLeave = useCallback(() => {
    setActive(false);
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        ...style,
        transition: active
          ? "transform 80ms linear"
          : "transform 480ms cubic-bezier(0.34, 1.3, 0.64, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

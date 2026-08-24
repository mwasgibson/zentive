"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "blur"
  | "stagger";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  duration = 700,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [once]);

  const hiddenTransforms: Record<RevealVariant, string> = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-10",
    right: "-translate-x-10",
    scale: "scale-[0.94]",
    blur: "translate-y-3 blur-sm",
    stagger: "translate-y-8",
  };

  const visibleTransform: Record<RevealVariant, string> = {
    up: "translate-y-0",
    down: "translate-y-0",
    left: "translate-x-0",
    right: "translate-x-0",
    scale: "scale-100",
    blur: "translate-y-0 blur-0",
    stagger: "translate-y-0",
  };

  return (
    <div
      ref={ref}
      className={[
        "will-change-transform",
        "transition-all",
        "ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible
          ? `${visibleTransform[variant]} opacity-100`
          : `${hiddenTransforms[variant]} opacity-0`,
        className,
      ].join(" ")}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

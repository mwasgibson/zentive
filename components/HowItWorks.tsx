"use client";

import { useEffect, useRef, useState } from "react";
import { Proximity } from "@/components/Proximity";

type Step = {
  n: string;
  title: string;
  body: string;
  badges?: string[];
};

const STEP_MS = 3200;

export function HowItWorks({
  heading,
  subhead,
  steps,
}: {
  heading: string;
  subhead: string;
  steps: Step[];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = inView && !paused && !reducedMotion && steps.length > 1;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      setActive((i) => (i + 1) % steps.length);
    }, STEP_MS);
    return () => window.clearTimeout(t);
  }, [active, running, steps.length]);

  return (
    <div ref={rootRef}>
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {heading}
      </h2>
      <p className="mt-4 max-w-2xl text-muted">{subhead}</p>

      <div
        className="how-flow relative mt-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const isActive = i === active;
            const hasNext = i < steps.length - 1;
            return (
              <Proximity
                key={step.n}
                className={[
                  "how-step relative",
                  isActive ? "is-active" : "",
                ].join(" ")}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span
                  className={[
                    "how-step-n font-mono text-sm text-signal-dark",
                    isActive ? "is-active" : "",
                  ].join(" ")}
                >
                  {step.n}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                {step.badges && step.badges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {step.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-wire/30 bg-wire-light px-2.5 py-0.5 font-mono text-[11px] text-wire"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
                {hasNext && (
                  <span
                    aria-hidden
                    className={[
                      "how-handoff absolute right-[-1.1rem] top-0.5 hidden lg:flex",
                      isActive ? "is-active" : "",
                    ].join(" ")}
                  >
                    {/* Packet hops toward the next step while this one is active */}
                    {isActive && !reducedMotion && (
                      <span key={active} className="how-packet" />
                    )}
                    <span
                      className={[
                        "how-arrow font-mono text-border",
                        isActive ? "is-active" : "",
                      ].join(" ")}
                    >
                      →
                    </span>
                  </span>
                )}
              </Proximity>
            );
          })}
        </div>
      </div>
    </div>
  );
}

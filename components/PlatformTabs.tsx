"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  MessageSquare,
  ShieldCheck,
  Wallet,
  BarChart3,
  Code2,
  RefreshCw,
  Check,
  type LucideIcon,
} from "lucide-react";

type FeatureGroup = {
  category: string;
  items: string[];
};

/**
 * Purely a display concern — the CMS schema for features.groups has no
 * icon field, so this maps by category label instead. Falls back to a
 * generic icon for any category name an editor renames or adds that
 * isn't in the map, same defensive pattern as SecurityIcon.
 */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "Core messaging": MessageSquare,
  "Compliance & trust": ShieldCheck,
  "Account & billing": Wallet,
  "Reporting & analytics": BarChart3,
  "Developer tools": Code2,
  Reliability: RefreshCw,
};

const AUTO_ADVANCE_MS = 5000;
// How long a manual click pauses auto-play before it picks back up.
// Longer than AUTO_ADVANCE_MS on purpose — a click should read as a
// real break, not just line up with the next scheduled tick.
const MANUAL_PAUSE_MS = 2000;

export function PlatformTabs({ groups }: { groups: FeatureGroup[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [manualPauseActive, setManualPauseActive] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const resumeTimerRef = useRef<number | null>(null);
  const baseId = useId();
  const active = groups[activeIndex];

  const autoAdvancing = !reducedMotion;
  const running =
    autoAdvancing && !interactionPaused && !tabHidden && !manualPauseActive;

  // Clear any pending resume timer on unmount so it doesn't fire against
  // an unmounted component.
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Respect the person's motion preference — if they've asked for less
  // motion, this never auto-plays at all rather than just playing quieter.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Don't burn a timer in a background tab nobody's looking at.
  useEffect(() => {
    function onVisibility() {
      setTabHidden(document.hidden);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % groups.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, running, groups.length]);

  function selectTab(index: number, focus = false) {
    // A deliberate click gets a longer, quiet window before auto-play
    // picks back up — long enough to read what they clicked for,
    // not a permanent handoff. Re-clicking resets the window rather
    // than stacking a second resume on top of the first.
    setActiveIndex(index);
    setManualPauseActive(true);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      setManualPauseActive(false);
    }, MANUAL_PAUSE_MS);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        selectTab((index + 1) % groups.length, true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        selectTab((index - 1 + groups.length) % groups.length, true);
        break;
      case "Home":
        e.preventDefault();
        selectTab(0, true);
        break;
      case "End":
        e.preventDefault();
        selectTab(groups.length - 1, true);
        break;
    }
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
      <div
        role="tablist"
        aria-label="Platform feature categories"
        className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
        onMouseEnter={() => setInteractionPaused(true)}
        onMouseLeave={() => setInteractionPaused(false)}
        onFocus={() => setInteractionPaused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setInteractionPaused(false);
          }
        }}
      >
        {groups.map((group, i) => {
          const Icon = CATEGORY_ICON_MAP[group.category] ?? MessageSquare;
          const isActive = i === activeIndex;
          return (
            <button
              key={group.category}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectTab(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={[
                "relative flex shrink-0 items-center gap-3 overflow-hidden whitespace-nowrap rounded-lg border px-4 py-3 text-left text-sm transition-colors lg:w-full",
                isActive
                  ? "border-signal-dark/30 bg-wire-light text-ink"
                  : "border-transparent text-muted hover:bg-surface hover:text-ink",
              ].join(" ")}
            >
              <Icon
                aria-hidden
                size={18}
                className={
                  isActive ? "shrink-0 text-signal-dark" : "shrink-0 text-muted"
                }
              />
              <span className="font-display font-semibold">
                {group.category}
              </span>
              <span
                className={[
                  "ml-auto shrink-0 font-mono text-[11px]",
                  isActive ? "text-signal-dark" : "text-muted/70",
                ].join(" ")}
              ></span>
              {isActive && autoAdvancing && (
                <span
                  key={activeIndex}
                  aria-hidden
                  className="tab-progress-bar"
                  style={{
                    animationDuration: `${AUTO_ADVANCE_MS}ms`,
                    animationPlayState: running ? "running" : "paused",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        key={activeIndex}
        id={`${baseId}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        tabIndex={0}
        className="card reveal-stagger is-visible"
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {active.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-muted">
              <Check
                aria-hidden
                size={16}
                className="mt-0.5 shrink-0 text-wire"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

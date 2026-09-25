"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  MessageSquare,
  ShieldCheck,
  Wallet,
  BarChart3,
  Code2,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { TiltCard } from "@/components/TiltCard";

type FeatureGroup = {
  category: string;
  items: string[];
};

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "Core messaging": MessageSquare,
  "Compliance & trust": ShieldCheck,
  "Account & billing": Wallet,
  "Reporting & analytics": BarChart3,
  "Developer tools": Code2,
  Reliability: RefreshCw,
};

const CATEGORY_ICON_ANIM: Record<string, string> = {
  "Core messaging": "icon-msg",
  "Compliance & trust": "icon-shield",
  "Account & billing": "icon-wallet",
  "Reporting & analytics": "icon-chart",
  "Developer tools": "icon-code",
  Reliability: "icon-refresh",
};

const AUTO_ADVANCE_MS = 5000;
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

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
    <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr] max-w-5xl">
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
          const iconAnim = CATEGORY_ICON_ANIM[group.category] ?? "icon-msg";
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
                "platform-tab relative flex shrink-0 items-center gap-3 overflow-hidden whitespace-nowrap rounded-lg border px-4 py-3 text-left text-sm transition-colors lg:w-full",
                isActive
                  ? "border-signal-dark/30 bg-wire-light text-ink"
                  : "border-transparent text-muted hover:bg-surface hover:text-ink",
              ].join(" ")}
            >
              <span
                className={[
                  "platform-tab-icon shrink-0",
                  iconAnim,
                  isActive ? "is-active text-signal-dark" : "text-muted",
                ].join(" ")}
              >
                <Icon aria-hidden size={18} />
              </span>
              <span className="font-display font-semibold">
                {group.category}
              </span>
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

      <TiltCard maxTilt={5} className="feature-panel-3d h-fit">
        <div
          key={activeIndex}
          id={`${baseId}-panel-${activeIndex}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeIndex}`}
          tabIndex={0}
          className="card feature-panel"
        >
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {active.items.map((item, i) => (
              <li
                key={item}
                className="feature-chip"
                style={{ animationDelay: `${60 + i * 55}ms` }}
              >
                <span className="feature-chip-dot" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </TiltCard>
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";

type MagneticCtx = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const MagneticContext = createContext<MagneticCtx | null>(null);

/** Only one Magnetic inside the group is active at a time. */
export function MagneticGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <MagneticContext.Provider value={{ activeId, setActiveId }}>
      <div className={`relative ${className}`}>{children}</div>
    </MagneticContext.Provider>
  );
}

/**
 * Layout slot stays put. The inner layer follows the cursor freely in X and Y
 * (can travel over the rest of the section). Springs home on leave.
 * Sibling buttons in a MagneticGroup do not steal the grab.
 */
export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const slotRef = useRef<HTMLDivElement>(null);
  const origin = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [reduce, setReduce] = useState(false);
  const group = useContext(MagneticContext);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const readOrigin = useCallback(() => {
    if (!slotRef.current) return;
    const rect = slotRef.current.getBoundingClientRect();
    origin.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  const onEnter = useCallback(
    (e: MouseEvent) => {
      if (reduce) return;
      if (group?.activeId && group.activeId !== id) return;

      group?.setActiveId(id);
      readOrigin();
      setActive(true);
      setOffset({
        x: e.clientX - origin.current.x,
        y: e.clientY - origin.current.y,
      });
    },
    [reduce, group, id, readOrigin],
  );

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (reduce || !active) return;
      if (group?.activeId && group.activeId !== id) return;

      setOffset({
        x: e.clientX - origin.current.x,
        y: e.clientY - origin.current.y,
      });
    },
    [reduce, active, group, id],
  );

  const onLeave = useCallback(() => {
    setActive(false);
    setOffset({ x: 0, y: 0 });
    if (group?.activeId === id) group.setActiveId(null);
  }, [group, id]);

  useEffect(() => {
    if (group && group.activeId !== id && active) {
      setActive(false);
      setOffset({ x: 0, y: 0 });
    }
  }, [group, id, active]);

  const blocked = Boolean(group?.activeId && group.activeId !== id);

  return (
    <div
      ref={slotRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        // Keep layout space even while the visible button floats away
        verticalAlign: "top",
      }}
    >
      <div
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: active
            ? "transform 30ms linear"
            : "transform 520ms cubic-bezier(0.34, 1.45, 0.64, 1)",
          willChange: "transform",
          zIndex: active ? 40 : blocked ? 1 : 10,
          pointerEvents: blocked ? "none" : "auto",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

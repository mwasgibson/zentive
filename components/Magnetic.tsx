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

/**
 * Wrap a section so only one Magnetic child is “grabbed” at a time.
 * Active button keeps the move; the other ignores hover until release.
 */
export function MagneticGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <MagneticContext.Provider value={{ activeId, setActiveId }}>
      <div className={`relative ${className}`}>{children}</div>
    </MagneticContext.Provider>
  );
}

/**
 * Button follows the cursor freely in X and Y while hovered / captured.
 * Snaps back to its original spot on leave. Does not steal from a sibling
 * that already has the cursor.
 */
export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const origin = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [reduce, setReduce] = useState(false);
  const group = useContext(MagneticContext);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const lockOrigin = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    origin.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  const onEnter = useCallback(
    (e: MouseEvent) => {
      if (reduce) return;
      // Another button in the group already owns the cursor
      if (group?.activeId && group.activeId !== id) return;

      group?.setActiveId(id);
      setActive(true);
      lockOrigin();
      // Jump immediately toward cursor so Y/X both respond
      const ox = origin.current.x;
      const oy = origin.current.y;
      setOffset({ x: e.clientX - ox, y: e.clientY - oy });
    },
    [reduce, group, id, lockOrigin],
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

  // If group clears us externally, snap home
  useEffect(() => {
    if (group && group.activeId !== id && active) {
      setActive(false);
      setOffset({ x: 0, y: 0 });
    }
  }, [group, id, active]);

  const blocked = Boolean(group?.activeId && group.activeId !== id);

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: active
          ? "transform 40ms linear"
          : "transform 520ms cubic-bezier(0.34, 1.45, 0.64, 1)",
        willChange: "transform",
        position: "relative",
        zIndex: active ? 30 : blocked ? 1 : 10,
        pointerEvents: blocked ? "none" : "auto",
      }}
    >
      {children}
    </div>
  );
}

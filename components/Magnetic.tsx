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
 * Fixed layout slot + free-follow inner layer.
 * - Instant tracking while active (no stagger)
 * - Document-level pointer tracking so the button stays under the cursor
 *   and remains clickable even far from its rest position
 * - Springs home when the pointer leaves the button
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
  const layerRef = useRef<HTMLDivElement>(null);
  const origin = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [reduce, setReduce] = useState(false);
  const group = useContext(MagneticContext);
  const activeRef = useRef(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const release = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    setOffset({ x: 0, y: 0 });
    if (group?.activeId === id) group.setActiveId(null);
  }, [group, id]);

  const follow = useCallback((clientX: number, clientY: number) => {
    setOffset({
      x: clientX - origin.current.x,
      y: clientY - origin.current.y,
    });
  }, []);

  const activate = useCallback(
    (clientX: number, clientY: number) => {
      if (reduce) return;
      if (group?.activeId && group.activeId !== id) return;
      if (!slotRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      origin.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      group?.setActiveId(id);
      activeRef.current = true;
      setActive(true);
      follow(clientX, clientY);
    },
    [reduce, group, id, follow],
  );

  // Document-level tracking while active — keeps button under cursor + clickable
  useEffect(() => {
    if (!active) return;

    const onMove = (e: PointerEvent) => {
      if (!activeRef.current) return;
      follow(e.clientX, e.clientY);

      // Still over this button (or its children)?
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const layer = layerRef.current;
      if (!layer || !el || !layer.contains(el)) {
        release();
      }
    };

    const onUp = () => {
      // keep active until pointer leaves; clicks still work on the <a>
    };

    const onCancel = () => release();

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointercancel", onCancel, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onCancel);
    };
  }, [active, follow, release]);

  useEffect(() => {
    if (group && group.activeId !== id && active) {
      release();
    }
  }, [group, id, active, release]);

  const blocked = Boolean(group?.activeId && group.activeId !== id);

  return (
    <div
      ref={slotRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        verticalAlign: "top",
      }}
    >
      <div
        ref={layerRef}
        onPointerEnter={(e) => {
          if (e.pointerType === "touch") return;
          activate(e.clientX, e.clientY);
        }}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          // Instant while dragging — no stagger; spring only on release
          transition: active
            ? "none"
            : "transform 480ms cubic-bezier(0.34, 1.4, 0.64, 1)",
          willChange: active ? "transform" : undefined,
          zIndex: active ? 50 : blocked ? 1 : 10,
          pointerEvents: blocked ? "none" : "auto",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

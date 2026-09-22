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
 * Layout slot stays fixed. Visible layer follows the pointer with a direct
 * DOM transform (no React lag). Stays clickable anywhere it floats.
 * Springs home when the pointer leaves the layer.
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
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);
  const [reduce, setReduce] = useState(false);
  const group = useContext(MagneticContext);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const applyTransform = useCallback((x: number, y: number, animate: boolean) => {
    const el = layerRef.current;
    if (!el) return;
    el.style.transition = animate
      ? "transform 480ms cubic-bezier(0.34, 1.4, 0.64, 1)"
      : "none";
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  const release = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    setActive(false);
    applyTransform(0, 0, true);
    if (group?.activeId === id) group.setActiveId(null);
  }, [group, id, applyTransform]);

  const activate = useCallback(
    (clientX: number, clientY: number) => {
      if (reduce) return;
      if (group?.activeId && group.activeId !== id) return;
      if (!slotRef.current || !layerRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      origin.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      group?.setActiveId(id);
      activeRef.current = true;
      setActive(true);

      const x = clientX - origin.current.x;
      const y = clientY - origin.current.y;
      applyTransform(x, y, false);
    },
    [reduce, group, id, applyTransform],
  );

  useEffect(() => {
    if (!active) return;

    const onMove = (e: PointerEvent) => {
      if (!activeRef.current) return;

      const x = e.clientX - origin.current.x;
      const y = e.clientY - origin.current.y;
      applyTransform(x, y, false);

      // After transform is applied synchronously, check hit target
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const layer = layerRef.current;
      if (!layer || !hit || !layer.contains(hit)) {
        release();
      }
    };

    const onCancel = () => release();

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointercancel", onCancel, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointercancel", onCancel);
    };
  }, [active, applyTransform, release]);

  useEffect(() => {
    if (group && group.activeId !== id && activeRef.current) {
      release();
    }
  }, [group, id, release]);

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
          zIndex: active ? 50 : blocked ? 1 : 10,
          pointerEvents: blocked ? "none" : "auto",
          position: "relative",
          willChange: active ? "transform" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

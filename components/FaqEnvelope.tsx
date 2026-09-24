"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Phase = "letter" | "fold" | "envelope" | "plane" | "fly" | "gone";

/**
 * Letter (name, email, question) → fold → envelope → plane → fly.
 * Mailto fires immediately on submit so the mail client always opens.
 */
export function FaqEnvelope({ contactEmail }: { contactEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("letter");
  const rootRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const busyRef = useRef(false);

  function clearTimers() {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }

  function runVisualSequence() {
    if (busyRef.current) return;
    busyRef.current = true;
    clearTimers();

    setPhase("fold");
    timersRef.current.push(window.setTimeout(() => setPhase("envelope"), 450));
    timersRef.current.push(window.setTimeout(() => setPhase("plane"), 950));
    timersRef.current.push(window.setTimeout(() => setPhase("fly"), 1350));
    timersRef.current.push(window.setTimeout(() => setPhase("gone"), 2300));
    timersRef.current.push(
      window.setTimeout(() => {
        setName("");
        setEmail("");
        setQuestion("");
        setPhase("letter");
        busyRef.current = false;
      }, 3600),
    );
  }

  // Scroll-away visual only — timers must NOT clear when phase changes
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting &&
          entry.boundingClientRect.top < 0 &&
          !busyRef.current
        ) {
          runVisualSequence();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      // only clear on unmount
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    const q = question.trim();
    if (!n || !em || !q || busyRef.current) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return;

    // Open mail client NOW (user gesture) — delayed location.href often gets blocked
    const subject = encodeURIComponent(`Question from ${n}`);
    const body = encodeURIComponent(`Name: ${n}\nEmail: ${em}\n\n${q}`);
    const href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    const a = document.createElement("a");
    a.href = href;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    runVisualSequence();
  }

  const canSend =
    phase === "letter" &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    question.trim().length > 0;

  return (
    <div ref={rootRef} className="faq-letter-slot">
      <div className={`faq-mail faq-mail--${phase}`}>
        {/* Keep layers mounted so CSS animations can run */}
        <div
          className="faq-letter"
          style={{
            visibility:
              phase === "letter" || phase === "fold" ? "visible" : "hidden",
            pointerEvents: phase === "letter" ? "auto" : "none",
          }}
        >
          <div className="faq-letter__crease" aria-hidden />
          <p className="faq-letter__label">Write to us</p>
          <form className="faq-letter__form" onSubmit={onSubmit}>
            <input
              className="faq-letter__field"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={phase !== "letter"}
              required
            />
            <input
              className="faq-letter__field"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={phase !== "letter"}
              required
            />
            <textarea
              className="faq-letter__input"
              name="question"
              rows={3}
              placeholder="Your question…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={phase !== "letter"}
              required
            />
            <button type="submit" className="faq-letter__send" disabled={!canSend}>
              Send
            </button>
          </form>
        </div>

        <div
          className="faq-mail-envelope"
          aria-hidden
          style={{
            visibility:
              phase === "envelope" || phase === "plane" ? "visible" : "hidden",
          }}
        >
          <div className="faq-mail-envelope__flap" />
          <div className="faq-mail-envelope__body" />
        </div>

        <div
          className="faq-plane"
          aria-hidden
          style={{
            visibility:
              phase === "plane" || phase === "fly" ? "visible" : "hidden",
          }}
        >
          <svg viewBox="0 0 64 64" className="faq-plane__svg">
            <path
              d="M4 30 L60 8 L28 34 L24 52 L20 34 Z"
              fill="#f3f0ea"
              stroke="#141414"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M28 34 L60 8 L36 36 Z"
              fill="#e4e0d8"
              stroke="#141414"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

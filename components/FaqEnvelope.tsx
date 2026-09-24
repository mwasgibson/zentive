"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Phase = "letter" | "fold" | "envelope" | "plane" | "fly" | "gone";

/**
 * Letter form (name, email, question) → folds → envelope → plane → flies.
 * Fly-off opens mailto with the filled fields so the message can actually be sent.
 */
export function FaqEnvelope({ contactEmail }: { contactEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("letter");
  const rootRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const busyRef = useRef(false);
  const pendingMailRef = useRef<{ name: string; email: string; question: string } | null>(null);

  function clearTimers() {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }

  function runSequence(thenMail: boolean) {
    if (busyRef.current) return;
    busyRef.current = true;
    clearTimers();

    setPhase("fold");
    timersRef.current.push(window.setTimeout(() => setPhase("envelope"), 420));
    timersRef.current.push(window.setTimeout(() => setPhase("plane"), 900));
    timersRef.current.push(window.setTimeout(() => setPhase("fly"), 1280));
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase("gone");
        if (thenMail && pendingMailRef.current) {
          const { name: n, email: e, question: q } = pendingMailRef.current;
          const subject = encodeURIComponent(`Question from ${n}`);
          const body = encodeURIComponent(
            `Name: ${n}\nEmail: ${e}\n\n${q}`,
          );
          window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
          pendingMailRef.current = null;
        }
      }, 2100),
    );
    timersRef.current.push(
      window.setTimeout(() => {
        setName("");
        setEmail("");
        setQuestion("");
        setPhase("letter");
        busyRef.current = false;
      }, 3400),
    );
  }

  // Scroll-away: visual sequence only (no mail — no form data)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting &&
          entry.boundingClientRect.top < 0 &&
          !busyRef.current &&
          phase === "letter"
        ) {
          runSequence(false);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    const q = question.trim();
    if (!n || !em || !q || busyRef.current) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return;

    pendingMailRef.current = { name: n, email: em, question: q };
    runSequence(true);
  }

  const canSend =
    phase === "letter" &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    question.trim().length > 0;

  if (phase === "gone") {
    return <div ref={rootRef} className="faq-letter-slot" aria-hidden />;
  }

  return (
    <div ref={rootRef} className="faq-letter-slot">
      <div className={`faq-mail faq-mail--${phase}`}>
        {(phase === "letter" || phase === "fold") && (
          <div className="faq-letter">
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
              <button
                type="submit"
                className="faq-letter__send"
                disabled={!canSend}
              >
                Send
              </button>
            </form>
          </div>
        )}

        {(phase === "envelope" || phase === "plane") && (
          <div className="faq-mail-envelope" aria-hidden>
            <div className="faq-mail-envelope__flap" />
            <div className="faq-mail-envelope__body" />
          </div>
        )}

        {(phase === "plane" || phase === "fly") && (
          <div className="faq-plane" aria-hidden>
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
        )}
      </div>
    </div>
  );
}

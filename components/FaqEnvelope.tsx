"use client";

import { FormEvent, useRef, useState } from "react";
import { TiltCard } from "@/components/TiltCard";

type Phase = "letter" | "fold" | "envelope" | "plane" | "fly" | "gone";

/**
 * Letter → fold → envelope → plane → fly.
 * Animation runs only on Send. Mailto opens on submit.
 * Idle letter has 3D tilt + raised-sheet depth.
 */
export function FaqEnvelope({ contactEmail }: { contactEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("letter");
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
    timersRef.current.push(window.setTimeout(() => setPhase("envelope"), 720));
    timersRef.current.push(window.setTimeout(() => setPhase("plane"), 1450));
    timersRef.current.push(window.setTimeout(() => setPhase("fly"), 2000));
    timersRef.current.push(window.setTimeout(() => setPhase("gone"), 3200));
    timersRef.current.push(
      window.setTimeout(() => {
        setName("");
        setEmail("");
        setQuestion("");
        setPhase("letter");
        busyRef.current = false;
      }, 4500),
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    const q = question.trim();
    if (!n || !em || !q || busyRef.current) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return;

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

  const letterVisible = phase === "letter" || phase === "fold";
  const tiltActive = phase === "letter";

  return (
    <div className="faq-letter-slot">
      <div className={`faq-mail faq-mail--${phase}`}>
        <TiltCard
          maxTilt={tiltActive ? 10 : 0}
          className="faq-letter-tilt"
        >
          <div
            className="faq-letter"
            style={{
              visibility: letterVisible ? "visible" : "hidden",
              pointerEvents: phase === "letter" ? "auto" : "none",
            }}
          >
            <div className="faq-letter__edge" aria-hidden />
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
                rows={4}
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
        </TiltCard>

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
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M28 34 L60 8 L36 36 Z"
              fill="#e4e0d8"
              stroke="#141414"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

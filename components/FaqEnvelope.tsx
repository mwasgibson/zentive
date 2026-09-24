"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export function FaqEnvelope({
  contactEmail,
}: {
  contactEmail: string;
}) {
  const [question, setQuestion] = useState("");
  const [flying, setFlying] = useState(false);
  const [sent, setSent] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const flewOnScrollRef = useRef(false);

  // Fly off once when the section is scrolled past (leaving upward)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting &&
          entry.boundingClientRect.top < 0 &&
          !flewOnScrollRef.current &&
          !sent
        ) {
          flewOnScrollRef.current = true;
          setFlying(true);
        }
        // Return when section comes back into view from above
        if (entry.isIntersecting && flewOnScrollRef.current && !sent) {
          flewOnScrollRef.current = false;
          setFlying(false);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sent]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || flying) return;

    setFlying(true);
    setSent(true);

    // After the fly animation, open mailto with the question
    window.setTimeout(() => {
      const subject = encodeURIComponent("Question from the site");
      const body = encodeURIComponent(q);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    }, 650);

    // Reset envelope after a beat so the space isn't permanently empty
    window.setTimeout(() => {
      setQuestion("");
      setFlying(false);
      setSent(false);
      flewOnScrollRef.current = false;
    }, 2200);
  }

  return (
    <div ref={rootRef} className="faq-envelope-slot">
      <div
        className={["faq-envelope", flying ? "is-flying" : ""].join(" ")}
        aria-hidden={flying}
      >
        <div className="faq-envelope__flap" aria-hidden />
        <div className="faq-envelope__body">
          <p className="faq-envelope__label">Your question</p>
          <form className="faq-envelope__form" onSubmit={onSubmit}>
            <textarea
              className="faq-envelope__input"
              name="question"
              rows={3}
              placeholder="Type what you still need answered…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={flying}
            />
            <button
              type="submit"
              className="faq-envelope__send"
              disabled={flying || !question.trim()}
            >
              Send
              <span aria-hidden>↗</span>
            </button>
          </form>
          <p className="faq-envelope__hint">Opens your mail app — we read every one.</p>
        </div>
      </div>
    </div>
  );
}

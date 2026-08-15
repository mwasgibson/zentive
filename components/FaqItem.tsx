export function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-border py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-ink">
        {question}
        <span
          aria-hidden
          className="shrink-0 font-mono text-xl text-muted transition group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{answer}</p>
    </details>
  );
}
/**
 * A cluster of queued messages periodically releasing outward, then
 * re-forming — a literal illustration of "queue-based architecture absorbs
 * traffic bursts," one of the four stats in this section, rather than a
 * decorative flourish unconnected to the content it sits next to.
 */
export function QueueBurst() {
  const dots = [0, 1, 2, 3, 4];

  return (
    <svg
      viewBox="0 0 160 48"
      className="h-10 w-auto shrink-0"
      role="img"
      aria-label="Queued messages releasing in a burst"
    >
      {/* Queue: stacked dots on the left */}
      {dots.map((i) => (
        <circle
          key={`queue-${i}`}
          cx="14"
          cy={10 + i * 7}
          r="3"
          className="fill-border"
        />
      ))}

      {/* Burst: dots traveling outward on a staggered loop */}
      {dots.map((i) => (
        <circle
          key={`burst-${i}`}
          cx="14"
          cy={10 + i * 7}
          r="3"
          className="fill-signal-dark"
          style={{
            animation: "queue-burst 3.2s ease-out infinite",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </svg>
  );
}

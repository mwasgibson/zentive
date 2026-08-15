export function RouteDiagram() {
  return (
    <svg
      viewBox="0 0 720 260"
      role="img"
      aria-labelledby="route-diagram-title"
      className="w-full"
    >
      <title id="route-diagram-title">
        Comparison: a direct SMPP connection versus routing through aggregator hops
      </title>

      {/* Row 1: the old way */}
      <text x="0" y="24" className="fill-muted font-mono text-[11px] uppercase tracking-[0.14em]">
        Aggregator / CPaaS route
      </text>
      <g className="stroke-border" strokeWidth="2">
        <line x1="0" y1="56" x2="90" y2="56" strokeDasharray="4 4" />
        <line x1="118" y1="56" x2="230" y2="56" strokeDasharray="4 4" />
        <line x1="258" y1="56" x2="370" y2="56" strokeDasharray="4 4" />
        <line x1="398" y1="56" x2="500" y2="56" strokeDasharray="4 4" />
      </g>
      <Node x={0} y={56} label="You" />
      <Node x={104} y={56} label="Aggregator" sub="+ margin" muted />
      <Node x={244} y={56} label="Upstream" sub="reseller" muted />
      <Node x={384} y={56} label="SMSC" sub="Safaricom" muted />
      <Node x={500} y={56} label="Handset" />

      {/* Row 2: the direct way */}
      <text x="0" y="150" className="fill-wire font-mono text-[11px] uppercase tracking-[0.14em]">
        Direct SMPP route (this platform)
      </text>
      <g className="stroke-wire" strokeWidth="2.5">
        <line x1="0" y1="182" x2="230" y2="182" />
        <line x1="258" y1="182" x2="480" y2="182" />
      </g>
      <Node x={0} y={182} label="You" accent />
      <Node x={244} y={182} label="SMSC" sub="Safaricom" accent />
      <Node x={480} y={182} label="Handset" accent />

      <text x="0" y="238" className="fill-muted font-body text-[13px]">
        One persistent SMPP bind. No resale hop, no resale margin, one place to debug a delivery
        failure.
      </text>
    </svg>
  );
}

function Node({
  x,
  y,
  label,
  sub,
  muted,
  accent,
}: {
  x: number;
  y: number;
  label: string;
  sub?: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        cx="10"
        cy="0"
        r="10"
        className={accent ? "fill-wire" : muted ? "fill-border" : "fill-ink"}
      />
      <rect x="22" y="-8" width="40" height="16" fill="white"></rect>
      <text x="26" y="4" className="fill-ink font-mono text-[12px]">
        {label}
      </text>
      {sub && (
        <text x="26" y="18" className="fill-muted font-mono text-[10px]">
          {sub}
        </text>
      )}
    </g>
  );
}
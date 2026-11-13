"use client";

import { SEVERITY_META, type Severity, type Signal, type SignalPoint } from "./data";

export function SeverityPill({ severity }: { severity: Severity }) {
  const m = SEVERITY_META[severity];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: m.bg, color: m.fg }}>
      <span className="size-1.5 rounded-full" style={{ background: m.fg }} />
      {m.label}
    </span>
  );
}

export function ChangeBadge({ value, positiveIsGood = true, className = "" }: { value: number; positiveIsGood?: boolean; className?: string }) {
  const good = (value >= 0) === positiveIsGood;
  const text = Math.abs(value) === 100 ? "Paused" : `${value > 0 ? "+" : "\u2212"}${Math.abs(value).toFixed(1)}%`;
  return (
    <span className={`font-medium tabular-nums ${good ? "text-[#067647]" : "text-[#b42318]"} ${className}`}>{text}</span>
  );
}

/** Whether a rise in this metric is good news for the customer. */
export function risingIsGood(signal: Signal) {
  return !/cost|cpsv|cplv|cpiv|cpv/i.test(signal.metric);
}

/** Sparkline with the expected band, so "is this unusual?" is visible at a glance. */
export function Sparkline({ points, severity, width = 88, height = 32 }: { points: SignalPoint[]; severity: Severity; width?: number; height?: number }) {
  const all = points.flatMap((p) => [p.value, p.low, p.high]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const pad = 3;
  const x = (i: number) => pad + (i * (width - pad * 2)) / (points.length - 1);
  const y = (v: number) => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
  const band =
    points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.high).toFixed(1)}`).join(" ") +
    " " +
    points.slice().reverse().map((p, j) => `L${x(points.length - 1 - j).toFixed(1)},${y(p.low).toFixed(1)}`).join(" ") +
    " Z";
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  const color = SEVERITY_META[severity].fg;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="shrink-0">
      <path d={band} fill="#eef0f6" />
      <path d={line} pathLength={1} fill="none" stroke="#9aa1b4" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" className="animate-[sparkDraw_0.9s_cubic-bezier(0.22,1,0.36,1)_both]" />
      <path d={`M${x(points.length - 2)},${y(points[points.length - 2].value)} L${x(points.length - 1)},${y(last.value)}`} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx={x(points.length - 1)} cy={y(last.value)} r={2.75} fill={color} className="origin-center animate-[sparkDot_0.4s_0.7s_ease-out_both] [transform-box:fill-box]" />
    </svg>
  );
}

export function CampaignChip({ signal }: { signal: Signal }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-[#555]">
      <span className="flex size-4 shrink-0 items-center justify-center rounded text-[6px] font-bold text-white" style={{ background: signal.logoColor }}>
        {signal.campaignLogo}
      </span>
      <span className="truncate">{signal.campaignName}</span>
    </span>
  );
}

/** The change as a % where that fits, otherwise the signal's own short badge ("#2 → #1", "5 days left"). */
export function SignalBadge({ signal, className = "" }: { signal: Signal; className?: string }) {
  if (signal.badge) {
    const color = signal.severity === "critical" ? "text-[#b42318]" : signal.severity === "positive" ? "text-[#067647]" : "text-[#175cd3]";
    return <span className={`whitespace-nowrap font-medium tabular-nums ${color} ${className}`}>{signal.badge}</span>;
  }
  return <ChangeBadge value={signal.change} positiveIsGood={risingIsGood(signal)} className={className} />;
}

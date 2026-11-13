"use client";

// In-flight trend view: how each core metric moved across the flight, and which partners or DMAs moved it.
// Answers the client question "Where did my lift go?".

import { useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const THIS = "#212be9";
const FOCUS = "#d9730d";

const WEEKS = ["Feb 9", "Feb 16", "Feb 23", "Mar 2", "Mar 9", "Mar 16", "Mar 23", "Mar 30", "Apr 6", "Apr 13", "Apr 20", "Apr 27", "May 4"];
const WEEKS_IN = 8;

type MetricKey = "lift" | "conv" | "cpiv" | "cpv" | "impr";
const METRICS: { key: MetricKey; label: string; risingIsGood: boolean; fmt: (v: number) => string }[] = [
  { key: "lift", label: "Lift", risingIsGood: true, fmt: (v) => `${v.toFixed(2)}%` },
  { key: "conv", label: "Conv. rate", risingIsGood: true, fmt: (v) => `${v.toFixed(2)}%` },
  { key: "cpiv", label: "CPIV", risingIsGood: false, fmt: (v) => `$${v.toFixed(2)}` },
  { key: "cpv", label: "CPV", risingIsGood: false, fmt: (v) => `$${v.toFixed(2)}` },
  { key: "impr", label: "Impressions", risingIsGood: true, fmt: (v) => `${v.toFixed(1)}M` },
];

const CAMPAIGN: Record<MetricKey, number[]> = {
  lift: [3.92, 4.08, 4.36, 4.61, 4.48, 4.02, 3.74, 3.58],
  conv: [2.81, 2.86, 2.9, 2.95, 2.97, 2.96, 2.94, 2.94],
  cpiv: [18.6, 18.2, 18.5, 18.3, 18.4, 19.3, 20.2, 21.14],
  cpv: [0.95, 0.94, 0.93, 0.92, 0.91, 0.92, 0.92, 0.92],
  impr: [11.8, 12.1, 12.4, 12.6, 12.7, 12.9, 11.6, 12.3],
};

/** Per-item level and late-flight drift; the drift starts after the week of Mar 2. */
type Item = { name: string; level: number; drift: number; share: number };
const BREAKDOWNS: Record<"Partners" | "DMAs", Item[]> = {
  Partners: [
    { name: "Snap", level: 1.08, drift: -0.36, share: 0.24 },
    { name: "iHeartRadio", level: 0.98, drift: -0.27, share: 0.16 },
    { name: "Pandora", level: 1.02, drift: 0.2, share: 0.14 },
    { name: "AdTheorent", level: 1.24, drift: 0.02, share: 0.18 },
    { name: "Yelp", level: 1.14, drift: 0.06, share: 0.12 },
    { name: "Epsilon", level: 0.9, drift: -0.08, share: 0.16 },
  ],
  DMAs: [
    { name: "Atlanta", level: 1.05, drift: 0.28, share: 0.12 },
    { name: "New York", level: 0.62, drift: -0.22, share: 0.26 },
    { name: "Dallas", level: 1.12, drift: 0.1, share: 0.14 },
    { name: "Chicago", level: 0.94, drift: -0.14, share: 0.18 },
    { name: "Los Angeles", level: 0.88, drift: -0.04, share: 0.3 },
  ],
};

const EVENTS = [
  { week: "Mar 2", text: "Snap and iHeartRadio frequency passes 4 per user" },
  { week: "Mar 23", text: "Lunch-daypart creative launches in Atlanta" },
  { week: "Mar 30", text: "Snap paused in the New York DMA, Mar 26–29" },
];

function itemSeries(metric: MetricKey, it: Item) {
  const m = METRICS.find((x) => x.key === metric)!;
  // Cost metrics move opposite to lift; conversion rate moves a little; impressions scale by share.
  const sign = m.risingIsGood ? 1 : -1;
  const strength = metric === "lift" ? 1 : metric === "cpiv" ? 0.9 : metric === "conv" ? 0.25 : metric === "cpv" ? 0.3 : 0.4;
  return CAMPAIGN[metric].map((v, i) => {
    const late = i >= 4 ? (i - 3) / 4 : 0;
    const base = metric === "impr" ? v * it.share : metric === "lift" || metric === "conv" ? v * it.level : v / it.level;
    return +(base * (1 + sign * it.drift * strength * late)).toFixed(metric === "impr" ? 2 : 2);
  });
}

const pctChange = (a: number, b: number) => ((b - a) / a) * 100;

export function TrendView() {
  const [metric, setMetric] = useState<MetricKey>("lift");
  const [by, setBy] = useState<"Partners" | "DMAs">("Partners");
  const [focus, setFocus] = useState<string | null>(null);
  const [asTable, setAsTable] = useState(false);
  const m = METRICS.find((x) => x.key === metric)!;
  const series = CAMPAIGN[metric];

  const items = useMemo(
    () =>
      BREAKDOWNS[by]
        .map((it) => {
          const s = itemSeries(metric, it);
          const peak = 3; // week of Mar 2, the campaign's high point for lift
          return { ...it, s, change: pctChange(s[peak], s[s.length - 1]) };
        })
        .sort((a, b) => (m.risingIsGood ? a.change - b.change : b.change - a.change)),
    [metric, by, m.risingIsGood],
  );
  const focused = items.find((i) => i.name === focus) ?? null;

  const bestIdx = series.reduce((bi, v, i) => ((m.risingIsGood ? v > series[bi] : v < series[bi]) ? i : bi), 0);
  const last = series[series.length - 1];
  const sinceBest = pctChange(series[bestIdx], last);
  const worse = m.risingIsGood ? sinceBest < -1 : sinceBest > 1;
  const laggards = items.slice(0, 2).map((i) => i.name);
  const leaders = items.slice(-1).map((i) => i.name);

  const data = WEEKS.map((w, i) => ({ week: w, campaign: i < WEEKS_IN ? series[i] : null, focus: focused && i < WEEKS_IN ? focused.s[i] : null }));

  return (
    <div className="px-8 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#171417]">In-flight trends</h2>
          <p className="mt-1 text-sm text-[#555]">How your metrics moved across the flight. Week 8 of 13.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented options={METRICS.map((x) => x.label)} value={m.label} onChange={(l) => { setMetric(METRICS.find((x) => x.label === l)!.key); }} />
          <Segmented options={["Partners", "DMAs"]} value={by} onChange={(v) => { setBy(v as "Partners" | "DMAs"); setFocus(null); }} />
        </div>
      </div>

      {/* The answer, in one sentence */}
      <p className="mt-5 max-w-[760px] text-[15px] leading-6 text-[#171417]">
        {worse ? (
          <>
            {m.label} {m.risingIsGood ? "peaked" : "was lowest"} at <b>{m.fmt(series[bestIdx])}</b> the week of {WEEKS[bestIdx]} and is now <b>{m.fmt(last)}</b> ({sinceBest > 0 ? "+" : "−"}{Math.abs(sinceBest).toFixed(0)}%).{" "}
            Most of the change came from <b>{laggards.join(" and ")}</b>, while {leaders[0]} improved.
          </>
        ) : (
          <>
            {m.label} is at <b>{m.fmt(last)}</b>, {m.risingIsGood ? "its" : "near its"} best level of the flight so far. <b>{leaders[0]}</b> moved it most; {laggards[0]} is the one to watch.
          </>
        )}
      </p>

      <div className="mt-5 rounded-xl border border-border p-4">
        <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#555]">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: THIS }} />Campaign</span>
          {focused && <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: FOCUS }} />{focused.name}</span>}
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-[#f4f4f6]" />Rest of flight</span>
          <button onClick={() => setAsTable(!asTable)} className="ml-auto font-medium text-[#212be9] hover:underline">{asTable ? "View as chart" : "View as table"}</button>
        </div>
        {asTable ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead><tr className="text-left text-xs text-muted-foreground"><th className="py-1.5 pr-4 font-medium">Week of</th><th className="py-1.5 pr-4 font-medium">Campaign</th>{focused && <th className="py-1.5 font-medium">{focused.name}</th>}</tr></thead>
              <tbody>{series.map((v, i) => <tr key={i} className="border-t border-border"><td className="py-1.5 pr-4 text-[#555]">{WEEKS[i]}</td><td className="py-1.5 pr-4 text-[#171417]">{m.fmt(v)}</td>{focused && <td className="py-1.5 text-[#171417]">{m.fmt(focused.s[i])}</td>}</tr>)}</tbody>
            </table>
          </div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 18, right: 28, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="#eef0f4" />
                <ReferenceArea x1={WEEKS[WEEKS_IN]} x2={WEEKS[WEEKS.length - 1]} fill="#f4f4f6" fillOpacity={1} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#777" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} interval={0} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11, fill: "#777" }} tickLine={false} axisLine={false} width={52} tickFormatter={(v) => m.fmt(v)} />
                {metric === "lift" || metric === "cpiv" || metric === "impr"
                  ? EVENTS.map((e, i) => <ReferenceLine key={e.week} x={e.week} stroke="#c9ccd6" strokeDasharray="3 3" label={{ value: String(i + 1), position: "top", fontSize: 11, fill: "#555" }} />)
                  : null}
                <Tooltip content={<TrendTooltip fmt={m.fmt} focusName={focused?.name} />} cursor={{ stroke: "#c9ccd6" }} />
                <Line dataKey="campaign" stroke={THIS} strokeWidth={2} dot={{ r: 3, fill: THIS, strokeWidth: 0 }} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} connectNulls={false} isAnimationActive />
                {focused && <Line dataKey="focus" stroke={FOCUS} strokeWidth={2} dot={{ r: 3, fill: FOCUS, strokeWidth: 0 }} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} isAnimationActive />}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
        {(metric === "lift" || metric === "cpiv" || metric === "impr") && (
          <ol className="mt-3 grid gap-1 border-t border-border pt-3 text-xs text-[#555] sm:grid-cols-3">
            {EVENTS.map((e, i) => (
              <li key={e.week} className="flex gap-2"><span className="flex size-4 shrink-0 items-center justify-center rounded border border-[#c9ccd6] text-[10px] text-[#555]">{i + 1}</span><span><span className="font-medium text-[#171417]">{e.week}</span> · {e.text}</span></li>
            ))}
          </ol>
        )}
      </div>

      {/* Where it moved */}
      <div className="mt-6 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-[#171417]">Where {m.label.toLowerCase()} moved, by {by === "Partners" ? "partner" : "DMA"}</h3>
        <span className="text-xs text-muted-foreground">Change since the week of Mar 2 · select one to compare</span>
      </div>
      <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {items.map((it) => {
          const good = m.risingIsGood ? it.change >= 0 : it.change <= 0;
          const on = focus === it.name;
          return (
            <button
              key={it.name}
              onClick={() => setFocus(on ? null : it.name)}
              aria-pressed={on}
              className={`btn-press rounded-lg border p-3 text-left transition-all ${on ? "border-[#d9730d] shadow-[0_0_0_1px_#d9730d]" : "border-border hover:border-[#bbb]"}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium text-[#171417]">{it.name}</span>
                <span className={`text-xs font-medium tabular-nums ${Math.abs(it.change) < 1 ? "text-[#555]" : good ? "text-[#067647]" : "text-[#b42318]"}`}>
                  {it.change > 0 ? "+" : "−"}{Math.abs(it.change).toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 flex items-end justify-between gap-2">
                <span className="text-xs tabular-nums text-[#555]">{m.fmt(it.s[it.s.length - 1])}</span>
                <MiniLine values={it.s} color={on ? FOCUS : "#9aa1b4"} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MiniLine({ values, color }: { values: number[]; color: string }) {
  const w = 96, h = 28, p = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const x = (i: number) => p + (i * (w - 2 * p)) / (values.length - 1);
  const y = (v: number) => h - p - ((v - min) / (max - min || 1)) * (h - 2 * p);
  return (
    <svg width={w} height={h} aria-hidden>
      <path d={values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ")} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r={2.5} fill={color} />
    </svg>
  );
}

function TrendTooltip({ active, payload, label, fmt, focusName }: { active?: boolean; payload?: { dataKey: string; value: number | null }[]; label?: string; fmt: (v: number) => string; focusName?: string }) {
  if (!active || !payload?.length || payload.every((p) => p.value == null)) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-[#171417]">Week of {label}</p>
      {payload.map((p) => p.value != null && (
        <p key={p.dataKey} className="flex items-center gap-2 text-[#555]">
          <span className="size-2 rounded-full" style={{ background: p.dataKey === "campaign" ? THIS : FOCUS }} />
          {p.dataKey === "campaign" ? "Campaign" : focusName}
          <span className="ml-auto pl-3 font-medium tabular-nums text-[#171417]">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5" role="tablist">
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={o === value}
          onClick={() => onChange(o)}
          className={`h-7 rounded px-2.5 text-[13px] transition-colors ${o === value ? "bg-[#171417] font-medium text-white" : "text-[#555] hover:text-[#171417]"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

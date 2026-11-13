"use client";

// Report-to-report comparison: this campaign side by side with an earlier one, lined up by week of flight.
// Answers the client question "How does this campaign compare to the last one?".

import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Segmented } from "./trend-view";

const THIS = "#212be9";
const THAT = "#d9730d";
const WEEKS_IN = 8;
const FLIGHT = 13;

type Key = "impr" | "reach" | "spend" | "visits" | "conv" | "lift" | "cpiv" | "cpv";
const ROWS: { key: Key; label: string; risingIsGood: boolean; neutral?: boolean; fmt: (v: number) => string }[] = [
  { key: "impr", label: "Impressions", risingIsGood: true, fmt: (v) => `${v.toFixed(1)}M` },
  { key: "reach", label: "Reach", risingIsGood: true, fmt: (v) => `${v.toFixed(1)}M` },
  { key: "spend", label: "Spend", risingIsGood: false, neutral: true, fmt: (v) => `$${v.toFixed(0)}K` },
  { key: "visits", label: "Store visits", risingIsGood: true, fmt: (v) => `${v.toFixed(0)}K` },
  { key: "conv", label: "Conv. rate", risingIsGood: true, fmt: (v) => `${v.toFixed(2)}%` },
  { key: "lift", label: "Lift", risingIsGood: true, fmt: (v) => `${v.toFixed(2)}%` },
  { key: "cpiv", label: "CPIV", risingIsGood: false, fmt: (v) => `$${v.toFixed(2)}` },
  { key: "cpv", label: "CPV", risingIsGood: false, fmt: (v) => `$${v.toFixed(2)}` },
];
const CHART_KEYS: Key[] = ["lift", "conv", "cpiv", "cpv", "impr"];

type Report = {
  id: string;
  name: string;
  period: string;
  /** Totals or rates at week 8, and at the end of the flight. */
  atWeek8: Record<Key, number>;
  full: Record<Key, number>;
  weekly: Partial<Record<Key, number[]>>;
  partners: Record<string, number>;
  differences: string[];
};

const THIS_REPORT: Report = {
  id: "qsr-q2-2026",
  name: "QSR Q2 2026",
  period: "Apr 1 – Jun 30, 2026",
  atWeek8: { impr: 98.2, reach: 22.6, spend: 380, visits: 413, conv: 2.94, lift: 3.58, cpiv: 21.14, cpv: 0.92 },
  full: { impr: 160.1, reach: 31.4, spend: 620, visits: 671, conv: 2.95, lift: 3.7, cpiv: 20.6, cpv: 0.92 },
  weekly: {
    lift: [3.92, 4.08, 4.36, 4.61, 4.48, 4.02, 3.74, 3.58],
    conv: [2.81, 2.86, 2.9, 2.95, 2.97, 2.96, 2.94, 2.94],
    cpiv: [18.6, 18.2, 18.5, 18.3, 18.4, 19.3, 20.2, 21.14],
    cpv: [0.95, 0.94, 0.93, 0.92, 0.91, 0.92, 0.92, 0.92],
    impr: [11.8, 12.1, 12.4, 12.6, 12.7, 12.9, 11.6, 12.3],
  },
  partners: { Pandora: 5.31, AdTheorent: 5.24, Yelp: 5.14, Spotify: 4.12, Snap: 3.02, iHeartRadio: 3.1 },
  differences: [],
};

const OTHERS: Report[] = [
  {
    id: "qsr-q2-2025",
    name: "QSR Q2 2025",
    period: "Apr 1 – Jun 30, 2025",
    atWeek8: { impr: 84.6, reach: 20.1, spend: 352, visits: 371, conv: 2.71, lift: 3.21, cpiv: 22.8, cpv: 0.95 },
    full: { impr: 139.0, reach: 28.2, spend: 575, visits: 602, conv: 2.74, lift: 3.34, cpiv: 22.1, cpv: 0.96 },
    weekly: {
      lift: [3.1, 3.2, 3.3, 3.25, 3.3, 3.28, 3.2, 3.21, 3.3, 3.36, 3.4, 3.38, 3.34],
      conv: [2.62, 2.66, 2.7, 2.69, 2.72, 2.71, 2.7, 2.71, 2.74, 2.75, 2.76, 2.75, 2.74],
      cpiv: [23.9, 23.5, 23.1, 23.2, 22.9, 22.8, 22.9, 22.8, 22.5, 22.3, 22.0, 22.1, 22.1],
      cpv: [0.98, 0.97, 0.96, 0.96, 0.95, 0.95, 0.95, 0.95, 0.96, 0.96, 0.96, 0.96, 0.96],
      impr: [10.1, 10.4, 10.6, 10.8, 10.7, 10.9, 10.6, 10.5, 10.8, 10.9, 10.7, 10.6, 10.4],
    },
    partners: { Pandora: 3.6, AdTheorent: 4.1, Yelp: 4.4, Snap: 3.4, iHeartRadio: 2.9 },
    differences: [
      "Lift is 12% higher than at the same point last year (3.58% vs 3.21%), but it was 22% higher two weeks ago.",
      "Each incremental visit costs $1.66 less, mostly because Pandora and Yelp improved.",
      "Snap is the only partner doing worse than last year, and it's the largest by spend.",
    ],
  },
  {
    id: "qsr-q1-2026",
    name: "QSR Q1 2026",
    period: "Jan 2 – Mar 31, 2026",
    atWeek8: { impr: 91.3, reach: 21.0, spend: 361, visits: 382, conv: 2.84, lift: 3.66, cpiv: 19.9, cpv: 0.94 },
    full: { impr: 148.7, reach: 29.6, spend: 590, visits: 628, conv: 2.86, lift: 3.81, cpiv: 19.4, cpv: 0.94 },
    weekly: {
      lift: [3.4, 3.5, 3.6, 3.7, 3.72, 3.7, 3.68, 3.66, 3.72, 3.78, 3.84, 3.86, 3.81],
      conv: [2.76, 2.79, 2.81, 2.83, 2.84, 2.85, 2.84, 2.84, 2.85, 2.86, 2.87, 2.87, 2.86],
      cpiv: [20.8, 20.5, 20.2, 20.0, 19.9, 19.9, 19.9, 19.9, 19.7, 19.5, 19.3, 19.3, 19.4],
      cpv: [0.96, 0.95, 0.95, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94],
      impr: [11.0, 11.3, 11.5, 11.6, 11.5, 11.4, 11.6, 11.4, 11.5, 11.6, 11.4, 11.3, 11.1],
    },
    partners: { Pandora: 4.2, AdTheorent: 5.0, Yelp: 4.9, Spotify: 3.8, Snap: 3.9, iHeartRadio: 3.5 },
    differences: [
      "Lift is now 2% below last quarter at the same point, after leading by up to 25% in early March.",
      "CPIV has risen above last quarter since mid-March ($21.14 vs $19.90).",
      "Snap and iHeartRadio lost the most ground; Pandora is the strongest it has been.",
    ],
  },
];

export function CompareView() {
  const [otherId, setOtherId] = useState(OTHERS[0].id);
  const [scope, setScope] = useState<"Same point in flight" | "Full flight">("Same point in flight");
  const [chartKey, setChartKey] = useState<Key>("lift");
  const other = OTHERS.find((r) => r.id === otherId)!;
  const full = scope === "Full flight";
  const a = full ? THIS_REPORT.full : THIS_REPORT.atWeek8;
  const b = full ? other.full : other.atWeek8;
  const row = ROWS.find((r) => r.key === chartKey)!;

  const chartData = Array.from({ length: FLIGHT }, (_, i) => ({
    week: `Wk ${i + 1}`,
    a: THIS_REPORT.weekly[chartKey]?.[i] ?? null,
    b: other.weekly[chartKey]?.[i] ?? null,
  }));

  const partnerNames = Array.from(new Set([...Object.keys(THIS_REPORT.partners), ...Object.keys(other.partners)])).sort(
    (x, y) => (THIS_REPORT.partners[y] ?? 0) - (THIS_REPORT.partners[x] ?? 0),
  );
  const pMax = Math.max(...Object.values(THIS_REPORT.partners), ...Object.values(other.partners)) * 1.1;
  const pMin = Math.min(...Object.values(THIS_REPORT.partners), ...Object.values(other.partners)) * 0.8;
  const px = (v: number) => `${((v - pMin) / (pMax - pMin)) * 100}%`;

  return (
    <div className="px-8 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#171417]">Compare reports</h2>
          <p className="mt-1 text-sm text-[#555]">Two reports side by side, lined up by week of flight.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#555]">
            Compare with
            <select value={otherId} onChange={(e) => setOtherId(e.target.value)} className="h-8 rounded-md border border-input bg-white px-2 text-sm text-[#171417] focus:border-[#212be9] focus:outline-none">
              {OTHERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </label>
          <Segmented options={["Same point in flight", "Full flight"]} value={scope} onChange={(v) => setScope(v as typeof scope)} />
        </div>
      </div>

      {/* Report headers */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[[THIS_REPORT, THIS, "solid"], [other, THAT, "dashed"]].map(([r, c, dash]) => {
          const rep = r as Report;
          return (
            <div key={rep.id} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <svg width="20" height="4" aria-hidden><line x1="0" y1="2" x2="20" y2="2" stroke={c as string} strokeWidth="2.5" strokeDasharray={dash === "dashed" ? "4 3" : undefined} /></svg>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#171417]">{rep.name}</p>
                <p className="text-xs text-muted-foreground">
                  {rep.period} · {rep === THIS_REPORT ? (full ? "Projected to end of flight" : `Week ${WEEKS_IN} of ${FLIGHT}`) : full ? "Full flight" : `At week ${WEEKS_IN}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* What's different */}
      <section className="mt-5 rounded-xl bg-[#f8f8fa] px-5 py-4">
        <h3 className="text-sm font-semibold text-[#171417]">What&apos;s different</h3>
        <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[#333]">
          {other.differences.map((d) => <li key={d} className="flex gap-2"><span className="mt-2.5 size-1 shrink-0 rounded-full bg-[#999]" />{d}</li>)}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Metric table */}
        <section className="min-w-0">
          <h3 className="text-sm font-semibold text-[#171417]">Metrics</h3>
          <table className="mt-3 w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Metric</th>
                <th className="pb-2 text-right font-medium">{THIS_REPORT.name}</th>
                <th className="pb-2 text-right font-medium">{other.name}</th>
                <th className="pb-2 text-right font-medium">Difference</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => {
                const d = ((a[r.key] - b[r.key]) / b[r.key]) * 100;
                const better = r.risingIsGood ? d > 0 : d < 0;
                const flat = Math.abs(d) < 0.5 || !!r.neutral;
                const sel = chartKey === r.key;
                const charted = CHART_KEYS.includes(r.key);
                return (
                  <tr
                    key={r.key}
                    onClick={() => charted && setChartKey(r.key)}
                    className={`border-t border-border ${charted ? "cursor-pointer hover:bg-gray-50" : ""} ${sel ? "bg-[#f3f4ff] hover:bg-[#f3f4ff]" : ""}`}
                  >
                    <td className="py-2 pl-1 text-[#171417]">{r.label}</td>
                    <td className="py-2 text-right text-[#171417]">{full && <span className="mr-1 text-[11px] text-muted-foreground">proj.</span>}{r.fmt(a[r.key])}</td>
                    <td className="py-2 text-right text-[#555]">{r.fmt(b[r.key])}</td>
                    <td className={`py-2 pr-1 text-right font-medium ${flat ? "text-[#555]" : better ? "text-[#067647]" : "text-[#b42318]"}`}>
                      {Math.abs(d) < 0.5 ? "Same" : `${d > 0 ? "+" : "−"}${Math.abs(d).toFixed(1)}%`}
                      {!flat && <span className="sr-only">{better ? " better" : " worse"}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted-foreground">Green is better for you, red is worse. Spend is shown without a judgment. Select a rate to chart it week by week.</p>
        </section>

        {/* Week-by-week overlay */}
        <section className="min-w-0">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-[#171417]">{row.label}, week by week</h3>
            <span className="text-xs text-muted-foreground">Week of flight</span>
          </div>
          <div className="mt-3 h-[240px] rounded-xl border border-border p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#777" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} interval={1} />
                <YAxis tick={{ fontSize: 11, fill: "#777" }} tickLine={false} axisLine={false} width={52} domain={["auto", "auto"]} tickFormatter={(v) => row.fmt(v)} />
                <Tooltip content={<CompareTooltip fmt={row.fmt} names={[THIS_REPORT.name, other.name]} />} cursor={{ stroke: "#c9ccd6" }} />
                <Line dataKey="b" stroke={THAT} strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} />
                <Line dataKey="a" stroke={THIS} strokeWidth={2} dot={{ r: 3, fill: THIS, strokeWidth: 0 }} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 text-xs text-[#555]">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: THIS }} />{THIS_REPORT.name}</span>
            <span className="flex items-center gap-1.5"><svg width="16" height="2" aria-hidden><line x1="0" y1="1" x2="16" y2="1" stroke={THAT} strokeWidth="2" strokeDasharray="4 3" /></svg>{other.name}</span>
          </div>
        </section>
      </div>

      {/* Partners */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-[#171417]">Lift by partner</h3>
          <span className="flex items-center gap-4 text-xs text-[#555]">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: THIS }} />{THIS_REPORT.name}</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: THAT }} />{other.name}</span>
            <span className="text-muted-foreground">At week {WEEKS_IN}</span>
          </span>
        </div>
        <ul className="mt-3 space-y-1">
          {partnerNames.map((p) => {
            const va = THIS_REPORT.partners[p];
            const vb = other.partners[p];
            const lo = Math.min(va ?? vb, vb ?? va);
            const hi = Math.max(va ?? vb, vb ?? va);
            return (
              <li key={p} className="grid grid-cols-[120px_minmax(0,1fr)_150px] items-center gap-4 rounded-md px-1 py-1.5 hover:bg-gray-50">
                <span className="truncate text-sm text-[#171417]">{p}</span>
                <div className="relative h-4">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-[#eef0f4]" />
                  {va != null && vb != null && <span className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-[#c9ccd6]" style={{ left: px(lo), width: `calc(${px(hi)} - ${px(lo)})` }} />}
                  {vb != null && <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white" style={{ left: px(vb), background: THAT }} title={`${other.name}: ${vb.toFixed(2)}%`} />}
                  {va != null && <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white" style={{ left: px(va), background: THIS }} title={`${THIS_REPORT.name}: ${va.toFixed(2)}%`} />}
                </div>
                <span className="text-right text-xs tabular-nums text-[#555]">
                  {va != null ? <span className="font-medium text-[#171417]">{va.toFixed(2)}%</span> : <span>Not in this report</span>}
                  {va != null && vb != null && <> vs {vb.toFixed(2)}%</>}
                  {va != null && vb == null && <span className="ml-1.5 rounded bg-[#f1f2f6] px-1.5 py-0.5 text-[11px] font-medium text-[#555]">New</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function CompareTooltip({ active, payload, label, fmt, names }: { active?: boolean; payload?: { dataKey: string; value: number | null }[]; label?: string; fmt: (v: number) => string; names: [string, string] }) {
  if (!active || !payload?.length) return null;
  const rows = ["a", "b"].map((k) => payload.find((p) => p.dataKey === k)).filter((p) => p && p.value != null) as { dataKey: string; value: number }[];
  if (!rows.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-[#171417]">{label?.replace("Wk", "Week")}</p>
      {rows.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-[#555]">
          <span className="size-2 rounded-full" style={{ background: p.dataKey === "a" ? THIS : THAT }} />
          {p.dataKey === "a" ? names[0] : names[1]}
          <span className="ml-auto pl-3 font-medium tabular-nums text-[#171417]">{fmt(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

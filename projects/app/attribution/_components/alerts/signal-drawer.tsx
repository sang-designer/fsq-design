"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X, MoreHorizontal } from "lucide-react";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { KIND_LABEL, SIGNALS, SEVERITY_META, timeAgo } from "./data";
import { signalStore, useSignalState } from "./store";
import { SeverityPill, SignalBadge, risingIsGood } from "./primitives";

export function SignalDrawer() {
  const s = useSignalState();
  const signal = SIGNALS.find((x) => x.id === s.openId) ?? null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [undo, setUndo] = useState<{ text: string; run: () => void } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!signal) return;
    setMenuOpen(false);
    setCopied(false);
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && signalStore.open(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [signal]);

  useEffect(() => {
    if (!undo) return;
    const t = window.setTimeout(() => setUndo(null), 6000);
    return () => clearTimeout(t);
  }, [undo]);

  const undoToast = undo && (
    <div className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-4 rounded-lg bg-[#171417] px-4 py-3 text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
      {undo.text}
      <button onClick={() => { undo.run(); setUndo(null); }} className="font-semibold text-[#9ea3ff] hover:underline">Undo</button>
    </div>
  );

  if (!signal) return undoToast;

  const m = SEVERITY_META[signal.severity];
  const good = risingIsGood(signal);
  const related = SIGNALS.filter((x) => signal.related?.includes(x.id) || x.related?.includes(signal.id));
  const vote = s.feedback[signal.id];
  const close = () => signalStore.open(null);

  function snooze() {
    const id = signal!.id;
    signalStore.snooze(id);
    close();
    setUndo({ text: "Snoozed for 1 week. We'll bring it back if it gets worse.", run: () => signalStore.unsnooze(id) });
  }
  function mute() {
    const rule = signal!.ruleName;
    signalStore.muteRule(rule);
    close();
    setUndo({ text: `Muted “${rule}”.`, run: () => signalStore.unmuteRule(rule) });
  }
  async function copyLink() {
    const url = `${window.location.origin}/attribution/${signal!.campaignSlug}?signal=${signal!.id}`;
    try { await navigator.clipboard.writeText(url); } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-[#0b0b2a]/25 animate-in fade-in duration-200" onClick={close} />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={signal.headline}
        className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[560px] flex-col bg-white shadow-2xl outline-none animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-2">
            <SeverityPill severity={signal.severity} />
            <span className="text-xs text-muted-foreground">{KIND_LABEL[signal.kind]} · {timeAgo(signal.minutesAgo)}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} aria-label="More actions" className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-[260px] overflow-hidden rounded-md border border-border bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                  <MenuItem onClick={snooze} label="Snooze for 1 week" hint="Comes back sooner if it gets worse" />
                  <MenuItem onClick={mute} label="Mute alerts like this" hint={signal.ruleName} />
                  <Link href={`/attribution/alerts?rule=${encodeURIComponent(signal.ruleName)}`} onClick={close} className="block px-3 py-2 text-sm text-[#171417] hover:bg-gray-50">
                    Adjust this alert<span className="block text-xs text-muted-foreground">Change sensitivity or delivery</span>
                  </Link>
                  <div className="my-1 border-t border-border" />
                  <MenuItem onClick={() => { signalStore.markUnread(signal.id); close(); }} label="Mark as unread" />
                </div>
              )}
            </div>
            <button onClick={close} aria-label="Close" className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6 pt-5">
            <p className="text-xs text-muted-foreground">{signal.campaignName}</p>
            <h2 className="mt-2 text-xl font-semibold leading-7 tracking-[-0.2px] text-[#171417] [text-wrap:balance]">{signal.headline}</h2>
            <p className="mt-2 text-sm leading-6 text-[#444]">{signal.summary}</p>

            {/* The number */}
            <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-xs text-muted-foreground">{signal.metric}{signal.kind !== "reminder" && <> · {signal.scope.dimension}: <span className="font-medium text-[#171417]">{signal.scope.value}</span></>}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[28px] font-semibold leading-8 tabular-nums text-[#171417]">{signal.current}</span>
                  {(!signal.badge || signal.kind === "reminder") && <SignalBadge signal={signal} className="text-sm" />}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{signal.previous} {signal.comparison}</p>
              </div>
              {signal.kind !== "reminder" ? (
                <div className="max-w-[200px] text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Confidence</p>
                  <p className="text-sm font-semibold text-[#171417]">{signal.confidence}</p>
                </div>
              ) : <span />}
              {signal.unusualness && (
                <p className="col-span-2 border-t border-border pt-3 text-xs leading-5" style={{ color: m.fg }}>
                  {signal.unusualness}
                </p>
              )}
            </div>

            {/* Placement checklist (campaign reminders) */}
            {signal.checklist && (
              <section className="mt-6">
                <SectionTitle title={signal.checklistTitle ?? "Placement IDs"} aside={signal.checklistAside ?? `${signal.checklist.filter((c) => !c.done).length} still needed`} />
                <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                  {signal.checklist.map((c, i) => (
                    <li key={c.label} className="flex items-center justify-between gap-3 px-3 py-2.5 animate-prompt-cascade" style={{ animationDelay: `${i * 60}ms` }}>
                      <span className={`min-w-0 truncate text-sm ${c.done ? "text-[#777]" : "font-medium text-[#171417]"} ${signal.checklistTitle ? "font-mono text-[13px]" : ""}`}>{c.label}</span>
                      <span className={`shrink-0 text-xs font-medium tabular-nums ${c.done ? "text-[#067647]" : signal.checklistTitle ? "text-[#555]" : "text-[#b42318]"}`}>{c.detail}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Pace toward a target (sample sufficiency) */}
            {signal.pace && <PaceBar pace={signal.pace} />}

            {/* Ranking (ranking shifts) */}
            {signal.ranking && (
              <section className="mt-6">
                <SectionTitle title={`${signal.metric}, this week`} aside="vs. last week" />
                <ol className="mt-2 divide-y divide-border rounded-lg border border-border">
                  {signal.ranking.map((r, i) => {
                    const moved = r.from - r.to;
                    return (
                      <li key={r.label} className="grid grid-cols-[28px_minmax(0,1fr)_auto_64px] items-center gap-2 px-3 py-2.5 animate-prompt-cascade" style={{ animationDelay: `${i * 60}ms` }}>
                        <span className="text-sm font-semibold tabular-nums text-[#171417]">{r.to}</span>
                        <span className={`truncate text-sm text-[#171417] ${moved ? "font-medium" : ""}`}>{r.label}</span>
                        <span className="text-sm tabular-nums text-[#555]">{r.value}</span>
                        <span className={`text-right text-xs font-medium tabular-nums ${moved > 0 ? "text-[#067647]" : moved < 0 ? "text-[#b42318]" : "text-[#999]"}`}>
                          {moved > 0 ? `Up ${moved}` : moved < 0 ? `Down ${-moved}` : "Same"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            {/* Behavioral lift index (lift results) */}
            {signal.indices && (
              <section className="mt-6">
                <SectionTitle title="Behavioral lift index" aside="100 = campaign average" />
                <ul className="mt-3 space-y-2.5">
                  {[...signal.indices].sort((a, b) => b.value - a.value).map((x, i) => {
                    const above = x.value >= 100;
                    return (
                      <li key={x.label} className="grid grid-cols-[150px_minmax(0,1fr)_40px] items-center gap-3">
                        <span className={`truncate text-sm ${above ? "font-medium text-[#171417]" : "text-[#777]"}`}>{x.label}</span>
                        <span className="relative h-2 rounded-full bg-[#f1f2f6]">
                          <span
                            className="absolute inset-y-0 left-0 origin-left rounded-full animate-[growX_0.7s_cubic-bezier(0.22,1,0.36,1)_both]"
                            style={{ width: `${Math.min(100, x.value / 1.6)}%`, background: above ? "#12b76a" : "#c5c9d6", animationDelay: `${i * 70}ms` }}
                          />
                          <span className="absolute -inset-y-1 w-px bg-[#171417]" style={{ left: `${100 / 1.6}%` }} aria-hidden />
                        </span>
                        <span className={`text-right text-sm font-semibold tabular-nums ${above ? "text-[#067647]" : "text-[#777]"}`}>{x.value}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* Trend with expected band */}
            {signal.series.length > 1 && (
            <section className="mt-6">
              <SectionTitle title="Trend" aside="Gray band = expected range" />
              <div className="mt-2 h-[168px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={signal.series.map((p) => ({ ...p, band: [p.low, p.high] }))} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#f0f0f3" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8d8d8d" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 11, fill: "#8d8d8d" }} tickLine={false} axisLine={false} width={44} domain={["auto", "auto"]} />
                    <Tooltip
                      cursor={{ stroke: "#d0d3e0" }}
                      content={({ active, payload, label }) =>
                        active && payload?.length ? (
                          <div className="rounded-md border border-border bg-white px-3 py-2 text-xs shadow-md">
                            <p className="font-medium text-[#171417]">Week of {label}</p>
                            <p className="mt-0.5 tabular-nums text-[#555]">Actual {String((payload.find((p) => p.dataKey === "value")?.value) ?? "")}</p>
                          </div>
                        ) : null
                      }
                    />
                    <Area dataKey="band" stroke="none" fill="#eef0f6" isAnimationActive={false} />
                    <Line
                      dataKey="value"
                      stroke="#4250E0"
                      strokeWidth={2}
                      isAnimationActive
                      animationDuration={700}
                      dot={(props: { cx?: number; cy?: number; index?: number }) =>
                        props.index === signal.series.length - 1 ? (
                          <g key="last">
                            <circle cx={props.cx} cy={props.cy} r={9} fill={m.fg} opacity={0.15} />
                            <circle cx={props.cx} cy={props.cy} r={4.5} fill={m.fg} stroke="#fff" strokeWidth={2} />
                          </g>
                        ) : (
                          <g key={props.index} />
                        )
                      }
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </section>
            )}

            {/* Where */}
            {signal.breakdown && (
            <section className="mt-6">
              <SectionTitle title="Where it's coming from" />
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {signal.breakdown.map((b, i) => {
                  const w = Math.min(100, Math.abs(b.change) * (Math.abs(b.change) >= 50 ? 1 : 3));
                  const bad = (b.change < 0) === good;
                  return (
                    <li key={b.label} className="grid grid-cols-[minmax(0,1fr)_96px_72px] items-center gap-3 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#171417]">{b.label}</p>
                        <p className="text-xs text-muted-foreground">{b.share}</p>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#f1f2f6]">
                        <div
                          className="h-full rounded-full transition-[width] duration-700 ease-out"
                          style={{ width: `${Math.max(4, w)}%`, background: Math.abs(b.change) < 1.5 ? "#c5c9d6" : bad ? "#f04438" : "#12b76a", transitionDelay: `${i * 80}ms` }}
                        />
                      </div>
                      <span className={`text-right text-sm font-semibold tabular-nums ${Math.abs(b.change) < 1.5 ? "text-muted-foreground" : bad ? "text-[#b42318]" : "text-[#067647]"}`}>
                        {b.change > 0 ? "+" : ""}{b.change.toFixed(1)}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
            )}

            {/* Why */}
            {signal.drivers && (
            <section className="mt-6">
              <SectionTitle title="Likely why" />
              <ul className="mt-2 space-y-2">
                {signal.drivers.map((d) => (
                  <li key={d.text} className="flex items-start gap-3 text-sm leading-6 text-[#333]">
                    <span className={`mt-1 shrink-0 rounded px-1.5 text-[10px] font-semibold uppercase leading-4 tracking-wide ${d.confidence === "High" ? "bg-[#eef0ff] text-[#212be9]" : "bg-[#f4f4f5] text-[#555]"}`}>{d.confidence}</span>
                    <span>{d.text}</span>
                  </li>
                ))}
              </ul>
            </section>
            )}

            {/* So what / now what */}
            <section className="mt-6 grid gap-3">
              <div className="rounded-lg bg-[#f8f8fb] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What it means</p>
                <p className="mt-1 text-sm leading-6 text-[#171417]">{signal.impact}</p>
              </div>
              <div className="rounded-lg border border-[#d6d9ff] bg-[#f7f8ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#212be9]">Suggested next step</p>
                <p className="mt-1 text-sm leading-6 text-[#171417]">{signal.recommendation}</p>
              </div>
            </section>

            {related.length > 0 && (
              <section className="mt-6">
                <SectionTitle title="Related" />
                {related.map((r) => (
                  <button key={r.id} onClick={() => signalStore.open(r.id)} className="mt-2 block w-full truncate rounded-lg bg-[#f7f7f9] px-3 py-2.5 text-left text-sm text-[#171417] transition-colors hover:bg-[#efeff3]">
                    {r.headline}
                  </button>
                ))}
              </section>
            )}

            {/* Feedback */}
            <section className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              {vote ? (
                <p className="text-sm text-[#555] animate-in fade-in duration-300">
                  {vote === "up" ? "Thanks. We'll keep sending alerts like this." : "Got it. We'll send fewer alerts like this."}
                </p>
              ) : (
                <>
                  <p className="text-sm text-[#555]">Was this worth your attention?</p>
                  <div className="flex gap-2">
                    <button onClick={() => signalStore.feedback(signal.id, "up")} className="btn-press h-8 rounded-md border border-border px-3 text-sm hover:bg-gray-50">Yes</button>
                    <button onClick={() => signalStore.feedback(signal.id, "down")} className="btn-press h-8 rounded-md border border-border px-3 text-sm hover:bg-gray-50">Not really</button>
                  </div>
                </>
              )}
            </section>
            <p className="mt-3 text-xs text-muted-foreground">Sent by <span className="font-medium text-[#555]">{signal.ruleName}</span></p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-border bg-white px-6 py-3">
          <Link
            href={signal.cta ? signal.cta.href : `/attribution/${signal.campaignSlug}?ask=${encodeURIComponent(signal.askPrompt ?? "")}`}
            onClick={close}
            className="btn-press flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-[#212be9] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4]"
          >
            {signal.cta ? signal.cta.label : signal.kind === "lift" && !signal.drivers ? "Open the report" : signal.pace ? "Ask AI how to catch up" : "Ask AI why this happened"}
          </Link>
          <button onClick={copyLink} className="btn-press flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-[#171417] hover:bg-gray-50">
            {copied ? "Link copied" : "Share"}
          </button>
        </div>
      </aside>
      {undoToast}
    </>
  );
}

function PaceBar({ pace }: { pace: NonNullable<import("./data").Signal["pace"]> }) {
  const max = Math.max(pace.needed, pace.projected) * 1.08;
  const pct = (v: number) => `${(v / max) * 100}%`;
  const short = pace.projected < pace.needed;
  return (
    <section className="mt-6">
      <SectionTitle title="Sample pace" aside={`Needed by ${pace.deadline}`} />
      <div className="relative mt-8 h-3 rounded-full bg-[#f1f2f6]">
        {/* Projected by the deadline */}
        <span
          className="absolute inset-y-0 left-0 origin-left rounded-full animate-[growX_0.9s_0.2s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ width: pct(pace.projected), background: "repeating-linear-gradient(135deg,#c7cbff 0 4px,#e4e6ff 4px 8px)" }}
        />
        {/* Today */}
        <span className="absolute inset-y-0 left-0 origin-left rounded-full bg-[#212be9] animate-[growX_0.7s_cubic-bezier(0.22,1,0.36,1)_both]" style={{ width: pct(pace.today) }} />
        {/* Needed */}
        <span className="absolute -inset-y-2 w-0.5 rounded bg-[#171417]" style={{ left: pct(pace.needed) }} aria-hidden />
        <span className="absolute -top-6 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-[#171417]" style={{ left: pct(pace.needed) }}>
          {pace.needed}K needed
        </span>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#212be9]" /><dt className="text-muted-foreground">Today</dt><dd className="font-medium tabular-nums text-[#171417]">{pace.today}K</dd></div>
        <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#c7cbff]" /><dt className="text-muted-foreground">Projected by {pace.deadline}</dt><dd className={`font-medium tabular-nums ${short ? "text-[#b42318]" : "text-[#067647]"}`}>{pace.projected}K</dd></div>
      </dl>
      <p className="mt-1 text-xs text-muted-foreground">Counts are {pace.unit}.</p>
    </section>
  );
}

function SectionTitle({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h3 className="text-sm font-semibold text-[#171417]">{title}</h3>
      {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
    </div>
  );
}

function MenuItem({ label, hint, onClick }: { label: string; hint?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="block w-full px-3 py-2 text-left text-sm text-[#171417] hover:bg-gray-50">
      {label}{hint && <span className="block truncate text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
}

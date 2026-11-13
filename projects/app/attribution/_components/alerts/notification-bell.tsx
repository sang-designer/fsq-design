"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { LIVE_SIGNAL_ID, SIGNALS, timeAgo, type Signal } from "./data";
import { signalStore, useSignalState, visibleSignals } from "./store";
import { SignalBadge, Sparkline } from "./primitives";
import { SignalDrawer } from "./signal-drawer";

type Filter = "all" | "attention" | "wins";

/**
 * Bell + notification center + live toast + detail drawer.
 * Drop one into any page header; it owns all of the notification UI.
 */
export function NotificationBell() {
  const s = useSignalState();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [toast, setToast] = useState<Signal | null>(null);
  const [ping, setPing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const all = visibleSignals(s);
  // Bundle children under their root cause so one incident = one row.
  const roots = all.filter((x) => !all.some((p) => p.related?.includes(x.id)));
  const unread = roots.filter((x) => !s.read.includes(x.id));
  const filtered = roots.filter((x) =>
    filter === "all" ? true : filter === "wins" ? x.severity === "positive" : x.severity === "critical" || x.severity === "warning",
  );
  const unreadNew = filtered.filter((x) => !s.read.includes(x.id));
  const earlier = filtered.filter((x) => s.read.includes(x.id));

  // Gmail-style: a tab shows how many unread signals it holds, and nothing once they're read.
  const newCounts = useMemo(() => ({
    all: unread.length,
    attention: unread.filter((x) => x.severity === "critical" || x.severity === "warning").length,
    wins: unread.filter((x) => x.severity === "positive").length,
  }), [unread]);

  // Live delivery: a new signal lands a few seconds into the session.
  useEffect(() => {
    if (!mounted || s.liveDelivered) return;
    const t = window.setTimeout(() => {
      signalStore.deliverLive();
      setToast(SIGNALS.find((x) => x.id === LIVE_SIGNAL_ID) ?? null);
      setPing(true);
      window.setTimeout(() => setPing(false), 2400);
    }, 4500);
    return () => clearTimeout(t);
  }, [mounted, s.liveDelivered]);

  useEffect(() => {
    if (!s.centerOpen) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && signalStore.setCenterOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && signalStore.setCenterOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [s.centerOpen]);

  const toggle = (id: string) => setExpanded((e) => (e.includes(id) ? e.filter((y) => y !== id) : [...e, id]));

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => signalStore.setCenterOpen(!s.centerOpen)}
          aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ""}`}
          aria-expanded={s.centerOpen}
          className={`btn-press relative flex size-9 items-center justify-center rounded-md text-[#555] transition-colors duration-200 hover:bg-gray-50 ${s.centerOpen ? "bg-gray-100 text-[#171417]" : ""}`}
        >
          <Bell className={`size-4 origin-[50%_15%] ${ping ? "animate-[bellRing_0.9s_ease-in-out_2]" : ""}`} />
          {mounted && unread.length > 0 && (
            <span className="absolute right-1 top-1 flex size-2.5 items-center justify-center">
              {ping && <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#212be9] opacity-60" />}
              <span className="relative size-2 rounded-full bg-[#212be9] ring-2 ring-white" />
            </span>
          )}
        </button>

        {s.centerOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 flex max-h-[min(640px,calc(100vh-80px))] w-[min(420px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-border bg-white shadow-[0_16px_48px_-12px_rgba(11,11,42,0.22)] animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Header */}
            <div className="px-5 pb-3 pt-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-base font-semibold text-[#171417]">Signals</h2>
                {unread.length > 0 && (
                  <button onClick={() => signalStore.markAllRead(all.map((x) => x.id))} className="text-xs font-medium text-[#555] transition-colors hover:text-[#171417]">
                    Mark all read
                  </button>
                )}
              </div>
              <p className="mt-1 text-[13px] leading-5 text-[#555]">{briefLine(roots)}</p>
            </div>

            {/* Filters: underlined tabs, same pattern as the campaign list */}
            <div className="flex gap-5 border-b border-border px-5" role="tablist">
              {([
                ["all", "All"],
                ["attention", "Needs attention"],
                ["wins", "Wins"],
              ] as const).map(([k, label]) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={filter === k}
                  onClick={() => setFilter(k)}
                  aria-label={newCounts[k] ? `${label}, ${newCounts[k]} new` : label}
                  className={`-mb-px flex items-baseline gap-1.5 border-b-2 pb-2 text-[13px] transition-colors duration-300 ${filter === k ? "border-[#171417]" : "border-transparent hover:text-[#171417]"} ${newCounts[k] ? "font-semibold text-[#171417]" : filter === k ? "font-medium text-[#171417]" : "text-[#777]"}`}
                >
                  {label}
                  {newCounts[k] > 0 && <span key={newCounts[k]} className="tabular-nums animate-in fade-in zoom-in-75 duration-300">{newCounts[k]}</span>}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <EmptyState filter={filter} />
              ) : (
                <>
                  {unreadNew.length > 0 && <GroupLabel>New</GroupLabel>}
                  {unreadNew.map((x, i) => (
                    <Row key={x.id} signal={x} unread index={i} children_={all.filter((c) => x.related?.includes(c.id))} expanded={expanded.includes(x.id)} onToggle={() => toggle(x.id)} />
                  ))}
                  {earlier.length > 0 && <GroupLabel>Earlier</GroupLabel>}
                  {earlier.map((x, i) => (
                    <Row key={x.id} signal={x} index={unreadNew.length + i} children_={all.filter((c) => x.related?.includes(c.id))} expanded={expanded.includes(x.id)} onToggle={() => toggle(x.id)} />
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs">
              <span className="text-muted-foreground">Watching 46 metrics</span>
              <Link href="/attribution/alerts" onClick={() => signalStore.setCenterOpen(false)} className="font-medium text-[#212be9] hover:underline">Manage alerts</Link>
            </div>
          </div>
        )}
      </div>

      {toast && <LiveToast signal={toast} onClose={() => setToast(null)} />}
      {mounted && <SignalDrawer />}
    </>
  );
}

function briefLine(roots: Signal[]) {
  if (!roots.length) return "Nothing unusual across your campaigns.";
  const act = roots.filter((x) => x.severity === "critical").length;
  const watch = roots.filter((x) => x.severity === "warning").length;
  const wins = roots.filter((x) => x.severity === "positive").length;
  const updates = roots.filter((x) => x.severity === "info").length;
  const parts = [
    act && `${act} ${act === 1 ? "needs" : "need"} action`,
    watch && `${watch} to watch`,
    wins && `${wins} ${wins === 1 ? "win" : "wins"}`,
    updates && `${updates} ${updates === 1 ? "update" : "updates"}`,
  ].filter(Boolean);
  return parts.join(", ");
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-5 pb-1 pt-4 text-[11px] font-medium uppercase tracking-[0.06em] text-[#999]">{children}</p>;
}

function Row({ signal, unread, index, children_, expanded, onToggle }: { signal: Signal; unread?: boolean; index: number; children_: Signal[]; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="animate-prompt-cascade" style={{ animationDelay: `${index * 45}ms` }}>
      <button
        onClick={() => signalStore.open(signal.id)}
        className="group relative flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-[#f7f7f9]"
      >
        {unread && <span className="absolute left-2 top-[21px] size-1.5 rounded-full bg-[#212be9]" aria-label="Unread" />}
        <span className="min-w-0 flex-1">
          <span className={`block text-sm leading-5 text-[#171417] [text-wrap:pretty] ${unread ? "font-semibold" : ""}`}>{signal.headline}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{signal.campaignName} · {timeAgo(signal.minutesAgo)}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-0.5">
          {signal.series.length > 1 && <Sparkline points={signal.series} severity={signal.severity} width={64} height={22} />}
          <SignalBadge signal={signal} className="text-xs" />
        </span>
      </button>
      {children_.length > 0 && (
        <div className="px-5 pb-2">
          <button onClick={onToggle} className="text-xs text-[#555] underline decoration-[#ccc] underline-offset-2 hover:text-[#171417] hover:decoration-[#171417]">
            {expanded ? "Hide" : "Show"} {children_.length} related {children_.length === 1 ? "signal" : "signals"}
          </button>
          {expanded && children_.map((c) => (
            <button key={c.id} onClick={() => signalStore.open(c.id)} className="mt-1.5 block w-full truncate rounded-md bg-[#f7f7f9] px-3 py-2 text-left text-xs text-[#333] transition-colors hover:bg-[#efeff3] animate-in fade-in slide-in-from-top-1 duration-200">
              {c.headline}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="flex flex-col items-center px-8 py-12 text-center">
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#12b76a] opacity-50 [animation-duration:2.4s]" />
        <span className="relative size-2.5 rounded-full bg-[#12b76a]" />
      </span>
      <p className="mt-4 text-sm font-medium text-[#171417]">{filter === "wins" ? "No wins yet this week" : "All quiet"}</p>
      <p className="mt-1 max-w-[260px] text-[13px] leading-5 text-muted-foreground">
        {filter === "wins"
          ? "We'll tell you when lift or visits beat your benchmark."
          : "Everything is within its expected range. We'll tell you when that changes."}
      </p>
    </div>
  );
}

function LiveToast({ signal, onClose }: { signal: Signal; onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState(9000);
  useEffect(() => {
    if (paused) return;
    const started = Date.now();
    const base = left;
    const t = window.setInterval(() => {
      const rem = base - (Date.now() - started);
      if (rem <= 0) { clearInterval(t); onClose(); } else setLeft(rem);
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="fixed bottom-6 right-6 z-[55] w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-xl border border-border bg-white shadow-[0_16px_48px_-12px_rgba(11,11,42,0.28)] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">New signal · {signal.campaignName}</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-[#171417]">{signal.headline}</p>
          <div className="mt-3 flex items-center gap-4">
            <button onClick={() => { signalStore.open(signal.id); onClose(); }} className="text-sm font-medium text-[#212be9] hover:underline">See what changed</button>
            <button onClick={() => { signalStore.snooze(signal.id); onClose(); }} className="text-sm text-[#555] hover:text-[#171417]">Snooze</button>
          </div>
        </div>
        <button onClick={onClose} aria-label="Dismiss" className="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100"><X className="size-3.5" /></button>
      </div>
      <div className="h-0.5 bg-[#f0f0f3]"><div className="h-full bg-[#212be9] transition-[width] duration-100 ease-linear" style={{ width: `${(left / 9000) * 100}%` }} /></div>
    </div>
  );
}

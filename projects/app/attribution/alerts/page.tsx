"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Masthead } from "../_components/masthead";
import { signalStore, useSignalState } from "../_components/alerts/store";
import { ALERT_TYPES, type SignalKind } from "../_components/alerts/data";

/* ---------- Settings model ---------- */

const CORE_METRICS = ["Lift", "Conv. rate", "CPIV", "CPV"] as const;
const CHANGE_METRICS = ["Lift", "Conv. rate", "CPIV", "CPV", "Impressions", "Reach", "Store visits"] as const;
const CUTS = ["Partners", "Tactics", "DMAs", "Audiences", "Creatives"] as const;
const SECTIONS = ["Audiences", "Demographics", "DMAs", "Dayparts", "Partners"] as const;

type Threshold = { id: string; metric: (typeof CHANGE_METRICS)[number]; pct: number };

type Settings = {
  enabled: Record<SignalKind, boolean>;
  ranking: { by: (typeof CORE_METRICS)[number]; cuts: string[] };
  change: Threshold[];
  lift: { measurable: boolean; index: boolean; above: number; sections: string[] };
  trend: { metrics: string[]; weeks: number };
  delivery: { slow: boolean; spike: boolean; mode: "smart" | "fixed"; pct: number };
  health: { pixel: boolean; pixelPct: number; sample: boolean; unmapped: boolean };
  reminder: { days: number; onlyMissing: boolean };
};

const INITIAL: Settings = {
  enabled: { ranking: true, change: true, lift: true, trend: true, delivery: true, health: true, reminder: true },
  ranking: { by: "Lift", cuts: ["Partners", "Tactics"] },
  change: [
    { id: "t1", metric: "Lift", pct: 15 },
    { id: "t2", metric: "Conv. rate", pct: 10 },
    { id: "t3", metric: "Impressions", pct: 5 },
  ],
  lift: { measurable: true, index: true, above: 100, sections: ["Audiences", "DMAs"] },
  trend: { metrics: ["Lift", "Conv. rate", "CPIV", "CPV"], weeks: 3 },
  delivery: { slow: true, spike: true, mode: "smart", pct: 10 },
  health: { pixel: true, pixelPct: 20, sample: true, unmapped: true },
  reminder: { days: 7, onlyMissing: true },
};

/** Last 30 days, per type (mock). */
const STATS: Record<SignalKind, { sent: number; useful: number | null }> = {
  ranking: { sent: 3, useful: 90 },
  change: { sent: 6, useful: 71 },
  lift: { sent: 4, useful: 100 },
  trend: { sent: 2, useful: 88 },
  delivery: { sent: 4, useful: 92 },
  health: { sent: 3, useful: 100 },
  reminder: { sent: 1, useful: null },
};

/* Weekly moves over the last 12 weeks (mock), so each threshold can say how often it would have fired. */
const HISTORY: Record<Threshold["metric"], number[]> = {
  Lift: [4, -7, 12, -3, 18, -9, 6, 21, -5, 8, -14, 18],
  "Conv. rate": [2, -4, 3, -6, 5, -11, 2, 4, -3, 12, -2, 3],
  CPIV: [3, 6, -2, 9, -5, 4, 12, -3, 5, 7, 8, 9],
  CPV: [2, -3, 4, -2, 6, -4, 3, 9, -2, 3, 4, -5],
  Impressions: [1, -2, 3, -1, -6, 2, 4, -3, 1, -1, 2, -5],
  Reach: [1, 2, -1, 3, -2, 1, -4, 2, 1, -1, 3, -2],
  "Store visits": [3, 5, -2, 4, -6, 8, 2, -3, 5, -4, 6, 4],
};

/* ---------- Page ---------- */

export default function AlertsPage() {
  return (
    <Suspense>
      <AlertsPageContent />
    </Suspense>
  );
}

function AlertsPageContent() {
  const params = useSearchParams();
  const focus = params.get("rule");
  const s = useSignalState();
  const [settings, setSettings] = useState<Settings>(INITIAL);
  const [open, setOpen] = useState<SignalKind | null>(null);
  const [flash, setFlash] = useState<SignalKind | null>(null);
  const [suggestions, setSuggestions] = useState(["dmas", "cpv"]);

  useEffect(() => {
    const t = ALERT_TYPES.find((x) => x.title === focus);
    if (!t) return;
    setOpen(t.kind);
    document.getElementById(`type-${t.kind}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focus]);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setSettings((p) => ({ ...p, [k]: v }));
  function highlight(kind: SignalKind) {
    setOpen(kind);
    setFlash(kind);
    window.setTimeout(() => setFlash(null), 1600);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Masthead />

      <main className="mx-auto max-w-[1180px] px-12 py-8 max-md:px-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/attribution" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-[#171417]">Alerts</span>
        </nav>
        <div className="mt-4">
          <h1 className="text-[28px] font-semibold leading-9 tracking-[-0.5px] text-[#171417]">Alerts</h1>
          <p className="mt-2 max-w-[640px] text-sm leading-6 text-[#555]">
            Choose what you want to hear about. We watch every live campaign and only alert you when something you care about changes.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_340px] gap-8 max-lg:grid-cols-1">
          <div className="min-w-0 space-y-8">
            <section>
              <h2 className="text-base font-semibold text-[#171417]">Alerts you get</h2>
              <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
                {ALERT_TYPES.map((t) => {
                  const on = settings.enabled[t.kind];
                  const muted = s.mutedRules.includes(t.title);
                  const expanded = open === t.kind && on && !muted;
                  const st = STATS[t.kind];
                  return (
                    <li key={t.kind} id={`type-${t.kind}`} className={`transition-colors duration-700 ${flash === t.kind ? "bg-[#f3f4ff]" : ""}`}>
                      <div className="flex items-start gap-4 px-5 py-4">
                        <div className={`min-w-0 flex-1 transition-opacity ${on && !muted ? "" : "opacity-50"}`}>
                          <p className="text-sm font-semibold text-[#171417]">
                            {t.title}
                            {muted && <span className="ml-2 text-xs font-normal text-muted-foreground">Muted</span>}
                          </p>
                          <p className="mt-0.5 text-[13px] leading-5 text-[#555]">{t.description}</p>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {summary(t.kind, settings)}
                            {on && !muted && (
                              <>
                                {" · "}
                                <button onClick={() => setOpen(expanded ? null : t.kind)} className="font-medium text-[#212be9] hover:underline" aria-expanded={expanded}>
                                  {expanded ? "Done" : "Customize"}
                                </button>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="hidden w-[120px] shrink-0 pt-0.5 text-right text-xs sm:block">
                          <p className="tabular-nums text-[#171417]">{st.sent} sent</p>
                          <p className="text-muted-foreground">{st.useful == null ? "No ratings yet" : `${st.useful}% useful`}</p>
                        </div>
                        <div className="pt-0.5">
                          {muted ? (
                            <button onClick={() => signalStore.unmuteRule(t.title)} className="text-sm font-medium text-[#212be9] hover:underline">Unmute</button>
                          ) : (
                            <Toggle checked={on} onChange={(v) => set("enabled", { ...settings.enabled, [t.kind]: v })} label={`${t.title} alerts`} />
                          )}
                        </div>
                      </div>
                      {expanded && (
                        <div className="mx-5 mb-5 rounded-lg bg-[#f8f8fa] p-4 animate-in fade-in slide-in-from-top-1 duration-200">
                          <Options kind={t.kind} settings={settings} set={set} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {suggestions.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-[#171417]">Suggested for your campaigns</h2>
                <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
                  {suggestions.includes("dmas") && !settings.ranking.cuts.includes("DMAs") && (
                    <Suggestion
                      title="Rank DMAs too"
                      why="Atlanta jumped from #6 to #2 for lift last week. With DMA rankings on, you'd have heard about it."
                      onAdd={() => { set("ranking", { ...settings.ranking, cuts: [...settings.ranking.cuts, "DMAs"] }); highlight("ranking"); }}
                      onDismiss={() => setSuggestions((x) => x.filter((y) => y !== "dmas"))}
                    />
                  )}
                  {suggestions.includes("cpv") && !settings.change.some((c) => c.metric === "CPV") && (
                    <Suggestion
                      title="Watch CPV week over week"
                      why="Cost per visit moved more than 8% twice this month on QSR Q2 2026."
                      onAdd={() => { set("change", [...settings.change, { id: `t${Date.now()}`, metric: "CPV", pct: 8 }]); highlight("change"); }}
                      onDismiss={() => setSuggestions((x) => x.filter((y) => y !== "cpv"))}
                    />
                  )}
                </ul>
              </section>
            )}
          </div>

          <aside className="min-w-0 space-y-6">
            <DeliverySettings />
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-[#171417]">This month</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Stat n={20} label="Alerts sent" />
                <Stat n="89%" label="Rated useful" />
                <Stat n="1.4h" label="Avg. to action" />
              </dl>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- Per-type copy and options ---------- */

function list(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function summary(kind: SignalKind, s: Settings) {
  switch (kind) {
    case "ranking": return s.ranking.cuts.length ? `${list(s.ranking.cuts)} ranked by ${s.ranking.by.toLowerCase()}` : "No cuts selected";
    case "change": return s.change.length ? s.change.map((c) => `${c.metric} ±${c.pct}%`).join(", ") : "No metrics selected";
    case "lift": return [s.lift.measurable && "When lift is measurable", s.lift.index && `Index above ${s.lift.above}`].filter(Boolean).join(" · ") || "Nothing selected";
    case "trend": return s.trend.metrics.length ? `${list(s.trend.metrics)}, ${s.trend.weeks} weeks in a row` : "No metrics selected";
    case "delivery": {
      const what = [s.delivery.slow && "Slowdowns", s.delivery.spike && "spikes"].filter(Boolean).join(" and ") || "Nothing selected";
      return `${what} · ${s.delivery.mode === "smart" ? "Smart sensitivity" : `More than ${s.delivery.pct}%`}`;
    }
    case "health": return [s.health.pixel && `Pixel tracking drops ${s.health.pixelPct}%+`, s.health.sample && "Sample off pace", s.health.unmapped && "Unmapped IDs"].filter(Boolean).join(" · ") || "Nothing selected";
    case "reminder": return `${s.reminder.days} days before a campaign ends`;
  }
}

function Options({ kind, settings: s, set }: { kind: SignalKind; settings: Settings; set: <K extends keyof Settings>(k: K, v: Settings[K]) => void }) {
  const toggleIn = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  if (kind === "ranking")
    return (
      <div className="space-y-4">
        <Field label="Rank by">
          <Select value={s.ranking.by} options={CORE_METRICS} onChange={(v) => set("ranking", { ...s.ranking, by: v })} />
        </Field>
        <Field label="Cuts to watch">
          <Chips options={CUTS} selected={s.ranking.cuts} onToggle={(v) => set("ranking", { ...s.ranking, cuts: toggleIn(s.ranking.cuts, v) })} />
        </Field>
      </div>
    );

  if (kind === "change") return <ThresholdEditor items={s.change} onChange={(v) => set("change", v)} />;

  if (kind === "lift")
    return (
      <div className="space-y-4">
        <Check checked={s.lift.measurable} onChange={(v) => set("lift", { ...s.lift, measurable: v })} label="When lift becomes measurable in a report" />
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Check checked={s.lift.index} onChange={(v) => set("lift", { ...s.lift, index: v })} label="When a section's behavioral lift index goes above" />
            <NumberInput value={s.lift.above} onChange={(v) => set("lift", { ...s.lift, above: v })} min={50} max={300} label="Index threshold" disabled={!s.lift.index} />
          </div>
          {s.lift.index && (
            <div className="pl-6">
              <Chips options={SECTIONS} selected={s.lift.sections} onToggle={(v) => set("lift", { ...s.lift, sections: toggleIn(s.lift.sections, v) })} />
            </div>
          )}
        </div>
      </div>
    );

  if (kind === "trend")
    return (
      <div className="space-y-4">
        <Field label="Metrics">
          <Chips options={CORE_METRICS} selected={s.trend.metrics} onToggle={(v) => set("trend", { ...s.trend, metrics: toggleIn(s.trend.metrics, v) })} />
        </Field>
        <Field label="Alert after">
          <Select value={`${s.trend.weeks} weeks in a row`} options={["2 weeks in a row", "3 weeks in a row", "4 weeks in a row"] as const} onChange={(v) => set("trend", { ...s.trend, weeks: parseInt(v) })} />
        </Field>
      </div>
    );

  if (kind === "delivery")
    return (
      <div className="space-y-4">
        <Field label="Tell me when impressions">
          <Chips
            options={["Slow down", "Rapidly increase"] as const}
            selected={[s.delivery.slow && "Slow down", s.delivery.spike && "Rapidly increase"].filter(Boolean) as string[]}
            onToggle={(v) => set("delivery", v === "Slow down" ? { ...s.delivery, slow: !s.delivery.slow } : { ...s.delivery, spike: !s.delivery.spike })}
          />
        </Field>
        <Field label="Sensitivity">
          <div className="space-y-2" role="radiogroup">
            <Radio checked={s.delivery.mode === "smart"} onSelect={() => set("delivery", { ...s.delivery, mode: "smart" })} label="Smart" hint="Only when it's outside the normal range for that campaign and region. Recommended." />
            <div className="flex flex-wrap items-center gap-2">
              <Radio checked={s.delivery.mode === "fixed"} onSelect={() => set("delivery", { ...s.delivery, mode: "fixed" })} label="More than" />
              <NumberInput value={s.delivery.pct} onChange={(v) => set("delivery", { ...s.delivery, mode: "fixed", pct: v })} min={1} max={100} suffix="%" label="Percent change" />
              <span className="text-sm text-[#555]">week over week</span>
            </div>
          </div>
        </Field>
      </div>
    );

  if (kind === "health")
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Check checked={s.health.pixel} onChange={(v) => set("health", { ...s.health, pixel: v })} label="When impression tracking on a pixel drops more than" />
          <NumberInput value={s.health.pixelPct} onChange={(v) => set("health", { ...s.health, pixelPct: v })} min={5} max={90} suffix="%" label="Pixel drop percent" disabled={!s.health.pixel} />
        </div>
        <Check checked={s.health.sample} onChange={(v) => set("health", { ...s.health, sample: v })} label="When impressions or sample aren't on pace to be big enough by the end of the campaign" />
        <Check checked={s.health.unmapped} onChange={(v) => set("health", { ...s.health, unmapped: v })} label="When delivery data has placement IDs that aren't mapped to a placement" />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#171417]">
        Remind me
        <Select value={`${s.reminder.days} days`} options={["3 days", "5 days", "7 days", "14 days"] as const} onChange={(v) => set("reminder", { ...s.reminder, days: parseInt(v) })} />
        before a campaign ends
      </div>
      <Check checked={s.reminder.onlyMissing} onChange={(v) => set("reminder", { ...s.reminder, onlyMissing: v })} label="Only if some placement IDs haven't been shared with Foursquare" />
      <p className="rounded-md bg-white px-3 py-2 text-[13px] leading-5 text-[#555] ring-1 ring-border">
        &ldquo;Campaign ends in {s.reminder.days} days. Please make sure all placement IDs have been shared with Foursquare.&rdquo;
      </p>
    </div>
  );
}

function ThresholdEditor({ items, onChange }: { items: Threshold[]; onChange: (v: Threshold[]) => void }) {
  const unused = CHANGE_METRICS.filter((m) => !items.some((i) => i.metric === m));
  return (
    <div>
      <ul className="space-y-3">
        {items.map((t) => {
          const fired = HISTORY[t.metric].filter((v) => Math.abs(v) >= t.pct).length;
          return (
            <li key={t.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#171417] animate-in fade-in duration-300">
              <span className="w-[96px] font-medium">{t.metric}</span>
              changes more than
              <NumberInput value={t.pct} onChange={(v) => onChange(items.map((x) => (x.id === t.id ? { ...x, pct: v } : x)))} min={1} max={100} suffix="%" label={`${t.metric} percent`} />
              week over week
              <span className={`ml-auto text-xs tabular-nums transition-colors ${fired >= 6 ? "text-[#b54708]" : "text-muted-foreground"}`}>
                {fired === 0 ? "Wouldn't have fired in 12 weeks" : `${fired} ${fired === 1 ? "alert" : "alerts"} in the last 12 weeks${fired >= 6 ? ". Try a higher %" : ""}`}
              </span>
              <button onClick={() => onChange(items.filter((x) => x.id !== t.id))} className="text-xs text-[#777] hover:text-[#b42318]">Remove</button>
            </li>
          );
        })}
      </ul>
      {unused.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <label className="flex items-center gap-2 text-sm text-[#555]">
            Add a metric
            <select
              value=""
              onChange={(e) => e.target.value && onChange([...items, { id: `t${Date.now()}`, metric: e.target.value as Threshold["metric"], pct: 10 }])}
              className="h-8 rounded-md border border-input bg-white px-2 text-sm text-[#171417] focus:border-[#212be9] focus:outline-none"
            >
              <option value="">Choose…</option>
              {unused.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

/* ---------- Small controls ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-[#555]">{label}</p>
      {children}
    </div>
  );
}

function Chips<T extends string>({ options, selected, onToggle }: { options: readonly T[]; selected: string[]; onToggle: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o)}
            className={`btn-press h-8 rounded-full border px-3 text-[13px] transition-colors ${on ? "border-[#171417] bg-[#171417] text-white" : "border-border bg-white text-[#444] hover:border-[#999]"}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Select<T extends string>({ value, options, onChange }: { value: string; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)} className="h-8 rounded-md border border-input bg-white px-2 text-sm text-[#171417] focus:border-[#212be9] focus:outline-none">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function NumberInput({ value, onChange, min, max, suffix, label, disabled }: { value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string; label: string; disabled?: boolean }) {
  return (
    <span className={`inline-flex h-8 items-center rounded-md border border-input bg-white px-2 focus-within:border-[#212be9] ${disabled ? "opacity-50" : ""}`}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
        className="w-10 bg-transparent text-sm tabular-nums text-[#171417] outline-none"
      />
      {suffix && <span className="text-sm text-[#777]">{suffix}</span>}
    </span>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[#171417]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 rounded accent-[#212be9]" />
      {label}
    </label>
  );
}

function Radio({ checked, onSelect, label, hint }: { checked: boolean; onSelect: () => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-[#171417]">
      <input type="radio" checked={checked} onChange={onSelect} className="mt-0.5 size-4 accent-[#212be9]" />
      <span>{label}{hint && <span className="block text-xs leading-5 text-muted-foreground">{hint}</span>}</span>
    </label>
  );
}

function Suggestion({ title, why, onAdd, onDismiss }: { title: string; why: string; onAdd: () => void; onDismiss: () => void }) {
  return (
    <li className="flex items-center gap-4 px-5 py-4 animate-in fade-in duration-300">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#171417]">{title}</p>
        <p className="mt-0.5 text-[13px] leading-5 text-[#555]">{why}</p>
      </div>
      <button onClick={onDismiss} className="shrink-0 text-sm text-[#777] hover:text-[#171417]">Dismiss</button>
      <button onClick={onAdd} className="btn-press h-8 shrink-0 rounded-md border border-border px-3 text-sm font-medium text-[#171417] hover:bg-gray-50">Add</button>
    </li>
  );
}

/* ---------- Delivery ---------- */

function DeliverySettings() {
  const [ch, setCh] = useState({ inapp: true, email: true, slack: false });
  const [quiet, setQuiet] = useState(true);
  return (
    <section className="rounded-xl border border-border p-4">
      <h2 className="text-sm font-semibold text-[#171417]">How we reach you</h2>
      <ul className="mt-3 space-y-3">
        {([
          ["inapp", "In app", "The bell, plus a toast for urgent alerts"],
          ["email", "Email", "syeo@foursquare.com"],
          ["slack", "Slack", "#qsr-campaign-ops"],
        ] as const).map(([k, label, hint]) => (
          <li key={k} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#171417]">{label}</p>
              <p className="truncate text-xs text-muted-foreground">{hint}</p>
            </div>
            <Toggle checked={ch[k]} onChange={(v) => setCh({ ...ch, [k]: v })} label={label} />
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Timing by urgency</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex justify-between gap-2"><span className="text-[#b42318]">Act now</span><span className="text-[#555]">Right away</span></li>
          <li className="flex justify-between gap-2"><span className="text-[#b54708]">Watch</span><span className="text-[#555]">Daily digest, 9:00 AM</span></li>
          <li className="flex justify-between gap-2"><span className="text-[#067647]">Wins and updates</span><span className="text-[#555]">Monday recap</span></li>
        </ul>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[#171417]">Quiet hours</p>
          <p className="text-xs text-muted-foreground">8 PM – 7 AM ET. Only &ldquo;Act now&rdquo; alerts come through.</p>
        </div>
        <Toggle checked={quiet} onChange={setQuiet} label="Quiet hours" />
      </div>
    </section>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#212be9] focus-visible:ring-offset-2 ${checked ? "bg-[#212be9]" : "bg-[#d4d4d8] hover:bg-[#c4c4cc]"}`}
    >
      <span
        aria-hidden
        className={`size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

function Stat({ n, label }: { n: string | number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums text-[#171417]">{n}</dd>
      <dd className="text-[11px] leading-4 text-muted-foreground">{label}</dd>
    </div>
  );
}

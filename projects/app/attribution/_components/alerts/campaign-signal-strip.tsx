"use client";

import { signalStore, useSignalState, visibleSignals } from "./store";
import { SignalBadge } from "./primitives";
import { SEVERITY_META } from "./data";

/** This campaign's open signals, shown where people already look: under the KPIs. */
export function CampaignSignalStrip({ campaignSlug }: { campaignSlug: string }) {
  const s = useSignalState();
  const signals = visibleSignals(s, campaignSlug).slice(0, 3);
  if (!signals.length) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-500">
      <span className="pr-1 text-xs text-muted-foreground">This week</span>
      {signals.map((x) => {
        const unread = !s.read.includes(x.id);
        return (
          <button
            key={x.id}
            onClick={() => signalStore.open(x.id)}
            className={`btn-press group flex h-8 max-w-full items-center gap-2 rounded-full border bg-white px-3 text-left text-[13px] transition-all hover:border-[#212be9] hover:shadow-sm ${unread ? "border-[#c7cbff]" : "border-border"}`}
          >
            <span className="size-1.5 shrink-0 rounded-full" style={{ background: SEVERITY_META[x.severity].fg }} />
            <span className="truncate font-medium text-[#171417]">{x.scope.value === "All partners" ? x.metric : `${x.metric} · ${x.scope.value}`}</span>
            <SignalBadge signal={x} />
          </button>
        );
      })}
    </div>
  );
}

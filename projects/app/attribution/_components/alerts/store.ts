"use client";

// Tiny client store for signal state shared by the bell, drawer, toast and pages.
// Read / snoozed / muted / feedback state persists per browser.

import { useSyncExternalStore } from "react";
import { LIVE_SIGNAL_ID, SIGNALS, type Signal } from "./data";

type State = {
  read: string[];
  snoozed: string[];
  mutedRules: string[];
  feedback: Record<string, "up" | "down">;
  /** The live signal is "delivered" a few seconds after first load. */
  liveDelivered: boolean;
  openId: string | null;
  centerOpen: boolean;
};

const KEY = "fsq-attribution-signals-v4";
const initial: State = {
  read: ["sig-index-100", "sig-mcd-lift-ready", "sig-cpiv-trend", "sig-partner-rank"],
  snoozed: [],
  mutedRules: [],
  feedback: {},
  liveDelivered: false,
  openId: null,
  centerOpen: false,
};

let state: State = initial;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw), openId: null, centerOpen: false };
  } catch {}
}

function persist() {
  try {
    const { openId: _o, centerOpen: _c, ...rest } = state;
    window.localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {}
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((l) => l());
}

export const signalStore = {
  subscribe(l: () => void) {
    hydrate();
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,
  markRead: (id: string) => !state.read.includes(id) && set({ read: [...state.read, id] }),
  markUnread: (id: string) => set({ read: state.read.filter((r) => r !== id) }),
  markAllRead: (ids: string[]) => set({ read: Array.from(new Set([...state.read, ...ids])) }),
  snooze: (id: string) => set({ snoozed: [...state.snoozed, id] }),
  unsnooze: (id: string) => set({ snoozed: state.snoozed.filter((s) => s !== id) }),
  muteRule: (rule: string) => set({ mutedRules: [...state.mutedRules, rule] }),
  unmuteRule: (rule: string) => set({ mutedRules: state.mutedRules.filter((r) => r !== rule) }),
  feedback: (id: string, v: "up" | "down") => set({ feedback: { ...state.feedback, [id]: v } }),
  deliverLive: () => set({ liveDelivered: true, read: state.read.filter((r) => r !== LIVE_SIGNAL_ID) }),
  open: (id: string | null) => {
    if (id) signalStore.markRead(id);
    set({ openId: id, centerOpen: id ? false : state.centerOpen });
  },
  setCenterOpen: (v: boolean) => set({ centerOpen: v }),
  reset: () => {
    state = initial;
    persist();
    listeners.forEach((l) => l());
  },
};

const serverSnapshot = initial;
export function useSignalState() {
  return useSyncExternalStore(signalStore.subscribe, signalStore.get, () => serverSnapshot);
}

/** Signals visible right now, newest first, with snoozed and muted ones removed. */
export function visibleSignals(s: State, campaignSlug?: string): Signal[] {
  return SIGNALS.filter(
    (sig) =>
      (sig.id !== LIVE_SIGNAL_ID || s.liveDelivered) &&
      !s.snoozed.includes(sig.id) &&
      !s.mutedRules.includes(sig.ruleName) &&
      (!campaignSlug || sig.campaignSlug === campaignSlug),
  ).sort((a, b) => a.minutesAgo - b.minutesAgo);
}

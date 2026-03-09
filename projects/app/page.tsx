"use client";

import { TrendingUp, TrendingDown, User, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useRef, useEffect } from "react";

const chartData = [
  { month: "Jan", edits: 230, votes: 140, placesCreated: 45, rejectedEdits: 30, rolledBack: 15, communityApproved: 90, autoApproved: 65, flaggedPhotos: 12 },
  { month: "Feb", edits: 1350, votes: 420, placesCreated: 85, rejectedEdits: 120, rolledBack: 55, communityApproved: 310, autoApproved: 280, flaggedPhotos: 38 },
  { month: "Mar", edits: 580, votes: 260, placesCreated: 62, rejectedEdits: 48, rolledBack: 22, communityApproved: 180, autoApproved: 140, flaggedPhotos: 20 },
  { month: "Apr", edits: 920, votes: 340, placesCreated: 70, rejectedEdits: 75, rolledBack: 35, communityApproved: 250, autoApproved: 210, flaggedPhotos: 28 },
  { month: "May", edits: 500, votes: 190, placesCreated: 40, rejectedEdits: 42, rolledBack: 18, communityApproved: 130, autoApproved: 100, flaggedPhotos: 16 },
  { month: "Jun", edits: 750, votes: 280, placesCreated: 55, rejectedEdits: 60, rolledBack: 28, communityApproved: 200, autoApproved: 165, flaggedPhotos: 22 },
  { month: "Jul", edits: 480, votes: 170, placesCreated: 38, rejectedEdits: 38, rolledBack: 16, communityApproved: 120, autoApproved: 95, flaggedPhotos: 14 },
  { month: "Aug", edits: 1380, votes: 450, placesCreated: 92, rejectedEdits: 115, rolledBack: 52, communityApproved: 320, autoApproved: 290, flaggedPhotos: 42 },
  { month: "Sep", edits: 620, votes: 230, placesCreated: 50, rejectedEdits: 52, rolledBack: 24, communityApproved: 160, autoApproved: 130, flaggedPhotos: 18 },
  { month: "Oct", edits: 880, votes: 310, placesCreated: 68, rejectedEdits: 70, rolledBack: 32, communityApproved: 240, autoApproved: 195, flaggedPhotos: 26 },
  { month: "Nov", edits: 490, votes: 180, placesCreated: 42, rejectedEdits: 40, rolledBack: 17, communityApproved: 125, autoApproved: 98, flaggedPhotos: 15 },
  { month: "Dec", edits: 720, votes: 270, placesCreated: 58, rejectedEdits: 58, rolledBack: 26, communityApproved: 190, autoApproved: 155, flaggedPhotos: 21 },
];

const CHART_SERIES = [
  { key: "edits", label: "Edits", color: "#212be9" },
  { key: "votes", label: "Votes", color: "#7c8eb5" },
  { key: "placesCreated", label: "Places Created", color: "#16a34a" },
  { key: "rejectedEdits", label: "Rejected Edits", color: "#dc2626" },
  { key: "rolledBack", label: "Rolled Back", color: "#f59e0b" },
  { key: "communityApproved", label: "Community Approved", color: "#8b5cf6" },
  { key: "autoApproved", label: "Auto Approved", color: "#06b6d4" },
  { key: "flaggedPhotos", label: "Flagged Photos", color: "#ec4899" },
] as const;

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold text-[#020617]">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => {
          const series = CHART_SERIES.find((s) => s.key === entry.dataKey);
          return (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-[#646464]">{series?.label ?? entry.dataKey}</span>
              </div>
              <span className="text-xs font-semibold tabular-nums text-[#020617]">{entry.value.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#646464]">Total</span>
          <span className="text-xs font-bold tabular-nums text-[#020617]">{payload.reduce((sum, e) => sum + e.value, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

const popoverTabs = ["Overall", "Weekly"] as const;
type PopoverTab = (typeof popoverTabs)[number];

function ContributionSummaryPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [popoverTab, setPopoverTab] = useState<PopoverTab>("Overall");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const pageTab: Tab = popoverTab === "Weekly" ? "7 Days" : "Overall";
  const m = metricsByTab[pageTab];
  const rows = [
    { label: "Edits", value: m.edits.value },
    { label: "Rejected edits", value: m.rejected.value },
    { label: "Rolled back edits", value: m.rolledBack.value },
    { label: "Community approved edits", value: m.communityApproved.value },
    { label: "Automatically approved edits", value: m.autoApproved.value },
    { label: "Flagged photos", value: m.flaggedPhotos.value },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={onClose} />
      <div ref={ref} className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-md border border-border bg-white shadow-lg sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-[380px] sm:translate-y-0">
        <div className="space-y-2 px-4 pb-2 pt-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Contribution Summary</h3>
              <p className="text-xs text-muted-foreground">Joined May 2024</p>
            </div>
          </div>

        <div className="rounded-md border border-[#1e3a8a] bg-[#eff6ff] px-2.5 py-2 text-xs leading-4 text-[#1e3a8a]">
          Contribution numbers are calculated nightly through an offline job. As a result, the numbers may sometimes be out of sync.
        </div>

        <div className="flex border-b border-border">
          {popoverTabs.map((t) => (
            <button
              key={t}
              onClick={() => setPopoverTab(t)}
              className={`px-2 py-1 text-xs transition-colors ${
                popoverTab === t
                  ? "border-b-2 border-foreground font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between border-b border-border/50 py-2.5 last:border-0">
            <span className="text-xs font-semibold text-foreground">{row.label}</span>
            <span className="text-xs font-semibold tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  badge?: { value: string; trend: "up" | "down" };
};

function StatCard({ label, value, badge }: StatCardProps) {
  return (
    <div className="group cursor-default rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:border-[#212be9]/20 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium transition-colors group-hover:border-[#212be9]/20 sm:px-2 sm:text-xs">
            {badge.trend === "up" ? (
              <TrendingUp className="size-3.5 text-emerald-600 sm:size-4" />
            ) : (
              <TrendingDown className="size-3.5 text-red-500 sm:size-4" />
            )}
            {badge.value}
          </span>
        )}
      </div>
      <p className="mt-1 text-2xl font-semibold tracking-tight sm:mt-1.5 sm:text-[26px]">{value}</p>
    </div>
  );
}

function MetricSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-base font-semibold sm:text-lg">{title}</h3>
      {children}
    </div>
  );
}

function SimpleMetricCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="group cursor-default rounded-lg border border-border bg-white p-4 shadow-xs transition-all hover:border-[#212be9]/20 hover:shadow-md sm:p-5">
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight sm:mt-2 sm:text-[26px]">{value}</p>
      <p className="mt-1.5 text-[11px] text-muted-foreground sm:mt-2 sm:text-xs">{change}</p>
    </div>
  );
}

const tabs = ["Overall", "7 Days", "30 Days"] as const;
type Tab = (typeof tabs)[number];

type MetricData = {
  value: string;
  change: string;
};

type TabMetrics = {
  edits: MetricData;
  rejected: MetricData;
  rolledBack: MetricData;
  communityApproved: MetricData;
  autoApproved: MetricData;
  flaggedPhotos: MetricData;
};

const metricsByTab: Record<Tab, TabMetrics> = {
  Overall: {
    edits:             { value: "1,500",  change: "+15% from last quarter" },
    rejected:          { value: "2,224",  change: "+25% from last week" },
    rolledBack:        { value: "1,234",  change: "+25% from last week" },
    communityApproved: { value: "1,234",  change: "+25% from last week" },
    autoApproved:      { value: "1,234",  change: "+25% from last week" },
    flaggedPhotos:     { value: "1,234",  change: "+25% from last week" },
  },
  "7 Days": {
    edits:             { value: "312",    change: "+8% from previous 7 days" },
    rejected:          { value: "87",     change: "-12% from previous 7 days" },
    rolledBack:        { value: "43",     change: "+3% from previous 7 days" },
    communityApproved: { value: "198",    change: "+18% from previous 7 days" },
    autoApproved:      { value: "156",    change: "+5% from previous 7 days" },
    flaggedPhotos:     { value: "29",     change: "-7% from previous 7 days" },
  },
  "30 Days": {
    edits:             { value: "1,087",  change: "+11% from previous 30 days" },
    rejected:          { value: "342",    change: "+4% from previous 30 days" },
    rolledBack:        { value: "178",    change: "-6% from previous 30 days" },
    communityApproved: { value: "621",    change: "+22% from previous 30 days" },
    autoApproved:      { value: "489",    change: "+9% from previous 30 days" },
    flaggedPhotos:     { value: "112",    change: "+2% from previous 30 days" },
  },
};

function getTabDateRange(tab: Tab): string | null {
  if (tab === "Overall") return null;
  const today = new Date();
  const end = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const days = tab === "7 Days" ? 7 : 30;
  const start = new Date(today);
  start.setDate(start.getDate() - days);
  const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startStr} – ${end}`;
}

function TabButton({ tab, isActive, onClick }: { tab: Tab; isActive: boolean; onClick: () => void }) {
  const dateRange = getTabDateRange(tab);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`peer rounded-lg px-2.5 py-1 text-xs transition-all sm:px-3 sm:text-sm ${
          isActive
            ? "bg-white font-medium text-[#171417] shadow-sm"
            : "text-[#171417] hover:bg-white/50"
        }`}
      >
        {tab}
      </button>
      {dateRange && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#171417] px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity peer-hover:opacity-100">
          {dateRange}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#171417]" />
        </div>
      )}
    </div>
  );
}

type HistoryRow = {
  placeName: string;
  details: string;
  status: "Accepted" | "Pending";
  contributionType: "Vote" | "Edit";
  reviewType: string;
  created: string;
  resolved: string;
};

const historyData: HistoryRow[] = [
  { placeName: "Burma Love", details: "url: https://www.burmalove.com", status: "Accepted", contributionType: "Vote", reviewType: "Duplicate", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "Fox Liquoir & Delicatessen", details: "Beer Plot", status: "Accepted", contributionType: "Vote", reviewType: "Closed", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "The Assembly", details: "url: https://www.fulltiltcolumbiacity.com", status: "Accepted", contributionType: "Vote", reviewType: "Info", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "Full Tilt Ice Cream", details: "", status: "Accepted", contributionType: "Edit", reviewType: "Submenu", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "Beer Plotter", details: "", status: "Accepted", contributionType: "Edit", reviewType: "Category", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "Republic of Cake", details: "", status: "Pending", contributionType: "Edit", reviewType: "Geosuggestion", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "ShareTea", details: "", status: "Pending", contributionType: "Edit", reviewType: "Duplicate", created: "10/05/2024", resolved: "" },
  { placeName: "7-Eleven", details: "address: 612 O'Farrell St", status: "Accepted", contributionType: "Edit", reviewType: "Duplicate", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "Tufts Univ.", details: "igh: tuftsuniversity", status: "Accepted", contributionType: "Vote", reviewType: "Duplicate", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "TRANS: THRIVE", details: "", status: "Accepted", contributionType: "Vote", reviewType: "Duplicate", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "Beer Plotter", details: "", status: "Pending", contributionType: "Edit", reviewType: "Duplicate", created: "10/05/2024", resolved: "" },
  { placeName: "Lahore Karahi", details: "", status: "Accepted", contributionType: "Vote", reviewType: "Duplicate", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "Rockridge Market Hall", details: "", status: "Accepted", contributionType: "Vote", reviewType: "Duplicate", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "El Metate", details: "url: https://elmetatesf.com", status: "Accepted", contributionType: "Vote", reviewType: "Duplicate", created: "10/05/2024", resolved: "10/07/2024" },
  { placeName: "Right Angle Hair Salon", details: "", status: "Accepted", contributionType: "Vote", reviewType: "Duplicate", created: "10/05/2024", resolved: "10/07/2024" },
];

const ROWS_PER_PAGE_OPTIONS = [15, 25, 50];

function HistoryTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortField, setSortField] = useState<"created" | "resolved" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...historyData].sort((a, b) => {
    if (!sortField) return 0;
    const av = a[sortField] || "9999";
    const bv = b[sortField] || "9999";
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const pageRows = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  function toggleSort(field: "created" | "resolved") {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-gray-50 sm:text-sm">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </button>
      </div>

      {/* Mobile card layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {pageRows.map((row, i) => (
          <div key={i} className="rounded-lg border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[#3333ff]">{row.placeName}</span>
              <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                row.status === "Accepted"
                  ? "bg-[#eff7f0] text-emerald-700"
                  : "bg-[#f2eefb] text-[#3333ff]"
              }`}>
                {row.status}
              </span>
            </div>
            {row.details && (
              <p className="mb-2 truncate text-xs text-muted-foreground">{row.details}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span>{row.contributionType}</span>
              <span>{row.reviewType}</span>
              <span className="tabular-nums">{row.created}</span>
              {row.resolved && <span className="tabular-nums">{row.resolved}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-white text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Place Name</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Resolved By</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Contribution types</th>
              <th className="px-4 py-3">Review Types</th>
              <th className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort("created")}>
                <span className="inline-flex items-center gap-1">
                  Created
                  <ArrowUpDown className="size-3" />
                </span>
              </th>
              <th className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort("resolved")}>
                <span className="inline-flex items-center gap-1">
                  Resolved
                  <ArrowUpDown className="size-3" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-medium text-[#3333ff]">{row.placeName}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-sm text-muted-foreground">{row.details}</td>
                <td className="px-4 py-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#f2eefb]">
                    <User className="size-3.5 text-[#555]" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    row.status === "Accepted"
                      ? "bg-[#eff7f0] text-emerald-700"
                      : "bg-[#f2eefb] text-[#3333ff]"
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{row.contributionType}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{row.reviewType}</td>
                <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">{row.created}</td>
                <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">{row.resolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
            className="rounded border border-border bg-white px-2 py-1 text-xs"
          >
            {ROWS_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
          <span>{page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="rounded border border-border p-1 transition-colors hover:bg-gray-50 disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="rounded border border-border p-1 transition-colors hover:bg-gray-50 disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Overall");
  const metrics = metricsByTab[activeTab];
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pageTab, setPageTab] = useState<"history" | "insights">("history");

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Global Nav */}
      <header className="sticky top-0 z-50 overflow-hidden bg-white">
        <img src="/Global header/placemaker.svg" alt="Placemaker" className="h-14 w-auto min-w-full object-cover object-left" />
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Page Header */}
        <div className="mb-6 sm:mb-7">
          <h1 className="text-2xl font-bold tracking-[-0.5px] text-black sm:text-[34px] sm:leading-10 sm:tracking-[-0.75px]">
            My Contributions
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 sm:mt-3 sm:gap-4">
            <span className="rounded bg-[#f8f8f8] px-2 py-0.5 text-[10px] text-[#171417] sm:py-1 sm:text-xs">Apprentice</span>
            <span className="text-[10px] font-medium text-black sm:text-xs">User ID: 1411016266</span>
            <div className="relative">
              <button
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="text-[10px] font-medium text-[#212be9] hover:underline sm:text-xs"
              >
                Contributions summary
              </button>
              <ContributionSummaryPopover open={summaryOpen} onClose={() => setSummaryOpen(false)} />
            </div>
          </div>
        </div>

        {/* Page-level Tabs */}
        <div className="mb-6 flex border-b border-border sm:mb-7">
          <button
            onClick={() => setPageTab("history")}
            className={`px-4 pb-2.5 text-sm transition-colors sm:text-base ${
              pageTab === "history"
                ? "border-b-2 border-[#171417] font-semibold text-[#171417]"
                : "text-muted-foreground hover:text-[#171417]"
            }`}
          >
            History
          </button>
          <button
            onClick={() => setPageTab("insights")}
            className={`px-4 pb-2.5 text-sm transition-colors sm:text-base ${
              pageTab === "insights"
                ? "border-b-2 border-[#171417] font-semibold text-[#171417]"
                : "text-muted-foreground hover:text-[#171417]"
            }`}
          >
            Contribution Insights
          </button>
        </div>

        {pageTab === "history" ? (
        <HistoryTable />
        ) : (
        <>
        {/* Top Stats Row */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:gap-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[330px] lg:shrink-0 lg:grid-cols-1 lg:gap-3.5">
            <StatCard label="Total Edits" value="1,500" badge={{ value: "+12.5%", trend: "up" }} />
            <StatCard label="Total approved edits" value="236" badge={{ value: "-1%", trend: "down" }} />
            <StatCard label="Member since" value="2023 🔥" />
          </div>

          <div className="flex-1 rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            <h2 className="mb-3 text-sm font-semibold sm:text-base">Contributions Overview</h2>
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {CHART_SERIES.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[11px] text-[#646464]">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="h-[250px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#737373" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#737373" }} width={40} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(33, 43, 233, 0.04)" }} />
                  {CHART_SERIES.map((s) => (
                    <Bar key={s.key} dataKey={s.key} stackId="contributions" fill={s.color} radius={0} barSize={28} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#f0f0f0] p-1 sm:gap-2">
            {tabs.map((tab) => (
              <TabButton key={tab} tab={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />
            ))}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <MetricSection title="Edits">
            <SimpleMetricCard label={activeTab} value={metrics.edits.value} change={metrics.edits.change} />
          </MetricSection>
          <MetricSection title="Rejected edits">
            <SimpleMetricCard label={activeTab} value={metrics.rejected.value} change={metrics.rejected.change} />
          </MetricSection>
          <MetricSection title="Rolled back edits">
            <SimpleMetricCard label={activeTab} value={metrics.rolledBack.value} change={metrics.rolledBack.change} />
          </MetricSection>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <MetricSection title="Community approved edits">
            <SimpleMetricCard label={activeTab} value={metrics.communityApproved.value} change={metrics.communityApproved.change} />
          </MetricSection>
          <MetricSection title="Automatically approved edits">
            <SimpleMetricCard label={activeTab} value={metrics.autoApproved.value} change={metrics.autoApproved.change} />
          </MetricSection>
          <MetricSection title="Flagged photos">
            <SimpleMetricCard label={activeTab} value={metrics.flaggedPhotos.value} change={metrics.flaggedPhotos.change} />
          </MetricSection>
        </div>
        </>
        )}
      </main>
    </div>
  );
}

"use client";

import {
  Search,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Share2,
  Download,
  ChevronsUpDown,
  MoreHorizontal,
  Grid3X3,
  CircleAlert,
  FileText,
  UserCircle,
  X,
  Plus,
  LogOut,
  Pencil,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";

type CampaignStatus = "Pending" | "Completed" | "In Progress" | "Draft" | "Error";

type Campaign = {
  id: number;
  name: string;
  slug: string;
  logo: string;
  logoColor: string;
  advertiser: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 0, name: "McDonalds Q1-Q2 2025", slug: "mcdonalds-q1-q2-2025", logo: "M", logoColor: "#FFC72C", advertiser: "Google 360", status: "Error", startDate: "1/6/2025", endDate: "6/30/2025" },
  { id: 1, name: "Circle K Campaign Q1-Q4 etc", slug: "circle-k-q1-q4", logo: "CK", logoColor: "#ee2e24", advertiser: "Google 360", status: "Pending", startDate: "1/20/2025", endDate: "1/20/2025" },
  { id: 2, name: "McDonald's Q3 Fall Campaign", slug: "mcdonalds-q3-fall", logo: "M", logoColor: "#FFC72C", advertiser: "Google 360", status: "In Progress", startDate: "7/1/2025", endDate: "9/25/2025" },
  { id: 3, name: "Mcdonald's Summer Campaign", slug: "mcdonalds-summer", logo: "M", logoColor: "#FFC72C", advertiser: "Google 360", status: "Completed", startDate: "1/20/2025", endDate: "1/20/2025" },
  { id: 4, name: "Chick Fil A Summer...", slug: "chick-fil-a-summer", logo: "CF", logoColor: "#E51636", advertiser: "Google 360", status: "Pending", startDate: "1/20/2025", endDate: "1/20/2025" },
  { id: 5, name: "Circle K Campaign Q1-Q4 etc", slug: "circle-k-q1-q4-2", logo: "CK", logoColor: "#ee2e24", advertiser: "Google 360", status: "Pending", startDate: "1/20/2025", endDate: "1/20/2025" },
  { id: 6, name: "Costco Campaign 2024", slug: "costco-2024", logo: "CO", logoColor: "#E31837", advertiser: "Google 360", status: "Pending", startDate: "1/20/2025", endDate: "1/20/2025" },
  { id: 7, name: "Starbucks X Coke", slug: "starbucks-x-coke", logo: "SB", logoColor: "#00704A", advertiser: "Google 360", status: "Completed", startDate: "1/20/2025", endDate: "1/20/2025" },
  { id: 8, name: "Arby's Midwest Campaign 20...", slug: "arbys-midwest", logo: "AB", logoColor: "#d2232a", advertiser: "Google 360", status: "Completed", startDate: "1/20/2025", endDate: "1/20/2025" },
  { id: 9, name: "Peet's Summer", slug: "peets-summer", logo: "PT", logoColor: "#1B3C34", advertiser: "Google 360", status: "Completed", startDate: "1/20/2025", endDate: "1/20/2025" },
  { id: 10, name: "Wendy's Spring Promo", slug: "wendys-spring", logo: "WD", logoColor: "#e2203d", advertiser: "Google 360", status: "Pending", startDate: "1/20/2025", endDate: "1/20/2025" },
];

const ALL_STATUSES: CampaignStatus[] = ["Error", "Pending", "In Progress", "Completed"];

const STATUS_LABELS: Record<CampaignStatus, string> = {
  Error: "Pending Pixel Setup",
  Pending: "Validating",
  "In Progress": "Active",
  Completed: "Completed",
  Draft: "Draft",
};

const ITEMS_PER_PAGE = 10;

function StatusBadge({ status }: { status: CampaignStatus }) {
  const config: Record<CampaignStatus, { dot: string; text: string; label: string }> = {
    Error: { dot: "bg-red-500", text: "text-foreground", label: "Pending Pixel Setup" },
    Pending: { dot: "bg-orange-400", text: "text-foreground", label: "Validating" },
    Completed: { dot: "bg-emerald-500", text: "text-foreground", label: "Completed" },
    "In Progress": { dot: "bg-blue-500", text: "text-foreground", label: "Active" },
    Draft: { dot: "bg-gray-400", text: "text-foreground", label: "Draft" },
  };
  const c = config[status] ?? { dot: "bg-gray-400", text: "text-foreground", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${c.text}`}>
      <span className={`size-2 rounded-full ${c.dot}`} />
      <span className="font-medium">{c.label}</span>
    </span>
  );
}

function CampaignLogo({ logo, color }: { logo: string; color: string }) {
  return (
    <div
      className="flex size-7 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {logo}
    </div>
  );
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isBetween(d: Date, start: Date, end: Date) {
  return d > start && d < end;
}
function formatDateShort(d: Date) {
  return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

function DateRangePicker({
  startDate,
  endDate,
  onApply,
  open,
  onToggle,
}: {
  startDate: Date | null;
  endDate: Date | null;
  onApply: (start: Date | null, end: Date | null) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [leftMonth, setLeftMonth] = useState(startDate ? startDate.getMonth() : today.getMonth());
  const [leftYear, setLeftYear] = useState(startDate ? startDate.getFullYear() : today.getFullYear());
  const [rangeStart, setRangeStart] = useState<Date | null>(startDate);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(endDate);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onToggle();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onToggle]);

  function prevMonth() {
    if (leftMonth === 0) { setLeftMonth(11); setLeftYear(leftYear - 1); }
    else setLeftMonth(leftMonth - 1);
  }
  function nextMonth() {
    if (leftMonth === 11) { setLeftMonth(0); setLeftYear(leftYear + 1); }
    else setLeftMonth(leftMonth + 1);
  }

  function handleDayClick(d: Date) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(d);
      setRangeEnd(null);
    } else {
      if (d < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(d);
      } else {
        setRangeEnd(d);
      }
    }
  }

  function handleApply() {
    onApply(rangeStart, rangeEnd);
    onToggle();
  }

  function handleClear() {
    setRangeStart(null);
    setRangeEnd(null);
    onApply(null, null);
    onToggle();
  }

  const effectiveEnd = rangeEnd || hoveredDate;
  const selStart = rangeStart && effectiveEnd && effectiveEnd < rangeStart ? effectiveEnd : rangeStart;
  const selEnd = rangeStart && effectiveEnd && effectiveEnd < rangeStart ? rangeStart : effectiveEnd;

  function renderMonth(year: number, month: number) {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const prevDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);
    const cells: { date: Date; currentMonth: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month - 1, prevDays - i), currentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), currentMonth: true });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ date: new Date(year, month + 1, d), currentMonth: false });
    }
    return cells;
  }

  const displayLabel = rangeStart
    ? rangeEnd
      ? `${formatDateShort(rangeStart)} - ${formatDateShort(rangeEnd)}`
      : formatDateShort(rangeStart)
    : "Pick a date";

  return (
    <div ref={ref} className="relative max-w-[382px] flex-1">
      <button
        onClick={onToggle}
        className={`flex h-9 w-full items-center rounded-md border bg-white px-3 transition-colors ${open ? "border-[#212be9] ring-1 ring-[#212be9]" : "border-input hover:bg-gray-50"}`}
      >
        <Calendar className="mr-2 size-4 text-muted-foreground" />
        <span className={`text-sm ${rangeStart ? "text-foreground" : "text-muted-foreground"}`}>{displayLabel}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 rounded-lg border border-border bg-white p-5 shadow-lg">
          <div className="flex gap-8">
            {/* Left month */}
            <div className="w-[252px]">
              <div className="mb-3 flex items-center justify-between">
                <button onClick={prevMonth} className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground">
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-sm font-semibold text-[#171417]">{MONTH_NAMES[leftMonth]} {leftYear}</span>
                <span className="size-7" />
              </div>
              <div className="grid grid-cols-7 gap-0">
                {DAYS.map((d) => (
                  <div key={d} className="flex h-9 items-center justify-center text-xs font-medium text-muted-foreground">{d}</div>
                ))}
                {renderMonth(leftYear, leftMonth).map(({ date, currentMonth }, i) => {
                  const isStart = selStart && isSameDay(date, selStart);
                  const isEnd = selEnd && isSameDay(date, selEnd);
                  const inRange = selStart && selEnd && isBetween(date, selStart, selEnd);
                  return (
                    <button
                      key={i}
                      onClick={() => currentMonth && handleDayClick(date)}
                      onMouseEnter={() => currentMonth && !rangeEnd && rangeStart && setHoveredDate(date)}
                      className={`flex h-9 items-center justify-center text-sm transition-colors ${
                        !currentMonth ? "text-muted-foreground/40" :
                        isStart || isEnd ? "rounded-md bg-[#212be9] font-semibold text-white" :
                        inRange ? "bg-[#eff0fd] text-[#212be9]" :
                        "text-[#171417] hover:bg-gray-100"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Right month */}
            <div className="w-[252px]">
              <div className="mb-3 flex items-center justify-between">
                <span className="size-7" />
                <span className="text-sm font-semibold text-[#171417]">{MONTH_NAMES[rightMonth]} {rightYear}</span>
                <button onClick={nextMonth} className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground">
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0">
                {DAYS.map((d) => (
                  <div key={d} className="flex h-9 items-center justify-center text-xs font-medium text-muted-foreground">{d}</div>
                ))}
                {renderMonth(rightYear, rightMonth).map(({ date, currentMonth }, i) => {
                  const isStart = selStart && isSameDay(date, selStart);
                  const isEnd = selEnd && isSameDay(date, selEnd);
                  const inRange = selStart && selEnd && isBetween(date, selStart, selEnd);
                  return (
                    <button
                      key={i}
                      onClick={() => currentMonth && handleDayClick(date)}
                      onMouseEnter={() => currentMonth && !rangeEnd && rangeStart && setHoveredDate(date)}
                      className={`flex h-9 items-center justify-center text-sm transition-colors ${
                        !currentMonth ? "text-muted-foreground/40" :
                        isStart || isEnd ? "rounded-md bg-[#212be9] font-semibold text-white" :
                        inRange ? "bg-[#eff0fd] text-[#212be9]" :
                        "text-[#171417] hover:bg-gray-100"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
            <button onClick={handleClear} className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground">Clear</button>
            <button onClick={handleApply} className="rounded-md bg-[#212be9] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4]">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AttributionPage() {
  return (
    <Suspense>
      <AttributionPageContent />
    </Suspense>
  );
}

function AttributionPageContent() {
  const [activeTab, setActiveTab] = useState<"all" | "draft">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [statusOpen, setStatusOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [highlightSlug, setHighlightSlug] = useState<string | null>(null);
  const [campaignList, setCampaignList] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [rowMenuId, setRowMenuId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusRef = useRef<HTMLDivElement>(null);
  const rowMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const submitted = searchParams.get("submitted");
    const tab = searchParams.get("tab");
    const pixelSetupDone = searchParams.get("pixel-setup-done");
    if (pixelSetupDone) {
      setCampaignList((prev) => prev.map((c) => c.slug === pixelSetupDone ? { ...c, status: "Pending" as CampaignStatus } : c));
      setHighlightSlug(pixelSetupDone);
      const timer = setTimeout(() => setHighlightSlug(null), 4000);
      return () => clearTimeout(timer);
    }
    if (submitted) {
      if (tab === "draft" && !campaignList.some((c) => c.slug === submitted)) {
        const name = submitted.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Untitled Draft";
        setCampaignList((prev) => [
          { id: Date.now(), name, slug: submitted, logo: name.slice(0, 2).toUpperCase(), logoColor: "#94a3b8", advertiser: "—", status: "Draft" as CampaignStatus, startDate: new Date().toLocaleDateString("en-US"), endDate: "—" },
          ...prev,
        ]);
      }
      setHighlightSlug(submitted);
      const timer = setTimeout(() => setHighlightSlug(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "draft") setActiveTab("draft");
  }, [searchParams]);

  useEffect(() => {
    if (!statusOpen) return;
    function handleClick(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [statusOpen]);

  useEffect(() => {
    if (rowMenuId === null) return;
    function handleClick(e: MouseEvent) {
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target as Node)) setRowMenuId(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [rowMenuId]);

  const filtered = campaignList.filter((c) => {
    if (activeTab === "draft") return c.status === "Draft";
    if (activeTab === "all" && c.status === "Draft") return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (dateStart) {
      const cStart = new Date(c.startDate);
      if (dateEnd) {
        if (cStart < dateStart || cStart > dateEnd) return false;
      } else {
        if (cStart < dateStart) return false;
      }
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDateApply = useCallback((start: Date | null, end: Date | null) => {
    setDateStart(start);
    setDateEnd(end);
    setCurrentPage(1);
  }, []);

  const visiblePages = Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1);

  function handleSelectAll() {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(pageData.map((c) => c.id)));
      setSelectAll(true);
    }
  }

  function handleSelectRow(id: number) {
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRows(next);
    setSelectAll(next.size === pageData.length);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Masthead */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-white px-12">
        <div className="flex items-center">
          <div className="flex items-center gap-0.5">
            <span className="text-lg font-semibold tracking-tight text-[#000033]">FSQ</span>
            <span className="font-mono text-lg font-medium text-[#000033]">/</span>
            <span className="font-mono text-lg font-medium text-[#000033]">attribution-lite</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-4 px-4">
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
              <CircleAlert className="size-4" />
            </button>
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
              <FileText className="size-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:bg-gray-50 ${userMenuOpen ? "ring-2 ring-[#212be9] ring-offset-2" : ""}`}
              >
                <UserCircle className="size-4" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-md border border-border bg-white shadow-lg">
                    <div className="border-b border-border p-3">
                      <p className="text-sm font-medium text-[#000033]">Sang Yeo</p>
                      <p className="text-sm text-[#8d8d8d]">syeo@foursquare.com</p>
                    </div>
                    <div className="p-1">
                      <p className="px-2 py-1.5 text-[11px] font-medium tracking-wide text-[#8d8d8d]">SETTINGS</p>
                      <div className="flex flex-col">
                        {["Profile", "Admin Dashboard", "Permission Groups", "Impersonate"].map((item) => (
                          item === "Permission Groups" || item === "Admin Dashboard" ? (
                            <Link
                              key={item}
                              href={item === "Permission Groups" ? "/attribution-lite/permission-groups" : "/attribution-lite/admin"}
                              className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              {item}
                            </Link>
                          ) : (
                            <button key={item} className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50">
                              {item}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border p-1">
                      <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50">
                        <LogOut className="size-4 text-[#555]" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center border-l border-border pl-4">
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
              <Grid3X3 className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-[1344px] px-12 py-8">
        {/* Welcome Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-[#171417]">
              Welcome back, Sang
            </h1>
            <p className="mt-4 text-sm leading-5 text-[#555]">
              Here&apos;s a list of your inflight and full list of campaigns.
            </p>
          </div>
          <button onClick={() => setNewCampaignOpen(true)} className="shrink-0 rounded-md bg-[#212be9] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4]">
            New Campaign
          </button>
        </div>

        {/* Tabs + Filter Bar */}
        <div className="flex flex-col gap-4">
          {/* Tabs Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center border-b border-border">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex h-9 items-center justify-center px-4 text-sm transition-colors ${
                  activeTab === "all"
                    ? "border-b-2 border-[#212be9] font-medium text-[#212be9]"
                    : "text-black hover:text-[#212be9]"
                }`}
              >
                All campaigns
              </button>
              <button
                onClick={() => setActiveTab("draft")}
                className={`flex h-9 items-center justify-center gap-1.5 px-4 text-sm transition-colors ${
                  activeTab === "draft"
                    ? "border-b-2 border-[#212be9] font-medium text-[#212be9]"
                    : "text-black hover:text-[#212be9]"
                }`}
              >
                Drafts
                {campaignList.filter((c) => c.status === "Draft").length > 0 && (
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#f1f5f9] text-[10px] font-semibold text-[#64748b]">
                    {campaignList.filter((c) => c.status === "Draft").length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search / Filter Row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-[602px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="h-9 w-full rounded-md border border-input bg-white pl-9 pr-3 text-sm leading-5 text-foreground placeholder:text-muted-foreground focus:border-[#212be9] focus:outline-none focus:ring-1 focus:ring-[#212be9]"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <DateRangePicker
              startDate={dateStart}
              endDate={dateEnd}
              onApply={handleDateApply}
              open={datePickerOpen}
              onToggle={() => setDatePickerOpen(!datePickerOpen)}
            />

            <div ref={statusRef} className="relative w-[200px]">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className={`flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 text-sm transition-colors ${statusOpen ? "border-[#212be9] ring-1 ring-[#212be9]" : "border-input"}`}
              >
                <span className={statusFilter === "all" ? "text-muted-foreground" : "text-foreground"}>
                  {statusFilter === "all" ? "Status" : STATUS_LABELS[statusFilter]}
                </span>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`} />
              </button>
              {statusOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-border bg-white py-1 shadow-md">
                  <button
                    onClick={() => { setStatusFilter("all"); setStatusOpen(false); setCurrentPage(1); }}
                    className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5ff] hover:text-[#212be9] ${statusFilter === "all" ? "bg-[#f5f5ff] font-medium text-[#212be9]" : "text-[#171417]"}`}
                  >
                    All statuses
                  </button>
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setStatusOpen(false); setCurrentPage(1); }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5ff] hover:text-[#212be9] ${statusFilter === s ? "bg-[#f5f5ff] font-medium text-[#212be9]" : "text-[#171417]"}`}
                    >
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pl-2">
              <button className="flex size-9 items-center justify-center rounded-lg border border-border bg-white hover:bg-gray-50">
                <Share2 className="size-4" />
              </button>
              <button className="flex size-9 items-center justify-center rounded-lg border border-border bg-white hover:bg-gray-50">
                <Download className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="mt-4">
          {/* Results Count */}
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-black">
              Showing <span className="font-semibold">{pageData.length}</span> of <span className="font-semibold">{filtered.length}</span> results
            </p>
          </div>

          {/* Table */}
          <div className="w-full">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-4 py-3 pr-0">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="size-4 rounded border-foreground accent-[#212be9]"
                    />
                  </th>
                  <th className="py-3 pl-4 pr-3 text-sm font-medium text-muted-foreground">
                    Campaign Name
                  </th>
                  <th className="px-3 py-3 text-sm font-medium text-muted-foreground">
                    Advertiser
                  </th>
                  <th className="px-3 py-3 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-3 py-3">
                    <button className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
                      Start date
                      <ChevronsUpDown className="size-3.5" />
                    </button>
                  </th>
                  <th className="px-3 py-3">
                    <button className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
                      End date
                      <ChevronsUpDown className="size-3.5" />
                    </button>
                  </th>
                  <th className="w-10 py-3" />
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
                          <Search className="size-5 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-[#171417]">
                          {activeTab === "draft" ? "No drafts yet" : "No campaigns found"}
                        </h3>
                        <p className="mt-1 max-w-[280px] text-sm text-muted-foreground">
                          {activeTab === "draft"
                            ? "Campaigns you save as drafts will appear here."
                            : "Try adjusting your search or filters to find what you\u2019re looking for."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : pageData.map((campaign) => (
                  <tr key={campaign.id} className={`border-b border-border last:border-0 transition-all duration-[2000ms] ${campaign.slug === highlightSlug ? "bg-[#eef0ff] shadow-[inset_3px_0_0_0_#212be9]" : "hover:bg-gray-50/50"}`}>
                    <td className="py-4 pr-0">
                        <input
                        type="checkbox"
                        checked={selectedRows.has(campaign.id)}
                        onChange={() => handleSelectRow(campaign.id)}
                        className="size-4 rounded border-foreground accent-[#212be9]"
                      />
                    </td>
                    <td className="py-4 pl-4 pr-3">
                      <Link
                        href={`/attribution-lite/${campaign.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <CampaignLogo logo={campaign.logo} color={campaign.logoColor} />
                        <span className="text-sm text-foreground group-hover:text-[#212be9] group-hover:underline transition-colors">{campaign.name}</span>
                        {campaign.slug === highlightSlug && (
                          <span className="ml-1.5 inline-flex items-center rounded bg-[#212be9] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">NEW</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-3 py-4 text-sm text-foreground">
                      {campaign.advertiser}
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-3 py-4 text-sm tabular-nums text-foreground">
                      {campaign.startDate}
                    </td>
                    <td className="px-3 py-4 text-sm tabular-nums text-foreground">
                      {campaign.endDate}
                    </td>
                    <td className="py-4 text-center">
                      <div className="relative" ref={rowMenuId === campaign.id ? rowMenuRef : undefined}>
                        <button
                          onClick={() => setRowMenuId(rowMenuId === campaign.id ? null : campaign.id)}
                          className={`inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground ${rowMenuId === campaign.id ? "bg-gray-100 text-foreground" : ""}`}
                        >
                          <MoreVertical className="size-4" />
                        </button>
                        {rowMenuId === campaign.id && (
                          <div className="absolute right-0 top-full z-50 mt-1 w-[160px] overflow-hidden rounded-md border border-border bg-white py-1 shadow-lg">
                            <button
                              onClick={() => { setRowMenuId(null); router.push("/attribution-lite/new"); }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#171417] transition-colors hover:bg-gray-50"
                            >
                              <Pencil className="size-3.5 text-[#555]" />
                              Edit
                            </button>
                            <button
                              onClick={() => { setRowMenuId(null); router.push(`/attribution-lite/pixel-setup/${campaign.slug}`); }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#171417] transition-colors hover:bg-gray-50"
                            >
                              <Zap className="size-3.5 text-[#555]" />
                              Setup Pixels
                            </button>
                            <button
                              onClick={() => { setRowMenuId(null); setDeleteTarget(campaign); }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#dc2626] transition-colors hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>
            {visiblePages.map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`inline-flex size-9 items-center justify-center rounded-md text-sm transition-colors ${
                  currentPage === p
                    ? "border border-border bg-white font-medium text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            {totalPages > 6 && (
            <span className="inline-flex size-9 items-center justify-center text-muted-foreground">
              <MoreHorizontal className="size-4" />
            </span>
            )}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
          )}
        </div>
      </main>

      {/* New Campaign Modal */}
      {newCampaignOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm" onClick={() => setNewCampaignOpen(false)}>
          <div className="mt-[10vh] w-full max-w-[800px] rounded-xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.5px] text-[#171417]">What would you like to do to get started?</h2>
                <p className="mt-2 text-sm leading-5 text-[#555]">
                  Use this step to search for an existing opportunity. You can either create a new campaign, add placements to a campaign or run an SPR.
                </p>
              </div>
              <button onClick={() => setNewCampaignOpen(false)} className="ml-4 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5">
              <button onClick={() => { setNewCampaignOpen(false); router.push("/attribution-lite/new"); }} className="group flex flex-col items-start gap-3 rounded-xl border border-border p-5 text-left transition-all hover:border-[#212be9] hover:shadow-md">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] transition-colors group-hover:bg-[#eff0fd]">
                  <Users className="size-5 text-[#171417] group-hover:text-[#212be9]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#171417]">Create Multiple Partners Campaign</p>
                  <p className="mt-1.5 text-xs leading-4 text-[#646464]">Set up a campaign with multiple media partners.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-[440px] rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="size-5 text-[#dc2626]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#171417]">Delete campaign</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555]">
                  Are you sure you want to delete <span className="font-medium text-[#171417]">{deleteTarget.name}</span>? This action cannot be undone and all associated data will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-[#171417] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCampaignList((prev) => prev.filter((c) => c.id !== deleteTarget.id));
                  setSelectedRows((prev) => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
                  setDeleteTarget(null);
                }}
                className="rounded-md bg-[#dc2626] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b91c1c]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

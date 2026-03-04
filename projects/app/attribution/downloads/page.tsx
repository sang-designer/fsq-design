"use client";

import {
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
  RefreshCw,
  CircleAlert,
  FileText,
  UserCircle,
  Grid3X3,
} from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";

type ReportStatus = "completed" | "in_progress" | "failed";

type HistoryReport = {
  name: string;
  requestedOn: string;
  status: ReportStatus;
  format: "PDF" | "XLSX";
};

const allReports: HistoryReport[] = [
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 20, 2025 - 2:15 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 20, 2025 - 2:15 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 20, 2025 - 1:42 PM", status: "completed", format: "XLSX" },
  { name: "AdTheorent Partner Report Q3", requestedOn: "Oct 19, 2025 - 4:30 PM", status: "completed", format: "PDF" },
  { name: "Pandora Partner Report Q3", requestedOn: "Oct 19, 2025 - 3:10 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Geo Analysis", requestedOn: "Oct 18, 2025 - 11:20 AM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 18, 2025 - 10:05 AM", status: "completed", format: "XLSX" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 17, 2025 - 5:45 PM", status: "completed", format: "PDF" },
  { name: "Nexxen Partner Report Q3", requestedOn: "Oct 17, 2025 - 2:30 PM", status: "failed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 17, 2025 - 1:15 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q2 Spring Campaign", requestedOn: "Oct 16, 2025 - 3:00 PM", status: "completed", format: "PDF" },
  { name: "TikTok Partner Report Q3", requestedOn: "Oct 16, 2025 - 11:45 AM", status: "completed", format: "XLSX" },
  { name: "McDonald's Q3 Demographics", requestedOn: "Oct 15, 2025 - 4:20 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 15, 2025 - 2:00 PM", status: "completed", format: "PDF" },
  { name: "Snap Partner Report Q3", requestedOn: "Oct 14, 2025 - 10:30 AM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Date Time Analysis", requestedOn: "Oct 14, 2025 - 9:15 AM", status: "completed", format: "XLSX" },
  { name: "Epsilon Partner Report Q3", requestedOn: "Oct 13, 2025 - 3:45 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 13, 2025 - 1:00 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Cohort Analysis", requestedOn: "Oct 12, 2025 - 5:30 PM", status: "completed", format: "PDF" },
  { name: "Zeta Partner Report Q3", requestedOn: "Oct 12, 2025 - 2:15 PM", status: "completed", format: "XLSX" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 11, 2025 - 4:00 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 11, 2025 - 11:30 AM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Partner Compare", requestedOn: "Oct 10, 2025 - 3:15 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 10, 2025 - 10:00 AM", status: "completed", format: "XLSX" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 9, 2025 - 4:45 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 9, 2025 - 2:30 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 8, 2025 - 1:00 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Optimization", requestedOn: "Oct 8, 2025 - 10:45 AM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 7, 2025 - 5:15 PM", status: "completed", format: "XLSX" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 7, 2025 - 3:00 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 6, 2025 - 4:30 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 6, 2025 - 1:15 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 5, 2025 - 11:00 AM", status: "completed", format: "XLSX" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 5, 2025 - 9:45 AM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 4, 2025 - 3:30 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 4, 2025 - 12:00 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 3, 2025 - 5:00 PM", status: "completed", format: "XLSX" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 3, 2025 - 2:45 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 2, 2025 - 4:15 PM", status: "completed", format: "PDF" },
  { name: "McDonald's Q3 Fall Campaign", requestedOn: "Oct 2, 2025 - 1:00 PM", status: "completed", format: "PDF" },
];

const PAGE_SIZE = 10;

const statusBadge: Record<ReportStatus, { label: string; cls: string }> = {
  completed: { label: "Completed", cls: "bg-[#dcfce7] text-[#16a34a]" },
  in_progress: { label: "In Progress", cls: "bg-[#dbeafe] text-[#2563eb]" },
  failed: { label: "Failed", cls: "bg-[#fee2e2] text-[#dc2626]" },
};

type TabKey = "all" | "in_progress" | "completed" | "failed";

export default function DownloadHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const counts = {
    all: allReports.length,
    in_progress: allReports.filter((r) => r.status === "in_progress").length,
    completed: allReports.filter((r) => r.status === "completed").length,
    failed: allReports.filter((r) => r.status === "failed").length,
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All requested reports", count: counts.all },
    { key: "in_progress", label: "In Progress", count: counts.in_progress },
    { key: "completed", label: "Completed", count: counts.completed },
    { key: "failed", label: "Failed", count: counts.failed },
  ];

  const filtered = activeTab === "all" ? allReports : allReports.filter((r) => r.status === activeTab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const switchTab = useCallback((key: TabKey) => {
    setActiveTab(key);
    setPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  }, []);

  const pageNumbers = (() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  })();

  return (
    <div className="flex h-screen flex-col bg-white font-sans">
      {/* Masthead */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-12">
        <div className="flex items-center gap-0.5">
          <Link href="/attribution" className="text-lg font-semibold tracking-tight text-[#000033]">FSQ</Link>
          <span className="font-mono text-lg font-medium text-[#000033]">/</span>
          <span className="font-mono text-lg font-medium text-[#000033]">attribution</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-4 px-4">
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:scale-110 hover:bg-gray-50"><CircleAlert className="size-4" /></button>
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:scale-110 hover:bg-gray-50"><FileText className="size-4" /></button>
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:scale-110 hover:bg-gray-50"><UserCircle className="size-4" /></button>
          </div>
          <div className="flex items-center border-l border-border pl-4">
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:scale-110 hover:bg-gray-50"><Grid3X3 className="size-4" /></button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1200px] px-10 py-10">
          {/* Title */}
          <h1 className="text-3xl font-semibold tracking-tight text-[#171417]">Download History</h1>
          <p className="mt-2 text-base text-[#555]">Monitor and manage your generated reports in one place.</p>

          {/* Tabs */}
          <div className="mt-8 flex items-center border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                className={`px-4 pb-3 text-sm transition-all duration-200 ${activeTab === tab.key ? "border-b-2 border-[#171417] font-medium text-[#171417]" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Results count + Refresh */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-[#555]">
              Showing <strong className="text-[#171417]">{pageData.length}</strong> of <strong className="text-[#171417]">{filtered.length}</strong> results
            </span>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#212be9] transition-colors hover:text-[#1a22c4]"
            >
              Refresh <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center py-20 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
                <FileText className="size-5 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#171417]">
                {activeTab === "in_progress"
                  ? "No reports in progress"
                  : activeTab === "failed"
                    ? "No failed reports"
                    : "No reports yet"}
              </h3>
              <p className="mt-1 max-w-[280px] text-sm text-muted-foreground">
                {activeTab === "in_progress"
                  ? "Reports currently being generated will appear here. Generate a new report to get started."
                  : activeTab === "failed"
                    ? "All your reports have been generated successfully. Failed reports will appear here if any issues occur."
                    : "Your generated reports will appear here. Click \u2018Generate Report\u2019 to get started."}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4">
                {/* Table header */}
                <div className="grid grid-cols-[2fr_1.5fr_1fr_0.8fr_1fr] items-center border-b border-border px-4 py-2.5">
                  <span className="text-xs font-medium text-muted-foreground">Report name</span>
                  <span className="text-xs font-medium text-muted-foreground">Request on</span>
                  <span className="text-xs font-medium text-muted-foreground">Status</span>
                  <span className="text-xs font-medium text-muted-foreground">Format</span>
                  <span className="text-xs font-medium text-muted-foreground">Actions</span>
                </div>

                {/* Table rows */}
                {pageData.map((report, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[2fr_1.5fr_1fr_0.8fr_1fr] items-center border-b border-border px-4 py-3 transition-colors hover:bg-gray-50/50"
                  >
                    <span className="truncate text-sm text-[#171417]">{report.name}</span>
                    <span className="text-sm text-[#171417]">{report.requestedOn}</span>
                    <span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge[report.status].cls}`}>
                        {statusBadge[report.status].label}
                      </span>
                    </span>
                    <span className="text-sm text-[#171417]">{report.format}</span>
                    <span>
                      {report.status === "failed" ? (
                        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm text-[#171417] transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-95">
                          Regenerate Report <RefreshCw className="size-3.5" />
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm text-[#171417] transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-95">
                          Download <ArrowDownToLine className="size-3.5" />
                        </button>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-gray-50 hover:text-foreground disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" /> Previous
                </button>
                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-sm text-muted-foreground">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`flex size-8 items-center justify-center rounded-md text-sm transition-all duration-150 ${page === p ? "border border-border bg-white font-medium text-[#171417] shadow-sm" : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"}`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-gray-50 hover:text-foreground disabled:opacity-40"
                >
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

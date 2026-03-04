"use client";

import { Search, ChevronLeft, ChevronRight, MoreVertical, Grid3X3, CircleAlert, FileText, UserCircle, X, LogOut, Download, Pencil } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

type AdminTab = "partners" | "advertisers" | "jobs";
type StatusFilter = "" | "active" | "archived" | "pending";

const STATUS_STYLES: Record<string, string> = {
  active: "text-[#0f766e] bg-[#ccfbf1]",
  archived: "text-[#6b7280] bg-[#f3f4f6]",
  pending: "text-[#b45309] bg-[#fef3c7]",
};

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[s] ?? "text-[#3f5bf6] bg-[#eef2ff]"}`}>
      {status}
    </span>
  );
}

function RowMenu({ items, onAction }: { items: string[]; onAction: (a: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div ref={ref} className="relative flex justify-end">
      <button onClick={() => setOpen(!open)} className="px-1.5 py-1 text-[#4f46e5]"><MoreVertical className="size-4" /></button>
      {open && (
        <div className="absolute right-0 top-7 z-10 min-w-[140px] rounded-lg border border-border bg-white shadow-lg">
          {items.map((item) => (
            <button key={item} onClick={() => { onAction(item.toLowerCase()); setOpen(false); }} className="block w-full px-3.5 py-2.5 text-left text-[13px] text-[#1f2937] hover:bg-gray-50">
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EditableCell({ value: init, className = "" }: { value: string; className?: string }) {
  const [value, setValue] = useState(init);
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
  const save = () => { setEditing(false); };
  const display = value || "-";
  return (
    <div className={`flex items-center gap-2 ${className}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); }}>
      {!hovered && !editing ? (
        <span className={!value ? "text-[#6b7280] font-medium" : ""}>{display}</span>
      ) : (
        <div className="flex items-center gap-1.5">
          <input ref={inputRef} value={value === "-" ? "" : value} disabled={!editing} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") save(); }} onBlur={save} className="w-[140px] rounded-md border border-border px-2 py-1 text-xs h-[32px]" />
          {!editing && <button onClick={() => setEditing(true)} className="rounded-md border border-border bg-white px-2 h-[32px] text-xs text-[#4b5563] hover:bg-gray-50"><Pencil className="size-3" /></button>}
        </div>
      )}
    </div>
  );
}

const partnersData = [
  { name: "(DO NOT USE)\nEvansHardy+Young", display: "(DO NOT USE)\nEvansHardy+Young", channel: "ADHOC", media: "UNSPECIFIED", defaultMedia: "UNSPECIFIED", contact: "jpoe", status: "ACTIVE" },
  { name: "truemedia", display: "(DO NOT USE)\nTrue Media", channel: "ADHOC", media: "UNSPECIFIED", defaultMedia: "UNSPECIFIED", contact: "", status: "ARCHIVED" },
  { name: "mobiletheory_old", display: "Opera Media", channel: "FTP", media: "DIGITAL", defaultMedia: "DISPLAY", contact: "Andrea", status: "PENDING" },
  { name: "120sports", display: "120 Sports", channel: "ADHOC", media: "UNSPECIFIED", defaultMedia: "UNSPECIFIED", contact: "Ori Konstantin", status: "ACTIVE" },
  { name: "140proof", display: "140 Proof", channel: "ADHOC", media: "UNSPECIFIED", defaultMedia: "UNSPECIFIED", contact: "", status: "ARCHIVED" },
  { name: "20thcenturyfox", display: "20th Century Studios", channel: "ADHOC", media: "UNSPECIFIED", defaultMedia: "UNSPECIFIED", contact: "Jay Birko", status: "PENDING" },
  { name: "adcolony", display: "AdColony", channel: "FTP", media: "DIGITAL", defaultMedia: "VIDEO", contact: "Sam Rivera", status: "ACTIVE" },
  { name: "adelphic", display: "Adelphic", channel: "API", media: "DIGITAL", defaultMedia: "DISPLAY", contact: "Tina Chen", status: "ACTIVE" },
  { name: "amazon_ads", display: "Amazon Advertising", channel: "S3", media: "DIGITAL", defaultMedia: "DISPLAY", contact: "Marcus Webb", status: "PENDING" },
  { name: "basis_technologies", display: "Basis Technologies", channel: "ADHOC", media: "UNSPECIFIED", defaultMedia: "UNSPECIFIED", contact: "", status: "ARCHIVED" },
];

const advertisersData = [
  { name: "Acana", id: "0008a384-3b4f-4f5c-8964-cd96cc9ef140", placeId: "", chainId: "" },
  { name: "DraftKings", id: "000e746c-a031-436c-9e25-695a852fcbe1", placeId: "", chainId: "" },
  { name: "Floor and Decor", id: "00403a95-c355-49ed-b4ff-32f218f9caaa", placeId: "", chainId: "" },
  { name: "Chipotle", id: "012f8b7a-6e3d-4a19-b847-3c91df24e0a5", placeId: "4b12c5ef", chainId: "891" },
  { name: "Target", id: "01a44d29-85fc-4e0b-9d32-f17bc6a830e1", placeId: "5c23d6f0", chainId: "1042" },
  { name: "Walgreens", id: "023bfe81-7a4c-41d9-ae53-8b02e7f19dc4", placeId: "", chainId: "567" },
  { name: "Home Depot", id: "034ca972-8b5d-42ea-bf64-9c13f8a20ed5", placeId: "6d34e7a1", chainId: "" },
  { name: "Planet Fitness", id: "045db063-9c6e-43fb-c075-0d24a9b31fe6", placeId: "", chainId: "" },
  { name: "Kroger", id: "056ec154-0d7f-540c-d186-1e35b0c42af7", placeId: "7e45f8b2", chainId: "2103" },
  { name: "Taco Bell", id: "067fd245-1e80-6510-e297-2f46c1d53ba8", placeId: "", chainId: "445" },
];

const setupLines = ["Days Before: 30 | Days After: 30", "Conversion Window: 30 days", "Cluster Tagging: Enabled", "Baseline Sample Size: 100,000", "Target Match: Dealership name contains [INSERT_DEALERSHIP_NAME]", "Action: Apply cluster tag to matching location ID"];

const setupLinesAlt = ["Days Before: 14 | Days After: 14", "Conversion Window: 14 days", "Cluster Tagging: Disabled", "Baseline Sample Size: 50,000", "Target Match: Store name equals [INSERT_STORE_NAME]", "Action: Apply conversion tag to matching location ID"];

const initJobs = [
  { id: 1, name: "14 Day Conversion Window (Default)", details: setupLines },
  { id: 2, name: "14 Day Large Baseline Default", details: setupLines },
  { id: 3, name: "7 Day Quick Attribution", details: setupLinesAlt },
  { id: 4, name: "30 Day Extended Window", details: setupLines },
  { id: 5, name: "Lift Measurement Standard", details: setupLinesAlt },
  { id: 6, name: "QSR Campaign Default", details: setupLines },
  { id: 7, name: "Retail Foot Traffic Baseline", details: setupLinesAlt },
  { id: 8, name: "Auto Dealership Attribution", details: setupLines },
  { id: 9, name: "Grocery Chain Standard", details: setupLinesAlt },
  { id: 10, name: "National Campaign Large Baseline", details: setupLines },
];

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("partners");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [jobs, setJobs] = useState(initJobs);
  const [editModal, setEditModal] = useState<{ name: string; sql: string } | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addType, setAddType] = useState("Attribution");
  const [addSql, setAddSql] = useState("");
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("Attribution");
  const [editSql, setEditSql] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [hiddenJobs, setHiddenJobs] = useState<Set<number>>(new Set());

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  }, []);

  const resetFilters = () => { setSearch(""); setStatusFilter(""); setAlertVisible(false); setSearchError(false); };
  const switchTab = (t: AdminTab) => { setTab(t); resetFilters(); };

  const searchEnabled = search.trim().length > 0;

  const doSearch = () => {
    if (!searchEnabled) { setAlertVisible(true); return; }
    setAlertVisible(false);
    setSearchError(search.toLowerCase().includes("error"));
  };

  const clearSearch = () => { setSearch(""); setAlertVisible(false); setSearchError(false); };

  const filterRows = <T extends Record<string, unknown>>(rows: T[], statusKey = "status") => {
    if (searchError) return [];
    return rows.filter((r) => {
      const text = Object.values(r).join(" ").toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;
      if (statusFilter && (r[statusKey] as string).toLowerCase() !== statusFilter) return false;
      return true;
    });
  };

  const openEditModal = (job: typeof initJobs[0]) => {
    setEditName(job.name);
    setEditSql(job.details.map((l) => `-- ${l}`).join("\n"));
    setEditType("Attribution");
    setEditModal({ name: job.name, sql: "" });
  };

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "partners", label: "Partners" },
    { key: "advertisers", label: "Advertisers" },
    { key: "jobs", label: "Job Settings" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header userMenuOpen={userMenuOpen} setUserMenuOpen={setUserMenuOpen} />

      <main className="px-12 py-7">
        <h1 className="mb-3 text-[28px] font-semibold text-[#1f2430]">Admin Dashboard</h1>

        <nav className="flex gap-5 border-b border-[#eef0f4] pb-3">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => switchTab(t.key)} className={`relative pb-2.5 text-sm ${tab === t.key ? "font-semibold text-[#3f5bf6]" : "text-[#6b7280]"}`}>
              {t.label}
              {tab === t.key && <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#3f5bf6]" />}
            </button>
          ))}
        </nav>

        {/* Filters */}
        {tab !== "jobs" && tab !== "advertisers" && (
          <div className="mt-5 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5">
              <input value={search} onChange={(e) => { setSearch(e.target.value); if (!e.target.value) clearSearch(); }} onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }} placeholder="Search" className="flex-1 border-none text-sm text-[#1f2937] outline-none placeholder:text-[#9ca3af]" />
              {search && <button onClick={clearSearch} className="text-[#6b7280]"><X className="size-3.5" /></button>}
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setAlertVisible(false); }} className="min-w-[160px] appearance-none rounded-lg border border-border bg-white px-3 py-2.5 pr-8 text-sm text-[#6b7280]">
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="pending">Pending</option>
            </select>
            <button onClick={doSearch} className={`min-w-[120px] rounded-lg px-4 py-2.5 text-sm font-medium ${searchEnabled ? "bg-[#2d46f6] text-white" : "bg-[#c7d2fe] text-white cursor-not-allowed"}`}>Search</button>
          </div>
        )}

        {tab === "advertisers" && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5">
                <input value={search} onChange={(e) => { setSearch(e.target.value); if (!e.target.value) clearSearch(); }} onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }} placeholder="Search" className="flex-1 border-none text-sm text-[#1f2937] outline-none placeholder:text-[#9ca3af]" />
                {search && <button onClick={clearSearch} className="text-[#6b7280]"><X className="size-3.5" /></button>}
              </div>
              <button onClick={doSearch} className={`min-w-[120px] rounded-lg px-4 py-2.5 text-sm font-medium ${searchEnabled ? "bg-[#2d46f6] text-white" : "bg-[#c7d2fe] text-white cursor-not-allowed"}`}>Search</button>
            </div>
            <button className="rounded-lg border border-[#c7d2fe] px-4 py-2.5 text-sm font-medium text-[#2d46f6]">Download CSV</button>
          </div>
        )}

        {tab === "jobs" && (
          <div className="mt-5 flex items-center justify-between">
            <div />
            <button onClick={() => { setAddName(""); setAddType("Attribution"); setAddSql(""); setAddModal(true); }} className="rounded-lg bg-[#2d46f6] px-4 py-2.5 text-sm font-medium text-white">+ New Attribution Setting</button>
          </div>
        )}

        {alertVisible && <div className="mt-3 rounded-lg border border-[#c7d2fe] bg-[#eef2ff] px-3.5 py-2.5 text-[13px] text-[#3730a3]">Enter the search criteria.</div>}

        {/* Tables */}
        {tab === "partners" && <PartnersTable rows={filterRows(partnersData)} error={searchError} />}
        {tab === "advertisers" && <AdvertisersTable rows={filterRows(advertisersData, "name")} error={searchError} search={search} />}
        {tab === "jobs" && <JobsTable jobs={jobs.filter((j) => !hiddenJobs.has(j.id))} onEdit={openEditModal} onArchive={(j) => { setHiddenJobs((s) => new Set(s).add(j.id)); showToast("Archived successfully."); }} />}

        <Pagination />
      </main>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-6" onClick={() => setEditModal(null)}>
          <div className="w-[520px] rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Edit Job Settings</h2><button onClick={() => setEditModal(null)} className="text-[#6b7280]"><X className="size-5" /></button></div>
            <div className="grid gap-3.5">
              <label className="grid gap-1.5 text-[13px] text-[#6b7280]"><span>Name</span><input value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-lg border border-border px-3 py-2.5 text-sm text-[#111827]" /></label>
              <label className="grid gap-1.5 text-[13px] text-[#6b7280]"><span>Campaign type</span><select value={editType} onChange={(e) => setEditType(e.target.value)} className="rounded-lg border border-border px-3 py-2.5 text-sm text-[#111827]"><option>Attribution</option><option>Lift</option><option>Benchmark</option></select></label>
              <label className="grid gap-1.5 text-[13px] text-[#6b7280]"><span>Job setup SQL</span><textarea rows={5} value={editSql} onChange={(e) => setEditSql(e.target.value)} className="rounded-lg border border-border px-3 py-2.5 text-sm text-[#111827] font-mono" /></label>
            </div>
            <div className="mt-4 flex justify-end gap-2.5"><button onClick={() => setEditModal(null)} className="rounded-lg border border-[#c7d2fe] px-4 py-2.5 text-sm font-medium text-[#2d46f6]">Cancel</button><button onClick={() => setEditModal(null)} className="rounded-lg bg-[#2d46f6] px-4 py-2.5 text-sm font-medium text-white">Update</button></div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-6" onClick={() => setAddModal(false)}>
          <div className="w-[520px] rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Add Job Setting</h2><button onClick={() => setAddModal(false)} className="text-[#6b7280]"><X className="size-5" /></button></div>
            <div className="grid gap-3.5">
              <label className="grid gap-1.5 text-[13px] text-[#6b7280]"><span>Name</span><input value={addName} onChange={(e) => setAddName(e.target.value)} className="rounded-lg border border-border px-3 py-2.5 text-sm text-[#111827]" /></label>
              <label className="grid gap-1.5 text-[13px] text-[#6b7280]"><span>Campaign type</span><select value={addType} onChange={(e) => setAddType(e.target.value)} className="rounded-lg border border-border px-3 py-2.5 text-sm text-[#111827]"><option>Attribution</option><option>Lift</option><option>Benchmark</option></select></label>
              <label className="grid gap-1.5 text-[13px] text-[#6b7280]"><span>Job setup SQL</span><textarea rows={5} value={addSql} onChange={(e) => setAddSql(e.target.value)} className="rounded-lg border border-border px-3 py-2.5 text-sm text-[#111827] font-mono" /></label>
            </div>
            <div className="mt-4 flex justify-end gap-2.5">
              <button onClick={() => setAddModal(false)} className="rounded-lg border border-[#c7d2fe] px-4 py-2.5 text-sm font-medium text-[#2d46f6]">Cancel</button>
              <button onClick={() => { const lines = addSql.split("\n").map((l) => l.replace(/^\s*--\s*/, "").trim()).filter(Boolean); setJobs((prev) => [{ id: Date.now(), name: addName || "New job", details: lines.length ? lines : [] }, ...prev]); setAddModal(false); showToast("Job setting added."); }} className="rounded-lg bg-[#2d46f6] px-4 py-2.5 text-sm font-medium text-white">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-30 rounded-lg bg-[#111827] px-4 py-3 text-[13px] text-white shadow-lg transition-all duration-200 ${toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none"}`}>{toast}</div>
    </div>
  );
}

function Header({ userMenuOpen, setUserMenuOpen }: { userMenuOpen: boolean; setUserMenuOpen: (v: boolean) => void }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-12">
      <Link href="/attribution" className="flex items-center gap-0.5 no-underline">
        <span className="text-lg font-semibold tracking-tight text-[#000033]">FSQ</span>
        <span className="font-mono text-lg font-medium text-[#000033]">/</span>
        <span className="font-mono text-lg font-medium text-[#000033]">attribution</span>
      </Link>
      <div className="flex items-center">
        <div className="flex items-center gap-4 px-4">
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50"><CircleAlert className="size-4" /></button>
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50"><FileText className="size-4" /></button>
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={`flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50 ${userMenuOpen ? "ring-2 ring-[#212be9] ring-offset-2" : ""}`}><UserCircle className="size-4" /></button>
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
                      {["Profile", "Admin Dashboard", "Permission Groups", "Impersonate"].map((item) =>
                        item === "Permission Groups" || item === "Admin Dashboard" ? (
                          <Link key={item} href={item === "Permission Groups" ? "/attribution/permission-groups" : "/attribution/admin"} className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>{item}</Link>
                        ) : (
                          <button key={item} className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50">{item}</button>
                        )
                      )}
                    </div>
                  </div>
                  <div className="border-t border-border p-1">
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50"><LogOut className="size-4 text-[#555]" />Logout</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center border-l border-border pl-4">
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50"><Grid3X3 className="size-4" /></button>
        </div>
      </div>
    </header>
  );
}

function PartnersTable({ rows, error }: { rows: typeof partnersData; error: boolean }) {
  const gridCls = "grid gap-3 px-4 py-3 text-[13px]" + " " + "[grid-template-columns:240px_1.2fr_0.9fr_1fr_1.2fr_0.9fr_1fr]";
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-[#eef0f4]">
      <div className={`${gridCls} bg-[#f9fafb] font-semibold text-[#6b7280]`}>
        <div>Partner name</div><div>Display name</div><div>Channel</div><div>Media Type</div><div>Default media channel</div><div>Contact</div><div>Status</div>
      </div>
      {error ? (
        <div className="border-t border-[#eef0f4] px-4 py-4 text-[13px] text-red-700">Something went wrong. Try again.</div>
      ) : rows.length === 0 ? (
        <div className="border-t border-[#eef0f4] px-4 py-4 text-[13px] text-[#6b7280]">No results found.</div>
      ) : (
        rows.map((r, i) => (
          <div key={i} className={`${gridCls} min-h-[68px] items-center border-t border-[#eef0f4] bg-white`}>
            <EditableCell value={r.name.split("\n")[r.name.includes("\n") ? 1 : 0]} className={r.name.includes("\n") ? "" : ""} />
            <EditableCell value={r.display.split("\n")[r.display.includes("\n") ? 1 : 0]} />
            <EditableCell value={r.channel} />
            <div className={r.media === "UNSPECIFIED" ? "text-[#6b7280] font-medium" : ""}>{r.media}</div>
            <div className={r.defaultMedia === "UNSPECIFIED" ? "text-[#6b7280] font-medium" : ""}>{r.defaultMedia}</div>
            <EditableCell value={r.contact} />
            <div className="flex items-center justify-between">
              <StatusPill status={r.status} />
              <RowMenu items={["Show", "Edit"]} onAction={() => {}} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AdvertisersTable({ rows, error, search }: { rows: typeof advertisersData; error: boolean; search: string }) {
  const gridCls = "grid gap-3 px-4 py-3 text-[13px]" + " " + "[grid-template-columns:1.1fr_2fr_0.7fr_0.7fr_0.3fr_0.3fr]";
  const filtered = search ? rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase())) : rows;
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-[#eef0f4]">
      <div className={`${gridCls} bg-[#f9fafb] font-semibold text-[#6b7280]`}>
        <div>Campaign name</div><div>ID</div><div>Place Id</div><div>Chain Id</div><div>TV</div><div></div>
      </div>
      {error ? (
        <div className="border-t border-[#eef0f4] px-4 py-4 text-[13px] text-red-700">Something went wrong. Try again.</div>
      ) : filtered.length === 0 ? (
        <div className="border-t border-[#eef0f4] px-4 py-4 text-[13px] text-[#6b7280]">No results found.</div>
      ) : (
        filtered.map((r, i) => (
          <div key={i} className={`${gridCls} items-center border-t border-[#eef0f4] bg-white`}>
            <EditableCell value={r.name} />
            <EditableCell value={r.id} className="text-[#6b7280]" />
            <EditableCell value={r.placeId} />
            <EditableCell value={r.chainId} />
            <div />
            <RowMenu items={["Show", "Edit", "Archive"]} onAction={() => {}} />
          </div>
        ))
      )}
    </div>
  );
}

function JobsTable({ jobs, onEdit, onArchive }: { jobs: typeof initJobs; onEdit: (j: typeof initJobs[0]) => void; onArchive: (j: typeof initJobs[0]) => void }) {
  const gridCls = "grid gap-3 px-4 py-3 text-[13px]" + " " + "[grid-template-columns:1.1fr_2.4fr_0.2fr]";
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-[#eef0f4]">
      <div className={`${gridCls} bg-[#f9fafb] font-semibold text-[#6b7280]`}>
        <div>Name</div><div>Setup details</div><div></div>
      </div>
      {jobs.map((j) => (
        <div key={j.id} className={`${gridCls} items-start border-t border-[#eef0f4] bg-white`}>
          <div>{j.name}</div>
          <div className="text-xs leading-relaxed text-[#6b7280]">{j.details.map((l, i) => <div key={i}>{l}</div>)}</div>
          <RowMenu items={["Edit", "Archive"]} onAction={(a) => { if (a === "edit") onEdit(j); if (a === "archive") onArchive(j); }} />
        </div>
      ))}
    </div>
  );
}

function Pagination() {
  return (
    <div className="mt-5 flex items-center justify-end gap-2 text-[13px] text-[#6b7280]">
      <button className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-[#9ca3af]">‹ Previous</button>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <button key={n} className={`rounded-lg border px-2.5 py-1.5 ${n === 1 ? "border-[#3f5bf6] font-semibold text-[#3f5bf6]" : "border-border bg-white"}`}>{n}</button>
      ))}
      <span className="px-1">…</span>
      <button className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-[#9ca3af]">Next ›</button>
    </div>
  );
}

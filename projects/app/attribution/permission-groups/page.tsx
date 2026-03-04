"use client";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Grid3X3,
  CircleAlert,
  FileText,
  UserCircle,
  LogOut,
  Download,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const defaultGroups = [
  { name: "&Barr - Space Coast", members: 2, created: "08/04/2025" },
  { name: "1060 Advisors", members: 2, created: "08/04/2025" },
  { name: "2045 Collective", members: 2, created: "08/04/2025" },
  { name: "2045 Collective - Global Pet Foods", members: 2, created: "08/04/2025" },
  { name: "22squared - Baskin Robbins", members: 2, created: "08/04/2025" },
  { name: "22squared - GreenWise", members: 2, created: "08/04/2025" },
  { name: "22squared - Publix", members: 2, created: "08/04/2025" },
  { name: "22squared - SET", members: 2, created: "08/04/2025" },
  { name: "247.AI Users", members: 2, created: "08/04/2025" },
  { name: "360i - Diageo", members: 3, created: "07/22/2025" },
  { name: "360i - Mondelez", members: 2, created: "07/22/2025" },
  { name: "360i - Oscar Mayer", members: 4, created: "07/22/2025" },
  { name: "Accenture Song - AB InBev", members: 5, created: "07/15/2025" },
  { name: "Accenture Song - Marriott", members: 3, created: "07/15/2025" },
  { name: "Accenture Song - Starbucks", members: 2, created: "07/15/2025" },
  { name: "AdColony - GameStop", members: 2, created: "07/10/2025" },
  { name: "AdColony - Taco Bell", members: 3, created: "07/10/2025" },
  { name: "AdTheorent - Chick-fil-A", members: 2, created: "07/01/2025" },
  { name: "AdTheorent - Wendy's", members: 4, created: "07/01/2025" },
  { name: "Amobee - CVS Health", members: 2, created: "06/28/2025" },
  { name: "Amobee - Target", members: 3, created: "06/28/2025" },
  { name: "Assembly - General Motors", members: 5, created: "06/20/2025" },
  { name: "Assembly - Honda", members: 2, created: "06/20/2025" },
  { name: "Assembly - Toyota", members: 3, created: "06/20/2025" },
  { name: "Basis Technologies - Kroger", members: 2, created: "06/15/2025" },
  { name: "Basis Technologies - Safeway", members: 2, created: "06/15/2025" },
  { name: "Bounteous - Domino's", members: 4, created: "06/10/2025" },
  { name: "Bounteous - Papa John's", members: 2, created: "06/10/2025" },
  { name: "Camelot SMG - Walmart", members: 6, created: "06/01/2025" },
  { name: "Camelot SMG - Sam's Club", members: 3, created: "06/01/2025" },
  { name: "Carat - P&G", members: 4, created: "05/28/2025" },
  { name: "Carat - Philips", members: 2, created: "05/28/2025" },
  { name: "Carmichael Lynch - Subaru", members: 3, created: "05/20/2025" },
  { name: "Crossmedia - FanDuel", members: 2, created: "05/15/2025" },
  { name: "Crossmedia - DraftKings", members: 2, created: "05/15/2025" },
  { name: "Dentsu - Microsoft", members: 5, created: "05/10/2025" },
  { name: "Dentsu - Samsung", members: 4, created: "05/10/2025" },
  { name: "Digitas - American Express", members: 3, created: "05/01/2025" },
  { name: "Digitas - Whirlpool", members: 2, created: "05/01/2025" },
  { name: "EssenceMediacom - Google", members: 5, created: "04/28/2025" },
  { name: "EssenceMediacom - NBCUniversal", members: 3, created: "04/28/2025" },
  { name: "GroupM - Unilever", members: 4, created: "04/20/2025" },
  { name: "GroupM - L'Oréal", members: 3, created: "04/20/2025" },
  { name: "Havas - Puma", members: 2, created: "04/15/2025" },
  { name: "Havas - Hyundai", members: 3, created: "04/15/2025" },
  { name: "Hearts & Science - AT&T", members: 4, created: "04/10/2025" },
  { name: "Hearts & Science - Yum! Brands", members: 2, created: "04/10/2025" },
  { name: "Horizon Media - GEICO", members: 3, created: "04/01/2025" },
  { name: "Horizon Media - Capital One", members: 2, created: "04/01/2025" },
  { name: "IPG Mediabrands - Johnson & Johnson", members: 5, created: "03/25/2025" },
  { name: "IPG Mediabrands - Amazon", members: 4, created: "03/25/2025" },
  { name: "Kepler Group - Reckitt", members: 2, created: "03/20/2025" },
  { name: "Kepler Group - Bayer", members: 3, created: "03/20/2025" },
  { name: "Known - DoorDash", members: 2, created: "03/15/2025" },
];

type Group = { name: string; members: number; created: string };

const STORAGE_KEY = "pm-tools-created-groups";

function loadCreatedGroups(): Group[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCreatedGroups(groups: Group[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

const ROWS_PER_PAGE = 10;

export default function PermissionGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const groupNameRef = useRef<HTMLInputElement>(null);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const created = loadCreatedGroups();
    if (created.length > 0) {
      setGroups([...created, ...defaultGroups]);
    }
  }, []);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "f") {
      e.preventDefault();
      searchRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  const paginationRange = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="flex h-14 items-center justify-between border-b border-border bg-white px-12">
        <Link href="/attribution" className="flex items-center gap-0.5">
          <span className="text-lg font-semibold tracking-tight text-[#000033]">FSQ</span>
          <span className="font-mono text-lg font-medium text-[#000033]">/</span>
          <span className="font-mono text-lg font-medium text-[#000033]">attribution</span>
        </Link>
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
                          <Link
                            key={item}
                            href={item === "Permission Groups" ? "/attribution/permission-groups" : item === "Admin Dashboard" ? "/attribution/admin" : "#"}
                            className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {item}
                          </Link>
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

      <main className="mx-auto max-w-[1344px] px-12 py-8">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-[#171417]">
            Permission Groups
          </h1>
          <button
            onClick={() => { setCreateModalOpen(true); setNewGroupName(""); setNewGroupMembers(""); setTimeout(() => groupNameRef.current?.focus(), 100); }}
            className="rounded-md bg-[#212be9] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4]"
          >
            Create Group
          </button>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center gap-2">
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8d8d8d]" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-white pl-10 pr-14 text-sm text-[#171417] placeholder:text-[#8d8d8d] outline-none transition-colors focus:border-[#212be9] focus:ring-2 focus:ring-[#212be9]/20"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <kbd className="flex h-5 min-w-[20px] items-center justify-center rounded bg-[#f5f5f5] px-1 text-xs font-medium text-[#737373]">⌘</kbd>
              <kbd className="flex h-5 min-w-[20px] items-center justify-center rounded bg-[#f5f5f5] px-1 text-xs font-medium text-[#737373]">F</kbd>
            </div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-md border border-border text-[#555] transition-colors hover:bg-gray-50">
            <Search className="size-4" />
          </button>
        </div>

        {/* Table */}
        <div className="mt-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 text-xs font-medium text-[#555]">Group name</th>
                <th className="px-4 py-3 text-xs font-medium text-[#555]">Member count</th>
                <th className="px-4 py-3 text-xs font-medium text-[#555]">Created date</th>
                <th className="w-10 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageData.map((g) => (
                <tr key={g.name} className="border-b border-border transition-colors hover:bg-gray-50/50">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/attribution/permission-groups/${encodeURIComponent(g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))}?name=${encodeURIComponent(g.name)}&count=${g.members}&created=${encodeURIComponent(g.created)}`}
                      className="text-sm text-[#171417] underline decoration-transparent transition-colors hover:decoration-[#171417]"
                    >
                      {g.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-[#171417]">{g.members}</td>
                  <td className="px-4 py-3 text-[#171417]">{g.created}</td>
                  <td className="py-3">
                    <div className="relative">
                      <button
                        onClick={() => setRowMenuOpen(rowMenuOpen === g.name ? null : g.name)}
                        className="flex size-8 items-center justify-center rounded-md text-[#555] transition-colors hover:bg-gray-100"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                      {rowMenuOpen === g.name && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setRowMenuOpen(null)} />
                          <div className="absolute right-0 top-full z-50 mt-1 w-[160px] overflow-hidden rounded-md border border-border bg-white py-1 shadow-lg">
                            <button
                              onClick={() => { setRowMenuOpen(null); }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-[#171417] transition-colors hover:bg-gray-50"
                            >
                              <Download className="size-3.5 text-[#555]" />
                              Download CSV
                            </button>
                            <button
                              onClick={() => {
                                setRowMenuOpen(null);
                                setDeleteTarget(g.name);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-[#dc2626] transition-colors hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-[#8d8d8d]">
                    No groups found matching &ldquo;{searchQuery}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[#555] transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>
            {paginationRange().map((p, i) =>
              p === "ellipsis" ? (
                <span key={`e${i}`} className="flex size-9 items-center justify-center text-sm text-[#555]">
                  &hellip;
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    currentPage === p
                      ? "border border-border bg-white text-[#171417] shadow-sm"
                      : "text-[#555] hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[#555] transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-[420px] rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#171417]">Delete group</h2>
            <p className="mt-2 text-sm text-[#555]">
              Are you sure you want to delete <strong className="font-semibold text-[#171417]">{deleteTarget}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-[#171417] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const created = loadCreatedGroups().filter((c) => c.name !== deleteTarget);
                  saveCreatedGroups(created);
                  setGroups((prev) => prev.filter((p) => p.name !== deleteTarget));
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

      {/* Create Group Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCreateModalOpen(false)} />
          <div className="relative w-[630px] rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold leading-7 text-[#171417]">Create Group</h2>

            <div className="mt-6">
              <label className="flex items-center gap-1 text-sm font-semibold text-[#171417]">
                Group name <span className="text-[#dc2626]">*</span>
              </label>
              <input
                ref={groupNameRef}
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="mt-2 h-9 w-full rounded-md border border-[#f0f0f0] bg-[#fcfcfc] px-3 text-sm text-[#171417] placeholder:text-[#8d8d8d] outline-none transition-colors focus:border-[#212be9] focus:ring-2 focus:ring-[#212be9]/20"
              />
            </div>

            <div className="my-6 h-px w-[246px] bg-border" />

            <div>
              <label className="text-sm font-semibold text-[#171417]">Add members</label>
              <input
                type="text"
                value={newGroupMembers}
                onChange={(e) => setNewGroupMembers(e.target.value)}
                placeholder="email@example.com"
                className="mt-2 h-9 w-full rounded-md border border-[#f0f0f0] bg-[#fcfcfc] px-3 text-sm text-[#171417] placeholder:text-[#8d8d8d] outline-none transition-colors focus:border-[#212be9] focus:ring-2 focus:ring-[#212be9]/20"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="min-w-[80px] rounded-md border border-[#212be9] bg-white px-3 py-2 text-base font-medium text-[#212be9] transition-colors hover:bg-[#f5f5ff]"
              >
                Cancel
              </button>
              <button
                disabled={!newGroupName.trim()}
                onClick={() => {
                  const name = newGroupName.trim();
                  const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
                  const memberEmails = newGroupMembers.trim().split(",").map((e) => e.trim()).filter(Boolean);
                  const memberCount = Math.max(1, memberEmails.length);
                  const newGroup: Group = { name, members: memberCount, created: today };

                  const created = loadCreatedGroups();
                  const updated = [newGroup, ...created];
                  saveCreatedGroups(updated);
                  setGroups([newGroup, ...groups]);
                  setCurrentPage(1);
                  setSearchQuery("");
                  setCreateModalOpen(false);

                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  router.push(`/attribution/permission-groups/${slug}?name=${encodeURIComponent(name)}&members=${encodeURIComponent(newGroupMembers.trim())}`);
                }}
                className="min-w-[80px] rounded-md bg-[#212be9] px-3 py-2 text-base font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

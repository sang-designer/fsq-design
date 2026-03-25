"use client";

import { ChevronDown, ExternalLink, MoreVertical, X, Trash2, Check, CircleCheck, Info, User, LayoutGrid } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

type Member = {
  initials: string;
  name: string;
  email?: string;
};

type Business = {
  name: string;
  category: string;
  address: string;
  members: number | null;
  memberList: Member[];
  dateAdded: string;
  confirmInvitation?: boolean;
};

const searchableUsers: Member[] = [
  { initials: "CJ", name: "Craig Johnson", email: "cjohnson@foursquare.com" },
  { initials: "AM", name: "Alice Martinez", email: "amartinez@foursquare.com" },
  { initials: "TS", name: "Tom Smith", email: "tsmith@foursquare.com" },
  { initials: "LP", name: "Laura Park", email: "lpark@foursquare.com" },
];

const initialBusinesses: Business[] = [
  { name: "Sangster Coffee House", category: "Cafe", address: "540 Columbus Ave., San Francisco, CA", members: null, memberList: [], dateAdded: "5/12/2025", confirmInvitation: true },
  { name: "Sangster Coffee House I", category: "Cafe", address: "540 Columbus Ave., San Francisco, CA", members: 1, memberList: [{ initials: "SY", name: "Sang Yeo" }], dateAdded: "5/12/2025" },
  { name: "Sangster Coffee House II", category: "Cafe", address: "540 Columbus Ave., San Francisco, CA", members: 2, memberList: [{ initials: "WH", name: "Wen Huang" }, { initials: "SY", name: "Sang Yeo" }], dateAdded: "5/12/2025" },
  { name: "Sangster Coffee House III", category: "Cafe", address: "540 Columbus Ave., San Francisco, CA", members: 3, memberList: [{ initials: "WH", name: "Wen Huang" }, { initials: "BA", name: "Brian Aguilar" }, { initials: "SY", name: "Sang Yeo" }], dateAdded: "5/12/2025" },
  { name: "Sangster Coffee House IV", category: "Cafe", address: "540 Columbus Ave., San Francisco, CA", members: 4, memberList: [{ initials: "WH", name: "Wen Huang" }, { initials: "BA", name: "Brian Aguilar" }, { initials: "SY", name: "Sang Yeo" }, { initials: "JL", name: "Jane Lee" }], dateAdded: "5/12/2025" },
  { name: "Sangster Coffee House V", category: "Cafe", address: "540 Columbus Ave., San Francisco, CA", members: 4, memberList: [{ initials: "WH", name: "Wen Huang" }, { initials: "BA", name: "Brian Aguilar" }, { initials: "SY", name: "Sang Yeo" }, { initials: "JL", name: "Jane Lee" }], dateAdded: "5/12/2025" },
  { name: "Sangster Coffee House VI", category: "Cafe", address: "540 Columbus Ave., San Francisco, CA", members: 1, memberList: [{ initials: "SY", name: "Sang Yeo" }], dateAdded: "5/12/2025" },
];

function SuccessToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed right-6 top-[72px] z-[60] flex w-[356px] items-center gap-2 rounded-md border border-[#166534] bg-[#f0fdf4] p-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
      <CircleCheck className="size-4 shrink-0 text-[#166534]" />
      <p className="text-sm font-medium leading-5 text-[#166534]">{message}</p>
    </div>
  );
}

type MembersModalProps = {
  business: Business;
  allBusinesses: Business[];
  onClose: () => void;
  onAddMember: (businessNames: string[], member: Member) => void;
  onDeleteMember: (businessName: string, memberName: string) => void;
};

function MembersModal({ business, allBusinesses, onClose, onAddMember, onDeleteMember }: MembersModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [bizDropdownOpen, setBizDropdownOpen] = useState(false);
  const [selectedBizNames, setSelectedBizNames] = useState<string[]>([business.name]);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null);
  const [deleteToast, setDeleteToast] = useState(false);
  const [localMembers, setLocalMembers] = useState<Member[]>(business.memberList);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalMembers(business.memberList);
  }, [business.memberList]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (confirmDeleteName) { setConfirmDeleteName(null); return; }
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, confirmDeleteName]);

  useEffect(() => {
    if (!deleteToast) return;
    const t = setTimeout(() => setDeleteToast(false), 1500);
    return () => clearTimeout(t);
  }, [deleteToast]);

  const existingNames = new Set(localMembers.map((m) => m.name));
  const selectedNames = new Set(selectedMembers.map((m) => m.name));

  const searchResults = searchQuery.length >= 2
    ? searchableUsers.filter(
        (u) =>
          !existingNames.has(u.name) &&
          !selectedNames.has(u.name) &&
          (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [];

  function handleSelectUser(user: Member) {
    setSelectedMembers((prev) => [...prev, user]);
    setSearchQuery("");
    setSearchOpen(false);
    inputRef.current?.focus();
  }

  function handleRemoveSelected(name: string) {
    setSelectedMembers((prev) => prev.filter((m) => m.name !== name));
  }

  function handleToggleBiz(name: string) {
    setSelectedBizNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  function handleSelectAll() {
    const claimable = allBusinesses.filter((b) => !b.confirmInvitation).map((b) => b.name);
    setSelectedBizNames(claimable);
  }

  function handleSubmit() {
    if (selectedMembers.length === 0) return;
    selectedMembers.forEach((m) => {
      onAddMember(selectedBizNames, m);
    });
    onClose();
  }

  function handleConfirmDelete() {
    if (!confirmDeleteName) return;
    onDeleteMember(business.name, confirmDeleteName);
    setLocalMembers((prev) => prev.filter((m) => m.name !== confirmDeleteName));
    setConfirmDeleteName(null);
    setDeleteToast(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={ref} className="w-[440px] rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="text-lg font-semibold text-[#171417]">Members</h2>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-md hover:bg-gray-100">
            <X className="size-5 text-[#555]" />
          </button>
        </div>

        {/* Current Members */}
        <div className="flex flex-wrap gap-2 border-b border-[#e0e0e0] px-6 pb-4">
          {localMembers.map((m) => (
            <div key={m.name} className="relative flex items-center gap-2 rounded-md border border-[#e0e0e0] bg-white px-2.5 py-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#f1f5f9] text-[10px] font-medium text-[#64748b]">
                {m.initials}
              </span>
              <span className="text-sm font-semibold text-[#171417]">{m.name}</span>
              <button
                onClick={() => setConfirmDeleteName(m.name)}
                className="flex size-5 items-center justify-center rounded hover:bg-gray-100"
              >
                <Trash2 className="size-3.5 text-[#8d8d8d]" />
              </button>

              {confirmDeleteName === m.name && (
                <div className="absolute left-1/2 top-full z-20 mt-2 w-[220px] -translate-x-1/2 rounded-md border border-[#e0e0e0] bg-white p-3 shadow-md">
                  <div className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-l border-t border-[#e0e0e0] bg-white" />
                  <p className="text-sm text-[#171417]">
                    Are you sure you want to delete {m.name}?
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setConfirmDeleteName(null)}
                      className="rounded-md border border-[#e0e0e0] bg-white px-3 py-1 text-xs font-medium text-[#171417] hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="rounded-md bg-[#dc2626] px-3 py-1 text-xs font-medium text-white hover:bg-[#b91c1c]"
                    >
                      Yes, delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Inline Delete Toast */}
        {deleteToast && (
          <div className="mx-6 mt-3 flex items-center gap-2 rounded-md border border-[#166534] bg-[#f0fdf4] p-4">
            <CircleCheck className="size-4 shrink-0 text-[#166534]" />
            <p className="text-sm font-medium leading-5 text-[#166534]">Member deleted successfully.</p>
          </div>
        )}

        {/* Add Members Form */}
        <div className="px-6 pb-6 pt-4">
          <h3 className="text-sm font-semibold text-[#171417]">Add members</h3>
          <p className="mt-1 text-sm text-[#555]">
            To add a new manager, search for a person by their email address or foursquare user id:
          </p>

          {/* Find Members */}
          <div className="relative mt-4">
            <label className="text-sm font-medium text-[#171417]">
              Find members <span className="text-red-500">*</span>
            </label>
            <div
              className={`mt-1.5 flex min-h-[40px] flex-wrap items-center gap-1.5 rounded-md border px-3 py-1.5 ${
                searchOpen ? "border-[#212be9] ring-1 ring-[#212be9]" : "border-[#e0e0e0]"
              }`}
              onClick={() => inputRef.current?.focus()}
            >
              {selectedMembers.map((m) => (
                <span
                  key={m.name}
                  className="inline-flex items-center gap-1 rounded bg-[#171417] px-2 py-0.5 text-xs font-semibold text-white"
                >
                  {m.name}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveSelected(m.name); }}
                    className="ml-0.5 hover:text-gray-300"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="min-w-[100px] flex-1 bg-transparent text-sm text-[#171417] outline-none placeholder:text-[#8d8d8d]"
                placeholder={selectedMembers.length === 0 ? "" : ""}
              />
            </div>

            {/* Search Dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-[#e0e0e0] bg-white py-1 shadow-md">
                {searchResults.map((user) => (
                  <button
                    key={user.name}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectUser(user)}
                    className="block w-full px-3 py-2 text-left text-sm text-[#171417] hover:bg-gray-50"
                  >
                    {user.name} ({user.email})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Business Name Dropdown */}
          <div className="relative mt-4">
            <label className="text-sm font-medium text-[#171417]">Business name</label>
            <button
              onClick={() => setBizDropdownOpen(!bizDropdownOpen)}
              className={`mt-1.5 flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left text-sm text-[#171417] ${
                bizDropdownOpen ? "border-[#212be9] ring-1 ring-[#212be9]" : "border-[#e0e0e0]"
              }`}
            >
              <span className="truncate">
                {selectedBizNames.length === 1
                  ? selectedBizNames[0]
                  : `${selectedBizNames.length} businesses selected`}
              </span>
              <ChevronDown className="size-4 shrink-0 text-[#555]" />
            </button>

            {bizDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-[#e0e0e0] bg-white py-1 shadow-md">
                {allBusinesses
                  .filter((b) => !b.confirmInvitation)
                  .map((b) => (
                    <button
                      key={b.name}
                      onClick={() => handleToggleBiz(b.name)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        selectedBizNames.includes(b.name)
                          ? "font-medium text-[#171417]"
                          : "text-[#555]"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                <div className="border-t border-[#e0e0e0]">
                  <button
                    onClick={handleSelectAll}
                    className="w-full px-3 py-2 text-left text-sm font-medium text-[#171417] hover:bg-gray-50"
                  >
                    Select All Businesses
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-md border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#171417] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedMembers.length === 0}
              className="rounded-md bg-[#6166eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#5055d4] disabled:opacity-50"
            >
              Add member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessListings() {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [selectedBusiness, setSelectedBusiness] = useState("Sangster Coffee House");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [membersModalBiz, setMembersModalBiz] = useState<Business | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmingBiz, setConfirmingBiz] = useState<string | null>(null);

  const handleConfirmInvitation = useCallback((bizName: string) => {
    setConfirmingBiz(bizName);
    setTimeout(() => {
      setBusinesses((prev) =>
        prev.map((biz) =>
          biz.name === bizName
            ? { ...biz, confirmInvitation: false, members: 1, memberList: [{ initials: "SY", name: "Sang Yeo" }] }
            : biz
        )
      );
      setConfirmingBiz(null);
    }, 1400);
  }, []);

  const handleAddMember = useCallback((businessNames: string[], member: Member) => {
    setBusinesses((prev) =>
      prev.map((biz) => {
        if (!businessNames.includes(biz.name)) return biz;
        if (biz.memberList.some((m) => m.name === member.name)) return biz;
        const newList = [...biz.memberList, member];
        return { ...biz, memberList: newList, members: newList.length };
      })
    );
    setToast("Member added successfully! Their invitation is pending until they accept it.");
  }, []);

  const handleDeleteMember = useCallback((businessName: string, memberName: string) => {
    setBusinesses((prev) =>
      prev.map((biz) => {
        if (biz.name !== businessName) return biz;
        const newList = biz.memberList.filter((m) => m.name !== memberName);
        return { ...biz, memberList: newList, members: newList.length || null };
      })
    );
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Global Nav */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#e0e0e0] bg-white">
        <div className="flex items-center gap-16 pl-8">
          {/* Product logo + name */}
          <div className="flex h-9 items-center gap-0.5">
            <img src="/fsq-logo.svg" alt="FSQ" className="h-[15px] w-10" />
            <span className="flex items-center gap-0.5 font-mono text-lg font-medium text-[#000033]">
              <span>/</span>
              <span>Business Listings</span>
            </span>
          </div>
          {/* Nav tabs */}
          <nav className="flex h-14 items-end">
            <button className="flex items-center justify-center border-b-2 border-[#000033] px-4 pb-2 pt-2">
              <span className="text-base font-semibold text-[#000033]">Home</span>
            </button>
          </nav>
        </div>
        <div className="flex h-full items-center pr-8">
          <div className="flex h-full items-center gap-4 px-4">
            <button className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100">
              <Info className="size-4 text-[#000033]" />
            </button>
            <button className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100">
              <User className="size-4 text-[#000033]" />
            </button>
          </div>
          <div className="flex h-full items-center border-l border-[#e0e0e0] pl-4">
            <button className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100">
              <LayoutGrid className="size-4 text-[#000033]" />
            </button>
          </div>
        </div>
      </header>

      {/* Success Toast */}
      {toast && <SuccessToast message={toast} onDone={clearToast} />}

      {/* Page Content */}
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10">
        {/* Welcome Heading */}
        <h1 className="mb-6 text-2xl font-normal tracking-[-0.5px] text-black">
          Hi &lt;name&gt;, welcome to Business Listings.
        </h1>

        {/* Summary Box + Quick Links */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Summary Box */}
          <div className="flex-1 rounded-lg bg-[#f8f8f8] p-6 shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {/* Avatar + Info */}
              <div className="flex items-start gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] text-2xl text-[#64748b]">
                  SY
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-semibold text-[#171417]">Sang Yeo</span>
                    <span className="text-lg">🟢</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-black">Here is insightful analytics for</span>
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm text-[#020617]"
                      >
                        {selectedBusiness}
                        <ChevronDown className="size-4 text-[#555]" />
                      </button>
                      {dropdownOpen && (
                        <div className="absolute left-0 top-full z-10 mt-1 w-64 rounded-md border border-[#e0e0e0] bg-white py-1 shadow-lg">
                          {businesses.map((b) => (
                            <button
                              key={b.name}
                              onClick={() => { setSelectedBusiness(b.name); setDropdownOpen(false); }}
                              className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedBusiness === b.name ? "font-medium text-[#171417]" : "text-[#555]"}`}
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-start gap-0 sm:ml-auto">
                <div className="flex flex-col items-center px-6">
                  <span className="text-xl font-semibold text-[#171417]">24</span>
                  <span className="mt-1 text-center text-xs text-[#646464]">Edits<br />this month</span>
                </div>
                <div className="h-16 w-px bg-[#e0ddde]" />
                <div className="flex flex-col items-center px-6">
                  <span className="text-xl font-semibold text-[#171417]">7</span>
                  <span className="mt-1 text-center text-xs text-[#646464]">Suggestions<br />this month</span>
                </div>
                <div className="h-16 w-px bg-[#e0ddde]" />
                <div className="flex flex-col items-center px-6">
                  <span className="text-xl font-semibold text-[#171417]">1.2K</span>
                  <span className="mt-1 text-center text-xs text-[#646464]">Visits<br />this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="shrink-0 lg:w-[200px]">
            <h2 className="mb-3 text-xl font-semibold text-black">Quick links</h2>
            <div className="flex flex-col gap-2">
              <a href="#" className="flex items-center gap-1 text-sm font-medium text-[#212be9] hover:underline">
                Placemaker Tools
                <ExternalLink className="size-4" />
              </a>
              <a href="/bl/search" className="text-sm font-medium text-[#212be9] hover:underline">
                Search businesses on FSQ
              </a>
            </div>
          </div>
        </div>

        {/* My Claimed Businesses */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-[-0.6px] text-black">My Claimed Businesses</h2>
            <button className="rounded-md border border-[#212be9] bg-white px-3 py-2 text-sm font-medium text-[#212be9] hover:bg-[#f8f8ff]">
              List Business
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e0e0e0] text-sm font-medium text-[#8d8d8d]">
                  <th className="px-4 py-3 font-medium">Business name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Members</th>
                  <th className="px-4 py-3 font-medium">Date added</th>
                  <th className="w-10 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((biz) => (
                  <tr key={biz.name} className="border-b border-[#e0e0e0] last:border-0">
                    <td className="px-4 py-3.5">
                      <a href="#" className="text-sm font-normal text-[#3333ff] hover:underline">{biz.name}</a>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#003]">{biz.category}</td>
                    <td className="px-4 py-3.5 text-sm text-[#003]">{biz.address}</td>
                    <td className="px-4 py-3.5">
                      {biz.confirmInvitation ? (
                        confirmingBiz === biz.name ? (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#16a34a] bg-[#f0fdf4] px-3 py-1.5 text-sm font-medium text-[#16a34a]">
                            <svg className="size-4 animate-[scaleIn_0.3s_ease-out_forwards]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" className="animate-[drawCheck_0.4s_ease-out_0.15s_forwards]" style={{ strokeDasharray: 24, strokeDashoffset: 24 }} />
                            </svg>
                            <span className="animate-[fadeIn_0.3s_ease-out_0.3s_forwards] opacity-0">Confirmed!</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleConfirmInvitation(biz.name)}
                            className="rounded-md border border-[#e0e0e0] bg-[#fcfcfc] px-3 py-1.5 text-sm font-medium text-[#212be9] transition-all hover:border-[#212be9] hover:bg-[#f5f5ff] active:scale-95"
                          >
                            Confirm invitation
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => setMembersModalBiz(biz)}
                          className="text-sm text-[#3333ff] hover:underline"
                        >
                          {biz.members}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#212be9]">{biz.dateAdded}</td>
                    <td className="px-4 py-3.5">
                      <button className="flex size-8 items-center justify-center rounded-md hover:bg-gray-50">
                        <MoreVertical className="size-4 text-[#555]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {membersModalBiz && (
        <MembersModal
          business={membersModalBiz}
          allBusinesses={businesses}
          onClose={() => setMembersModalBiz(null)}
          onAddMember={handleAddMember}
          onDeleteMember={handleDeleteMember}
        />
      )}
    </div>
  );
}

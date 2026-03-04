"use client";

import {
  ChevronLeft,
  MoreVertical,
  Grid3X3,
  CircleAlert,
  FileText,
  UserCircle,
  LogOut,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const existingGroupData: Record<string, { name: string; created: string; members: { name: string; organization: string; email: string; joined: string }[] }> = {
  "barr-space-coast": { name: "&Barr - Space Coast", created: "08/04/2025", members: [
    { name: "Jordan Blake", organization: "&Barr", email: "jblake@barr.com", joined: "08/04/2025" },
    { name: "Taylor Marsh", organization: "&Barr", email: "tmarsh@barr.com", joined: "08/04/2025" },
  ]},
  "1060-advisors": { name: "1060 Advisors", created: "08/04/2025", members: [
    { name: "Casey Nguyen", organization: "1060 Advisors", email: "cnguyen@1060advisors.com", joined: "08/04/2025" },
    { name: "Reese Patel", organization: "1060 Advisors", email: "rpatel@1060advisors.com", joined: "08/04/2025" },
  ]},
  "2045-collective": { name: "2045 Collective", created: "08/04/2025", members: [
    { name: "Morgan Li", organization: "2045 Collective", email: "mli@2045collective.com", joined: "08/04/2025" },
    { name: "Avery Kim", organization: "2045 Collective", email: "akim@2045collective.com", joined: "08/04/2025" },
  ]},
};

function GroupDetailContent() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");
  const membersParam = searchParams.get("members");
  const countParam = searchParams.get("count");
  const createdParam = searchParams.get("created");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const slug = typeof window !== "undefined" ? decodeURIComponent(window.location.pathname.split("/").pop() || "") : "";
  const existing = existingGroupData[slug];

  const groupName = nameParam || existing?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const createdDate = createdParam || existing?.created || new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });

  const initialMembers = existing?.members || (() => {
    if (membersParam && membersParam.trim()) {
      const emails = membersParam.split(",").map((e) => e.trim()).filter(Boolean);
      return emails.map((email) => {
        const namePart = email.split("@")[0];
        return {
          name: namePart.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          organization: email.split("@")[1]?.split(".")[0]?.replace(/\b\w/g, (c) => c.toUpperCase()) || "—",
          email,
          joined: createdDate,
        };
      });
    }

    const count = countParam ? parseInt(countParam, 10) : 0;
    if (count <= 0) return [];

    const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Harper", "Reese"];
    const lastNames = ["Chen", "Patel", "Kim", "Blake", "Nguyen", "Garcia", "Martinez", "Lee", "Wilson", "Brown"];
    const orgName = groupName.split(" - ")[0] || groupName;
    const domain = orgName.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com";

    return Array.from({ length: count }, (_, i) => {
      const first = firstNames[i % firstNames.length];
      const last = lastNames[i % lastNames.length];
      return {
        name: `${first} ${last}`,
        organization: orgName,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
        joined: createdDate,
      };
    });
  })();

  const [members, setMembers] = useState(initialMembers);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.organization.toLowerCase().includes(memberSearch.toLowerCase())
  );

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
        <Link
          href="/attribution/permission-groups"
          className="inline-flex items-center gap-1 text-sm text-[#555] transition-colors hover:text-[#171417]"
        >
          <ChevronLeft className="size-4" />
          Back to Permission Groups
        </Link>

        {/* Group header */}
        <div className="mt-6">
          <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-[#171417]">
            {groupName}
          </h1>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#555]">Created:</span>
              <span className="text-sm font-medium text-[#171417]">{createdDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#555]">Members:</span>
              <span className="text-sm font-medium text-[#171417]">{members.length}</span>
            </div>
          </div>
        </div>

        <div className="my-6 h-px bg-border" />

        {/* Members section */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#171417]">Members</h2>
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8d8d8d]" />
            <input
              type="text"
              placeholder="Search members..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-white pl-10 pr-3 text-sm text-[#171417] placeholder:text-[#8d8d8d] outline-none transition-colors focus:border-[#212be9] focus:ring-2 focus:ring-[#212be9]/20"
            />
          </div>
        </div>

        <div className="mt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 text-xs font-medium text-[#555]">Member name</th>
                <th className="px-4 py-3 text-xs font-medium text-[#555]">Organization</th>
                <th className="px-4 py-3 text-xs font-medium text-[#555]">Email</th>
                <th className="px-4 py-3 text-xs font-medium text-[#555]">Joined on</th>
                <th className="w-10 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.email} className="border-b border-border transition-colors hover:bg-gray-50/50">
                  <td className="py-3 pr-4 font-medium text-[#171417]">{m.name}</td>
                  <td className="px-4 py-3 text-[#171417]">{m.organization}</td>
                  <td className="px-4 py-3 text-[#555]">{m.email}</td>
                  <td className="px-4 py-3 text-[#171417]">{m.joined}</td>
                  <td className="py-3">
                    <div className="relative">
                      <button
                        onClick={() => setRowMenuOpen(rowMenuOpen === m.email ? null : m.email)}
                        className="flex size-8 items-center justify-center rounded-md text-[#555] transition-colors hover:bg-gray-100"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                      {rowMenuOpen === m.email && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setRowMenuOpen(null)} />
                          <div className="absolute right-0 top-full z-50 mt-1 w-[140px] overflow-hidden rounded-md border border-border bg-white py-1 shadow-lg">
                            <button
                              onClick={() => setRowMenuOpen(null)}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-[#171417] transition-colors hover:bg-gray-50"
                            >
                              <Pencil className="size-3.5 text-[#555]" />
                              Edit
                            </button>
                            <button
                              onClick={() => { setRowMenuOpen(null); setDeleteTarget(m.email); }}
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
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    {members.length === 0 ? (
                      <div>
                        <p className="text-sm font-medium text-[#171417]">No members yet</p>
                        <p className="mt-1 text-sm text-[#8d8d8d]">Add members to this group to get started.</p>
                      </div>
                    ) : (
                      <p className="text-sm text-[#8d8d8d]">No members matching &ldquo;{memberSearch}&rdquo;</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteTarget && (() => {
          const member = members.find((m) => m.email === deleteTarget);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
              <div className="relative w-[420px] rounded-lg border border-[#d9d9d9] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#171417]">Remove member</h2>
                <p className="mt-2 text-sm text-[#555]">
                  Are you sure you want to remove <strong className="font-semibold text-[#171417]">{member?.name || deleteTarget}</strong> from this group? This action cannot be undone.
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
                      setMembers((prev) => prev.filter((m) => m.email !== deleteTarget));
                      setDeleteTarget(null);
                    }}
                    className="rounded-md bg-[#dc2626] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b91c1c]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}

export default function GroupDetailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white"><div className="text-sm text-[#8d8d8d]">Loading...</div></div>}>
      <GroupDetailContent />
    </Suspense>
  );
}

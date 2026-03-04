"use client";

import {
  LayoutDashboard, Wrench, LineChart as LineChartIcon, Users as UsersIcon, Receipt, Settings,
  ChevronRight, ChevronDown, Search, PanelLeftClose, Check, Building,
  Info, FileText, User, LayoutGrid,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/devconsole" },
  { label: "Projects", icon: Wrench, href: "/devconsole/projects" },
  { label: "Usage Metrics", icon: LineChartIcon, href: "/devconsole/usage-metrics" },
  { label: "Explore FSQ", icon: UsersIcon, href: "/devconsole/explore-fsq" },
  { label: "Billing", icon: Receipt, href: "/devconsole/billing" },
];

const industries = ["Technology", "Healthcare", "Finance", "Retail", "Education", "Manufacturing", "Media", "Other"];
const statesList = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const members = [
  { name: "Sang Yeo", email: "syeo@nike.com", projects: 7, role: "Administrator" },
  { name: "Emma Cramer", email: "emmac@nike.com", projects: 2, role: "Contributor" },
  { name: "Brian Rojas", email: "brojas@nike.com", projects: 1, role: "Contributor" },
  { name: "Xiaowen", email: "xihuang@nike.com", projects: 4, role: "Contributor" },
  { name: "Craig Johnson", email: "cj@nike.com", projects: 1, role: "Contributor" },
  { name: "Brian Tedder", email: "btedder@nike.com", projects: 2, role: "Contributor" },
  { name: "Chris Good", email: "cgood@nike.com", projects: 3, role: "Viewer" },
  { name: "Sam Smith", email: "ssmith@nike.com", projects: 2, role: "Contributor" },
  { name: "Steve Miller", email: "smiller@nike.com", projects: 1, role: "Contributor" },
  { name: "Jane Croffloton", email: "jc@nike.com", projects: 2, role: "Contributor" },
];

const invitations = [
  { expiration: "July 10, 2025", email: "sangster@nike.com", role: "Contributor" },
];

type Org = { name: string; color: string };
const orgColors = ["#9809bc", "#0891b2", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed"];

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "org-profile";

  const [settingsExpanded, setSettingsExpanded] = useState(true);
  const [memberSearch, setMemberSearch] = useState("");

  const [form, setForm] = useState({
    name: "Nike", industry: "Technology", phone: "415-555-0100",
    website: "https://www.nike.com", address: "One Bowerman Dr",
    city: "Beaverton", state: "OR", postalCode: "97005", country: "United States",
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([{ name: "Nike", color: "#9809bc" }]);
  const [activeOrg, setActiveOrg] = useState("Nike");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(e.target as Node)) setOrgDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const ic = "h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-[#000033] outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]";
  const sc = "h-10 w-full appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]";

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col bg-[#fcfcfc] font-sans">
      {/* Top nav */}
      <header className="z-50 flex h-14 shrink-0 items-center justify-between border-b border-[#e0e0e0] bg-white">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 pl-4">
            <div className="flex size-10 items-center justify-center rounded bg-white">
              <img src="/fsq-logo.svg" alt="FSQ" className="h-[15px] w-10" />
            </div>
            <span className="font-mono text-base font-medium text-[#000033]">Developer</span>
          </div>
        </div>
        <div className="flex h-full items-center pr-8">
          <div className="flex h-full items-center border-r border-[#e0e0e0] pr-8">
            <div className="flex h-10 w-96 items-center overflow-hidden rounded-md border border-[#f0f0f0] bg-[#fcfcfc] px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-sm text-[#000033]/40">Search product name...</span>
              <div className="flex items-center justify-end pl-4"><Search className="size-6 text-[#646464]" /></div>
            </div>
          </div>
          <div className="flex h-full items-center gap-4 px-4">
            <button className="flex size-10 items-center justify-center rounded hover:bg-gray-100"><Info className="size-4 text-[#000033]" /></button>
            <button className="flex size-10 items-center justify-center rounded hover:bg-gray-100"><FileText className="size-4 text-[#000033]" /></button>
            <button className="flex size-10 items-center justify-center rounded hover:bg-gray-100"><User className="size-4 text-[#000033]" /></button>
          </div>
          <div className="flex h-full items-center border-l border-[#e0e0e0] pl-4">
            <button className="flex size-10 items-center justify-center rounded hover:bg-gray-100"><LayoutGrid className="size-4 text-[#000033]" /></button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`flex shrink-0 flex-col border-r border-[#e0e0e0] bg-white transition-all duration-200 ${sidebarCollapsed ? "w-0 overflow-hidden" : "w-60"}`}>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
            <div className="flex flex-col gap-4">
              <div className="relative" ref={orgDropdownRef}>
                <button onClick={() => setOrgDropdownOpen((v) => !v)} className="flex h-10 w-full items-center gap-4 overflow-hidden rounded-md border border-[#e2e8f0] bg-white px-3 py-2">
                  <span className="flex-1 truncate text-left text-sm text-[#020617]">{activeOrg}</span>
                  <ChevronDown className="size-4 shrink-0 text-[#020617]" />
                </button>
                {orgDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-[#e0e0e0] bg-white py-1 shadow-md">
                    {orgs.map((org) => (
                      <button key={org.name} onClick={() => { setActiveOrg(org.name); setOrgDropdownOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50">
                        {activeOrg === org.name ? <Check className="size-4 text-[#000033]" /> : <span className="size-4" />}
                        <span className="text-[#000033]">{org.name}</span>
                      </button>
                    ))}
                    <div className="mx-2 my-1 border-t border-[#e0e0e0]" />
                    <button onClick={() => setOrgDropdownOpen(false)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50">
                      <Building className="size-4 text-[#000033]" />
                      <span className="text-[#000033]">Create organization</span>
                    </button>
                  </div>
                )}
              </div>
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <button key={item.label} onClick={() => { if (item.href) router.push(item.href); }} className="flex items-center gap-2 rounded px-2 py-2 text-sm font-normal text-[#000033] hover:bg-gray-50">
                    <item.icon className="size-4" /><span className="flex-1 truncate text-left">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Settings with expandable sub-items */}
              <div>
                <button
                  onClick={() => setSettingsExpanded((v) => !v)}
                  className="flex w-full items-center gap-2 rounded bg-[#ebf1ff] px-2 py-2 text-sm font-semibold text-[#000033]"
                >
                  <Settings className="size-4" />
                  <span className="flex-1 truncate text-left">Settings</span>
                  <ChevronDown className={`size-4 transition-transform ${settingsExpanded ? "" : "-rotate-90"}`} />
                </button>
                {settingsExpanded && (
                  <div className="ml-6 mt-1 flex flex-col gap-0.5">
                    <button
                      onClick={() => router.push("/devconsole/settings?tab=org-profile")}
                      className={`rounded px-2 py-1.5 text-left text-sm ${tab === "org-profile" ? "bg-[#ebf1ff] font-semibold text-[#000033]" : "text-[#000033] hover:bg-gray-50"}`}
                    >
                      Org profile
                    </button>
                    <button
                      onClick={() => router.push("/devconsole/settings?tab=members")}
                      className={`rounded px-2 py-1.5 text-left text-sm ${tab === "members" ? "bg-[#ebf1ff] font-semibold text-[#000033]" : "text-[#000033] hover:bg-gray-50"}`}
                    >
                      Members
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end px-2 py-1">
            <button onClick={() => setSidebarCollapsed(true)} className="flex size-8 items-center justify-center rounded hover:bg-gray-100">
              <PanelLeftClose className="size-4 text-[#000033]" />
            </button>
          </div>
        </aside>

        {sidebarCollapsed && (
          <button onClick={() => setSidebarCollapsed(false)} className="flex h-14 w-10 items-center justify-center border-r border-[#e0e0e0] bg-white hover:bg-gray-50">
            <PanelLeftClose className="size-4 rotate-180 text-[#000033]" />
          </button>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="mx-auto max-w-[800px]">

            {/* ===== ORG PROFILE TAB ===== */}
            {tab === "org-profile" && (
              <>
                <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-black">Organization profile</h1>

                <div className="mt-4 flex items-center gap-2 rounded-md border border-[#c7d2fe] bg-[#eef2ff] px-4 py-3">
                  <Info className="size-4 shrink-0 text-[#212be9]" />
                  <p className="text-sm text-[#000033]">Only admin can edit this page.</p>
                </div>

                <div className="mt-6 flex max-w-[540px] flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Organization name</label>
                    <input value={form.name} onChange={(e) => update("name", e.target.value)} className={ic} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Organization industry</label>
                    <div className="relative">
                      <select value={form.industry} onChange={(e) => update("industry", e.target.value)} className={sc}>
                        {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Phone number</label>
                    <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={ic} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Website URL</label>
                    <input value={form.website} onChange={(e) => update("website", e.target.value)} className={ic} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Address</label>
                    <input value={form.address} onChange={(e) => update("address", e.target.value)} className={ic} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">City</label>
                    <input value={form.city} onChange={(e) => update("city", e.target.value)} className={ic} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">State</label>
                    <div className="relative">
                      <select value={form.state} onChange={(e) => update("state", e.target.value)} className={sc}>
                        {statesList.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Postal code</label>
                    <input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} className={ic} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Country</label>
                    <div className="relative">
                      <select value={form.country} onChange={(e) => update("country", e.target.value)} className={sc}>
                        <option>United States</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
                    </div>
                  </div>

                  <button className="mt-2 self-start rounded-md bg-[#212be9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1a22c4]">
                    Edit Profile
                  </button>
                </div>
              </>
            )}

            {/* ===== MEMBERS TAB ===== */}
            {tab === "members" && (
              <>
                <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-black">Members</h1>
                <p className="mt-3 text-sm text-[#000033]">You have <strong>31 members</strong>.</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="relative w-[380px]">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8d8d8d]" />
                    <input
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Search member"
                      className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white pl-9 pr-3 text-sm text-[#000033] outline-none placeholder:text-[#8d8d8d] transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
                    />
                  </div>
                  <button className="flex items-center gap-1.5 rounded-md border border-[#000033] px-4 py-2 text-sm font-medium text-[#000033] hover:bg-gray-50">
                    + Add member
                  </button>
                </div>

                {/* Members table */}
                <div className="mt-4">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#e0e0e0]">
                        <th className="py-3 pr-4 font-medium text-[#8d8d8d]">Name</th>
                        <th className="py-3 pr-4 font-medium text-[#8d8d8d]">Email</th>
                        <th className="py-3 pr-4 text-center font-medium text-[#8d8d8d]"># of Projects</th>
                        <th className="py-3 pr-4 font-medium text-[#8d8d8d]">Roles</th>
                        <th className="w-[40px] py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((m) => (
                        <tr key={m.email} className="border-b border-[#e0e0e0]">
                          <td className="py-3 pr-4 text-[#000033]">{m.name}</td>
                          <td className="py-3 pr-4 text-[#000033]">{m.email}</td>
                          <td className="py-3 pr-4 text-center text-[#000033]">{m.projects}</td>
                          <td className="py-3 pr-4 text-[#000033]">{m.role}</td>
                          <td className="py-3 text-center">
                            <button className="text-[#646464] hover:text-[#000033]">⋮</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-[#000033]">
                  <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <div className="relative">
                      <select className="h-8 appearance-none rounded border border-[#e0e0e0] bg-white pl-2 pr-7 text-sm text-[#000033] outline-none">
                        <option>10</option><option>25</option><option>50</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-3 -translate-y-1/2 text-[#646464]" />
                    </div>
                  </div>
                  <span>Page 1 of 3</span>
                  <div className="flex gap-1">
                    <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] text-sm disabled:opacity-30" disabled>«</button>
                    <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] text-sm disabled:opacity-30" disabled>‹</button>
                    <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] text-sm hover:bg-gray-50">›</button>
                    <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] text-sm hover:bg-gray-50">»</button>
                  </div>
                </div>

                {/* Invitations */}
                <h2 className="mt-8 text-lg font-semibold text-black">
                  {invitations.length} Invitation{invitations.length !== 1 ? "s" : ""} in your Organization
                </h2>
                <div className="mt-4">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#e0e0e0]">
                        <th className="py-3 pr-4 font-medium text-[#8d8d8d]">Expiration</th>
                        <th className="py-3 pr-4 font-medium text-[#8d8d8d]">Email</th>
                        <th className="py-3 pr-4 font-medium text-[#8d8d8d]">Roles</th>
                        <th className="w-[40px] py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map((inv) => (
                        <tr key={inv.email} className="border-b border-[#e0e0e0] bg-[#eef2ff]">
                          <td className="py-3 pr-4 text-[#000033]">{inv.expiration}</td>
                          <td className="py-3 pr-4 text-[#000033]">{inv.email}</td>
                          <td className="py-3 pr-4 text-[#000033]">{inv.role}</td>
                          <td className="py-3 text-center">
                            <button className="text-[#646464] hover:text-[#000033]">⋮</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="h-16" />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex h-14 shrink-0 items-center justify-between bg-white px-6 font-mono text-sm text-[#646464]">
        <span>&copy; 2025 Foursquare. All rights reserved.</span>
        <div className="flex gap-1">
          <a href="#" className="underline">Privacy Center</a><span>|</span>
          <a href="#" className="underline">Cookie Policy</a><span>|</span>
          <a href="#" className="underline">Your Privacy Choices</a><span>|</span>
          <a href="#" className="underline">Other Terms &amp; Policies</a>
        </div>
      </footer>
    </div>
  );
}

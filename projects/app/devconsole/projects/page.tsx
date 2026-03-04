"use client";

import {
  LayoutDashboard, Wrench, LineChart, Users as UsersIcon, Receipt, Settings,
  ChevronRight, ChevronDown, Search, PanelLeftClose, Check, Building,
  Info, FileText, User, LayoutGrid, Pencil, Plus, Trash2,
  ChevronsLeft, ChevronLeft, ChevronRight as ChevronRightIcon, ChevronsRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/devconsole" },
  { label: "Projects", icon: Wrench, active: true },
  { label: "Usage Metrics", icon: LineChart, href: "/devconsole/usage-metrics" },
  { label: "Explore FSQ", icon: UsersIcon, href: "/devconsole/explore-fsq" },
  { label: "Billing", icon: Receipt, href: "/devconsole/billing" },
];

type Project = {
  name: string;
  role: string;
  apiKeys: string | null;
  apiKeysTotal?: string;
  movementSdk: "Enabled" | "Disabled";
};

const initialProjects: Project[] = [
  { name: "Nike Run", role: "Token manager", apiKeys: null, movementSdk: "Disabled" },
  { name: "Bike", role: "Token manager", apiKeys: "4", apiKeysTotal: "10", movementSdk: "Enabled" },
  { name: "Jordan", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
  { name: "Dunks", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
  { name: "Golf", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
  { name: "Swim", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
  { name: "Tennis", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
  { name: "Soccer", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
  { name: "Football", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
  { name: "Hockey", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
  { name: "Baseball", role: "Token manager", apiKeys: null, movementSdk: "Enabled" },
];

type Org = { name: string; color: string };
const orgColors = ["#9809bc", "#0891b2", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed"];
const industries = ["Technology", "Healthcare", "Finance", "Retail", "Education", "Manufacturing", "Media", "Other"];
const statesList = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

function CreateOrgModal({ onClose, onCreate }: { onClose: () => void; onCreate: (org: { name: string }) => void }) {
  const [form, setForm] = useState({ name: "", industry: "", phone: "", website: "", address: "", city: "", state: "", postalCode: "", country: "United States" });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);
  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const ic = "h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]";
  const sc = "h-10 w-full appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={ref} className="w-[520px] rounded-xl bg-white shadow-xl">
        <div className="max-h-[80vh] overflow-y-auto px-8 pb-2 pt-8">
          <h2 className="text-xl font-semibold text-black">Create organization</h2>
          <div className="mt-6 flex flex-col gap-5">
            <Field label="Organization name"><input value={form.name} onChange={(e) => update("name", e.target.value)} className={ic} /></Field>
            <Field label="Organization industry">
              <div className="relative">
                <select value={form.industry} onChange={(e) => update("industry", e.target.value)} className={sc}>
                  <option value="">Select an industry</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
              </div>
            </Field>
            <Field label="Phone number"><input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="415-555-0100" className={ic + " placeholder:text-[#8d8d8d]"} /></Field>
            <Field label="Website URL"><input value={form.website} onChange={(e) => update("website", e.target.value)} className={ic} /></Field>
            <Field label="Address"><input value={form.address} onChange={(e) => update("address", e.target.value)} className={ic} /></Field>
            <Field label="City"><input value={form.city} onChange={(e) => update("city", e.target.value)} className={ic} /></Field>
            <Field label="State">
              <div className="relative">
                <select value={form.state} onChange={(e) => update("state", e.target.value)} className={sc}>
                  <option value="">Select a state</option>
                  {statesList.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
              </div>
            </Field>
            <Field label="Postal code"><input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} className={ic} /></Field>
            <Field label="Country">
              <div className="relative">
                <select value={form.country} onChange={(e) => update("country", e.target.value)} className={sc}>
                  <option>United States</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
              </div>
            </Field>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 px-8 py-6">
          <button onClick={onClose} className="min-w-[80px] rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-base font-medium text-[#212be9] hover:bg-[#f5f5ff]">Cancel</button>
          <button onClick={() => { if (form.name.trim()) onCreate(form); }} disabled={!form.name.trim()} className="min-w-[80px] rounded-md bg-[#212be9] px-3 py-2 text-base font-medium text-[#f5f8ff] hover:bg-[#1a22c4] disabled:opacity-50">Create</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-black">{label}</label>
      {children}
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([{ name: "Nike", color: "#9809bc" }]);
  const [activeOrg, setActiveOrg] = useState("Nike");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(e.target as Node)) setOrgDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleCreateOrg(form: { name: string }) {
    const color = orgColors[orgs.length % orgColors.length];
    setOrgs((prev) => [...prev, { name: form.name, color }]);
    setActiveOrg(form.name);
    setShowCreateOrgModal(false);
    setOrgDropdownOpen(false);
  }

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  function deleteProject(name: string) {
    setProjects((prev) => prev.filter((p) => p.name !== name));
  }

  function handleCreateProject() {
    if (!newProjectName.trim()) return;
    setProjects((prev) => [...prev, { name: newProjectName.trim(), role: "Token manager", apiKeys: null, movementSdk: "Enabled" }]);
    setNewProjectName("");
    setShowCreateProject(false);
  }

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
              <div className="flex items-center justify-end pl-4">
                <Search className="size-6 text-[#646464]" />
              </div>
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
                    <button onClick={() => { setShowCreateOrgModal(true); setOrgDropdownOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50">
                      <Building className="size-4 text-[#000033]" />
                      <span className="text-[#000033]">Create organization</span>
                    </button>
                  </div>
                )}
              </div>
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { if ("href" in item && item.href) router.push(item.href); }}
                    className={`flex items-center gap-2 rounded px-2 py-2 text-sm ${item.active ? "bg-[#ebf1ff] font-semibold text-[#000033]" : "font-normal text-[#000033] hover:bg-gray-50"}`}
                  >
                    <item.icon className="size-4" />
                    <span className="flex-1 truncate text-left">{item.label}</span>
                  </button>
                ))}
              </nav>
              <button onClick={() => router.push("/devconsole/settings")} className="flex items-center gap-2 rounded px-2 py-2 text-sm text-[#000033] hover:bg-gray-50">
                <Settings className="size-4" /><span className="flex-1 truncate text-left">Settings</span><ChevronRight className="size-4" />
              </button>
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
          <div className="mx-auto max-w-[900px]">
            {/* Title row */}
            <div className="flex items-center gap-6">
              <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-black">Projects</h1>
              <button className="flex items-center gap-1">
                <UsersIcon className="size-4 text-[#212be9]" />
                <span className="text-xs font-medium text-[#212be9]">Add member</span>
              </button>
            </div>

            {/* Search + Create */}
            <div className="mt-6 flex items-center justify-between">
              <div className="relative w-[380px]">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8d8d8d]" />
                <input
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search project"
                  className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white pl-9 pr-3 text-sm text-[#000033] outline-none placeholder:text-[#8d8d8d] transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
                />
              </div>
              <button
                onClick={() => setShowCreateProject(true)}
                className="flex items-center gap-1.5 rounded-md border border-[#000033] px-4 py-2 text-sm font-medium text-[#000033] hover:bg-gray-50"
              >
                <Plus className="size-4" />
                Create a project
              </button>
            </div>

            {/* Table */}
            <div className="mt-2">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e0e0e0]">
                    <th className="w-[200px] px-4 py-3 text-sm font-medium text-[#8d8d8d]">Project name</th>
                    <th className="w-[144px] px-4 py-3 text-sm font-medium text-[#8d8d8d]">Role</th>
                    <th className="w-[200px] px-4 py-3 text-sm font-medium text-[#8d8d8d]">API Keys</th>
                    <th className="w-[144px] px-4 py-3 text-sm font-medium text-[#8d8d8d]">Movement SDK</th>
                    <th className="w-[60px] px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((project) => (
                    <tr key={project.name} className="border-b border-[#e0e0e0]">
                      <td className="px-4 py-4">
                        <button onClick={() => router.push(`/devconsole/projects/${encodeURIComponent(project.name.toLowerCase().replace(/\s+/g, "-"))}`)} className="text-sm font-medium text-[#212be9] hover:underline">{project.name}</button>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#000033]">{project.role}</td>
                      <td className="px-4 py-4 text-sm">
                        {project.apiKeys ? (
                          <span className="text-[#000033]">
                            {project.apiKeys} of {project.apiKeysTotal} (<button className="text-[#212be9] hover:underline">Manage Key</button>)
                          </span>
                        ) : (
                          <button className="text-[#212be9] hover:underline">Generate API Key</button>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#000033]">{project.movementSdk}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => deleteProject(project.name)} className="flex items-center justify-center text-[#212be9] hover:text-red-500">
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#8d8d8d]">No projects found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-[#000033]">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <div className="relative">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="h-8 appearance-none rounded border border-[#e0e0e0] bg-white pl-2 pr-7 text-sm text-[#000033] outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-3 -translate-y-1/2 text-[#646464]" />
                </div>
              </div>
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50 disabled:opacity-30"><ChevronsLeft className="size-4" /></button>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50 disabled:opacity-30"><ChevronLeft className="size-4" /></button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50 disabled:opacity-30"><ChevronRightIcon className="size-4" /></button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50 disabled:opacity-30"><ChevronsRight className="size-4" /></button>
              </div>
            </div>

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

      {/* Create project modal */}
      {showCreateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[440px] rounded-xl bg-white p-8 shadow-xl">
            <h3 className="text-lg font-semibold text-[#000033]">Create a project</h3>
            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-black">Project name</label>
              <input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateProject(); }}
                className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
                autoFocus
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowCreateProject(false); setNewProjectName(""); }} className="rounded-md border border-[#e0e0e0] px-4 py-2 text-sm font-medium text-[#000033] hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateProject} disabled={!newProjectName.trim()} className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a22c4] disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}

      {showCreateOrgModal && <CreateOrgModal onClose={() => setShowCreateOrgModal(false)} onCreate={handleCreateOrg} />}
    </div>
  );
}

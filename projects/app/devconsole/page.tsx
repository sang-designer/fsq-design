"use client";

import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Wrench,
  LineChart,
  Users,
  Receipt,
  Settings,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Pencil,
  CalendarDays,
  Info,
  FileText,
  User,
  LayoutGrid,
  Search,
  PanelLeftClose,
  Check,
  Building,
  Plus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const apiUsageData = [
  { date: "Jun 22", pro: 1200, premium: 300 },
  { date: "Jun 23", pro: 1800, premium: 250 },
  { date: "Jun 24", pro: 1500, premium: 400 },
  { date: "Jun 25", pro: 2100, premium: 350 },
  { date: "Jun 26", pro: 2400, premium: 500 },
  { date: "Jun 27", pro: 1900, premium: 420 },
  { date: "Jun 28", pro: 2200, premium: 380 },
  { date: "Jun 29", pro: 2000, premium: 450 },
];

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Projects", icon: Wrench, href: "/devconsole/projects" },
  { label: "Usage Metrics", icon: LineChart, href: "/devconsole/usage-metrics" },
  { label: "Explore FSQ", icon: Users, href: "/devconsole/explore-fsq" },
  { label: "Billing", icon: Receipt, href: "/devconsole/billing" },
];

const projects = [
  { name: "Run", role: "Token manager", apiKeys: "3", movementSdk: "Enabled" as const },
  { name: "Golf", role: "04/15/2025", apiKeys: "5", movementSdk: "Enabled" as const },
  { name: "Yoga", role: "03/15/2025", apiKeys: null, movementSdk: "Disabled" as const },
];

const updates = [
  { date: "12/26/2025", text: "New API request inspector with request/response diff view" },
  { date: "12/20/2025", text: "Fixed incorrect status code display for Place API" },
  { date: "12/14/2025", text: "Resolved issue where console crashed on malformed JSON responses" },
  { date: "12/02/2025", text: "Updated rate limits for unauthenticated requests" },
  { date: "11/25/2025", text: "Legacy v1 authentication toggle" },
];

const communityItems = [
  { name: "[Example name]", description: "Details about product", meta: "Latest version or news" },
  { name: "[Example name]", description: "Details about product", meta: "Latest version or news" },
  { name: "[Example name]", description: "Details about product", meta: "Latest version or news" },
];

const helpfulLinks = [
  { label: "Get Started with the Places API", href: "#" },
  { label: "Get Started with the Movement SDK", href: "#" },
  { label: "Pay As You Go FAQs", href: "#" },
];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-[#e0e0e0] bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-[#646464]">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-semibold text-[#000033]">
          {p.dataKey === "pro" ? "Pro" : "Premium"}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

type Org = { name: string; color: string };

const industries = ["Technology", "Healthcare", "Finance", "Retail", "Education", "Manufacturing", "Media", "Other"];
const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const orgColors = ["#9809bc", "#0891b2", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed"];

function CreateOrgModal({ onClose, onCreate }: { onClose: () => void; onCreate: (org: { name: string; industry: string; phone: string; website: string; address: string; city: string; state: string; postalCode: string; country: string }) => void }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={ref} className="w-[520px] rounded-xl bg-white shadow-xl">
        <div className="max-h-[80vh] overflow-y-auto px-8 pb-2 pt-8">
          <h2 className="text-xl font-semibold text-black">Create organization</h2>

          <div className="mt-6 flex flex-col gap-5">
            <Field label="Organization name">
              <input value={form.name} onChange={(e) => update("name", e.target.value)} className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]" />
            </Field>
            <Field label="Organization industry">
              <div className="relative">
                <select value={form.industry} onChange={(e) => update("industry", e.target.value)} className="h-10 w-full appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]">
                  <option value="">Select an industry</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
              </div>
            </Field>
            <Field label="Phone number">
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="415-555-0100" className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-black outline-none placeholder:text-[#8d8d8d] transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]" />
            </Field>
            <Field label="Website URL">
              <input value={form.website} onChange={(e) => update("website", e.target.value)} className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]" />
            </Field>
            <Field label="Address">
              <input value={form.address} onChange={(e) => update("address", e.target.value)} className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]" />
            </Field>
            <Field label="City">
              <input value={form.city} onChange={(e) => update("city", e.target.value)} className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]" />
            </Field>
            <Field label="State">
              <div className="relative">
                <select value={form.state} onChange={(e) => update("state", e.target.value)} className="h-10 w-full appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]">
                  <option value="">Select a state</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
              </div>
            </Field>
            <Field label="Postal code">
              <input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]" />
            </Field>
            <Field label="Country">
              <div className="relative">
                <select value={form.country} onChange={(e) => update("country", e.target.value)} className="h-10 w-full appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-black outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]">
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

export default function DevConsole() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([{ name: "Nike", color: "#9809bc" }]);
  const [activeOrg, setActiveOrg] = useState("Nike");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(e.target as Node)) setOrgDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentOrg = orgs.find((o) => o.name === activeOrg) ?? orgs[0];
  const isNewOrg = activeOrg !== "Nike";

  function handleCreateOrg(form: { name: string }) {
    const color = orgColors[orgs.length % orgColors.length];
    const newOrg = { name: form.name, color };
    setOrgs((prev) => [...prev, newOrg]);
    setActiveOrg(form.name);
    setShowCreateModal(false);
    setOrgDropdownOpen(false);
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
            <button className="flex size-10 items-center justify-center rounded hover:bg-gray-100">
              <Info className="size-4 text-[#000033]" />
            </button>
            <button className="flex size-10 items-center justify-center rounded hover:bg-gray-100">
              <FileText className="size-4 text-[#000033]" />
            </button>
            <button className="flex size-10 items-center justify-center rounded hover:bg-gray-100">
              <User className="size-4 text-[#000033]" />
            </button>
          </div>
          <div className="flex h-full items-center border-l border-[#e0e0e0] pl-4">
            <button className="flex size-10 items-center justify-center rounded hover:bg-gray-100">
              <LayoutGrid className="size-4 text-[#000033]" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`flex shrink-0 flex-col border-r border-[#e0e0e0] bg-white transition-all duration-200 ${sidebarCollapsed ? "w-0 overflow-hidden" : "w-60"}`}>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
            <div className="flex flex-col gap-4">
              {/* Org selector */}
              <div className="relative" ref={orgDropdownRef}>
                <button
                  onClick={() => setOrgDropdownOpen((v) => !v)}
                  className="flex h-10 w-full items-center gap-4 overflow-hidden rounded-md border border-[#e2e8f0] bg-white px-3 py-2"
                >
                  <span className="flex-1 truncate text-left text-sm text-[#020617]">{activeOrg}</span>
                  <ChevronDown className="size-4 shrink-0 text-[#020617]" />
                </button>

                {orgDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-[#e0e0e0] bg-white py-1 shadow-md">
                    {orgs.map((org) => (
                      <button
                        key={org.name}
                        onClick={() => { setActiveOrg(org.name); setOrgDropdownOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {activeOrg === org.name ? <Check className="size-4 text-[#000033]" /> : <span className="size-4" />}
                        <span className="text-[#000033]">{org.name}</span>
                      </button>
                    ))}
                    <div className="mx-2 my-1 border-t border-[#e0e0e0]" />
                    <button
                      onClick={() => { setShowCreateModal(true); setOrgDropdownOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      <Building className="size-4 text-[#000033]" />
                      <span className="text-[#000033]">Create organization</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Nav items */}
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { if ("href" in item && item.href) router.push(item.href); }}
                    className={`flex items-center gap-2 rounded px-2 py-2 text-sm ${
                      item.active
                        ? "bg-[#ebf1ff] font-semibold text-[#000033]"
                        : "font-normal text-[#000033] hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="size-4" />
                    <span className="flex-1 truncate text-left">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Settings */}
              <button onClick={() => router.push("/devconsole/settings")} className="flex items-center gap-2 rounded px-2 py-2 text-sm text-[#000033] hover:bg-gray-50">
                <Settings className="size-4" />
                <span className="flex-1 truncate text-left">Settings</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end px-2 py-1">
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="flex size-8 items-center justify-center rounded hover:bg-gray-100"
            >
              <PanelLeftClose className="size-4 text-[#000033]" />
            </button>
          </div>
        </aside>

        {/* Sidebar collapsed toggle */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="flex h-14 w-10 items-center justify-center border-r border-[#e0e0e0] bg-white hover:bg-gray-50"
          >
            <PanelLeftClose className="size-4 rotate-180 text-[#000033]" />
          </button>
        )}

        {/* Main content + Updates sidebar */}
        <div className="flex flex-1 overflow-y-auto">
          {/* Main content */}
          <main className="flex-1 px-10 py-8">
            {/* Payment banner for new orgs */}
            {isNewOrg && (
              <div className="mx-auto mb-6 flex max-w-[800px] items-center gap-2 rounded-md border border-[#c7d2fe] bg-[#eef2ff] px-4 py-3">
                <Info className="size-4 shrink-0 text-[#212be9]" />
                <p className="text-sm text-[#000033]">
                  Please <a href="#" className="font-medium underline">add your payment method</a> in order to purchase credits for this organization.
                </p>
              </div>
            )}

            <div className="mx-auto max-w-[800px]">
              {/* Welcome */}
              <div className="flex flex-col gap-2">
                <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-black">
                  Welcome back, Sang
                </h1>
                <div className="flex items-center gap-0.5 self-start rounded-full px-2 py-0.5" style={{ backgroundColor: currentOrg.color }}>
                  <span className="text-xs font-semibold text-white">{activeOrg}</span>
                  <Pencil className="size-3 text-white" />
                </div>
              </div>

              {/* Usage Metrics */}
              <section className="mt-8">
                <div className="flex items-center gap-6">
                  <h2 className="flex-1 text-xl font-semibold text-black">{isNewOrg ? "Projects" : "Usage Metrics"}</h2>
                  {!isNewOrg && (
                    <button className="flex items-center gap-1 text-sm font-medium text-[#212be9]">
                      View <ArrowRight className="size-4" />
                    </button>
                  )}
                </div>

                {isNewOrg ? (
                  /* Empty projects state for new org */
                  <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-[#e0e0e0] bg-[#fcfcfc] px-8 py-16">
                    <p className="font-mono text-sm text-[#646464]">{"Let's build something great together 🚀."}</p>
                    <button className="mt-4 flex items-center gap-2 rounded-md border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-50">
                      <Plus className="size-4" /> Create project
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 flex gap-4">
                      {[
                        { label: "Pro API Calls", value: "10,039" },
                        { label: "Premium API Calls", value: "0" },
                        { label: "Movement SDK MAU", value: "2,394" },
                      ].map((metric) => (
                        <div key={metric.label} className="w-[180px] rounded border border-[#e0e0e0] bg-white p-4">
                          <p className="text-sm font-semibold text-[#646464]">{metric.label}</p>
                          <p className="mt-1 text-base font-semibold text-black">{metric.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-black">Overall API Usage</p>
                        <span className="text-xs text-[#646464]">Last 7 days</span>
                      </div>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={apiUsageData}>
                            <defs>
                              <linearGradient id="proGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#212be9" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#212be9" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="premGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} width={40} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="premium" stroke="#16a34a" fill="url(#premGrad)" strokeWidth={1.5} />
                            <Area type="monotone" dataKey="pro" stroke="#212be9" fill="url(#proGrad)" strokeWidth={1.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </section>

              {/* Projects table (only for existing orgs) */}
              {!isNewOrg && (
              <section className="mt-9">
                <h2 className="text-xl font-semibold text-black">Projects</h2>
                <p className="mt-2 text-base text-black">
                  Explore the top 3 projects from your organization.
                </p>

                <div className="mt-4 overflow-hidden rounded-lg border border-[#e0e0e0] bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#e0e0e0]">
                        <th className="px-6 py-3 font-medium text-black">Project name</th>
                        <th className="px-6 py-3 font-medium text-black">Role</th>
                        <th className="px-6 py-3 font-medium text-black">API Keys</th>
                        <th className="px-6 py-3 font-medium text-black">Movement SDK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr key={p.name} className="border-b border-[#e0e0e0] last:border-0">
                          <td className="px-6 py-3">
                            <button className="text-sm font-medium text-[#212be9] hover:underline">{p.name}</button>
                          </td>
                          <td className="px-6 py-3 text-[#8d8d8d]">{p.role}</td>
                          <td className="px-6 py-3 text-[#8d8d8d]">
                            {p.apiKeys ?? (
                              <button className="text-sm font-medium text-[#212be9] hover:underline">Generate API Key</button>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                                p.movementSdk === "Enabled"
                                  ? "bg-[#f0fdf4] text-[#166534]"
                                  : "bg-[#f0f0f0] text-black"
                              }`}
                            >
                              {p.movementSdk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              )}

              {/* Usage Metrics for new org */}
              {isNewOrg && (
                <section className="mt-9">
                  <div className="flex items-center gap-6">
                    <h2 className="flex-1 text-xl font-semibold text-black">Usage Metrics</h2>
                    <button className="flex items-center gap-1 text-sm font-medium text-[#212be9]">
                      View <ArrowRight className="size-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex gap-4">
                    {[
                      { label: "Pro API Calls", value: "0" },
                      { label: "Premium API Calls", value: "0" },
                      { label: "Movement SDK MAU", value: "0" },
                    ].map((metric) => (
                      <div key={metric.label} className="w-[180px] rounded border border-[#e0e0e0] bg-white p-4">
                        <p className="text-sm font-semibold text-[#646464]">{metric.label}</p>
                        <p className="mt-1 text-base font-semibold text-black">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Start building */}
              <section className="mt-9">
                <h2 className="text-xl font-semibold text-black">Start building</h2>
                <div className="mt-2 flex items-center gap-4">
                  <p className="flex-1 text-base text-[#646464]">Popular on the FSQ Community {isNewOrg ? "this month" : "this week"}</p>
                  <button className="flex items-center gap-1 text-sm font-medium text-[#212be9]">
                    View
                    <ArrowRight className="size-4" />
                  </button>
                </div>

                <div className="mt-6 flex gap-2">
                  {communityItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex w-80 gap-4 rounded-md border border-[#e0e0e0] bg-white p-4 shadow-md"
                    >
                      <div className="size-10 shrink-0 rounded-full bg-[#f1f5f9]" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-[#000033]">{item.name}</p>
                        <p className="text-sm text-[#000033]">{item.description}</p>
                        <div className="mt-0.5 flex items-center gap-1">
                          <CalendarDays className="size-3.5 text-[#8d8d8d]" />
                          <span className="text-xs text-[#8d8d8d]">{item.meta}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Helpful links */}
              <section className="mt-8">
                <p className="text-base font-semibold text-[#646464]">Helpful links</p>
                <div className="mt-4 flex gap-2">
                  {helpfulLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-1 rounded-md border border-[#e0e0e0] bg-white p-4 shadow-md hover:bg-gray-50"
                    >
                      <span className="text-sm font-semibold text-[#000033]">{link.label}</span>
                      <ExternalLink className="size-4 text-[#000033]" />
                    </a>
                  ))}
                </div>
              </section>

              <div className="h-16" />
            </div>
          </main>

          {/* Updates sidebar */}
          <aside className="w-[268px] shrink-0 p-4">
            <div className="rounded-lg border border-[#e0e0e0] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-black">Updates</h3>
              <div className="mt-6 flex flex-col gap-6">
                {updates.map((update, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-2 flex flex-col items-center">
                      <div className={`size-2 rounded-full ${i === 0 ? "bg-[#212be9]" : "bg-[#8d8d8d]"}`} />
                      {i < updates.length - 1 && <div className="mt-1 h-full w-px bg-[#e0e0e0]" />}
                    </div>
                    <div>
                      <p className="text-sm text-[#646464]">{update.date}</p>
                      <p className="text-sm text-black">{update.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 flex items-center gap-1 text-sm font-medium text-[#212be9]">
                See changelog
                <ArrowRight className="size-4" />
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex h-14 shrink-0 items-center justify-between bg-white px-6 font-mono text-sm text-[#646464]">
        <span>&copy; 2025 Foursquare. All rights reserved.</span>
        <div className="flex gap-1">
          <a href="#" className="underline">Privacy Center</a>
          <span>|</span>
          <a href="#" className="underline">Cookie Policy</a>
          <span>|</span>
          <a href="#" className="underline">Your Privacy Choices</a>
          <span>|</span>
          <a href="#" className="underline">Other Terms &amp; Policies</a>
        </div>
      </footer>

      {/* Create org modal */}
      {showCreateModal && (
        <CreateOrgModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateOrg} />
      )}
    </div>
  );
}

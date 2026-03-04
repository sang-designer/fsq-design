"use client";

import {
  LayoutDashboard, Wrench, LineChart as LineChartIcon, Users as UsersIcon, Receipt, Settings,
  ChevronRight, ChevronDown, Search, PanelLeftClose, Check, Building,
  Info, FileText, User, LayoutGrid, ExternalLink,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/devconsole" },
  { label: "Projects", icon: Wrench, href: "/devconsole/projects" },
  { label: "Usage Metrics", icon: LineChartIcon, active: true },
  { label: "Explore FSQ", icon: UsersIcon, href: "/devconsole/explore-fsq" },
  { label: "Billing", icon: Receipt, href: "/devconsole/billing" },
];

const overallChartData = [
  { date: "5/1", pro: 800, premium: 100 },
  { date: "5/3", pro: 1200, premium: 150 },
  { date: "5/6", pro: 900, premium: 120 },
  { date: "5/9", pro: 1500, premium: 200 },
  { date: "5/12", pro: 1100, premium: 180 },
  { date: "5/15", pro: 2000, premium: 250 },
  { date: "5/18", pro: 1800, premium: 220 },
  { date: "5/21", pro: 4500, premium: 300 },
  { date: "5/24", pro: 3200, premium: 280 },
  { date: "5/27", pro: 2500, premium: 200 },
  { date: "5/30", pro: 2000, premium: 150 },
];

const votesChartData = [
  { date: "Mar 1", details: 8, attributes: 5, chains: 3, categories: 10, flagged: 6 },
  { date: "Mar 5", details: 15, attributes: 22, chains: 10, categories: 12, flagged: 8 },
  { date: "Mar 10", details: 25, attributes: 20, chains: 15, categories: 18, flagged: 12 },
  { date: "Mar 15", details: 35, attributes: 32, chains: 18, categories: 25, flagged: 15 },
  { date: "Mar 20", details: 40, attributes: 30, chains: 12, categories: 28, flagged: 18 },
  { date: "Mar 25", details: 48, attributes: 28, chains: 15, categories: 22, flagged: 10 },
  { date: "Mar 30", details: 42, attributes: 38, chains: 12, categories: 20, flagged: 12 },
];

const placesChartData = [
  { date: "Mar 1", places: 5 },
  { date: "Mar 5", places: 12 },
  { date: "Mar 10", places: 28 },
  { date: "Mar 15", places: 35 },
  { date: "Mar 20", places: 30 },
  { date: "Mar 25", places: 42 },
  { date: "Mar 30", places: 38 },
];

type Org = { name: string; color: string };
const orgColors = ["#9809bc", "#0891b2", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed"];

export default function UsageMetricsPage() {
  const router = useRouter();
  const [projectTab, setProjectTab] = useState<"APIs" | "Placemaker" | "Movement SDK">("APIs");

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

  const projectTabs = ["APIs", "Placemaker", "Movement SDK"] as const;

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
                    <button onClick={() => setOrgDropdownOpen(false)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50">
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
          <div className="mx-auto max-w-[980px]">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-black">Usage Metrics</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#9809bc] px-2 py-0.5 text-xs font-semibold text-white">
                New <ExternalLink className="size-3" />
              </span>
            </div>

            {/* Overall Metrics */}
            <h2 className="mt-6 text-xl font-semibold text-black">Overall Metrics</h2>

            <div className="mt-4 flex gap-4">
              {[
                { label: "Pro API Calls", value: "10,039" },
                { label: "Premium API Calls", value: "0" },
                { label: "Movement SDK MAU", value: "2,394" },
              ].map((m) => (
                <div key={m.label} className="w-[180px] rounded-lg border border-[#e0e0e0] bg-white p-4">
                  <p className="text-sm text-[#000033]">{m.label}</p>
                  <p className="mt-1 text-lg font-semibold text-[#000033]">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Overall chart */}
            <div className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-4">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overallChartData}>
                    <defs>
                      <linearGradient id="proGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#212be9" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#212be9" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="premGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} width={45} label={{ value: "# of API calls", angle: -90, position: "insideLeft", offset: 0, style: { fontSize: 11, fill: "#8d8d8d" } }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 12 }} />
                    <Area type="monotone" dataKey="pro" stroke="#212be9" fill="url(#proGrad)" strokeWidth={2} name="Pro endpoints" />
                    <Area type="monotone" dataKey="premium" stroke="#ec4899" fill="url(#premGrad)" strokeWidth={2} name="Premium endpoints" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-sm bg-[#212be9]" />
                  <span className="text-xs text-[#000033]">Pro endpoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-sm bg-[#ec4899]" />
                  <span className="text-xs text-[#000033]">Premium endpoints</span>
                </div>
              </div>
            </div>

            {/* Project Usage Metrics */}
            <h2 className="mt-10 text-xl font-semibold text-black">Project Usage Metrics</h2>

            <div className="mt-4 flex gap-6 border-b border-[#e0e0e0]">
              {projectTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProjectTab(tab)}
                  className={`pb-3 text-sm transition-colors ${projectTab === tab ? "border-b-2 border-[#000033] font-semibold text-[#000033]" : "text-[#646464] hover:text-[#000033]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-5">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#000033]">Select your project</span>
                <div className="relative">
                  <select className="h-10 w-[200px] appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]">
                    <option>Project name 1</option>
                    <option>Nike Run</option>
                    <option>Bike</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <span className="text-sm font-medium text-[#000033]">Select time period</span>
                <div className="relative">
                  <select className="h-10 w-[160px] appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]">
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Last 90 days</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
                </div>
                <div className="flex h-10 items-center rounded-md border border-[#e0e0e0] bg-white px-3">
                  <span className="text-sm text-[#8d8d8d]">March 1, 2025</span>
                </div>
                <div className="flex h-10 items-center rounded-md border border-[#e0e0e0] bg-white px-3">
                  <span className="text-sm text-[#8d8d8d]">March 30, 2025</span>
                </div>
              </div>
            </div>

            {/* Metric cards */}
            <div className="mt-4 flex gap-4">
              {[
                { label: "Active users", value: "5,409", info: true },
                { label: "Votes", value: "569", info: true },
                { label: "New places", value: "341", info: true },
              ].map((m) => (
                <div key={m.label} className="flex-1 rounded-lg border border-[#e0e0e0] bg-white p-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-[#000033]">{m.label}</span>
                    {m.info && <Info className="size-3.5 text-[#8d8d8d]" />}
                  </div>
                  <p className="mt-2 text-[28px] font-semibold leading-none text-[#000033]">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Votes by Review Type */}
            <div className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-6">
              <h3 className="text-base font-semibold text-[#000033]">Votes by Review Type</h3>
              <div className="mt-4 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={votesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} width={30} domain={[0, 50]} label={{ value: "# of votes", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 11, fill: "#8d8d8d" } }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 12 }} />
                    <Line type="monotone" dataKey="details" stroke="#7c3aed" strokeWidth={2} dot={false} name="Details" />
                    <Line type="monotone" dataKey="attributes" stroke="#212be9" strokeWidth={2} dot={false} name="Attributes" />
                    <Line type="monotone" dataKey="chains" stroke="#06b6d4" strokeWidth={2} dot={false} name="Chains" />
                    <Line type="monotone" dataKey="categories" stroke="#f97316" strokeWidth={2} dot={false} name="Categories" />
                    <Line type="monotone" dataKey="flagged" stroke="#16a34a" strokeWidth={2} dot={false} name="Flagged" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {[
                  { label: "Details", color: "#7c3aed" },
                  { label: "Attributes", color: "#212be9" },
                  { label: "Chains", color: "#06b6d4" },
                  { label: "Categories", color: "#f97316" },
                  { label: "Flagged", color: "#16a34a" },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="size-3.5" style={{ accentColor: item.color }} />
                    <span className="text-xs text-[#000033]">{item.label}</span>
                  </label>
                ))}
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" className="size-3.5 accent-[#8d8d8d]" />
                  <span className="text-xs text-[#000033] underline">Total votes</span>
                </label>
              </div>
            </div>

            {/* Suggested Edits by Review Type */}
            <div className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-6">
              <h3 className="text-base font-semibold text-[#000033]">Suggested Edits by Review Type</h3>
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e0e0e0]">
                    <th className="py-3 pr-4 font-medium text-[#8d8d8d]">Review Type</th>
                    <th className="py-3 pr-4 text-right font-medium text-[#8d8d8d]">Approved</th>
                    <th className="py-3 pr-4 text-right font-medium text-[#8d8d8d]">Pending</th>
                    <th className="py-3 pr-4 text-right font-medium text-[#8d8d8d]">Rejected</th>
                    <th className="py-3 text-right font-medium text-[#8d8d8d]">Total Edits</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: "Details", approved: 200, pending: 30, rejected: 10, total: 240 },
                    { type: "Attributes", approved: 200, pending: 40, rejected: 10, total: 250 },
                    { type: "Chains", approved: 200, pending: 0, rejected: 0, total: 200 },
                    { type: "Categories", approved: 170, pending: 8, rejected: 12, total: 190 },
                    { type: "Flagged", approved: 110, pending: 10, rejected: 0, total: 120 },
                  ].map((row) => (
                    <tr key={row.type} className="border-b border-[#e0e0e0] last:border-0">
                      <td className="py-4 pr-4 font-medium text-[#000033]">{row.type}</td>
                      <td className="py-4 pr-4 text-right text-[#000033]">{row.approved}</td>
                      <td className="py-4 pr-4 text-right text-[#000033]">{row.pending}</td>
                      <td className="py-4 pr-4 text-right text-[#000033]">{row.rejected}</td>
                      <td className="py-4 text-right text-[#000033]">{row.total}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-[#000033]">
                    <td className="py-4 pr-4 font-semibold text-[#000033]">Total</td>
                    <td className="py-4 pr-4 text-right font-semibold text-[#000033]">880</td>
                    <td className="py-4 pr-4 text-right font-semibold text-[#000033]">88</td>
                    <td className="py-4 pr-4 text-right font-semibold text-[#000033]">32</td>
                    <td className="py-4 text-right font-semibold text-[#000033]">1,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* New places added */}
            <div className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-6">
              <h3 className="text-base font-semibold text-[#000033]">New places added</h3>
              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={placesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} width={30} domain={[0, 50]} label={{ value: "# of places", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 11, fill: "#8d8d8d" } }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 12 }} />
                    <Line type="monotone" dataKey="places" stroke="#212be9" strokeWidth={2} dot={false} name="New places" />
                  </LineChart>
                </ResponsiveContainer>
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
    </div>
  );
}

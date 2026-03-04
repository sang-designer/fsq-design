"use client";

import {
  LayoutDashboard, Wrench, LineChart as LineChartIcon, Users as UsersIcon, Receipt, Settings,
  ChevronRight, ChevronDown, Search, PanelLeftClose, Check, Building,
  Info, FileText, User, LayoutGrid, Copy, Trash2, Settings2,
  ChevronsLeft, ChevronLeft, ChevronRight as ChevronRightIcon, ChevronsRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";

const votesChartData = [
  { date: "Mar 1", details: 8, attributes: 5, chains: 3, categories: 10, flagged: 6 },
  { date: "Mar 3", details: 12, attributes: 8, chains: 5, categories: 7, flagged: 4 },
  { date: "Mar 5", details: 15, attributes: 22, chains: 10, categories: 12, flagged: 8 },
  { date: "Mar 7", details: 20, attributes: 18, chains: 8, categories: 15, flagged: 6 },
  { date: "Mar 9", details: 18, attributes: 25, chains: 12, categories: 10, flagged: 10 },
  { date: "Mar 11", details: 25, attributes: 20, chains: 15, categories: 18, flagged: 12 },
  { date: "Mar 13", details: 30, attributes: 28, chains: 10, categories: 22, flagged: 8 },
  { date: "Mar 15", details: 35, attributes: 32, chains: 18, categories: 25, flagged: 15 },
  { date: "Mar 17", details: 28, attributes: 38, chains: 14, categories: 20, flagged: 10 },
  { date: "Mar 19", details: 40, attributes: 30, chains: 12, categories: 28, flagged: 18 },
  { date: "Mar 21", details: 45, attributes: 35, chains: 16, categories: 15, flagged: 12 },
  { date: "Mar 23", details: 38, attributes: 42, chains: 20, categories: 18, flagged: 14 },
  { date: "Mar 25", details: 48, attributes: 28, chains: 15, categories: 22, flagged: 10 },
  { date: "Mar 27", details: 35, attributes: 45, chains: 18, categories: 14, flagged: 8 },
  { date: "Mar 30", details: 42, attributes: 38, chains: 12, categories: 20, flagged: 12 },
];

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/devconsole" },
  { label: "Projects", icon: Wrench, active: true, href: "/devconsole/projects" },
  { label: "Usage Metrics", icon: LineChartIcon, href: "/devconsole/usage-metrics" },
  { label: "Explore FSQ", icon: UsersIcon, href: "/devconsole/explore-fsq" },
  { label: "Billing", icon: Receipt, href: "/devconsole/billing" },
];

const serviceApiKeys = [
  { name: "autocomplete", date: "03/23/2025" },
  { name: "none-complete", date: "03/23/2025" },
  { name: "Service_API_Name2", date: "03/23/2025" },
];

const legacyApiKeys = [
  { name: "Key name 1", date: "03/23/2025" },
];

type Org = { name: string; color: string };
const orgColors = ["#9809bc", "#0891b2", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed"];

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);
  const projectName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [activeTab, setActiveTab] = useState<"APIs" | "Placemaker" | "Movement SDK">("APIs");
  const [activeSubTab, setActiveSubTab] = useState<"Settings" | "Usage">("Settings");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [pushNotification, setPushNotification] = useState("Disable push notification");

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

  useEffect(() => {
    if (copiedField) {
      const t = setTimeout(() => setCopiedField(null), 2000);
      return () => clearTimeout(t);
    }
  }, [copiedField]);

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
  }

  const clientId = "GQAF4E3FRGW1WWNUEIIIBJHZMDHKLUU2EJ5BQC0FG1NIQQO";
  const clientSecret = "GQAF4E3FRGW1WWNUEIIIBJHZMDHKLUU2EJ5BQC0FG1NIQQO";

  const tabs = ["APIs", "Placemaker", "Movement SDK"] as const;
  const subTabs = ["Settings", "Usage"] as const;

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
        <main className="flex-1 overflow-y-auto px-10 py-6">
          <div className="mx-auto max-w-[660px]">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm">
              <button onClick={() => router.push("/devconsole/projects")} className="text-[#646464] hover:text-[#000033] hover:underline">
                Projects
              </button>
              <ChevronRight className="size-4 text-[#646464]" />
              <span className="font-medium text-black">{projectName}</span>
            </nav>

            {/* Title */}
            <h1 className="mt-3 text-[32px] font-semibold leading-9 tracking-[-0.5px] text-black">{projectName}</h1>
            <p className="mt-1 text-sm text-[#646464]">Project descriptions...</p>

            {/* Main tabs */}
            <div className="mt-4 flex gap-6 border-b border-[#e0e0e0]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm transition-colors ${activeTab === tab ? "border-b-2 border-[#000033] font-semibold text-[#000033]" : "text-[#646464] hover:text-[#000033]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "APIs" && (
              <>
                {/* Sub tabs */}
                <div className="mt-3 inline-flex gap-2 rounded-lg bg-[#f0f0f0] p-1">
                  {subTabs.map((st) => (
                    <button
                      key={st}
                      onClick={() => setActiveSubTab(st)}
                      className={`rounded-lg px-2 py-1 text-sm transition-colors ${activeSubTab === st ? "bg-white font-medium text-[#000033] shadow-sm" : "text-[#000033] hover:text-[#000033]/70"}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {activeSubTab === "Settings" && (
                  <div className="mt-6 flex flex-col gap-6">
                    {/* Service API Keys */}
                    <section className="rounded-lg border border-[#e0e0e0] bg-white p-6">
                      <h2 className="text-xl font-semibold text-black">Service API Keys</h2>
                      <p className="mt-2 text-sm text-[#000033]">
                        Create a Service API key on behalf of your application in order to generate OAuth tokens for Managed Users. You can have up to 10 keys per project.
                      </p>
                      <button className="mt-4 rounded-md border border-[#000033] px-4 py-2 text-sm font-medium text-[#000033] hover:bg-gray-50">
                        Generate API Key
                      </button>

                      <div className="mt-4">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-[#e0e0e0]">
                              <th className="py-3 pr-4 text-sm font-medium text-[#8d8d8d]">Service API Key name</th>
                              <th className="py-3 pr-4 text-sm font-medium text-[#8d8d8d]">Date generated</th>
                              <th className="w-[40px] py-3" />
                            </tr>
                          </thead>
                          <tbody>
                            {serviceApiKeys.map((key) => (
                              <tr key={key.name} className="border-b border-[#e0e0e0] last:border-0">
                                <td className="py-3 pr-4 font-mono text-sm text-[#212be9]">{key.name}</td>
                                <td className="py-3 pr-4 text-sm text-[#000033]">{key.date}</td>
                                <td className="py-3">
                                  <button className="text-[#212be9] hover:text-red-500"><Trash2 className="size-4" /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* OAuth Authentication */}
                    <section className="rounded-lg border border-[#e0e0e0] bg-white p-6">
                      <h2 className="text-xl font-semibold text-black">OAuth Authentication</h2>

                      <div className="mt-5 flex flex-col gap-5">
                        <div>
                          <label className="text-sm font-semibold text-black">Client Id</label>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="flex h-10 flex-1 items-center rounded-md border border-[#e0e0e0] bg-[#fcfcfc] px-3">
                              <span className="flex-1 truncate font-mono text-sm text-[#000033]">{clientId}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(clientId, "clientId")}
                              className="flex size-10 items-center justify-center rounded-md border border-[#e0e0e0] hover:bg-gray-50"
                            >
                              <Copy className="size-4 text-[#646464]" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-black">Client Secret</label>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="flex h-10 flex-1 items-center rounded-md border border-[#e0e0e0] bg-[#fcfcfc] px-3">
                              <span className="flex-1 truncate font-mono text-sm text-[#000033]">{clientSecret}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(clientSecret, "clientSecret")}
                              className="flex size-10 items-center justify-center rounded-md border border-[#e0e0e0] hover:bg-gray-50"
                            >
                              <Copy className="size-4 text-[#646464]" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-black">Project URL</label>
                          <input
                            defaultValue="http://www.yourproject.com"
                            className="mt-1.5 h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-[#000033] outline-none placeholder:text-[#8d8d8d] transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-black">Privacy Policy URL</label>
                          <input
                            defaultValue="http://www.yourproject.com/privacy"
                            className="mt-1.5 h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-[#000033] outline-none placeholder:text-[#8d8d8d] transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-black">Redirect URL</label>
                          <input
                            defaultValue="http://www.yourproject.com/redirect"
                            className="mt-1.5 h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-[#000033] outline-none placeholder:text-[#8d8d8d] transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
                          />
                        </div>

                        <button className="self-start text-sm font-medium text-red-500 hover:underline">
                          Reset client secret
                        </button>
                      </div>
                    </section>

                    {/* Legacy API Keys */}
                    <section className="rounded-lg border border-[#e0e0e0] bg-white p-6">
                      <h2 className="text-xl font-semibold text-black">Legacy API Keys</h2>
                      <p className="mt-2 text-sm text-[#000033]">
                        The Legacy Places API and the Map SDK use these API keys to authenticate. You can have up to five keys per project. Note that you can migrate your usage of API Keys in the Legacy Places API to use Service API Keys instead. Learn more about Places API authentication.
                      </p>

                      <div className="mt-4">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-[#e0e0e0]">
                              <th className="py-3 pr-4 text-sm font-medium text-[#8d8d8d]">API Key name</th>
                              <th className="py-3 pr-4 text-sm font-medium text-[#8d8d8d]">Date generated</th>
                              <th className="py-3 pr-4 text-sm font-medium text-[#8d8d8d]">API Restrictions</th>
                              <th className="w-[40px] py-3" />
                            </tr>
                          </thead>
                          <tbody>
                            {legacyApiKeys.map((key) => (
                              <tr key={key.name} className="border-b border-[#e0e0e0] last:border-0">
                                <td className="py-3 pr-4 text-sm text-[#000033]">{key.name}</td>
                                <td className="py-3 pr-4 text-sm text-[#000033]">{key.date}</td>
                                <td className="py-3 pr-4">
                                  <button className="flex items-center gap-1 text-sm text-[#212be9] hover:underline">
                                    <Settings2 className="size-3.5" /> Modify
                                  </button>
                                </td>
                                <td className="py-3">
                                  <button className="text-[#212be9] hover:text-red-500"><Trash2 className="size-4" /></button>
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
                              <option value={10}>10</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-3 -translate-y-1/2 text-[#646464]" />
                          </div>
                        </div>
                        <span>Page 1 of 10</span>
                        <div className="flex gap-1">
                          <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] disabled:opacity-30" disabled><ChevronsLeft className="size-4" /></button>
                          <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] disabled:opacity-30" disabled><ChevronLeft className="size-4" /></button>
                          <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50"><ChevronRightIcon className="size-4" /></button>
                          <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50"><ChevronsRight className="size-4" /></button>
                        </div>
                      </div>
                    </section>

                    {/* Push API */}
                    <section className="rounded-lg border border-[#e0e0e0] bg-white p-6">
                      <h2 className="text-xl font-semibold text-black">Push API</h2>
                      <div className="mt-4">
                        <label className="text-sm font-semibold text-black">Push notifications</label>
                        <div className="relative mt-1.5">
                          <select
                            value={pushNotification}
                            onChange={(e) => setPushNotification(e.target.value)}
                            className="h-10 w-full appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
                          >
                            <option>Disable push notification</option>
                            <option>Enable push notification</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
                        </div>
                      </div>
                    </section>

                    {/* Delete project */}
                    <button className="self-start rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
                      Delete this project
                    </button>
                  </div>
                )}

                {activeSubTab === "Usage" && (
                  <div className="mt-6 flex items-center justify-center rounded-lg border border-[#e0e0e0] bg-white p-12">
                    <p className="text-sm text-[#646464]">Usage data coming soon.</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "Placemaker" && (
              <>
                {/* Sub tab */}
                <div className="mt-3 inline-flex gap-2 rounded-lg bg-[#f0f0f0] p-1">
                  <button className="rounded-lg bg-white px-2 py-1 text-sm font-medium text-[#000033] shadow-sm">Activity</button>
                </div>

                {/* Time period selector */}
                <div className="mt-6 rounded-lg border border-[#e0e0e0] bg-white p-6">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[#000033]">Select time period</span>
                    <div className="relative">
                      <select className="h-10 w-[200px] appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>Last 90 days</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
                    </div>
                    <div className="flex h-10 items-center gap-2 rounded-md border border-[#e0e0e0] bg-white px-3">
                      <span className="text-sm text-[#000033]">March 1, 2025</span>
                    </div>
                    <div className="flex h-10 items-center gap-2 rounded-md border border-[#e0e0e0] bg-white px-3">
                      <span className="text-sm text-[#000033]">March 30, 2025</span>
                    </div>
                  </div>
                </div>

                {/* Metric cards */}
                <div className="mt-4 flex gap-4">
                  {[
                    { label: "Active users", value: "5,409", change: "18%" },
                    { label: "Votes", value: "569", change: "3%" },
                    { label: "New places", value: "341", change: "13%" },
                  ].map((m) => (
                    <div key={m.label} className="flex-1 rounded-lg border border-[#e0e0e0] bg-white p-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-[#000033]">{m.label}</span>
                        <Info className="size-3.5 text-[#8d8d8d]" />
                      </div>
                      <div className="mt-2 flex items-end gap-3">
                        <span className="text-[32px] font-semibold leading-none text-[#000033]">{m.value}</span>
                        <span className="mb-1 text-sm text-[#16a34a]">↗ {m.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Votes by Review Type */}
                <div className="mt-4 rounded-lg border border-[#e0e0e0] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#000033]">Votes by Review Type</h3>
                  </div>
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
              </>
            )}

            {activeTab === "Movement SDK" && (
              <div className="mt-6 w-[440px] rounded-lg border border-[#e0e0e0] bg-white p-8">
                <div className="flex justify-center">
                  <div className="flex h-[140px] w-[200px] items-center justify-center">
                    <svg viewBox="0 0 200 140" className="size-full text-[#212be9]" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="40" y="60" width="120" height="4" rx="2" fill="currentColor" opacity="0.3" />
                      <rect x="30" y="50" width="140" height="4" rx="2" fill="currentColor" opacity="0.15" />
                      <rect x="70" y="30" width="15" height="35" rx="2" fill="currentColor" opacity="0.5" />
                      <rect x="90" y="20" width="20" height="45" rx="2" fill="currentColor" opacity="0.6" />
                      <rect x="115" y="25" width="15" height="40" rx="2" fill="currentColor" opacity="0.4" />
                      <rect x="50" y="40" width="12" height="25" rx="2" fill="currentColor" opacity="0.35" />
                      <rect x="135" y="35" width="12" height="30" rx="2" fill="currentColor" opacity="0.45" />
                      <circle cx="105" cy="15" r="4" fill="currentColor" opacity="0.7" />
                      <line x1="105" y1="19" x2="105" y2="25" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm leading-relaxed text-[#646464]">
                  Contact us for access to embed the most comprehensive location awareness engine into your iOS and Android applications to engage users with contextually-relevant and geo-aware content.
                </p>
                <button className="mt-6 w-full rounded-md bg-[#212be9] py-2.5 text-sm font-medium text-white hover:bg-[#1a22c4]">
                  Apply for access
                </button>
                <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-[#e0e0e0] py-2.5 text-sm font-medium text-[#212be9] hover:bg-[#f5f5ff]">
                  Learn more
                  <svg className="size-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 3.5L3.5 10.5M10.5 3.5H5.25M10.5 3.5V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
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

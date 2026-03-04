"use client";

import {
  LayoutDashboard, Wrench, LineChart, Users, Receipt, Settings,
  ChevronRight, ChevronDown, Search, PanelLeftClose, Check, Building,
  Info, FileText, User, LayoutGrid, Pencil, Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import OverviewTab from "./overview-tab";
import PaymentMethodsTab from "./payment-methods-tab";
import BillingSummaryTab from "./billing-summary-tab";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/devconsole" },
  { label: "Projects", icon: Wrench, href: "/devconsole/projects" },
  { label: "Usage Metrics", icon: LineChart, href: "/devconsole/usage-metrics" },
  { label: "Explore FSQ", icon: Users, href: "/devconsole/explore-fsq" },
  { label: "Billing", icon: Receipt, active: true },
];

const tabs = ["Overview", "Payment Methods", "Billing Summary"] as const;
type Tab = (typeof tabs)[number];

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

export default function BillingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
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

  function handleCreateOrg(form: { name: string }) {
    const color = orgColors[orgs.length % orgColors.length];
    setOrgs((prev) => [...prev, { name: form.name, color }]);
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
                    <button onClick={() => { setShowCreateModal(true); setOrgDropdownOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50">
                      <Building className="size-4 text-[#000033]" />
                      <span className="text-[#000033]">Create organization</span>
                    </button>
                  </div>
                )}
              </div>
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <button key={item.label} onClick={() => { if ("href" in item && item.href) router.push(item.href); }} className={`flex items-center gap-2 rounded px-2 py-2 text-sm ${item.active ? "bg-[#ebf1ff] font-semibold text-[#000033]" : "font-normal text-[#000033] hover:bg-gray-50"}`}>
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
          <div className="mx-auto max-w-[800px]">
            {/* Title + Org badge */}
            <div className="flex items-center gap-3">
              <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-black">Billing</h1>
              <div className="flex items-center gap-0.5 rounded-full px-2 py-0.5" style={{ backgroundColor: currentOrg.color }}>
                <span className="text-xs font-semibold text-white">{activeOrg}</span>
                <Pencil className="size-3 text-white" />
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-6 border-b border-[#e0e0e0]">
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

            {/* Tab content */}
            <div className="mt-6">
              {activeTab === "Overview" && <OverviewTab />}
              {activeTab === "Payment Methods" && <PaymentMethodsTab />}
              {activeTab === "Billing Summary" && <BillingSummaryTab />}
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

      {showCreateModal && <CreateOrgModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateOrg} />}
    </div>
  );
}

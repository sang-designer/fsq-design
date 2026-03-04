"use client";

import {
  LayoutDashboard, Wrench, LineChart, Users, Receipt, Settings,
  ChevronRight, ChevronDown, Search, PanelLeftClose, Check, Building,
  Info, FileText, User, LayoutGrid, ExternalLink, FileText as FileTextIcon,
  MessageCircle, Hash,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/devconsole" },
  { label: "Projects", icon: Wrench, href: "/devconsole/projects" },
  { label: "Usage Metrics", icon: LineChart, href: "/devconsole/usage-metrics" },
  { label: "Explore FSQ", icon: Users, active: true },
  { label: "Billing", icon: Receipt, href: "/devconsole/billing" },
];

const caseStudies = [
  {
    title: "Engineering the Spatial Foundation for FSQ OS Places",
    body: "Part 1: Fixing Spatial Inconsistencies through Open Geocoders Foursquare OS Places is a comprehensive dataset of real-world locations encompassing commercial establishments, architectural landmarks, transportation hubs, healthcare centers, and other points of interest across the global landscape. Our unique Places Engine leverages a combination of human and agentic workforces in a collaborative crowd-sourced system to build [...]",
    large: true,
  },
  {
    title: "How Foursquare Helped a QSR Quantify Success",
    body: "Read more..",
    large: false,
  },
  {
    title: "Building for Speed: Why Culture Change Starts with Performance",
    body: "Read more..",
    large: false,
  },
];

const helpfulLinks = [
  "Get Started with the Places API",
  "Get Started with the Movement SDK",
  "Pay As You Go FAQs",
];

const products = [
  {
    title: "Product 1",
    body: "Since its launch, Kepler.gl has transformed how data scientists extract insights from location data, pioneering ...",
  },
  {
    title: "Product 2",
    body: "Today marks a pivotal milestone in our journey towards building the most comprehensive and accurate dataset of real-world places:",
  },
  {
    title: "Product 3",
    body: "At each stage of rapid technology expansion and adoption, one can identify core open source software that led...",
  },
  {
    title: "Product 4",
    body: "At each stage of rapid technology expansion and adoption, one can identify core open source software that...",
  },
];

const communities = [
  { name: "Discord", icon: MessageCircle, description: "Meet FSQ users and discover what they are building." },
  { name: "X", icon: () => <span className="text-lg font-bold text-[#000033]">𝕏</span>, description: "Meet FSQ users and discover what they are building." },
  { name: "Slack", icon: Hash, description: "Meet FSQ users and discover what they are building." },
];

type Org = { name: string; color: string };
const orgColors = ["#9809bc", "#0891b2", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed"];

export default function ExploreFSQPage() {
  const router = useRouter();
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
          <div className="mx-auto max-w-[800px]">
            {/* Title */}
            <h1 className="text-[32px] font-semibold leading-9 tracking-[-0.5px] text-black">Explore FSQ</h1>
            <p className="mt-2 text-sm text-[#646464]">The best of APIs, data, and workspaces handpicked by Foursquare.</p>

            {/* Start building */}
            <h2 className="mt-8 text-xl font-semibold text-black">Start building</h2>
            <p className="mt-2 text-sm text-[#646464]">Trending case studies this month</p>

            {/* Case studies grid */}
            <div className="mt-4 grid grid-cols-[1fr_auto] grid-rows-2 gap-3">
              {/* Large card */}
              <div className="row-span-2 rounded-lg border border-[#212be9]/30 bg-[#f5f5ff] p-5">
                <h3 className="text-sm font-semibold text-[#212be9]">{caseStudies[0].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#000033]">{caseStudies[0].body}</p>
              </div>
              {/* Small card 1 */}
              <div className="w-[240px] rounded-lg border border-[#212be9]/30 bg-[#f5f5ff] p-5">
                <h3 className="text-sm font-semibold text-[#212be9]">{caseStudies[1].title}</h3>
                <p className="mt-2 text-sm text-[#646464]">{caseStudies[1].body}</p>
              </div>
              {/* Small card 2 */}
              <div className="w-[240px] rounded-lg border border-[#212be9]/30 bg-[#f5f5ff] p-5">
                <h3 className="text-sm font-semibold text-[#212be9]">{caseStudies[2].title}</h3>
                <p className="mt-2 text-sm text-[#646464]">{caseStudies[2].body}</p>
              </div>
            </div>

            {/* Helpful links */}
            <h3 className="mt-8 text-base font-semibold text-[#000033]">Helpful links</h3>
            <div className="mt-3 flex gap-3">
              {helpfulLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="flex items-center gap-1.5 rounded-lg border border-[#e0e0e0] bg-white px-4 py-3 text-sm font-medium text-[#000033] shadow-sm hover:bg-gray-50"
                >
                  {link}
                  <ExternalLink className="size-3.5 text-[#646464]" />
                </a>
              ))}
            </div>

            {/* Building the #1 location technology platform */}
            <p className="mt-8 text-sm font-medium text-[#646464]">Building the #1 location technology platform</p>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {products.map((product) => (
                <div key={product.title} className="rounded-lg border border-[#e0e0e0] bg-white p-4 shadow-sm">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-[#e0e0e0]">
                    <FileTextIcon className="size-5 text-[#000033]" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-[#000033]">{product.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#646464]">{product.body}</p>
                </div>
              ))}
            </div>

            {/* Communities */}
            <h3 className="mt-8 text-base font-semibold text-[#000033]">Communities</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {communities.map((c) => (
                <div key={c.name} className="rounded-lg border border-[#e0e0e0] bg-white p-4 shadow-sm hover:border-[#212be9]/30 hover:shadow-md">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#f5f5f5]">
                    <c.icon className="size-5 text-[#000033]" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-[#000033]">{c.name}</h4>
                  <p className="mt-1 text-xs text-[#646464]">{c.description}</p>
                </div>
              ))}
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

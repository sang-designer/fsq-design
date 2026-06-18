"use client";

import { Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, GripVertical, Info, CircleAlert, CircleDashed, FileText, UserCircle, Grid3X3, LogOut, Download, Upload, MousePointerClick, ArrowRight, X, Search, SlidersHorizontal, Loader2, ArrowUpDown, SquarePen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect, DragEvent } from "react";
import { Badge } from "@/components/ui/badge";

type Token = { id: string; name: string };
type TaxonomyCategory = { id: string; name: string; count: number; tokens: Token[] };

const INITIAL_TOKENS: Token[] = [
  { id: "token-1", name: "MCD_Display_Q1_Awareness" },
  { id: "token-2", name: "MCD_Video_PreRoll_30s" },
  { id: "token-3", name: "MCD_CTV_Hulu_Breakfast" },
  { id: "token-4", name: "MCD_Mobile_InApp_GeoFence" },
  { id: "token-5", name: "MCD_Audio_Spotify_Drive" },
  { id: "token-6", name: "MCD_Social_Meta_Reels" },
  { id: "token-7", name: "MCD_Native_Outbrain_Q2" },
  { id: "token-8", name: "MCD_Display_Retarget_LunchDeal" },
  { id: "token-9", name: "MCD_Video_YouTube_McFlurry" },
  { id: "token-10", name: "MCD_DOOH_Billboard_NYC" },
  { id: "token-11", name: "MCD_Programmatic_DV360_ValueMeal" },
  { id: "token-12", name: "MCD_CTV_Peacock_FamilyMeal" },
  { id: "token-13", name: "MCD_Search_Google_BrandTerms" },
  { id: "token-14", name: "MCD_Display_300x250_McCrispy" },
  { id: "token-15", name: "MCD_Mobile_320x50_AppPromo" },
  { id: "token-16", name: "MCD_Audio_Pandora_Morning" },
  { id: "token-17", name: "MCD_Social_TikTok_McPlant" },
  { id: "token-18", name: "MCD_Video_ConnectedTV_Q2" },
  { id: "token-19", name: "MCD_Display_728x90_HappyMeal" },
  { id: "token-20", name: "MCD_Native_Taboola_Sustainability" },
];

const INITIAL_TAXONOMIES: TaxonomyCategory[] = [
  { id: "audience", name: "Audience", count: 42, tokens: Array.from({ length: 42 }, (_, i) => ({ id: `aud-${i}`, name: `Audience_Seg_${String(i + 1).padStart(2, "0")}` })) },
  { id: "channel", name: "Channel", count: 13, tokens: Array.from({ length: 13 }, (_, i) => ({ id: `ch-${i}`, name: ["Display", "Mobile", "Video", "Audio", "CTV", "Social", "Native", "Programmatic", "Search", "Email", "DOOH", "Podcast", "Streaming"][i] })) },
  { id: "creative", name: "Creative", count: 5, tokens: [{ id: "cr-0", name: "Standard_Banner" }, { id: "cr-1", name: "Rich_Media" }, { id: "cr-2", name: "Video_Pre_Roll" }, { id: "cr-3", name: "Interactive" }, { id: "cr-4", name: "Native_Content" }] },
  { id: "creative-size", name: "Creative Ad Size", count: 3, tokens: [{ id: "cs-0", name: "300x250" }, { id: "cs-1", name: "728x90" }, { id: "cs-2", name: "320x50" }] },
  { id: "geography", name: "Geography", count: 28, tokens: Array.from({ length: 28 }, (_, i) => ({ id: `geo-${i}`, name: ["New_York", "Los_Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San_Antonio", "San_Diego", "Dallas", "San_Jose", "Austin", "Jacksonville", "Fort_Worth", "Columbus", "Charlotte", "Indianapolis", "San_Francisco", "Seattle", "Denver", "Washington_DC", "Nashville", "Oklahoma_City", "El_Paso", "Boston", "Portland", "Las_Vegas", "Memphis", "Louisville"][i] })) },
  { id: "language", name: "Language", count: 0, tokens: [] },
  { id: "publisher", name: "Publisher", count: 4, tokens: [{ id: "pub-0", name: "Google_DV360" }, { id: "pub-1", name: "Meta_Ads" }, { id: "pub-2", name: "Amazon_DSP" }, { id: "pub-3", name: "TradeDesk" }] },
  { id: "ignored", name: "Ignored", count: 0, tokens: [] },
];

const SIDEBAR_STEP_LABELS = [
  "Campaign Details",
  "Placement Details",
  "Funding Allocation",
  "Pixel Generation",
  "Review and Submit",
] as const;

const progressSteps = [
  { label: "Media Plan", done: true },
  { label: "Map Partners", done: true },
  { label: "Map Taxonomies", done: false, active: true },
  { label: "Map Creatives", done: false },
  { label: "Apply Placements", done: false },
];

type ViewMode = "taxonomy" | "apply-placements";

export default function TaxonomyPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("taxonomy");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [activeSidebarStep, setActiveSidebarStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0]));
  const [unassigned, setUnassigned] = useState<Token[]>(INITIAL_TOKENS);
  const [taxonomies, setTaxonomies] = useState<TaxonomyCategory[]>(INITIAL_TAXONOMIES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showAllTokens, setShowAllTokens] = useState<Set<string>>(new Set());
  const [dragTokenIds, setDragTokenIds] = useState<string[]>([]);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragCounter = useRef<Record<string, number>>({});
  const dragGhostRef = useRef<HTMLDivElement>(null);
  const [uploadBannerDismissed, setUploadBannerDismissed] = useState(false);
  const [placementValid, setPlacementValid] = useState(false);

  const selectedCount = selected.size;
  const allSelected = unassigned.length > 0 && selectedCount === unassigned.length;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(unassigned.map((t) => t.id)));
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDragStart = useCallback((e: DragEvent, tokenId: string) => {
    const ids = selected.has(tokenId) && selected.size > 1
      ? Array.from(selected)
      : [tokenId];
    setDragTokenIds(ids);
    e.dataTransfer.setData("text/plain", JSON.stringify(ids));
    e.dataTransfer.effectAllowed = "move";

    if (ids.length > 1 && dragGhostRef.current) {
      dragGhostRef.current.textContent = `${ids.length} items`;
      dragGhostRef.current.style.display = "flex";
      e.dataTransfer.setDragImage(dragGhostRef.current, 40, 20);
      requestAnimationFrame(() => { if (dragGhostRef.current) dragGhostRef.current.style.display = "none"; });
    }
  }, [selected]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback((e: DragEvent, catId: string) => {
    e.preventDefault();
    dragCounter.current[catId] = (dragCounter.current[catId] || 0) + 1;
    setDragOverId(catId);
  }, []);

  const handleDragLeave = useCallback((catId: string) => {
    dragCounter.current[catId] = (dragCounter.current[catId] || 0) - 1;
    if (dragCounter.current[catId] <= 0) {
      dragCounter.current[catId] = 0;
      setDragOverId((prev) => (prev === catId ? null : prev));
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent, catId: string) => {
    e.preventDefault();
    dragCounter.current[catId] = 0;
    setDragOverId(null);

    let ids: string[];
    try {
      ids = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch {
      ids = dragTokenIds;
    }
    if (!ids.length) return;

    const droppedTokens = unassigned.filter((t) => ids.includes(t.id));
    if (!droppedTokens.length) return;

    setUnassigned((prev) => prev.filter((t) => !ids.includes(t.id)));
    setTaxonomies((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, count: cat.count + droppedTokens.length, tokens: [...cat.tokens, ...droppedTokens] }
          : cat
      )
    );
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setDragTokenIds([]);
  }, [unassigned, dragTokenIds]);

  const handleDragEnd = useCallback(() => {
    setDragTokenIds([]);
    setDragOverId(null);
    dragCounter.current = {};
  }, []);

  const removeToken = useCallback((catId: string, token: Token) => {
    setTaxonomies((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, count: cat.count - 1, tokens: cat.tokens.filter((t) => t.id !== token.id) }
          : cat
      )
    );
    setUnassigned((prev) => [...prev, token]);
  }, []);

  const moveSelectedToCategory = useCallback((catId: string) => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    const droppedTokens = unassigned.filter((t) => ids.includes(t.id));
    if (!droppedTokens.length) return;
    setUnassigned((prev) => prev.filter((t) => !ids.includes(t.id)));
    setTaxonomies((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, count: cat.count + droppedTokens.length, tokens: [...cat.tokens, ...droppedTokens] }
          : cat
      )
    );
    setSelected(new Set());
  }, [selected, unassigned]);

  const completionPercent = Math.round((completedSteps.size / SIDEBAR_STEP_LABELS.length) * 100);

  const handleSidebarStepClick = (index: number) => {
    const stepRoutes = [
      "/attribution/new?step=campaign",
      null, // Placement Details — current page
      "/attribution/new?step=funding",
      "/attribution/new?step=pixel",
      "/attribution/taxonomy/review",
    ];
    const route = stepRoutes[index];
    if (route) {
      router.push(route);
    } else {
      setActiveSidebarStep(index);
      setViewMode("taxonomy");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <div ref={dragGhostRef} className="pointer-events-none fixed left-[-9999px] top-[-9999px] z-[9999] hidden items-center gap-1.5 rounded-lg bg-[#1f2937] px-3 py-1.5 text-xs font-medium text-white shadow-lg" />
      <Header userMenuOpen={userMenuOpen} setUserMenuOpen={setUserMenuOpen} />

      <div className="sticky top-0 z-30 bg-white">
        <div className="flex items-center justify-between px-12 py-2.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-[#020617]">QSR Q2 2026 Campaign</h1>
              <span className="rounded-full bg-[#ebf1ff] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#212be9]">{completionPercent}%</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-2 py-1 text-sm font-medium text-[#dc2626]">Remove</button>
              <button className="px-2 py-1 text-sm font-medium text-[#212be9]">Save Draft</button>
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full bg-[#ebf1ff]"><div className="h-full bg-[#212be9] transition-all duration-700 ease-out" style={{ width: `${completionPercent}%` }} /></div>
      </div>

      {!uploadBannerDismissed && (
        <div className="px-12 pt-6">
          <div className="flex items-center gap-2 rounded-md border border-[#e0e0e0] bg-[#fcfcfc] p-4 shadow-sm">
            <div className="flex min-w-[180px] flex-col gap-2">
              <p className="text-base font-semibold text-black">Upload Results</p>
              <div className="flex items-center gap-1">
                <FileText className="size-4 text-[#8d8d8d]" />
                <span className="text-xs text-black">Carta/Mcdonalds2024</span>
              </div>
            </div>
            <div className="flex flex-1 items-stretch">
              {[
                { label: "Campaign Details", status: "success" as const },
                { label: "Partner Details", status: "success" as const },
                { label: "Funding Allocation", status: "success" as const },
                { label: "Pixel Generation", status: "success" as const },
                { label: "Placement Details", status: placementValid ? "success" as const : "warning" as const },
              ].map((item, i) => (
                <div key={item.label} className="flex flex-1 items-stretch">
                  {i > 0 && <div className="mx-0 w-px self-stretch bg-[#e0e0e0]" />}
                  <div className="flex flex-1 flex-col items-start gap-2 px-4">
                    <p className="text-sm font-medium text-black">{item.label}</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.status === "success" ? "bg-[#f0fdf4] text-[#166534]" :
                      item.status === "warning" ? "bg-[#fefce8] text-[#713f12]" :
                      "bg-[#fef2f2] text-[#dc2626]"
                    }`}>
                      {item.status === "success" ? "Successfully Processed" :
                       item.status === "warning" ? "Missing Information" :
                       "No Information Available"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setUploadBannerDismissed(true)} className="shrink-0 self-start pl-6 text-[#8d8d8d] hover:text-[#171417]">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex w-full gap-6 px-12 py-6">
        {/* Left sidebar */}
        <aside className="w-[280px] shrink-0">
          <nav className="space-y-2">
            {SIDEBAR_STEP_LABELS.map((label, i) => {
              const isActive = i === activeSidebarStep;
              const isDone = completedSteps.has(i);
              return (
                <button
                  key={label}
                  onClick={() => handleSidebarStepClick(i)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${isActive ? "bg-[#ebf1ff] text-[#020617]" : "text-[#020617] hover:bg-gray-50"}`}
                >
                  <span className="flex-1 pl-1">{label}</span>
                  {isDone && <Check className="size-4 text-[#212be9]" />}
                  {isActive && !isDone && <CircleDashed className="size-4 text-[#020617]" />}
                </button>
              );
            })}
          </nav>
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-[#1f2430]">Attachments</h3>
            <div className="mt-3 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1f2430]">Carta/Mcdonalds2024</p>
                  <p className="text-xs text-[#6b7280]">Uploaded today ago by Eric...</p>
                </div>
                <button className="text-[#2d46f6]"><Download className="size-4" /></button>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-dashed border-border py-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-sm text-[#2d46f6]">
                <Upload className="size-4" />
                <span>Replace Uploaded File</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-[#6b7280]">Supported file types: .xls, .xlsx, .csv</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="relative min-w-0 flex-1">
          {uploadBannerDismissed && (
            <div className="group absolute right-0 top-0 z-10">
              <button
                onClick={() => setUploadBannerDismissed(false)}
                className="flex size-8 items-center justify-center rounded-full border border-[#e0e0e0] bg-[#fcfcfc] text-[#8d8d8d] shadow-sm transition-colors hover:border-[#212be9] hover:bg-[#eff0fd] hover:text-[#212be9]"
              >
                <Info className="size-4" />
              </button>
              <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-max rounded-md bg-[#171417] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Show Upload Results
              </div>
            </div>
          )}
          {viewMode === "taxonomy" ? (
            <>
              {/* Stage title */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#1f2430]">Placement Details</h2>
                <p className="mt-1 text-sm text-[#6b7280]">Upload a campaign media plan, map any unique or incomplete placement values, and update placement data.</p>
              </div>

              {/* Step progresser */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-0">
                  <div className="h-1 flex-1 rounded-full bg-[#020617]" />
                  <div className="h-1 flex-1 rounded-full bg-[#020617]" />
                  <div className="h-1 flex-1 rounded-full bg-[#020617]" />
                  <div className="h-1 flex-1 rounded-full bg-gray-200" />
                </div>
                <div className="flex">
                  {progressSteps.map((step, i) => (
                    <div key={step.label} className="flex flex-1 items-center gap-2">
                      {step.done ? (
                        <div className="flex size-6 items-center justify-center rounded-full border border-[#d1d5db] bg-white"><Check className="size-3.5 text-[#9ca3af]" /></div>
                      ) : (
                        <div className={`flex size-6 items-center justify-center rounded-full border-2 text-xs font-semibold ${step.active ? "border-[#020617] bg-[#020617] text-white" : "border-gray-300 text-gray-400"}`}>{i + 1}</div>
                      )}
                      <span className={`text-sm ${step.active ? "font-semibold text-[#1f2430]" : step.done ? "text-[#1f2430]" : "text-[#6b7280]"}`}>{step.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-sm text-[#6b7280]">Map unassigned values on the left to an assigned common media taxonomy on the right. You can assign one or more values at a time. <button onClick={() => { if (typeof window !== "undefined" && localStorage.getItem("hide-taxonomy-onboarding")) return; setOnboardingStep(0); setShowOnboarding(true); }} className="inline font-medium text-[#2d46f6] hover:underline">How it works</button></p>
                </div>
              </div>

              {/* Token Mapper */}
              <div className="flex gap-4">
                {/* Unassigned */}
                <div className="flex-1">
                  <h3 className="mb-2 text-base font-semibold text-[#1f2430]">Unassigned Values</h3>
                  <div className="rounded-lg border border-border">
                    <div className="flex items-center gap-4 border-b border-border px-4 py-2">
                      <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="size-4 rounded border-gray-300 accent-[#2d46f6]" />
                      <span className="text-xs text-[#6b7280]">select all ({selectedCount} selected)</span>
                    </div>
                    <div className="max-h-[540px] overflow-y-auto">
                      {unassigned.map((token) => {
                        const isDragging = dragTokenIds.includes(token.id);
                        return (
                          <div
                            key={token.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, token.id)}
                            onDragEnd={handleDragEnd}
                            className={`group flex cursor-grab items-center gap-3 border-b border-border/50 px-4 py-1.5 text-sm transition-colors active:cursor-grabbing ${selected.has(token.id) ? "bg-[#eef2ff]" : "hover:bg-gray-50"} ${isDragging ? "opacity-40" : ""}`}
                          >
                            <GripVertical className="size-4 shrink-0 text-[#9ca3af] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <input
                              type="checkbox"
                              checked={selected.has(token.id)}
                              onChange={() => toggleSelect(token.id)}
                              className="size-4 shrink-0 rounded border-gray-300 accent-[#2d46f6]"
                            />
                            <span className="text-[#1f2430]">{token.name}</span>
                          </div>
                        );
                      })}
                      {unassigned.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-[#6b7280]">All tokens have been assigned.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned Taxonomy Values */}
                <div className="w-[420px] shrink-0">
                  <h3 className="mb-2 text-base font-semibold text-[#1f2430]">Assigned Taxonomy Values</h3>
                  <div className="rounded-lg border border-border">
                    <div className="max-h-[540px] overflow-y-auto p-2 space-y-1.5">
                      {taxonomies.map((cat) => {
                        const isOver = dragOverId === cat.id;
                        const isExpanded = expanded.has(cat.id);
                        return (
                          <div
                            key={cat.id}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, cat.id)}
                            onDragLeave={() => handleDragLeave(cat.id)}
                            onDrop={(e) => handleDrop(e, cat.id)}
                            className={`rounded-lg border transition-all ${isOver ? "border-[#2d46f6] bg-[#eef2ff] shadow-sm" : "border-border bg-white"}`}
                          >
                            <button
                              onClick={() => toggleExpand(cat.id)}
                              className="flex w-full items-center gap-2 px-3 py-3 text-left"
                            >
                              <span className="flex-1 text-sm font-medium text-[#1f2430]">{cat.name}</span>
                              <Info className="size-4 text-[#9ca3af]" />
                              <span className="min-w-[24px] text-right text-sm tabular-nums text-[#6b7280]">{cat.count}</span>
                              {isExpanded ? <ChevronUp className="size-4 text-[#6b7280]" /> : <ChevronDown className="size-4 text-[#6b7280]" />}
                            </button>
                            {isExpanded && cat.tokens.length > 0 && (
                              <div className="border-t border-border px-3 pb-3 pt-2">
                                <div className="flex flex-wrap gap-1.5">
                                  {(showAllTokens.has(cat.id) ? cat.tokens : cat.tokens.slice(0, 5)).map((t) => (
                                    <Badge key={t.id} className="gap-1 bg-[#f3f4f6] pr-1 text-[#1f2430]">
                                      {t.name}
                                      <button onClick={(e) => { e.stopPropagation(); removeToken(cat.id, t); }} className="rounded-full p-0.5 text-[#9ca3af] hover:bg-[#e5e7eb] hover:text-[#374151]">
                                        <X className="size-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                                {cat.tokens.length > 5 && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setShowAllTokens((prev) => { const next = new Set(prev); if (next.has(cat.id)) next.delete(cat.id); else next.add(cat.id); return next; }); }}
                                    className="mt-2 text-xs font-medium text-[#2d46f6] hover:underline"
                                  >
                                    {showAllTokens.has(cat.id) ? "Show less" : `+${cat.tokens.length - 5} more`}
                                  </button>
                                )}
                              </div>
                            )}
                            {isExpanded && cat.tokens.length === 0 && (
                              <div className="border-t border-border px-3 py-3 text-xs text-[#6b7280]">Drop tokens here to assign them.</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-between">
                <Link href="/attribution/new?step=map-partners" className="rounded-lg border border-[#2d46f6] px-5 py-2 text-sm font-medium text-[#2d46f6] no-underline">Back to Partner Mapping</Link>
                <button onClick={() => { setViewMode("apply-placements"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-lg bg-[#2d46f6] px-5 py-2 text-sm font-medium text-white">Continue to Apply Placements</button>
              </div>
            </>
          ) : (
            <ApplyPlacementsContent onBack={() => { setViewMode("taxonomy"); window.scrollTo({ top: 0, behavior: "smooth" }); }} onValidChange={setPlacementValid} />
          )}
        </main>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          step={onboardingStep}
          onNext={() => { if (onboardingStep < 2) setOnboardingStep(onboardingStep + 1); else setShowOnboarding(false); }}
          onSkip={() => setShowOnboarding(false)}
          onBack={() => setOnboardingStep(Math.max(0, onboardingStep - 1))}
          onDismissPermanently={() => { localStorage.setItem("hide-taxonomy-onboarding", "1"); }}
        />
      )}
    </div>
  );
}

const INITIAL_PLACEMENT_ROWS = [
  { id: "HKE239J", status: "error" as const, subPlacement: "Pandora_2025_Display_Q1", partner: "Viant", channel: "", publisher: "Google_DV360", audience: "Audience_Seg_01", adSize: "300x50", creative: "Standard_Banner", language: "English", geography: "New_York" },
  { id: "HKE239K", status: "resolved" as const, subPlacement: "Pandora_2025_Mobile_Q1", partner: "Viant", channel: "Display", publisher: "Google_DV360", audience: "Audience_Seg_02", adSize: "300x50", creative: "Standard_Banner", language: "English", geography: "Los_Angeles" },
  { id: "HKE240J", status: "parsed" as const, subPlacement: "Soundwave_2025_Audio_Q2", partner: "Adtheorent", channel: "Audio", publisher: "Amazon_DSP", audience: "Audience_Seg_05", adSize: "320x50", creative: "Rich_Media", language: "English", geography: "Chicago" },
  { id: "HKE241J", status: "resolved" as const, subPlacement: "Streamline_2025_Video_Q1", partner: "Nexxen", channel: "Video", publisher: "TradeDesk", audience: "Audience_Seg_08", adSize: "728x90", creative: "Video_Pre_Roll", language: "English", geography: "Houston" },
  { id: "HKE242J", status: "parsed" as const, subPlacement: "FitTrack_2025_Mobile_Q2", partner: "Adtheorent", channel: "Mobile", publisher: "Meta_Ads", audience: "Audience_Seg_12", adSize: "300x600", creative: "Interactive", language: "Spanish", geography: "San_Antonio" },
  { id: "HKE243J", status: "error" as const, subPlacement: "", partner: "Viant", channel: "Display", publisher: "", audience: "Audience_Seg_03", adSize: "300x250", creative: "Standard_Banner", language: "English", geography: "" },
  { id: "HKE244J", status: "parsed" as const, subPlacement: "TechSavvy_2025_Display_Q1", partner: "Nexxen", channel: "Display", publisher: "Google_DV360", audience: "Audience_Seg_15", adSize: "300x600", creative: "Native_Content", language: "English", geography: "San_Francisco" },
  { id: "HKE245J", status: "resolved" as const, subPlacement: "TravelQuest_2025_CTV_Q2", partner: "Viant", channel: "CTV", publisher: "TradeDesk", audience: "Audience_Seg_20", adSize: "970x250", creative: "Rich_Media", language: "English", geography: "Seattle" },
  { id: "HKE246J", status: "parsed" as const, subPlacement: "CulinaryDelight_2025_Social", partner: "Adtheorent", channel: "Social", publisher: "Meta_Ads", audience: "Audience_Seg_22", adSize: "300x250", creative: "Standard_Banner", language: "English", geography: "Denver" },
];

type PlacementRow = {
  id: string;
  status: "error" | "resolved" | "parsed";
  subPlacement: string;
  partner: string;
  channel: string;
  publisher: string;
  audience: string;
  adSize: string;
  creative: string;
  language: string;
  geography: string;
};

const CHANNEL_OPTIONS = ["Display", "Mobile", "Video", "Audio", "CTV", "Social", "Native"];
const SUB_PLACEMENT_OPTIONS = ["Pandora_2025_Display_Q1", "Soundwave_2025_Audio_Q2", "Streamline_2025_Video_Q1", "FitTrack_2025_Mobile_Q2", "TechSavvy_2025_Display_Q1", "TravelQuest_2025_CTV_Q2", "CulinaryDelight_2025_Social"];
const PARTNER_OPTIONS = ["Viant", "Adtheorent", "Nexxen"];
const PUBLISHER_OPTIONS = ["Google_DV360", "Meta_Ads", "Amazon_DSP", "TradeDesk"];
const AUDIENCE_OPTIONS = ["Audience_Seg_01", "Audience_Seg_02", "Audience_Seg_03", "Audience_Seg_05", "Audience_Seg_08", "Audience_Seg_12", "Audience_Seg_15", "Audience_Seg_20", "Audience_Seg_22"];
const AD_SIZE_OPTIONS = ["300x50", "300x250", "300x600", "320x50", "728x90", "970x250", "160x600"];
const CREATIVE_OPTIONS = ["Standard_Banner", "Rich_Media", "Video_Pre_Roll", "Interactive", "Native_Content"];
const LANGUAGE_OPTIONS = ["English", "Spanish", "French", "German", "Portuguese"];
const GEOGRAPHY_OPTIONS = ["New_York", "Los_Angeles", "Chicago", "Houston", "San_Antonio", "San_Francisco", "Seattle", "Denver"];

const applyPlacementsProgressSteps = [
  { label: "Media Plan", done: true },
  { label: "Map Partners", done: true },
  { label: "Map Taxonomies", done: true },
  { label: "Map Creatives", done: true },
  { label: "Apply Placements", done: false, active: true },
];

function InlineComboCell({ value, options, onCommit, onCancel }: { value: string; options: string[]; onCommit: (v: string) => void; onCancel: () => void }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(true);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);

  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const el = listRef.current.children[highlightIdx] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx]);

  const commit = (v: string) => { setOpen(false); onCommit(v); };

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    commit(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx((p) => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (highlightIdx >= 0 && filtered[highlightIdx]) commit(filtered[highlightIdx]); else commit(query); }
    else if (e.key === "Escape") { onCancel(); }
    else if (e.key === "Tab") { if (highlightIdx >= 0 && filtered[highlightIdx]) commit(filtered[highlightIdx]); else commit(query); }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center rounded border bg-white focus-within:border-[#2d46f6] focus-within:ring-1 focus-within:ring-[#2d46f6] ${!query ? "border-[#dc2626]" : "border-border"}`}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlightIdx(-1); }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full bg-transparent py-1 pl-2 pr-1 text-sm text-[#1f2430] outline-none"
          placeholder="Type or select..."
        />
        <button
          tabIndex={-1}
          onMouseDown={(e) => { e.preventDefault(); setOpen((p) => !p); }}
          className="shrink-0 px-1 text-[#64748b]"
        >
          <ChevronDown className="size-3" />
        </button>
      </div>
      {open && filtered.length > 0 && (
        <div ref={listRef} className="absolute left-0 top-full z-50 mt-1 max-h-[180px] w-full overflow-y-auto rounded-md border border-border bg-white py-1 shadow-lg">
          {filtered.map((opt, idx) => (
            <button
              key={opt}
              onMouseDown={(e) => { e.preventDefault(); commit(opt); }}
              className={`flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm ${idx === highlightIdx ? "bg-[#eff0fd] text-[#2d46f6]" : "text-[#1f2430] hover:bg-[#f1f5f9]"}`}
            >
              {opt === value && <Check className="size-3 text-[#2d46f6]" />}
              <span className={opt === value ? "font-medium" : ""}>{opt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ApplyPlacementsContent({ onBack, onValidChange }: { onBack: () => void; onValidChange?: (valid: boolean) => void }) {
  const [rows, setRows] = useState<PlacementRow[]>(INITIAL_PLACEMENT_ROWS);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PlacementRow | null>(null);
  const [sortField, setSortField] = useState<keyof PlacementRow | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [bulkForm, setBulkForm] = useState<Partial<PlacementRow>>({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ rowIdx: number; field: keyof PlacementRow } | null>(null);

  const isBulkMode = selectedRows.size > 0 && editingRow === null;
  const isEditMode = editingRow !== null && editForm !== null;
  const bulkFieldCount = Object.values(bulkForm).filter(Boolean).length;
  const selectedAreAllNeedsReview = isBulkMode && [...selectedRows].every((i) => rows[i].status === "parsed");

  const errorCount = rows.filter((r) => r.status === "error").length;
  const isValid = errorCount === 0;

  useEffect(() => {
    onValidChange?.(isValid);
    if (typeof window !== "undefined") localStorage.setItem("placement-valid", isValid ? "1" : "0");
  }, [isValid, onValidChange]);

  const recomputeStatus = (row: PlacementRow): PlacementRow["status"] => {
    const required: (keyof PlacementRow)[] = ["subPlacement", "channel", "publisher", "geography"];
    const hasEmpty = required.some((f) => !row[f]);
    if (hasEmpty) return "error";
    return "resolved";
  };

  const updateCell = (origIdx: number, field: keyof PlacementRow, value: string) => {
    setRows((prev) => prev.map((r, i) => {
      if (i !== origIdx) return r;
      const updated = { ...r, [field]: value };
      updated.status = recomputeStatus(updated);
      return updated;
    }));
  };

  const openEditPanel = (sortedIndex: number) => {
    const originalIndex = rows.indexOf(sortedRows[sortedIndex]);
    setEditingRow(originalIndex);
    setEditForm({ ...rows[originalIndex] });
    setSelectedRows(new Set());
    setBulkForm({});
    setPanelOpen(true);
  };

  const saveEdit = () => {
    if (editingRow === null || !editForm) return;
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== editingRow) return r;
        const updated = { ...editForm };
        updated.status = recomputeStatus(updated);
        return updated;
      })
    );
    closePanel();
  };

  const applyBulkChanges = () => {
    if (bulkFieldCount === 0) return;
    setRows((prev) =>
      prev.map((r, i) => {
        if (!selectedRows.has(i)) return r;
        const updated = { ...r };
        if (bulkForm.partner) updated.partner = bulkForm.partner;
        if (bulkForm.channel) updated.channel = bulkForm.channel;
        if (bulkForm.publisher) updated.publisher = bulkForm.publisher;
        if (bulkForm.audience) updated.audience = bulkForm.audience;
        if (bulkForm.adSize) updated.adSize = bulkForm.adSize;
        if (bulkForm.creative) updated.creative = bulkForm.creative;
        if (bulkForm.language) updated.language = bulkForm.language;
        if (bulkForm.geography) updated.geography = bulkForm.geography;
        updated.status = recomputeStatus(updated);
        return updated;
      })
    );
    closePanel();
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingRow(null);
    setEditForm(null);
    setSelectedRows(new Set());
    setBulkForm({});
  };

  const toggleSort = (field: keyof PlacementRow) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortField) return 0;
    const av = a[sortField].toLowerCase();
    const bv = b[sortField].toLowerCase();
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const allRowsSelected = rows.length > 0 && selectedRows.size === rows.length;
  const someRowsSelected = selectedRows.size > 0 && selectedRows.size < rows.length;

  const toggleSelectAll = () => {
    if (allRowsSelected) {
      setSelectedRows(new Set());
      setPanelOpen(false);
    } else {
      setSelectedRows(new Set(rows.map((_, i) => i)));
      setEditingRow(null);
      setEditForm(null);
      setPanelOpen(true);
    }
  };

  const toggleRowSelect = (originalIndex: number) => {
    const next = new Set(selectedRows);
    if (next.has(originalIndex)) next.delete(originalIndex);
    else next.add(originalIndex);
    setSelectedRows(next);
    setEditingRow(null);
    setEditForm(null);
    setPanelOpen(next.size > 0);
  };

  const SortHeader = ({ field, label }: { field: keyof PlacementRow; label: string }) => (
    <th className="cursor-pointer select-none whitespace-nowrap px-3 py-3 text-left text-sm font-medium text-[#64748b]" onClick={() => toggleSort(field)}>
      <span className="inline-flex items-center gap-1">{label} <ArrowUpDown className={`size-3 ${sortField === field ? "text-[#1f2430]" : ""}`} /></span>
    </th>
  );

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1f2430]">Placement Details</h2>
        <p className="mt-1 text-sm text-[#6b7280]">Instructions for this stage (Placement Details) go here, and shouldn&apos;t be too long, and certainly not more than two lines worth.</p>
      </div>

      {/* Sub-step progress bar */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-0">
          {applyPlacementsProgressSteps.map((step, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${step.done || step.active ? "bg-[#020617]" : "bg-gray-200"}`} />
          ))}
        </div>
        <div className="flex">
          {applyPlacementsProgressSteps.map((step, i) => (
            <div key={step.label} className="flex flex-1 items-center gap-2">
              {step.done ? (
                <div className="flex size-6 items-center justify-center rounded-full border border-[#d1d5db] bg-white"><Check className="size-3.5 text-[#9ca3af]" /></div>
              ) : (
                <div className={`flex size-6 items-center justify-center rounded-full border-2 text-xs font-semibold ${step.active ? "border-[#020617] bg-[#020617] text-white" : "border-gray-300 text-gray-400"}`}>{i + 1}</div>
              )}
              <span className={`text-sm ${step.active ? "font-semibold text-[#1f2430]" : step.done ? "text-[#1f2430]" : "text-[#6b7280]"}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mb-6 text-sm text-[#6b7280]">Instructions for the current active step go here below the step name and above the active content area</p>

      {/* File summary banner */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-white px-5 py-3.5">
        <div>
          <p className="text-sm font-semibold text-[#1f2430]">Carta/Mcdonalds2024</p>
          <p className="text-xs text-[#6b7280]">Uploaded by Sang Yeo</p>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1 text-sm">
            <Check className="size-4 text-[#16a34a]" />
            <span className="font-medium text-[#16a34a]">{rows.filter((r) => r.status === "resolved").length + 103} Mapped</span>
          </span>
          <span className="flex items-center gap-1 text-sm">
            <CircleAlert className="size-4 text-[#f59e0b]" />
            <span className="font-medium text-[#f59e0b]">{rows.filter((r) => r.status === "parsed").length} Needs Review</span>
          </span>
          <span className="flex items-center gap-1 text-sm">
            <CircleAlert className="size-4 text-[#dc2626]" />
            <span className="font-medium text-[#dc2626]">{rows.filter((r) => r.status === "error").length} Errors</span>
          </span>
          <span className="text-sm text-[#6b7280]">{rows.length > 0 ? Math.round(((rows.length - rows.filter((r) => r.status === "error").length) / rows.length) * 100) : 0}% Parsing Accuracy</span>
          <span className="text-sm font-semibold text-[#1f2430]">{rows.length + 106} Total Placements</span>
        </div>
      </div>

      {/* Results count + search + filters + resolve */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-[#1f2430]">
            <span className="text-[#6b7280]">Showing </span>
            <span className="font-medium">{rows.length}</span>
            <span className="text-[#6b7280]"> of </span>
            <span className="font-medium">{rows.length}</span>
            <span className="text-[#6b7280]"> results</span>
            {selectedRows.size > 0 && (
              <span className="ml-2 text-[#2d46f6]">({selectedRows.size} selected)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex w-[200px] items-center rounded-md border border-border bg-white px-3 py-2">
            <Search className="mr-2 size-4 text-[#64748b]" />
            <input type="text" placeholder="Search" className="w-full bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-[#64748b]" />
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-2 text-sm text-[#1f2430] hover:bg-gray-50">
            <SlidersHorizontal className="size-4 text-[#64748b]" />
            Filters
          </button>
        </div>
      </div>

      {/* Placements table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allRowsSelected}
                  ref={(el) => { if (el) el.indeterminate = someRowsSelected; }}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-gray-300 accent-[#2d46f6]"
                />
              </th>
              <SortHeader field="status" label="Status" />
              <SortHeader field="subPlacement" label="Sub Placement" />
              <SortHeader field="partner" label="Partner" />
              <SortHeader field="channel" label="Channel" />
              <SortHeader field="publisher" label="Publisher" />
              <SortHeader field="audience" label="Audience" />
              <SortHeader field="adSize" label="Ad Size" />
              <SortHeader field="creative" label="Creative" />
              <SortHeader field="language" label="Language" />
              <SortHeader field="geography" label="Geography" />
              <th className="px-3 py-3 text-left text-sm font-medium text-[#64748b]">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => {
              const originalIndex = rows.indexOf(row);
              const editable: { field: keyof PlacementRow; maxW?: string; options?: string[] }[] = [
                { field: "subPlacement", maxW: "max-w-[160px]" },
                { field: "partner", options: PARTNER_OPTIONS },
                { field: "channel", options: CHANNEL_OPTIONS },
                { field: "publisher", options: PUBLISHER_OPTIONS },
                { field: "audience", options: AUDIENCE_OPTIONS },
                { field: "adSize", options: AD_SIZE_OPTIONS },
                { field: "creative", options: CREATIVE_OPTIONS },
                { field: "language", options: LANGUAGE_OPTIONS },
                { field: "geography", options: GEOGRAPHY_OPTIONS },
              ];
              return (
              <tr key={i} className={`border-b border-border ${selectedRows.has(originalIndex) ? "bg-[#f8f9ff]" : ""}`}>
                <td className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(originalIndex)}
                    onChange={() => toggleRowSelect(originalIndex)}
                    className="size-4 rounded border-gray-300 accent-[#2d46f6]"
                  />
                </td>
                <td className="px-3 py-3">
                  {row.status === "error" ? (
                    <Badge className="bg-red-50 text-[#dc2626] dark:bg-red-900/30">Missing Field</Badge>
                  ) : row.status === "resolved" ? (
                    <Badge className="bg-green-50 text-[#389e45] dark:bg-green-900/30">Resolved</Badge>
                  ) : (
                    <Badge className="bg-orange-50 text-[#f59e0b] dark:bg-orange-900/30">Needs Review</Badge>
                  )}
                </td>
                {editable.map(({ field, maxW, options }) => {
                  const isEditing = editingCell?.rowIdx === originalIndex && editingCell?.field === field;
                  const val = row[field];
                  if (isEditing) {
                    if (options) {
                      return (
                        <td key={field} className="px-3 py-1.5">
                          <InlineComboCell
                            value={val}
                            options={options}
                            onCommit={(v) => { updateCell(originalIndex, field, v); setEditingCell(null); }}
                            onCancel={() => setEditingCell(null)}
                          />
                        </td>
                      );
                    }
                    return (
                      <td key={field} className="px-3 py-1.5">
                        <input
                          autoFocus
                          type="text"
                          defaultValue={val}
                          onBlur={(e) => { updateCell(originalIndex, field, e.target.value); setEditingCell(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { updateCell(originalIndex, field, (e.target as HTMLInputElement).value); setEditingCell(null); } if (e.key === "Escape") setEditingCell(null); }}
                          className={`w-full rounded border bg-white px-2 py-1 text-sm text-[#1f2430] outline-none focus:border-[#2d46f6] focus:ring-1 focus:ring-[#2d46f6] ${maxW || ""} ${!val ? "border-[#dc2626]" : "border-border"}`}
                        />
                      </td>
                    );
                  }
                  return (
                    <td
                      key={field}
                      onClick={() => setEditingCell({ rowIdx: originalIndex, field })}
                      className={`group/cell cursor-pointer px-3 py-3 text-sm text-[#1f2430] transition-colors hover:bg-[#f1f5f9] ${maxW ? maxW + " truncate" : ""}`}
                    >
                      <span className="flex items-center gap-1">
                        {val || <span className="text-[#dc2626]">—</span>}
                        <SquarePen className="size-3 shrink-0 text-[#94a3b8] opacity-0 transition-opacity group-hover/cell:opacity-100" />
                      </span>
                    </td>
                  );
                })}
                <td className="px-3 py-3">
                  <button onClick={() => openEditPanel(i)} className="text-sm font-medium text-[#2d46f6] hover:underline">edit</button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {rows.length > 10 && (
      <div className="mt-6 flex items-center justify-end gap-1">
        <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#64748b] hover:bg-gray-50">
          <ChevronLeft className="size-4" />
          Previous
        </button>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className={`flex size-10 items-center justify-center rounded-lg text-sm font-medium ${
              n === 1 ? "border border-border bg-white text-[#0f172a]" : "text-[#64748b] hover:bg-gray-50"
            }`}
          >
            {n}
          </div>
        ))}
        <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#64748b] hover:bg-gray-50">
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
      )}

      {/* Right Side Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-[400px] transform border-l border-border bg-white shadow-[-4px_0_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-in-out ${panelOpen && (isEditMode || isBulkMode) ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            {isEditMode && editForm && (
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-semibold text-[#1f2430]">Edit Placement</h3>
                {editForm.status === "error" ? (
                  <Badge className="bg-red-50 text-[#dc2626] dark:bg-red-900/30">Error</Badge>
                ) : editForm.status === "resolved" ? (
                  <Badge className="bg-green-50 text-[#389e45] dark:bg-green-900/30">Resolved</Badge>
                ) : (
                  <Badge className="bg-orange-50 text-[#f59e0b] dark:bg-orange-900/30">Needs Review</Badge>
                )}
              </div>
            )}
            {isBulkMode && (
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-semibold text-[#1f2430]">
                  Bulk Edit ({selectedRows.size})
                </h3>
              </div>
            )}
            <button onClick={closePanel} className="rounded-full p-1.5 text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#1f2430]">
              <X className="size-4" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {isBulkMode && (
              <p className="mb-4 text-sm text-[#6b7280]">
                Set values below to apply to all {selectedRows.size} selected placement{selectedRows.size > 1 ? "s" : ""}. Only fields you change will be updated.
              </p>
            )}

            <div className="flex flex-col gap-4">
              {([
                { label: "Sub Placement", field: "subPlacement" as const, options: SUB_PLACEMENT_OPTIONS, editOnly: true },
                { label: "Partner", field: "partner" as const, options: PARTNER_OPTIONS, editOnly: false },
                { label: "Channel", field: "channel" as const, options: CHANNEL_OPTIONS, editOnly: false },
                { label: "Publisher", field: "publisher" as const, options: PUBLISHER_OPTIONS, editOnly: false },
                { label: "Audience", field: "audience" as const, options: AUDIENCE_OPTIONS, editOnly: false },
                { label: "Ad Size", field: "adSize" as const, options: AD_SIZE_OPTIONS, editOnly: false },
                { label: "Creative", field: "creative" as const, options: CREATIVE_OPTIONS, editOnly: false },
                { label: "Language", field: "language" as const, options: LANGUAGE_OPTIONS, editOnly: false },
                { label: "Geography", field: "geography" as const, options: GEOGRAPHY_OPTIONS, editOnly: false },
              ] as const).map(({ label, field, options, editOnly }) => {
                if (isBulkMode && editOnly) return null;

                if (isEditMode && editForm) {
                  return (
                    <div key={field} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#1f2430]">{label}</label>
                      <div className="relative">
                        <select
                          value={editForm[field]}
                          onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                          className={`w-full appearance-none rounded-md border bg-white py-2 pl-3 pr-9 text-sm text-[#1f2430] outline-none focus:border-[#2d46f6] ${!editForm[field] ? "border-[#dc2626]" : "border-border"}`}
                        >
                          <option value="">Select...</option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                      </div>
                    </div>
                  );
                }

                if (isBulkMode) {
                  const selectedRowValues = [...selectedRows].map((i) => rows[i][field]);
                  const uniqueValues = new Set(selectedRowValues.filter(Boolean));
                  const isMixed = uniqueValues.size > 1;
                  const commonValue = uniqueValues.size === 1 ? [...uniqueValues][0] : "";
                  const validOptions = options.filter((opt) =>
                    [...selectedRows].every((i) => {
                      const rowVal = rows[i][field];
                      return !rowVal || rowVal === opt;
                    })
                  );
                  const isDisabled = isMixed && validOptions.length === 0;

                  return (
                    <div key={field} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#1f2430]">{label}</label>
                      <div className="relative">
                        <select
                          value={bulkForm[field] ?? ""}
                          onChange={(e) => setBulkForm({ ...bulkForm, [field]: e.target.value || undefined })}
                          disabled={isDisabled}
                          className={`w-full appearance-none rounded-md border bg-white py-2 pl-3 pr-9 text-sm outline-none transition-colors focus:border-[#2d46f6] ${isDisabled ? "cursor-not-allowed bg-[#f8fafc] text-[#94a3b8]" : bulkForm[field] ? "border-[#2d46f6] text-[#1f2430]" : "border-border text-[#64748b]"}`}
                        >
                          <option value="">{isMixed ? `Mixed (${uniqueValues.size} values)` : commonValue ? commonValue : "— No change —"}</option>
                          {validOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                      </div>
                      {isMixed && !isDisabled && (
                        <p className="text-xs text-[#f59e0b]">Values differ across selected rows</p>
                      )}
                      {isDisabled && (
                        <p className="text-xs text-[#94a3b8]">No common values available</p>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {/* Panel Footer */}
          <div className="border-t border-border px-5 py-4">
            {isEditMode && (
              <div className="flex items-center justify-end gap-3">
                <button onClick={closePanel} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-[#1f2430] transition-colors hover:bg-gray-50">Cancel</button>
                <button onClick={saveEdit} className="rounded-lg bg-[#2d46f6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2438d4]">Save Changes</button>
              </div>
            )}
            {isBulkMode && (
              <div className="flex flex-col gap-3">
                {!selectedAreAllNeedsReview && bulkFieldCount > 0 && (
                  <p className="text-center text-xs text-[#6b7280]">
                    {bulkFieldCount} field{bulkFieldCount > 1 ? "s" : ""} will be updated across {selectedRows.size} row{selectedRows.size > 1 ? "s" : ""}
                  </p>
                )}
                <div className="flex items-center justify-end gap-3">
                  <button onClick={closePanel} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-[#1f2430] transition-colors hover:bg-gray-50">Cancel</button>
                  {selectedAreAllNeedsReview ? (
                    <button
                      onClick={() => {
                        setRows((prev) =>
                          prev.map((r, i) => {
                            if (!selectedRows.has(i)) return r;
                            const updated = { ...r, ...Object.fromEntries(Object.entries(bulkForm).filter(([, v]) => v)) };
                            updated.status = "resolved";
                            return updated;
                          })
                        );
                        closePanel();
                      }}
                      className="rounded-lg bg-[#2d46f6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2438d4]"
                    >
                      Resolve {selectedRows.size} Item{selectedRows.size > 1 ? "s" : ""}
                    </button>
                  ) : (
                    <button
                      onClick={applyBulkChanges}
                      disabled={bulkFieldCount === 0}
                      className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${bulkFieldCount > 0 ? "bg-[#2d46f6] hover:bg-[#2438d4]" : "cursor-not-allowed bg-[#a0aec0]"}`}
                    >
                      Apply to {selectedRows.size} Row{selectedRows.size > 1 ? "s" : ""}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="rounded-lg border border-[#2d46f6] px-5 py-2 text-sm font-medium text-[#2d46f6]">Back to Assign</button>
        <Link href="/attribution/taxonomy/review" className="rounded-lg bg-[#2d46f6] px-5 py-2 text-sm font-medium text-white no-underline hover:bg-[#2438d4]">Continue to Billing Information &gt;</Link>
      </div>
    </>
  );
}

const onboardingSteps = [
  {
    title: "Drag & Drop Tokens",
    description: "Grab any token from the left panel using the grip handle, then drag it over to a taxonomy category on the right and release.",
    icon: "drag",
  },
  {
    title: "Select Multiple Tokens",
    description: "Use the checkboxes to select multiple tokens at once — or hit \"select all\". Then drag any one of the selected tokens to move them all together.",
    icon: "select",
  },
  {
    title: "Watch the Count Update",
    description: "Each time you assign tokens, the number next to the taxonomy category increases automatically. Expand any category to see its assigned tokens.",
    icon: "count",
  },
];

function OnboardingModal({ step, onNext, onSkip, onBack, onDismissPermanently }: { step: number; onNext: () => void; onSkip: () => void; onBack: () => void; onDismissPermanently: () => void }) {
  const s = onboardingSteps[step];
  const isLast = step === onboardingSteps.length - 1;
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) onDismissPermanently();
    onSkip();
  };

  const handleFinish = () => {
    if (dontShowAgain) onDismissPermanently();
    onNext();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-6 backdrop-blur-[2px]">
      <div className="w-[480px] max-w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Illustration area */}
        <div className="relative flex h-[240px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#e0e7ff] to-[#c7d2fe]">
          <button onClick={handleClose} className="absolute right-3 top-3 rounded-full bg-white/80 p-1.5 text-[#6b7280] backdrop-blur-sm transition-colors hover:bg-white hover:text-[#1f2430]">
            <X className="size-4" />
          </button>

          {s.icon === "drag" && (
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <div className="flex w-[140px] items-center gap-2 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
                  <GripVertical className="size-3.5 text-[#9ca3af]" />
                  <div className="h-2 w-16 rounded-full bg-[#c7d2fe]" />
                </div>
                <div className="flex w-[140px] items-center gap-2 rounded-lg border border-[#2d46f6] bg-[#eef2ff] px-3 py-2 shadow-md">
                  <GripVertical className="size-3.5 text-[#2d46f6]" />
                  <div className="h-2 w-20 rounded-full bg-[#2d46f6]/40" />
                </div>
                <div className="flex w-[140px] items-center gap-2 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
                  <GripVertical className="size-3.5 text-[#9ca3af]" />
                  <div className="h-2 w-12 rounded-full bg-[#c7d2fe]" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="size-8 text-[#2d46f6] animate-pulse" />
              </div>
              <div className="w-[140px] space-y-2">
                <div className="rounded-lg border-2 border-dashed border-[#2d46f6] bg-[#2d46f6]/5 px-3 py-3 text-center">
                  <span className="text-xs font-medium text-[#2d46f6]">Audience</span>
                  <span className="ml-1.5 rounded-full bg-[#2d46f6]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#2d46f6]">42</span>
                </div>
                <div className="rounded-lg border border-white/60 bg-white/60 px-3 py-3 text-center backdrop-blur-sm">
                  <span className="text-xs text-[#6b7280]">Channel</span>
                  <span className="ml-1.5 text-[10px] text-[#9ca3af]">13</span>
                </div>
              </div>
            </div>
          )}

          {s.icon === "select" && (
            <div className="space-y-2">
              <div className="flex w-[260px] items-center gap-3 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
                <div className="size-4 rounded border-2 border-[#2d46f6] bg-[#2d46f6]"><Check className="size-3 text-white" /></div>
                <div className="h-2 w-24 rounded-full bg-[#2d46f6]/30" />
                <GripVertical className="ml-auto size-3.5 text-[#9ca3af]" />
              </div>
              <div className="flex w-[260px] items-center gap-3 rounded-lg border border-[#2d46f6] bg-[#eef2ff] px-3 py-2 shadow-md">
                <div className="size-4 rounded border-2 border-[#2d46f6] bg-[#2d46f6]"><Check className="size-3 text-white" /></div>
                <div className="h-2 w-20 rounded-full bg-[#2d46f6]/40" />
                <GripVertical className="ml-auto size-3.5 text-[#2d46f6]" />
              </div>
              <div className="flex w-[260px] items-center gap-3 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
                <div className="size-4 rounded border-2 border-[#2d46f6] bg-[#2d46f6]"><Check className="size-3 text-white" /></div>
                <div className="h-2 w-28 rounded-full bg-[#2d46f6]/30" />
                <GripVertical className="ml-auto size-3.5 text-[#9ca3af]" />
              </div>
              <div className="flex w-[260px] items-center gap-3 rounded-lg border border-white/60 bg-white/50 px-3 py-2 backdrop-blur-sm">
                <div className="size-4 rounded border-2 border-gray-300" />
                <div className="h-2 w-16 rounded-full bg-gray-200" />
                <GripVertical className="ml-auto size-3.5 text-[#d1d5db]" />
              </div>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <MousePointerClick className="size-4 text-[#2d46f6]" />
                <span className="text-xs font-medium text-[#2d46f6]">3 selected — drag to move all</span>
              </div>
            </div>
          )}

          {s.icon === "count" && (
            <div className="w-[240px] space-y-2">
              <div className="rounded-lg border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1f2430]">Audience</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm tabular-nums text-[#6b7280]">42</span>
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">+3</span>
                    <ChevronDown className="size-3.5 text-[#6b7280]" />
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-[#2d46f6] bg-white px-4 py-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1f2430]">Channel</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums text-[#2d46f6]">15</span>
                    <span className="rounded-full bg-[#eef2ff] px-1.5 py-0.5 text-[10px] font-bold text-[#2d46f6]">+2</span>
                    <ChevronUp className="size-3.5 text-[#2d46f6]" />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px]">Token_01</span>
                  <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] text-[#2d46f6]">Token_08</span>
                  <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] text-[#2d46f6]">Token_12</span>
                </div>
              </div>
              <div className="rounded-lg border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1f2430]">Creative</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm tabular-nums text-[#6b7280]">5</span>
                    <ChevronDown className="size-3.5 text-[#6b7280]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-5">
          {/* Step dots */}
          <div className="mb-4 flex items-center justify-center gap-1.5">
            {onboardingSteps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-[#2d46f6]" : "w-1.5 bg-[#d1d5db]"}`} />
            ))}
          </div>

          <h2 className="text-center text-lg font-semibold text-[#1f2430]">{s.title}</h2>
          <p className="mx-auto mt-2 max-w-[360px] text-center text-sm leading-relaxed text-[#6b7280]">{s.description}</p>

          <div className="mt-5 flex items-center justify-between">
            {step > 0 ? (
              <button onClick={onBack} className="rounded-lg px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-50">Back</button>
            ) : (
              <button onClick={handleClose} className="rounded-lg px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-50">Skip</button>
            )}
            <button onClick={isLast ? handleFinish : onNext} className="rounded-lg bg-[#2d46f6] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2438d4]">
              {isLast ? "Get Started" : "Next"}
            </button>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="size-4 rounded border-gray-300 accent-[#2d46f6]"
            />
            <span className="text-xs text-[#6b7280]">Don&apos;t show this again</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function Header({ userMenuOpen, setUserMenuOpen }: { userMenuOpen: boolean; setUserMenuOpen: (v: boolean) => void }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-12">
      <div className="flex items-center gap-8">
        <Link href="/attribution" className="flex items-center gap-0.5 no-underline">
          <span className="text-lg font-semibold tracking-tight text-[#000033]">FSQ</span>
          <span className="font-mono text-lg font-medium text-[#000033]">/</span>
          <span className="font-mono text-lg font-medium text-[#000033]">attribution</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/attribution" className="text-sm font-semibold text-[#000033] no-underline">Dashboard</Link>
          <span className="text-sm text-[#6b7280]">Feasibility Calculator</span>
          <Link href="/attribution/admin" className="text-sm text-[#6b7280] no-underline">Admin</Link>
        </nav>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-4 px-4">
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50"><CircleAlert className="size-4" /></button>
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50"><FileText className="size-4" /></button>
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={`flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50 ${userMenuOpen ? "ring-2 ring-[#212be9] ring-offset-2" : ""}`}><UserCircle className="size-4" /></button>
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
                      {["Profile", "Admin Dashboard", "Permission Groups", "Impersonate"].map((item) =>
                        item === "Permission Groups" || item === "Admin Dashboard" ? (
                          <Link key={item} href={item === "Permission Groups" ? "/attribution/permission-groups" : "/attribution/admin"} className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] no-underline transition-colors hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>{item}</Link>
                        ) : (
                          <button key={item} className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50">{item}</button>
                        )
                      )}
                    </div>
                  </div>
                  <div className="border-t border-border p-1">
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50"><LogOut className="size-4 text-[#555]" />Logout</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center border-l border-border pl-4">
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50"><Grid3X3 className="size-4" /></button>
        </div>
      </div>
    </header>
  );
}

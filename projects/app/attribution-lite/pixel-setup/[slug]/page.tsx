"use client";

import { Check, ChevronDown, X, Info, Search, Copy, Mail, Download, MoreHorizontal, ChevronLeft, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const CAMPAIGNS: Record<string, { name: string; advertiser: string; partners: string[] }> = {
  "mcdonalds-q1-q2-2025": { name: "McDonalds Q1-Q2 2025", advertiser: "Google 360", partners: ["Viant", "Adtheorent", "Nexxen"] },
  "circle-k-q1-q4": { name: "Circle K Campaign Q1-Q4", advertiser: "Google 360", partners: ["Viant", "Nexxen"] },
  "mcdonalds-q3-fall": { name: "McDonald's Q3 Fall Campaign", advertiser: "Google 360", partners: ["Viant", "Adtheorent"] },
};

const AD_SERVER_OPTIONS = ["CM360", "DV360", "Google Campaign Manager", "Sizmek", "Flashtalking", "Innovid", "Extreme Reach"];
const PIXEL_TYPE_OPTIONS = ["In-App", "Cross-Device / CTV", "Cross-Device Redirect"];

const SUB_STEPS = [
  { num: 1, label: "Confirm Ad Server" },
  { num: 2, label: "Manage Generated Pixels" },
];

function SubStepProgress({ activeStep }: { activeStep: number }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex gap-0">
        {SUB_STEPS.map((s) => (
          <div
            key={s.num}
            className={`h-1 flex-1 ${s.num <= activeStep ? "bg-[#020617]" : "bg-[#e2e8f0]"} ${s.num === 1 ? "rounded-l-full" : ""} ${s.num === SUB_STEPS.length ? "rounded-r-full" : ""}`}
          />
        ))}
      </div>
      <div className="flex">
        {SUB_STEPS.map((s) => (
          <div key={s.num} className="flex flex-1 items-center gap-2">
            <div
              className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                s.num < activeStep
                  ? "border border-[#d1d5db] bg-white text-[#9ca3af]"
                  : s.num === activeStep
                    ? "border-2 border-[#020617] bg-[#020617] text-white"
                    : "border-2 border-gray-300 text-gray-400"
              }`}
            >
              {s.num < activeStep ? <Check className="size-3.5" /> : s.num}
            </div>
            <span className={`text-sm ${s.num === activeStep ? "font-semibold text-[#020617]" : s.num < activeStep ? "text-[#020617]" : "text-[#757575]"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiSelectDropdown({ options, selected, onChange, placeholder, hasWarning, disabled }: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
  hasWarning?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const allSelected = options.length > 0 && options.every((o) => selected.includes(o));

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt));
    else onChange([...selected, opt]);
  };

  return (
    <div ref={ref} className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && setOpen(!open)}
        className={`flex min-h-[36px] min-w-[220px] max-w-[340px] items-center justify-between rounded-md border bg-white px-3 py-1.5 text-left text-sm transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${hasWarning && selected.length === 0 ? "border-[#f59e0b]" : open ? "border-[#212be9] ring-1 ring-[#212be9]" : "border-[#e2e8f0]"}`}
      >
        {selected.length === 0 ? (
          <span className="text-[#94a3b8]">{placeholder}</span>
        ) : (
          <span className="flex flex-row flex-wrap gap-1">
            {selected.map((s) => (
              <span key={s} className="inline-flex shrink-0 items-center gap-1 rounded bg-[#f1f5f9] px-1.5 py-0.5 text-xs font-medium text-[#020617]">
                {s}
                {!disabled && (
                  <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); toggle(s); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); toggle(s); } }} className="text-[#8d8d8d] hover:text-[#020617] cursor-pointer">
                    <X className="size-3" />
                  </span>
                )}
              </span>
            ))}
          </span>
        )}
        <ChevronDown className={`ml-2 size-4 shrink-0 text-[#8d8d8d] transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && !disabled && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] max-w-[340px] rounded-md border border-[#e2e8f0] bg-white py-1 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-3 py-1.5">
            <button onClick={() => onChange([...options])} className={`text-xs font-medium transition-colors ${allSelected ? "text-[#94a3b8]" : "text-[#212be9] hover:text-[#1a22c4]"}`}>Select All</button>
            <button onClick={() => onChange([])} className={`text-xs font-medium transition-colors ${selected.length === 0 ? "text-[#94a3b8]" : "text-[#dc2626] hover:text-[#b91c1c]"}`}>Reset</button>
          </div>
          {options.map((opt) => (
            <button key={opt} onClick={() => toggle(opt)} className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#020617] transition-colors hover:bg-[#f5f5ff]">
              <div className={`flex size-4 shrink-0 items-center justify-center rounded border ${selected.includes(opt) ? "border-[#212be9] bg-[#212be9]" : "border-[#d1d5db]"}`}>
                {selected.includes(opt) && <Check className="size-3 text-white" />}
              </div>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PixelSetupPage() {
  const params = useParams();
  const slug = params.slug as string;
  const campaign = CAMPAIGNS[slug] ?? { name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()), advertiser: "—", partners: ["Partner A", "Partner B"] };

  const [activeStep, setActiveStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [adServers, setAdServers] = useState(
    campaign.partners.map((p, i) => ({ partner: p, adServers: i === campaign.partners.length - 1 ? [] as string[] : [i % 2 === 0 ? "CM360" : "DV360"], pixelTypes: [] as string[] }))
  );

  const [pixels, setPixels] = useState<{ partner: string; adServer: string; pixelId: string; pixelType: string; pixelImg: string; tracking: string }[]>([]);
  const [viewPixelRow, setViewPixelRow] = useState<number | null>(null);
  const [copiedPixelRow, setCopiedPixelRow] = useState<number | null>(null);
  const pixelPopoverRef = useRef<HTMLDivElement>(null);

  const generateFromSelections = () => {
    let counter = 0;
    const rows: typeof pixels = [];
    for (const row of adServers) {
      for (const server of row.adServers) {
        for (const pType of row.pixelTypes) {
          counter++;
          const id = `${String(1000 + counter * 111).slice(0, 4)}${String.fromCharCode(64 + counter)}${counter}`;
          rows.push({
            partner: row.partner,
            adServer: server,
            pixelId: `PXL-${id}`,
            pixelType: pType,
            pixelImg: `<img src="https://p.placed.com/api/v2/sync/${id}?campaign=${row.partner.toLowerCase().replace(/\s+/g, "_")}" height="1" width="1" />`,
            tracking: "",
          });
        }
      }
    }
    return rows;
  };

  useEffect(() => {
    if (viewPixelRow === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pixelPopoverRef.current && !pixelPopoverRef.current.contains(e.target as Node)) {
        setViewPixelRow(null);
        setCopiedPixelRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [viewPixelRow]);

  const updateTracking = (index: number, value: string) => {
    setPixels((prev) => prev.map((p, i) => (i === index ? { ...p, tracking: value } : p)));
  };

  const step1Valid = adServers.every((r) => r.adServers.length > 0 && r.pixelTypes.length > 0);
  const step2Valid = pixels.every((p) => !!p.tracking);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setShowToast(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowToast(false), 5000);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-[#e0e0e0] bg-white px-12">
        <div className="flex items-center gap-16">
          <Link href="/attribution-lite" className="flex items-center gap-0.5 font-mono text-lg font-medium text-[#000033]">
            <span>FSQ</span>
            <span>/</span>
            <span>attribution-lite</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-12 py-8">
        {/* Back link */}
        <Link href="/attribution-lite" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#64748b] no-underline transition-colors hover:text-[#020617]">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>

        {/* Campaign context bar */}
        <div className="mb-8 flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fcfcfc] px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-[#020617]">{campaign.name}</h1>
            <p className="mt-0.5 text-sm text-[#64748b]">{campaign.advertiser} &middot; {campaign.partners.length} partners</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${submitted ? "text-orange-500" : "text-red-600"}`}>
            <span className={`size-2 rounded-full ${submitted ? "bg-orange-400" : "bg-red-500"}`} />
            {submitted ? "Validating" : "Pending Pixel Setup"}
          </span>
        </div>

        {/* Title + description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#020617]">Pixel Setup</h2>
          <p className="mt-1 text-sm text-[#646464]">
            Confirm ad servers for each partner, then assign tagging for generated pixels.
          </p>
        </div>

        <div className="mb-6 h-px w-full bg-[#e2e8f0]" />

        <SubStepProgress activeStep={activeStep} />

        {/* Step 1: Confirm Ad Servers */}
        {activeStep === 1 && (
          <>
            <p className="mb-4 text-sm text-[#64748b]">
              Confirm or update the ad server for each media partner before generating pixels.
            </p>

            <Alert className="mb-6 border-[#bfdbfe] bg-[#eff6ff]">
              <Info className="size-4 text-[#3b82f6]" />
              <AlertTitle className="text-[#1e40af]">Review ad server assignments</AlertTitle>
              <AlertDescription className="text-[#1e40af]/80">
                Ensure each partner has the correct ad server and pixel type selected. You can update selections before proceeding.
              </AlertDescription>
            </Alert>

            <div className="relative w-full">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="w-[20%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Partner</th>
                    <th className="w-[40%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Ad Server</th>
                    <th className="w-[40%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel Type</th>
                  </tr>
                </thead>
                <tbody>
                  {adServers.map((row, i) => (
                    <tr key={i} className="border-b border-[#e2e8f0]">
                      <td className="px-4 py-4 text-sm font-medium text-black">{row.partner}</td>
                      <td className="px-4 py-4">
                        <MultiSelectDropdown
                          options={AD_SERVER_OPTIONS}
                          selected={row.adServers}
                          onChange={(val) => setAdServers((prev) => prev.map((r, idx) => (idx === i ? { ...r, adServers: val } : r)))}
                          placeholder="Select ad servers..."
                          hasWarning={row.adServers.length === 0}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <MultiSelectDropdown
                          options={PIXEL_TYPE_OPTIONS}
                          selected={row.pixelTypes}
                          onChange={(val) => setAdServers((prev) => prev.map((r, idx) => (idx === i ? { ...r, pixelTypes: val } : r)))}
                          placeholder="Select pixel types..."
                          hasWarning={row.pixelTypes.length === 0}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={() => { setPixels(generateFromSelections()); setActiveStep(2); }}
                disabled={!step1Valid}
                className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Manage Pixels
              </button>
            </div>
          </>
        )}

        {/* Step 2: Manage Generated Pixels */}
        {activeStep === 2 && (
          <>
            <Alert className="mb-6 border-[#bfdbfe] bg-[#eff6ff]">
              <Info className="size-4 text-[#3b82f6]" />
              <AlertTitle className="text-[#1e40af]">Assign tagging for each pixel</AlertTitle>
              <AlertDescription className="text-[#1e40af]/80">
                Select whether the pixel should be tagged by the Partner, Agency, or Both.
              </AlertDescription>
            </Alert>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#171417]">
                <span className="text-[#757575]">Showing </span>
                <span className="font-medium">{pixels.length}</span>
                <span className="text-[#757575]"> of </span>
                <span className="font-medium">{pixels.length}</span>
                <span className="text-[#757575]"> results</span>
              </p>
              <div className="flex items-center gap-2">
                <div className="flex w-[200px] items-center rounded-md border border-[#e2e8f0] bg-white px-3 py-2">
                  <Search className="mr-2 size-4 text-[#64748b]" />
                  <span className="text-sm text-[#64748b]">Search</span>
                </div>
                <button className="group relative rounded-md border border-[#212be9] bg-[#fcfcfc] p-2 text-[#212be9] transition-colors hover:bg-[#ebf1ff]">
                  <Download className="size-4" />
                </button>
              </div>
            </div>

            <div className="relative w-full">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Partner</th>
                    <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Ad Server</th>
                    <th className="w-[18%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel Type</th>
                    <th className="w-[16%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Tagging</th>
                    <th className="w-[16%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel ID</th>
                    <th className="w-[10%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel</th>
                  </tr>
                </thead>
                <tbody>
                  {pixels.map((pixel, i) => {
                    return (
                      <tr key={i} className="border-b border-[#e2e8f0]">
                        <td className="px-4 py-4 text-sm font-medium text-black">{pixel.partner}</td>
                        <td className="px-4 py-4">
                          <span className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-xs font-medium text-[#020617]">{pixel.adServer}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-xs font-medium text-[#020617]">{pixel.pixelType}</span>
                        </td>
                        <td className="px-4 py-4">
                          <Select value={pixel.tracking || undefined} onValueChange={(val) => updateTracking(i, val)} disabled={submitted}>
                            <SelectTrigger className={`w-[120px] ${pixel.tracking ? "" : "border-[#f59e0b]"}`} size="sm">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Partner">Partner</SelectItem>
                              <SelectItem value="Agency">Agency</SelectItem>
                              <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-4 text-sm text-black">{pixel.pixelId}</td>
                        <td className="relative px-4 py-4">
                          <button
                            onClick={() => setViewPixelRow(viewPixelRow === i ? null : i)}
                            className="rounded px-2 py-1 text-xs font-medium text-[#212be9] transition-colors hover:bg-[#f0f1ff]"
                          >
                            View
                          </button>
                          {viewPixelRow === i && (
                            <div ref={pixelPopoverRef} className="absolute bottom-full left-1/2 z-20 mb-2 w-[360px] -translate-x-1/2 rounded-lg border border-[#e2e8f0] bg-white p-3 shadow-lg">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs font-medium text-[#64748b]">Pixel Tag</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(pixel.pixelImg);
                                    setCopiedPixelRow(i);
                                    setTimeout(() => setCopiedPixelRow(null), 2000);
                                  }}
                                  className={`rounded px-1.5 py-0.5 text-xs font-medium ${copiedPixelRow === i ? "text-[#16a34a]" : "text-[#212be9] hover:bg-[#f0f1ff]"}`}
                                >
                                  {copiedPixelRow === i ? "Copied" : "Copy"}
                                </button>
                              </div>
                              <code className="block break-all rounded-md bg-[#f8fafc] p-2.5 text-xs leading-relaxed text-[#334155]">
                                {pixel.pixelImg}
                              </code>
                              <div className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-[6px] border-transparent border-t-white drop-shadow-sm" />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              {!submitted ? (
                <>
                  <button
                    onClick={() => setActiveStep(1)}
                    className="rounded-md border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#020617] transition-colors hover:bg-gray-50"
                  >
                    Back to Confirm Ad Server
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!step2Valid || submitting}
                    className="flex items-center gap-2 rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    {submitting ? "Submitting..." : "Submit Pixel Setup"}
                  </button>
                </>
              ) : (
                <Link
                  href={`/attribution-lite?pixel-setup-done=${slug}`}
                  className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-[#1a22c4]"
                >
                  Back to Dashboard
                </Link>
              )}
            </div>
          </>
        )}
      </main>

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-[#16a34a] bg-white px-4 py-3 shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}>
        <div className="flex size-6 items-center justify-center rounded-full bg-[#16a34a]">
          <Check className="size-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#020617]">Pixel setup completed!</p>
          <p className="text-xs text-[#6b7280]">Campaign status changed to Validating.</p>
        </div>
        <button onClick={() => setShowToast(false)} className="ml-4 p-1 text-[#8d8d8d] hover:text-[#020617]">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

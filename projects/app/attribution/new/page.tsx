"use client";

import { Upload, ChevronDown, ChevronUp, Calendar as CalendarIcon, CircleDashed, Check, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Search, Download, Copy, Mail, X, Loader2, GripVertical, MousePointerClick, ArrowRight, OctagonAlert, SquarePen, Trash2, FileText, Info, CircleAlert, ArrowUpDown, SlidersHorizontal, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect, useMemo, DragEvent, Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

type Step = "campaign" | "placement" | "map-partners" | "map-taxonomies" | "map-creatives" | "apply-placements" | "funding" | "pixel" | "review";

const SIDEBAR_STEPS = [
  { key: "campaign" as Step, label: "Campaign Details" },
  { key: "placement" as Step, label: "Placement Details" },
  { key: "funding" as Step, label: "Funding Allocation" },
  { key: "pixel" as Step, label: "Pixel Generation" },
  { key: "review" as Step, label: "Review and Submit" },
];

const INITIAL_PARTNERS = [
  { name: "Viant", fundingSource: "Starcom" as string | null, mediaTypes: ["Display", "Mobile"], conversionType: "Visits and Sales Impact" as string | null, startDate: "2025-04-01" as string | null, endDate: "2025-06-30" as string | null, missingFields: 0, estimatedSpend: "$125,000" },
  { name: "Adtheorent", fundingSource: "Zenith" as string | null, mediaTypes: ["Mobile"], conversionType: "Visits and Sales Impact" as string | null, startDate: "2025-04-01" as string | null, endDate: null as string | null, missingFields: 2, estimatedSpend: "$85,000" },
  { name: "Nexxen", fundingSource: "Starcom" as string | null, mediaTypes: ["Video", "CTV"], conversionType: "Sales Impact" as string | null, startDate: "2025-04-01" as string | null, endDate: "2025-06-30" as string | null, missingFields: 0, estimatedSpend: "$210,000" },
];

const ERROR_FIELDS = [
  "Ad Server",
  "Ad Run End Date",
  "Estimated Total Ad Spend",
];

const PIXELS = [
  { partner: "Ikea", adServer: "CM360", pixelId: "PXL-4829A1", pixelType: "Impression", pixelImg: '<img src="https://p.placed.com/api/v2/sync/4829A1?campaign=ikea_q2" height="1" width="1" />', tracking: "" as string },
  { partner: "Spotify", adServer: "CM360", pixelId: "PXL-7713B4", pixelType: "Click", pixelImg: '<img src="https://p.placed.com/api/v2/sync/7713B4?campaign=spotify_audio" height="1" width="1" />', tracking: "" as string },
  { partner: "Viant", adServer: "DV360", pixelId: "PXL-3356C8", pixelType: "Impression", pixelImg: '<img src="https://p.placed.com/api/v2/sync/3356C8?campaign=viant_display" height="1" width="1" />', tracking: "" as string },
  { partner: "Kinfolk", adServer: "DV360", pixelId: "PXL-9041D2", pixelType: "Conversion", pixelImg: '<img src="https://p.placed.com/api/v2/sync/9041D2?campaign=kinfolk_video" height="1" width="1" />', tracking: "" as string },
];

function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#e0e0e0] bg-white px-12">
      <div className="flex items-center gap-16">
        <Link href="/attribution" className="flex items-center gap-0.5 font-mono text-lg font-medium text-[#000033]">
          <span>FSQ</span>
          <span>/</span>
          <span>attribution</span>
        </Link>
        <nav className="flex h-14 items-end">
          <div className="flex h-full items-center border-b-2 border-[#000033] px-4">
            <span className="text-sm font-semibold text-[#000033]">Dashboard</span>
          </div>
          <div className="flex h-full items-center px-4">
            <span className="text-sm text-[#000033]">Feasibility Calculator</span>
          </div>
          <div className="flex h-full items-center px-4">
            <span className="text-sm text-[#000033]">Admin</span>
          </div>
        </nav>
      </div>
    </header>
  );
}

function SelectField({ label, placeholder = "Type or Select", helpText, value, onChange, error, options, required }: {
  label: string;
  placeholder?: string;
  helpText?: React.ReactNode;
  value?: string;
  onChange?: (v: string) => void;
  error?: boolean;
  options?: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 min-w-[280px]">
      <label className={`text-sm font-semibold ${error ? "text-[#dc2626]" : "text-black"}`}>{label}{required && <span className="text-[#dc2626]"> *</span>}</label>
      <div className="relative flex items-center">
        {options ? (
          <select
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full appearance-none rounded-md border py-2 pl-3 pr-9 text-sm text-[#020617] outline-none ${error ? "border-[#dc2626] bg-[#fef2f2] focus:border-[#dc2626]" : "border-[#f0f0f0] bg-[#fcfcfc] focus:border-[#212be9]"} ${!value ? "text-[#8d8d8d]" : ""}`}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-md border py-2 pl-3 pr-9 text-sm text-[#020617] outline-none placeholder:text-[#8d8d8d] ${error ? "border-[#dc2626] bg-[#fef2f2] focus:border-[#dc2626]" : "border-[#f0f0f0] bg-[#fcfcfc] focus:border-[#212be9]"}`}
          />
        )}
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-[#8d8d8d]" />
      </div>
      {error && <p className="text-xs leading-4 text-[#dc2626]">This field is required</p>}
      {helpText && !error && <p className="text-xs leading-4 text-[#8d8d8d]">{helpText}</p>}
    </div>
  );
}

function DateField({ label, value, onChange, error, min, required }: { label: string; value?: string; onChange?: (v: string) => void; error?: boolean; min?: string; required?: boolean }) {
  const [open, setOpen] = useState(false);

  const selected = value ? new Date(value + "T00:00:00") : undefined;
  const minDate = min ? new Date(min + "T00:00:00") : undefined;

  const displayValue = selected && !isNaN(selected.getTime())
    ? selected.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    : "";

  return (
    <div className="flex flex-1 flex-col gap-2">
      <label className={`text-sm font-semibold ${error ? "text-[#dc2626]" : "text-[#000033]"}`}>{label}{required && <span className="text-[#dc2626]"> *</span>}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`relative flex w-full items-center rounded-md border py-2 pl-9 pr-3 text-left text-sm outline-none ${error ? "border-[#dc2626] bg-[#fef2f2]" : "border-[#f0f0f0] bg-[#fcfcfc] hover:border-[#d0d0d0]"} ${displayValue ? "text-[#020617]" : "text-[#8d8d8d]"}`}
          >
            <CalendarIcon className="pointer-events-none absolute left-3 size-4 text-[#8d8d8d]" />
            {displayValue || "Select date"}
            <ChevronDown className="pointer-events-none absolute right-3 size-4 text-[#8d8d8d]" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                onChange?.(`${yyyy}-${mm}-${dd}`);
              }
              setOpen(false);
            }}
            disabled={minDate ? { before: minDate } : undefined}
            defaultMonth={selected || minDate || new Date()}
            className="rounded-lg border"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs leading-4 text-[#dc2626]">This field is required</p>}
    </div>
  );
}

function InputField({ label, placeholder = "", value, onChange, error, required }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void; error?: boolean; required?: boolean }) {
  return (
    <div className="flex flex-1 flex-col gap-2 min-w-[280px]">
      <label className={`text-sm font-semibold ${error ? "text-[#dc2626]" : "text-black"}`}>{label}{required && <span className="text-[#dc2626]"> *</span>}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md border py-2 pl-3 pr-3 text-sm text-[#020617] outline-none placeholder:text-[#8d8d8d] ${error ? "border-[#dc2626] bg-[#fef2f2] focus:border-[#dc2626]" : "border-[#f0f0f0] bg-[#fcfcfc] focus:border-[#212be9]"}`}
      />
      {error && <p className="text-xs leading-4 text-[#dc2626]">This field is required</p>}
    </div>
  );
}

const BRAND_OPTIONS = [
  "McDonalds", "Burger King", "Wendy's", "Chick-fil-A", "Subway",
  "Starbucks", "Taco Bell", "Domino's", "Pizza Hut", "Chipotle",
  "Dunkin'", "Popeyes", "KFC", "Panera Bread", "Five Guys",
];

function BrandSearchSelect({ value, onChange, required }: { value: string; onChange: (v: string) => void; required?: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = BRAND_OPTIONS.filter((b) =>
    b.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex flex-1 flex-col gap-1.5" ref={ref}>
      <label className="text-sm font-medium text-[#1f2430]">Brand{required && <span className="text-[#dc2626]"> *</span>}</label>
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className={value ? "text-[#1f2430]" : "text-muted-foreground"}>{value || "Select brand"}</span>
        <ChevronDown className="size-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 size-4 text-[#64748b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands..."
              autoFocus
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">No brands found</p>
            ) : (
              filtered.map((b) => (
                <button
                  key={b}
                  onClick={() => { onChange(b); setOpen(false); }}
                  className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent ${value === b ? "font-medium text-[#1f2430]" : "text-[#1f2430]"}`}
                >
                  <span className="flex-1 text-left">{b}</span>
                  {value === b && <Check className="size-4 text-[#1f2430]" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const SYMBOL_MAP: Record<string, string> = {
  "_": "Underscore(_)",
  "-": "Hyphen(-)",
  ";": "Semicolon(;)",
  ":": "Colon(:)",
  "|": "Pipe(|)",
  "/": "Slash(/)",
  "\\": "Backslash(\\)",
  ".": "Period(.)",
  ",": "Comma(,)",
  "~": "Tilde(~)",
  "#": "Hash(#)",
  "@": "At(@)",
  "+": "Plus(+)",
  "=": "Equals(=)",
  " ": "Space( )",
};
const NAME_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(SYMBOL_MAP).map(([, label]) => [label.replace(/\(.\)$/, "").toLowerCase(), label])
);

function normalizeDelimiter(raw: string): string {
  if (SYMBOL_MAP[raw]) return SYMBOL_MAP[raw];
  const lower = raw.toLowerCase();
  if (NAME_TO_LABEL[lower]) return NAME_TO_LABEL[lower];
  return raw;
}

function InlineUploadZone({ onUpload, onFileDrop }: { onUpload: () => void; onFileDrop: (name: string) => void }) {
  return (
    <>
      <div
        onClick={onUpload}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[#212be9]", "bg-[#f8f9ff]"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-[#212be9]", "bg-[#f8f9ff]"); }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-[#212be9]", "bg-[#f8f9ff]"); const f = e.dataTransfer.files?.[0]; if (f) onFileDrop(f.name); else onUpload(); }}
        className="flex h-20 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]"
      >
        <div className="flex items-center gap-2">
          <Upload className="size-4 text-[#020617]" />
          <span className="text-sm text-[#020617]">
            Drop here or <span className="cursor-pointer text-[#3333ff]">browse from your files</span>
          </span>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
    </>
  );
}

function InlineUploadedCard({ fileName, delimiters, onDelimitersChange, onReplace, isReparsing, reparseError, onRetryReparse }: {
  fileName: string;
  delimiters: string[];
  onDelimitersChange?: (d: string[]) => void;
  onReplace: () => void;
  isReparsing?: boolean;
  reparseError?: string | null;
  onRetryReparse?: () => void;
}) {
  const [delimiterInput, setDelimiterInput] = useState("");
  const [showDelimiters, setShowDelimiters] = useState(delimiters.length > 0);
  const [localDelimiters, setLocalDelimiters] = useState<string[]>(delimiters);
  const isDirty = JSON.stringify(localDelimiters) !== JSON.stringify(delimiters);

  useEffect(() => {
    setLocalDelimiters(delimiters);
  }, [delimiters]);

  const addDelimiter = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) { setDelimiterInput(""); return; }
    const label = normalizeDelimiter(trimmed);
    if (!localDelimiters.includes(label)) {
      setLocalDelimiters((prev) => [...prev, label]);
    }
    setDelimiterInput("");
  };

  const removeDelimiter = (d: string) => {
    setLocalDelimiters((prev) => prev.filter((x) => x !== d));
  };

  const handleDelimiterKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDelimiter(delimiterInput);
    } else if (e.key === "Backspace" && !delimiterInput && localDelimiters.length > 0) {
      setLocalDelimiters((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    onDelimitersChange?.(localDelimiters);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-lg border border-[#e0e0e0] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black">{fileName}</p>
            <p className="text-xs text-[#8d8d8d]">Uploaded today by Eric...</p>
          </div>
          <button className="text-[#212be9]">
            <Download className="size-4" />
          </button>
        </div>

        {delimiters.length > 0 && !showDelimiters && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#e2e8f0] pt-3">
            <span className="text-xs text-[#64748b]">Delimiters:</span>
            {delimiters.map((d) => (
              <span key={d} className="rounded bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#020617]">{d}</span>
            ))}
          </div>
        )}

        <div className="mt-3 border-t border-[#e2e8f0] pt-3">
          <button
            onClick={() => setShowDelimiters(!showDelimiters)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#212be9] transition-colors hover:text-[#1a22c4]"
          >
            {showDelimiters ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
            {showDelimiters ? "Hide Delimiters" : delimiters.length > 0 ? "Edit Delimiters" : "Add Delimiters"}
          </button>

          {showDelimiters && (
            <div className="mt-3">
              <p className="mb-2 text-xs text-[#64748b]">Type a symbol (e.g. ;) or name (e.g. Semicolon) and press Enter.</p>
              <div className={`flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 transition-colors focus-within:border-[#212be9] focus-within:ring-1 focus-within:ring-[#212be9] ${isReparsing ? "pointer-events-none border-[#e2e8f0] opacity-60" : "border-[#e2e8f0]"}`}>
                {localDelimiters.map((d) => (
                  <span key={d} className="flex items-center gap-1 rounded bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#020617]">
                    {d}
                    <button onClick={() => removeDelimiter(d)} className="ml-0.5 text-[#8d8d8d] hover:text-[#020617]">
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={delimiterInput}
                  onChange={(e) => setDelimiterInput(e.target.value)}
                  onKeyDown={handleDelimiterKeyDown}
                  onBlur={() => { if (delimiterInput.trim()) addDelimiter(delimiterInput); }}
                  placeholder={localDelimiters.length === 0 ? "e.g. _ or Underscore" : ""}
                  disabled={isReparsing}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#9ca3af] disabled:cursor-not-allowed"
                />
              </div>

              {isDirty && !isReparsing && (
                <button
                  onClick={handleSubmit}
                  className="mt-3 rounded-md bg-[#212be9] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1a22c4]"
                >
                  Submit Delimiters
                </button>
              )}
            </div>
          )}
        </div>

        {isReparsing && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-[#dbeafe] bg-[#eff6ff] px-3 py-2.5">
            <Loader2 className="size-4 shrink-0 animate-spin text-[#212be9]" />
            <p className="text-xs font-medium text-[#1e40af]">We&apos;re reprocessing your file with the new delimiters. This may update your campaign details.</p>
          </div>
        )}

        {reparseError && !isReparsing && (
          <div className="mt-3 flex items-center justify-between rounded-md border border-[#fecaca] bg-[#fef2f2] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <CircleAlert className="size-4 shrink-0 text-[#dc2626]" />
              <p className="text-xs font-medium text-[#991b1b]">{reparseError}</p>
            </div>
            {onRetryReparse && (
              <button onClick={onRetryReparse} className="ml-3 shrink-0 text-xs font-semibold text-[#dc2626] hover:underline">
                Retry
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={onReplace} className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <Upload className="size-4 text-[#212be9]" />
            <span className="text-xs text-[#212be9]">Replace Uploaded File</span>
          </div>
        </button>
        <p className="text-xs text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
      </div>
    </div>
  );
}

function CampaignDetailsContent({ showForm, onShowForm, campaignName, onCampaignNameChange, onUpload, onFileDrop, hasUploadedFile, hasReuploaded, isUploading, measurementBudget, onMeasurementBudgetChange, metric, onMetricChange, sfValidated, onSfValidatedChange, onValidChange, delimiters, onDelimitersChange, isReparsing, reparseError, onRetryReparse }: { showForm: boolean; onShowForm: () => void; campaignName: string; onCampaignNameChange: (v: string) => void; onUpload: () => void; onFileDrop: (name: string) => void; hasUploadedFile: boolean; hasReuploaded?: boolean; isUploading: boolean; measurementBudget: string; onMeasurementBudgetChange: (v: string) => void; metric: string; onMetricChange: (v: string) => void; sfValidated: boolean; onSfValidatedChange: (v: boolean) => void; onValidChange?: (valid: boolean) => void; delimiters: string[]; onDelimitersChange?: (d: string[]) => void; isReparsing?: boolean; reparseError?: string | null; onRetryReparse?: () => void }) {
  const formRef = useRef<HTMLDivElement>(null);

  const [advertiser, setAdvertiser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [conversionWindow, setConversionWindow] = useState("");
  const [sfOpportunity, setSfOpportunity] = useState("");
  const [sfValidating, setSfValidating] = useState(false);
  const [sfError, setSfError] = useState("");
  const [sfOriginal, setSfOriginal] = useState<{ brand: string; budget: string; metric: string } | null>(null);
  const [agencyName, setAgencyName] = useState("");
  const [ownerType, setOwnerType] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [storeChains, setStoreChains] = useState("");
  const [customStoreList, setCustomStoreList] = useState("");
  const [storeFile, setStoreFile] = useState<{ name: string; uploadedBy: string; uploadedAt: string } | null>(null);
  const storeFileInputRef = useRef<HTMLInputElement>(null);
  const [geoTargeting, setGeoTargeting] = useState("");
  const [geoLocations, setGeoLocations] = useState("");
  const [notes, setNotes] = useState("");
  const [brand, setBrand] = useState("");

  const MOCK_SF_DATA: Record<string, { brand: string; budget: string; metric: string }> = {
    "00341": { brand: "McDonalds", budget: "420,000", metric: "Visits and Sales" },
    "00555": { brand: "Starbucks", budget: "250,000", metric: "Visits" },
    "00789": { brand: "Target", budget: "310,000", metric: "Visits and Sales" },
  };

  const handleSfValidate = () => {
    if (!sfOpportunity.trim()) {
      setSfError("Salesforce Opportunity ID is required.");
      return;
    }
    setSfValidating(true);
    setSfError("");
    setTimeout(() => {
      setSfValidating(false);
      const idMatch = sfOpportunity.match(/(\d{5})/);
      const id = idMatch?.[1];
      const data = id ? MOCK_SF_DATA[id] : undefined;
      if (data) {
        onSfValidatedChange(true);
        setSfOriginal(data);
        setBrand(data.brand);
        onMeasurementBudgetChange(data.budget);
        onMetricChange(data.metric);
      } else if (sfOpportunity.includes("error")) {
        setSfError("Unable to verify ID. Try again later.");
      } else {
        setSfError("Opportunity not found. Please check and try again.");
      }
    }, 1200);
  };

  const normalize = (v: string) => v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const isOverridden = (field: "brand" | "budget" | "metric") => {
    if (!sfOriginal) return false;
    if (field === "brand") return normalize(brand) !== normalize(sfOriginal.brand);
    if (field === "budget") return normalize(measurementBudget) !== normalize(sfOriginal.budget);
    if (field === "metric") return normalize(metric) !== normalize(sfOriginal.metric);
    return false;
  };
  const resetField = (field: "brand" | "budget" | "metric") => {
    if (!sfOriginal) return;
    if (field === "brand") setBrand(sfOriginal.brand);
    if (field === "budget") onMeasurementBudgetChange(sfOriginal.budget);
    if (field === "metric") onMetricChange(sfOriginal.metric);
  };

  type PartnerRow = {
    name: string;
    email: string;
    funding: string;
    channel: string;
    impressions: string;
    spend: string;
    served: string;
    adServer: string;
  };

  const EMPTY_ROW: PartnerRow = { name: "", email: "", funding: "", channel: "", impressions: "", spend: "", served: "", adServer: "" };
  const FUNDING_OPTIONS = ["Partner", "Agency", ""];
  const CHANNEL_OPTIONS = ["Display", "CTV", "Video", "Native", "Audio", "Social", ""];
  const SERVED_OPTIONS = ["Site Served", "Agency Served", ""];
  const AD_SERVER_OPTIONS = ["Site Served", "Google CM360", "Sizmek", "Flashtalking", ""];

  const [partnerRows, setPartnerRows] = useState<PartnerRow[]>([
    { name: "", email: "", funding: "", channel: "", impressions: "", spend: "", served: "", adServer: "" },
  ]);

  function updatePartnerRow(idx: number, field: keyof PartnerRow, value: string) {
    setPartnerRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  const totalImpressions = partnerRows.reduce((sum, r) => sum + (parseInt(r.impressions.replace(/,/g, "")) || 0), 0);
  const totalSpend = partnerRows.reduce((sum, r) => sum + (parseFloat(r.spend.replace(/,/g, "")) || 0), 0);

  useEffect(() => {
    if (hasUploadedFile) {
      setAdvertiser("McDonalds");
      setStartDate("2025-01-15");
      setEndDate("2025-06-30");
      setConversionWindow("30 Days");
      setAgencyName("Starcom Worldwide");
      setOwnerType("Agency");
      setContactName("Sarah Mitchell");
      setEmail("s.mitchell@starcom.com");
      setCountry("United States");
      setStoreChains("McDonalds US");
      setGeoTargeting("National");
      setGeoLocations("All US Markets");
      setNotes("Q1-Q2 2025 brand awareness campaign across digital channels.");
      if (!sfValidated) {
        setSfOpportunity("https://salesforce.com/opp/00341");
        onSfValidatedChange(true);
        const sfData = { brand: "McDonalds", budget: measurementBudget || "420,000", metric: metric || "Visits and Sales" };
        setSfOriginal(sfData);
        setBrand(sfData.brand);
        onMeasurementBudgetChange(sfData.budget);
        onMetricChange(sfData.metric);
      }
    }
  }, [hasUploadedFile]);

  const isStepValid = sfValidated && !!brand.trim() && !!measurementBudget.trim() && !!metric.trim() && (
    hasUploadedFile || (
      !!campaignName.trim() && !!advertiser.trim() && !!startDate && !!endDate && !!agencyName.trim() && !!country.trim() && !!storeChains.trim()
    )
  );

  useEffect(() => {
    onValidChange?.(isStepValid);
  }, [isStepValid, onValidChange]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Campaign Details</h2>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>
            Let&apos;s get started in setting up your new campaign. Enter a Salesforce Opportunity to pull in campaign data.
          </p>
          <p>
            <span className="cursor-pointer text-[#3333ff]">Learn more</span> about Attribution on Foursquare Documentation.
          </p>
        </div>
      </div>

      {/* Salesforce Opportunity ID */}
      <div className="mb-6">
        <div className="flex max-w-[560px] flex-col gap-1.5">
          <label className="text-sm font-medium text-[#1f2430]">
            Salesforce Opportunity ID or URL <span className="text-[#dc2626]">*</span>
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={sfOpportunity}
                onChange={(e) => {
                  setSfOpportunity(e.target.value);
                  if (sfError) setSfError("");
                }}
                placeholder="e.g. https://salesforce.com/opp/00341 or 00341"
                disabled={sfValidating}
                className={`h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm text-[#1f2430] shadow-xs outline-none placeholder:text-[#94a3b8] focus-visible:ring-[3px] ${
                  sfError
                    ? "border-[#dc2626] focus-visible:border-[#dc2626] focus-visible:ring-[#dc2626]/20"
                    : sfValidated
                    ? "border-[#16a34a] focus-visible:border-[#16a34a] focus-visible:ring-[#16a34a]/20"
                    : "border-input focus-visible:border-ring focus-visible:ring-ring/50"
                }`}
              />
              {sfValidated && !sfError && (
                <Check className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#16a34a]" />
              )}
            </div>
            <button
              onClick={handleSfValidate}
              disabled={sfValidating || !sfOpportunity.trim()}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[#212be9] bg-white px-4 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sfValidating && <Loader2 className="size-4 animate-spin" />}
              {sfValidating ? "Verifying..." : sfValidated ? "Re-verify" : "Verify"}
            </button>
          </div>
          {sfError && (
            <p className="flex items-center gap-1.5 text-xs text-[#dc2626]">
              <CircleAlert className="size-3.5" />
              {sfError}
            </p>
          )}
          {sfValidated && !sfError && (
            <p className="text-xs text-[#16a34a]">Salesforce Opportunity verified successfully.</p>
          )}
        </div>
      </div>

      {/* Progressive disclosure: show rest only after SF validated */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: sfValidated ? "9999px" : "0px",
          opacity: sfValidated ? 1 : 0,
        }}
      >

      {/* Brand, Budget, Metric */}
      <div className="mb-6 flex gap-6">
        <div className="relative flex flex-1 flex-col gap-1.5">
          <BrandSearchSelect value={brand} onChange={setBrand} required />
          {isOverridden("brand") && (
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#fefce8] px-1.5 py-0.5 text-[10px] font-medium text-[#92400e]">This value differs from Salesforce data</span>
              <button onClick={() => resetField("brand")} className="text-[10px] font-medium text-[#212be9] hover:underline">Reset</button>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#1f2430]">Measurement Budget <span className="text-[#dc2626]">*</span></label>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#64748b]">$</span>
            <input
              type="text"
              value={measurementBudget}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                onMeasurementBudgetChange(raw ? parseInt(raw).toLocaleString() : "");
              }}
              placeholder="0"
              className={`h-9 w-full rounded-md border bg-transparent py-2 pl-7 pr-3 text-sm text-[#1f2430] shadow-xs outline-none placeholder:text-[#94a3b8] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ${isOverridden("budget") ? "border-[#f59e0b] bg-[#fffbeb]" : "border-input"}`}
            />
          </div>
          {isOverridden("budget") && (
            <div className="flex flex-col gap-1">
              <p className="text-[11px] leading-4 text-[#92400e]">
                This value differs from Salesforce data. If this value is correct, please update it in Salesforce.
              </p>
              <div className="flex items-center gap-3">
                {sfOpportunity.trim() && (
                  <a
                    href={sfOpportunity.startsWith("http") ? sfOpportunity : `https://salesforce.com/opp/${sfOpportunity}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-[#212be9] hover:underline"
                  >
                    Edit in Salesforce ↗
                  </a>
                )}
                <button onClick={() => resetField("budget")} className="text-[11px] font-medium text-[#212be9] hover:underline">Reset value</button>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#1f2430]">Metric <span className="text-[#dc2626]">*</span></label>
          </div>
          <Select value={metric || undefined} onValueChange={onMetricChange}>
            <SelectTrigger className={`w-full ${isOverridden("metric") ? "border-[#f59e0b] bg-[#fffbeb]" : ""}`}>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Visits">Visits</SelectItem>
              <SelectItem value="Visits and Sales">Visits and Sales</SelectItem>
            </SelectContent>
          </Select>
          {isOverridden("metric") && (
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#fefce8] px-1.5 py-0.5 text-[10px] font-medium text-[#92400e]">This value differs from Salesforce data</span>
              <button onClick={() => resetField("metric")} className="text-[10px] font-medium text-[#212be9] hover:underline">Reset</button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 h-px w-full bg-[#e2e8f0]" />

      <div className="mb-10">
        <p className="mb-4 text-sm font-medium text-black">Upload a Media Plan</p>
        {isUploading ? (
          <div className="flex h-20 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#212be9] bg-[#f8f9ff]">
            <div className="flex items-center gap-3">
              <Loader2 className="size-5 animate-spin text-[#212be9]" />
              <span className="text-sm font-medium text-[#212be9]">Processing media plan...</span>
            </div>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[#e2e8f0]">
              <div className="h-full animate-[progress_2s_ease-in-out] rounded-full bg-[#212be9]" style={{ animation: "progress 2.4s ease-in-out forwards" }} />
            </div>
            <style>{`@keyframes progress { 0% { width: 0% } 40% { width: 60% } 80% { width: 85% } 100% { width: 100% } }`}</style>
          </div>
        ) : hasUploadedFile ? (
          <InlineUploadedCard
            fileName={hasReuploaded ? "Carta/Mcdonalds2024_new" : "Carta/Mcdonalds2024"}
            delimiters={delimiters}
            onDelimitersChange={onDelimitersChange}
            onReplace={onUpload}
            isReparsing={isReparsing}
            reparseError={reparseError}
            onRetryReparse={onRetryReparse}
          />
        ) : (
          <InlineUploadZone onUpload={onUpload} onFileDrop={onFileDrop} />
        )}
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-black">Or Manually Add Campaign Details</p>

        {!showForm && (
          <button
            onClick={onShowForm}
            className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
          >
            Manually Add Campaign Details
          </button>
        )}

        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: showForm ? "9999px" : "0px",
            opacity: showForm ? 1 : 0,
          }}
        >
          <div ref={formRef} className="flex flex-col gap-12 pt-2">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-[#646464]">Setup</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <InputField label="Campaign Name" value={campaignName} onChange={onCampaignNameChange} required />
                  <SelectField label="Advertiser" value={advertiser} onChange={setAdvertiser} required />
                </div>
                <div className="flex gap-4">
                  <DateField label="Start Date" value={startDate} onChange={setStartDate} required />
                  <DateField label="End Date" value={endDate} onChange={setEndDate} min={startDate} required />
                </div>
                <div className="flex gap-4">
                  <InputField label="Conversion Window" placeholder="# days to observe a visit after initial ad exposure" value={conversionWindow} onChange={setConversionWindow} />
                  <div className="flex-1 min-w-[280px]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-[#646464]">Ownership</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <SelectField label="Agency/Partner Name" value={agencyName} onChange={setAgencyName} required />
                  <SelectField label="Owner Type (relationship)" value={ownerType} onChange={setOwnerType} />
                </div>
                <div className="flex gap-4">
                  <SelectField label="Agency/Partner Contact Name" value={contactName} onChange={setContactName} />
                  <InputField label="Email" value={email} onChange={setEmail} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-[#646464]">Conversions</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <SelectField label="Country" value={country} onChange={setCountry} required />
                  <div className="flex flex-1 flex-col gap-2 min-w-[280px]">
                    <label className="text-sm font-semibold text-black">Store Chains to be measured <span className="text-[#dc2626]">*</span></label>
                    <div className="relative flex items-center">
                      <select
                        value={storeChains}
                        onChange={(e) => {
                          setStoreChains(e.target.value);
                          if (e.target.value !== "Custom list") {
                            setCustomStoreList("");
                            setStoreFile(null);
                          }
                        }}
                        className={`w-full appearance-none rounded-md border border-[#f0f0f0] bg-[#fcfcfc] py-2 pl-3 pr-9 text-sm text-[#020617] outline-none focus:border-[#212be9] ${!storeChains ? "text-[#8d8d8d]" : ""}`}
                      >
                        <option value="">Type or Select</option>
                        <option value="McDonalds US">McDonalds US</option>
                        <option value="Starbucks">Starbucks</option>
                        <option value="Walmart">Walmart</option>
                        <option value="Target">Target</option>
                        <option value="Costco">Costco</option>
                        <option value="Whole Foods">Whole Foods</option>
                        <option value="Kroger">Kroger</option>
                        <option value="Walgreens">Walgreens</option>
                        <option value="CVS">CVS</option>
                        <option value="Custom list">Custom list</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-[#8d8d8d]" />
                    </div>
                    {storeChains !== "Custom list" && (
                      <p className="text-xs text-[#6b7280]">
                        If you have a custom list, please{" "}
                        <button
                          type="button"
                          onClick={() => setStoreChains("Custom list")}
                          className="cursor-pointer text-[#212be9] hover:underline"
                        >
                          upload a file
                        </button>{" "}
                        or contact your representative.
                      </p>
                    )}

                    {storeChains === "Custom list" && (
                      <div className="mt-1 flex flex-col gap-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4">
                        <p className="text-sm font-medium text-[#1f2430]">Custom Store List</p>
                        <p className="text-xs text-[#6b7280]">
                          Manually enter store{" "}
                          <span className="group/info relative inline-flex items-center gap-0.5">
                            info
                            <Info className="inline size-3.5 cursor-help text-[#94a3b8] transition-colors group-hover/info:text-[#6b7280]" />
                            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1f2430] px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/info:opacity-100">
                              Store Name, Address, City, State/Province, Zip Code/Postal Code
                            </span>
                          </span>
                          {" "}or upload a file with your list.
                        </p>
                        <textarea
                          value={customStoreList}
                          onChange={(e) => setCustomStoreList(e.target.value)}
                          placeholder={"e.g. Target, 123 Main St, New York, NY, 10001"}
                          rows={4}
                          className="w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#1f2430] outline-none placeholder:text-[#94a3b8] focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]/20"
                        />
                        <div className="flex items-center gap-3">
                          <input
                            ref={storeFileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls,.txt"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setStoreFile({
                                  name: file.name,
                                  uploadedBy: "Sang Yeo",
                                  uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                                });
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => storeFileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2d46f6] px-3 py-1.5 text-sm font-medium text-[#2d46f6] transition-colors hover:bg-[#f0f1ff]"
                          >
                            <Upload className="size-3.5" />
                            Upload file
                          </button>
                          <span className="text-xs text-[#94a3b8]">CSV, Excel, or TXT</span>
                        </div>

                        {storeFile && (
                          <div className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] bg-white px-4 py-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-[#eef2ff]">
                              <FileText className="size-5 text-[#2d46f6]" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#1f2430]">{storeFile.name}</p>
                              <p className="text-xs text-[#6b7280]">Uploaded by {storeFile.uploadedBy} · {storeFile.uploadedAt}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setStoreFile(null);
                                if (storeFileInputRef.current) storeFileInputRef.current.value = "";
                              }}
                              className="rounded-full p-1 text-[#94a3b8] transition-colors hover:bg-gray-100 hover:text-[#1f2430]"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <SelectField label="Geographic targeting level" value={geoTargeting} onChange={setGeoTargeting} />
                  <SelectField label="Geographical locations" value={geoLocations} onChange={setGeoLocations} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-black">Campaign Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this campaign..."
                className="h-20 resize-y rounded-md border border-[#f0f0f0] bg-[#fcfcfc] px-3 py-2.5 text-sm text-[#020617] outline-none placeholder:text-[#8d8d8d] focus:border-[#212be9]"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

const PARTNER_NAME_OPTIONS = ["Adtheorent", "Viant", "Nexxen", "TradeDesk", "LiveRamp", "Taboola"];
const AD_SERVER_OPTIONS = ["CM360", "DV360", "Google Campaign Manager", "Sizmek", "Flashtalking", "Innovid", "Extreme Reach"];
const AGENCY_OPTIONS = ["Starcom", "Mediavest", "Zenith", "OMD", "Mindshare", "Wavemaker"];
const PIXEL_TYPE_OPTIONS = ["In-App", "Cross-Device / CTV", "Cross-Device Redirect"];
const PIXEL_IMPL_OPTIONS = ["Standard Tag", "Server-to-Server", "SDK Integration", "Piggyback Pixel"];
const MEDIA_TYPE_OPTIONS = ["Display", "Mobile", "Video", "Audio", "CTV", "Social", "Native", "OOH"];
const CONVERSION_TYPE_OPTIONS = ["Visits and Sales Impact", "Sales Impact", "Visits Only", "Custom Attribution"];
const PRICING_METHOD_OPTIONS = ["CPM", "CPC", "CPA", "Flat Rate", "Revenue Share"];
const RATE_CARD_OPTIONS = ["Standard Rate", "Premium Rate", "Custom Rate", "Negotiated Rate"];
const FUNDING_NAME_OPTIONS = ["Starcom_Visits_2025", "Zenith_SI_2025", "OMD_Custom_2025", "Mindshare_Q2_2025"];
const SALES_MANAGER_OPTIONS = ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim", "Amanda Wilson"];
const AD_OPS_OPTIONS = ["James Lee", "Lisa Wang", "Robert Brown", "Jennifer Taylor", "Kevin Martinez"];

function AddPartnerForm({ mode, onDiscard, onSave, errorFields = [], initialValues = {} }: { mode: "add" | "edit"; onDiscard: () => void; onSave: (formData: Record<string, string>) => void; errorFields?: string[]; initialValues?: Record<string, string> }) {
  const [mediaTypeOpen, setMediaTypeOpen] = useState(true);

  const initialMediaTypes = (() => {
    const types: { id: number; value: string }[] = [];
    let i = 0;
    while (initialValues[`Media Type ${i}`]) {
      types.push({ id: i + 1, value: initialValues[`Media Type ${i}`] });
      i++;
    }
    return types.length > 0 ? types : [{ id: 1, value: "" }];
  })();
  const [mediaTypes, setMediaTypes] = useState(initialMediaTypes);

  const [formValues, setFormValues] = useState<Record<string, string>>(initialValues);
  const [clearedErrors, setClearedErrors] = useState<Set<string>>(new Set());

  const hasError = (field: string) => errorFields.includes(field) && !clearedErrors.has(field) && !formValues[field];

  const updateField = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (value) {
      setClearedErrors((prev) => new Set(prev).add(field));
    } else {
      setClearedErrors((prev) => {
        const next = new Set(prev);
        next.delete(field);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-base font-semibold text-black">{mode === "add" ? "Add" : "Edit"} Media Partner</p>

      <div className="flex flex-col gap-12">
        {/* Partner/Platform Setup */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-[#646464]">Partner/Platform Setup</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-8">
              <SelectField label="Partner/Platform Name" value={formValues["Partner/Platform Name"] ?? ""} onChange={(v) => updateField("Partner/Platform Name", v)} options={PARTNER_NAME_OPTIONS} />
              <SelectField label="Ad Server" value={formValues["Ad Server"] ?? ""} onChange={(v) => updateField("Ad Server", v)} error={hasError("Ad Server")} options={AD_SERVER_OPTIONS} />
            </div>
            <div className="flex gap-8">
              <DateField label="Ad Run Start Date" value={formValues["Ad Run Start Date"] ?? ""} onChange={(v) => updateField("Ad Run Start Date", v)} error={hasError("Ad Run Start Date")} />
              <DateField label="Ad Run End Date" value={formValues["Ad Run End Date"] ?? ""} onChange={(v) => updateField("Ad Run End Date", v)} error={hasError("Ad Run End Date")} min={formValues["Ad Run Start Date"] ?? ""} />
            </div>
            <div className="flex gap-8">
              <SelectField label="Agency or Site Served" value={formValues["Agency or Site Served"] ?? ""} onChange={(v) => updateField("Agency or Site Served", v)} error={hasError("Agency or Site Served")} options={AGENCY_OPTIONS} />
              <InputField label="Estimated Total Ad Spend" placeholder="Ad Spend value..." value={formValues["Estimated Total Ad Spend"] ?? ""} onChange={(v) => updateField("Estimated Total Ad Spend", v)} error={hasError("Estimated Total Ad Spend")} />
            </div>
            <div className="flex gap-8">
              <div className="flex flex-1 flex-col gap-2 min-w-[280px]">
                <SelectField label="FSQ Pixel Implementation" value={formValues["FSQ Pixel Implementation"] ?? ""} onChange={(v) => updateField("FSQ Pixel Implementation", v)} options={PIXEL_IMPL_OPTIONS} />
              </div>
              <div className="flex-1 min-w-[280px]" />
            </div>
          </div>
        </div>

        {/* Media Types */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold text-[#646464]">Media Types</p>
          {mediaTypes.map((mt, idx) => (
            <div key={mt.id} className="rounded-md border border-[#e0e0e0] px-4 py-4">
              <button
                onClick={() => setMediaTypeOpen(!mediaTypeOpen)}
                className="flex w-full items-center gap-4"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-xs font-semibold text-[#646464]">Media Type {mediaTypes.length > 1 ? idx + 1 : ""} Details</p>
                </div>
                {mediaTypeOpen ? <ChevronUp className="size-4 text-[#8d8d8d]" /> : <ChevronDown className="size-4 text-[#8d8d8d]" />}
              </button>
              {mediaTypeOpen && (
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex gap-8">
                    <SelectField label="Media Type" value={formValues[`Media Type ${idx}`] ?? ""} onChange={(v) => updateField(`Media Type ${idx}`, v)} options={MEDIA_TYPE_OPTIONS} />
                    <SelectField label="Conversion Funding Report Type" value={formValues[`Conversion Report ${idx}`] ?? formValues["Conversion Funding Report Type"] ?? ""} onChange={(v) => updateField(`Conversion Report ${idx}`, v)} error={hasError("Conversion Funding Report Type")} options={CONVERSION_TYPE_OPTIONS} />
                  </div>
                  <div className="flex gap-8">
                    <InputField label="Estimated Ad Spend" placeholder="Ad Spend value..." value={formValues[`Estimated Ad Spend ${idx}`] ?? formValues["Estimated Ad Spend"] ?? ""} onChange={(v) => updateField(`Estimated Ad Spend ${idx}`, v)} />
                    <InputField label="Estimated Impressions" placeholder="Impressions value..." value={formValues[`Estimated Impressions ${idx}`] ?? formValues["Estimated Impressions"] ?? ""} onChange={(v) => updateField(`Estimated Impressions ${idx}`, v)} />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => setMediaTypes((prev) => [...prev, { id: prev.length + 1, value: "" }])}
            className="flex items-center gap-1 self-start text-sm font-medium text-[#212be9]"
          >
            <Plus className="size-4" />
            Add a Media Type
          </button>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-[#646464]">Contact Info</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-8">
              <SelectField label="Sales/Account Manager Name" value={formValues["Sales/Account Manager Name"] ?? ""} onChange={(v) => updateField("Sales/Account Manager Name", v)} error={hasError("Sales/Account Manager Name")} options={SALES_MANAGER_OPTIONS} />
              <InputField label="Sales/Account Manager Email" placeholder="Email..." value={formValues["Sales/Account Manager Email"] ?? ""} onChange={(v) => updateField("Sales/Account Manager Email", v)} />
            </div>
            <div className="flex gap-8">
              <SelectField label="Ad Ops Contact Name" value={formValues["Ad Ops Contact Name"] ?? ""} onChange={(v) => updateField("Ad Ops Contact Name", v)} options={AD_OPS_OPTIONS} />
              <InputField label="Ad Ops Contact Email" placeholder="Email..." value={formValues["Ad Ops Contact Email"] ?? ""} onChange={(v) => updateField("Ad Ops Contact Email", v)} />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-black">Notes (Optional)</label>
          <textarea
            placeholder="Type down your notes here..."
            className="h-20 resize-y rounded-md border border-[#f0f0f0] bg-[#fcfcfc] px-3 py-2.5 text-sm text-[#020617] outline-none placeholder:text-[#8d8d8d] focus:border-[#212be9]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <button
          onClick={onDiscard}
          className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
        >
          Discard Changes
        </button>
        <button
          onClick={() => onSave(formValues)}
          className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]"
        >
          Save Media Partner
        </button>
      </div>
    </div>
  );
}

const FUNDING_PARTNERS = [
  { name: "Viant", mediaType: "Display", estimatedSpend: 125000, adServer: "Google Campaign Manager" },
  { name: "Adtheorent", mediaType: "Mobile", estimatedSpend: 85000, adServer: "" },
  { name: "Nexxen", mediaType: "Video", estimatedSpend: 210000, adServer: "Innovid" },
];

function FundingAllocationContent({ measurementBudget, onValidChange }: { measurementBudget: number; onValidChange?: (valid: boolean) => void }) {
  const totalOriginalSpend = FUNDING_PARTNERS.reduce((sum, p) => sum + p.estimatedSpend, 0);

  const [allocations, setAllocations] = useState(
    FUNDING_PARTNERS.map((p) => ({
      ...p,
      fundingVisits: "",
      fundingSalesImpact: "",
      fundingNameVisits: "",
      fundingNameSales: "",
    }))
  );

  const updateAllocation = (index: number, field: "fundingVisits" | "fundingSalesImpact" | "fundingNameVisits" | "fundingNameSales", value: string) => {
    setAllocations((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const isValid = allocations.every((a) => !!a.fundingVisits && !!a.fundingSalesImpact);

  useEffect(() => {
    onValidChange?.(isValid);
  }, [isValid, onValidChange]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Funding Allocation</h2>
        <p className="mt-1 text-sm leading-5 text-[#646464]">
          Specify who is funding visits and sales impact for each media partner.
        </p>
      </div>

      <div className="mb-4 h-px w-full bg-[#e2e8f0]" />

      <Alert className="mb-6 border-[#bfdbfe] bg-[#eff6ff]">
        <Info className="size-4 text-[#3b82f6]" />
        <AlertTitle className="text-[#1e40af]">Select funding sources for each partner</AlertTitle>
        <AlertDescription className="text-[#1e40af]/80">
          For each media partner below, choose who is funding visits and who is funding sales impact.
        </AlertDescription>
      </Alert>

      {/* Summary Card */}
      <div className="mb-6">
        <div className="rounded-lg border border-border bg-white px-4 py-3 w-fit">
          <p className="text-xs font-medium text-[#6b7280]">Measurement Budget</p>
          <p className="mt-0.5 text-lg font-semibold text-[#1f2430]">${measurementBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Allocation Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-border bg-[#f8fafc]">
              <th className="w-[14%] px-4 py-3.5 text-left text-sm font-medium text-[#64748b]">Partner</th>
              <th className="w-[16%] px-4 py-3.5 text-left text-sm font-medium text-[#64748b]">Who is funding visits</th>
              <th className="w-[20%] px-4 py-3.5 text-left text-sm font-medium text-[#64748b]">Funding name for visits</th>
              <th className="w-[18%] px-4 py-3.5 text-left text-sm font-medium text-[#64748b]">Who is funding sales impact</th>
              <th className="w-[20%] px-4 py-3.5 text-left text-sm font-medium text-[#64748b]">Funding name for sales impact</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc, i) => {
              return (
                <tr key={alloc.name} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-[#1f2430]">{alloc.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <Select value={alloc.fundingVisits || undefined} onValueChange={(val) => updateAllocation(i, "fundingVisits", val)}>
                      <SelectTrigger className={`w-full ${alloc.fundingVisits ? "" : "border-[#f59e0b]"}`} size="sm">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agency">Agency</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={alloc.fundingNameVisits}
                      onChange={(e) => updateAllocation(i, "fundingNameVisits", e.target.value)}
                      placeholder="Enter name..."
                      className="w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm text-[#020617] outline-none placeholder:text-[#9ca3af] focus:border-[#212be9]"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <Select value={alloc.fundingSalesImpact || undefined} onValueChange={(val) => updateAllocation(i, "fundingSalesImpact", val)}>
                      <SelectTrigger className={`w-full ${alloc.fundingSalesImpact ? "" : "border-[#f59e0b]"}`} size="sm">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agency">Agency</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={alloc.fundingNameSales}
                      onChange={(e) => updateAllocation(i, "fundingNameSales", e.target.value)}
                      placeholder="Enter name..."
                      className="w-full rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm text-[#020617] outline-none placeholder:text-[#9ca3af] focus:border-[#212be9]"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

type PixelState = "empty" | "empty-uploaded" | "populated";

function MultiSelectDropdown({ options, selected, onChange, placeholder, hasWarning }: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
  hasWarning?: boolean;
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
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex min-h-[36px] min-w-[220px] max-w-[340px] items-center justify-between rounded-md border bg-white px-3 py-1.5 text-left text-sm transition-colors ${hasWarning && selected.length === 0 ? "border-[#f59e0b]" : open ? "border-[#212be9] ring-1 ring-[#212be9]" : "border-[#e2e8f0]"}`}
      >
        {selected.length === 0 ? (
          <span className="text-[#94a3b8]">{placeholder}</span>
        ) : (
          <span className="flex flex-row flex-wrap gap-1">
            {selected.map((s) => (
              <span key={s} className="inline-flex shrink-0 items-center gap-1 rounded bg-[#f1f5f9] px-1.5 py-0.5 text-xs font-medium text-[#020617]">
                {s}
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(s); }}
                  className="text-[#8d8d8d] hover:text-[#020617]"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </span>
        )}
        <ChevronDown className={`ml-2 size-4 shrink-0 text-[#8d8d8d] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] max-w-[340px] rounded-md border border-[#e2e8f0] bg-white py-1 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-3 py-1.5">
            <button
              onClick={() => onChange([...options])}
              className={`text-xs font-medium transition-colors ${allSelected ? "text-[#94a3b8]" : "text-[#212be9] hover:text-[#1a22c4]"}`}
            >
              Select All
            </button>
            <button
              onClick={() => onChange([])}
              className={`text-xs font-medium transition-colors ${selected.length === 0 ? "text-[#94a3b8]" : "text-[#dc2626] hover:text-[#b91c1c]"}`}
            >
              Reset
            </button>
          </div>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#020617] transition-colors hover:bg-[#f5f5ff]"
            >
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

function PixelGenerationContent({ pixelState, onValidChange, onBack, onContinue }: { pixelState: PixelState; onValidChange?: (valid: boolean) => void; onBack: () => void; onContinue: () => void }) {
  const [openActionRow, setOpenActionRow] = useState<number | null>(null);
  const [showUploadBanner, setShowUploadBanner] = useState(pixelState === "empty-uploaded");
  const [pixels, setPixels] = useState(PIXELS.map((p) => ({ ...p })));
  const [viewPixelRow, setViewPixelRow] = useState<number | null>(null);
  const [copiedPixelRow, setCopiedPixelRow] = useState<number | null>(null);
  const pixelPopoverRef = useRef<HTMLDivElement>(null);
  const [activePixelSubStep, setActivePixelSubStep] = useState(1);
  const [adServers, setAdServers] = useState(
    PIXELS.map((p) => ({ partner: p.partner, adServers: p.partner === "Kinfolk" ? [] as string[] : [p.adServer], pixelTypes: [] as string[] }))
  );

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

  const isValid = pixelState !== "populated" || pixels.every((p) => !!p.tracking);

  useEffect(() => {
    onValidChange?.(isValid);
  }, [isValid, onValidChange]);

  return (
    <>
      {showUploadBanner && (
        <div className="mb-4 flex items-center rounded-lg border border-[#e0e0e0] bg-white px-4 py-3">
          <div className="flex flex-1 items-center gap-8">
            <div>
              <p className="text-sm font-semibold text-[#020617]">Upload Results</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#757575]">File</span>
              <span className="text-sm font-medium text-[#020617]">Carta/Macdonalds2024</span>
            </div>
            <div>
              <span className="text-xs text-[#757575]">Campaign Details</span>
              <p className="text-xs font-medium text-[#dc2626]">No Information Available</p>
            </div>
            <div>
              <span className="text-xs text-[#757575]">Partner Details</span>
              <p className="text-xs font-medium text-[#dc2626]">No Information Available</p>
            </div>
            <div>
              <span className="text-xs text-[#757575]">Placement Details</span>
              <p className="text-xs font-medium text-[#f59e0b]">Missing Information</p>
            </div>
          </div>
          <button onClick={() => setShowUploadBanner(false)} className="ml-4 shrink-0 p-1 text-[#8d8d8d] hover:text-[#020617]">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Pixel Generation</h2>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>
            Manage generated pixels here. Pixels are auto-generated using provided Salesforce data and partner details.
          </p>
          <p>
            <span className="cursor-pointer text-[#212be9]">Learn more</span> about self-directed pixel generation.
          </p>
        </div>
      </div>

      <div className="mb-6 h-px w-full bg-[#e2e8f0]" />

      {pixelState === "populated" && <PixelSubSteps activeStep={activePixelSubStep} />}

      {pixelState === "populated" ? (
        <>
          {activePixelSubStep === 1 ? (
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
                            onChange={(val) =>
                              setAdServers((prev) =>
                                prev.map((r, idx) => (idx === i ? { ...r, adServers: val } : r))
                              )
                            }
                            placeholder="Select ad servers..."
                            hasWarning={row.adServers.length === 0}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <MultiSelectDropdown
                            options={PIXEL_TYPE_OPTIONS}
                            selected={row.pixelTypes}
                            onChange={(val) =>
                              setAdServers((prev) =>
                                prev.map((r, idx) => (idx === i ? { ...r, pixelTypes: val } : r))
                              )
                            }
                            placeholder="Select pixel types..."
                            hasWarning={row.pixelTypes.length === 0}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="rounded-md border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#020617] transition-colors hover:bg-gray-50"
                >
                  Back to Funding Allocation
                </button>
                <button
                  onClick={() => setActivePixelSubStep(2)}
                  disabled={adServers.some((r) => r.adServers.length === 0 || r.pixelTypes.length === 0)}
                  className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Manage Pixels
                </button>
              </div>
            </>
          ) : (
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
                  <button className="rounded-md border border-[#e2e8f0] bg-white p-2 hover:bg-gray-50">
                    <Copy className="size-4 text-[#64748b]" />
                  </button>
                  <button className="rounded-md border border-[#e2e8f0] bg-white p-2 hover:bg-gray-50">
                    <Mail className="size-4 text-[#64748b]" />
                  </button>
                  <button className="group relative rounded-md border border-[#212be9] bg-[#fcfcfc] p-2 text-[#212be9] transition-colors hover:bg-[#ebf1ff]">
                    <Download className="size-4" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0f172a] px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      Download All
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#0f172a]" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="relative w-full">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="w-[40px] px-4 py-3" />
                      <th className="w-[12%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Partner</th>
                      <th className="w-[18%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Ad Server</th>
                      <th className="w-[22%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel Type</th>
                      <th className="w-[12%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Tagging</th>
                      <th className="w-[12%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel ID</th>
                      <th className="w-[10%] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel</th>
                      <th className="w-[80px] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pixels.map((pixel, i) => {
                      const matchingRow = adServers.find((r) => r.partner === pixel.partner);
                      return (
                      <tr key={i} className="border-b border-[#e2e8f0]">
                        <td className="w-10 px-4 py-4">
                          <div className="size-4 rounded border border-[#0f172a]" />
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-black">{pixel.partner}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(matchingRow?.adServers ?? [pixel.adServer]).map((s) => (
                              <span key={s} className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-xs font-medium text-[#020617]">{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(matchingRow?.pixelTypes ?? []).length > 0 ? matchingRow!.pixelTypes.map((t) => (
                              <span key={t} className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-xs font-medium text-[#020617]">{t}</span>
                            )) : (
                              <span className="text-xs text-[#94a3b8]">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Select value={pixel.tracking || undefined} onValueChange={(val) => updateTracking(i, val)}>
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
                        <td className="relative w-[80px] px-4 py-4 text-center">
                          <button
                            onClick={() => setOpenActionRow(openActionRow === i ? null : i)}
                            className="rounded-md p-1 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="size-4 text-[#64748b]" />
                          </button>
                          {openActionRow === i && (
                            <div className="absolute right-4 top-12 z-10 w-40 rounded-lg border border-[#e2e8f0] bg-white py-1 shadow-lg">
                              <button className="flex w-full items-center px-4 py-2 text-left text-sm text-[#020617] hover:bg-gray-50">Email</button>
                              <button className="flex w-full items-center px-4 py-2 text-left text-sm text-[#020617] hover:bg-gray-50">Download</button>
                            </div>
                          )}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pixels.length > 10 && (
              <div className="mt-6 flex items-center justify-end gap-1">
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#64748b] hover:bg-gray-50">
                  <ChevronLeft className="size-4" />
                  Previous
                </button>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className={`flex size-10 items-center justify-center rounded-lg text-sm font-medium ${
                      n === 1 ? "border border-[#e2e8f0] bg-white text-[#0f172a]" : "text-[#64748b] hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </div>
                ))}
                <div className="flex size-10 items-center justify-center text-sm text-[#64748b]">...</div>
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#64748b] hover:bg-gray-50">
                  Next
                  <ChevronRight className="size-4" />
                </button>
              </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setActivePixelSubStep(1)}
                  className="rounded-md border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#020617] transition-colors hover:bg-gray-50"
                >
                  Back to Confirm Ad Server
                </button>
                <button
                  onClick={onContinue}
                  disabled={!isValid}
                  className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Review
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-[#e2e8f0] bg-[#fcfcfc] px-6 py-6">
          <p className="text-sm font-semibold text-[#020617]">No pixels have been generated</p>
          <div className="mt-2 text-sm text-[#646464]">
            <p>No pixel information is available.</p>
            <p>
              Please add a valid <span className="cursor-pointer text-[#212be9]">Salesforce Opportunity URL</span>, and at least one <span className="cursor-pointer text-[#212be9]">media partner</span> in the previous steps.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

const PLACEMENT_SUB_STEPS = [
  { num: 1, label: "Media Plan" },
  { num: 2, label: "Map Partners" },
  { num: 3, label: "Map Taxonomies" },
  { num: 4, label: "Map Creatives" },
  { num: 5, label: "Apply Placements" },
];

const PIXEL_SUB_STEPS = [
  { num: 1, label: "Confirm Ad Server" },
  { num: 2, label: "Manage Generated Pixels" },
];

type PlacementState = "empty" | "uploaded" | "new-upload";

function PlacementSubSteps({ activeStep, hasReuploaded }: { activeStep: number; hasReuploaded?: boolean }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex gap-0">
        {PLACEMENT_SUB_STEPS.map((s) => (
          <div
            key={s.num}
            className={`h-1 flex-1 ${s.num <= activeStep ? "bg-[#020617]" : "bg-[#e2e8f0]"} ${s.num === 1 ? "rounded-l-full" : ""} ${s.num === PLACEMENT_SUB_STEPS.length ? "rounded-r-full" : ""}`}
          />
        ))}
      </div>
      <div className="flex">
        {PLACEMENT_SUB_STEPS.map((s) => (
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

function PixelSubSteps({ activeStep }: { activeStep: number }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex gap-0">
        {PIXEL_SUB_STEPS.map((s) => (
          <div
            key={s.num}
            className={`h-1 flex-1 ${s.num <= activeStep ? "bg-[#020617]" : "bg-[#e2e8f0]"} ${s.num === 1 ? "rounded-l-full" : ""} ${s.num === PIXEL_SUB_STEPS.length ? "rounded-r-full" : ""}`}
          />
        ))}
      </div>
      <div className="flex">
        {PIXEL_SUB_STEPS.map((s) => (
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

function PlacementDetailsContent({ placementState, onContinueToMapPartners, onUpload, onFileDrop, hasReuploaded }: { placementState: PlacementState; onContinueToMapPartners: () => void; onUpload: () => void; onFileDrop: (name: string) => void; hasReuploaded?: boolean }) {
  const [showUploadBanner, setShowUploadBanner] = useState(placementState === "new-upload");

  const hasResults = placementState === "uploaded" || placementState === "new-upload";

  return (
    <>
      {showUploadBanner && (
        <div className="mb-4 flex items-center rounded-lg border border-[#e0e0e0] bg-white px-4 py-3">
          <div className="flex flex-1 items-center gap-8">
            <div>
              <p className="text-sm font-semibold text-[#020617]">Upload Results</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#757575]">File</span>
              <span className="text-sm font-medium text-[#020617]">Carta/Macdonalds2024</span>
            </div>
            <div>
              <span className="text-xs text-[#757575]">Campaign Details</span>
              <p className="text-xs font-medium text-[#f59e0b]">Missing Information</p>
            </div>
            <div>
              <span className="text-xs text-[#757575]">Partner Details</span>
              <p className="text-xs font-medium text-[#16a34a]">Successfully Processed</p>
            </div>
            <div>
              <span className="text-xs text-[#757575]">Placement Details</span>
              <p className="text-xs font-medium text-[#f59e0b]">Missing Information</p>
            </div>
          </div>
          <button onClick={() => setShowUploadBanner(false)} className="ml-4 shrink-0 p-1 text-[#8d8d8d] hover:text-[#020617]">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Placement Details</h2>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>
            Using a campaign media plan, map any unique or incomplete placement values, and update placement data.
          </p>
          <p>
            <span className="cursor-pointer text-[#212be9]">Learn more</span> about campaign placement details.
          </p>
        </div>
      </div>

      <PlacementSubSteps activeStep={1} hasReuploaded={hasReuploaded} />

      {hasResults ? (
        <>
          <div className="mb-6 text-sm leading-5 text-[#646464]">
            <p>Your uploaded media plan has been parsed using the placement delimiters shown below. Next you&apos;ll map partners found in the placement data to your provided Media Partners.</p>
          </div>

          <div className="mb-4">
            <p className="mb-3 text-sm font-semibold text-[#020617]">Processed Placement Data Results</p>
            <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-white px-4 py-3">
              <span className="text-sm font-medium text-[#020617]">{hasReuploaded ? "Carta/Mcdonalds2024_new" : "Carta/Mcdonalds2024"}</span>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1 text-sm">
                  <Check className="size-4 text-[#16a34a]" />
                  <span className="font-medium text-[#16a34a]">103 Mapped Values</span>
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <X className="size-4 text-[#dc2626]" />
                  <span className="font-medium text-[#dc2626]">91 Unmapped Values</span>
                </span>
                <span className="text-sm font-medium text-[#020617]">194 Unique Values Found</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 text-sm leading-5 text-[#646464]">
            <p>Upload a media plan to be parsed for placement data.</p>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-[#020617]">Upload Media Plan</p>
            <div
              onClick={onUpload}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[#212be9]", "bg-[#f8f9ff]"); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove("border-[#212be9]", "bg-[#f8f9ff]"); }}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-[#212be9]", "bg-[#f8f9ff]"); const f = e.dataTransfer.files?.[0]; if (f) onFileDrop(f.name); else onUpload(); }}
              className="flex h-16 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]"
            >
              <div className="flex items-center gap-2">
                <Upload className="size-4 text-[#020617]" />
                <span className="text-sm text-[#020617]">
                  Drop here or <span className="cursor-pointer text-[#3333ff]">browse from your files</span>
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
          </div>
        </>
      )}
    </>
  );
}

type PartnerToken = { id: string; name: string };
type AssignedPartner = { id: string; name: string; count: number; tokens: PartnerToken[] };

const INITIAL_UNASSIGNED_PARTNERS: PartnerToken[] = [
  { id: "p1", name: "Horizon Media" },
  { id: "p2", name: "OMD Worldwide" },
  { id: "p3", name: "Dentsu Digital" },
  { id: "p4", name: "Publicis Connect" },
];

const INITIAL_ASSIGNED_PARTNERS: AssignedPartner[] = [
  { id: "ap1", name: "Viant Technologies", count: 3, tokens: [
    { id: "t1", name: "Viant DSP" },
    { id: "t2", name: "Viant Programmatic" },
    { id: "t3", name: "Viant Display" },
  ] },
  { id: "ap2", name: "Adtheorent", count: 1, tokens: [
    { id: "t4", name: "Adtheorent Mobile" },
  ] },
  { id: "ap3", name: "Ignored Partners", count: 0, tokens: [] },
];

const SALESFORCE_PARTNERS: PartnerToken[] = [
  { id: "sf-1", name: "Viant Technologies" },
  { id: "sf-2", name: "Adtheorent" },
  { id: "sf-3", name: "Nexxen" },
  { id: "sf-4", name: "TradeDesk" },
  { id: "sf-5", name: "LiveRamp" },
  { id: "sf-6", name: "Taboola" },
  { id: "sf-7", name: "StackAdapt" },
  { id: "sf-8", name: "Basis Technologies" },
  { id: "sf-9", name: "MediaMath" },
  { id: "sf-10", name: "Simpli.fi" },
  { id: "sf-11", name: "Adelphic" },
  { id: "sf-12", name: "Amobee" },
  { id: "sf-13", name: "Xandr" },
  { id: "sf-14", name: "PubMatic" },
  { id: "sf-15", name: "Index Exchange" },
  { id: "sf-16", name: "Lotame" },
  { id: "sf-17", name: "Oracle Advertising" },
  { id: "sf-18", name: "Criteo" },
  { id: "sf-19", name: "DoubleVerify" },
  { id: "sf-20", name: "Integral Ad Science" },
  { id: "sf-21", name: "Magnite" },
  { id: "sf-22", name: "OpenX" },
  { id: "sf-23", name: "Kargo" },
  { id: "sf-24", name: "Undertone" },
  { id: "sf-25", name: "AdColony" },
  { id: "sf-26", name: "InMobi" },
  { id: "sf-27", name: "Samba TV" },
  { id: "sf-28", name: "Digital Turbine" },
];

const partnerOnboardingSteps = [
  {
    title: "Drag & Drop Partners",
    description: "Grab any partner from the left panel using the grip handle, then drag it over to an assigned partner on the right and release.",
    icon: "drag" as const,
  },
  {
    title: "Select Multiple Partners",
    description: "Use the checkboxes to select multiple partners at once — or hit \"select all\". Then drag any one of the selected partners to move them all together.",
    icon: "select" as const,
  },
  {
    title: "Watch the Count Update",
    description: "Each time you assign partners, the number next to the partner category increases automatically. Expand any category to see its assigned partners.",
    icon: "count" as const,
  },
];

function PartnerOnboardingModal({ step, onNext, onSkip, onBack, onDismissPermanently }: { step: number; onNext: () => void; onSkip: () => void; onBack: () => void; onDismissPermanently: () => void }) {
  const s = partnerOnboardingSteps[step];
  const isLast = step === partnerOnboardingSteps.length - 1;
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
                <div className="flex w-[140px] items-center gap-2 rounded-lg border border-[#212be9] bg-[#eef2ff] px-3 py-2 shadow-md">
                  <GripVertical className="size-3.5 text-[#212be9]" />
                  <div className="h-2 w-20 rounded-full bg-[#212be9]/40" />
                </div>
                <div className="flex w-[140px] items-center gap-2 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
                  <GripVertical className="size-3.5 text-[#9ca3af]" />
                  <div className="h-2 w-12 rounded-full bg-[#c7d2fe]" />
                </div>
              </div>
              <ArrowRight className="size-8 animate-pulse text-[#212be9]" />
              <div className="w-[140px] space-y-2">
                <div className="rounded-lg border-2 border-dashed border-[#212be9] bg-[#212be9]/5 px-3 py-3 text-center">
                  <span className="text-xs font-medium text-[#212be9]">Partner One</span>
                  <span className="ml-1.5 rounded-full bg-[#212be9]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#212be9]">3</span>
                </div>
                <div className="rounded-lg border border-white/60 bg-white/60 px-3 py-3 text-center backdrop-blur-sm">
                  <span className="text-xs text-[#6b7280]">Ignored</span>
                  <span className="ml-1.5 text-[10px] text-[#9ca3af]">0</span>
                </div>
              </div>
            </div>
          )}

          {s.icon === "select" && (
            <div className="space-y-2">
              <div className="flex w-[260px] items-center gap-3 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
                <div className="size-4 rounded border-2 border-[#212be9] bg-[#212be9]"><Check className="size-3 text-white" /></div>
                <div className="h-2 w-24 rounded-full bg-[#212be9]/30" />
                <GripVertical className="ml-auto size-3.5 text-[#9ca3af]" />
              </div>
              <div className="flex w-[260px] items-center gap-3 rounded-lg border border-[#212be9] bg-[#eef2ff] px-3 py-2 shadow-md">
                <div className="size-4 rounded border-2 border-[#212be9] bg-[#212be9]"><Check className="size-3 text-white" /></div>
                <div className="h-2 w-20 rounded-full bg-[#212be9]/40" />
                <GripVertical className="ml-auto size-3.5 text-[#212be9]" />
              </div>
              <div className="flex w-[260px] items-center gap-3 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
                <div className="size-4 rounded border-2 border-[#212be9] bg-[#212be9]"><Check className="size-3 text-white" /></div>
                <div className="h-2 w-28 rounded-full bg-[#212be9]/30" />
                <GripVertical className="ml-auto size-3.5 text-[#9ca3af]" />
              </div>
              <div className="flex w-[260px] items-center gap-3 rounded-lg border border-white/60 bg-white/50 px-3 py-2 backdrop-blur-sm">
                <div className="size-4 rounded border-2 border-gray-300" />
                <div className="h-2 w-16 rounded-full bg-gray-200" />
                <GripVertical className="ml-auto size-3.5 text-[#d1d5db]" />
              </div>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <MousePointerClick className="size-4 text-[#212be9]" />
                <span className="text-xs font-medium text-[#212be9]">3 selected — drag to move all</span>
              </div>
            </div>
          )}

          {s.icon === "count" && (
            <div className="w-[240px] space-y-2">
              <div className="rounded-lg border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1f2430]">Partner One</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm tabular-nums text-[#6b7280]">3</span>
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">+2</span>
                    <ChevronDown className="size-3.5 text-[#6b7280]" />
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-[#212be9] bg-white px-4 py-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1f2430]">Partner Two</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums text-[#212be9]">2</span>
                    <span className="rounded-full bg-[#eef2ff] px-1.5 py-0.5 text-[10px] font-bold text-[#212be9]">+1</span>
                    <ChevronUp className="size-3.5 text-[#212be9]" />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px]">Partner_01</span>
                  <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] text-[#212be9]">Partner_02</span>
                </div>
              </div>
              <div className="rounded-lg border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1f2430]">Ignored</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm tabular-nums text-[#6b7280]">0</span>
                    <ChevronDown className="size-3.5 text-[#6b7280]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="mb-4 flex items-center justify-center gap-1.5">
            {partnerOnboardingSteps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-[#212be9]" : "w-1.5 bg-[#d1d5db]"}`} />
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
            <button onClick={isLast ? handleFinish : onNext} className="rounded-lg bg-[#212be9] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4]">
              {isLast ? "Get Started" : "Next"}
            </button>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="size-4 rounded border-gray-300 accent-[#212be9]"
            />
            <span className="text-xs text-[#6b7280]">Don&apos;t show this again</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function MapPartnersContent({ onBackToMediaPlan, onContinueToTaxonomy, hasReuploaded }: { onBackToMediaPlan: () => void; onContinueToTaxonomy: () => void; hasReuploaded?: boolean }) {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== "undefined") return !localStorage.getItem("hide-partner-onboarding");
    return true;
  });
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [unassigned, setUnassigned] = useState<PartnerToken[]>(INITIAL_UNASSIGNED_PARTNERS);
  const [assigned, setAssigned] = useState<AssignedPartner[]>(INITIAL_ASSIGNED_PARTNERS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dragTokenIds, setDragTokenIds] = useState<string[]>([]);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragCounter = useRef<Record<string, number>>({});

  const [addPartnerOpen, setAddPartnerOpen] = useState(false);
  const [addPartnerSearch, setAddPartnerSearch] = useState("");
  const [addPartnerSelected, setAddPartnerSelected] = useState<Set<string>>(new Set());
  const [addPartnerLoading, setAddPartnerLoading] = useState(false);
  const [addPartnerError, setAddPartnerError] = useState(false);
  const [addPartnerShowAll, setAddPartnerShowAll] = useState(false);
  const addPartnerRef = useRef<HTMLDivElement>(null);

  const existingNames = useMemo(() => {
    const names = new Set<string>();
    unassigned.forEach((t) => names.add(t.name.toLowerCase()));
    assigned.forEach((cat) => {
      names.add(cat.name.toLowerCase());
      cat.tokens.forEach((t) => names.add(t.name.toLowerCase()));
    });
    return names;
  }, [unassigned, assigned]);

  const availableSfPartners = useMemo(() =>
    SALESFORCE_PARTNERS.filter((p) => !existingNames.has(p.name.toLowerCase())),
    [existingNames]
  );

  const filteredSfPartners = useMemo(() =>
    availableSfPartners.filter((p) =>
      p.name.toLowerCase().includes(addPartnerSearch.toLowerCase())
    ),
    [availableSfPartners, addPartnerSearch]
  );

  const VISIBLE_LIMIT = 20;
  const visibleSfPartners = addPartnerShowAll ? filteredSfPartners : filteredSfPartners.slice(0, VISIBLE_LIMIT);
  const hasMorePartners = filteredSfPartners.length > VISIBLE_LIMIT && !addPartnerShowAll;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addPartnerRef.current && !addPartnerRef.current.contains(e.target as Node)) {
        setAddPartnerOpen(false);
        setAddPartnerSearch("");
        setAddPartnerSelected(new Set());
        setAddPartnerShowAll(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openAddPartner = useCallback(() => {
    setAddPartnerOpen(true);
    setAddPartnerSearch("");
    setAddPartnerSelected(new Set());
    setAddPartnerShowAll(false);
    setAddPartnerError(false);
    setAddPartnerLoading(true);
    const timer = setTimeout(() => setAddPartnerLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const confirmAddPartners = useCallback(() => {
    const selectedPartners = SALESFORCE_PARTNERS.filter((p) => addPartnerSelected.has(p.id));
    if (!selectedPartners.length) return;
    const newAssigned: AssignedPartner[] = selectedPartners.map((p) => ({
      id: `ap-sf-${p.id}-${Date.now()}`,
      name: p.name,
      count: 0,
      tokens: [],
    }));
    setAssigned((prev) => {
      const ignoredIdx = prev.findIndex((c) => c.name === "Ignored Partners");
      if (ignoredIdx === -1) return [...prev, ...newAssigned];
      return [...prev.slice(0, ignoredIdx), ...newAssigned, ...prev.slice(ignoredIdx)];
    });
    setAddPartnerOpen(false);
    setAddPartnerSearch("");
    setAddPartnerSelected(new Set());
    setAddPartnerShowAll(false);
  }, [addPartnerSelected]);

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

  const dragGhostRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: DragEvent, tokenId: string) => {
    const ids = selected.has(tokenId) && selected.size > 1 ? Array.from(selected) : [tokenId];
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
    try { ids = JSON.parse(e.dataTransfer.getData("text/plain")); } catch { ids = dragTokenIds; }
    if (!ids.length) return;

    const droppedTokens = unassigned.filter((t) => ids.includes(t.id));
    if (!droppedTokens.length) return;

    setUnassigned((prev) => prev.filter((t) => !ids.includes(t.id)));
    setAssigned((prev) =>
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

  const removeToken = useCallback((catId: string, token: PartnerToken) => {
    setAssigned((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, count: cat.count - 1, tokens: cat.tokens.filter((t) => t.id !== token.id) }
          : cat
      )
    );
    setUnassigned((prev) => [...prev, token]);
  }, []);

  return (
    <>
      <div ref={dragGhostRef} className="pointer-events-none fixed left-[-9999px] top-[-9999px] z-[9999] hidden items-center gap-1.5 rounded-lg bg-[#1f2937] px-3 py-1.5 text-xs font-medium text-white shadow-lg" />
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Placement Details</h2>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>Upload a campaign media plan, map any unique or incomplete placement values, and update placement data.</p>
        </div>
      </div>

      <PlacementSubSteps activeStep={2} hasReuploaded={hasReuploaded} />

      <div className="mb-6 flex items-center gap-2">
        <p className="text-sm text-[#646464]">Map unassigned partners on the left to known media partners on the right.</p>
        <button
          onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }}
          className="shrink-0 text-sm font-medium text-[#212be9] hover:underline"
        >
          How it works
        </button>
      </div>

      <div className="flex gap-4">
        {/* Unassigned Partners */}
        <div className="flex-1">
          <h3 className="mb-2 text-base font-semibold text-[#020617]">Unassigned Partners</h3>
          <div className="rounded-lg border border-[#e2e8f0]">
            <div className="flex items-center gap-4 border-b border-[#e2e8f0] px-4 py-2">
              <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="size-4 rounded border-gray-300 accent-[#212be9]" />
              <span className="text-xs text-[#6b7280]">select all ({selectedCount} selected)</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {unassigned.map((token) => {
                const isDragging = dragTokenIds.includes(token.id);
                return (
                  <div
                    key={token.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, token.id)}
                    onDragEnd={handleDragEnd}
                    className={`group flex cursor-grab items-center gap-3 border-b border-[#e2e8f0]/50 px-4 py-2 text-sm transition-colors active:cursor-grabbing ${selected.has(token.id) ? "bg-[#eef2ff]" : "hover:bg-gray-50"} ${isDragging ? "opacity-40" : ""}`}
                  >
                    <GripVertical className="size-4 shrink-0 text-[#9ca3af] opacity-0 transition-opacity group-hover:opacity-100" />
                    <input
                      type="checkbox"
                      checked={selected.has(token.id)}
                      onChange={() => toggleSelect(token.id)}
                      className="size-4 shrink-0 rounded border-gray-300 accent-[#212be9]"
                    />
                    <span className="text-[#020617]">{token.name}</span>
                  </div>
                );
              })}
              {unassigned.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-[#6b7280]">All partners have been assigned.</div>
              )}
            </div>
          </div>
        </div>

        {/* Assigned Partners */}
        <div className="w-[420px] shrink-0">
          <h3 className="mb-2 text-base font-semibold text-[#020617]">Assigned Partners</h3>
          <div className="rounded-lg border border-[#e2e8f0]">
            <div className="max-h-[400px] space-y-1.5 overflow-y-auto p-2">
              {assigned.map((cat) => {
                const isOver = dragOverId === cat.id;
                const isExpanded = expanded.has(cat.id);
                return (
                  <div
                    key={cat.id}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, cat.id)}
                    onDragLeave={() => handleDragLeave(cat.id)}
                    onDrop={(e) => handleDrop(e, cat.id)}
                    className={`rounded-lg border transition-all ${isOver ? "border-[#212be9] bg-[#eef2ff] shadow-sm" : "border-[#e2e8f0] bg-white"}`}
                  >
                    <button onClick={() => toggleExpand(cat.id)} className="flex w-full items-center gap-2 px-3 py-3 text-left">
                      <span className="flex-1 text-sm font-medium text-[#020617]">{cat.name}</span>
                      <span className="min-w-[24px] text-right text-sm tabular-nums text-[#6b7280]">{cat.count}</span>
                      {isExpanded ? <ChevronUp className="size-4 text-[#6b7280]" /> : <ChevronDown className="size-4 text-[#6b7280]" />}
                    </button>
                    {isExpanded && cat.tokens.length > 0 && (
                      <div className="border-t border-[#e2e8f0] px-3 pb-3 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {cat.tokens.map((t) => (
                            <span key={t.id} className="flex items-center gap-1 rounded-full bg-[#f3f4f6] py-0.5 pl-2.5 pr-1 text-xs text-[#020617]">
                              {t.name}
                              <button onClick={(e) => { e.stopPropagation(); removeToken(cat.id, t); }} className="rounded-full p-0.5 text-[#9ca3af] hover:bg-[#e5e7eb] hover:text-[#374151]">
                                <X className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {isExpanded && cat.tokens.length === 0 && (
                      <div className="border-t border-[#e2e8f0] px-3 py-3 text-xs text-[#6b7280]">Drop partners here to assign them.</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative" ref={addPartnerRef}>
            {!addPartnerOpen ? (
              <button
                onClick={openAddPartner}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-[#212be9] transition-colors hover:text-[#1a22c4]"
              >
                <Plus className="size-4" />
                Add Partner
              </button>
            ) : (
              <div className="mt-3 w-full rounded-lg border border-[#212be9] bg-white shadow-lg">
                {addPartnerSelected.size > 0 && (
                  <div className="flex flex-wrap gap-1.5 border-b border-[#e2e8f0] px-3 py-2">
                    {SALESFORCE_PARTNERS.filter((p) => addPartnerSelected.has(p.id)).map((p) => (
                      <span key={p.id} className="flex items-center gap-1 rounded-full bg-[#f3f4f6] py-0.5 pl-2.5 pr-1 text-xs text-[#020617]">
                        {p.name}
                        <button
                          onClick={() => setAddPartnerSelected((prev) => { const next = new Set(prev); next.delete(p.id); return next; })}
                          className="rounded-full p-0.5 text-[#9ca3af] hover:bg-[#e5e7eb] hover:text-[#374151]"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center border-b border-[#e2e8f0] px-3 py-2">
                  <Search className="mr-2 size-4 shrink-0 text-[#64748b]" />
                  <input
                    type="text"
                    value={addPartnerSearch}
                    onChange={(e) => { setAddPartnerSearch(e.target.value); setAddPartnerShowAll(false); }}
                    placeholder="Search partners..."
                    autoFocus
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#9ca3af]"
                  />
                </div>
                <div className="max-h-[240px] overflow-y-auto">
                  {addPartnerLoading ? (
                    <div className="flex items-center justify-center gap-2 px-3 py-6">
                      <Loader2 className="size-4 animate-spin text-[#212be9]" />
                      <span className="text-sm text-[#6b7280]">Loading partners...</span>
                    </div>
                  ) : addPartnerError ? (
                    <div className="flex flex-col items-center gap-2 px-3 py-6">
                      <CircleAlert className="size-5 text-[#dc2626]" />
                      <span className="text-sm text-[#dc2626]">Failed to load partners</span>
                      <button
                        onClick={() => { setAddPartnerError(false); setAddPartnerLoading(true); setTimeout(() => setAddPartnerLoading(false), 600); }}
                        className="text-sm font-medium text-[#212be9] hover:underline"
                      >
                        Retry
                      </button>
                    </div>
                  ) : visibleSfPartners.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-[#6b7280]">No matching partners found.</div>
                  ) : (
                    <>
                      {visibleSfPartners.map((p) => {
                        const isChecked = addPartnerSelected.has(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => setAddPartnerSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(p.id)) next.delete(p.id); else next.add(p.id);
                              return next;
                            })}
                            className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors ${isChecked ? "bg-[#eef2ff]" : "hover:bg-gray-50"}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="size-4 shrink-0 rounded border-gray-300 accent-[#212be9] pointer-events-none"
                            />
                            <span className="text-[#020617]">{p.name}</span>
                          </button>
                        );
                      })}
                      {hasMorePartners && (
                        <button
                          onClick={() => setAddPartnerShowAll(true)}
                          className="w-full border-t border-[#e2e8f0] px-3 py-2 text-center text-xs font-medium text-[#212be9] hover:bg-gray-50"
                        >
                          Show all {filteredSfPartners.length} results
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 border-t border-[#e2e8f0] px-3 py-2">
                  <button
                    onClick={() => { setAddPartnerOpen(false); setAddPartnerSearch(""); setAddPartnerSelected(new Set()); setAddPartnerShowAll(false); }}
                    className="rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm font-medium text-[#020617] transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAddPartners}
                    disabled={addPartnerSelected.size === 0}
                    className="rounded-md bg-[#212be9] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add{addPartnerSelected.size > 0 ? ` (${addPartnerSelected.size})` : ""}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between py-4">
        <button
          onClick={onBackToMediaPlan}
          className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
        >
          Back to Media Plan Results
        </button>
        <button
          onClick={onContinueToTaxonomy}
          className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]"
        >
          Continue to Taxonomy Mappings
        </button>
      </div>

      {showOnboarding && (
        <PartnerOnboardingModal
          step={onboardingStep}
          onNext={() => { if (onboardingStep < 2) setOnboardingStep(onboardingStep + 1); else setShowOnboarding(false); }}
          onSkip={() => setShowOnboarding(false)}
          onBack={() => setOnboardingStep(Math.max(0, onboardingStep - 1))}
          onDismissPermanently={() => { localStorage.setItem("hide-partner-onboarding", "1"); }}
        />
      )}
    </>
  );
}

/* ───── MapTaxonomiesContent ───── */

type TaxToken = { id: string; name: string };
type TaxCategory = { id: string; name: string; count: number; tokens: TaxToken[] };

const INITIAL_TAX_TOKENS: TaxToken[] = [
  { id: "tx1", name: "Brand_Awareness" }, { id: "tx2", name: "Prospecting" }, { id: "tx3", name: "Retargeting" },
  { id: "tx4", name: "Consideration" }, { id: "tx5", name: "Conversion" }, { id: "tx6", name: "Loyalty" },
  { id: "tx7", name: "Upper_Funnel" }, { id: "tx8", name: "Mid_Funnel" }, { id: "tx9", name: "Lower_Funnel" },
  { id: "tx10", name: "Awareness_Video" }, { id: "tx11", name: "Direct_Response" }, { id: "tx12", name: "Engagement" },
  { id: "tx13", name: "Reach_Extension" }, { id: "tx14", name: "Sequential_Messaging" }, { id: "tx15", name: "Contextual" },
  { id: "tx16", name: "Behavioral" }, { id: "tx17", name: "Lookalike" }, { id: "tx18", name: "CRM_Match" },
  { id: "tx19", name: "Geo_Targeted" }, { id: "tx20", name: "Daypart_Optimized" },
];

const INITIAL_TAX_CATEGORIES: TaxCategory[] = [
  { id: "tc1", name: "Campaign Objective", count: 0, tokens: [] },
  { id: "tc2", name: "Funnel Stage", count: 0, tokens: [] },
  { id: "tc3", name: "Targeting Strategy", count: 0, tokens: [] },
  { id: "tc4", name: "Audience Segment", count: 0, tokens: [] },
  { id: "tc5", name: "Creative Format", count: 0, tokens: [] },
  { id: "tc6", name: "Optimization Goal", count: 0, tokens: [] },
  { id: "tc7", name: "Measurement Type", count: 0, tokens: [] },
  { id: "tc8", name: "Ignored", count: 0, tokens: [] },
];

function MapTaxonomiesContent({ onBack, onContinue, hasReuploaded }: { onBack: () => void; onContinue: () => void; hasReuploaded?: boolean }) {
  const [unassigned, setUnassigned] = useState<TaxToken[]>(INITIAL_TAX_TOKENS);
  const [categories, setCategories] = useState<TaxCategory[]>(INITIAL_TAX_CATEGORIES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dragTokenIds, setDragTokenIds] = useState<string[]>([]);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragCounter = useRef<Record<string, number>>({});
  const dragGhostRef = useRef<HTMLDivElement>(null);

  const allSelected = unassigned.length > 0 && selected.size === unassigned.length;

  const toggleSelect = (id: string) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleSelectAll = () => { if (allSelected) setSelected(new Set()); else setSelected(new Set(unassigned.map((t) => t.id))); };
  const toggleExpand = (id: string) => setExpanded((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const handleDragStart = useCallback((e: DragEvent, tokenId: string) => {
    const ids = selected.has(tokenId) && selected.size > 1 ? Array.from(selected) : [tokenId];
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

  const handleDragOver = useCallback((e: DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);
  const handleDragEnter = useCallback((e: DragEvent, catId: string) => { e.preventDefault(); dragCounter.current[catId] = (dragCounter.current[catId] || 0) + 1; setDragOverId(catId); }, []);
  const handleDragLeave = useCallback((catId: string) => { dragCounter.current[catId] = (dragCounter.current[catId] || 0) - 1; if (dragCounter.current[catId] <= 0) { dragCounter.current[catId] = 0; setDragOverId((p) => (p === catId ? null : p)); } }, []);

  const handleDrop = useCallback((e: DragEvent, catId: string) => {
    e.preventDefault();
    dragCounter.current[catId] = 0;
    setDragOverId(null);
    let ids: string[];
    try { ids = JSON.parse(e.dataTransfer.getData("text/plain")); } catch { ids = dragTokenIds; }
    if (!ids.length) return;
    const dropped = unassigned.filter((t) => ids.includes(t.id));
    if (!dropped.length) return;
    setUnassigned((prev) => prev.filter((t) => !ids.includes(t.id)));
    setCategories((prev) => prev.map((c) => c.id === catId ? { ...c, count: c.count + dropped.length, tokens: [...c.tokens, ...dropped] } : c));
    setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
    setDragTokenIds([]);
  }, [unassigned, dragTokenIds]);

  const handleDragEnd = useCallback(() => { setDragTokenIds([]); setDragOverId(null); dragCounter.current = {}; }, []);

  const removeToken = useCallback((catId: string, token: TaxToken) => {
    setCategories((prev) => prev.map((c) => c.id === catId ? { ...c, count: c.count - 1, tokens: c.tokens.filter((t) => t.id !== token.id) } : c));
    setUnassigned((prev) => [...prev, token]);
  }, []);

  return (
    <>
      <div ref={dragGhostRef} className="pointer-events-none fixed left-[-9999px] top-[-9999px] z-[9999] hidden items-center gap-1.5 rounded-lg bg-[#1f2937] px-3 py-1.5 text-xs font-medium text-white shadow-lg" />
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Placement Details</h2>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>Map taxonomy values found in your media plan to standard categories.</p>
        </div>
      </div>

      <PlacementSubSteps activeStep={3} hasReuploaded={hasReuploaded} />

      <p className="mb-6 text-sm text-[#646464]">Drag unassigned taxonomy values on the left to the appropriate category on the right.</p>

      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="mb-2 text-base font-semibold text-[#020617]">Unassigned Values</h3>
          <div className="rounded-lg border border-[#e2e8f0]">
            <div className="flex items-center gap-4 border-b border-[#e2e8f0] px-4 py-2">
              <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="size-4 rounded border-gray-300 accent-[#212be9]" />
              <span className="text-xs text-[#6b7280]">select all ({selected.size} selected)</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {unassigned.map((token) => (
                <div
                  key={token.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, token.id)}
                  onDragEnd={handleDragEnd}
                  className={`group flex cursor-grab items-center gap-3 border-b border-[#e2e8f0]/50 px-4 py-2 text-sm transition-colors active:cursor-grabbing ${selected.has(token.id) ? "bg-[#eef2ff]" : "hover:bg-gray-50"} ${dragTokenIds.includes(token.id) ? "opacity-40" : ""}`}
                >
                  <GripVertical className="size-4 shrink-0 text-[#9ca3af] opacity-0 transition-opacity group-hover:opacity-100" />
                  <input type="checkbox" checked={selected.has(token.id)} onChange={() => toggleSelect(token.id)} className="size-4 shrink-0 rounded border-gray-300 accent-[#212be9]" />
                  <span className="text-[#020617]">{token.name}</span>
                </div>
              ))}
              {unassigned.length === 0 && <div className="px-4 py-8 text-center text-sm text-[#6b7280]">All values have been assigned.</div>}
            </div>
          </div>
        </div>

        <div className="w-[420px] shrink-0">
          <h3 className="mb-2 text-base font-semibold text-[#020617]">Assigned Taxonomy Values</h3>
          <div className="rounded-lg border border-[#e2e8f0]">
            <div className="max-h-[400px] space-y-1.5 overflow-y-auto p-2">
              {categories.map((cat) => {
                const isOver = dragOverId === cat.id;
                const isExp = expanded.has(cat.id);
                return (
                  <div
                    key={cat.id}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, cat.id)}
                    onDragLeave={() => handleDragLeave(cat.id)}
                    onDrop={(e) => handleDrop(e, cat.id)}
                    className={`rounded-lg border transition-all ${isOver ? "border-[#212be9] bg-[#eef2ff] shadow-sm" : "border-[#e2e8f0] bg-white"}`}
                  >
                    <button onClick={() => toggleExpand(cat.id)} className="flex w-full items-center gap-2 px-3 py-3 text-left">
                      <span className="flex-1 text-sm font-medium text-[#020617]">{cat.name}</span>
                      <span className="min-w-[24px] text-right text-sm tabular-nums text-[#6b7280]">{cat.count}</span>
                      {isExp ? <ChevronUp className="size-4 text-[#6b7280]" /> : <ChevronDown className="size-4 text-[#6b7280]" />}
                    </button>
                    {isExp && cat.tokens.length > 0 && (
                      <div className="border-t border-[#e2e8f0] px-3 pb-3 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {cat.tokens.map((t) => (
                            <span key={t.id} className="flex items-center gap-1 rounded-full bg-[#f3f4f6] py-0.5 pl-2.5 pr-1 text-xs text-[#020617]">
                              {t.name}
                              <button onClick={(e) => { e.stopPropagation(); removeToken(cat.id, t); }} className="rounded-full p-0.5 text-[#9ca3af] hover:bg-[#e5e7eb] hover:text-[#374151]"><X className="size-3" /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {isExp && cat.tokens.length === 0 && (
                      <div className="border-t border-[#e2e8f0] px-3 py-3 text-xs text-[#6b7280]">Drop values here to assign them.</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between py-4">
        <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">Back to Partner Mappings</button>
        <button onClick={onContinue} className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]">Continue to Creative Mappings</button>
      </div>
    </>
  );
}

/* ───── MapCreativesContent ───── */

type CreativeToken = { id: string; name: string };
type MediaTypeCategory = { id: string; name: string; count: number; tokens: CreativeToken[] };

const INITIAL_CREATIVE_TOKENS: CreativeToken[] = [
  { id: "cr6", name: "Rich_Media_Expandable" },
  { id: "cr10", name: "Social_Carousel_Feed" },
  { id: "cr14", name: "Programmatic_Guaranteed_Unit" },
  { id: "cr17", name: "Dynamic_Retargeting_300x600" },
];

const INITIAL_MEDIA_TYPE_CATEGORIES: MediaTypeCategory[] = [
  { id: "mt1", name: "Display", count: 3, tokens: [{ id: "cr1", name: "Standard_Banner_300x250" }, { id: "cr2", name: "Interactive_Unit_728x90" }, { id: "cr3", name: "Native_Content_Feed" }] },
  { id: "mt2", name: "Online Video", count: 2, tokens: [{ id: "cr4", name: "Video_Pre_Roll_15s" }, { id: "cr5", name: "Mid_Roll_30s" }] },
  { id: "mt3", name: "Audio", count: 2, tokens: [{ id: "cr7", name: "Audio_Spot_30s" }, { id: "cr8", name: "Podcast_Sponsorship_60s" }] },
  { id: "mt4", name: "Search", count: 1, tokens: [{ id: "cr9", name: "Paid_Search_Text_Ad" }] },
  { id: "mt5", name: "Out-of-Home (Multi-Market)", count: 2, tokens: [{ id: "cr11", name: "Digital_Billboard_National" }, { id: "cr12", name: "Transit_Shelter_Multi" }] },
  { id: "mt6", name: "Out-of-Home (Individual Market)", count: 1, tokens: [{ id: "cr13", name: "Street_Furniture_NYC" }] },
  { id: "mt7", name: "Connected TV (CTV)", count: 2, tokens: [{ id: "cr15", name: "CTV_Spot_30s_Hulu" }, { id: "cr16", name: "CTV_Pre_Roll_15s_Peacock" }] },
  { id: "mt8", name: "Linear TV with Custom As-Run Logs", count: 0, tokens: [] },
  { id: "mt9", name: "Linear TV Identity Resolution", count: 0, tokens: [] },
  { id: "mt10", name: "Linear TV Kantar Run Logs", count: 0, tokens: [] },
];

function MapCreativesContent({ onBack, onContinue, hasReuploaded }: { onBack: () => void; onContinue: () => void; hasReuploaded?: boolean }) {
  const [unassigned, setUnassigned] = useState<CreativeToken[]>(INITIAL_CREATIVE_TOKENS);
  const [categories, setCategories] = useState<MediaTypeCategory[]>(INITIAL_MEDIA_TYPE_CATEGORIES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dragTokenIds, setDragTokenIds] = useState<string[]>([]);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragCounter = useRef<Record<string, number>>({});
  const dragGhostRef = useRef<HTMLDivElement>(null);

  const allSelected = unassigned.length > 0 && selected.size === unassigned.length;

  const toggleSelect = (id: string) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleSelectAll = () => { if (allSelected) setSelected(new Set()); else setSelected(new Set(unassigned.map((t) => t.id))); };
  const toggleExpand = (id: string) => setExpanded((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const handleDragStart = useCallback((e: DragEvent, tokenId: string) => {
    const ids = selected.has(tokenId) && selected.size > 1 ? Array.from(selected) : [tokenId];
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

  const handleDragOver = useCallback((e: DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);
  const handleDragEnter = useCallback((e: DragEvent, catId: string) => { e.preventDefault(); dragCounter.current[catId] = (dragCounter.current[catId] || 0) + 1; setDragOverId(catId); }, []);
  const handleDragLeave = useCallback((catId: string) => { dragCounter.current[catId] = (dragCounter.current[catId] || 0) - 1; if (dragCounter.current[catId] <= 0) { dragCounter.current[catId] = 0; setDragOverId((p) => (p === catId ? null : p)); } }, []);

  const handleDrop = useCallback((e: DragEvent, catId: string) => {
    e.preventDefault();
    dragCounter.current[catId] = 0;
    setDragOverId(null);
    let ids: string[];
    try { ids = JSON.parse(e.dataTransfer.getData("text/plain")); } catch { ids = dragTokenIds; }
    if (!ids.length) return;
    const dropped = unassigned.filter((t) => ids.includes(t.id));
    if (!dropped.length) return;
    setUnassigned((prev) => prev.filter((t) => !ids.includes(t.id)));
    setCategories((prev) => prev.map((c) => c.id === catId ? { ...c, count: c.count + dropped.length, tokens: [...c.tokens, ...dropped] } : c));
    setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
    setDragTokenIds([]);
  }, [unassigned, dragTokenIds]);

  const handleDragEnd = useCallback(() => { setDragTokenIds([]); setDragOverId(null); dragCounter.current = {}; }, []);

  const removeToken = useCallback((catId: string, token: CreativeToken) => {
    setCategories((prev) => prev.map((c) => c.id === catId ? { ...c, count: c.count - 1, tokens: c.tokens.filter((t) => t.id !== token.id) } : c));
    setUnassigned((prev) => [...prev, token]);
  }, []);

  return (
    <>
      <div ref={dragGhostRef} className="pointer-events-none fixed left-[-9999px] top-[-9999px] z-[9999] hidden items-center gap-1.5 rounded-lg bg-[#1f2937] px-3 py-1.5 text-xs font-medium text-white shadow-lg" />
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Placement Details</h2>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>Map creative values found in your media plan to standard media types.</p>
        </div>
      </div>

      <PlacementSubSteps activeStep={4} hasReuploaded={hasReuploaded} />

      <p className="mb-6 text-sm text-[#646464]">Drag unassigned creatives on the left to the appropriate media type on the right.</p>

      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="mb-2 text-base font-semibold text-[#020617]">Unassigned Creatives</h3>
          <div className="rounded-lg border border-[#e2e8f0]">
            <div className="flex items-center gap-4 border-b border-[#e2e8f0] px-4 py-2">
              <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="size-4 rounded border-gray-300 accent-[#212be9]" />
              <span className="text-xs text-[#6b7280]">select all ({selected.size} selected)</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {unassigned.map((token) => (
                <div
                  key={token.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, token.id)}
                  onDragEnd={handleDragEnd}
                  className={`group flex cursor-grab items-center gap-3 border-b border-[#e2e8f0]/50 px-4 py-2 text-sm transition-colors active:cursor-grabbing ${selected.has(token.id) ? "bg-[#eef2ff]" : "hover:bg-gray-50"} ${dragTokenIds.includes(token.id) ? "opacity-40" : ""}`}
                >
                  <GripVertical className="size-4 shrink-0 text-[#9ca3af] opacity-0 transition-opacity group-hover:opacity-100" />
                  <input type="checkbox" checked={selected.has(token.id)} onChange={() => toggleSelect(token.id)} className="size-4 shrink-0 rounded border-gray-300 accent-[#212be9]" />
                  <span className="text-[#020617]">{token.name}</span>
                </div>
              ))}
              {unassigned.length === 0 && <div className="px-4 py-8 text-center text-sm text-[#6b7280]">All creatives have been assigned.</div>}
            </div>
          </div>
        </div>

        <div className="w-[420px] shrink-0">
          <h3 className="mb-2 text-base font-semibold text-[#020617]">Assigned Media Types</h3>
          <div className="rounded-lg border border-[#e2e8f0]">
            <div className="space-y-1.5 p-2">
              {categories.map((cat) => {
                const isOver = dragOverId === cat.id;
                const isExp = expanded.has(cat.id);
                return (
                  <div
                    key={cat.id}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, cat.id)}
                    onDragLeave={() => handleDragLeave(cat.id)}
                    onDrop={(e) => handleDrop(e, cat.id)}
                    className={`rounded-lg border transition-all ${isOver ? "border-[#212be9] bg-[#eef2ff] shadow-sm" : "border-[#e2e8f0] bg-white"}`}
                  >
                    <button onClick={() => toggleExpand(cat.id)} className="flex w-full items-center gap-2 px-3 py-3 text-left">
                      <span className="flex-1 text-sm font-medium text-[#020617]">{cat.name}</span>
                      <span className="min-w-[24px] text-right text-sm tabular-nums text-[#6b7280]">{cat.count}</span>
                      {isExp ? <ChevronUp className="size-4 text-[#6b7280]" /> : <ChevronDown className="size-4 text-[#6b7280]" />}
                    </button>
                    {isExp && cat.tokens.length > 0 && (
                      <div className="border-t border-[#e2e8f0] px-3 pb-3 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {cat.tokens.map((t) => (
                            <span key={t.id} className="flex items-center gap-1 rounded-full bg-[#f3f4f6] py-0.5 pl-2.5 pr-1 text-xs text-[#020617]">
                              {t.name}
                              <button onClick={(ev) => { ev.stopPropagation(); removeToken(cat.id, t); }} className="rounded-full p-0.5 text-[#9ca3af] hover:bg-[#e5e7eb] hover:text-[#374151]"><X className="size-3" /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {isExp && cat.tokens.length === 0 && (
                      <div className="border-t border-[#e2e8f0] px-3 py-3 text-xs text-[#6b7280]">Drop creatives here to assign them.</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between py-4">
        <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">Back to Taxonomy Mappings</button>
        <button onClick={onContinue} className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]">Continue to Apply Placements</button>
      </div>
    </>
  );
}

/* ───── ApplyPlacementsContent ───── */

const INITIAL_PLACEMENT_ROWS_AP = [
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

const CHANNEL_OPTIONS_AP = ["Display", "Mobile", "Video", "Audio", "CTV", "Social", "Native"];
const SUB_PLACEMENT_OPTIONS_AP = ["Pandora_2025_Display_Q1", "Soundwave_2025_Audio_Q2", "Streamline_2025_Video_Q1", "FitTrack_2025_Mobile_Q2", "TechSavvy_2025_Display_Q1", "TravelQuest_2025_CTV_Q2", "CulinaryDelight_2025_Social"];
const PARTNER_OPTIONS_AP = ["Viant", "Adtheorent", "Nexxen"];
const PUBLISHER_OPTIONS_AP = ["Google_DV360", "Meta_Ads", "Amazon_DSP", "TradeDesk"];
const AUDIENCE_OPTIONS_AP = ["Audience_Seg_01", "Audience_Seg_02", "Audience_Seg_03", "Audience_Seg_05", "Audience_Seg_08", "Audience_Seg_12", "Audience_Seg_15", "Audience_Seg_20", "Audience_Seg_22"];
const AD_SIZE_OPTIONS_AP = ["300x50", "300x250", "300x600", "320x50", "728x90", "970x250", "160x600"];
const CREATIVE_OPTIONS_AP = ["Standard_Banner", "Rich_Media", "Video_Pre_Roll", "Interactive", "Native_Content"];
const LANGUAGE_OPTIONS_AP = ["English", "Spanish", "French", "German", "Portuguese"];
const GEOGRAPHY_OPTIONS_AP = ["New_York", "Los_Angeles", "Chicago", "Houston", "San_Antonio", "San_Francisco", "Seattle", "Denver"];

function InlineComboCellAP({ value, options, onCommit, onCancel }: { value: string; options: string[]; onCommit: (v: string) => void; onCancel: () => void }) {
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

function ApplyPlacementsContent({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [rows, setRows] = useState<PlacementRow[]>(INITIAL_PLACEMENT_ROWS_AP);
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

      <PlacementSubSteps activeStep={5} />

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

      {/* Results count + search + filters */}
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
                { field: "partner", options: PARTNER_OPTIONS_AP },
                { field: "channel", options: CHANNEL_OPTIONS_AP },
                { field: "publisher", options: PUBLISHER_OPTIONS_AP },
                { field: "audience", options: AUDIENCE_OPTIONS_AP },
                { field: "adSize", options: AD_SIZE_OPTIONS_AP },
                { field: "creative", options: CREATIVE_OPTIONS_AP },
                { field: "language", options: LANGUAGE_OPTIONS_AP },
                { field: "geography", options: GEOGRAPHY_OPTIONS_AP },
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
                          <InlineComboCellAP
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
                { label: "Sub Placement", field: "subPlacement" as const, options: SUB_PLACEMENT_OPTIONS_AP, editOnly: true },
                { label: "Partner", field: "partner" as const, options: PARTNER_OPTIONS_AP, editOnly: false },
                { label: "Channel", field: "channel" as const, options: CHANNEL_OPTIONS_AP, editOnly: false },
                { label: "Publisher", field: "publisher" as const, options: PUBLISHER_OPTIONS_AP, editOnly: false },
                { label: "Audience", field: "audience" as const, options: AUDIENCE_OPTIONS_AP, editOnly: false },
                { label: "Ad Size", field: "adSize" as const, options: AD_SIZE_OPTIONS_AP, editOnly: false },
                { label: "Creative", field: "creative" as const, options: CREATIVE_OPTIONS_AP, editOnly: false },
                { label: "Language", field: "language" as const, options: LANGUAGE_OPTIONS_AP, editOnly: false },
                { label: "Geography", field: "geography" as const, options: GEOGRAPHY_OPTIONS_AP, editOnly: false },
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
        <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">Back to Creative Mappings</button>
        <button onClick={onContinue} className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]">Continue to Funding Allocation</button>
      </div>
    </>
  );
}

/* ───── ReviewContent ───── */

function ReviewContent({ onBack, onSubmitted, campaignSubmitted }: { onBack: () => void; onSubmitted: () => void; campaignSubmitted: boolean }) {
  const [authorized, setAuthorized] = useState(false);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(campaignSubmitted);
  const [showToast, setShowToast] = useState(false);

  type ReviewField = {
    key: string;
    label: string;
    value: string;
    required: boolean;
    type: "text" | "currency" | "number" | "link" | "date-range";
  };

  const [fields, setFields] = useState<ReviewField[]>([
    { key: "campaignName", label: "Campaign Name", value: "McDonalds Q1-Q2 2025", required: true, type: "text" },
    { key: "advertiser", label: "Advertiser", value: "McDonald's Corporation", required: true, type: "text" },
    { key: "agency", label: "Agency", value: "OMD Worldwide", required: true, type: "text" },
    { key: "campaignPeriod", label: "Campaign Period", value: "Apr 1, 2025 – Jun 30, 2025", required: true, type: "date-range" },
    { key: "storeChains", label: "Store Chains to be Measured", value: "McDonald's US", required: true, type: "text" },
    { key: "country", label: "Country", value: "United States", required: true, type: "text" },
    { key: "geoScope", label: "Geographical Scope", value: "National", required: true, type: "text" },
    { key: "conversionType", label: "Conversion Type", value: "Visits and Sales Impact", required: true, type: "text" },
    { key: "adServer", label: "Ad Server", value: "Google Campaign Manager", required: true, type: "text" },
    { key: "totalSpend", label: "Total Estimated Ad Spend", value: "$450,000", required: true, type: "currency" },
    { key: "totalImpressions", label: "Total Estimated Impressions", value: "125,000,000", required: true, type: "number" },
    { key: "numPlacements", label: "Number of Placements", value: "24", required: true, type: "number" },
    { key: "sfOpportunity", label: "Salesforce Opportunity ID", value: "https://foursquare.lightning.force.com/lightning/r/Opportunity/006Hs00001abc123/view", required: true, type: "link" },
  ]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingKey && editRef.current) editRef.current.focus();
  }, [editingKey]);

  const startEdit = (field: ReviewField) => {
    if (submitted) return;
    setEditingKey(field.key);
    setEditValue(field.value);
  };

  const commitEdit = (key: string) => {
    setFields((prev) => prev.map((f) => f.key === key ? { ...f, value: editValue.trim() } : f));
    setEditingKey(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, key: string) => {
    if (e.key === "Enter") { e.preventDefault(); commitEdit(key); }
    else if (e.key === "Escape") cancelEdit();
  };

  const missingRequired = fields.filter((f) => f.required && !f.value.trim());
  const allFieldsValid = missingRequired.length === 0;
  const canSubmit = allFieldsValid && authorized;

  const formatDisplayValue = (field: ReviewField) => {
    if (!field.value.trim()) return null;
    if (field.type === "link") {
      return (
        <a href={field.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#212be9] hover:underline">
          {field.value.length > 60 ? field.value.slice(0, 60) + "…" : field.value}
          <ExternalLink className="size-3.5" />
        </a>
      );
    }
    return <span className="text-sm font-medium text-[#020617]">{field.value}</span>;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmitted();
      setShowToast(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowToast(false), 5000);
    }, 2000);
  };

  if (campaignSubmitted && !submitted) setSubmitted(true);

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[#020617]">Review &amp; Submit</h2>
          {submitted && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-semibold text-[#16a34a] ring-1 ring-inset ring-[#16a34a]/20">
              <Check className="size-3.5" />
              Submitted
            </span>
          )}
        </div>
        {submitted ? (
          <p className="mt-1 text-sm text-[#646464]">Submitted by you on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
        ) : (
          <div className="mt-1 text-sm leading-5 text-[#646464]">
            <p>Review your campaign summary below. Click the pencil icon to edit any field inline.</p>
            <p>Once a campaign is approved, an account representative will get in touch to finalize details and set up billing.</p>
          </div>
        )}
      </div>

      {!submitted && missingRequired.length > 0 && (
        <Alert className="mb-6 border-[#fbbf24] bg-[#fffbeb]">
          <CircleAlert className="size-4 text-[#d97706]" />
          <AlertTitle className="text-[#92400e]">Missing required fields</AlertTitle>
          <AlertDescription className="text-[#92400e]">
            Complete the following before submitting: {missingRequired.map((f) => f.label).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {/* Campaign Details */}
      <div className="mb-8">
        <h3 className="mb-2 text-base font-semibold text-[#020617]">Campaign Details</h3>
        <div className="rounded-lg border border-[#e2e8f0]">
          <div className="divide-y divide-[#e2e8f0]">
            {fields.map((field) => {
              const isEditing = editingKey === field.key;
              const isEmpty = !field.value.trim();

              return (
                <div
                  key={field.key}
                  className="group flex min-h-[48px] items-center px-4 py-3"
                >
                  <span className="w-[240px] shrink-0 text-sm text-[#64748b]">
                    {field.label}
                    {field.required && <span className="text-[#dc2626]"> *</span>}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    {isEditing ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          ref={editRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(field.key)}
                          onKeyDown={(e) => handleEditKeyDown(e, field.key)}
                          placeholder={field.label}
                          className={`flex-1 rounded-md border px-3 py-1.5 text-sm outline-none transition-colors ${isEmpty && field.required ? "border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]" : "border-[#212be9] focus:ring-1 focus:ring-[#212be9]"}`}
                        />
                      </div>
                    ) : isEmpty ? (
                      <button
                        onClick={() => startEdit(field)}
                        className="flex flex-1 items-center"
                      >
                        <span className="rounded-md border border-dashed border-[#dc2626] bg-[#fef2f2] px-3 py-1.5 text-sm text-[#dc2626]">
                          Enter {field.label.toLowerCase()}
                        </span>
                      </button>
                    ) : (
                      <>
                        <div className="flex-1">{formatDisplayValue(field)}</div>
                        {!submitted && (
                          <button
                            onClick={() => startEdit(field)}
                            className="rounded p-1 text-[#9ca3af] opacity-0 transition-opacity hover:bg-[#f1f5f9] hover:text-[#020617] group-hover:opacity-100"
                          >
                            <SquarePen className="size-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Media Partners */}
      <div className="mb-8">
        <h3 className="mb-2 text-base font-semibold text-[#020617]">Media Partners</h3>
        <div className="rounded-lg border border-[#e2e8f0]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="px-4 py-2 text-xs font-semibold text-[#64748b]">Partner</th>
                <th className="px-4 py-2 text-xs font-semibold text-[#64748b]">Media Types</th>
                <th className="px-4 py-2 text-xs font-semibold text-[#64748b]">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Viant", types: "Display, Mobile, CTV", status: "complete" },
                { name: "Adtheorent", types: "Mobile, Social", status: "complete" },
                { name: "The Trade Desk", types: "Display, Video", status: "complete" },
                { name: "Amazon DSP", types: "Audio", status: "complete" },
                { name: "DV360", types: "Display", status: "complete" },
              ].map((p) => (
                <tr key={p.name} className="border-b border-[#e2e8f0]/50">
                  <td className="px-4 py-3 font-medium text-[#020617]">{p.name}</td>
                  <td className="px-4 py-3 text-[#020617]">{p.types}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "complete" ? "bg-[#f0fdf4] text-[#166534]" : "bg-[#fefce8] text-[#713f12]"}`}>
                      {p.status === "complete" ? "Complete" : "Incomplete"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-8">
        <h3 className="mb-1 text-base font-semibold text-[#020617]">Comments</h3>
        <p className="mb-3 text-sm text-[#646464]">Use the space below to communicate any special considerations or other requests related to this campaign.</p>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={submitted}
          rows={4}
          placeholder="Add any comments for the review team..."
          className="w-full resize-y rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#020617] outline-none placeholder:text-[#9ca3af] focus:border-[#212be9] disabled:bg-[#f8fafc] disabled:text-[#94a3b8]"
        />
      </div>

      {/* Authorization */}
      <div className="mb-8 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={authorized}
            onChange={(e) => setAuthorized(e.target.checked)}
            disabled={submitted}
            className="mt-0.5 size-4 rounded border-gray-300 accent-[#212be9]"
          />
          <span className="text-sm leading-relaxed text-[#020617]">
            I confirm that the campaign information provided is accurate and authorize Foursquare to generate measurement pixels and begin campaign tracking upon approval. I understand that any changes after submission may require re-processing of placement data.
          </span>
        </label>
      </div>

      {/* Footer */}
      {!submitted ? (
        <div className="flex items-center justify-between py-4">
          <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-4 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!authorized || isSubmitting}
            className={`flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors ${
              isSubmitting
                ? "cursor-wait bg-[#212be9]/80"
                : authorized
                ? "bg-[#212be9] hover:bg-[#1a22c4]"
                : "cursor-not-allowed bg-[#212be9]/50"
            }`}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Campaign"}
          </button>
        </div>
      ) : (
        <div className="flex items-center py-4">
          <Link href="/attribution" className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-[#1a22c4]">
            Back to Dashboard
          </Link>
        </div>
      )}

      {/* Toast notification */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-[#16a34a] bg-white px-4 py-3 shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
        <div className="flex size-6 items-center justify-center rounded-full bg-[#16a34a]">
          <Check className="size-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#020617]">Campaign submitted successfully!</p>
          <p className="text-xs text-[#6b7280]">An account representative will get in touch shortly.</p>
        </div>
        <button onClick={() => setShowToast(false)} className="ml-4 p-1 text-[#8d8d8d] hover:text-[#020617]">
          <X className="size-4" />
        </button>
      </div>
    </>
  );
}

function UploadMediaPlanModal({ open, onClose, onUpload, initialDelimiters, droppedFileName }: {
  open: boolean; onClose: () => void; onUpload: (delimiters: string[]) => void;
  initialDelimiters: string[]; droppedFileName: string | null;
}) {
  const [localDelimiters, setLocalDelimiters] = useState<string[]>(initialDelimiters);
  const [delimiterInput, setDelimiterInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(droppedFileName);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (open) {
      setLocalDelimiters(initialDelimiters);
      setDelimiterInput("");
      setFileName(droppedFileName);
      setUploading(false);
      setProgress(0);
    }
  }, [open, initialDelimiters, droppedFileName]);

  const SYMBOL_MAP: Record<string, string> = {
    "_": "Underscore(_)",
    "-": "Hyphen(-)",
    ";": "Semicolon(;)",
    ":": "Colon(:)",
    "|": "Pipe(|)",
    "/": "Slash(/)",
    "\\": "Backslash(\\)",
    ".": "Period(.)",
    ",": "Comma(,)",
    "~": "Tilde(~)",
    "#": "Hash(#)",
    "@": "At(@)",
    "+": "Plus(+)",
    "=": "Equals(=)",
    " ": "Space( )",
  };
  const NAME_TO_LABEL: Record<string, string> = Object.fromEntries(
    Object.entries(SYMBOL_MAP).map(([sym, label]) => [label.replace(/\(.\)$/, "").toLowerCase(), label])
  );

  const normalizeDelimiter = (raw: string): string => {
    if (SYMBOL_MAP[raw]) return SYMBOL_MAP[raw];
    const lower = raw.toLowerCase();
    if (NAME_TO_LABEL[lower]) return NAME_TO_LABEL[lower];
    return raw;
  };

  const addDelimiter = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) { setDelimiterInput(""); return; }
    const label = normalizeDelimiter(trimmed);
    if (!localDelimiters.includes(label)) {
      setLocalDelimiters((prev) => [...prev, label]);
    }
    setDelimiterInput("");
  };

  const removeDelimiter = (d: string) => {
    setLocalDelimiters((prev) => prev.filter((x) => x !== d));
  };

  const handleDelimiterKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDelimiter(delimiterInput);
    } else if (e.key === "Backspace" && !delimiterInput && localDelimiters.length > 0) {
      setLocalDelimiters((prev) => prev.slice(0, -1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleClickUploadZone = () => {
    setFileName("MediaPlan_McDonalds_2025.xlsx");
  };

  const handleSubmit = () => {
    setUploading(true);
    setProgress(0);
    const start = Date.now();
    const duration = 2400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        onUpload(localDelimiters);
      }
    };
    requestAnimationFrame(tick);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[560px] rounded-xl border border-[#e2e8f0] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h3 className="text-lg font-semibold text-[#020617]">Upload Media Plan</h3>
          <button onClick={onClose} className="rounded-md p-1 text-[#8d8d8d] hover:bg-gray-100 hover:text-[#020617]">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Placement Delimiters */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#020617]">Placement Delimiters</label>
            <p className="mb-2 text-xs text-[#64748b]">Type a symbol (e.g. ;) or name (e.g. Semicolon) and press Enter to add.</p>
            <div className="flex min-h-[40px] flex-wrap items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3 py-2 focus-within:border-[#212be9] focus-within:ring-1 focus-within:ring-[#212be9]">
              {localDelimiters.map((d) => (
                <span key={d} className="flex items-center gap-1 rounded bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#020617]">
                  {d}
                  <button onClick={() => removeDelimiter(d)} className="ml-0.5 text-[#8d8d8d] hover:text-[#020617]">
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={delimiterInput}
                onChange={(e) => setDelimiterInput(e.target.value)}
                onKeyDown={handleDelimiterKeyDown}
                onBlur={() => { if (delimiterInput.trim()) addDelimiter(delimiterInput); }}
                placeholder={localDelimiters.length === 0 ? "e.g. _ or Underscore" : ""}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#9ca3af]"
              />
            </div>
          </div>

          {/* Upload Zone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#020617]">Media Plan File</label>
            {uploading ? (
              <div className="flex h-28 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#212be9] bg-[#f8f9ff]">
                <div className="flex items-center gap-3">
                  <Loader2 className="size-5 animate-spin text-[#212be9]" />
                  <span className="text-sm font-medium text-[#212be9]">Processing media plan...</span>
                </div>
                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[#e2e8f0]">
                  <div className="h-full rounded-full bg-[#212be9] transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : fileName ? (
              <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-[#64748b]" />
                    <span className="text-sm font-medium text-[#020617]">{fileName}</span>
                  </div>
                  <button onClick={() => setFileName(null)} className="rounded p-1 text-[#8d8d8d] hover:bg-gray-100 hover:text-[#020617]">
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragOver(false)}
                onClick={handleClickUploadZone}
                className={`flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragOver ? "border-[#212be9] bg-[#f8f9ff]" : "border-[#e0e0e0] bg-[#f9f9f9] hover:border-[#212be9] hover:bg-[#f8f9ff]"}`}
              >
                <Upload className="mb-1.5 size-5 text-[#64748b]" />
                <span className="text-sm text-[#020617]">
                  Drop here or <span className="text-[#212be9]">browse from your files</span>
                </span>
                <span className="mt-1 text-xs text-[#8d8d8d]">Supported: .xls, .xlsx, .csv</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e2e8f0] px-6 py-4">
          <button
            onClick={onClose}
            disabled={uploading}
            className="rounded-md border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#020617] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!fileName || uploading}
            className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Processing..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ currentStep, hasUploadedFile, hasReuploaded, onUpload, isUploading, onStepClick, disabledSteps, delimiters, disabled }: { currentStep: Step; hasUploadedFile: boolean; hasReuploaded?: boolean; onUpload: () => void; isUploading: boolean; onStepClick: (step: Step) => void; disabledSteps?: string[]; delimiters: string[]; disabled?: boolean }) {
  const completedSteps: Step[] = hasReuploaded ? [] :
    currentStep === "placement" ? ["campaign"] :
    currentStep === "map-partners" ? ["campaign"] :
    currentStep === "map-taxonomies" ? ["campaign"] :
    currentStep === "map-creatives" ? ["campaign"] :
    currentStep === "apply-placements" ? ["campaign"] :
    currentStep === "funding" ? ["campaign", "placement"] :
    currentStep === "pixel" ? ["campaign", "placement", "funding"] :
    currentStep === "review" ? ["campaign", "placement", "funding", "pixel"] : [];

  const errorSteps: Step[] = (() => {
    if (!hasReuploaded) return [];
    const order: Step[] = ["campaign", "placement", "funding", "pixel"];
    const placementSubSteps: Step[] = ["placement", "map-partners", "map-taxonomies", "map-creatives", "apply-placements"];
    const sIdx = placementSubSteps.includes(currentStep) ? order.indexOf("placement") : order.indexOf(currentStep);
    const steps: Step[] = [];
    for (let i = 0; i < sIdx; i++) steps.push(order[i]);
    return steps;
  })();

  const fileName = hasReuploaded ? "Carta/Mcdonalds2024_new" : "Carta/Mcdonalds2024";


  const placementSubSteps: Step[] = ["map-partners", "map-taxonomies", "map-creatives", "apply-placements"];
  const sidebarCurrentStep: Step = placementSubSteps.includes(currentStep) ? "placement" : currentStep;

  return (
    <aside className={`w-[280px] shrink-0 transition-opacity ${disabled ? "pointer-events-none opacity-40" : ""}`}>
      <nav className="space-y-2">
        {SIDEBAR_STEPS.map((step) => {
          const isActive = step.key === sidebarCurrentStep;
          const isDone = completedSteps.includes(step.key);
          const isError = errorSteps.includes(step.key);
          const isStepDisabled = disabled || disabledSteps?.includes(step.key);
          return (
            <button
              key={step.label}
              onClick={() => !isStepDisabled && onStepClick(step.key)}
              disabled={isStepDisabled}
              className={`flex w-full items-center gap-2.5 rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
                isActive && !disabled ? "bg-[#ebf1ff] text-[#020617]" : "text-[#020617] hover:bg-gray-50"
              } ${isStepDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <span className="flex-1 pl-1">{step.label}</span>
              {isError && !isActive && <CircleAlert className="size-4 text-[#dc2626]" />}
              {isDone && !isError && <Check className="size-4 text-[#212be9]" />}
              {isActive && !isDone && !isError && (
                (sidebarCurrentStep === "pixel" || sidebarCurrentStep === "placement")
                  ? <Loader2 className="size-4 animate-spin text-[#f59e0b]" />
                  : <CircleDashed className="size-4 text-[#020617]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-12">
        <h3 className="text-base font-semibold text-black">Attachments</h3>
        {isUploading ? (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-dashed border-[#212be9] bg-[#f8f9ff] px-3 py-5">
            <Loader2 className="size-5 animate-spin text-[#212be9]" />
            <span className="text-xs font-medium text-[#212be9]">Processing...</span>
          </div>
        ) : hasUploadedFile ? (
          <div className="mt-4 flex flex-col gap-4">
            <div className="rounded-lg border border-[#e0e0e0] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">{fileName}</p>
                  <p className="text-xs text-[#8d8d8d]">Uploaded today by Eric...</p>
                </div>
                <button className="text-[#212be9]">
                  <Download className="size-4" />
                </button>
              </div>
              {delimiters.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[#e2e8f0] pt-2">
                  <span className="text-xs text-[#8d8d8d]">Delimiters:</span>
                  {delimiters.map((d) => (
                    <span key={d} className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[10px] font-medium text-[#020617]">{d}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={onUpload} className="flex w-full items-center justify-center rounded-lg border border-dashed border-[#d9d9d9] bg-[#fcfcfc] px-3 py-5 transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]">
                <div className="flex items-center gap-2">
                  <Upload className="size-4 text-[#212be9]" />
                  <span className="text-xs text-[#212be9]">Replace Uploaded File</span>
                </div>
              </button>
              <p className="text-xs text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={onUpload} className="flex items-center justify-center rounded-lg border border-dashed border-[#d9d9d9] bg-[#fcfcfc] px-3 py-5 transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]">
              <div className="flex items-center gap-2">
                <Upload className="size-4 text-[#212be9]" />
                <span className="text-xs text-[#212be9]">Upload Media Plan</span>
              </div>
            </button>
            <p className="text-xs text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function NewCampaignPage() {
  return (
    <Suspense>
      <NewCampaignContent />
    </Suspense>
  );
}

function NewCampaignContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStep = (searchParams.get("step") as Step) || "campaign";
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [showForm, setShowForm] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(initialStep === "map-partners" || initialStep === "placement" || initialStep === "map-taxonomies" || initialStep === "map-creatives" || initialStep === "apply-placements");
  const [campaignName, setCampaignName] = useState("");
  const [measurementBudget, setMeasurementBudget] = useState("");
  const [metric, setMetric] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadBannerDismissed, setUploadBannerDismissed] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [hasReuploaded, setHasReuploaded] = useState(false);
  const [delimiters, setDelimiters] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [droppedFileName, setDroppedFileName] = useState<string | null>(null);
  const [sfValidated, setSfValidated] = useState(false);
  const [campaignStepValid, setCampaignStepValid] = useState(false);
  const [fundingStepValid, setFundingStepValid] = useState(false);
  const [pixelStepValid, setPixelStepValid] = useState(false);
  const [campaignSubmitted, setCampaignSubmitted] = useState(false);
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(new Set([initialStep]));
  const [isReparsing, setIsReparsing] = useState(false);
  const [reparseError, setReparseError] = useState<string | null>(null);
  const pendingDelimitersRef = useRef<string[]>([]);

  const placementStepValid = visitedSteps.has("funding") || visitedSteps.has("pixel") || visitedSteps.has("review");

  const progressPercent =
    currentStep === "campaign" ? 0 :
    currentStep === "placement" ? 12 :
    currentStep === "map-partners" ? 24 :
    currentStep === "map-taxonomies" ? 32 :
    currentStep === "map-creatives" ? 40 :
    currentStep === "apply-placements" ? 48 :
    currentStep === "funding" ? 60 :
    currentStep === "pixel" ? 72 :
    currentStep === "review" ? (campaignSubmitted ? 100 : 84) : 0;

  const displayName = campaignName.trim() || "Draft";

  const pixelState: PixelState = hasUploadedFile ? "populated" : "empty";
  const placementState: PlacementState = hasUploadedFile ? "uploaded" : "empty";

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    setVisitedSteps((prev) => new Set(prev).add(step));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const STEP_ORDER: string[] = ["campaign", "placement", "map-partners", "map-taxonomies", "map-creatives", "apply-placements", "funding", "pixel", "review"];
  const currentIdx = STEP_ORDER.indexOf(currentStep);

  const stepValidityMap: Record<string, boolean> = {
    campaign: campaignStepValid,
    placement: true,
    "map-partners": true,
    "map-taxonomies": true,
    "map-creatives": true,
    "apply-placements": true,
    funding: fundingStepValid,
    pixel: pixelStepValid,
    review: true,
  };

  const disabledSteps = (() => {
    if (!stepValidityMap[currentStep]) {
      return STEP_ORDER.filter((_, i) => i > currentIdx) as Step[];
    }
    return [];
  })();

  const doUpload = (newDelimiters?: string[]) => {
    if (isUploading) return;
    const isReupload = hasUploadedFile;
    if (newDelimiters) setDelimiters(newDelimiters);
    setShowUploadModal(false);
    setDroppedFileName(null);
    setIsUploading(true);
    setUploadBannerDismissed(false);
    setReparseError(null);
    setTimeout(() => {
      setIsUploading(false);
      setHasUploadedFile(true);
      setShowForm(true);
      if (isReupload) {
        setHasReuploaded(true);
      }
      setCampaignName("McDonalds Q1-Q2 2025");
    }, 2400);
  };

  const doInlineUpload = () => {
    doUpload(delimiters.length > 0 ? delimiters : undefined);
  };

  const handleCampaignUpload = () => {
    if (hasUploadedFile) {
      setShowReplaceConfirm(true);
    } else {
      doInlineUpload();
    }
  };

  const handleCampaignFileDrop = (fileName: string) => {
    setDroppedFileName(fileName);
    if (hasUploadedFile) {
      setShowReplaceConfirm(true);
    } else {
      doInlineUpload();
    }
  };

  const handleUpload = () => {
    if (hasUploadedFile) {
      setShowReplaceConfirm(true);
    } else {
      setDroppedFileName(null);
      setShowUploadModal(true);
    }
  };

  const handleFileDrop = (fileName: string) => {
    setDroppedFileName(fileName);
    if (hasUploadedFile) {
      setShowReplaceConfirm(true);
    } else {
      setShowUploadModal(true);
    }
  };

  const confirmReplace = () => {
    setShowReplaceConfirm(false);
    setDroppedFileName(null);
    if (currentStep === "campaign") {
      doInlineUpload();
    } else {
      setShowUploadModal(true);
    }
  };

  const handleDelimitersChange = (newDelimiters: string[]) => {
    setDelimiters(newDelimiters);
    if (!hasUploadedFile) return;
    pendingDelimitersRef.current = newDelimiters;
    setIsReparsing(true);
    setReparseError(null);
    setTimeout(() => {
      if (pendingDelimitersRef.current !== newDelimiters) return;
      const shouldFail = false;
      if (shouldFail) {
        setIsReparsing(false);
        setReparseError("Re-parsing failed. Your previous data has been preserved.");
        return;
      }
      setIsReparsing(false);
      setCampaignName("McDonalds Q1-Q2 2025");
      setUploadBannerDismissed(false);
    }, 2000);
  };

  const handleRetryReparse = () => {
    handleDelimitersChange(delimiters);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Header />

      <div className="sticky top-0 z-30 bg-white">
        <div className="flex items-center justify-between px-12 py-2.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              {campaignSubmitted && (
                <Link
                  href="/attribution"
                  className="flex items-center gap-1.5 rounded-md bg-[#212be9] px-3 py-1.5 text-sm font-medium text-white no-underline transition-colors hover:bg-[#1a22c4]"
                >
                  <ArrowLeft className="size-4" />
                  Back to Dashboard
                </Link>
              )}
              <h1 className="text-2xl font-semibold tracking-tight text-[#020617]">{displayName}</h1>
              {!campaignSubmitted && (
                <span className="rounded-full bg-[#ebf1ff] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#212be9]">{progressPercent}%</span>
              )}
            </div>
            {!campaignSubmitted && (
              <div className="flex items-center gap-4">
                <button className="px-2 py-1 text-sm font-medium text-[#dc2626]">Remove</button>
                <button onClick={() => { const slug = displayName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); router.push(`/attribution?tab=draft&submitted=${slug}`); }} className="px-2 py-1 text-sm font-medium text-[#212be9]">Save Draft</button>
              </div>
            )}
          </div>
        </div>
        {!campaignSubmitted && (
          <div className="h-[2px] w-full bg-[#ebf1ff]"><div className="h-full bg-[#212be9] transition-all duration-700 ease-out" style={{ width: `${Math.max(progressPercent, 0.1)}%` }} /></div>
        )}
      </div>

      {/* Upload Results Banner */}
      {hasUploadedFile && !uploadBannerDismissed && (
        <div className="px-12 pt-6">
          <div className="flex items-center gap-2 rounded-md border border-[#e0e0e0] bg-[#fcfcfc] p-4 shadow-sm">
            <div className="flex min-w-[180px] flex-col gap-2">
              <p className="text-base font-semibold text-black">Upload Results</p>
              <div className="flex items-center gap-1">
                <FileText className="size-4 text-[#8d8d8d]" />
                <span className="text-xs text-black">{hasReuploaded ? "Carta/Mcdonalds2024_new" : "Carta/Mcdonalds2024"}</span>
              </div>
            </div>
            <div className="flex flex-1 items-stretch">
              {[
                { label: "Campaign Details", status: campaignStepValid ? "success" as const : "warning" as const },
                { label: "Placement Details", status: placementStepValid ? "success" as const : "warning" as const },
                { label: "Funding Allocation", status: fundingStepValid ? "success" as const : "warning" as const },
                { label: "Pixel Generation", status: pixelStepValid ? "success" as const : "warning" as const },
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
        <Sidebar currentStep={currentStep} hasUploadedFile={hasUploadedFile} hasReuploaded={hasReuploaded} onUpload={currentStep === "campaign" ? handleCampaignUpload : handleUpload} isUploading={isUploading || isReparsing} disabledSteps={disabledSteps} delimiters={delimiters} disabled={campaignSubmitted} onStepClick={(step) => {
          if (!campaignSubmitted) goToStep(step);
        }} />

        <main className="relative flex-1">
          {hasUploadedFile && uploadBannerDismissed && (
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
          {currentStep === "campaign" && (
            <CampaignDetailsContent showForm={showForm} onShowForm={() => setShowForm(true)} campaignName={campaignName} onCampaignNameChange={setCampaignName} onUpload={handleCampaignUpload} onFileDrop={handleCampaignFileDrop} hasUploadedFile={hasUploadedFile} hasReuploaded={hasReuploaded} isUploading={isUploading} measurementBudget={measurementBudget} onMeasurementBudgetChange={setMeasurementBudget} metric={metric} onMetricChange={setMetric} sfValidated={sfValidated} onSfValidatedChange={setSfValidated} onValidChange={setCampaignStepValid} delimiters={delimiters} onDelimitersChange={handleDelimitersChange} isReparsing={isReparsing} reparseError={reparseError} onRetryReparse={handleRetryReparse} />
          )}
          {currentStep === "placement" && (
            <PlacementDetailsContent
              placementState={placementState}
              onContinueToMapPartners={() => goToStep("map-partners")}
              onUpload={handleUpload}
              onFileDrop={handleFileDrop}
              hasReuploaded={hasReuploaded}
            />
          )}
          {currentStep === "map-partners" && (
            <MapPartnersContent
              onBackToMediaPlan={() => goToStep("placement")}
              onContinueToTaxonomy={() => goToStep("map-taxonomies")}
              hasReuploaded={hasReuploaded}
            />
          )}
          {currentStep === "map-taxonomies" && (
            <MapTaxonomiesContent
              onBack={() => goToStep("map-partners")}
              onContinue={() => goToStep("map-creatives")}
              hasReuploaded={hasReuploaded}
            />
          )}
          {currentStep === "map-creatives" && (
            <MapCreativesContent
              onBack={() => goToStep("map-taxonomies")}
              onContinue={() => goToStep("apply-placements")}
              hasReuploaded={hasReuploaded}
            />
          )}
          {currentStep === "apply-placements" && (
            <ApplyPlacementsContent
              onBack={() => goToStep("map-creatives")}
              onContinue={() => goToStep("funding")}
            />
          )}
          {currentStep === "funding" && <FundingAllocationContent measurementBudget={parseInt(measurementBudget.replace(/,/g, "") || "0")} onValidChange={setFundingStepValid} />}
          {currentStep === "pixel" && <PixelGenerationContent pixelState={pixelState} onValidChange={setPixelStepValid} onBack={() => goToStep("funding")} onContinue={() => goToStep("review")} />}
          {currentStep === "review" && (
            <ReviewContent
              onBack={() => goToStep("pixel")}
              onSubmitted={() => setCampaignSubmitted(true)}
              campaignSubmitted={campaignSubmitted}
            />
          )}

          {currentStep === "campaign" && showForm && (
            <div className="mt-8 flex items-center justify-between py-4">
              <Link
                href="/attribution"
                className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
              >
                Back
              </Link>
              <button
                onClick={() => goToStep("placement")}
                disabled={!campaignStepValid}
                className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Placement Details
              </button>
            </div>
          )}

          {currentStep === "funding" && (
            <div className="mt-8 flex items-center justify-between py-4">
              <button
                onClick={() => goToStep("apply-placements")}
                className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
              >
                Back to Apply Placements
              </button>
              <button
                onClick={() => goToStep("pixel")}
                disabled={!fundingStepValid}
                className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Pixel Generation
              </button>
            </div>
          )}

          {currentStep === "pixel" && null}

          {currentStep === "placement" && (
            <div className="mt-8 flex items-center justify-between py-4">
              <button
                onClick={() => goToStep("campaign")}
                className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
              >
                Back to Campaign Details
              </button>
              <button
                onClick={() => goToStep("map-partners")}
                className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]"
              >
                Continue to Map Partners
              </button>
            </div>
          )}
        </main>
      </div>

      {showReplaceConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowReplaceConfirm(false)}>
          <div className="w-full max-w-[480px] rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fee2e2]">
                <CircleAlert className="size-5 text-[#dc2626]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#171417]">Replace Existing Media Plan?</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555]">
                  Uploading a new media plan will overwrite previously parsed data. This may result in missing information in earlier steps, and you may need to re-enter required details.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowReplaceConfirm(false)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-[#171417] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplace}
                className="rounded-md bg-[#dc2626] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b91c1c]"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

      <UploadMediaPlanModal
        open={showUploadModal}
        onClose={() => { setShowUploadModal(false); setDroppedFileName(null); }}
        onUpload={(newDelimiters) => doUpload(newDelimiters)}
        initialDelimiters={delimiters}
        droppedFileName={droppedFileName}
      />
    </div>
  );
}

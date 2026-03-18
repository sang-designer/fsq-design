"use client";

import { Upload, ChevronDown, ChevronUp, Calendar as CalendarIcon, CircleDashed, Check, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Search, Download, Copy, Mail, X, Loader2, GripVertical, MousePointerClick, ArrowRight, OctagonAlert, SquarePen, Trash2, FileText, Info, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useCallback, useEffect, DragEvent, Suspense } from "react";
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

type Step = "campaign" | "partner" | "funding" | "pixel" | "placement" | "map-partners";

const SIDEBAR_STEPS = [
  { key: "campaign" as Step, label: "Campaign Details" },
  { key: "partner" as Step, label: "Partner Details" },
  { key: "funding" as Step, label: "Funding Allocation" },
  { key: "pixel" as Step, label: "Pixel Generation" },
  { key: "placement" as Step, label: "Placement Details" },
  { key: "review" as Step, label: "Review and Submit" },
];

const INITIAL_PARTNERS = [
  { name: "Viant", fundingSource: "Starcom" as string | null, mediaType: "Display", conversionType: "Visits and Sales Impact" as string | null, startDate: "2025-04-01" as string | null, endDate: "2025-06-30" as string | null, missingFields: 0, estimatedSpend: "$125,000" },
  { name: "Adtheorent", fundingSource: "Zenith" as string | null, mediaType: "Mobile", conversionType: "Visits and Sales Impact" as string | null, startDate: "2025-04-01" as string | null, endDate: null as string | null, missingFields: 2, estimatedSpend: "$85,000" },
  { name: "Nexxen", fundingSource: "Starcom" as string | null, mediaType: "Video", conversionType: "Sales Impact" as string | null, startDate: "2025-04-01" as string | null, endDate: "2025-06-30" as string | null, missingFields: 0, estimatedSpend: "$210,000" },
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

function SelectField({ label, placeholder = "Type or Select", helpText, value, onChange, error, options }: {
  label: string;
  placeholder?: string;
  helpText?: React.ReactNode;
  value?: string;
  onChange?: (v: string) => void;
  error?: boolean;
  options?: string[];
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 min-w-[280px]">
      <label className={`text-sm font-semibold ${error ? "text-[#dc2626]" : "text-black"}`}>{label}</label>
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

function DateField({ label, value, onChange, error, min }: { label: string; value?: string; onChange?: (v: string) => void; error?: boolean; min?: string }) {
  const [open, setOpen] = useState(false);

  const selected = value ? new Date(value + "T00:00:00") : undefined;
  const minDate = min ? new Date(min + "T00:00:00") : undefined;

  const displayValue = selected && !isNaN(selected.getTime())
    ? selected.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    : "";

  return (
    <div className="flex flex-1 flex-col gap-2">
      <label className={`text-sm font-semibold ${error ? "text-[#dc2626]" : "text-[#000033]"}`}>{label}</label>
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

function InputField({ label, placeholder = "", value, onChange, error }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void; error?: boolean }) {
  return (
    <div className="flex flex-1 flex-col gap-2 min-w-[280px]">
      <label className={`text-sm font-semibold ${error ? "text-[#dc2626]" : "text-black"}`}>{label}</label>
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

function BrandSearchSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
      <label className="text-sm font-medium text-[#1f2430]">Brand</label>
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

function CampaignDetailsContent({ showForm, onShowForm, campaignName, onCampaignNameChange, onUpload, hasUploadedFile, hasReuploaded, isUploading, measurementBudget, onMeasurementBudgetChange, metric, onMetricChange, sfValidated, onSfValidatedChange }: { showForm: boolean; onShowForm: () => void; campaignName: string; onCampaignNameChange: (v: string) => void; onUpload: () => void; hasUploadedFile: boolean; hasReuploaded?: boolean; isUploading: boolean; measurementBudget: string; onMeasurementBudgetChange: (v: string) => void; metric: string; onMetricChange: (v: string) => void; sfValidated: boolean; onSfValidatedChange: (v: boolean) => void }) {
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
          <BrandSearchSelect value={brand} onChange={setBrand} />
          {isOverridden("brand") && (
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#fefce8] px-1.5 py-0.5 text-[10px] font-medium text-[#92400e]">This value differs from Salesforce data</span>
              <button onClick={() => resetField("brand")} className="text-[10px] font-medium text-[#212be9] hover:underline">Reset</button>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#1f2430]">Measurement Budget</label>
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
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#fefce8] px-1.5 py-0.5 text-[10px] font-medium text-[#92400e]">This value differs from Salesforce data</span>
              <button onClick={() => resetField("budget")} className="text-[10px] font-medium text-[#212be9] hover:underline">Reset</button>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#1f2430]">Metric</label>
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
          <div className="flex h-20 w-[528px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#212be9] bg-[#f8f9ff]">
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border border-[#e0e0e0] p-4">
              <div>
                <p className="text-sm font-medium text-black">{hasReuploaded ? "Carta/Mcdonalds2024_new" : "Carta/Mcdonalds2024"}</p>
                <p className="text-xs text-[#8d8d8d]">Uploaded today by Eric...</p>
              </div>
              <button className="text-[#212be9]">
                <Download className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={onUpload} className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]">
                <div className="flex items-center gap-2">
                  <Upload className="size-4 text-[#212be9]" />
                  <span className="text-xs text-[#212be9]">Replace Uploaded File</span>
                </div>
              </button>
              <p className="text-xs text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
            </div>
          </div>
        ) : (
          <>
            <button onClick={onUpload} className="flex h-20 w-[528px] items-center justify-center rounded-lg border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]">
              <div className="flex items-center gap-2">
                <Upload className="size-4 text-[#020617]" />
                <span className="text-sm text-[#020617]">
                  Drop here or <span className="cursor-pointer text-[#3333ff]">browse from your files</span>
                </span>
              </div>
            </button>
            <p className="mt-4 text-sm text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
          </>
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
                  <InputField label="Campaign Name" value={campaignName} onChange={onCampaignNameChange} />
                  <SelectField label="Advertiser" value={advertiser} onChange={setAdvertiser} />
                </div>
                <div className="flex gap-4">
                  <DateField label="Start Date" value={startDate} onChange={setStartDate} />
                  <DateField label="End Date" value={endDate} onChange={setEndDate} min={startDate} />
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
                  <SelectField label="Agency/Partner Name" value={agencyName} onChange={setAgencyName} />
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
                  <SelectField label="Country" value={country} onChange={setCountry} />
                  <div className="flex flex-1 flex-col gap-2 min-w-[280px]">
                    <label className="text-sm font-semibold text-black">Store Chains to be measured</label>
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
const AD_SERVER_OPTIONS = ["Google Campaign Manager", "Sizmek", "Flashtalking", "Innovid", "Extreme Reach"];
const AGENCY_OPTIONS = ["Starcom", "Mediavest", "Zenith", "OMD", "Mindshare", "Wavemaker"];
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
  const [mediaTypes, setMediaTypes] = useState([{ id: 1 }]);

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
          {mediaTypes.map((mt) => (
            <div key={mt.id} className="rounded-md border border-[#e0e0e0] px-4 py-4">
              <button
                onClick={() => setMediaTypeOpen(!mediaTypeOpen)}
                className="flex w-full items-center gap-4"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-xs font-semibold text-[#646464]">Media Type Details</p>
                </div>
                {mediaTypeOpen ? <ChevronUp className="size-4 text-[#8d8d8d]" /> : <ChevronDown className="size-4 text-[#8d8d8d]" />}
              </button>
              {mediaTypeOpen && (
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex gap-8">
                    <SelectField label="Media Type" value={formValues["Media Type"] ?? ""} onChange={(v) => updateField("Media Type", v)} options={MEDIA_TYPE_OPTIONS} />
                    <SelectField label="Conversion Funding Report Type" value={formValues["Conversion Funding Report Type"] ?? ""} onChange={(v) => updateField("Conversion Funding Report Type", v)} error={hasError("Conversion Funding Report Type")} options={CONVERSION_TYPE_OPTIONS} />
                  </div>
                  <div className="flex gap-8">
                    <InputField label="Estimated Ad Spend" placeholder="Ad Spend value..." value={formValues["Estimated Ad Spend"] ?? ""} onChange={(v) => updateField("Estimated Ad Spend", v)} />
                    <InputField label="Estimated Impressions" placeholder="Impressions value..." value={formValues["Estimated Impressions"] ?? ""} onChange={(v) => updateField("Estimated Impressions", v)} />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => setMediaTypes((prev) => [...prev, { id: prev.length + 1 }])}
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

function PartnerDetailsContent({ hasUploadedFile, isEditingPartner, onEditingPartnerChange }: { hasUploadedFile: boolean; isEditingPartner: boolean; onEditingPartnerChange: (v: boolean) => void }) {
  const formatDate = (d: string | null) => {
    if (!d) return "—";
    const date = new Date(d + "T00:00:00");
    if (isNaN(date.getTime())) return d;
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
  };
  const [partners, setPartners] = useState(INITIAL_PARTNERS.map((p) => ({ ...p })));
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [editErrorFields, setEditErrorFields] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<Record<string, string>>({});

  const totalMissing = partners.reduce((sum, p) => sum + p.missingFields, 0);

  const handleEdit = (partner: typeof partners[0], index: number) => {
    setEditingIndex(index);
    setEditInitialValues({
      "Partner/Platform Name": partner.name,
      "Media Type": partner.mediaType,
      "Estimated Total Ad Spend": partner.estimatedSpend,
      ...(partner.fundingSource ? { "Agency or Site Served": partner.fundingSource } : {}),
      ...(partner.conversionType ? { "Conversion Funding Report Type": partner.conversionType } : {}),
      ...(partner.startDate ? { "Ad Run Start Date": partner.startDate } : {}),
      ...(partner.endDate ? { "Ad Run End Date": partner.endDate } : {}),
    });
    if (partner.missingFields > 0) {
      setEditMode("edit");
      setEditErrorFields(ERROR_FIELDS);
    } else {
      setEditMode("edit");
      setEditErrorFields([]);
    }
    onEditingPartnerChange(true);
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setEditMode("add");
    setEditErrorFields([]);
    setEditInitialValues({});
    onEditingPartnerChange(true);
  };

  const handleSave = (formData: Record<string, string>) => {
    if (editMode === "edit" && editingIndex !== null) {
      setPartners((prev) =>
        prev.map((p, i) => {
          if (i !== editingIndex) return p;
          return {
            ...p,
            fundingSource: formData["Agency or Site Served"] || p.fundingSource,
            mediaType: formData["Media Type"] || p.mediaType,
            conversionType: formData["Conversion Funding Report Type"] || p.conversionType,
            startDate: formData["Ad Run Start Date"] || p.startDate,
            endDate: formData["Ad Run End Date"] || p.endDate,
            missingFields: 0,
          };
        })
      );
    } else if (editMode === "add") {
      const newPartner = {
        name: formData["Partner/Platform Name"] || "New Partner",
        fundingSource: formData["Agency or Site Served"] || null,
        mediaType: formData["Media Type"] || "Display",
        conversionType: formData["Conversion Funding Report Type"] || null,
        startDate: formData["Ad Run Start Date"] || null,
        endDate: formData["Ad Run End Date"] || null,
        missingFields: 0,
        estimatedSpend: formData["Estimated Total Ad Spend"] || "$0",
      };
      setPartners((prev) => [...prev, newPartner]);
    }
    onEditingPartnerChange(false);
  };

  if (isEditingPartner) {
    return (
      <>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#020617]">Media Partner Details</h2>
          <div className="mt-1 text-sm leading-5 text-[#646464]">
            <p>
              Media partners are responsible for delivering digital media for this campaign, including programmatic teams.
            </p>
            <p>
              <span className="cursor-pointer text-[#212be9]">Learn more</span> about Partners in Attribution.
            </p>
          </div>
        </div>

        <div className="mb-6 h-px w-full bg-[#e2e8f0]" />

        <AddPartnerForm
          mode={editMode}
          errorFields={editErrorFields}
          initialValues={editInitialValues}
          onDiscard={() => onEditingPartnerChange(false)}
          onSave={handleSave}
        />
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-[#020617]">Media Partner Details</h2>
          {hasUploadedFile && totalMissing > 0 && (
            <span className="rounded-full bg-[#fefce8] px-2 py-0.5 text-xs font-semibold text-[#713f12]">
              Missing Information - {totalMissing} fields missing
            </span>
          )}
        </div>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>
            Media partners are responsible for delivering digital media for this campaign, including programmatic teams.
          </p>
          <p>
            <span className="cursor-pointer text-[#212be9]">Learn more</span> about Partners in Attribution.
          </p>
        </div>
      </div>

      <div className="mb-4 h-px w-full bg-[#e2e8f0]" />

      {hasUploadedFile ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#171417]">
              <span className="text-[#757575]">Showing </span>
              <span className="font-medium">{partners.length}</span>
              <span className="text-[#757575]"> of </span>
              <span className="font-medium">{partners.length}</span>
              <span className="text-[#757575]"> results</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="flex w-[263px] items-center rounded-md border border-[#e2e8f0] bg-white px-3 py-2">
                <Search className="mr-2 size-4 text-[#64748b]" />
                <span className="text-sm text-[#64748b]">Search</span>
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 rounded-md border border-[#212be9] bg-[#fcfcfc] px-2 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
              >
                <Plus className="size-4" />
                <span className="px-1">Add Partner</span>
              </button>
            </div>
          </div>

          <div className="w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="w-[150px] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Partner Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Funding Source</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Media Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Conversion Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">End Date</th>
                  <th className="w-[80px] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Action</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner, index) => (
                  <tr key={partner.name + index} className="border-b border-[#e2e8f0]">
                    <td className="w-[150px] px-4 py-4">
                      <div className="flex items-center gap-1">
                        {partner.missingFields > 0 && (
                          <div className="group relative">
                            <OctagonAlert className="size-4 shrink-0 text-[#f59e0b]" />
                            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0f172a] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                              This partner is missing {partner.missingFields} required fields.
                              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#0f172a]" />
                            </div>
                          </div>
                        )}
                        <span className="text-sm font-medium text-black">{partner.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-black">{partner.fundingSource ?? "—"}</td>
                    <td className="px-4 py-4 text-sm text-black">{partner.mediaType}</td>
                    <td className="px-4 py-4 text-sm text-black">{partner.conversionType ?? "—"}</td>
                    <td className="px-4 py-4 text-sm text-black">{formatDate(partner.startDate)}</td>
                    <td className="px-4 py-4 text-sm text-black">{formatDate(partner.endDate)}</td>
                    <td className="w-[80px] px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(partner, index)}
                          className="rounded-md p-1 hover:bg-gray-100"
                        >
                          <SquarePen className="size-4 text-[#64748b]" />
                        </button>
                        <button className="rounded-md p-1 hover:bg-gray-100">
                          <Trash2 className="size-4 text-[#64748b]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {partners.length > 10 && (
          <div className="mt-6 flex items-center justify-end gap-1">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#64748b] hover:bg-gray-50">
              <ChevronLeft className="size-4" />
              Previous
            </button>
            <div className="flex size-10 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a]">
              1
            </div>
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#64748b] hover:bg-gray-50">
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fcfcfc] px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-[#020617]">Missing Partner Details</p>
            <p className="mt-1 text-sm text-[#646464]">
              No partner information is available. <span className="cursor-pointer text-[#212be9]">Upload a media plan</span>, or <span className="cursor-pointer text-[#212be9]">add a media partner</span> manually.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex shrink-0 items-center gap-1 rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
          >
            <Plus className="size-4" />
            Add Partner
          </button>
        </div>
      )}
    </>
  );
}

const FUNDING_PARTNERS = [
  { name: "Viant", mediaType: "Display", estimatedSpend: 125000 },
  { name: "Adtheorent", mediaType: "Mobile", estimatedSpend: 85000 },
  { name: "Nexxen", mediaType: "Video", estimatedSpend: 210000 },
];

function FundingAllocationContent({ measurementBudget }: { measurementBudget: number }) {
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
              <th className="w-[12%] px-4 py-3.5 text-left text-sm font-medium text-[#64748b]">Media Type</th>
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
                    <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#475569]">{alloc.mediaType}</span>
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

function PixelGenerationContent({ pixelState }: { pixelState: PixelState }) {
  const [openActionRow, setOpenActionRow] = useState<number | null>(null);
  const [showUploadBanner, setShowUploadBanner] = useState(pixelState === "empty-uploaded");
  const [pixels, setPixels] = useState(PIXELS.map((p) => ({ ...p })));
  const [viewPixelRow, setViewPixelRow] = useState<number | null>(null);
  const [copiedPixelRow, setCopiedPixelRow] = useState<number | null>(null);
  const pixelPopoverRef = useRef<HTMLDivElement>(null);

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

      {pixelState === "populated" ? (
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="w-10 px-4 py-3" />
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Partner</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Ad Server</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Tagging</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#64748b]">Pixel</th>
                  <th className="w-[80px] px-4 py-3 text-left text-sm font-medium text-[#64748b]">Action</th>
                </tr>
              </thead>
              <tbody>
                {pixels.map((pixel, i) => (
                  <tr key={i} className="border-b border-[#e2e8f0]">
                    <td className="w-10 px-4 py-4">
                      <div className="size-4 rounded border border-[#0f172a]" />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-black">{pixel.partner}</td>
                    <td className="px-4 py-4 text-sm text-black">{pixel.adServer}</td>
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
                    <td className="px-4 py-4 text-sm text-black">{pixel.pixelType}</td>
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
                ))}
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
  { num: 4, label: "Apply Placements" },
];

type PlacementState = "empty" | "uploaded" | "new-upload";

function PlacementSubSteps({ activeStep, hasReuploaded }: { activeStep: number; hasReuploaded?: boolean }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex gap-0">
        {PLACEMENT_SUB_STEPS.map((s) => (
          <div
            key={s.num}
            className={`h-1 flex-1 ${s.num <= activeStep ? "bg-[#020617]" : "bg-[#e2e8f0]"} ${s.num === 1 ? "rounded-l-full" : ""} ${s.num === 4 ? "rounded-r-full" : ""}`}
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

function PlacementDetailsContent({ placementState, onContinueToMapPartners, onUpload, hasReuploaded }: { placementState: PlacementState; onContinueToMapPartners: () => void; onUpload: () => void; hasReuploaded?: boolean }) {
  const [showUploadBanner, setShowUploadBanner] = useState(placementState === "new-upload");
  const [editingDelimiters, setEditingDelimiters] = useState(false);

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
            <p>Your uploaded media plan has been parsed using the placement delimiters shown below.</p>
            <p>Next you&apos;ll map partners found in the placement data to your provided Media Partners.</p>
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

          <div className="mb-2 flex items-center gap-3">
            <span className="text-sm font-semibold text-[#020617]">Placement Delimiters:</span>
            {!editingDelimiters ? (
              <>
                <span className="rounded-md bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#020617]">Underscore</span>
                <span className="rounded-md bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#020617]">Hyphen</span>
                <button onClick={() => setEditingDelimiters(true)} className="text-sm font-medium text-[#212be9]">Edit</button>
                <CircleDashed className="size-4 text-[#8d8d8d]" />
              </>
            ) : (
              <div className="flex flex-1 items-center gap-3 rounded-lg border border-[#212be9] bg-white px-4 py-3">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5">
                  <span className="flex items-center gap-1 rounded bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#020617]">
                    Underscore <button className="ml-1 text-[#8d8d8d]"><X className="size-3" /></button>
                  </span>
                  <span className="flex items-center gap-1 rounded bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#020617]">
                    Hyphen <button className="ml-1 text-[#8d8d8d]"><X className="size-3" /></button>
                  </span>
                  <ChevronDown className="ml-auto size-4 text-[#8d8d8d]" />
                </div>
                <button
                  onClick={() => setEditingDelimiters(false)}
                  className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-1.5 text-sm font-medium text-[#212be9]"
                >
                  Reprocess Media Plan
                </button>
                <button onClick={() => setEditingDelimiters(false)} className="p-1 text-[#8d8d8d] hover:text-[#020617]">
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 text-sm leading-5 text-[#646464]">
            <p>Upload a media plan to be parsed for placement data. Media Plan will be parsed using placement delimiters selected below.</p>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-[#020617]">Upload Media Plan</p>
            <button onClick={onUpload} className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]">
              <div className="flex items-center gap-2">
                <Upload className="size-4 text-[#020617]" />
                <span className="text-sm text-[#020617]">
                  Drop here or <span className="cursor-pointer text-[#3333ff]">browse from your files</span>
                </span>
              </div>
            </button>
            <p className="mt-2 text-sm text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#020617]">Select Placement Delimiters</span>
              <CircleDashed className="size-4 text-[#8d8d8d]" />
            </div>
            <div className="flex items-center gap-2 rounded-md border border-[#e2e8f0] bg-white px-3 py-2">
              <span className="flex items-center gap-1 rounded bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#020617]">
                Underscore <button className="ml-1 text-[#8d8d8d]"><X className="size-3" /></button>
              </span>
              <span className="flex items-center gap-1 rounded bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium text-[#020617]">
                Hyphen <button className="ml-1 text-[#8d8d8d]"><X className="size-3" /></button>
              </span>
              <ChevronDown className="ml-auto size-4 text-[#8d8d8d]" />
            </div>
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

function Sidebar({ currentStep, hasUploadedFile, hasReuploaded, onUpload, isUploading, onStepClick }: { currentStep: Step; hasUploadedFile: boolean; hasReuploaded?: boolean; onUpload: () => void; isUploading: boolean; onStepClick: (step: Step) => void }) {
  const completedSteps: Step[] = hasReuploaded ? [] :
    currentStep === "partner" ? ["campaign"] :
    currentStep === "funding" ? ["campaign", "partner"] :
    currentStep === "pixel" ? ["campaign", "partner", "funding"] :
    currentStep === "placement" ? ["campaign", "partner", "funding", "pixel"] :
    currentStep === "map-partners" ? ["campaign", "partner", "funding", "pixel"] : [];

  const errorSteps: Step[] = (() => {
    if (!hasReuploaded) return [];
    const order: Step[] = ["campaign", "partner", "funding", "pixel", "placement"];
    const sIdx = currentStep === "map-partners" ? order.indexOf("placement") : order.indexOf(currentStep);
    const steps: Step[] = [];
    for (let i = 0; i < sIdx; i++) steps.push(order[i]);
    return steps;
  })();

  const fileName = hasReuploaded ? "Carta/Mcdonalds2024_new" : "Carta/Mcdonalds2024";


  const sidebarCurrentStep: Step = currentStep === "map-partners" ? "placement" : currentStep;

  return (
    <aside className="w-[280px] shrink-0">
      <nav className="space-y-2">
        {SIDEBAR_STEPS.map((step) => {
          const isActive = step.key === sidebarCurrentStep;
          const isDone = completedSteps.includes(step.key);
          const isError = errorSteps.includes(step.key);
          return (
            <button
              key={step.label}
              onClick={() => onStepClick(step.key)}
              className={`flex w-full items-center gap-2.5 rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
                isActive ? "bg-[#ebf1ff] text-[#020617]" : "text-[#020617] hover:bg-gray-50"
              }`}
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
                  <p className="text-xs text-[#8d8d8d]">Uploaded today ago by Eric...</p>
                </div>
                <button className="text-[#212be9]">
                  <Download className="size-4" />
                </button>
              </div>
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
  const initialStep = (searchParams.get("step") as Step) || "campaign";
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [showForm, setShowForm] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(initialStep === "map-partners" || initialStep === "placement");
  const [campaignName, setCampaignName] = useState("");
  const [measurementBudget, setMeasurementBudget] = useState("");
  const [metric, setMetric] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [uploadBannerDismissed, setUploadBannerDismissed] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [hasReuploaded, setHasReuploaded] = useState(false);
  const [sfValidated, setSfValidated] = useState(false);

  const progressPercent =
    currentStep === "campaign" ? 0 :
    currentStep === "partner" ? 16 :
    currentStep === "funding" ? 32 :
    currentStep === "pixel" ? 48 :
    currentStep === "placement" ? 64 :
    currentStep === "map-partners" ? 64 : 64;

  const displayName = campaignName.trim() || "Draft";

  const pixelState: PixelState = hasUploadedFile ? "populated" : "empty";
  const placementState: PlacementState = hasUploadedFile ? "uploaded" : "empty";

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const doUpload = () => {
    if (isUploading) return;
    const isReupload = hasUploadedFile;
    setIsUploading(true);
    setUploadBannerDismissed(false);
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

  const handleUpload = () => {
    if (hasUploadedFile) {
      setShowReplaceConfirm(true);
    } else {
      doUpload();
    }
  };

  const confirmReplace = () => {
    setShowReplaceConfirm(false);
    doUpload();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Header />

      <div className="sticky top-0 z-30 bg-white">
        <div className="flex items-center justify-between px-12 py-2.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-[#020617]">{displayName}</h1>
              <span className="rounded-full bg-[#ebf1ff] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#212be9]">{progressPercent}%</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-2 py-1 text-sm font-medium text-[#dc2626]">Remove</button>
              <button className="px-2 py-1 text-sm font-medium text-[#212be9]">Save Draft</button>
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full bg-[#ebf1ff]"><div className="h-full bg-[#212be9] transition-all duration-700 ease-out" style={{ width: `${Math.max(progressPercent, 0.1)}%` }} /></div>
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
              {(hasReuploaded ? [
                { label: "Campaign Details", status: "warning" as const },
                { label: "Partner Details", status: "error" as const },
                { label: "Funding Allocation", status: "error" as const },
                { label: "Pixel Generation", status: "warning" as const },
                { label: "Placement Details", status: "error" as const },
              ] : [
                { label: "Campaign Details", status: "success" as const },
                { label: "Partner Details", status: hasUploadedFile ? "warning" as const : "error" as const },
                { label: "Funding Allocation", status: "warning" as const },
                { label: "Pixel Generation", status: "warning" as const },
                { label: "Placement Details", status: "warning" as const },
              ]).map((item, i) => (
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
        <Sidebar currentStep={currentStep} hasUploadedFile={hasUploadedFile} hasReuploaded={hasReuploaded} onUpload={handleUpload} isUploading={isUploading} onStepClick={(step) => {
          if (step === ("review" as Step)) {
            window.location.href = "/attribution/taxonomy/review";
          } else {
            goToStep(step);
          }
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
            <CampaignDetailsContent showForm={showForm} onShowForm={() => setShowForm(true)} campaignName={campaignName} onCampaignNameChange={setCampaignName} onUpload={handleUpload} hasUploadedFile={hasUploadedFile} hasReuploaded={hasReuploaded} isUploading={isUploading} measurementBudget={measurementBudget} onMeasurementBudgetChange={setMeasurementBudget} metric={metric} onMetricChange={setMetric} sfValidated={sfValidated} onSfValidatedChange={setSfValidated} />
          )}
          {currentStep === "partner" && <PartnerDetailsContent hasUploadedFile={hasUploadedFile} isEditingPartner={isEditingPartner} onEditingPartnerChange={setIsEditingPartner} />}
          {currentStep === "funding" && <FundingAllocationContent measurementBudget={parseInt(measurementBudget.replace(/,/g, "") || "0")} />}
          {currentStep === "pixel" && <PixelGenerationContent pixelState={pixelState} />}
          {currentStep === "placement" && (
            <PlacementDetailsContent
              placementState={placementState}
              onContinueToMapPartners={() => goToStep("map-partners")}
              onUpload={handleUpload}
              hasReuploaded={hasReuploaded}
            />
          )}
          {currentStep === "map-partners" && (
            <MapPartnersContent
              onBackToMediaPlan={() => goToStep("placement")}
              onContinueToTaxonomy={() => window.location.href = "/attribution/taxonomy"}
              hasReuploaded={hasReuploaded}
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
                onClick={() => goToStep("partner")}
                disabled={!sfValidated}
                className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Partner Details
              </button>
            </div>
          )}

          {currentStep === "partner" && !isEditingPartner && (
            <div className="mt-8 flex items-center justify-between py-4">
              <button
                onClick={() => goToStep("campaign")}
                className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
              >
                Back to Campaign Details
              </button>
              <button
                onClick={() => goToStep("funding")}
                className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]"
              >
                Continue to Funding Allocation
              </button>
            </div>
          )}

          {currentStep === "funding" && (
            <div className="mt-8 flex items-center justify-between py-4">
              <button
                onClick={() => goToStep("partner")}
                className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
              >
                Back to Partner Details
              </button>
              <button
                onClick={() => goToStep("pixel")}
                className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]"
              >
                Continue to Pixel Generation
              </button>
            </div>
          )}

          {currentStep === "pixel" && (
            <div className="mt-8 flex items-center justify-between py-4">
              <button
                onClick={() => goToStep("funding")}
                className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
              >
                Back to Funding Allocation
              </button>
              <button
                onClick={() => goToStep("placement")}
                className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]"
              >
                Continue to Placement Details
              </button>
            </div>
          )}

          {currentStep === "placement" && (
            <div className="mt-8 flex items-center justify-between py-4">
              <button
                onClick={() => goToStep("pixel")}
                className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]"
              >
                Back to Pixel Generation
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
    </div>
  );
}

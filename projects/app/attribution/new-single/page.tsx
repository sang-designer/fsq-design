"use client";

import { useState, useRef, useEffect, useCallback, useMemo, Suspense, DragEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload, ChevronDown, ChevronUp, Calendar as CalendarIcon,
  CircleDashed, Check, Plus, ChevronLeft, ChevronRight, Search, Download,
  Copy, Mail, X, Loader2, Info, GripVertical, FileText,
  CircleAlert, SlidersHorizontal, ArrowUpDown, SquarePen, MoreHorizontal, ExternalLink, ArrowLeft,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Header } from "../_components/campaign-header";
import { SelectField, DateField, InputField, BrandSearchSelect } from "../_components/form-fields";
import { CampaignSidebar } from "../_components/campaign-sidebar";

type Step = "campaign" | "pixel" | "placement" | "review";

const SIDEBAR_STEPS = [
  { key: "campaign" as const, label: "Campaign Details" },
  { key: "placement" as const, label: "Placement Details" },
  { key: "pixel" as const, label: "Pixel Generation" },
  { key: "review" as const, label: "Review & Submit" },
];

// PLACEHOLDER: CampaignDetailsStep will be added
// PLACEHOLDER: PartnerDetailsStep will be added
// PLACEHOLDER: FundingAllocationStep will be added
// PLACEHOLDER: PlacementDetailsStep will be added
// PLACEHOLDER: ReviewStep will be added

export default function SinglePartnerCampaignPage() {
  return (
    <Suspense>
      <SinglePartnerCampaignContent />
    </Suspense>
  );
}

function SinglePartnerCampaignContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStep = (searchParams.get("step") as Step) || "campaign";
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [campaignName, setCampaignName] = useState("");
  const [measurementBudget, setMeasurementBudget] = useState("");
  const [metric, setMetric] = useState("");
  const [partnerData, setPartnerData] = useState<Record<string, string>>({});
  const [fundingVisits, setFundingVisits] = useState("");
  const [fundingSalesImpact, setFundingSalesImpact] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadBannerDismissed, setUploadBannerDismissed] = useState(false);
  const [campaignSubmitted, setCampaignSubmitted] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [hasReuploaded, setHasReuploaded] = useState(false);
  const [campaignStepValid, setCampaignStepValid] = useState(false);
  const [placementStepValid, setPlacementStepValid] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [delimiters, setDelimiters] = useState<string[]>([]);
  const [isReparsing, setIsReparsing] = useState(false);
  const [reparseError, setReparseError] = useState<string | null>(null);
  const pendingDelimitersRef = useRef<string[]>([]);
  const [droppedFileName, setDroppedFileName] = useState<string | null>(null);

  const completedSteps = (() => {
    if (campaignSubmitted) return ["campaign", "placement", "pixel", "review"];
    if (hasReuploaded) return [] as string[];
    const steps: string[] = [];
    const order: Step[] = ["campaign", "placement", "pixel", "review"];
    const idx = order.indexOf(currentStep);
    for (let i = 0; i < idx; i++) steps.push(order[i]);
    return steps;
  })();

  const errorSteps = (() => {
    if (!hasReuploaded || campaignSubmitted) return [] as string[];
    const order: Step[] = ["campaign", "placement", "pixel", "review"];
    const idx = order.indexOf(currentStep);
    const steps: string[] = [];
    for (let i = 0; i < idx; i++) steps.push(order[i]);
    return steps;
  })();

  const progressPercent = campaignSubmitted ? 100 :
    currentStep === "campaign" ? 0 :
    currentStep === "placement" ? 25 :
    currentStep === "pixel" ? 50 :
    currentStep === "review" ? 75 : 0;

  const displayName = campaignName.trim() || "Draft";

  const doUpload = (newDelimiters?: string[]) => {
    if (isUploading) return;
    const isReupload = hasUploadedFile;
    if (newDelimiters) setDelimiters(newDelimiters);
    setIsUploading(true);
    setUploadBannerDismissed(false);
    setShowUploadModal(false);
    setReparseError(null);
    setTimeout(() => {
      setIsUploading(false);
      setHasUploadedFile(true);
      setShowForm(true);
      if (isReupload) {
        setHasReuploaded(true);
      }
      setCampaignName("QSR Q2 2026");
      setMeasurementBudget("380,000");
      setMetric("Visits and Sales");
      setPartnerData({
        "Partner/Platform Name": "Viant",
        "Ad Server": "Google Campaign Manager",
        "Ad Run Start Date": "2026-04-01",
        "Ad Run End Date": "2026-06-30",
        "Agency or Site Served": "Starcom",
        "Estimated Total Ad Spend": "$125,000",
        "FSQ Pixel Implementation": "Standard Tag",
        "Media Type": "Display",
        "Conversion Funding Report Type": "Visits and Sales Impact",
        "Estimated Ad Spend": "$125,000",
        "Estimated Impressions": "5,000,000",
        "Pricing Method for Visits": "CPM",
        "Rate Card for Visits": "Standard Rate",
        "Funding Name for Visits": "Starcom_Visits_2026",
        "Funding Email for Visits": "funding@starcom.com",
        "Sales/Account Manager Name": "Sarah Johnson",
        "Sales/Account Manager Email": "sarah.johnson@starcom.com",
        "Ad Ops Contact Name": "James Lee",
        "Ad Ops Contact Email": "james.lee@starcom.com",
      });
      setFundingVisits("Agency");
      setFundingSalesImpact("Partner");
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

  const handleCampaignFileDrop = (name: string) => {
    setDroppedFileName(name);
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

  const handleFileDrop = (name: string) => {
    setDroppedFileName(name);
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
      setIsReparsing(false);
      setCampaignName("QSR Q2 2026");
      setUploadBannerDismissed(false);
    }, 2000);
  };

  const handleRetryReparse = () => {
    handleDelimitersChange(delimiters);
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const STEP_ORDER: Step[] = ["campaign", "placement", "pixel", "review"];
  const currentIdx = STEP_ORDER.indexOf(currentStep);

  const stepValidityMap: Record<Step, boolean> = {
    campaign: campaignStepValid,
    pixel: true,
    placement: placementStepValid,
    review: true,
  };

  const disabledSteps = (() => {
    if (campaignSubmitted) return [] as Step[];
    if (!stepValidityMap[currentStep]) {
      return STEP_ORDER.filter((_, i) => i > currentIdx);
    }
    return [] as Step[];
  })();

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
                <>
                  <span className="rounded-full bg-[#ebf1ff] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#212be9]">{progressPercent}%</span>
                  <span className="rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">Single Partner</span>
                </>
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
          <div className="h-[2px] w-full bg-[#ebf1ff]">
            <div className="h-full bg-[#212be9] transition-all duration-700 ease-out" style={{ width: `${Math.max(progressPercent, 0.1)}%` }} />
          </div>
        )}
      </div>

      {hasUploadedFile && !uploadBannerDismissed && (
        <div className="px-12 pt-6">
          <div className="flex items-center gap-2 rounded-md border border-[#e0e0e0] bg-[#fcfcfc] p-4 shadow-sm">
            <div className="flex min-w-[180px] flex-col gap-2">
              <p className="text-base font-semibold text-black">Upload Results</p>
              <div className="flex items-center gap-1">
                <FileText className="size-4 text-[#8d8d8d]" />
                <span className="text-xs text-black">{hasReuploaded ? "QSR_Q2_2026_v2" : "QSR_Q2_2026"}</span>
              </div>
            </div>
            <div className="flex flex-1 items-stretch">
              {[
                { label: "Campaign Details", status: campaignStepValid ? "success" as const : "warning" as const },
                { label: "Placement Details", status: placementStepValid ? "success" as const : "warning" as const },
                { label: "Pixel Generation", status: "success" as const },
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
        <CampaignSidebar
          steps={SIDEBAR_STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          errorSteps={errorSteps}
          disabledSteps={disabledSteps}
          onStepClick={(s) => !campaignSubmitted && goToStep(s as Step)}
          hasUploadedFile={hasUploadedFile}
          fileName={hasReuploaded ? "QSR_Q2_2026_v2" : "QSR_Q2_2026"}
          onUpload={currentStep === "campaign" ? handleCampaignUpload : handleUpload}
          isUploading={isUploading || isReparsing}
          disabled={campaignSubmitted}
        />

        <main className="relative min-w-0 flex-1">
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
            <CampaignDetailsStep
              campaignName={campaignName}
              onCampaignNameChange={setCampaignName}
              measurementBudget={measurementBudget}
              onMeasurementBudgetChange={setMeasurementBudget}
              metric={metric}
              onMetricChange={setMetric}
              showForm={showForm}
              onShowForm={() => setShowForm(true)}
              onUpload={handleCampaignUpload}
              onFileDrop={handleCampaignFileDrop}
              hasUploadedFile={hasUploadedFile}
              hasReuploaded={hasReuploaded}
              isUploading={isUploading}
              delimiters={delimiters}
              onDelimitersChange={handleDelimitersChange}
              isReparsing={isReparsing}
              reparseError={reparseError}
              onRetryReparse={handleRetryReparse}
              onContinue={() => goToStep("placement")}
              onValidChange={setCampaignStepValid}
            />
          )}
          {currentStep === "placement" && (
            <PlacementDetailsStep
              partnerName={partnerData["Partner/Platform Name"] || ""}
              hasUploadedFile={hasUploadedFile}
              hasReuploaded={hasReuploaded}
              isUploading={isUploading}
              onUpload={handleUpload}
              onBack={() => goToStep("campaign")}
              onContinue={() => goToStep("pixel")}
              onValidChange={setPlacementStepValid}
            />
          )}
          {currentStep === "pixel" && (
            <DataIngestionStep
              partnerName={partnerData["Partner/Platform Name"] || ""}
              onBack={() => goToStep("placement")}
              onContinue={() => goToStep("review")}
            />
          )}
          {currentStep === "review" && (
            <ReviewStep
              campaignName={campaignName}
              measurementBudget={measurementBudget}
              metric={metric}
              partnerName={partnerData["Partner/Platform Name"] || ""}
              partnerData={partnerData}
              fundingVisits={fundingVisits}
              fundingSalesImpact={fundingSalesImpact}
              authorized={authorized}
              onAuthorizedChange={setAuthorized}
              onBack={() => goToStep("pixel")}
              onSubmitted={() => setCampaignSubmitted(true)}
              onEditStep={(s) => goToStep(s as Step)}
            />
          )}
        </main>
      </div>

      <UploadMediaPlanModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={(newDelimiters) => doUpload(newDelimiters)}
        initialDelimiters={delimiters}
        droppedFileName={droppedFileName}
      />

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
            <div className="mt-6 flex items-center justify-center gap-3">
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

// === INLINE UPLOAD COMPONENTS ===

const SINGLE_SYMBOL_MAP: Record<string, string> = {
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
const SINGLE_NAME_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(SINGLE_SYMBOL_MAP).map(([, label]) => [label.replace(/\(.\)$/, "").toLowerCase(), label])
);

function singleNormalizeDelimiter(raw: string): string {
  if (SINGLE_SYMBOL_MAP[raw]) return SINGLE_SYMBOL_MAP[raw];
  const lower = raw.toLowerCase();
  if (SINGLE_NAME_TO_LABEL[lower]) return SINGLE_NAME_TO_LABEL[lower];
  return raw;
}

function SingleInlineUploadedCard({ fileName, delimiters, onDelimitersChange, onReplace, isReparsing, reparseError, onRetryReparse }: {
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
    const label = singleNormalizeDelimiter(trimmed);
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
            {showDelimiters ? "Hide Delimiters" : delimiters.length > 0 ? "Edit Delimiters" : "Add Delimiters (optional)"}
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

// === STEP COMPONENTS ===

function CampaignDetailsStep({ campaignName, onCampaignNameChange, measurementBudget, onMeasurementBudgetChange, metric, onMetricChange, showForm, onShowForm, onUpload, onFileDrop, hasUploadedFile, hasReuploaded, isUploading, delimiters, onDelimitersChange, isReparsing, reparseError, onRetryReparse, onContinue, onValidChange }: {
  campaignName: string; onCampaignNameChange: (v: string) => void;
  measurementBudget: string; onMeasurementBudgetChange: (v: string) => void;
  metric: string; onMetricChange: (v: string) => void;
  showForm: boolean; onShowForm: () => void;
  onUpload: () => void; onFileDrop: (name: string) => void;
  hasUploadedFile: boolean; hasReuploaded?: boolean; isUploading: boolean;
  delimiters: string[];
  onDelimitersChange?: (d: string[]) => void;
  isReparsing?: boolean;
  reparseError?: string | null;
  onRetryReparse?: () => void;
  onContinue: () => void;
  onValidChange?: (valid: boolean) => void;
}) {
  const formRef = useRef<HTMLDivElement>(null);
  const [advertiser, setAdvertiser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [conversionWindow, setConversionWindow] = useState("");
  const [adServer, setAdServer] = useState("");
  const [sfOpportunity, setSfOpportunity] = useState("");
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

  const [sfValidated, setSfValidated] = useState(false);
  const [sfValidating, setSfValidating] = useState(false);
  const [sfError, setSfError] = useState("");
  const [sfOriginal, setSfOriginal] = useState<{ brand: string; budget: string; metric: string } | null>(null);

  const MOCK_SF_DATA: Record<string, { brand: string; budget: string; metric: string }> = {
    "00341": { brand: "McDonalds", budget: "420,000", metric: "Visits and Sales" },
    "00555": { brand: "Starbucks", budget: "250,000", metric: "Visits" },
    "00789": { brand: "Target", budget: "310,000", metric: "Visits and Sales" },
    "01026": { brand: "QSR Brand", budget: "380,000", metric: "Visits and Sales" },
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
        setSfValidated(true);
        setSfOriginal(data);
        setBrand(data.brand);
        onMeasurementBudgetChange(data.budget);
        onMetricChange(data.metric);
        
        // Set campaign name based on the SF ID
        if (id === "01026") {
          onCampaignNameChange("QSR Q2 2026");
        } else if (id === "00341") {
          onCampaignNameChange("McDonalds Q1-Q2 2025");
        } else if (id === "00555") {
          onCampaignNameChange("Starbucks Campaign");
        } else if (id === "00789") {
          onCampaignNameChange("Target Campaign");
        }
      } else if (sfOpportunity.includes("error")) {
        setSfError("Unable to verify ID. Try again later.");
      } else {
        setSfError("Opportunity not found. Please check and try again.");
      }
    }, 1200);
  };

  useEffect(() => {
    if (hasUploadedFile) {
      onCampaignNameChange("QSR Q2 2026");
      setAdvertiser("QSR Brand");
      setStartDate("2026-04-01");
      setEndDate("2026-06-30");
      setConversionWindow("30 Days");
      setAdServer("Google Campaign Manager");
      setAgencyName("Starcom");
      setOwnerType("Agency");
      setContactName("Sarah Mitchell");
      setEmail("s.mitchell@starcom.com");
      setCountry("United States");
      setStoreChains("QSR Brand US");
      setGeoTargeting("National");
      setGeoLocations("All US Markets");
      setNotes("Q2 2026 brand awareness campaign across digital channels.");
      if (!sfValidated) {
        setSfOpportunity("https://foursquare.lightning.force.com/lightning/r/Opportunity/006Hs00001026QSR/view");
        setSfValidated(true);
        const sfData = { brand: "QSR Brand", budget: "380,000", metric: "Visits and Sales" };
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
            Let&apos;s get started in setting up your single partner campaign. Enter a Salesforce Opportunity to pull in campaign data.
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
        {/* Auto-populated fields with override warnings */}
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

        <Separator className="mb-6" />

        <div className="mb-10">
          <p className="mb-4 text-sm font-medium text-black">Upload a Media Plan</p>
          {isUploading ? (
            <div className="flex h-20 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#212be9] bg-[#f8f9ff]">
              <div className="flex items-center gap-3">
                <Loader2 className="size-5 animate-spin text-[#212be9]" />
                <span className="text-sm font-medium text-[#212be9]">Processing media plan...</span>
              </div>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[#e2e8f0]">
                <div className="h-full rounded-full bg-[#212be9]" style={{ animation: "progress 2.4s ease-in-out forwards" }} />
              </div>
              <style>{`@keyframes progress { 0% { width: 0% } 40% { width: 60% } 80% { width: 85% } 100% { width: 100% } }`}</style>
            </div>
          ) : hasUploadedFile ? (
            <SingleInlineUploadedCard
              fileName={hasReuploaded ? "QSR_Q2_2026_v2" : "QSR_Q2_2026"}
              delimiters={delimiters}
              onDelimitersChange={onDelimitersChange}
              onReplace={onUpload}
              isReparsing={isReparsing}
              reparseError={reparseError}
              onRetryReparse={onRetryReparse}
            />
          ) : (
            <>
              <div
                onClick={onUpload}
                onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.currentTarget.classList.add("border-[#212be9]", "bg-[#f8f9ff]"); }}
                onDragLeave={(e: DragEvent<HTMLDivElement>) => { e.currentTarget.classList.remove("border-[#212be9]", "bg-[#f8f9ff]"); }}
                onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.currentTarget.classList.remove("border-[#212be9]", "bg-[#f8f9ff]"); const f = e.dataTransfer.files?.[0]; if (f) onFileDrop(f.name); else onUpload(); }}
                className="flex h-20 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]"
              >
                <div className="flex items-center gap-2">
                  <Upload className="size-4 text-[#020617]" />
                  <span className="text-sm text-[#020617]">
                    Drop here or <span className="text-[#3333ff]">browse from your files</span>
                  </span>
                </div>
              </div>
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
                    <InputField label="Campaign Name" value={campaignName} onChange={onCampaignNameChange} required />
                  </div>
                  <div className="flex gap-4">
                    <DateField label="Start Date" value={startDate} onChange={setStartDate} required />
                    <DateField label="End Date" value={endDate} onChange={setEndDate} min={startDate} required />
                  </div>
                  <div className="flex gap-4">
                    <InputField label="Conversion Window" placeholder="# days to observe a visit after initial ad exposure" value={conversionWindow} onChange={setConversionWindow} />
                    <SelectField label="Ad Server" value={adServer} onChange={setAdServer} options={AD_SERVER_OPTIONS} />
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

      <div className="mt-8 flex justify-end">
        <button
          onClick={onContinue}
          disabled={!isStepValid}
          className="rounded-md bg-[#212be9] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
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

function PartnerDetailsStep({ partnerData, onPartnerDataChange, onBack, onContinue }: {
  partnerData: Record<string, string>;
  onPartnerDataChange: (d: Record<string, string>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [mediaTypeOpen, setMediaTypeOpen] = useState(true);

  const updateField = (field: string, value: string) => {
    onPartnerDataChange({ ...partnerData, [field]: value });
  };

  const partnerName = partnerData["Partner/Platform Name"] || "";
  const filledCount = Object.values(partnerData).filter(Boolean).length;
  const totalFields = 14;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Partner Details</h2>
        <p className="mt-1 text-sm leading-5 text-[#646464]">
          Configure your single media partner for this campaign.
        </p>
      </div>

      <Separator className="mb-6" />

      <div className="flex flex-col gap-10">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xs font-semibold text-[#646464]">Partner/Platform Setup</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-8">
              <SelectField label="Partner/Platform Name" value={partnerData["Partner/Platform Name"] ?? ""} onChange={(v) => updateField("Partner/Platform Name", v)} options={PARTNER_NAME_OPTIONS} />
              <SelectField label="Ad Server" value={partnerData["Ad Server"] ?? ""} onChange={(v) => updateField("Ad Server", v)} options={AD_SERVER_OPTIONS} />
            </div>
            <div className="flex gap-8">
              <DateField label="Ad Run Start Date" value={partnerData["Ad Run Start Date"] ?? ""} onChange={(v) => updateField("Ad Run Start Date", v)} />
              <DateField label="Ad Run End Date" value={partnerData["Ad Run End Date"] ?? ""} onChange={(v) => updateField("Ad Run End Date", v)} min={partnerData["Ad Run Start Date"] ?? ""} />
            </div>
            <div className="flex gap-8">
              <SelectField label="Agency or Site Served" value={partnerData["Agency or Site Served"] ?? ""} onChange={(v) => updateField("Agency or Site Served", v)} options={AGENCY_OPTIONS} />
              <InputField label="Estimated Total Ad Spend" placeholder="Ad Spend value..." value={partnerData["Estimated Total Ad Spend"] ?? ""} onChange={(v) => updateField("Estimated Total Ad Spend", v)} />
            </div>
            <div className="flex gap-8">
              <SelectField label="FSQ Pixel Implementation" value={partnerData["FSQ Pixel Implementation"] ?? ""} onChange={(v) => updateField("FSQ Pixel Implementation", v)} options={PIXEL_IMPL_OPTIONS} />
              <div className="flex-1 min-w-[280px]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <button onClick={() => setMediaTypeOpen(!mediaTypeOpen)} className="flex w-full items-center justify-between">
              <CardTitle className="text-xs font-semibold text-[#646464]">Media Types &amp; Funding</CardTitle>
              {mediaTypeOpen ? <ChevronUp className="size-4 text-[#8d8d8d]" /> : <ChevronDown className="size-4 text-[#8d8d8d]" />}
            </button>
          </CardHeader>
          {mediaTypeOpen && (
            <CardContent className="flex flex-col gap-4">
              <div className="flex gap-8">
                <SelectField label="Media Type" value={partnerData["Media Type"] ?? ""} onChange={(v) => updateField("Media Type", v)} options={MEDIA_TYPE_OPTIONS} />
                <SelectField label="Conversion Funding Report Type" value={partnerData["Conversion Funding Report Type"] ?? ""} onChange={(v) => updateField("Conversion Funding Report Type", v)} options={CONVERSION_TYPE_OPTIONS} />
              </div>
              <div className="flex gap-8">
                <InputField label="Estimated Ad Spend" placeholder="Ad Spend value..." value={partnerData["Estimated Ad Spend"] ?? ""} onChange={(v) => updateField("Estimated Ad Spend", v)} />
                <InputField label="Estimated Impressions" placeholder="Impressions value..." value={partnerData["Estimated Impressions"] ?? ""} onChange={(v) => updateField("Estimated Impressions", v)} />
              </div>
              <div className="flex gap-8">
                <SelectField label="Pricing Method for Visits" value={partnerData["Pricing Method for Visits"] ?? ""} onChange={(v) => updateField("Pricing Method for Visits", v)} options={PRICING_METHOD_OPTIONS} />
                <SelectField label="Rate Card for Visits" value={partnerData["Rate Card for Visits"] ?? ""} onChange={(v) => updateField("Rate Card for Visits", v)} options={RATE_CARD_OPTIONS} />
              </div>
              <div className="flex gap-8">
                <SelectField label="Funding Name for Visits" value={partnerData["Funding Name for Visits"] ?? ""} onChange={(v) => updateField("Funding Name for Visits", v)} options={FUNDING_NAME_OPTIONS} />
                <InputField label="Funding Email for Visits" placeholder="Email..." value={partnerData["Funding Email for Visits"] ?? ""} onChange={(v) => updateField("Funding Email for Visits", v)} />
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xs font-semibold text-[#646464]">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-8">
              <SelectField label="Sales/Account Manager Name" value={partnerData["Sales/Account Manager Name"] ?? ""} onChange={(v) => updateField("Sales/Account Manager Name", v)} options={SALES_MANAGER_OPTIONS} />
              <InputField label="Sales/Account Manager Email" placeholder="Email..." value={partnerData["Sales/Account Manager Email"] ?? ""} onChange={(v) => updateField("Sales/Account Manager Email", v)} />
            </div>
            <div className="flex gap-8">
              <SelectField label="Ad Ops Contact Name" value={partnerData["Ad Ops Contact Name"] ?? ""} onChange={(v) => updateField("Ad Ops Contact Name", v)} options={AD_OPS_OPTIONS} />
              <InputField label="Ad Ops Contact Email" placeholder="Email..." value={partnerData["Ad Ops Contact Email"] ?? ""} onChange={(v) => updateField("Ad Ops Contact Email", v)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-4 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">
          Back
        </button>
        <button onClick={onContinue} className="rounded-md bg-[#212be9] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4]">
          Continue
        </button>
      </div>
    </>
  );
}

function FundingAllocationStep({ partnerName, measurementBudget, metric, fundingVisits, onFundingVisitsChange, fundingSalesImpact, onFundingSalesImpactChange, onBack, onContinue }: {
  partnerName: string; measurementBudget: number; metric: string;
  fundingVisits: string; onFundingVisitsChange: (v: string) => void;
  fundingSalesImpact: string; onFundingSalesImpactChange: (v: string) => void;
  onBack: () => void; onContinue: () => void;
}) {
  const salesEnabled = metric.toLowerCase().includes("sales");
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Funding Allocation</h2>
        <p className="mt-1 text-sm leading-5 text-[#646464]">
          Specify who is funding visits and sales impact for each media partner.
        </p>
      </div>

      <div className="mb-4 h-px w-full bg-[#e2e8f0]" />

      {/* Summary Card */}
      <div className="mb-6">
        <div className="w-fit rounded-lg border border-border bg-white px-4 py-3">
          <p className="text-xs font-medium text-[#6b7280]">Measurement Budget</p>
          <p className="mt-0.5 text-lg font-semibold text-[#1f2430]">${measurementBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Allocation Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-[#f8fafc]">
              <th className="px-5 py-3.5 text-left text-sm font-medium text-[#64748b]">Partner</th>
              <th className="px-5 py-3.5 text-left text-sm font-medium text-[#64748b]">Who is funding visits</th>
              <th className="px-5 py-3.5 text-left text-sm font-medium text-[#64748b]">Who is funding sales impact</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border last:border-b-0">
              <td className="px-5 py-4">
                <p className="text-sm font-medium text-[#1f2430]">{partnerName || "No partner selected"}</p>
              </td>
              <td className="px-5 py-4">
                <Select value={fundingVisits || undefined} onValueChange={onFundingVisitsChange}>
                  <SelectTrigger className={`w-[150px] ${fundingVisits ? "" : "border-[#f59e0b]"}`} size="sm">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agency">Agency</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-5 py-4">
                <Select value={fundingSalesImpact || undefined} onValueChange={onFundingSalesImpactChange} disabled={!salesEnabled}>
                  <SelectTrigger className={`w-[150px] ${!salesEnabled ? "opacity-50" : fundingSalesImpact ? "" : "border-[#f59e0b]"}`} size="sm">
                    <SelectValue placeholder={salesEnabled ? "Select..." : "N/A"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agency">Agency</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-4 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">
          Back
        </button>
        <button onClick={onContinue} className="rounded-md bg-[#212be9] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4]">
          Continue
        </button>
      </div>
    </>
  );
}

const SINGLE_PLACEMENT_SUB_STEPS = [
  { num: 1, label: "Media Plan" },
  { num: 2, label: "Map Taxonomies" },
  { num: 3, label: "Apply Placements" },
];

function SinglePlacementSubSteps({ activeStep }: { activeStep: number }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex gap-0">
        {SINGLE_PLACEMENT_SUB_STEPS.map((s) => (
          <div
            key={s.num}
            className={`h-1 flex-1 ${s.num <= activeStep ? "bg-[#64748b]" : "bg-[#e2e8f0]"} ${s.num === 1 ? "rounded-l-full" : ""} ${s.num === 3 ? "rounded-r-full" : ""}`}
          />
        ))}
      </div>
      <div className="flex">
        {SINGLE_PLACEMENT_SUB_STEPS.map((s) => (
          <div key={s.num} className="flex flex-1 items-center gap-2">
            <div
              className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                s.num < activeStep
                  ? "border border-[#d1d5db] bg-white text-[#9ca3af]"
                  : s.num === activeStep
                    ? "border-2 border-[#64748b] bg-[#64748b] text-white"
                    : "border-2 border-gray-300 text-gray-400"
              }`}
            >
              {s.num < activeStep ? <Check className="size-3.5" /> : s.num}
            </div>
            <span className={`text-sm ${s.num === activeStep ? "font-semibold text-[#64748b]" : s.num < activeStep ? "text-[#64748b]" : "text-[#757575]"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlacementDetailsStep({ partnerName, hasUploadedFile, hasReuploaded, isUploading, onUpload, onBack, onContinue, onValidChange }: {
  partnerName: string; hasUploadedFile: boolean; hasReuploaded?: boolean; isUploading: boolean; onUpload: () => void; onBack: () => void; onContinue: () => void;
  onValidChange?: (valid: boolean) => void;
}) {
  const [activeSubStep, setActiveSubStep] = useState(1);
  const [applyValid, setApplyValid] = useState(false);
  const [selectedKeysTab, setSelectedKeysTab] = useState<string>("");
  const [alreadyParsed, setAlreadyParsed] = useState(false);

  const DETECTED_TABS = ["Media Plan Q2", "Media Plan Q3", "Budget Summary", "Placement Keys", "Campaign Overview", "Partner List"];

  useEffect(() => {
    onValidChange?.(activeSubStep < 3 || applyValid);
  }, [activeSubStep, applyValid, onValidChange]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Placement Details</h2>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>Using a campaign media plan, map any unique or incomplete placement values, and update placement data.</p>
          <p><span className="cursor-pointer text-[#212be9]">Learn more</span> about campaign placement details.</p>
        </div>
      </div>

      <SinglePlacementSubSteps activeStep={activeSubStep} />

      {activeSubStep === 1 && (
        <>
          {hasUploadedFile ? (
            <>
              <div className="mb-5">
                <p className="mb-1.5 text-sm font-semibold text-[#020617]">Processed File</p>
                <div className="flex max-w-[480px] items-center justify-between rounded-lg border border-[#e2e8f0] bg-white px-4 py-3">
                  <span className="text-sm font-medium text-[#020617]">{hasReuploaded ? "QSR_Q2_2026_v2" : "QSR_Q2_2026"}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-sm">
                      <FileText className="size-4 text-[#64748b]" />
                      <span className="text-[#64748b]">{DETECTED_TABS.length} tabs detected</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Identify Keys Tab */}
              <div className="mb-4">
                <p className="mb-1.5 text-sm text-[#646464]">Select the tab that contains the taxonomy &quot;Keys&quot; — the mapping reference for placement values.</p>
                <label className="mb-1 block text-sm font-semibold text-[#020617]">Identify Keys</label>
                <Select
                  value={selectedKeysTab}
                  onValueChange={setSelectedKeysTab}
                  disabled={alreadyParsed}
                >
                  <SelectTrigger className={`max-w-[480px] h-11 text-base ${alreadyParsed ? "cursor-not-allowed opacity-50" : ""}`}>
                    <SelectValue placeholder="Select the keys tab..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DETECTED_TABS.map((tab) => (
                      <SelectItem key={tab} value={tab}>{tab}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Already Parsed Checkbox */}
              <div className="mb-6 flex items-start gap-3">
                <Checkbox
                  id="already-parsed"
                  checked={alreadyParsed}
                  onCheckedChange={(checked) => setAlreadyParsed(checked === true)}
                  className="mt-0.5"
                />
                <div>
                  <label htmlFor="already-parsed" className="cursor-pointer text-sm font-medium text-[#020617]">
                    Taxonomy values are already parsed out
                  </label>
                  <p className="mt-0.5 text-xs text-[#646464]">
                    Check this if the media plan file already has taxonomy values broken into separate columns. The Keys tab selection will be disabled.
                  </p>
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
                {isUploading ? (
                  <div className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#212be9] bg-[#f8f9ff]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-[#212be9]" />
                      <span className="text-sm font-medium text-[#212be9]">Processing media plan...</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={onUpload}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[#212be9]", "bg-[#f8f9ff]"); }}
                    onDragLeave={(e) => { e.currentTarget.classList.remove("border-[#212be9]", "bg-[#f8f9ff]"); }}
                    onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-[#212be9]", "bg-[#f8f9ff]"); onUpload(); }}
                    className="flex h-16 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] transition-colors hover:border-[#212be9] hover:bg-[#f8f9ff]"
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="size-4 text-[#020617]" />
                      <span className="text-sm text-[#020617]">
                        Drop here or <span className="cursor-pointer text-[#3333ff]">browse from your files</span>
                      </span>
                    </div>
                  </div>
                )}
                <p className="mt-2 text-sm text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
              </div>
            </>
          )}
          <div className="mt-8 flex items-center justify-between">
            <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-4 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">Back</button>
            <button onClick={() => setActiveSubStep(2)} disabled={!hasUploadedFile} className="rounded-md bg-[#212be9] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:opacity-50 disabled:cursor-not-allowed">Continue to Map Taxonomies</button>
          </div>
        </>
      )}

      {activeSubStep === 2 && (
        <MapTaxonomiesSubStep onBack={() => setActiveSubStep(1)} onContinue={() => setActiveSubStep(3)} />
      )}

      {activeSubStep === 3 && (
        <ApplyPlacementsSubStep onBack={() => setActiveSubStep(2)} onContinue={onContinue} hasReuploaded={hasReuploaded} onValidChange={setApplyValid} />
      )}
    </>
  );
}

type TaxToken = { id: string; name: string };
type TaxCategory = { id: string; name: string; count: number; tokens: TaxToken[] };

const MAP_TOKENS: TaxToken[] = [
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
];

const MAP_TAXONOMIES: TaxCategory[] = [
  { id: "audience", name: "Audience", count: 42, tokens: Array.from({ length: 42 }, (_, i) => ({ id: `aud-${i}`, name: `Audience_Seg_${String(i + 1).padStart(2, "0")}` })) },
  { id: "channel", name: "Channel", count: 13, tokens: Array.from({ length: 13 }, (_, i) => ({ id: `ch-${i}`, name: ["Display", "Mobile", "Video", "Audio", "CTV", "Social", "Native", "Programmatic", "Search", "Email", "DOOH", "Podcast", "Streaming"][i] })) },
  { id: "creative", name: "Creative", count: 5, tokens: [{ id: "cr-0", name: "Standard_Banner" }, { id: "cr-1", name: "Rich_Media" }, { id: "cr-2", name: "Video_Pre_Roll" }, { id: "cr-3", name: "Interactive" }, { id: "cr-4", name: "Native_Content" }] },
  { id: "creative-size", name: "Creative Ad Size", count: 3, tokens: [{ id: "cs-0", name: "300x250" }, { id: "cs-1", name: "728x90" }, { id: "cs-2", name: "320x50" }] },
  { id: "geography", name: "Geography", count: 28, tokens: Array.from({ length: 28 }, (_, i) => ({ id: `geo-${i}`, name: ["New_York", "Los_Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San_Antonio", "San_Diego", "Dallas", "San_Jose", "Austin", "Jacksonville", "Fort_Worth", "Columbus", "Charlotte", "Indianapolis", "San_Francisco", "Seattle", "Denver", "Washington_DC", "Nashville", "Oklahoma_City", "El_Paso", "Boston", "Portland", "Las_Vegas", "Memphis", "Louisville"][i] })) },
  { id: "language", name: "Language", count: 0, tokens: [] },
  { id: "publisher", name: "Publisher", count: 4, tokens: [{ id: "pub-0", name: "Google_DV360" }, { id: "pub-1", name: "Meta_Ads" }, { id: "pub-2", name: "Amazon_DSP" }, { id: "pub-3", name: "TradeDesk" }] },
  { id: "ignored", name: "Ignored", count: 0, tokens: [] },
];

type SystemLabel = { id: string; name: string; color: string };
type ColumnDef = { id: string; rawName: string; sampleData: string[] };

const SYSTEM_LABELS: SystemLabel[] = [
  { id: "sl-sub-placement", name: "Placement ID", color: "#3b82f6" },
  { id: "sl-channel", name: "Media Channel", color: "#10b981" },
  { id: "sl-audience", name: "Audience", color: "#06b6d4" },
  { id: "sl-adsize", name: "Ad Size", color: "#ef4444" },
  { id: "sl-creative", name: "Creative ID", color: "#f59e0b" },
  { id: "sl-device-type", name: "Device Type", color: "#0ea5e9" },
  { id: "sl-ad-type", name: "Ad Type", color: "#f43f5e" },
  { id: "sl-ad-format", name: "Ad Format", color: "#84cc16" },
  { id: "sl-creative-name", name: "Creative Name", color: "#fb923c" },
  { id: "sl-media-cpm", name: "Media CPM", color: "#f97316" },
  { id: "sl-language", name: "Language", color: "#6366f1" },
  { id: "sl-geography", name: "Geography", color: "#ec4899" },
  { id: "sl-market", name: "Market", color: "#14b8a6" },
  { id: "sl-media-supplier", name: "Media Supplier", color: "#a855f7" },
  { id: "sl-ignored", name: "Ignored", color: "#6b7280" },
];

const PARSED_COLUMNS: ColumnDef[] = [
  { id: "col-1", rawName: "Placement_Name", sampleData: ["Pandora_2025_Display_Q1", "Streamline_2025_Video_Q1", "FitTrack_2025_Mobile_Q2", "TechSavvy_2025_Display_Q1", "TravelQuest_2025_CTV_Q2", "CulinaryDelight_2025_Social", "HealthTech_2025_Native_Q3", "SportsFan_2025_CTV_Q2", "EcoLiving_2025_Display_Q1", "AutoDrive_2025_Video_Q3", "PetCare_2025_Mobile_Q1", "FinanceHub_2025_Display_Q2", "StyleBox_2025_Social_Q1", "GameStream_2025_CTV_Q3", "WellnessPlus_2025_Native_Q2", "SmartHome_2025_Display_Q3", "FoodieApp_2025_Mobile_Q2", "TechGear_2025_Video_Q1", "TravelEasy_2025_CTV_Q1", "MusicLive_2025_Audio_Q2"] },
  { id: "col-2", rawName: "Media Type", sampleData: ["Display", "Video", "Mobile", "Display", "CTV", "Social", "Native", "CTV", "Display", "Video", "Mobile", "Display", "Social", "CTV", "Native", "Display", "Mobile", "Video", "CTV", "Audio"] },
  { id: "col-3", rawName: "Target Group", sampleData: ["Audience_Seg_01", "Audience_Seg_08", "Audience_Seg_12", "Audience_Seg_15", "Audience_Seg_20", "Audience_Seg_22", "Audience_Seg_01", "Audience_Seg_12", "Audience_Seg_05", "Audience_Seg_03", "Audience_Seg_08", "Audience_Seg_15", "Audience_Seg_22", "Audience_Seg_20", "Audience_Seg_01", "Audience_Seg_05", "Audience_Seg_12", "Audience_Seg_08", "Audience_Seg_03", "Audience_Seg_15"] },
  { id: "col-4", rawName: "Ad_Unit", sampleData: ["300x50", "728x90", "320x50", "300x600", "970x250", "300x250", "728x90", "970x250", "300x600", "728x90", "320x50", "300x250", "300x50", "970x250", "728x90", "300x600", "320x50", "728x90", "970x250", "320x50"] },
  { id: "col-5", rawName: "Creative Format", sampleData: ["Standard_Banner", "Video_Pre_Roll", "Interactive", "Native_Content", "Rich_Media", "Standard_Banner", "Native_Content", "Video_Pre_Roll", "Rich_Media", "Video_Pre_Roll", "Interactive", "Standard_Banner", "Rich_Media", "Video_Pre_Roll", "Native_Content", "Rich_Media", "Interactive", "Video_Pre_Roll", "Native_Content", "Interactive"] },
  { id: "col-6", rawName: "Rate", sampleData: ["$3.75", "$12.00", "$4.25", "$6.50", "$15.75", "$5.00", "$8.50", "$18.50", "$6.50", "$10.50", "$4.25", "$5.00", "$3.75", "$18.50", "$8.50", "$6.50", "$4.25", "$12.00", "$15.75", "$10.50"] },
  { id: "col-7", rawName: "Locale", sampleData: ["English", "English", "Spanish", "English", "English", "English", "English", "English", "Spanish", "English", "English", "French", "English", "English", "English", "English", "Spanish", "English", "English", "English"] },
  { id: "col-8", rawName: "DMA_Region", sampleData: ["Los_Angeles", "Houston", "Dallas", "San_Francisco", "Seattle", "Denver", "New_York", "Phoenix", "Dallas", "New_York", "Chicago", "Philadelphia", "Los_Angeles", "Phoenix", "New_York", "San_Francisco", "Dallas", "Houston", "Seattle", "Chicago"] },
];

function MapTaxonomiesSubStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [mappings, setMappings] = useState<Record<string, string | null>>(() => {
    const m: Record<string, string | null> = {};
    PARSED_COLUMNS.forEach((col) => { m[col.id] = null; });
    return m;
  });
  const [draggingLabel, setDraggingLabel] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customLabels, setCustomLabels] = useState<SystemLabel[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customLabelName, setCustomLabelName] = useState("");
  const PAGE_SIZE = 15;
  const totalRows = PARSED_COLUMNS[0].sampleData.length;
  const totalPages = Math.ceil(totalRows / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalRows);

  const allLabels = useMemo(() => [...SYSTEM_LABELS, ...customLabels], [customLabels]);

  const assignedLabelIds = useMemo(() => {
    const assigned = new Set<string>();
    Object.values(mappings).forEach((labelId) => {
      if (labelId) assigned.add(labelId);
    });
    return assigned;
  }, [mappings]);

  const unassignedLabels = allLabels.filter((l) => !assignedLabelIds.has(l.id));
  const mappedCount = Object.values(mappings).filter(Boolean).length;

  const assignLabel = (colId: string, labelId: string) => {
    setMappings((prev) => {
      const next = { ...prev };
      const existingCol = Object.entries(next).find(([, v]) => v === labelId);
      if (existingCol) next[existingCol[0]] = null;
      next[colId] = labelId;
      return next;
    });
  };

  const unassignLabel = (colId: string) => {
    setMappings((prev) => ({ ...prev, [colId]: null }));
  };

  const handleDragStart = useCallback((e: DragEvent, labelId: string) => {
    setDraggingLabel(labelId);
    e.dataTransfer.setData("text/plain", labelId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const dragCounterRef = useRef<Record<string, number>>({});

  const handleDragEnter = useCallback((e: DragEvent, colId: string) => {
    e.preventDefault();
    dragCounterRef.current[colId] = (dragCounterRef.current[colId] || 0) + 1;
    setDragOverCol(colId);
  }, []);

  const handleDragLeave = useCallback((_e: DragEvent, colId: string) => {
    dragCounterRef.current[colId] = (dragCounterRef.current[colId] || 0) - 1;
    if (dragCounterRef.current[colId] <= 0) {
      dragCounterRef.current[colId] = 0;
      setDragOverCol((prev) => (prev === colId ? null : prev));
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent, colId: string) => {
    e.preventDefault();
    dragCounterRef.current = {};
    setDragOverCol(null);
    const labelId = e.dataTransfer.getData("text/plain") || draggingLabel;
    if (labelId) assignLabel(colId, labelId);
    setDraggingLabel(null);
  }, [draggingLabel]);

  const handleDragEnd = useCallback(() => {
    setDraggingLabel(null);
    setDragOverCol(null);
    dragCounterRef.current = {};
  }, []);

  const getLabelForCol = (colId: string) => {
    const labelId = mappings[colId];
    if (!labelId) return null;
    return allLabels.find((l) => l.id === labelId) || null;
  };

  return (
    <>
      <p className="mb-6 text-sm text-[#6b7280]">Match your external column names to the system&apos;s internal labels. Use the dropdown in each column header or drag labels from the bar above.</p>

      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-[#646464]">
          <span className="font-medium text-[#020617]">{mappedCount}</span> of <span className="font-medium text-[#020617]">{PARSED_COLUMNS.length}</span> columns mapped
        </p>
        {mappedCount === PARSED_COLUMNS.length && (
          <span className="flex items-center gap-1 text-sm font-medium text-[#16a34a]">
            <Check className="size-4" /> All columns mapped
          </span>
        )}
      </div>

      {/* Pill bar of available system labels */}
      <div className="mb-6 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4">
        <p className="mb-2 text-xs font-medium text-[#64748b]">Available Labels — Drag Onto Columns or Use the Dropdown</p>
        <div className="flex flex-wrap gap-2">
          {allLabels.map((label) => {
            const isAssigned = assignedLabelIds.has(label.id);
            const isCustom = label.id.startsWith("custom-");
            return (
              <div
                key={label.id}
                draggable={!isAssigned}
                onDragStart={(e) => handleDragStart(e, label.id)}
                onDragEnd={handleDragEnd}
                className={`flex cursor-grab items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:cursor-grabbing ${
                  isAssigned
                    ? "cursor-default bg-[#f1f5f9] text-[#94a3b8] line-through opacity-50"
                    : "border border-[#e2e8f0] bg-white text-[#020617] shadow-sm hover:shadow-md"
                } ${draggingLabel === label.id ? "scale-95 opacity-60" : ""}`}
              >
                <GripVertical className={`size-3 ${isAssigned ? "text-[#cbd5e1]" : "text-[#9ca3af]"}`} />
                {label.name}
                {isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMappings((prev) => {
                        const next = { ...prev };
                        Object.entries(next).forEach(([k, v]) => { if (v === label.id) next[k] = null; });
                        return next;
                      });
                      setCustomLabels((prev) => prev.filter((l) => l.id !== label.id));
                    }}
                    className="ml-0.5 rounded-full p-0.5 text-[#94a3b8] transition-colors hover:bg-[#fee2e2] hover:text-[#dc2626]"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            );
          })}
          {isAddingCustom ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={customLabelName}
                onChange={(e) => setCustomLabelName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customLabelName.trim()) {
                    setCustomLabels((prev) => [...prev, { id: `custom-${Date.now()}`, name: customLabelName.trim(), color: "#6b7280" }]);
                    setCustomLabelName("");
                    setIsAddingCustom(false);
                  }
                  if (e.key === "Escape") { setCustomLabelName(""); setIsAddingCustom(false); }
                }}
                autoFocus
                placeholder="Label name..."
                className="h-7 w-[140px] rounded-full border border-[#212be9] bg-white px-3 text-xs outline-none placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#212be9]/20"
              />
              <button
                onClick={() => {
                  if (customLabelName.trim()) {
                    setCustomLabels((prev) => [...prev, { id: `custom-${Date.now()}`, name: customLabelName.trim(), color: "#6b7280" }]);
                    setCustomLabelName("");
                    setIsAddingCustom(false);
                  }
                }}
                className="flex size-7 items-center justify-center rounded-full bg-[#212be9] text-white transition-colors hover:bg-[#1a22c4]"
              >
                <Check className="size-3.5" />
              </button>
              <button
                onClick={() => { setCustomLabelName(""); setIsAddingCustom(false); }}
                className="flex size-7 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] transition-colors hover:bg-gray-50"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCustom(true)}
              className="flex items-center gap-1 rounded-full border border-dashed border-[#cbd5e1] px-3 py-1.5 text-xs font-medium text-[#64748b] transition-colors hover:border-[#212be9] hover:text-[#212be9]"
            >
              <Plus className="size-3" />
              Add Custom
            </button>
          )}
        </div>
      </div>

      {/* Data table with mappable column headers */}
      <div className="w-full overflow-x-auto rounded-lg border border-[#e2e8f0]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e2e8f0]">
              {PARSED_COLUMNS.map((col) => {
                const assignedLabel = getLabelForCol(col.id);
                const isOver = dragOverCol === col.id;
                const isDragging = !!draggingLabel;
                return (
                  <th
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, col.id)}
                    onDragLeave={(e) => handleDragLeave(e, col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`relative min-w-[140px] px-3 py-3 text-left transition-all ${
                      isOver ? "bg-[#dbeafe] ring-2 ring-inset ring-[#212be9] shadow-[inset_0_0_0_1px_#212be9]" :
                      isDragging && !assignedLabel ? "bg-[#f8fafc] ring-1 ring-inset ring-[#cbd5e1] ring-dashed" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      {assignedLabel ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="flex items-center gap-1 whitespace-nowrap rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-2 py-0.5 text-xs font-semibold text-[#020617]"
                            >
                              {assignedLabel.name}
                              <button
                                onClick={(e) => { e.stopPropagation(); unassignLabel(col.id); }}
                                className="ml-0.5 rounded-full p-0.5 text-[#64748b] transition-colors hover:bg-[#e2e8f0] hover:text-[#020617]"
                              >
                                <X className="size-2.5" />
                              </button>
                            </span>
                          </div>
                          <span className="text-[10px] text-[#94a3b8]">{col.rawName}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-medium text-[#020617]">{col.rawName}</span>
                          <Select onValueChange={(labelId) => assignLabel(col.id, labelId)}>
                            <SelectTrigger className="h-6 w-auto gap-1 border-dashed border-[#cbd5e1] px-2 text-[10px] text-[#64748b] shadow-none hover:border-[#212be9] hover:text-[#212be9]">
                              <SelectValue placeholder="Select Label" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[240px]">
                              {allLabels.map((label) => {
                                const isUsed = assignedLabelIds.has(label.id);
                                return (
                                  <SelectItem
                                    key={label.id}
                                    value={label.id}
                                    disabled={isUsed}
                                  >
                                    {label.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: endIdx - startIdx }, (_, i) => startIdx + i).map((rowIdx) => (
              <tr key={rowIdx} className="border-b border-[#e2e8f0]/50">
                {PARSED_COLUMNS.map((col) => (
                  <td key={col.id} className="px-3 py-2.5 text-sm text-[#374151]">
                    {col.sampleData[rowIdx] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#64748b] transition-colors hover:text-[#020617] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? "border-2 border-[#020617] text-[#020617]"
                  : "text-[#64748b] hover:bg-[#f8fafc]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#64748b] transition-colors hover:text-[#020617] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between py-4">
        <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">Back to Media Plan</button>
        <button onClick={onContinue} className="rounded-md bg-[#212be9] px-3 py-2 text-sm font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4]">Continue to Apply Placements</button>
      </div>
    </>
  );
}

type ApplyRow = {
  id: string; status: "low" | "medium" | "high";
  subPlacement: string; channel: string; publisher: string;
  audience: string; adSize: string; creative: string; mediaCpm: string; language: string; geography: string;
};

const APPLY_ROWS: ApplyRow[] = [
  { id: "HKE239J", status: "medium", subPlacement: "Pandora_2025_Display_Q1", channel: "", publisher: "Google_DV360", audience: "Audience_Seg_01", adSize: "300x50", creative: "Standard_Banner", mediaCpm: "$12.50", language: "English", geography: "New_York" },
  { id: "HKE239K", status: "high", subPlacement: "Pandora_2025_Mobile_Q1", channel: "Display", publisher: "Google_DV360", audience: "Audience_Seg_02", adSize: "300x50", creative: "Standard_Banner", mediaCpm: "$8.20", language: "English", geography: "Los_Angeles" },
  { id: "HKE240J", status: "high", subPlacement: "Soundwave_2025_Audio_Q2", channel: "Audio", publisher: "Amazon_DSP", audience: "Audience_Seg_05", adSize: "320x50", creative: "Rich_Media", mediaCpm: "$15.00", language: "English", geography: "Chicago" },
  { id: "HKE241J", status: "high", subPlacement: "Streamline_2025_Video_Q1", channel: "Video", publisher: "TradeDesk", audience: "Audience_Seg_08", adSize: "728x90", creative: "Video_Pre_Roll", mediaCpm: "$22.40", language: "English", geography: "Houston" },
  { id: "HKE242J", status: "medium", subPlacement: "FitTrack_2025_Mobile_Q2", channel: "Mobile", publisher: "Meta_Ads", audience: "Audience_Seg_12", adSize: "300x600", creative: "Interactive", mediaCpm: "$18.75", language: "Spanish", geography: "" },
  { id: "HKE243J", status: "low", subPlacement: "", channel: "Display", publisher: "", audience: "Audience_Seg_03", adSize: "300x250", creative: "Standard_Banner", mediaCpm: "$9.80", language: "English", geography: "" },
  { id: "HKE244J", status: "medium", subPlacement: "TechSavvy_2025_Display_Q1", channel: "Display", publisher: "Google_DV360", audience: "Audience_Seg_15", adSize: "300x600", creative: "Native_Content", mediaCpm: "$14.30", language: "English", geography: "" },
];

const AP_CHANNEL_OPTS = ["Display", "Mobile", "Video", "Audio", "CTV", "Social", "Native"];
const AP_PUBLISHER_OPTS = ["Google_DV360", "Meta_Ads", "Amazon_DSP", "TradeDesk"];
const AP_AUDIENCE_OPTS = ["Audience_Seg_01", "Audience_Seg_02", "Audience_Seg_03", "Audience_Seg_05", "Audience_Seg_08", "Audience_Seg_12", "Audience_Seg_15"];
const AP_ADSIZE_OPTS = ["300x50", "300x250", "300x600", "320x50", "728x90"];
const AP_CREATIVE_OPTS = ["Standard_Banner", "Rich_Media", "Video_Pre_Roll", "Interactive", "Native_Content"];
const AP_LANG_OPTS = ["English", "Spanish", "French"];
const AP_GEO_OPTS = ["New_York", "Los_Angeles", "Chicago", "Houston", "San_Antonio", "San_Francisco"];
const AP_SUBPL_OPTS = ["Pandora_2025_Display_Q1", "Soundwave_2025_Audio_Q2", "Streamline_2025_Video_Q1", "FitTrack_2025_Mobile_Q2", "TechSavvy_2025_Display_Q1"];

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

function ApplyPlacementsSubStep({ onBack, onContinue, hasReuploaded, onValidChange }: { onBack: () => void; onContinue: () => void; hasReuploaded?: boolean; onValidChange?: (valid: boolean) => void }) {
  const [rows, setRows] = useState<ApplyRow[]>(APPLY_ROWS);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ApplyRow | null>(null);
  const [sortField, setSortField] = useState<keyof ApplyRow | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [bulkForm, setBulkForm] = useState<Partial<ApplyRow>>({});
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ rowIdx: number; field: keyof ApplyRow } | null>(null);

  const errorCount = rows.filter((r) => r.status === "low").length;
  const isValid = errorCount === 0;

  useEffect(() => {
    onValidChange?.(isValid);
  }, [isValid, onValidChange]);

  const isBulkMode = selectedRows.size > 0 && editingRow === null;
  const isEditMode = editingRow !== null && editForm !== null;
  const bulkFieldCount = Object.values(bulkForm).filter(Boolean).length;

  const recomputeStatus = (row: ApplyRow): ApplyRow["status"] => {
    const required: (keyof ApplyRow)[] = ["subPlacement", "channel", "publisher", "geography"];
    const filledCount = required.filter((f) => !!row[f]).length;
    if (filledCount === required.length) return "high";
    if (filledCount >= 2) return "medium";
    return "low";
  };

  const updateCell = (origIdx: number, field: keyof ApplyRow, value: string) => {
    setRows((prev) => prev.map((r, i) => {
      if (i !== origIdx) return r;
      const updated = { ...r, [field]: value };
      updated.status = recomputeStatus(updated);
      return updated;
    }));
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortField) return 0;
    const av = a[sortField].toLowerCase(); const bv = b[sortField].toLowerCase();
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const openEditPanel = (sortedIndex: number) => {
    const orig = rows.indexOf(sortedRows[sortedIndex]);
    setEditingRow(orig); setEditForm({ ...rows[orig] }); setSelectedRows(new Set()); setBulkForm({}); setPanelOpen(true);
  };
  const saveEdit = () => {
    if (editingRow === null || !editForm) return;
    setRows((prev) => prev.map((r, i) => {
      if (i !== editingRow) return r;
      const u = { ...editForm };
      u.status = recomputeStatus(u);
      return u;
    }));
    closePanel();
  };
  const applyBulkChanges = () => {
    if (bulkFieldCount === 0) return;
    setRows((prev) => prev.map((r, i) => {
      if (!selectedRows.has(i)) return r;
      const u = { ...r };
      if (bulkForm.channel) u.channel = bulkForm.channel;
      if (bulkForm.publisher) u.publisher = bulkForm.publisher;
      if (bulkForm.audience) u.audience = bulkForm.audience;
      if (bulkForm.adSize) u.adSize = bulkForm.adSize;
      if (bulkForm.creative) u.creative = bulkForm.creative;
      if (bulkForm.language) u.language = bulkForm.language;
      if (bulkForm.geography) u.geography = bulkForm.geography;
      u.status = recomputeStatus(u);
      return u;
    }));
    closePanel();
  };
  const closePanel = () => { setPanelOpen(false); setEditingRow(null); setEditForm(null); setSelectedRows(new Set()); setBulkForm({}); };
  const toggleSort = (field: keyof ApplyRow) => { if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSortField(field); setSortDir("asc"); } };
  const allRowsSelected = rows.length > 0 && selectedRows.size === rows.length;
  const someRowsSelected = selectedRows.size > 0 && selectedRows.size < rows.length;
  const toggleSelectAll = () => { if (allRowsSelected) { setSelectedRows(new Set()); setPanelOpen(false); } else { setSelectedRows(new Set(rows.map((_, i) => i))); setEditingRow(null); setEditForm(null); setPanelOpen(true); } };
  const toggleRowSelect = (idx: number) => { const next = new Set(selectedRows); if (next.has(idx)) next.delete(idx); else next.add(idx); setSelectedRows(next); setEditingRow(null); setEditForm(null); setPanelOpen(next.size > 0); };

  const SortHdr = ({ field, label }: { field: keyof ApplyRow; label: string }) => (
    <th className="cursor-pointer select-none whitespace-nowrap px-3 py-3 text-left text-sm font-medium text-[#64748b]" onClick={() => toggleSort(field)}>
      <span className="inline-flex items-center gap-1">{label} <ArrowUpDown className={`size-3 ${sortField === field ? "text-[#1f2430]" : ""}`} /></span>
    </th>
  );

  return (
    <>
      {/* File summary banner */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-white px-5 py-3.5">
        <div>
          <p className="text-sm font-semibold text-[#1f2430]">{hasReuploaded ? "QSR_Q2_2026_v2" : "QSR_Q2_2026"}</p>
          <p className="text-xs text-[#6b7280]">Uploaded by Sang Yeo</p>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1 text-sm"><Check className="size-4 text-[#16a34a]" /><span className="font-medium text-[#16a34a]">{rows.filter((r) => r.status === "high").length + 103} High</span></span>
          <span className="flex items-center gap-1 text-sm"><CircleAlert className="size-4 text-[#f59e0b]" /><span className="font-medium text-[#f59e0b]">{rows.filter((r) => r.status === "medium").length} Medium</span></span>
          <span className="flex items-center gap-1 text-sm"><CircleAlert className="size-4 text-[#dc2626]" /><span className="font-medium text-[#dc2626]">{rows.filter((r) => r.status === "low").length} Low</span></span>
          <span className="text-sm font-semibold text-[#1f2430]">{rows.length + 106} Total Placements</span>
        </div>
      </div>

      {/* Results count + search */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-[#1f2430]">
            <span className="text-[#6b7280]">Showing </span><span className="font-medium">{rows.length}</span><span className="text-[#6b7280]"> of </span><span className="font-medium">{rows.length}</span><span className="text-[#6b7280]"> results</span>
            {selectedRows.size > 0 && <span className="ml-2 text-[#2d46f6]">({selectedRows.size} selected)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex w-[200px] items-center rounded-md border border-border bg-white px-3 py-2">
            <Search className="mr-2 size-4 text-[#64748b]" />
            <input type="text" placeholder="Search" className="w-full bg-transparent text-sm text-[#1f2430] outline-none placeholder:text-[#64748b]" />
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-2 text-sm text-[#1f2430] hover:bg-gray-50">
            <SlidersHorizontal className="size-4 text-[#64748b]" />Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="w-10 px-3 py-3">
                <input type="checkbox" checked={allRowsSelected} ref={(el) => { if (el) el.indeterminate = someRowsSelected; }} onChange={toggleSelectAll} className="size-4 rounded border-gray-300 accent-[#2d46f6]" />
              </th>
              <SortHdr field="status" label="Status" />
              <SortHdr field="subPlacement" label="Sub Placement" />
              <SortHdr field="channel" label="Channel" />
              <SortHdr field="publisher" label="Publisher" />
              <SortHdr field="audience" label="Audience" />
              <SortHdr field="adSize" label="Ad Size" />
              <SortHdr field="creative" label="Creative" />
              <SortHdr field="mediaCpm" label="Media CPM" />
              <SortHdr field="language" label="Language" />
              <SortHdr field="geography" label="Geography" />
              <th className="px-3 py-3 text-left text-sm font-medium text-[#64748b]">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => {
              const origIdx = rows.indexOf(row);
              const editable: { field: keyof ApplyRow; maxW?: string; options?: string[] }[] = [
                { field: "subPlacement", maxW: "max-w-[160px]" },
                { field: "channel", options: AP_CHANNEL_OPTS },
                { field: "publisher", options: AP_PUBLISHER_OPTS },
                { field: "audience", options: AP_AUDIENCE_OPTS },
                { field: "adSize", options: AP_ADSIZE_OPTS },
                { field: "creative", options: AP_CREATIVE_OPTS },
                { field: "mediaCpm" },
                { field: "language", options: AP_LANG_OPTS },
                { field: "geography", options: AP_GEO_OPTS },
              ];
              return (
                <tr key={row.id} className={`border-b border-border ${selectedRows.has(origIdx) ? "bg-[#f8f9ff]" : ""}`}>
                  <td className="w-10 px-3 py-3"><input type="checkbox" checked={selectedRows.has(origIdx)} onChange={() => toggleRowSelect(origIdx)} className="size-4 rounded border-gray-300 accent-[#2d46f6]" /></td>
                  <td className="px-3 py-3">
                    {row.status === "low" ? <Badge className="bg-red-50 text-[#dc2626]">Low</Badge> : row.status === "high" ? <Badge className="bg-green-50 text-[#389e45]">High</Badge> : <Badge className="bg-orange-50 text-[#f59e0b]">Medium</Badge>}
                  </td>
                  {editable.map(({ field, maxW, options }) => {
                    const isEditing = editingCell?.rowIdx === origIdx && editingCell?.field === field;
                    const val = row[field];
                    if (isEditing) {
                      if (options) {
                        return (
                          <td key={field} className="px-3 py-1.5">
                            <InlineComboCell
                              value={val}
                              options={options}
                              onCommit={(v) => { updateCell(origIdx, field, v); setEditingCell(null); }}
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
                            onBlur={(e) => { updateCell(origIdx, field, e.target.value); setEditingCell(null); }}
                            onKeyDown={(e) => { if (e.key === "Enter") { updateCell(origIdx, field, (e.target as HTMLInputElement).value); setEditingCell(null); } if (e.key === "Escape") setEditingCell(null); }}
                            className={`w-full rounded border bg-white px-2 py-1 text-sm text-[#1f2430] outline-none focus:border-[#2d46f6] focus:ring-1 focus:ring-[#2d46f6] ${maxW || ""} ${!val ? "border-[#dc2626]" : "border-border"}`}
                          />
                        </td>
                      );
                    }
                    return (
                      <td
                        key={field}
                        onClick={() => setEditingCell({ rowIdx: origIdx, field })}
                        className={`group/cell cursor-pointer px-3 py-3 text-sm text-[#1f2430] transition-colors hover:bg-[#f1f5f9] ${maxW ? maxW + " truncate" : ""}`}
                      >
                        <span className="flex items-center gap-1">
                          {val || <span className="text-[#dc2626]">—</span>}
                          <SquarePen className="size-3 shrink-0 text-[#94a3b8] opacity-0 transition-opacity group-hover/cell:opacity-100" />
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-3"><button onClick={() => openEditPanel(i)} className="text-sm font-medium text-[#2d46f6] hover:underline">edit</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Side Panel */}
      <div className={`fixed inset-y-0 right-0 z-40 w-[400px] transform border-l border-border bg-white shadow-[-4px_0_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-in-out ${panelOpen && (isEditMode || isBulkMode) ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            {isEditMode && editForm && (
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-semibold text-[#1f2430]">Edit Placement</h3>
                {editForm.status === "low" ? <Badge className="bg-red-50 text-[#dc2626]">Low</Badge> : editForm.status === "high" ? <Badge className="bg-green-50 text-[#389e45]">High</Badge> : <Badge className="bg-orange-50 text-[#f59e0b]">Medium</Badge>}
              </div>
            )}
            {isBulkMode && <h3 className="text-base font-semibold text-[#1f2430]">Bulk Edit ({selectedRows.size})</h3>}
            <button onClick={closePanel} className="rounded-full p-1.5 text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#1f2430]"><X className="size-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {isBulkMode && <p className="mb-4 text-sm text-[#6b7280]">Set values below to apply to all {selectedRows.size} selected placements.</p>}
            <div className="flex flex-col gap-4">
              {([
                { label: "Sub Placement", field: "subPlacement" as const, options: AP_SUBPL_OPTS, editOnly: true },
                { label: "Channel", field: "channel" as const, options: AP_CHANNEL_OPTS, editOnly: false },
                { label: "Publisher", field: "publisher" as const, options: AP_PUBLISHER_OPTS, editOnly: false },
                { label: "Audience", field: "audience" as const, options: AP_AUDIENCE_OPTS, editOnly: false },
                { label: "Ad Size", field: "adSize" as const, options: AP_ADSIZE_OPTS, editOnly: false },
                { label: "Creative", field: "creative" as const, options: AP_CREATIVE_OPTS, editOnly: false },
                { label: "Media CPM", field: "mediaCpm" as const, options: [] as string[], editOnly: true },
                { label: "Language", field: "language" as const, options: AP_LANG_OPTS, editOnly: false },
                { label: "Geography", field: "geography" as const, options: AP_GEO_OPTS, editOnly: false },
              ] as const).map(({ label, field, options, editOnly }) => {
                if (isBulkMode && editOnly) return null;
                if (isEditMode && editForm) {
                  if (options.length === 0) {
                    return (
                      <div key={field} className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#1f2430]">{label}</label>
                        <input type="text" value={editForm[field]} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} className="w-full rounded-md border border-border bg-white py-2 pl-3 pr-3 text-sm text-[#1f2430] outline-none focus:border-[#2d46f6]" placeholder={`Enter ${label.toLowerCase()}...`} />
                      </div>
                    );
                  }
                  return (
                    <div key={field} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#1f2430]">{label}</label>
                      <div className="relative">
                        <select value={editForm[field]} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} className={`w-full appearance-none rounded-md border bg-white py-2 pl-3 pr-9 text-sm text-[#1f2430] outline-none focus:border-[#2d46f6] ${!editForm[field] ? "border-[#dc2626]" : "border-border"}`}>
                          <option value="">Select...</option>
                          {options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                      </div>
                    </div>
                  );
                }
                if (isBulkMode) {
                  return (
                    <div key={field} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#1f2430]">{label}</label>
                      <div className="relative">
                        <select value={bulkForm[field] ?? ""} onChange={(e) => setBulkForm({ ...bulkForm, [field]: e.target.value || undefined })} className={`w-full appearance-none rounded-md border bg-white py-2 pl-3 pr-9 text-sm outline-none focus:border-[#2d46f6] ${bulkForm[field] ? "border-[#2d46f6] text-[#1f2430]" : "border-border text-[#64748b]"}`}>
                          <option value="">— No change —</option>
                          {options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="border-t border-border px-5 py-4">
            {isEditMode && (
              <div className="flex items-center justify-end gap-3">
                <button onClick={closePanel} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-[#1f2430] hover:bg-gray-50">Cancel</button>
                <button onClick={saveEdit} className="rounded-lg bg-[#2d46f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2438d4]">Save Changes</button>
              </div>
            )}
            {isBulkMode && (
              <div className="flex items-center justify-end gap-3">
                <button onClick={closePanel} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-[#1f2430] hover:bg-gray-50">Cancel</button>
                <button onClick={applyBulkChanges} disabled={bulkFieldCount === 0} className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${bulkFieldCount > 0 ? "bg-[#2d46f6] hover:bg-[#2438d4]" : "cursor-not-allowed bg-[#a0aec0]"}`}>Apply to {selectedRows.size} Rows</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-4 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">Back</button>
        <button onClick={onContinue} disabled={!isValid} className="rounded-md bg-[#212be9] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50">Continue to Review</button>
      </div>
    </>
  );
}

const PIXEL_AD_SERVER_OPTIONS = ["CM360", "DV360", "Google Campaign Manager", "Sizmek", "Flashtalking", "Innovid", "Extreme Reach"];
const SINGLE_PIXEL_TYPE_OPTIONS = ["In-App", "Cross-Device / CTV", "Cross-Device Redirect"];
const PIXEL_TAG_IMPLEMENTATION_OPTIONS = ["Partner", "Agency", "Both"];

type SinglePixelRow = {
  id: string;
  partner: string;
  mediaChannel: string;
  tagImplementation: string | null;
  adServers: string[];
};

const INITIAL_SINGLE_PIXEL_ROWS: SinglePixelRow[] = [
  { id: "spx-1", partner: "Viant", mediaChannel: "Display", tagImplementation: null, adServers: [] },
  { id: "spx-2", partner: "Viant", mediaChannel: "Mobile", tagImplementation: null, adServers: [] },
];

function SingleMultiSelectDropdown({ options, selected, onChange, placeholder, hasWarning }: {
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
        className={`flex min-h-[36px] min-w-[220px] max-w-[340px] items-center justify-between rounded-md border bg-white px-3 py-1.5 text-left text-sm transition-colors ${hasWarning && selected.length === 0 ? "border-[#ef4444]" : open ? "border-[#212be9] ring-1 ring-[#212be9]" : "border-[#e2e8f0]"}`}
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

function DataIngestionStep({ partnerName, onBack, onContinue }: {
  partnerName: string; onBack: () => void; onContinue: () => void;
}) {
  const [rows, setRows] = useState<SinglePixelRow[]>(
    INITIAL_SINGLE_PIXEL_ROWS.map(row => ({ ...row, partner: partnerName || "Viant" }))
  );
  const [selectAllOpen, setSelectAllOpen] = useState<Record<string, boolean>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      Object.entries(dropdownRefs.current).forEach(([id, ref]) => {
        if (ref && !ref.contains(e.target as Node)) {
          setSelectAllOpen((prev) => ({ ...prev, [id]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateAdServers = (id: string, servers: string[]) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, adServers: servers } : r)));
  };

  const updateTagImplementation = (id: string, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, tagImplementation: value, adServers: value === "Partner" ? [] : r.adServers } : r)));
  };

  const toggleAdServer = (id: string, server: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const hasServer = row.adServers.includes(server);
    const newServers = hasServer ? row.adServers.filter((s) => s !== server) : [...row.adServers, server];
    updateAdServers(id, newServers);
  };

  const selectAllServers = (id: string) => {
    updateAdServers(id, [...PIXEL_AD_SERVER_OPTIONS]);
    setSelectAllOpen((prev) => ({ ...prev, [id]: false }));
  };

  const resetServers = (id: string) => {
    updateAdServers(id, []);
    setSelectAllOpen((prev) => ({ ...prev, [id]: false }));
  };

  const isValid = rows.every((r) => r.tagImplementation && (r.tagImplementation === "Partner" || r.adServers.length > 0));

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#020617]">Pixel Generation</h2>
        <p className="mt-1 text-sm leading-5 text-[#646464]">Confirm or update the ad server for the media partner before generating pixels.</p>
      </div>

      <div className="mb-6 h-px w-full bg-[#e2e8f0]" />

      <Alert className="mb-6 border-[#bfdbfe] bg-[#eff6ff]">
        <Info className="size-4 text-[#3b82f6]" />
        <AlertTitle className="text-[#1e40af]">Review ad server assignment</AlertTitle>
        <AlertDescription className="text-[#1e40af]/80">Ensure the partner has the correct ad server and pixel type selected. You can update selections before proceeding.</AlertDescription>
      </Alert>
          <div className="mb-6 overflow-visible rounded-xl border border-[#e2e8f0]">
            <table className="w-full overflow-visible">
              <thead className="overflow-visible">
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#64748b]">Partner</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#64748b]">Media Channel</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#64748b]">Tag Implementation</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#64748b]">Ad Server</th>
                </tr>
              </thead>
              <tbody className="overflow-visible">
                {rows.map((row) => {
                  const isPartnerImplementing = row.tagImplementation === "Partner";
                  return (
                    <tr key={row.id} className="border-b border-[#e2e8f0] last:border-b-0">
                      <td className="px-4 py-3 text-sm font-medium text-[#020617]">{row.partner}</td>
                      <td className="px-4 py-3 text-sm text-[#64748b]">{row.mediaChannel}</td>
                      <td className="px-4 py-3">
                        <Select value={row.tagImplementation || undefined} onValueChange={(val) => updateTagImplementation(row.id, val)}>
                          <SelectTrigger className={`w-full ${row.tagImplementation ? "" : "border-[#ef4444]"}`} size="sm">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {PIXEL_TAG_IMPLEMENTATION_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        {isPartnerImplementing ? (
                          <span className="text-sm text-[#9ca3af]">—</span>
                        ) : (
                          <div className="relative" ref={(el) => (dropdownRefs.current[row.id] = el)}>
                            <div
                              className={`flex min-h-[40px] w-full items-center gap-2 rounded-md border px-3 py-2 ${
                                row.tagImplementation && row.tagImplementation !== "Partner" && row.adServers.length === 0 ? "border-[#ef4444]" : "border-[#e2e8f0]"
                              }`}
                            >
                              <div className="flex flex-1 flex-wrap items-center gap-1.5">
                                {row.adServers.length > 0 ? (
                                  row.adServers.map((server) => (
                                    <div
                                      key={server}
                                      className="flex items-center gap-1 rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-xs font-medium text-[#334155]"
                                    >
                                      <span>{server}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleAdServer(row.id, server);
                                        }}
                                        className="rounded-full hover:bg-[#e2e8f0]"
                                      >
                                        <X className="size-3" />
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-sm text-[#9ca3af]">Select ad servers...</span>
                                )}
                              </div>
                              <button
                                onClick={() => setSelectAllOpen((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
                                className="shrink-0"
                              >
                                <ChevronDown className="size-4 text-[#64748b]" />
                              </button>
                            </div>
                            {selectAllOpen[row.id] && (
                              <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-[#e2e8f0] bg-white shadow-lg">
                                <div className="flex items-center justify-between border-b border-[#e2e8f0] px-3 py-2">
                                  <button onClick={() => selectAllServers(row.id)} className="text-xs font-medium text-[#212be9] hover:underline">
                                    Select All
                                  </button>
                                  <button onClick={() => resetServers(row.id)} className="text-xs font-medium text-[#ef4444] hover:underline">
                                    Reset
                                  </button>
                                </div>
                                <div className="p-2">
                                  {PIXEL_AD_SERVER_OPTIONS.map((server) => (
                                    <label key={server} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-[#f8fafc]">
                                      <Checkbox
                                        checked={row.adServers.includes(server)}
                                        onCheckedChange={() => toggleAdServer(row.id, server)}
                                        className="data-[state=checked]:bg-[#212be9] data-[state=checked]:border-[#212be9]"
                                      />
                                      <span className="text-[#020617]">{server}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
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
            <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-4 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">Back</button>
            <button onClick={onContinue} disabled={!isValid} className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4] disabled:cursor-not-allowed disabled:opacity-50">Continue to Review & Submit</button>
          </div>
    </>
  );
}
function ReviewStep({ campaignName, measurementBudget, metric, partnerName, partnerData, fundingVisits, fundingSalesImpact, authorized, onAuthorizedChange, onBack, onSubmitted, onEditStep }: {
  campaignName: string; measurementBudget: string; metric: string;
  partnerName: string;
  partnerData: Record<string, string>;
  fundingVisits: string; fundingSalesImpact: string;
  authorized: boolean; onAuthorizedChange: (v: boolean) => void;
  onBack: () => void;
  onSubmitted: () => void;
  onEditStep: (step: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [comments, setComments] = useState("");

  // Internal Campaign Name sections
  const [internalAdvertiser, setInternalAdvertiser] = useState("QSR Brand");
  const [internalLOB, setInternalLOB] = useState("N/A");
  const [internalReportType, setInternalReportType] = useState("SPR");
  const [internalPartner, setInternalPartner] = useState(partnerName || "Viant");
  const [internalCountry, setInternalCountry] = useState("National");
  const [internalMarket, setInternalMarket] = useState("N/A");
  const [internalAudienceTarget, setInternalAudienceTarget] = useState("N/A");
  const [internalYear, setInternalYear] = useState("2026");
  const [internalTimeframe, setInternalTimeframe] = useState("Q2");
  const [internalChannel, setInternalChannel] = useState("Digital");
  const [internalConversionMetric, setInternalConversionMetric] = useState("Both");
  const [internalWildcard1, setInternalWildcard1] = useState("N/A");
  const [internalWildcard2, setInternalWildcard2] = useState("N/A");

  type ReviewField = { 
    key: string; 
    label: string; 
    value: string; 
    required: boolean; 
    type: "text" | "currency" | "number" | "link" | "date-range";
    editable?: boolean;
  };

  const generateInternalCampaignName = () => {
    const advertiser = "QSR Brand";
    const lob = "N/A";
    const reportType = "SPR";
    const partner = partnerName || "Viant";
    
    let country = "National";
    
    const market = "N/A";
    const audienceTarget = "N/A";
    
    let year = "2026";
    let timeframe = "Q2";
    
    const channel = "Digital";
    
    let conversionMetric = "Both";
    if (metric) {
      if (metric.toLowerCase().includes("visits") && metric.toLowerCase().includes("sales")) {
        conversionMetric = "Both";
      } else if (metric.toLowerCase().includes("visits")) {
        conversionMetric = "Visits";
      } else if (metric.toLowerCase().includes("sales")) {
        conversionMetric = "Sales";
      }
    }
    
    const wildcard1 = "N/A";
    const wildcard2 = "N/A";

    return `${advertiser}_${lob}_${reportType}_${partner}_${country}_${market}_${audienceTarget}_${year}_${timeframe}_${channel}_${conversionMetric}_${wildcard1}_${wildcard2}`;
  };

  const [fields, setFields] = useState<ReviewField[]>([
    { key: "campaignName", label: "Campaign Name", value: campaignName || "QSR Q2 2026", required: true, type: "text", editable: true },
    { key: "campaignNameInternal", label: "Campaign Name (Internal Only)", value: generateInternalCampaignName(), required: false, type: "text", editable: false },
    { key: "advertiser", label: "Advertiser", value: "QSR Brand", required: true, type: "text", editable: true },
    { key: "agency", label: "Agency", value: partnerData["Agency or Site Served"] || "Starcom", required: true, type: "text", editable: true },
    { key: "campaignPeriod", label: "Campaign Period", value: "Apr 1, 2026 – Jun 30, 2026", required: true, type: "date-range", editable: true },
    { key: "storeChains", label: "Store Chains to be Measured", value: "QSR Brand US", required: true, type: "text", editable: true },
    { key: "country", label: "Country", value: "United States", required: true, type: "text", editable: true },
    { key: "geoScope", label: "Geographical Scope", value: "National", required: true, type: "text", editable: true },
    { key: "conversionType", label: "Conversion Type", value: metric || "Visits and Sales Impact", required: true, type: "text", editable: true },
    { key: "totalSpend", label: "Total Estimated Ad Spend", value: measurementBudget ? `$${measurementBudget}` : "$380,000", required: true, type: "currency", editable: true },
    { key: "totalImpressions", label: "Total Estimated Impressions", value: partnerData["Estimated Impressions"] || "5,000,000", required: true, type: "number", editable: true },

    { key: "sfOpportunity", label: "Salesforce Opportunity ID", value: "https://foursquare.lightning.force.com/lightning/r/Opportunity/006Hs00001026QSR/view", required: true, type: "link", editable: true },
  ]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingKey && editRef.current) editRef.current.focus();
  }, [editingKey]);

  const startEdit = (field: ReviewField) => {
    if (submitted || field.editable === false) return;
    setEditingKey(field.key);
    setEditValue(field.value);
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const commitEdit = (key: string) => {
    setFields((prev) => {
      const updated = prev.map((f) => f.key === key ? { ...f, value: editValue.trim() } : f);
      
      // Regenerate internal campaign name after any field change
      const advertiser = "QSR Brand";
      const lob = "N/A";
      const reportType = "SPR";
      const partner = partnerName || "Viant";
      
      let country = "National";
      
      const market = "N/A";
      const audienceTarget = "N/A";
      
      let year = "2026";
      let timeframe = "Q2";
      
      const channel = "Digital";
      
      let conversionMetric = "Both";
      const conversionTypeField = updated.find((f) => f.key === "conversionType");
      if (conversionTypeField?.value) {
        if (conversionTypeField.value.toLowerCase().includes("visits") && conversionTypeField.value.toLowerCase().includes("sales")) {
          conversionMetric = "Both";
        } else if (conversionTypeField.value.toLowerCase().includes("visits")) {
          conversionMetric = "Visits";
        } else if (conversionTypeField.value.toLowerCase().includes("sales")) {
          conversionMetric = "Sales";
        }
      }
      
      const wildcard1 = "N/A";
      const wildcard2 = "N/A";

      const newInternalName = `${advertiser}_${lob}_${reportType}_${partner}_${country}_${market}_${audienceTarget}_${year}_${timeframe}_${channel}_${conversionMetric}_${wildcard1}_${wildcard2}`;
      
      return updated.map((f) => f.key === "campaignNameInternal" ? { ...f, value: newInternalName } : f);
    });
    setEditingKey(null);
    setEditValue("");
  };
  const cancelEdit = () => { setEditingKey(null); setEditValue(""); };
  const handleEditKeyDown = (e: React.KeyboardEvent, key: string) => {
    if (e.key === "Enter") { e.preventDefault(); commitEdit(key); }
    else if (e.key === "Escape") cancelEdit();
  };

  const missingRequired = fields.filter((f) => f.required && !f.value.trim());
  const allFieldsValid = missingRequired.length === 0;
  const canSubmit = allFieldsValid && authorized;

  // Dropdown options for internal campaign name sections
  const ADVERTISER_OPTIONS = ["QSR Brand", "McDonalds", "Starbucks", "Target", "N/A"];
  const LOB_OPTIONS = ["N/A", "Electronics", "Food & Beverage", "Retail", "Automotive"];
  const REPORT_TYPE_OPTIONS = ["SPR", "DV360", "Custom"];
  const PARTNER_OPTIONS = ["Viant", "DV360", "N/A", "A Code Media", "A&E", "A&E (Linear TV)", "ABC (Linear TV)", "Acast", "Adams Outdoor", "Adelphic", "AdsMovil", "AdTheorent", "Amazon", "Ampersand", "Animal Planet", "Atmosphere", "Audacy", "Azerion", "Azteca America", "B Code Media", "Barstool Sports", "BBC America (Linear TV)"];
  const COUNTRY_OPTIONS = ["National", "United States", "Canada", "Mexico", "N/A"];
  const MARKET_OPTIONS = ["N/A", "Northeast", "Southeast", "Midwest", "Southwest", "West", "National & Local"];
  const AUDIENCE_TARGET_OPTIONS = ["N/A", "General", "Premium", "Custom"];
  const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
  const TIMEFRAME_OPTIONS = ["Q1", "Q2", "Q3", "Q4", "H1", "H2", "Full Year"];
  const CHANNEL_OPTIONS = ["Digital", "TV", "Radio", "Print", "OOH", "Multi-Channel"];
  const CONVERSION_METRIC_OPTIONS = ["Both", "Visits", "Sales", "N/A"];
  const WILDCARD_OPTIONS = ["N/A", "Test", "Pilot", "Expansion"];

  const updateInternalCampaignName = () => {
    const newValue = `${internalAdvertiser}_${internalLOB}_${internalReportType}_${internalPartner}_${internalCountry}_${internalMarket}_${internalAudienceTarget}_${internalYear}_${internalTimeframe}_${internalChannel}_${internalConversionMetric}_${internalWildcard1}_${internalWildcard2}`;
    setFields((prev) => prev.map((f) => f.key === "campaignNameInternal" ? { ...f, value: newValue } : f));
  };

  useEffect(() => {
    updateInternalCampaignName();
  }, [internalAdvertiser, internalLOB, internalReportType, internalPartner, internalCountry, internalMarket, internalAudienceTarget, internalYear, internalTimeframe, internalChannel, internalConversionMetric, internalWildcard1, internalWildcard2]);

  const formatDisplayValue = (field: ReviewField) => {
    if (!field.value.trim()) return null;

    if (field.key === "campaignNameInternal") {
      return (
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1">
            <Select value={internalAdvertiser} onValueChange={setInternalAdvertiser}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[90px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADVERTISER_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalLOB} onValueChange={setInternalLOB}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOB_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalReportType} onValueChange={setInternalReportType}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalPartner} onValueChange={setInternalPartner}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[100px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARTNER_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalCountry} onValueChange={setInternalCountry}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[80px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalMarket} onValueChange={setInternalMarket}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKET_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalAudienceTarget} onValueChange={setInternalAudienceTarget}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUDIENCE_TARGET_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalYear} onValueChange={setInternalYear}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalTimeframe} onValueChange={setInternalTimeframe}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[50px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalChannel} onValueChange={setInternalChannel}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[70px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHANNEL_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalConversionMetric} onValueChange={setInternalConversionMetric}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONVERSION_METRIC_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalWildcard1} onValueChange={setInternalWildcard1}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WILDCARD_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#94a3b8]">_</span>
            <Select value={internalWildcard2} onValueChange={setInternalWildcard2}>
              <SelectTrigger size="sm" className="h-7 w-auto min-w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WILDCARD_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => copyToClipboard(field.value, field.key)}
              className="ml-2 shrink-0 rounded p-1 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#020617]"
              title="Copy to clipboard"
            >
              {copiedField === field.key ? (
                <Check className="size-3.5 text-[#16a34a]" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        </div>
      );
    }

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
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      onSubmitted();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-[#f0fdf4]">
          <Check className="size-8 text-[#16a34a]" />
        </div>
        <h2 className="text-2xl font-semibold text-[#020617]">Campaign Submitted Successfully</h2>
        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed text-[#6b7280]">
          Our AdOps team is reviewing your setup and generating your tracking pixel(s). You can track the status of your pixel generation in real-time here: <a href="https://foursquare.atlassian.net/browse/PIX-4827" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-[#212be9] hover:underline">PIX-4827 C <ExternalLink className="inline size-3" /></a>.
        </p>
        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed text-[#6b7280]">
          Once your pixel(s) are ready, they will be sent to the appropriate parties for implementation. Estimated turnaround: 1-2 business days.
        </p>
        <Button variant="outline" size="lg" asChild className="mt-8">
          <Link href="/projects/app/attribution">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[#020617]">Review &amp; Submit</h2>
        </div>
        <div className="mt-1 text-sm leading-5 text-[#646464]">
          <p>Review your campaign summary below. Click the pencil icon to edit any field inline.</p>
          <p>Once a campaign is approved, an account representative will get in touch to finalize details and set up billing.</p>
        </div>
      </div>

      {missingRequired.length > 0 && (
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
                <div key={field.key} className="group flex min-h-[48px] items-center px-4 py-3">
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
                      <button onClick={() => startEdit(field)} className="flex flex-1 items-center">
                        <span className="rounded-md border border-dashed border-[#dc2626] bg-[#fef2f2] px-3 py-1.5 text-sm text-[#dc2626]">Enter {field.label.toLowerCase()}</span>
                      </button>
                    ) : field.key === "campaignNameInternal" ? (
                      formatDisplayValue(field)
                    ) : (
                      <>
                        <div className="flex-1">{formatDisplayValue(field)}</div>
                        {field.editable !== false && (
                          <button onClick={() => startEdit(field)} className="rounded p-1 text-[#9ca3af] opacity-0 transition-opacity hover:bg-[#f1f5f9] hover:text-[#020617] group-hover:opacity-100">
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
            onChange={(e) => onAuthorizedChange(e.target.checked)}
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
          <button onClick={onBack} className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-4 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#ebf1ff]">Back</button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors ${
              submitting ? "cursor-wait bg-[#212be9]/80" : canSubmit ? "bg-[#212be9] hover:bg-[#1a22c4]" : "cursor-not-allowed bg-[#212be9]/50"
            }`}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? "Submitting..." : "Submit Campaign"}
          </button>
        </div>
      ) : (
        <div className="flex items-center py-4">
          <Link href="/attribution" className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-[#1a22c4]">Back to Dashboard</Link>
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

  const handleClickUploadZone = () => {
    setFileName("MediaPlan_QSR_2026.xlsx");
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
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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
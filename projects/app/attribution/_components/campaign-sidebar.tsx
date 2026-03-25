"use client";

import { Check, CircleDashed, Loader2, Upload, Download, X, CircleAlert } from "lucide-react";

export type SidebarStep = {
  key: string;
  label: string;
};

export function CampaignSidebar({ steps, currentStep, completedSteps, warningSteps, errorSteps, disabledSteps, onStepClick, hasUploadedFile, fileName, onUpload, isUploading, disabled }: {
  steps: SidebarStep[];
  currentStep: string;
  completedSteps: string[];
  warningSteps?: string[];
  errorSteps?: string[];
  disabledSteps?: string[];
  onStepClick: (step: string) => void;
  hasUploadedFile?: boolean;
  fileName?: string;
  onUpload?: () => void;
  isUploading?: boolean;
  disabled?: boolean;
}) {
  return (
    <aside className={`w-[280px] shrink-0 transition-opacity ${disabled ? "pointer-events-none opacity-40" : ""}`}>
      <nav className="space-y-2">
        {steps.map((step) => {
          const isActive = step.key === currentStep;
          const isDone = completedSteps.includes(step.key);
          const isWarning = warningSteps?.includes(step.key);
          const isError = errorSteps?.includes(step.key);
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
                isWarning
                  ? <Loader2 className="size-4 animate-spin text-[#f59e0b]" />
                  : <CircleDashed className="size-4 text-[#020617]" />
              )}
            </button>
          );
        })}
      </nav>

      {onUpload && (
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
                    <p className="text-sm font-medium text-black">{fileName || "Carta/Mcdonalds2024"}</p>
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
      )}
    </aside>
  );
}

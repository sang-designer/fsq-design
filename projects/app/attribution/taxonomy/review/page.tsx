"use client";

import { Check, CircleDashed, Download, Upload, SquarePen, Info, X, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SIDEBAR_STEPS = [
  { label: "Campaign Details", done: true },
  { label: "Partner Details", done: true },
  { label: "Pixel Generation", done: true },
  { label: "Placement Details", done: true },
  { label: "Review and Submit", done: false, active: true },
];

const STEP_ROUTES = [
  "/attribution/new?step=campaign",
  "/attribution/new?step=partner",
  "/attribution/new?step=pixel",
  "/attribution/taxonomy",
  null, // current page
];

const CAMPAIGN_DETAILS = [
  { label: "Campaign Name", value: "McDonalds Q1-Q2 2025" },
  { label: "Advertiser", value: "McDonalds" },
  { label: "Agency", value: "Starcom Worldwide" },
  { label: "Flight Date", value: "01/15/2025 - 06/30/2025" },
  { label: "Store chains to be measured", value: "McDonalds US" },
  { label: "Country", value: "United States" },
  { label: "Geographical Location", value: "National: All US Markets" },
  { label: "Media Types", values: [{ text: "Display", count: 13 }, { text: "Online Video", count: 8 }, { text: "Audio", count: 2 }] },
  { label: "Conversion type", value: "Visits and Sales Impact" },
  { label: "Ad Server", value: "CM360, DV360" },
  { label: "Total Est. Ad Spend", value: "$30,000,000" },
  { label: "Total Est. Impressions", value: "240,000,000" },
  { label: "Number of Partners", value: "12" },
  { label: "Salesforce Opportunity ID Link", link: { text: "P12345678", href: "#" } },
];

const MEDIA_PARTNERS = [
  { name: "VIANT", fundingSource: "Starcom", fundingEmail: "starcom@email...", mediaType: "Display +4", conversionType: "Visits and Sales...", startDate: "01/15/2025", endDate: "06/30/2025" },
  { name: "Adtheorent", fundingSource: "Adtheorent LTD", fundingEmail: "starcom@email...", mediaType: "CTV", conversionType: "Visits and Sales...", startDate: "02/01/2025", endDate: "05/31/2025" },
];

export default function ReviewPage() {
  const router = useRouter();
  const [comments, setComments] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [uploadBannerDismissed, setUploadBannerDismissed] = useState(false);
  const [placementValid] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("placement-valid") === "1";
    return false;
  });

  const handleSubmit = () => {
    if (!agreed || submitting || submitted) return;
    setSubmitting(true);
    setSubmitError(false);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setShowToast(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowToast(false), 5000);
    }, 2000);
  };

  const progressPercent = submitted ? 100 : 80;

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <header className="flex h-14 items-center justify-between border-b border-[#e0e0e0] bg-white px-12">
        <div className="flex items-center gap-16">
          <Link href="/attribution" className="flex items-center gap-0.5 font-mono text-lg font-medium text-[#000033] no-underline">
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

      <div className="sticky top-0 z-30 bg-white">
        <div className="flex items-center justify-between px-12 py-2.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-[#020617]">McDonalds Q1-Q2 2025</h1>
              <span className="rounded-full bg-[#ebf1ff] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#212be9]">{progressPercent}%</span>
              {submitted && (
                <button onClick={() => router.push("/attribution?submitted=mcdonalds-q1-q2-2025")} className="rounded-md bg-[#212be9] px-3 py-1 text-sm font-medium text-white hover:bg-[#1a22c4] transition-colors">Back to Main</button>
              )}
            </div>
            {!submitted && (
              <div className="flex items-center gap-4">
                <button className="px-2 py-1 text-sm font-medium text-[#dc2626]">Remove</button>
                <button className="px-2 py-1 text-sm font-medium text-[#212be9]">Save Draft</button>
              </div>
            )}
          </div>
        </div>
        <div className="h-[2px] w-full bg-[#ebf1ff]"><div className="h-full bg-[#212be9] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} /></div>
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

      {submitError && (
        <div className="mt-6 flex w-full items-center gap-3 rounded-lg border border-[#dc2626] bg-[#fef2f2] px-12 py-3">
          <Info className="size-5 text-[#dc2626]" />
          <p className="flex-1 text-sm font-medium text-[#020617]">There was an error submitting your campaign. Please try again.</p>
          <button onClick={() => setSubmitError(false)} className="p-1 text-[#8d8d8d] hover:text-[#020617]">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="flex w-full gap-6 px-12 py-6">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0">
          <nav className="space-y-2">
            {SIDEBAR_STEPS.map((step, i) => {
              const isDone = step.done || (step.active && submitted);
              const isActive = step.active && !submitted;
              return (
              <button
                key={step.label}
                disabled={submitted}
                onClick={() => {
                  if (submitted) return;
                  const route = STEP_ROUTES[i];
                  if (route) router.push(route);
                }}
                className={`flex w-full items-center gap-2.5 rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
                  submitted
                    ? "cursor-not-allowed text-[#94a3b8]"
                    : step.active ? "bg-[#ebf1ff] text-[#020617]" : "text-[#020617] hover:bg-gray-50"
                }`}
              >
                <span className="flex-1 pl-1">{step.label}</span>
                {isDone && <Check className={`size-4 ${submitted ? "text-[#94a3b8]" : "text-[#212be9]"}`} />}
                {isActive && !submitted && <CircleDashed className="size-4 text-[#020617]" />}
              </button>
              );
            })}
          </nav>

          <div className="mt-12">
            <h3 className="text-base font-semibold text-black">Attachments</h3>
            <div className="mt-4 flex flex-col gap-4">
              <div className="rounded-lg border border-[#e0e0e0] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">Carta/Mcdonalds2024</p>
                    <p className="text-xs text-[#8d8d8d]">Uploaded today ago by Eric...</p>
                  </div>
                  <button className="text-[#212be9]">
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center rounded-lg border border-dashed border-[#d9d9d9] bg-[#fcfcfc] px-3 py-5">
                  <div className="flex items-center gap-2">
                    <Upload className="size-4 text-[#212be9]" />
                    <span className="text-xs text-[#212be9]">Replace Uploaded File</span>
                  </div>
                </div>
                <p className="text-xs text-[#8d8d8d]">Supported file types: .xls, .xlsx, .csv</p>
              </div>
            </div>
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
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-[#020617]">Review and Submit</h2>
              {submitted && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-semibold text-[#16a34a] ring-1 ring-inset ring-[#16a34a]/20">
                  <Check className="size-3.5" />
                  Submitted
                </span>
              )}
            </div>
            {submitted ? (
              <p className="mt-1 text-sm text-[#646464]">Submitted by Sang Yeo on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
            ) : (
              <div className="mt-1 text-sm leading-5 text-[#646464]">
                <p>Review your campaign summary below.</p>
                <p>Once a campaign is approved, an account representative will get in touch to finalize details and set up billing details.</p>
              </div>
            )}
          </div>

          {/* Campaign Details Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#020617]">Campaign Details</h3>
              {!submitted && (
                <button className="flex items-center gap-1.5 text-sm font-medium text-[#212be9]">
                  <SquarePen className="size-4" />
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-0">
              {CAMPAIGN_DETAILS.map((item) => (
                <div key={item.label} className="flex border-b border-[#f0f0f0] py-3">
                  <span className="w-[240px] shrink-0 text-sm text-[#757575]">{item.label}</span>
                  <div className="flex-1 text-sm font-medium text-[#020617]">
                    {item.link ? (
                      <a href={item.link.href} className="text-[#3333ff] no-underline hover:underline">{item.link.text}</a>
                    ) : item.values ? (
                      <div className="flex items-center gap-3">
                        {item.values.map((v) => (
                          <span key={v.text}>
                            {v.text} <span className="text-[#757575]">({v.count})</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      item.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Partners Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#020617]">
                Media Partners <span className="font-normal text-[#757575]">({String(MEDIA_PARTNERS.length).padStart(2, "0")})</span>
              </h3>
              {!submitted && (
                <button className="flex items-center gap-1.5 text-sm font-medium text-[#212be9]">
                  <SquarePen className="size-4" />
                  Edit
                </button>
              )}
            </div>

            <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3">
              <Info className="mt-0.5 size-4 shrink-0 text-[#3b82f6]" />
              <p className="text-sm text-[#020617]">
                Partners listed on this campaign will immediately be notified to confirm funding and other information regarding the ad campaign details and funding*, pixel template set up and activation.
              </p>
            </div>

            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#64748b]">Partner Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#64748b]">Funding Sourc...</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#64748b]">Funding Sourc...</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#64748b]">Media Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#64748b]">Conversion Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#64748b]">Start Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#64748b]">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {MEDIA_PARTNERS.map((partner) => (
                    <tr key={partner.name} className="border-b border-[#e2e8f0]">
                      <td className="px-4 py-3 text-sm font-semibold text-[#020617]">{partner.name}</td>
                      <td className="px-4 py-3 text-sm text-[#020617]">{partner.fundingSource}</td>
                      <td className="px-4 py-3 text-sm text-[#757575]">{partner.fundingEmail}</td>
                      <td className="px-4 py-3 text-sm text-[#020617]">{partner.mediaType}</td>
                      <td className="px-4 py-3 text-sm text-[#020617]">{partner.conversionType}</td>
                      <td className="px-4 py-3 text-sm text-[#020617]">{partner.startDate}</td>
                      <td className="px-4 py-3 text-sm text-[#020617]">{partner.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-8">
            <h3 className="mb-1 text-base font-semibold text-[#020617]">Comments</h3>
            <p className="mb-3 text-sm text-[#646464]">Use the space below to communicate any special considerations or other requests related to this campaign.</p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="h-20 w-full resize-y rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#020617] outline-none placeholder:text-[#8d8d8d] focus:border-[#212be9]"
            />
          </div>

          {/* Authorization Section */}
          <div className="mb-8">
            <h3 className="mb-3 text-base font-semibold text-[#020617]">Authorization</h3>
            <div className="mb-4 rounded-lg border border-[#e2e8f0] bg-[#fcfcfc] px-4 py-4 text-sm leading-relaxed text-[#646464]">
              This submission is for information gathering purposes only, and does not guarntee the delivery of Attribution, and does not represent any obligation whatsoever by any party mentioned herein. By submitting this form I hereby certify that I am authorized to make this request, and that the information provided herein is, to the best of my knowledge, true and accurate.
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="size-4 rounded border-gray-300 accent-[#212be9]"
              />
              <span className="text-sm text-[#020617]">By checking this box, I agree to these terms of use.</span>
              <Info className="size-4 text-[#8d8d8d]" />
            </label>
          </div>

          {/* Footer */}
          {!submitted ? (
            <div className="flex items-center justify-between py-4">
              <Link
                href="/attribution/taxonomy"
                className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] no-underline transition-colors hover:bg-[#ebf1ff]"
              >
                Back to Placement Details
              </Link>
              <button
                onClick={handleSubmit}
                disabled={!agreed || submitting || submitted}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors ${
                  submitting
                    ? "cursor-wait bg-[#212be9]/80"
                    : agreed
                    ? "bg-[#212be9] hover:bg-[#1a22c4]"
                    : "cursor-not-allowed bg-[#212be9]/50"
                }`}
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {submitting ? "Submitting..." : "Submit Campaign"}
              </button>
            </div>
          ) : (
            <div className="flex items-center py-4">
              <button
                onClick={() => router.push("/attribution?submitted=mcdonalds-q1-q2-2025")}
                className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a22c4]"
              >
                Back to Main
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Toast notification */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-[#16a34a] bg-white px-4 py-3 shadow-lg transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}>
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
    </div>
  );
}

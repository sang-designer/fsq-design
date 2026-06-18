"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function FoursquareLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white text-xs font-bold">
        BL
      </div>
      <span className="text-sm font-medium text-neutral-500">
        Foursquare · Business Listings
      </span>
    </div>
  )
}

function StatCard({
  value,
  label,
  trend,
}: {
  value: string
  label: string
  trend?: { value: string; direction: "up" | "down" | "flat" }
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 text-center">
      <span className="text-2xl font-semibold tracking-tight text-neutral-900">
        {value}
      </span>
      <span className="mt-1 text-xs text-neutral-500">{label}</span>
      {trend && (
        <span
          className={`mt-1 text-xs font-medium ${
            trend.direction === "up"
              ? "text-emerald-600"
              : trend.direction === "down"
                ? "text-red-500"
                : "text-neutral-400"
          }`}
        >
          {trend.direction === "up" && "▲ "}
          {trend.direction === "down" && "▼ "}
          {trend.value}
        </span>
      )}
    </div>
  )
}

function EditRow({
  type,
  description,
  timestamp,
}: {
  type: string
  description: string
  timestamp: string
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Badge
        variant="outline"
        className="shrink-0 text-[11px] font-medium border-neutral-200 text-neutral-600 bg-neutral-50"
      >
        {type}
      </Badge>
      <span className="flex-1 text-sm text-neutral-800">{description}</span>
      <span className="shrink-0 text-xs text-neutral-400">{timestamp}</span>
    </div>
  )
}

function EmailFooter() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4 px-4 text-center">
      <div className="flex items-center gap-5">
        <a href="#" className="text-neutral-300 hover:text-neutral-600 transition-colors">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
          </svg>
        </a>
        <a href="#" className="text-neutral-300 hover:text-neutral-600 transition-colors">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a href="#" className="text-neutral-300 hover:text-neutral-600 transition-colors">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-neutral-400">
          This message was sent to bryan@example.com by Foursquare.
        </p>
        <p className="text-[11px] text-neutral-400">
          Foursquare Labs, Inc., 50 W 23rd St, NY, NY 10010 – www.foursquare.com
        </p>
        <p className="text-[11px] text-neutral-400">
          To opt out of these emails,{" "}
          <a href="#" className="underline hover:text-neutral-600">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CONCEPT: DEFAULT — Full data, busy week
   ───────────────────────────────────────────── */
function DefaultEmail() {
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="flex items-center justify-between px-2 pb-6">
        <FoursquareLogo />
        <span className="text-xs text-neutral-400">May 21 – May 27, 2026</span>
      </div>

      <Card className="overflow-hidden border-neutral-200 shadow-none">
        <CardContent className="p-0">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-[27px] font-semibold tracking-tight text-neutral-900 leading-tight">
              Crowne Plaza Newark Airport had a busy week.
            </h1>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              3 edits accepted · 1,284 check-ins · 7 new tips
            </p>
            <p className="mt-3 text-sm text-neutral-900 leading-relaxed">
              Hi Bryan — here&apos;s a summary of how your business listing
              performed from May 21 to May 27.
            </p>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900">Recent Check-ins</h2>
            <p className="mt-0.5 text-xs text-neutral-400 mb-5">
              Visits and unique visitors logged via Swarm this week.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <StatCard value="1,284" label="Total check-ins" trend={{ value: "12.4% vs last week", direction: "up" }} />
              <StatCard value="842" label="Unique visitors" trend={{ value: "8.1% vs last week", direction: "up" }} />
              <StatCard value="65.6%" label="First-time vs returning" trend={{ value: "same as last week", direction: "flat" }} />
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Placemaker Edits</h2>
                <p className="mt-0.5 text-xs text-neutral-400">Edits suggested by the community on your listing.</p>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-neutral-200 px-4 py-2">
                <span className="text-xl font-semibold text-neutral-900">12</span>
                <span className="text-[10px] text-neutral-400">Edits this week</span>
              </div>
            </div>
            <div className="divide-y divide-neutral-100">
              <EditRow type="Hours" description="Sunday hours suggested to 7:00 AM – 11:00 PM" timestamp="2 days ago" />
              <EditRow type="Website" description="Website set to crowneplazanewarkairport.com" timestamp="3 days ago" />
              <EditRow type="Phone" description="Phone number suggested to (973) 690-5500" timestamp="5 days ago" />
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="flex flex-col items-center gap-3 px-8 py-8">
            <a href="#" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0066FF] px-6 text-sm font-medium text-white hover:bg-[#0052CC] transition-colors">
              Edit your business →
            </a>
            <a href="#" className="inline-flex h-9 items-center justify-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              View edit history ↗
            </a>
          </div>
        </CardContent>
      </Card>

      <EmailFooter />
    </div>
  )
}

/* ─────────────────────────────────────────────
   CONCEPT: EMPTY — No activity this week
   ───────────────────────────────────────────── */
function EmptyEmail() {
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="flex items-center justify-between px-2 pb-6">
        <FoursquareLogo />
        <span className="text-xs text-neutral-400">May 21 – May 27, 2026</span>
      </div>

      <Card className="overflow-hidden border-neutral-200 shadow-none">
        <CardContent className="p-0">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-[27px] font-semibold tracking-tight text-neutral-900 leading-tight">
              A quiet week for your listing.
            </h1>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              0 edits · 0 check-ins · 0 new tips
            </p>
            <p className="mt-3 text-sm text-neutral-900 leading-relaxed">
              Hi Bryan — there was no new activity on your listing this week.
              Keep your info up to date to attract more visitors.
            </p>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900">Recent Check-ins</h2>
            <p className="mt-0.5 text-xs text-neutral-400 mb-5">
              Visits and unique visitors logged via Swarm this week.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <StatCard value="0" label="Total check-ins" />
              <StatCard value="0" label="Unique visitors" />
              <StatCard value="—" label="First-time vs returning" />
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900">Placemaker Edits</h2>
            <p className="mt-0.5 text-xs text-neutral-400 mb-4">No community edits were suggested this week.</p>
            <div className="flex flex-col items-center rounded-lg border border-neutral-200 bg-neutral-50 py-6">
              <p className="text-sm font-medium text-neutral-600">Your listing info looks good</p>
              <p className="mt-1 text-xs text-neutral-400">Suggest an edit to keep your business details accurate.</p>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="flex flex-col items-center gap-3 px-8 py-8">
            <a href="#" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0066FF] px-6 text-sm font-medium text-white hover:bg-[#0052CC] transition-colors">
              Edit your business →
            </a>
            <a href="#" className="inline-flex h-9 items-center justify-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              Claim your listing ↗
            </a>
          </div>
        </CardContent>
      </Card>

      <EmailFooter />
    </div>
  )
}

/* ─────────────────────────────────────────────
   CONCEPT 1 — Highlight-focused (single big stat)
   ───────────────────────────────────────────── */
function Concept1Email() {
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="flex items-center justify-between px-2 pb-6">
        <FoursquareLogo />
        <span className="text-xs text-neutral-400">May 21 – May 27, 2026</span>
      </div>

      <Card className="overflow-hidden border-neutral-200 shadow-none">
        <CardContent className="p-0">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-[27px] font-semibold tracking-tight text-neutral-900 leading-tight">
              You&apos;re up 12% this week.
            </h1>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              Crowne Plaza Newark Airport · Newark, NJ
            </p>
            <p className="mt-3 text-sm text-neutral-900 leading-relaxed">
              Hi Bryan — your listing saw a jump in foot traffic compared to last week.
              Here are the numbers.
            </p>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-8 flex flex-col items-center text-center">
            <span className="text-5xl font-bold text-neutral-900">1,284</span>
            <span className="mt-2 text-sm text-neutral-500">total check-ins this week</span>
            <span className="mt-1 text-xs font-medium text-emerald-600">▲ 12.4% vs last week</span>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6">
            <div className="grid grid-cols-2 gap-3">
              <StatCard value="842" label="Unique visitors" trend={{ value: "8.1% vs last week", direction: "up" }} />
              <StatCard value="12" label="Edits accepted" trend={{ value: "3 new this week", direction: "up" }} />
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Placemaker edits</h2>
            <div className="divide-y divide-neutral-100">
              <EditRow type="Hours" description="Sunday hours suggested to 7:00 AM – 11:00 PM" timestamp="2 days ago" />
              <EditRow type="Website" description="Website set to crowneplazanewarkairport.com" timestamp="3 days ago" />
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="flex flex-col items-center gap-3 px-8 py-8">
            <a href="#" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0066FF] px-6 text-sm font-medium text-white hover:bg-[#0052CC] transition-colors">
              View full report →
            </a>
            <a href="#" className="inline-flex h-9 items-center justify-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              Edit your business ↗
            </a>
          </div>
        </CardContent>
      </Card>

      <EmailFooter />
    </div>
  )
}

/* ─────────────────────────────────────────────
   CONCEPT 2 — Compact digest format
   ───────────────────────────────────────────── */
function Concept2Email() {
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="flex items-center justify-between px-2 pb-6">
        <FoursquareLogo />
        <span className="text-xs text-neutral-400">May 21 – May 27, 2026</span>
      </div>

      <Card className="overflow-hidden border-neutral-200 shadow-none">
        <CardContent className="p-0">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-[27px] font-semibold tracking-tight text-neutral-900 leading-tight">
              Your weekly digest is ready.
            </h1>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              Crowne Plaza Newark Airport
            </p>
            <p className="mt-3 text-sm text-neutral-900 leading-relaxed">
              Hi Bryan — here&apos;s everything that happened on your listing this past week, at a glance.
            </p>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Check-ins</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">1,284</span>
                <span className="text-xs font-medium text-emerald-600">+12.4%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Unique visitors</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">842</span>
                <span className="text-xs font-medium text-emerald-600">+8.1%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Edits accepted</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">3</span>
                <span className="text-xs font-medium text-neutral-400">of 12 submitted</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">New tips</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">7</span>
                <span className="text-xs font-medium text-emerald-600">+3 vs last week</span>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Placemaker edits</h2>
            <div className="divide-y divide-neutral-100">
              <EditRow type="Hours" description="Sunday hours suggested to 7:00 AM – 11:00 PM" timestamp="2 days ago" />
              <EditRow type="Website" description="Website set to crowneplazanewarkairport.com" timestamp="3 days ago" />
              <EditRow type="Phone" description="Phone number suggested to (973) 690-5500" timestamp="5 days ago" />
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="flex flex-col items-center gap-3 px-8 py-8">
            <a href="#" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0066FF] px-6 text-sm font-medium text-white hover:bg-[#0052CC] transition-colors">
              Edit your business →
            </a>
            <a href="#" className="inline-flex h-9 items-center justify-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              View full dashboard ↗
            </a>
          </div>
        </CardContent>
      </Card>

      <EmailFooter />
    </div>
  )
}

/* ─────────────────────────────────────────────
   CONCEPT 3 — Milestone / Progress narrative
   ───────────────────────────────────────────── */
function Concept3Email() {
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="flex items-center justify-between px-2 pb-6">
        <FoursquareLogo />
        <span className="text-xs text-neutral-400">May 21 – May 27, 2026</span>
      </div>

      <Card className="overflow-hidden border-neutral-200 shadow-none">
        <CardContent className="p-0">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-[27px] font-semibold tracking-tight text-neutral-900 leading-tight">
              3 weeks strong.
            </h1>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              Crowne Plaza Newark Airport · Newark, NJ
            </p>
            <p className="mt-3 text-sm text-neutral-900 leading-relaxed">
              Hi Bryan — your listing is consistently attracting visitors.
              Here&apos;s how this week stacked up.
            </p>
          </div>

          <Separator className="bg-neutral-100" />

          {/* Week-over-week comparison */}
          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">This week vs last week</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <span className="text-xs text-neutral-400">Check-ins</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-neutral-900">1,284</span>
                  <span className="text-xs font-medium text-emerald-600">+142</span>
                </div>
                <span className="text-[11px] text-neutral-400">was 1,142 last week</span>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <span className="text-xs text-neutral-400">Unique visitors</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-neutral-900">842</span>
                  <span className="text-xs font-medium text-emerald-600">+63</span>
                </div>
                <span className="text-[11px] text-neutral-400">was 779 last week</span>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Placemaker edits</h2>
            <div className="divide-y divide-neutral-100">
              <EditRow type="Hours" description="Sunday hours suggested to 7:00 AM – 11:00 PM" timestamp="2 days ago" />
              <EditRow type="Website" description="Website set to crowneplazanewarkairport.com" timestamp="3 days ago" />
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="flex flex-col items-center gap-3 px-8 py-8">
            <a href="#" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0066FF] px-6 text-sm font-medium text-white hover:bg-[#0052CC] transition-colors">
              View your insights →
            </a>
            <a href="#" className="inline-flex h-9 items-center justify-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              Edit your business ↗
            </a>
          </div>
        </CardContent>
      </Card>

      <EmailFooter />
    </div>
  )
}

/* ─────────────────────────────────────────────
   IDEA 1-1 — Multi-business (2–5 locations)
   One email, stacked summaries per location
   ───────────────────────────────────────────── */
function Idea1_1Email() {
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="flex items-center justify-between px-2 pb-6">
        <FoursquareLogo />
        <span className="text-xs text-neutral-400">May 21 – May 27, 2026</span>
      </div>

      <Card className="overflow-hidden border-neutral-200 shadow-none">
        <CardContent className="p-0">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-[27px] font-semibold tracking-tight text-neutral-900 leading-tight">
              Your 3 locations this week.
            </h1>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              4,210 total check-ins · 8 edits accepted
            </p>
            <p className="mt-3 text-sm text-neutral-900 leading-relaxed">
              Hi Bryan — here&apos;s a quick look at how each of your businesses performed.
            </p>
          </div>

          <Separator className="bg-neutral-100" />

          {/* Location 1 */}
          <div className="px-8 py-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Crowne Plaza Newark Airport</p>
                <p className="text-xs text-neutral-400">Newark, NJ</p>
              </div>
              <span className="text-xs font-medium text-emerald-600">▲ 12%</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">1,284</span>
                <p className="text-[10px] text-neutral-400">Check-ins</p>
              </div>
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">842</span>
                <p className="text-[10px] text-neutral-400">Visitors</p>
              </div>
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">3</span>
                <p className="text-[10px] text-neutral-400">Edits</p>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          {/* Location 2 */}
          <div className="px-8 py-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Holiday Inn Express JFK</p>
                <p className="text-xs text-neutral-400">Jamaica, NY</p>
              </div>
              <span className="text-xs font-medium text-emerald-600">▲ 5%</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">1,820</span>
                <p className="text-[10px] text-neutral-400">Check-ins</p>
              </div>
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">1,104</span>
                <p className="text-[10px] text-neutral-400">Visitors</p>
              </div>
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">2</span>
                <p className="text-[10px] text-neutral-400">Edits</p>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          {/* Location 3 */}
          <div className="px-8 py-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Hampton Inn Secaucus</p>
                <p className="text-xs text-neutral-400">Secaucus, NJ</p>
              </div>
              <span className="text-xs font-medium text-red-500">▼ 3%</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">1,106</span>
                <p className="text-[10px] text-neutral-400">Check-ins</p>
              </div>
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">690</span>
                <p className="text-[10px] text-neutral-400">Visitors</p>
              </div>
              <div className="rounded border border-neutral-200 bg-neutral-50 p-2.5 text-center">
                <span className="text-base font-semibold text-neutral-900">3</span>
                <p className="text-[10px] text-neutral-400">Edits</p>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="flex flex-col items-center gap-3 px-8 py-8">
            <a href="#" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0066FF] px-6 text-sm font-medium text-white hover:bg-[#0052CC] transition-colors">
              Manage your businesses
            </a>
          </div>
        </CardContent>
      </Card>

      <EmailFooter />
    </div>
  )
}

/* ─────────────────────────────────────────────
   IDEA 1-2 — Agency portfolio digest (100+ locations)
   Top-level summary + highlights + needs attention
   ───────────────────────────────────────────── */
function Idea1_2Email() {
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="flex items-center justify-between px-2 pb-6">
        <FoursquareLogo />
        <span className="text-xs text-neutral-400">May 21 – May 27, 2026</span>
      </div>

      <Card className="overflow-hidden border-neutral-200 shadow-none">
        <CardContent className="p-0">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-[27px] font-semibold tracking-tight text-neutral-900 leading-tight">
              102 locations at a glance.
            </h1>
            <p className="mt-2 text-sm font-medium text-neutral-500">
              12 need attention · 87 on track · 3 trending up
            </p>
            <p className="mt-3 text-sm text-neutral-900 leading-relaxed">
              Hi Sarah — here&apos;s your weekly portfolio summary for Apex Hospitality Group.
            </p>
          </div>

          <Separator className="bg-neutral-100" />

          {/* Portfolio stats */}
          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Portfolio overview</h2>
            <div className="grid grid-cols-3 gap-3">
              <StatCard value="48.2K" label="Total check-ins" trend={{ value: "6.3% vs last week", direction: "up" }} />
              <StatCard value="31.1K" label="Unique visitors" trend={{ value: "4.8% vs last week", direction: "up" }} />
              <StatCard value="47" label="Edits accepted" trend={{ value: "12 more than last week", direction: "up" }} />
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          {/* Needs Attention */}
          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-semibold text-neutral-900">Needs attention</h2>
              <svg className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-neutral-400 mb-4">12 locations with issues to review.</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-700">Outdated business hours</span>
                <span className="text-xs text-neutral-400">5 locations</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-700">Pending Placemaker edits</span>
                <span className="text-xs text-neutral-400">4 locations</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-700">Check-in drop &gt; 20%</span>
                <span className="text-xs text-neutral-400">3 locations</span>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          {/* Top Performers */}
          <div className="px-8 py-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-1">Top performers</h2>
            <p className="text-xs text-neutral-400 mb-4">Highest check-ins this week.</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-neutral-900">Hilton Midtown NYC</p>
                  <p className="text-xs text-neutral-400">New York, NY</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">3,420</p>
                  <p className="text-[10px] text-emerald-600">▲ 18%</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-neutral-900">Crowne Plaza Newark Airport</p>
                  <p className="text-xs text-neutral-400">Newark, NJ</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">1,284</p>
                  <p className="text-[10px] text-emerald-600">▲ 12%</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-neutral-900">W Hotel Downtown</p>
                  <p className="text-xs text-neutral-400">Philadelphia, PA</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">1,105</p>
                  <p className="text-[10px] text-emerald-600">▲ 9%</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="flex flex-col items-center gap-3 px-8 py-8">
            <a href="#" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0066FF] px-6 text-sm font-medium text-white hover:bg-[#0052CC] transition-colors">
              Review all locations →
            </a>
            <a href="#" className="inline-flex h-9 items-center justify-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              Export report ↗
            </a>
          </div>
        </CardContent>
      </Card>

      <EmailFooter />
    </div>
  )
}

/* ─────────────────────────────────────────────
   PAGE — Tabs to switch between concepts
   ───────────────────────────────────────────── */
export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Tabs defaultValue="default" className="w-full">
        {/* Concept Switcher Header */}
        <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-[700px] px-4">
            <div className="flex flex-col gap-2 py-3">
              <h1 className="text-sm font-semibold text-neutral-900">
                Business Listings Email
              </h1>
              <div className="flex gap-2 flex-wrap">
                <TabsList className="bg-neutral-100">
                  <TabsTrigger value="default" className="text-xs">Default</TabsTrigger>
                  <TabsTrigger value="empty" className="text-xs">Empty</TabsTrigger>
                  <TabsTrigger value="concept1" className="text-xs">Concept 1</TabsTrigger>
                  <TabsTrigger value="concept2" className="text-xs">Concept 2</TabsTrigger>
                  <TabsTrigger value="concept3" className="text-xs">Concept 3</TabsTrigger>
                  <TabsTrigger value="idea1-1" className="text-xs">Idea 1-1</TabsTrigger>
                  <TabsTrigger value="idea1-2" className="text-xs">Idea 1-2</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex gap-4 text-[10px] text-neutral-400">
                <span>Default–C3: Single business (SMB)</span>
                <span>Idea 1-1: Multi-business (2–5)</span>
                <span>Idea 1-2: Agency portfolio (100+)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-[700px] px-4 py-8">
          <TabsContent value="default" className="mt-0">
            <DefaultEmail />
          </TabsContent>
          <TabsContent value="empty" className="mt-0">
            <EmptyEmail />
          </TabsContent>
          <TabsContent value="concept1" className="mt-0">
            <Concept1Email />
          </TabsContent>
          <TabsContent value="concept2" className="mt-0">
            <Concept2Email />
          </TabsContent>
          <TabsContent value="concept3" className="mt-0">
            <Concept3Email />
          </TabsContent>
          <TabsContent value="idea1-1" className="mt-0">
            <Idea1_1Email />
          </TabsContent>
          <TabsContent value="idea1-2" className="mt-0">
            <Idea1_2Email />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

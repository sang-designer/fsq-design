"use client";

import {
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  Grid3X3,
  CircleAlert,
  FileText,
  UserCircle,
  PackageOpen,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MOCK_CAMPAIGNS = [
  { name: "Mcdonald's Q3 Campaign", agency: "Carta", partner: "Spotify", startDate: "2025-01-30", endDate: "2025-06-30", owner: "Erica Westrich" },
  { name: "Mcdonalds Campaign", agency: "Kinfolk", partner: "Spotify", startDate: "2025-01-30", endDate: "2025-06-30", owner: "Erica Westrich" },
  { name: "Mcdonalds H23 Campaign Roll", agency: "All Saints", partner: "Spotify", startDate: "2025-01-30", endDate: "2025-06-30", owner: "Erica Westrich" },
  { name: "Mcdonald's Q3 Campaign", agency: "Pandora", partner: "Spotify", startDate: "2025-01-30", endDate: "2025-06-30", owner: "Erica Westrich" },
  { name: "Golden Corral 2025", agency: "Carta", partner: "Viant", startDate: "2025-03-01", endDate: "2025-09-30", owner: "David Kim" },
  { name: "Subway Fall Push", agency: "Kinfolk", partner: "Viant", startDate: "2025-08-01", endDate: "2025-12-31", owner: "Sarah Johnson" },
];

const OWNER_OPTIONS = ["Erica Westrich", "David Kim", "Sarah Johnson", "Michael Chen"];

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

export default function EditCampaignPage() {
  const router = useRouter();

  const [salesforceUrl, setSalesforceUrl] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [opportunityOwner, setOpportunityOwner] = useState("");
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof MOCK_CAMPAIGNS>([]);
  const [resultSearch, setResultSearch] = useState("");

  function handleSearch() {
    setLoading(true);
    setHasSearched(true);
    setSearchResults([]);
    setResultSearch("");

    setTimeout(() => {
      let results = [...MOCK_CAMPAIGNS];

      if (salesforceUrl.trim()) {
        results = results.slice(0, 1);
      } else {
        if (campaignName.trim()) {
          const q = campaignName.toLowerCase();
          results = results.filter((c) => c.name.toLowerCase().includes(q));
        }
        if (startDate) {
          results = results.filter((c) => c.startDate >= startDate);
        }
        if (endDate) {
          results = results.filter((c) => c.endDate <= endDate);
        }
        if (opportunityOwner) {
          results = results.filter((c) => c.owner === opportunityOwner);
        }
      }

      setSearchResults(results);
      setLoading(false);
    }, 1000);
  }

  const displayResults = resultSearch
    ? searchResults.filter((c) => c.name.toLowerCase().includes(resultSearch.toLowerCase()))
    : searchResults;

  const startSelected = startDate ? new Date(startDate + "T00:00:00") : undefined;
  const endSelected = endDate ? new Date(endDate + "T00:00:00") : undefined;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-white px-12">
        <div className="flex items-center gap-6">
          <Link href="/attribution" className="flex items-center gap-0.5">
            <span className="text-lg font-semibold tracking-tight text-[#000033]">FSQ</span>
            <span className="font-mono text-lg font-medium text-[#000033]">/</span>
            <span className="font-mono text-lg font-medium text-[#000033]">attribution</span>
          </Link>
          <nav className="flex items-center gap-1 px-4">
            <Link
              href="/attribution"
              className="flex h-14 items-center border-b-2 border-[#171417] px-6 text-sm font-semibold text-[#171417]"
            >
              Dashboard
            </Link>
            <span className="flex h-14 items-center px-6 text-sm text-[#555]">
              Feasibility Calculator
            </span>
          </nav>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-4 px-4">
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
              <CircleAlert className="size-4" />
            </button>
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
              <FileText className="size-4" />
            </button>
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
              <UserCircle className="size-4" />
            </button>
          </div>
          <div className="flex items-center border-l border-border pl-4">
            <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
              <Grid3X3 className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-[1344px] px-12 py-8">
        {/* Page Title + Search Button */}
        <div className="flex items-start justify-between">
          <div className="pb-4">
            <h1 className="text-2xl font-semibold leading-7 tracking-[-0.5px] text-black">
              Edit an existing campaign
            </h1>
            <p className="mt-1.5 text-sm leading-5 text-[#8d8d8d]">
              Link an existing Salesforce opportunity and add new line items.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-black">
            Enter the Salesforce Opportunity URL or fill in the fields to search for the campaign account.
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-6 flex flex-col gap-6">
          {/* Salesforce URL / Plaid */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#000033]">Salesforce URL or Plaid</label>
            <div className="relative w-[432px]">
              <input
                type="text"
                placeholder="e.g 67890FGHJ456789"
                value={salesforceUrl}
                onChange={(e) => setSalesforceUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && salesforceUrl.trim()) handleSearch(); }}
                className="h-10 w-full rounded-md border border-[#f0f0f0] bg-white pl-3 pr-10 text-sm text-[#020617] placeholder:text-[#8d8d8d] focus:border-[#212be9] focus:outline-none focus:ring-1 focus:ring-[#212be9]"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8d8d8d]" />
            </div>
          </div>

          {/* OR Divider */}
          <p className="w-10 text-center text-sm text-[#8d8d8d]">OR</p>

          {/* Advanced Filters */}
          <div className="flex items-start gap-4">
            {/* Campaign Name */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-[#000033]">Campaign Name</label>
              <input
                type="text"
                placeholder="e.g Golden Corral 2025"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="h-10 w-full rounded-md border border-[#f0f0f0] bg-white px-3 text-sm text-[#020617] placeholder:text-[#8d8d8d] focus:border-[#212be9] focus:outline-none focus:ring-1 focus:ring-[#212be9]"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-[#000033]">Start Date</label>
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`flex h-10 w-full items-center gap-2 rounded-md border border-[#f0f0f0] bg-[#fcfcfc] px-3 text-left text-sm ${startDate ? "text-[#020617]" : "text-[#8d8d8d]"}`}
                  >
                    <CalendarIcon className="size-4 text-[#8d8d8d]" />
                    {startDate ? formatDate(startDate) : "\u00A0"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startSelected}
                    onSelect={(date) => {
                      if (date) {
                        const y = date.getFullYear();
                        const m = String(date.getMonth() + 1).padStart(2, "0");
                        const d = String(date.getDate()).padStart(2, "0");
                        setStartDate(`${y}-${m}-${d}`);
                      }
                      setStartOpen(false);
                    }}
                    defaultMonth={startSelected || new Date()}
                    className="rounded-lg border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-[#000033]">End Date</label>
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`flex h-10 w-full items-center gap-2 rounded-md border border-[#f0f0f0] bg-[#fcfcfc] px-3 text-left text-sm ${endDate ? "text-[#020617]" : "text-[#8d8d8d]"}`}
                  >
                    <CalendarIcon className="size-4 text-[#8d8d8d]" />
                    {endDate ? formatDate(endDate) : "\u00A0"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endSelected}
                    onSelect={(date) => {
                      if (date) {
                        const y = date.getFullYear();
                        const m = String(date.getMonth() + 1).padStart(2, "0");
                        const d = String(date.getDate()).padStart(2, "0");
                        setEndDate(`${y}-${m}-${d}`);
                      }
                      setEndOpen(false);
                    }}
                    disabled={startSelected ? { before: startSelected } : undefined}
                    defaultMonth={endSelected || startSelected || new Date()}
                    className="rounded-lg border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Opportunity Owner */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-[#000033]">Opportunity Owner</label>
              <Select value={opportunityOwner} onValueChange={setOpportunityOwner}>
                <SelectTrigger className="h-10 w-full border-[#f0f0f0] bg-white text-sm data-[placeholder]:text-[#8d8d8d]">
                  <SelectValue placeholder={"\u00A0"} />
                </SelectTrigger>
                <SelectContent>
                  {OWNER_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <div className="pb-6">
            <button
              onClick={handleSearch}
              className="rounded-md border border-[#212be9] bg-[#fcfcfc] px-4 py-2 text-base font-medium text-[#212be9] transition-colors hover:bg-[#eff0fd]"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="mt-4 flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-[#212be9]" />
                <p className="mt-3 text-sm text-[#8d8d8d]">Searching campaigns...</p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-black">Select a campaign from the results below.</p>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search"
                        value={resultSearch}
                        onChange={(e) => setResultSearch(e.target.value)}
                        className="h-9 w-[180px] rounded-md border border-[#f0f0f0] bg-white px-3 text-sm text-[#020617] placeholder:text-[#8d8d8d] focus:border-[#212be9] focus:outline-none focus:ring-1 focus:ring-[#212be9]"
                      />
                    </div>
                    <p className="text-sm text-[#8d8d8d]">
                      Showing <span className="font-semibold text-[#171417]">{displayResults.length}</span> of{" "}
                      <span className="font-semibold text-[#171417]">{searchResults.length}</span> results
                    </p>
                  </div>
                </div>

            {/* Separator */}
            <div className="h-px w-full bg-[#e0e0e0]" />

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0e0e0]">
                  <th className="pb-3 text-left text-sm font-semibold text-[#212be9]">Campaign Name</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[#212be9]">Agency</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[#212be9]">Partner</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[#212be9]">Start Date</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[#212be9]">End Date</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[#212be9]">Opportunity Owner</th>
                </tr>
              </thead>
              <tbody>
                {displayResults.length > 0 ? (
                  displayResults.map((campaign, i) => (
                    <tr
                      key={i}
                      onClick={() => router.push("/attribution/new")}
                      className="cursor-pointer border-b border-[#e0e0e0] transition-colors hover:bg-[#f8f8ff]"
                    >
                      <td className="py-3 text-sm text-[#171417]">{campaign.name}</td>
                      <td className="py-3 text-sm text-[#171417]">{campaign.agency}</td>
                      <td className="py-3 text-sm text-[#171417]">{campaign.partner}</td>
                      <td className="py-3 text-sm text-[#171417]">{formatDate(campaign.startDate)}</td>
                      <td className="py-3 text-sm text-[#171417]">{formatDate(campaign.endDate)}</td>
                      <td className="py-3 text-sm text-[#171417]">{campaign.owner}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16">
                      <div className="flex flex-col items-center gap-3">
                        <PackageOpen className="size-12 text-[#c0c0c0]" />
                        <p className="text-sm font-semibold text-[#171417]">No results found</p>
                        <p className="text-sm text-[#8d8d8d]">
                          Adjust the fields to get more results, or{" "}
                          <Link href="/attribution/new" className="text-[#212be9] underline">
                            start a new campaign
                          </Link>
                          .
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

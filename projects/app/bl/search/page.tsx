"use client";

import { Search, ChevronDown, X, Info, User, LayoutGrid, Globe, MapPin, Pencil, Building2, BarChart3, Users } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
];

type SearchResult = {
  name: string;
  category: string;
  priceLevel: number;
  address: string;
};

const MOCK_RESULTS: Record<string, SearchResult[]> = {
  sangster: [
    { name: "Sangster Coffee House", category: "Coffee Shop", priceLevel: 1, address: "1509 Sloat Blvd., (at Everglade Dr), San Francisco, CA" },
    { name: "Sangster Bakery", category: "Bakery", priceLevel: 1, address: "9087 Geary Blvd., San Francisco, CA" },
    { name: "Sangster Curry", category: "Restaurant", priceLevel: 1, address: "1111 Main St., San Francisco, CA" },
  ],
  starbucks: [
    { name: "Starbucks Reserve Roastery", category: "Coffee Shop", priceLevel: 2, address: "6 th Ave., San Francisco, CA" },
    { name: "Starbucks Coffee", category: "Coffee Shop", priceLevel: 1, address: "2 Embarcadero Center, San Francisco, CA" },
    { name: "Starbucks", category: "Coffee Shop", priceLevel: 1, address: "785 Market St., San Francisco, CA" },
  ],
  mcdonald: [
    { name: "McDonald's", category: "Fast Food", priceLevel: 1, address: "909 Market St., San Francisco, CA" },
    { name: "McDonald's", category: "Fast Food", priceLevel: 1, address: "1100 Fillmore St., San Francisco, CA" },
  ],
};

function FsqMark() {
  return (
    <div className="flex size-10 items-center justify-center rounded bg-[#171417] p-[8px]">
      <svg viewBox="0 0 24 24" fill="none" className="size-full">
        <text x="4" y="11" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.5">F</text>
        <text x="2" y="22" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.3">SQ</text>
      </svg>
    </div>
  );
}

function PriceIndicator({ level }: { level: number }) {
  return (
    <span>
      <span className="text-[#171417]">{"$".repeat(level)}</span>
      <span className="text-[#b3b0b1]">{"$".repeat(4 - level)}</span>
    </span>
  );
}

export default function BusinessSearchPage() {
  const [businessQuery, setBusinessQuery] = useState("");
  const [location, setLocation] = useState("San Francisco, CA");
  const [locationOpen, setLocationOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!businessQuery.trim()) return;
    const key = Object.keys(MOCK_RESULTS).find((k) =>
      businessQuery.toLowerCase().includes(k)
    );
    setResults(key ? MOCK_RESULTS[key] : []);
    setHasSearched(true);
  };

  const handleClear = () => {
    setBusinessQuery("");
    setResults(null);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#e0e0e0] bg-white">
        <div className="flex items-center gap-16 pl-8">
          <Link href="/bl" className="flex h-9 items-center gap-0.5 no-underline">
            <img src="/fsq-logo.svg" alt="FSQ" className="h-[15px] w-10" />
            <span className="flex items-center gap-0.5 font-mono text-lg font-medium text-[#000033]">
              <span>/</span>
              <span>Business Listings</span>
            </span>
          </Link>
          <nav className="flex h-14 items-end">
            <Link href="/bl" className="flex items-center justify-center border-b-2 border-[#000033] px-4 pb-2 pt-2 no-underline">
              <span className="text-sm font-semibold text-[#000033]">Home</span>
            </Link>
          </nav>
        </div>
        <div className="flex h-full items-center pr-8">
          <div className="flex h-full items-center gap-4 px-4">
            <button className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100">
              <Info className="size-4 text-[#000033]" />
            </button>
            <button className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100">
              <User className="size-4 text-[#000033]" />
            </button>
          </div>
          <div className="flex h-full items-center border-l border-[#e0e0e0] pl-4">
            <button className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100">
              <LayoutGrid className="size-4 text-[#000033]" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center overflow-hidden">
        {/* Background gradient mesh */}
        {!hasSearched && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-[200px] -top-[100px] size-[600px] rounded-full bg-[#212be9]/[0.08] blur-[120px]" />
            <div className="absolute -right-[150px] top-[200px] size-[500px] rounded-full bg-[#6366f1]/[0.1] blur-[120px]" />
            <div className="absolute bottom-[100px] left-[20%] size-[400px] rounded-full bg-[#818cf8]/[0.08] blur-[100px]" />
            <div className="absolute -bottom-[200px] right-[10%] size-[600px] rounded-full bg-[#212be9]/[0.06] blur-[140px]" />
          </div>
        )}
        {hasSearched ? (
          <>
            {/* ── Results view ── */}
            <h1 className="mt-[80px] text-center text-4xl font-semibold tracking-[-0.6px] text-black">
              Search for your business on Foursquare
            </h1>

            {/* Horizontal inputs */}
            <div className="mt-10 flex w-full max-w-[1025px] items-start gap-6 px-4">
              <div className="relative min-w-0 flex-1">
                <div className="flex h-9 items-center rounded-md border border-[#d9d9d9] bg-[#fcfcfc] px-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={businessQuery}
                    onChange={(e) => setBusinessQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your business name"
                    className="flex-1 bg-transparent text-sm text-[#171417] outline-none placeholder:text-[#8d8d8d]"
                  />
                  {businessQuery && (
                    <button onClick={handleClear} className="ml-2 text-[#8d8d8d] hover:text-[#171417]">
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              <div ref={locationRef} className="relative min-w-0 flex-1">
                <button
                  onClick={() => setLocationOpen(!locationOpen)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-[#d9d9d9] bg-[#fcfcfc] px-3"
                >
                  <span className="truncate text-sm text-[#171417]">{location}</span>
                  <ChevronDown className="size-4 shrink-0 text-[#8d8d8d]" />
                </button>
                {locationOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[240px] overflow-y-auto rounded-md border border-[#e0e0e0] bg-white py-1 shadow-lg">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => { setLocation(loc); setLocationOpen(false); }}
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${location === loc ? "font-medium text-[#171417]" : "text-[#555]"}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {results !== null && (
              <div className="mt-10 w-full max-w-[1025px] px-4 pb-12">
                {results.length === 0 ? (
                  <div className="rounded-lg border border-[#e0ddde] bg-white px-12 py-12 text-center">
                    <p className="text-base font-semibold text-[#171417]">No results found</p>
                    <p className="mt-2 text-sm text-[#8d8d8d]">Try a different search term or check the spelling.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-[#e0ddde]">
                    {results.map((result, i) => (
                      <div
                        key={`${result.name}-${i}`}
                        className={`flex items-center justify-between bg-white px-12 py-6 ${i > 0 ? "border-t border-[#e0ddde]" : ""}`}
                      >
                        <div className="flex flex-col gap-2">
                          <a href="#" className="text-base font-semibold leading-6 text-[#3333ff] no-underline hover:underline">
                            {result.name}
                          </a>
                          <div className="text-sm leading-5 text-[#171417]">
                            <p>{result.category} • <PriceIndicator level={result.priceLevel} /></p>
                            <p>{result.address}</p>
                          </div>
                        </div>
                        <button className="shrink-0 rounded-lg border border-[#212be9] bg-[#fcfcfc] px-3 py-2 text-sm font-medium text-[#212be9] transition-colors hover:bg-[#f5f5ff]">
                          Claim this business
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* ── Initial search view ── */}
            <div className="mt-[80px]">
              <FsqMark />
            </div>

            <h1 className="mt-[25px] text-center text-4xl font-semibold tracking-[-0.6px] text-black">
              Search for your business on Foursquare
            </h1>

            <div className="mt-10 flex w-[480px] flex-col items-center gap-6">
              {/* Business name input */}
              <div className="w-full">
                <div className="flex h-9 items-center rounded-md border border-[#212be9] bg-[#fcfcfc] px-3 ring-1 ring-[#212be9]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={businessQuery}
                    onChange={(e) => setBusinessQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your business name"
                    className="flex-1 bg-transparent text-sm text-[#171417] outline-none placeholder:text-[#8d8d8d]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Location select */}
              <div ref={locationRef} className="relative w-full">
                <button
                  onClick={() => setLocationOpen(!locationOpen)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-[#d9d9d9] bg-[#fcfcfc] px-3"
                >
                  <span className="truncate text-sm text-[#171417]">{location}</span>
                  <ChevronDown className="size-4 shrink-0 text-[#8d8d8d]" />
                </button>
                {locationOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[240px] overflow-y-auto rounded-md border border-[#e0e0e0] bg-white py-1 shadow-lg">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => { setLocation(loc); setLocationOpen(false); }}
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${location === loc ? "font-medium text-[#171417]" : "text-[#555]"}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                disabled={!businessQuery.trim()}
                className="flex h-9 w-[160px] items-center justify-center gap-1 rounded-md bg-[#212be9] text-base font-medium text-[#f5f8ff] transition-colors hover:bg-[#1a22c4] disabled:opacity-50"
              >
                <Search className="size-4" />
                Search FSQ
              </button>
            </div>

            {/* ── Value proposition content ── */}

            {/* What you get */}
            <div className="mb-16 mt-20 w-full max-w-[960px] px-4">
              <h2 className="text-center text-lg font-semibold text-[#555]">
                What you get when you claim your listing
              </h2>
              <div className="mt-8 grid grid-cols-3 gap-5">
                {[
                  { icon: Globe, title: "Get discovered everywhere", desc: "Show up across ride-share apps, AI search, maps, and platforms powered by Foursquare." },
                  { icon: MapPin, title: "Turn searches into visits", desc: "Accurate hours, location, and details mean fewer missed customers and more foot traffic." },
                  { icon: Pencil, title: "Control your information", desc: "Update hours, address, and categories anytime so customers always see the right info." },
                  { icon: Building2, title: "Manage multiple locations", desc: "Keep everything consistent across all your stores from one place." },
                  { icon: BarChart3, title: "See real engagement", desc: "swarm-special" },
                  { icon: Users, title: "Community updates", desc: "Review and approve suggested edits from Placemakers to keep your listing fresh." },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-[#e0e0e0] bg-white px-6 py-5">
                    <item.icon className="size-5 text-[#8d8d8d]" />
                    <p className="mt-3 text-sm font-semibold text-[#171417]">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-5 text-[#8d8d8d]">
                      {item.desc === "swarm-special" ? (
                        <>Track <a href="https://swarmapp.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-[#212be9] hover:underline">Swarm</a> check-in activity to understand when and how customers are visiting.</>
                      ) : item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

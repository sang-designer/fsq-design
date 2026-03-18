"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SelectField({ label, placeholder = "Type or Select", helpText, value, onChange, error, options }: {
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

export function DateField({ label, value, onChange, error, min }: { label: string; value?: string; onChange?: (v: string) => void; error?: boolean; min?: string }) {
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

export function InputField({ label, placeholder = "", value, onChange, error }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void; error?: boolean }) {
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

const PARTNER_OPTIONS = [
  "Viant", "Adtheorent", "Nexxen", "TradeDesk", "LiveRamp",
  "Taboola", "StackAdapt", "Basis Technologies", "MediaMath", "Simpli.fi",
  "Adelphic", "Amobee", "Xandr", "PubMatic", "Index Exchange",
];

export function BrandSearchSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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

export function PartnerSearchSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = PARTNER_OPTIONS.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
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
      <label className="text-sm font-medium text-[#1f2430]">Partner</label>
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className={value ? "text-[#1f2430]" : "text-muted-foreground"}>{value || "Select partner"}</span>
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
              placeholder="Search partners..."
              autoFocus
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">No partners found</p>
            ) : (
              filtered.map((p) => (
                <button
                  key={p}
                  onClick={() => { onChange(p); setOpen(false); }}
                  className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent ${value === p ? "font-medium text-[#1f2430]" : "text-[#1f2430]"}`}
                >
                  <span className="flex-1 text-left">{p}</span>
                  {value === p && <Check className="size-4 text-[#1f2430]" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

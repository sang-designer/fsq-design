"use client";

import { useState } from "react";
import { ExternalLink, Search, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { chartData, transactions } from "./data";

export default function BillingSummaryTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [billingCycle] = useState("May 1, 2025 - May 31, 2025");
  const [cycleDropdownOpen, setCycleDropdownOpen] = useState(false);

  const filteredTx = transactions.filter(
    (t) =>
      t.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Usage header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#646464]">Usage:</p>
          <p className="text-[32px] font-semibold text-[#000033]">20,000</p>
          <p className="text-sm text-[#646464]">Pro: 20,000 | Premium: 0</p>
        </div>
        <div className="relative">
          <p className="text-sm font-semibold text-[#646464]">Billing cycle:</p>
          <button
            onClick={() => setCycleDropdownOpen((v) => !v)}
            className="mt-1 flex items-center gap-2 rounded-md border border-[#e0e0e0] bg-white px-3 py-2 text-sm text-[#000033]"
          >
            {billingCycle}
            <ChevronDown className="size-4 text-[#646464]" />
          </button>
          {cycleDropdownOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 rounded-md border border-[#e0e0e0] bg-white py-1 shadow-md">
              <button
                onClick={() => setCycleDropdownOpen(false)}
                className="w-full px-4 py-2 text-left text-sm text-[#000033] hover:bg-gray-50"
              >
                May 1, 2025 - May 31, 2025
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#8d8d8d" }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis tick={{ fontSize: 11, fill: "#8d8d8d" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 12 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Line type="monotone" dataKey="pro" stroke="#212be9" strokeWidth={2} dot={false} name="Pro endpoints" />
            <Line type="monotone" dataKey="premium" stroke="#ec4899" strokeWidth={2} dot={false} name="Premium endpoints" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#212be9]" />
          <span className="text-xs text-[#646464]">Pro endpoints</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ec4899]" />
          <span className="text-xs text-[#646464]">Premium endpoints</span>
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#000033]">Transactions history</h2>
        <a href="#" className="flex items-center gap-1 text-sm text-[#212be9] hover:underline">
          Contact billing support <ExternalLink className="size-3.5" />
        </a>
      </div>

      <div className="relative mt-4 w-[300px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8d8d8d]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
          className="h-10 w-full rounded-md border border-[#e0e0e0] bg-white pl-9 pr-3 text-sm text-[#000033] outline-none placeholder:text-[#8d8d8d] transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
        />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#e0e0e0] bg-[#fcfcfc]">
              <th className="px-4 py-3 font-medium text-[#000033]">Date</th>
              <th className="px-4 py-3 font-medium text-[#000033]">Description</th>
              <th className="px-4 py-3 font-medium text-[#000033]">Status</th>
              <th className="px-4 py-3 font-medium text-[#000033]">Call</th>
              <th className="px-4 py-3 font-medium text-[#000033]">Purchased Credits</th>
              <th className="px-4 py-3 font-medium text-[#000033]">Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.map((tx, i) => (
              <tr key={i} className="border-b border-[#e0e0e0] last:border-0">
                <td className="px-4 py-3 text-[#000033]">{tx.date}</td>
                <td className="px-4 py-3 text-[#000033]">{tx.description}</td>
                <td className="px-4 py-3">
                  {tx.status ? (
                    <span className="rounded bg-[#16a34a] px-1.5 py-0.5 text-xs font-semibold text-white">{tx.status}</span>
                  ) : (
                    <span className="text-[#8d8d8d]">–</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#000033]">{tx.call}</td>
                <td className="px-4 py-3 text-[#000033]">{tx.credits}</td>
                <td className="px-4 py-3 text-[#000033]">{tx.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-end gap-4 text-sm text-[#646464]">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select className="h-8 rounded border border-[#e0e0e0] bg-white px-2 text-sm text-[#000033] outline-none">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <span>Page 1 of 10</span>
        <div className="flex gap-1">
          <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50"><ChevronsLeft className="size-4" /></button>
          <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50"><ChevronLeft className="size-4" /></button>
          <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50"><ChevronRight className="size-4" /></button>
          <button className="flex size-8 items-center justify-center rounded border border-[#e0e0e0] hover:bg-gray-50"><ChevronsRight className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}

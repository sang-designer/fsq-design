"use client";

import { useState, useEffect } from "react";
import { Info, ChevronDown, CheckCircle } from "lucide-react";
import { creditOptions } from "./data";

export default function OverviewTab() {
  const [paymentOption, setPaymentOption] = useState<"auto" | "one-time">("auto");
  const [creditAmount, setCreditAmount] = useState("100000");
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [showConfirmAutoModal, setShowConfirmAutoModal] = useState(false);
  const [showUnselectAutoModal, setShowUnselectAutoModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  function handleConfirmAuto() {
    setShowConfirmAutoModal(false);
    setAutoPayEnabled(true);
    setSuccessToast("You've set your automatic payment.");
  }

  function handleSwitchToOneTime() {
    if (autoPayEnabled) {
      setShowUnselectAutoModal(true);
    } else {
      setPaymentOption("one-time");
    }
  }

  function confirmSwitchToOneTime() {
    setShowUnselectAutoModal(false);
    setAutoPayEnabled(false);
    setPaymentOption("one-time");
  }

  const selectedCredit = creditOptions.find((c) => c.value === creditAmount);

  return (
    <div className="max-w-[720px]">
      {/* Toast */}
      {successToast && (
        <div className="fixed right-6 top-6 z-[100] flex items-center gap-2 rounded-md border border-[#16a34a] bg-[#f0fdf4] p-4 shadow-lg">
          <CheckCircle className="size-5 text-[#16a34a]" />
          <span className="text-sm font-medium text-[#166534]">{successToast}</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold text-[#000033]">Current credit balance:</p>
          <p className="text-[32px] font-semibold text-[#000033]">$146.07</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#000033]">Current spend (this billing cycle)</p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-base text-[#000033]">$150.00</p>
            {autoPayEnabled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#16a34a] px-2 py-0.5 text-xs font-semibold text-white">
                <CheckCircle className="size-3" />
                Automatic payment enabled
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="flex items-center gap-1 text-sm font-semibold text-[#000033]">
            Usage: <Info className="size-3.5 text-[#646464]" />
          </p>
          <p className="mt-1 text-sm text-[#000033]">Pro endpoint: 20,000/100,000</p>
          <p className="text-sm text-[#000033]">Premium endpoint: 0/10,000</p>
          <button className="mt-1 text-sm text-[#212be9] hover:underline">See details</button>
        </div>

        <div>
          <p className="flex items-center gap-1 text-sm font-semibold text-[#000033]">
            Projected monthly spend: <Info className="size-3.5 text-[#646464]" />
          </p>
          <p className="mt-1 text-sm text-[#000033]">$350.00 (based on current pace)</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#000033]">Billing cycle:</p>
          <p className="mt-1 text-sm text-[#000033]">May 1, 2025 – May 31, 2025</p>
        </div>
      </div>

      <div className="my-6 border-t border-[#e0e0e0]" />

      <h2 className="text-xl font-semibold text-[#000033]">Payment options</h2>

      <div className="mt-4 rounded-lg border border-[#e0e0e0] p-6">
        {/* Automatic Payments */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="radio"
            name="paymentOption"
            checked={paymentOption === "auto"}
            onChange={() => setPaymentOption("auto")}
            className="mt-1 size-4 accent-[#212be9]"
          />
          <div className="flex-1">
            <p className="font-semibold text-[#000033]">Automatic Payments</p>
            <p className="mt-1 text-sm text-[#646464]">
              Automatically add credits when your balance drops below a threshold.
            </p>
          </div>
        </label>

        {paymentOption === "auto" && (
          <div className="ml-7 mt-4 flex items-center gap-3">
            <div className="relative">
              <select
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                disabled={autoPayEnabled}
                className="h-10 w-[260px] appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9] disabled:bg-[#f5f5f5] disabled:text-[#646464]"
              >
                {creditOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
            </div>
            {autoPayEnabled ? (
              <button
                onClick={() => setAutoPayEnabled(false)}
                className="rounded-md border border-[#212be9] px-4 py-1.5 text-sm font-medium text-[#212be9] hover:bg-[#f5f5ff]"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmAutoModal(true)}
                className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a22c4]"
              >
                Confirm credit amount
              </button>
            )}
          </div>
        )}

        <div className="my-5 border-t border-[#e0e0e0]" />

        {/* One Time Payments */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="radio"
            name="paymentOption"
            checked={paymentOption === "one-time"}
            onChange={handleSwitchToOneTime}
            className="mt-1 size-4 accent-[#212be9]"
          />
          <div className="flex-1">
            <p className="font-semibold text-[#000033]">One Time Payments</p>
            <p className="mt-1 text-sm text-[#646464]">
              Manually purchase credits when needed.
            </p>
          </div>
        </label>

        {paymentOption === "one-time" && (
          <div className="ml-7 mt-4 flex items-center gap-3">
            <div className="relative">
              <select
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="h-10 w-[260px] appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]"
              >
                <option value="">Select credit amount</option>
                {creditOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
            </div>
            <button
              disabled={!creditAmount}
              className="rounded-md bg-[#212be9]/50 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed"
            >
              Confirm credit amount
            </button>
          </div>
        )}
      </div>

      {/* Confirm Auto Modal */}
      {showConfirmAutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[440px] rounded-xl bg-white p-8 shadow-xl">
            <h3 className="text-lg font-semibold text-[#000033]">Set up automatic payments?</h3>
            <p className="mt-3 text-sm text-[#646464]">
              We&apos;ll automatically add ${selectedCredit ? selectedCredit.label.split("$")[1] : "100"} to your account whenever your balance drops below $10.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmAutoModal(false)}
                className="rounded-md border border-[#e0e0e0] px-4 py-2 text-sm font-medium text-[#000033] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAuto}
                className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a22c4]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unselect Auto Modal */}
      {showUnselectAutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[440px] rounded-xl bg-white p-8 shadow-xl">
            <h3 className="text-lg font-semibold text-[#000033]">Unselecting Automatic payments?</h3>
            <p className="mt-3 text-sm text-[#646464]">
              Automatic payments will add credits whenever your balance is low. One time payments require you to manually purchase credits. Are you sure you want to switch?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUnselectAutoModal(false)}
                className="rounded-md border border-[#e0e0e0] px-4 py-2 text-sm font-medium text-[#000033] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitchToOneTime}
                className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a22c4]"
              >
                Yes, select One Time Payments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

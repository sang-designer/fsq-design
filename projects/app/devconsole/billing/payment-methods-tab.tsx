"use client";

import { useState, useRef, useEffect } from "react";
import { X, CheckCircle, ChevronDown } from "lucide-react";
import { states } from "./data";

export default function PaymentMethodsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div>
      <h2 className="mt-2 text-xl font-semibold text-[#000033]">Billing information</h2>

      <div className="mt-4 flex gap-4">
        {/* Primary Card */}
        <div className="flex w-[280px] flex-col justify-between rounded-lg border border-[#e0e0e0] p-5">
          <div>
            <div className="flex items-start justify-between">
              <p className="font-semibold text-[#000033]">Primary</p>
              <span className="text-sm font-bold text-[#1a1f71]">VISA</span>
            </div>
            <p className="mt-2 text-sm text-[#646464]">Visa ending ...4242xxz</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#16a34a] px-2 py-0.5 text-xs font-semibold text-white">
              <CheckCircle className="size-3" />
              Payment method verified
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={() => setShowDeleteModal(true)} className="text-sm text-red-500 hover:underline">
              Remove
            </button>
            <button className="rounded-md border border-[#212be9] px-4 py-1.5 text-sm font-medium text-[#212be9] hover:bg-[#f5f5ff]">
              Edit
            </button>
          </div>
        </div>

        {/* Add backup card */}
        <div
          onClick={() => setShowAddModal(true)}
          className="flex min-h-[160px] w-[280px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#e0e0e0] hover:border-[#212be9] hover:bg-[#f5f5ff]"
        >
          <span className="text-sm font-medium text-[#212be9]">+ Add a backup payment method</span>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddModal && <AddPaymentModal onClose={() => setShowAddModal(false)} />}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[440px] rounded-xl bg-white p-8 shadow-xl">
            <h3 className="text-lg font-semibold text-[#000033]">Delete Primary Payment Method?</h3>
            <p className="mt-3 text-sm text-[#646464]">
              Deleting your primary payment method will disable automatic payments and may interrupt your service if your credit balance runs out. Are you sure?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md border border-[#e0e0e0] px-4 py-2 text-sm font-medium text-[#000033] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddPaymentModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    cardNumber: "", expiry: "", cvc: "", name: "",
    address1: "", address2: "", city: "", zip: "", state: "", country: "United States",
    setPrimary: false,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const update = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));
  const inputClass = "h-10 w-full rounded-md border border-[#e0e0e0] bg-white px-3 text-sm text-[#000033] outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={ref} className="w-[520px] rounded-xl bg-white shadow-xl">
        <div className="max-h-[80vh] overflow-y-auto px-8 pb-2 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#000033]">Add payment method</h2>
            <button onClick={onClose} className="flex size-8 items-center justify-center rounded hover:bg-gray-100">
              <X className="size-4 text-[#646464]" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#000033]">Card number <span className="text-red-500">*</span></label>
              <input value={form.cardNumber} onChange={(e) => update("cardNumber", e.target.value)} className={inputClass} />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#000033]">Expiry date <span className="text-red-500">*</span></label>
                <input value={form.expiry} onChange={(e) => update("expiry", e.target.value)} placeholder="MM/YY" className={inputClass + " placeholder:text-[#8d8d8d]"} />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#000033]">CVC <span className="text-red-500">*</span></label>
                <input value={form.cvc} onChange={(e) => update("cvc", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#000033]">Name on card <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold text-[#000033]">Billing address <span className="text-red-500">*</span></label>
              <input value={form.address1} onChange={(e) => update("address1", e.target.value)} placeholder="Address 1" className={inputClass + " placeholder:text-[#8d8d8d]"} />
              <input value={form.address2} onChange={(e) => update("address2", e.target.value)} placeholder="Address 2" className={inputClass + " placeholder:text-[#8d8d8d]"} />
              <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className={inputClass + " placeholder:text-[#8d8d8d]"} />
              <div className="flex gap-4">
                <input value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="Zip code" className={inputClass + " flex-1 placeholder:text-[#8d8d8d]"} />
                <div className="relative flex-1">
                  <select value={form.state} onChange={(e) => update("state", e.target.value)} className="h-10 w-full appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]">
                    <option value="">State</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
                </div>
              </div>
              <div className="relative">
                <select value={form.country} onChange={(e) => update("country", e.target.value)} className="h-10 w-full appearance-none rounded-md border border-[#e0e0e0] bg-white px-3 pr-9 text-sm text-[#000033] outline-none transition-colors focus:border-[#212be9] focus:ring-1 focus:ring-[#212be9]">
                  <option>United States</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#646464]" />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.setPrimary} onChange={(e) => update("setPrimary", e.target.checked)} className="size-4 accent-[#212be9]" />
              <span className="text-sm text-[#000033]">Set as primary payment method for your account.</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-6">
          <button onClick={onClose} className="rounded-md border border-[#212be9] px-4 py-2 text-sm font-medium text-[#212be9] hover:bg-[#f5f5ff]">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-md bg-[#212be9] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a22c4]">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

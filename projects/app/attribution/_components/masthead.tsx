"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleAlert, FileText, Grid3X3, LogOut, UserCircle } from "lucide-react";
import { NotificationBell } from "./alerts/notification-bell";

/** The app masthead: logo, signals, help, docs, account menu, app switcher. Matches the campaign list page. */
export function Masthead() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-12">
      <Link href="/attribution" className="flex items-center gap-0.5">
        <span className="text-lg font-semibold tracking-tight text-[#000033]">FSQ</span>
        <span className="font-mono text-lg font-medium text-[#000033]">/</span>
        <span className="font-mono text-lg font-medium text-[#000033]">attribution</span>
      </Link>
      <div className="flex items-center">
        <div className="flex items-center gap-4 px-4">
          <NotificationBell />
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
            <CircleAlert className="size-4" />
          </button>
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
            <FileText className="size-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex size-9 items-center justify-center rounded-md text-[#555] transition-all duration-200 hover:bg-gray-50 ${userMenuOpen ? "ring-2 ring-[#212be9] ring-offset-2" : ""}`}
            >
              <UserCircle className="size-4" />
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-md border border-border bg-white shadow-lg">
                  <div className="border-b border-border p-3">
                    <p className="text-sm font-medium text-[#000033]">Sang Yeo</p>
                    <p className="text-sm text-[#8d8d8d]">syeo@foursquare.com</p>
                  </div>
                  <div className="p-1">
                    <p className="px-2 py-1.5 text-[11px] font-medium tracking-wide text-[#8d8d8d]">SETTINGS</p>
                    <div className="flex flex-col">
                      {["Profile", "Admin Dashboard", "Permission Groups", "Impersonate"].map((item) =>
                        item === "Permission Groups" || item === "Admin Dashboard" ? (
                          <Link
                            key={item}
                            href={item === "Permission Groups" ? "/attribution/permission-groups" : "/attribution/admin"}
                            className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {item}
                          </Link>
                        ) : (
                          <button key={item} className="w-full rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50">
                            {item}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="border-t border-border p-1">
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#000033] transition-colors hover:bg-gray-50">
                      <LogOut className="size-4 text-[#555]" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center border-l border-border pl-4">
          <button className="flex size-9 items-center justify-center rounded-md text-[#555] hover:bg-gray-50">
            <Grid3X3 className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

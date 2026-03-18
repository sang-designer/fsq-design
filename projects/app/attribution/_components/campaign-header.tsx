"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#e0e0e0] bg-white px-12">
      <div className="flex items-center gap-16">
        <Link href="/attribution" className="flex items-center gap-0.5 font-mono text-lg font-medium text-[#000033]">
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
  );
}

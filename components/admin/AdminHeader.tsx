"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-charcoal-800">
      <div className="flex items-center gap-3">
        <Image src="/logo/FFM.Final.png" alt="Logo" width={36} height={36} className="w-9 h-9" />
        <div>
          <span className="text-sm font-bold text-white">FFM Admin</span>
          <span className="text-xs text-charcoal-500 ml-2">Dashboard</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a href="/" target="_blank" className="text-xs text-charcoal-400 hover:text-white transition-colors">
          View Site
        </a>
        <button onClick={handleLogout} className="text-xs text-charcoal-400 hover:text-red-400 transition-colors">
          Sign Out
        </button>
      </div>
    </header>
  );
}

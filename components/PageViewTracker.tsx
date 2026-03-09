"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function getVisitorId(): string {
  const key = "ffm_vid";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    if (pathname.startsWith("/admin")) return;
    lastPath.current = pathname;

    try {
      const visitorId = getVisitorId();
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
          visitorId,
        }),
      }).catch(() => {});
    } catch {
      // Analytics should never break the site
    }
  }, [pathname]);

  return null;
}

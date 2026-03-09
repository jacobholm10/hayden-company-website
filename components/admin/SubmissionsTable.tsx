"use client";

import { useState } from "react";

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string | null;
  message: string;
  items: string | null;
  supplies: string | null;
  is_read: boolean;
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SubmissionsTable({ submissions: rawSubmissions }: { submissions: any[] }) {
  const submissions = rawSubmissions as Submission[];
  const [expanded, setExpanded] = useState<number | null>(null);

  async function markRead(id: number) {
    await fetch(`/api/admin/submissions/${id}/read`, { method: "POST" });
  }

  return (
    <div className="space-y-2">
      {submissions.length === 0 && (
        <p className="text-charcoal-500 text-sm py-8 text-center">No submissions yet</p>
      )}
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className={`bg-charcoal-800 rounded-xl border transition-colors ${
            sub.is_read ? "border-charcoal-700" : "border-warm-600/40"
          }`}
        >
          <button
            onClick={() => {
              setExpanded(expanded === sub.id ? null : sub.id);
              if (!sub.is_read) markRead(sub.id);
            }}
            className="w-full px-5 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              {!sub.is_read && <span className="w-2 h-2 bg-warm-500 rounded-full flex-shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{sub.name}</p>
                <p className="text-xs text-charcoal-400 truncate">
                  {sub.service} &middot; {new Date(sub.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-charcoal-500 transition-transform ${expanded === sub.id ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expanded === sub.id && (
            <div className="px-5 pb-5 space-y-3 border-t border-charcoal-700 pt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-charcoal-500 text-xs">Email</p>
                  <a href={`mailto:${sub.email}`} className="text-warm-400 hover:underline">{sub.email}</a>
                </div>
                <div>
                  <p className="text-charcoal-500 text-xs">Phone</p>
                  <a href={`tel:${sub.phone}`} className="text-warm-400 hover:underline">{sub.phone}</a>
                </div>
                {sub.preferred_date && (
                  <div>
                    <p className="text-charcoal-500 text-xs">Preferred Date</p>
                    <p className="text-charcoal-200">{new Date(sub.preferred_date).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-charcoal-500 text-xs">Service</p>
                  <p className="text-charcoal-200">{sub.service}</p>
                </div>
              </div>
              {sub.items && (
                <div>
                  <p className="text-charcoal-500 text-xs mb-1">Items</p>
                  <p className="text-charcoal-200 text-sm">{sub.items}</p>
                </div>
              )}
              {sub.supplies && (
                <div>
                  <p className="text-charcoal-500 text-xs mb-1">Supplies</p>
                  <p className="text-charcoal-200 text-sm">{sub.supplies}</p>
                </div>
              )}
              <div>
                <p className="text-charcoal-500 text-xs mb-1">Message</p>
                <p className="text-charcoal-200 text-sm">{sub.message}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { CONTACT } from "@/lib/constants";

const ITEMS_TO_MOVE = [
  "Boxes",
  "Mattresses",
  "Tables",
  "Dressers",
  "Nightstands",
  "Recliners",
  "Cribs",
  "China Hutch",
  "Lamps",
  "Miscellaneous",
];

const TODAY_ISO = new Date().toISOString().split("T")[0];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const items = ITEMS_TO_MOVE
      .filter((item) => formData.get(`item-${item.toLowerCase().replace(/\s+/g, "-")}`) === "on")
      .join(", ");

    const supplies = ["Mattress Boxes", "Wardrobe Boxes", "Packing Supplies (tape, paper, etc.)"]
      .filter((item) => formData.get(`supplies-${item.toLowerCase().replace(/[\s(),.]+/g, "-")}`) === "on")
      .join(", ");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          service: formData.get("service"),
          date: formData.get("date") || null,
          message: formData.get("message"),
          items: items || null,
          supplies: supplies || null,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setIsSubmitted(true);
    } catch {
      setError("We couldn't send your message. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">Thank you!</h3>
        <p className="text-green-700">
          We&apos;ve received your message and will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full px-4 py-3 bg-white border border-charcoal-200 rounded-xl text-sm focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 outline-none transition-all duration-200 placeholder:text-charcoal-500";
  const labelClasses = "block text-sm font-medium text-charcoal-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name <span className="text-warm-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={inputClasses}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>
            Phone <span className="text-warm-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className={inputClasses}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          Email <span className="text-warm-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={inputClasses}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="service" className={labelClasses}>
          Service Type <span className="text-warm-500">*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className={inputClasses}
        >
          <option value="">Select a service</option>
          <option value="moving">Moving Services</option>
          <option value="junk-removal">Junk Removal</option>
          <option value="both">Both</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Packing Supplies */}
      <div>
        <span className={labelClasses}>Need Packing Supplies?</span>
        <div className="mt-2 space-y-2.5">
          {["Mattress Boxes", "Wardrobe Boxes", "Packing Supplies (tape, paper, etc.)"].map(
            (item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name={`supplies-${item.toLowerCase().replace(/[\s(),.]+/g, "-")}`}
                  className="w-4.5 h-4.5 text-warm-600 border-charcoal-300 rounded focus:ring-warm-500/20 accent-warm-600"
                />
                <span className="text-sm text-charcoal-600 group-hover:text-charcoal-900 transition-colors">
                  {item}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Items to Move - conditional */}
      {(serviceType === "moving" || serviceType === "both") && (
        <div>
          <span className={labelClasses}>What are you moving?</span>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            {ITEMS_TO_MOVE.map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name={`item-${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="w-4.5 h-4.5 text-warm-600 border-charcoal-300 rounded focus:ring-warm-500/20 accent-warm-600"
                />
                <span className="text-sm text-charcoal-600 group-hover:text-charcoal-900 transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="date" className={labelClasses}>
          Preferred Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          min={TODAY_ISO}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Message <span className="text-warm-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className={`${inputClasses} resize-none`}
          placeholder="Tell us about your moving or junk removal needs..."
        />
      </div>

      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <p className="text-sm font-semibold text-red-900">
            Something went wrong
          </p>
          <p className="text-sm text-red-800 mt-1">{error}</p>
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-red-900 underline underline-offset-2 hover:text-red-700"
          >
            Or call {CONTACT.phone} directly
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-warm-600 text-white py-4 rounded-xl font-semibold text-base hover:bg-warm-700 transition-all duration-200 disabled:bg-charcoal-300 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-warm-600/25"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}

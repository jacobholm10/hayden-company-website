import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { CONTACT } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Finn's Family Moving",
  description:
    "Get a free quote from Finn's Family Moving. Contact us for moving and junk removal services in the Twin Cities.",
  openGraph: {
    title: "Contact Us | Finn's Family Moving",
    description:
      "Get a free quote from Finn's Family Moving. Contact us for moving and junk removal services in the Twin Cities.",
    url: "https://finnsfamilymoving.com/contact",
    images: [
      {
        url: "/photos/moving-mattress.jpg",
        width: 1200,
        height: 630,
        alt: "Finn's Family Moving team at work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Finn's Family Moving",
    description:
      "Get a free quote from Finn's Family Moving. Contact us for moving and junk removal services in the Twin Cities.",
    images: ["/photos/moving-mattress.jpg"],
  },
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-end">
        <Image
          src="/photos/moving-mattress.jpg"
          alt="Our team at work"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pb-16 md:pb-20 pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-400 mb-3">
            Contact Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Let&apos;s get you
            <span className="text-warm-400"> moving.</span>
          </h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form - takes more space */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-charcoal-100 p-6 md:p-10">
                <h2 className="text-xl font-bold tracking-tight mb-1">
                  Request a Free Quote
                </h2>
                <p className="text-sm text-charcoal-500 mb-8">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Call */}
              <div className="bg-warm-600 rounded-2xl p-8 text-white">
                <h3 className="font-bold text-lg mb-2">Need help right away?</h3>
                <p className="text-warm-100 text-sm mb-5">
                  Give us a call and we&apos;ll be happy to help with your move.
                </p>
                <a
                  href={CONTACT.phoneHref}
                  className="inline-flex items-center gap-3 bg-white text-warm-700 px-6 py-3 rounded-full font-semibold hover:bg-warm-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {CONTACT.phone}
                </a>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-2xl border border-charcoal-100 p-8 space-y-6">
                {[
                  {
                    label: "Email",
                    value: CONTACT.email,
                    href: `mailto:${CONTACT.email}`,
                    sub: "We'll respond within 24 hours",
                    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  },
                  {
                    label: "Hours",
                    value: "Mon - Sat: 7am - 7pm",
                    sub: "Sunday: By appointment",
                    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                  {
                    label: "Service Area",
                    value: "Twin Cities & Surrounding",
                    sub: "Contact us to confirm your location",
                    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                  },
                ].map(({ label, value, href, sub, icon }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 bg-warm-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal-500 mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-medium text-charcoal-900 hover:text-warm-600 transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-charcoal-900">{value}</p>
                      )}
                      {sub && <p className="text-xs text-charcoal-500 mt-0.5">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="bg-charcoal-900 rounded-2xl p-8 relative grain overflow-hidden">
                <div className="relative z-10 flex flex-col gap-4">
                  {[
                    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Fully Licensed & Insured" },
                    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "No Hidden Fees" },
                    { icon: "M5 13l4 4L19 7", text: "Free Estimates" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                      <span className="text-sm text-charcoal-300">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

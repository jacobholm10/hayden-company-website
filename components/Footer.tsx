import Link from "next/link";
import Image from "next/image";
import { CONTACT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white relative grain">
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        {/* CTA Banner */}
        <div className="py-12 md:py-16 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ready to make your move?
              </h2>
              <p className="text-charcoal-400 mt-2">
                Get a free, no-obligation quote today.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-warm-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-warm-500 transition-all duration-200 hover:shadow-lg hover:shadow-warm-600/25 whitespace-nowrap"
            >
              Get Your Free Quote
            </Link>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo/FFM.Final.png"
                alt="Finn's Family Moving"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight leading-tight">
                  Finn&apos;s Family
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.15em] leading-tight text-warm-500">
                  Moving
                </span>
              </div>
            </Link>
            <p className="text-charcoal-400 text-sm mt-4 leading-relaxed">
              Family-owned moving and junk removal. We treat your belongings like our own.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400 mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {["Local Moving", "Long-Distance Moving", "Junk Removal", "Packing Services"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/contact"
                      className="text-sm text-charcoal-300 hover:text-warm-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-charcoal-300 hover:text-warm-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-400 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="text-sm text-charcoal-300 hover:text-warm-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-charcoal-300 hover:text-warm-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {CONTACT.email}
                </a>
              </li>
              <li className="text-sm text-charcoal-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mon-Sat: 7am - 7pm
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-charcoal-500">
            &copy; {new Date().getFullYear()} Finn&apos;s Family Moving. All rights reserved.
          </p>
          <p className="text-xs text-charcoal-500">
            Fully licensed & insured
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo/FFM.Final.png"
              alt="Finn's Family Moving"
              width={44}
              height={44}
              className="w-10 h-10 md:w-11 md:h-11 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span
                className={`text-base md:text-lg font-bold tracking-tight leading-tight transition-colors duration-300 ${
                  scrolled ? "text-charcoal-900" : "text-white"
                }`}
              >
                Finn&apos;s Family
              </span>
              <span
                className={`text-[11px] md:text-xs font-medium uppercase tracking-[0.15em] leading-tight transition-colors duration-300 ${
                  scrolled ? "text-warm-600" : "text-warm-300"
                }`}
              >
                Moving
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) =>
              href === "/contact" ? (
                <Link
                  key={href}
                  href={href}
                  className="ml-4 bg-warm-600 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-warm-700 transition-all duration-200 hover:shadow-lg hover:shadow-warm-600/25"
                >
                  Get a Quote
                </Link>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? scrolled
                        ? "text-warm-700 bg-warm-50"
                        : "text-white bg-white/15"
                      : scrolled
                        ? "text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled
                ? "text-charcoal-900 hover:bg-charcoal-50"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-64 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-2">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(href)
                    ? scrolled
                      ? "text-warm-700 bg-warm-50"
                      : "text-white bg-white/15"
                    : scrolled
                      ? "text-charcoal-600 hover:bg-charcoal-50"
                      : "text-white/80 hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 bg-warm-600 text-white px-5 py-3 rounded-xl font-medium text-sm text-center hover:bg-warm-700 transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Finn's Family Moving",
  description:
    "Learn about Finn's Family Moving - your trusted local moving and junk removal service. Family-owned and operated.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end">
        <Image
          src="/photos/loading-truck.jpg"
          alt="Our team loading the truck"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pb-16 md:pb-20 pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-400 mb-3">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Built on hard work
            <br />
            <span className="text-warm-400">&amp; family values.</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-600 mb-3">
                Our Story
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Moving is personal. We get that.
              </h2>
              <div className="space-y-4 text-charcoal-500 leading-relaxed">
                <p>
                  Finn&apos;s Family Moving was founded with a simple mission: to provide
                  reliable, affordable moving and junk removal services that treat
                  your belongings like our own.
                </p>
                <p>
                  As a family-owned business, we understand how stressful moving can
                  be. That&apos;s why we go above and beyond to make the process as
                  smooth and stress-free as possible. Every item gets wrapped with
                  care, every piece of furniture handled with respect.
                </p>
                <p>
                  Whether you&apos;re moving across town or need help clearing out
                  unwanted items, our experienced team is here to help every step of
                  the way.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex mt-8 bg-warm-600 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-warm-700 transition-all duration-200 hover:shadow-lg hover:shadow-warm-600/25"
              >
                Work With Us
              </Link>
            </div>
            <div className="relative">
              <div className="photo-card rounded-2xl overflow-hidden aspect-[4/5] relative">
                <Image
                  src="/photos/wrapping-furniture.jpg"
                  alt="Carefully wrapping furniture for protection"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Accent element */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-warm-500/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-warm-500/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-charcoal-900 relative grain">
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-500 mb-3">
              Why Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              What sets us apart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Family Owned",
                description:
                  "We treat every customer like family and every item like it's our own. You're not just a job number to us.",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
              },
              {
                title: "No Hidden Fees",
                description:
                  "What we quote is what you pay. Transparent, competitive pricing with free estimates upfront.",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Fully Insured",
                description:
                  "Your belongings are protected every step of the way. We're fully licensed and insured for your peace of mind.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              },
            ].map(({ title, description, icon }) => (
              <div
                key={title}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-warm-500/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-warm-600/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-charcoal-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Photos */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-600 mb-3">
              The Team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Hard-working people who care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="photo-card rounded-2xl overflow-hidden aspect-[3/4] relative">
              <Image
                src="/photos/moving-mattress.jpg"
                alt="Team working together inside"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="photo-card rounded-2xl overflow-hidden aspect-[3/4] relative">
              <Image
                src="/photos/carrying-couch.jpg"
                alt="Carrying furniture with care"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="photo-card rounded-2xl overflow-hidden aspect-[3/4] relative">
              <Image
                src="/photos/truck-loading-ramp.jpg"
                alt="Loading the moving truck"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20 md:py-28 bg-warm-50">
        <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-600 mb-3">
            Service Area
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Proudly serving the Twin Cities &amp; beyond
          </h2>
          <p className="text-charcoal-500 mt-4 text-lg leading-relaxed">
            We serve the greater Twin Cities metropolitan area and surrounding communities.
            Contact us to confirm service availability in your location.
          </p>
          <Link
            href="/contact"
            className="inline-flex mt-8 bg-warm-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-warm-700 transition-all duration-200 hover:shadow-lg hover:shadow-warm-600/25"
          >
            Check Your Area
          </Link>
        </div>
      </section>
    </div>
  );
}

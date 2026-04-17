import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";

const SERVICES = [
  {
    title: "Local & Long-Distance Moving",
    description:
      "From across town to across the state, our experienced team handles every detail with care. Full-service packing, loading, transport, and unloading.",
    features: ["Residential & commercial", "Full packing services", "Furniture disassembly & reassembly"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
  {
    title: "Junk Removal & Cleanouts",
    description:
      "Got stuff you need gone? We haul away furniture, appliances, yard waste, and more. We donate and recycle whenever possible.",
    features: ["Furniture & appliances", "Estate cleanouts", "Yard waste & debris"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  },
];

const PHOTOS = [
  { src: "/photos/carrying-couch.jpg", alt: "Team carrying furniture", span: "md:col-span-2 md:row-span-2" },
  { src: "/photos/wrapping-furniture.jpg", alt: "Carefully wrapping furniture", span: "" },
  { src: "/photos/loading-truck.jpg", alt: "Loading the moving truck", span: "" },
  { src: "/photos/truck-loading-ramp.jpg", alt: "Loading items up the ramp", span: "" },
  { src: "/photos/junk-removal.jpg", alt: "Junk removal service", span: "" },
];

const TESTIMONIALS = [
  {
    quote: "They showed up right on time and had our entire apartment packed and loaded in under three hours. Nothing was scratched or dented — they wrapped everything like pros. Honestly the smoothest move I've ever had.",
    name: "Sarah M.",
    service: "Local Move",
    rating: 5,
  },
  {
    quote: "We had a basement full of junk we'd been putting off for years. The guys were super friendly, worked fast, and the price was exactly what they quoted. No surprises. I'd call them again in a heartbeat.",
    name: "David R.",
    service: "Junk Removal",
    rating: 5,
  },
  {
    quote: "Moved my 90-year-old mother out of her home of 40 years. The crew was so patient and careful with her things — they treated every box like it was their own grandmother's. Can't recommend them enough.",
    name: "Jennifer L.",
    service: "Local Move",
    rating: 5,
  },
  {
    quote: "Called on a Wednesday and they fit us in by Friday. Fair price, hard workers, and genuinely nice guys. They even helped us rearrange furniture in the new place without being asked.",
    name: "Marcus T.",
    service: "Local Move",
    rating: 5,
  },
];

const reviewsJsonLd = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  name: "Finn's Family Moving",
  url: "https://finnsfamilymoving.com",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: (
      TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length
    ).toFixed(1),
    reviewCount: TESTIMONIALS.length,
    bestRating: 5,
    worstRating: 1,
  },
  review: TESTIMONIALS.map((t) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: { "@type": "Person", name: t.name },
    reviewBody: t.quote,
  })),
};

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />
      {/* Hero Section - Full-bleed photo */}
      <section className="relative min-h-[90vh] flex items-end">
        <Image
          src="/photos/carrying-couch.jpg"
          alt="Finn's Family Moving team in action"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pb-16 md:pb-24 pt-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-warm-600/90 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-6 animate-fade-up">
              <span className="w-2 h-2 bg-white rounded-full" />
              Family-Owned & Operated
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Moving made
              <span className="text-warm-400"> simple.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mt-6 leading-relaxed max-w-lg animate-fade-up animate-delay-200">
              Professional moving and junk removal services in the Twin Cities area.
              We handle the heavy lifting so you don&apos;t have to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-up animate-delay-300">
              <Link
                href="/contact"
                className="bg-warm-600 text-white px-8 py-4 rounded-full font-semibold text-center hover:bg-warm-500 transition-all duration-200 hover:shadow-lg hover:shadow-warm-600/30"
              >
                Get a Free Quote
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-center hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                Call {CONTACT.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-charcoal-900 relative grain">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-charcoal-300">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Fully Insured" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", text: "Family Owned" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "7 Days a Week" },
              { icon: "M5 13l4 4L19 7", text: "Free Estimates" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-600 mb-3">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Services built around your needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group bg-white rounded-2xl p-8 md:p-10 border border-charcoal-100 hover:border-warm-200 transition-all duration-300 hover:shadow-xl hover:shadow-warm-600/5"
              >
                <div className="w-12 h-12 bg-warm-50 rounded-xl flex items-center justify-center text-warm-600 mb-6 group-hover:bg-warm-100 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-charcoal-500 leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-charcoal-600">
                      <svg className="w-4 h-4 text-warm-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 md:py-28 bg-charcoal-900 relative grain">
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-500 mb-3">
              Our Work
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              See us in action
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className={`photo-card rounded-xl overflow-hidden ${photo.span} aspect-square relative`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-600 mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Three steps to a stress-free move
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Request a Quote",
                description: "Tell us about your move or junk removal needs. We'll give you a free, transparent estimate with no hidden fees.",
              },
              {
                step: "02",
                title: "We Show Up Ready",
                description: "Our experienced team arrives on time with all the equipment needed. We handle packing, wrapping, and loading.",
              },
              {
                step: "03",
                title: "Sit Back & Relax",
                description: "We take care of the heavy lifting from start to finish. Your belongings arrive safe and sound at their destination.",
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="relative">
                <span className="text-6xl md:text-7xl font-bold text-charcoal-100 leading-none">
                  {step}
                </span>
                <h3 className="text-lg font-bold mt-4 mb-2 tracking-tight">{title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-charcoal-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-600 mb-3">
              What Our Customers Say
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Trusted by families across the Twin Cities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map(({ quote, name, service, rating }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-8 border border-charcoal-100 flex flex-col"
              >
                <div
                  className="flex gap-0.5 mb-4"
                  role="img"
                  aria-label={`Rated ${rating} out of 5 stars`}
                >
                  {[...Array(rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-warm-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-charcoal-600 text-sm leading-relaxed flex-1">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-6 pt-5 border-t border-charcoal-100">
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">{service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Image
          src="/photos/truck-loading-ramp.jpg"
          alt="Our team loading the truck"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal-900/80" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Let us handle the heavy lifting
          </h2>
          <p className="text-white/70 mt-4 text-lg">
            Contact us today for a free, no-obligation quote.
            We&apos;re here to make your move stress-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/contact"
              className="bg-warm-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-warm-500 transition-all duration-200 hover:shadow-lg hover:shadow-warm-600/30"
            >
              Get Your Free Quote
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-200"
            >
              Call {CONTACT.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

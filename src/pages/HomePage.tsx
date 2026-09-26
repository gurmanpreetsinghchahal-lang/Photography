import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  ChevronRight,
  Phone,
  MessageSquare,
  Award,
  Heart,
  Film,
  Camera,
  Layers,
  MapPin,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import { Service, Package, PortfolioImage, Testimonial, Offer } from '../types/index.ts';
import { Lightbox } from '../components/Lightbox.tsx';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load home page data concurrently
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => setServices(data.slice(0, 6)))
      .catch((e) => console.error(e));

    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => setPortfolio(data))
      .catch((e) => console.error(e));

    fetch('/api/packages')
      .then((r) => r.json())
      .then((data) => setPackages(data.slice(0, 3)))
      .catch((e) => console.error(e));

    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => setTestimonials(data))
      .catch((e) => console.error(e));

    fetch('/api/offers')
      .then((r) => r.json())
      .then((data) => setOffers(data))
      .catch((e) => console.error(e));
  }, []);

  const filteredPortfolio =
    selectedCategory === 'all'
      ? portfolio
      : portfolio.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#0b0c10] text-neutral-100 min-h-screen">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Full-screen cinematic background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=85"
            alt="Royal Wedding Photography"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle multi-layer vignette and gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
          {/* Subtle Gold Ribbon Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-amber-400/40 text-amber-300 text-xs tracking-[0.2em] uppercase font-semibold mb-6 shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>22+ Years of Royal Indian Wedding Cinema</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
            {settings?.heroHeadline || 'Your Moments. Our Passion. Your Memories Forever.'}
          </h1>

          <p className="text-base sm:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed mb-10">
            {settings?.heroSubheadline ||
              'Award-winning wedding, portrait, and cinematic photography crafted with timeless elegance, heartfelt emotions, and devotion.'}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('/book')}
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-md transition-all shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Session</span>
            </button>

            <button
              onClick={() => onNavigate('/portfolio')}
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-700 hover:border-amber-400/50 rounded-md transition-all backdrop-blur-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Explore Portfolio</span>
            </button>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="mt-14 pt-8 border-t border-neutral-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-neutral-400 text-xs uppercase tracking-widest">
            <div>
              <span className="block font-serif text-2xl font-bold text-amber-300">1,800+</span>
              <span>Weddings Documented</span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold text-amber-300">22+</span>
              <span>Years of Mastery</span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold text-amber-300">100%</span>
              <span>Archival Print Quality</span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold text-amber-300">4.9 ★</span>
              <span>Google Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACTIVE SEASONAL OFFER BANNER (If active) */}
      {offers.length > 0 && (
        <section className="bg-gradient-to-r from-neutral-950 via-amber-950/40 to-neutral-950 border-y border-amber-500/30 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-semibold tracking-widest text-amber-400">
                  {offers[0].discountText}
                </span>
                <h4 className="font-serif text-xl font-bold text-white">{offers[0].title}</h4>
                <p className="text-xs text-neutral-400">{offers[0].description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {offers[0].code && (
                <div className="px-3 py-1.5 rounded bg-black/60 border border-dashed border-amber-400/60 font-mono text-xs text-amber-300">
                  USE CODE: <span className="font-bold">{offers[0].code}</span>
                </div>
              )}
              <button
                onClick={() => onNavigate('/book')}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded transition-colors whitespace-nowrap"
              >
                Claim Privilege
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. WHY CHOOSE LAXMI DIGITAL PHOTO STUDIO */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Our Distinction
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Why Choose Laxmi Digital Studio
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            We don’t just click photos; we preserve legacy emotions, sacred rituals, and authentic laughter with timeless fine-art aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Camera className="w-7 h-7 text-amber-400" />,
              title: 'Master Photographers',
              desc: 'Seasoned candid artists and traditional portraitists who understand the subtle nuances and timing of Indian ceremonies.',
            },
            {
              icon: <Film className="w-7 h-7 text-amber-400" />,
              title: 'Cinema & 4K Aerials',
              desc: 'Full-frame cinema lenses, gimbal stabilization, and FAA/DGCA-compliant drone choreography capturing sweeping aerial majesty.',
            },
            {
              icon: <Layers className="w-7 h-7 text-amber-400" />,
              title: 'Handcrafted Albums',
              desc: 'Italian velvet, fine leather, and non-fading Kodak Endura HD paper bindings crafted to last across multiple family generations.',
            },
            {
              icon: <ShieldCheck className="w-7 h-7 text-amber-400" />,
              title: 'Punctual & Trustworthy',
              desc: 'Prompt delivery timelines, transparent written contracts, dedicated backup camera bodies, and cloud preservation.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/60 border border-neutral-800/80 p-8 rounded-xl hover:border-amber-400/40 transition-all group hover:-translate-y-1 duration-200"
            >
              <div className="w-14 h-14 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-6 group-hover:border-amber-400/60 group-hover:bg-amber-950/20 transition-all">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PHOTOGRAPHY SERVICES */}
      <section className="py-24 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
                Studio Expertise
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
                Featured Photography Services
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/services')}
              className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 font-medium group cursor-pointer"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-neutral-900/70 border border-neutral-800/90 rounded-xl overflow-hidden hover:border-amber-400/50 transition-all group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {service.startingPrice && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-neutral-700 rounded text-xs text-amber-300 font-medium">
                      Starts from ₹{service.startingPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-200 transition-colors mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onNavigate(`/services/${service.slug}`)}
                      className="text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onNavigate('/book')}
                      className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded transition-colors"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED PORTFOLIO MASONRY WITH LIGHTBOX */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Visual Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Masterpieces From Our Lens
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Every frame is captured with painterly illumination, authentic soul, and timeless editorial styling.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Works' },
            { id: 'weddings', label: 'Weddings' },
            { id: 'pre-weddings', label: 'Pre-Weddings' },
            { id: 'portraits', label: 'Fine Portraits' },
            { id: 'events', label: 'Events' },
            { id: 'studio', label: 'Albums & Studio' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.slice(0, 9).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80 aspect-[4/3]"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  {item.category}
                </span>
                <h4 className="font-serif text-xl font-bold text-white mt-1">{item.title}</h4>
                {item.location && (
                  <p className="text-xs text-neutral-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{item.location}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/portfolio')}
            className="px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400 rounded-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Explore Entire Studio Archive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. ABOUT THE STUDIO SUMMARY SECTION */}
      <section className="py-24 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Visual Collage */}
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[4/5] max-w-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
                  alt="Photography Philosophy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 z-20 bg-neutral-900/95 border border-amber-400/40 p-6 rounded-xl shadow-2xl backdrop-blur-md max-w-xs hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs">
                    22
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-white">Years of Devotion</h5>
                    <p className="text-[10px] text-amber-300">Founded in New Delhi</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400">
                  Documenting generations of families with reverence, intimacy, and fine-art vision.
                </p>
              </div>
            </div>

            {/* Story Text */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
                About Laxmi Digital Photo Studio
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Where Tradition Meets Modern Cinematic Artistry
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Founded with a camera and an unwavering passion for Indian celebrations, Laxmi Digital Photo Studio has grown from a humble Delhi darkroom into one of North India’s most respected luxury wedding photography houses.
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We believe true photography is not about forcing poses or manufacturing artificial smiles. It is about anticipating the fleeting teardrop during the Bidai, the electric burst of laughter during the Sangeet dance battle, and the quiet glance between two souls as they take the seven sacred vows.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="border-l-2 border-amber-400/60 pl-4">
                  <h4 className="font-serif text-xl font-bold text-white">Authentic Moments</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Unobtrusive candid artists who let your wedding flow naturally.
                  </p>
                </div>
                <div className="border-l-2 border-amber-400/60 pl-4">
                  <h4 className="font-serif text-xl font-bold text-white">Heirloom Quality</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Fine-art albums that remain as vivid 50 years later as the day of your wedding.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('/about')}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded transition-colors"
                >
                  Read Our Full Story
                </button>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 rounded transition-colors"
                >
                  Visit Our Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SELECTED PACKAGES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Transparent Investments
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Curated Wedding & Event Packages
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            All packages are customizable to your family's specific rituals, dates, and destination requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                pkg.isFeatured
                  ? 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-amber-400/80 shadow-2xl shadow-amber-950/30 -translate-y-2'
                  : 'bg-neutral-900/60 border border-neutral-800'
              }`}
            >
              {pkg.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-amber-300 text-neutral-950 text-[10px] font-bold uppercase tracking-widest rounded-full shadow">
                  Most Popular Choice
                </div>
              )}

              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">{pkg.name}</h3>
                {pkg.duration && <p className="text-xs text-neutral-400 mb-4">{pkg.duration}</p>}

                <div className="my-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-amber-300">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-sm text-neutral-500 line-through">
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400">All-inclusive studio package</span>
                </div>

                <p className="text-xs text-neutral-300 mb-6 leading-relaxed">{pkg.description}</p>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                    Package Deliverables:
                  </p>
                  {pkg.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('/book')}
                className={`w-full py-3 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  pkg.isFeatured
                    ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                Reserve This Package
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/packages')}
            className="text-xs uppercase tracking-widest text-amber-300 hover:text-amber-200 font-semibold inline-flex items-center gap-1.5"
          >
            <span>View All Packages & Pricing Options</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. CLIENT TESTIMONIALS */}
      <section className="py-24 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              Client Reverence
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
              Words From Our Couples & Families
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Nothing honors our studio more than the heartfelt gratitude of families whose most sacred days we were blessed to capture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-neutral-900/50 border border-neutral-800/80 p-8 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-300 italic leading-relaxed mb-6 font-serif">
                    “{test.review}”
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                  {test.avatarUrl ? (
                    <img
                      src={test.avatarUrl}
                      alt={test.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300">
                      {test.clientName[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">{test.clientName}</h4>
                    <p className="text-[11px] text-amber-400/90">{test.clientRole || 'Wedding Couple'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-amber-500/30 p-8 sm:p-16 text-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/30 via-neutral-950/80 to-amber-950/30 z-0" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              Reserve Your Dates
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              Let's Create Something Beautiful Together.
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Wedding and celebration dates fill quickly across India. Connect with our principal photographer to discuss your dream vision and lock in your dates today.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('/book')}
                className="w-full sm:w-auto px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-md transition-all shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Session</span>
              </button>

              <a
                href={`https://wa.me/${(settings?.whatsappNumber || '919810234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Hello Laxmi Digital Photo Studio, I would like to enquire about wedding photography availability.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Talk on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox modal for photo inspection */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredPortfolio}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => ((prev! + 1) % filteredPortfolio.length))}
          onPrev={() =>
            setLightboxIndex((prev) => (prev! === 0 ? filteredPortfolio.length - 1 : prev! - 1))
          }
        />
      )}
    </div>
  );
};

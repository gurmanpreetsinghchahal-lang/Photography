import React, { useState, useEffect } from 'react';
import { Service, Package } from '../types/index.ts';
import { ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
  selectedSlug?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, selectedSlug }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [activeService, setActiveService] = useState<(Service & { packages?: Package[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        if (selectedSlug) {
          fetch(`/api/services/${selectedSlug}`)
            .then((r) => r.json())
            .then((s) => setActiveService(s))
            .catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [selectedSlug]);

  // If a specific service slug is opened, render the dedicated Service Detail view
  if (selectedSlug && activeService) {
    return (
      <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
            <button onClick={() => onNavigate('/')} className="hover:text-amber-300">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <button onClick={() => onNavigate('/services')} className="hover:text-amber-300">
              Services
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-amber-300 font-medium">{activeService.name}</span>
          </div>

          {/* Service Hero */}
          <div className="relative rounded-3xl overflow-hidden mb-16 aspect-[21/9] min-h-[350px]">
            <img
              src={activeService.imageUrl}
              alt={activeService.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8 sm:p-12">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold mb-2">
                Specialized Photography Experience
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3">
                {activeService.name}
              </h1>
              {activeService.tagline && (
                <p className="text-base sm:text-lg text-neutral-200 font-light max-w-2xl">
                  {activeService.tagline}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Left 2 Cols: Description & Features */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">
                  The Experience & Approach
                </h3>
                <p className="text-neutral-300 leading-relaxed text-base">
                  {activeService.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-6">
                  What’s Included in Our Coverage
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeService.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl flex items-start gap-3 text-sm text-neutral-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {activeService.faqs && activeService.faqs.length > 0 && (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                  <div className="space-y-4">
                    {activeService.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-6"
                      >
                        <h4 className="font-medium text-white text-base mb-2">{faq.question}</h4>
                        <p className="text-sm text-neutral-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: Quick Booking Card */}
            <div>
              <div className="sticky top-28 bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                    Investment Starting At
                  </span>
                  <div className="font-serif text-3xl font-bold text-white mt-1">
                    ₹{activeService.startingPrice?.toLocaleString('en-IN') || 'Custom Quote'}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Flexible installment schedules available for all events.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => onNavigate(`/book?service=${encodeURIComponent(activeService.name)}`)}
                    className="w-full py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-md transition-all shadow-md active:scale-95 cursor-pointer text-center block"
                  >
                    Check Date Availability
                  </button>

                  <button
                    onClick={() => onNavigate('/contact')}
                    className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                  >
                    Custom Studio Inquiry
                  </button>
                </div>

                <div className="text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                  <p>• Multi-camera 4K Cinema setups</p>
                  <p>• Archival Italian binding included in premier tiers</p>
                  <p>• Nationwide and destination travel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // All Services Overview
  return (
    <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Fine Art Services
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mt-2 mb-4">
            Mastery in Every Discipline
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            From regal palace weddings with grand baraat processions to serene fine-art studio portraits, our visual storytellers combine passion with technical perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {service.startingPrice && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-neutral-700 rounded text-xs text-amber-300 font-medium">
                    From ₹{service.startingPrice.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-200 transition-colors mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
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
                    onClick={() => onNavigate(`/book?service=${encodeURIComponent(service.name)}`)}
                    className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded transition-colors"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

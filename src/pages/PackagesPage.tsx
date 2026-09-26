import React, { useState, useEffect } from 'react';
import { Package } from '../types/index.ts';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface PackagesPageProps {
  onNavigate: (path: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ onNavigate }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/packages')
      .then((r) => r.json())
      .then((data) => setPackages(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investment Guide</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mt-2 mb-4">
            Curated Studio Collections
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Every package is structured with zero hidden costs, master full-frame camera gear, cinema color-grading, and handcrafted heirloom albums.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  Most Preferred
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
                  <span className="text-[11px] text-neutral-400">All taxes & equipment included</span>
                </div>

                <p className="text-xs text-neutral-300 mb-6 leading-relaxed">{pkg.description}</p>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                    Deliverables & Inclusions:
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
                onClick={() =>
                  onNavigate(`/book?package=${encodeURIComponent(pkg.name)}`)
                }
                className={`w-full py-3 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  pkg.isFeatured
                    ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                Select & Customise
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

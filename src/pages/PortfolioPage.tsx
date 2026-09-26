import React, { useState, useEffect } from 'react';
import { PortfolioImage } from '../types/index.ts';
import { Lightbox } from '../components/Lightbox.tsx';
import { MapPin, Sparkles } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => setPortfolio(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    category === 'all'
      ? portfolio
      : portfolio.filter((item) => item.category.toLowerCase() === category.toLowerCase());

  return (
    <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Archive</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mt-2 mb-4">
            Curated Studio Portfolio
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            A celebration of authentic human devotion, grand rituals, candid laughter, and fine-art portraits curated across two decades of visual craftsmanship.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Photographs' },
            { id: 'weddings', label: 'Weddings' },
            { id: 'pre-weddings', label: 'Pre-Weddings' },
            { id: 'portraits', label: 'Fine Portraits' },
            { id: 'couples', label: 'Couples' },
            { id: 'events', label: 'Celebrations' },
            { id: 'studio', label: 'Albums & Studio' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold rounded-full transition-all cursor-pointer ${
                category === cat.id
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Showcase */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/40 rounded-2xl border border-neutral-800">
            <p className="text-neutral-400">No images found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80 aspect-[4/3]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => ((prev! + 1) % filtered.length))}
          onPrev={() =>
            setLightboxIndex((prev) => (prev! === 0 ? filtered.length - 1 : prev! - 1))
          }
        />
      )}
    </div>
  );
};

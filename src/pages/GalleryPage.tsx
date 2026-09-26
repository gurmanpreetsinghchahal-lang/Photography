import React, { useState, useEffect } from 'react';
import { Gallery } from '../types/index.ts';
import { Lock, Unlock, Calendar, Image as ImageIcon, KeyRound, ArrowRight } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (path: string) => void;
  selectedSlug?: string;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate, selectedSlug }) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/galleries')
      .then((r) => r.json())
      .then((data) => {
        setGalleries(data);
        if (selectedSlug) {
          loadGalleryDetails(selectedSlug);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedSlug]);

  const loadGalleryDetails = async (slug: string, password?: string) => {
    setAuthError('');
    try {
      const res = await fetch(`/api/galleries/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setAuthError(data.error || 'Incorrect access passcode.');
          setActiveGallery({
            id: 0,
            slug,
            title: data.title || 'Private Heirloom Album',
            coverImage: data.coverImage || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
            category: 'Private',
            photoCount: 0,
            isPrivate: true,
          });
        }
        return;
      }
      setActiveGallery(data);
    } catch (e) {
      console.error(e);
      setAuthError('Failed to load gallery photos.');
    }
  };

  // If viewing a specific gallery
  if (selectedSlug && activeGallery) {
    // If private and photos not unlocked yet
    if (activeGallery.isPrivate && (!activeGallery.photos || activeGallery.photos.length === 0)) {
      return (
        <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-32 pb-24 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-neutral-900 border border-amber-500/40 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
              Private Client Vault
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">{activeGallery.title}</h2>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              This gallery is protected for family confidentiality. Please enter the private access passcode provided by Laxmi Digital Studio.
            </p>

            {authError && (
              <div className="p-3 mb-4 rounded-lg bg-red-950/60 border border-red-500/50 text-xs text-red-200">
                {authError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadGalleryDetails(selectedSlug, passwordInput);
              }}
              className="space-y-4"
            >
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Enter Access Passcode"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors cursor-pointer"
              >
                Unlock Private Gallery
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
              Passcode hint for demo: <span className="font-mono text-amber-300">Laxmi2026Password</span>
            </div>
          </div>
        </div>
      );
    }

    // Gallery Unlocked or Public
    return (
      <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-800">
            <div>
              <button
                onClick={() => onNavigate('/gallery')}
                className="text-xs uppercase tracking-widest text-amber-400 hover:text-amber-300 mb-2 block"
              >
                ← Back to All Galleries
              </button>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
                {activeGallery.title}
              </h1>
              {activeGallery.clientName && (
                <p className="text-sm text-neutral-400 mt-1">
                  Client: <span className="text-white">{activeGallery.clientName}</span> •{' '}
                  {activeGallery.eventDate}
                </p>
              )}
            </div>
            {activeGallery.isPrivate && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs rounded-full">
                <Unlock className="w-3.5 h-3.5" /> Unlocked Private Album
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeGallery.photos?.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 aspect-[4/3]"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || activeGallery.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs text-neutral-200">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Galleries Directory
  return (
    <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Client Collections
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mt-2 mb-4">
            Albums & Wedding Galleries
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Browse public event galleries or access your personalized private vault using your studio passcode.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {galleries.map((gal) => (
            <div
              key={gal.id}
              onClick={() => onNavigate(`/gallery/${gal.slug}`)}
              className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={gal.coverImage}
                  alt={gal.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  {gal.isPrivate ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-black/80 border border-amber-400/40 text-amber-300 text-[10px] rounded-full backdrop-blur-md">
                      <Lock className="w-3 h-3" /> Private Vault
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-black/80 border border-neutral-700 text-neutral-300 text-[10px] rounded-full backdrop-blur-md">
                      Public Album
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  {gal.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-200 transition-colors mt-1 mb-2">
                  {gal.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mb-4">{gal.description}</p>

                <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-800">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {gal.photoCount} Photographs
                  </span>
                  <span className="text-amber-300 flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform">
                    <span>View Album</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

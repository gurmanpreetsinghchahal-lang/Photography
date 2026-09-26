import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { PortfolioImage } from '../types/index.ts';

interface LightboxProps {
  images: PortfolioImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  const current = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200"
    >
      {/* Top Bar with image title & close */}
      <div className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between text-neutral-300 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h3 className="font-serif text-lg sm:text-xl text-white font-medium">{current.title}</h3>
          {current.location && (
            <p className="text-xs text-amber-300/90 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{current.location}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800 transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prev button */}
      <button
        onClick={onPrev}
        className="absolute left-4 p-3 text-white/80 hover:text-white rounded-full bg-black/50 hover:bg-black/80 border border-neutral-800 transition-transform active:scale-95 z-10"
        aria-label="Previous Photo"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Image */}
      <div className="max-w-6xl max-h-[85vh] p-4 flex flex-col items-center justify-center">
        <img
          src={current.imageUrl}
          alt={current.title}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded shadow-2xl transition-all"
        />
        {current.description && (
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 text-center max-w-2xl px-4">
            {current.description}
          </p>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="absolute right-4 p-3 text-white/80 hover:text-white rounded-full bg-black/50 hover:bg-black/80 border border-neutral-800 transition-transform active:scale-95 z-10"
        aria-label="Next Photo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

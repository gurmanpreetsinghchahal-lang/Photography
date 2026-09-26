import React from 'react';
import { Camera, MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Heart, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80 pt-16 pb-12 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Studio Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-amber-400/30 bg-neutral-900 flex items-center justify-center text-amber-300">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-100 tracking-wide">
                  {settings?.studioName || 'Laxmi Digital Photo Studio'}
                </h3>
                <p className="text-[10px] tracking-widest uppercase text-amber-300/80">Est. 2004 • New Delhi</p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {settings?.tagline || 'Your Moments. Our Passion. Your Memories Forever.'}
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Specialized in Royal Indian Wedding Cinema, Fine-Art Portraits, Destination Pre-Weddings, and Archival Flush-Mount Albums.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-300 hover:border-amber-400/50 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-300 hover:border-amber-400/50 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-300 hover:border-amber-400/50 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-neutral-100 mb-4 tracking-wider">
              Studio Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Experience', path: '/' },
                { label: 'About Our Master Heritage', path: '/about' },
                { label: 'Featured Portfolio Showcase', path: '/portfolio' },
                { label: 'Wedding & Event Packages', path: '/packages' },
                { label: 'Client Photo Galleries', path: '/gallery' },
                { label: 'Schedule A Consultation', path: '/book' },
                { label: 'Studio Contact & Directions', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-neutral-400 hover:translate-x-1 duration-150 cursor-pointer"
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Photography Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-neutral-100 mb-4 tracking-wider">
              Specialized Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Royal Wedding Photography', slug: 'wedding-photography' },
                { label: 'Pre-Wedding & Couple Story', slug: 'pre-wedding-shoot' },
                { label: 'Studio Fine-Art Portraits', slug: 'portrait-fashion-studio' },
                { label: 'Celebrations & Corporate Events', slug: 'events-birthdays-celebrations' },
                { label: 'Maternity & Newborn Baby', slug: 'maternity-newborn' },
                { label: 'Handcrafted Flushmount Albums', slug: 'premium-albums-framing' },
              ].map((item) => (
                <li key={item.slug}>
                  <button
                    onClick={() => onNavigate(`/services/${item.slug}`)}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-neutral-400 hover:translate-x-1 duration-150 cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-600" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Studio Contact & Business Hours */}
          <div className="space-y-3 text-sm">
            <h4 className="font-serif text-lg font-semibold text-neutral-100 mb-4 tracking-wider">
              Studio Location
            </h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <span className="text-neutral-400 leading-snug">
                {settings?.address || 'Laxmi Digital Studio, Main Road, Connaught Place, New Delhi - 110001'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`tel:${settings?.phone}`} className="hover:text-amber-300 transition-colors">
                {settings?.phone || '+91 98102 34567'}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`mailto:${settings?.email}`} className="hover:text-amber-300 transition-colors">
                {settings?.email || 'hello@laxmidigitalstudio.com'}
              </a>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-xs text-neutral-400 leading-snug">
                {settings?.businessHours || 'Monday - Sunday: 9:00 AM - 9:00 PM'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Laxmi Digital Photo Studio. All Rights Reserved. Crafted with devotion for timeless moments.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/admin')} className="hover:text-amber-300 transition-colors">
              Owner Administration
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> for Indian Celebrations
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

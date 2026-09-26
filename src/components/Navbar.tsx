import React, { useState, useEffect } from 'react';
import { Camera, Menu, X, Phone, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Packages', path: '/packages' },
    { label: 'Galleries', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 shadow-2xl py-3'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <button
            onClick={() => {
              onNavigate('/');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-neutral-900/90 flex items-center justify-center text-amber-300 group-hover:border-amber-400 transition-colors shadow-lg shadow-amber-950/20">
              <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-wider text-neutral-100 group-hover:text-amber-200 transition-colors">
                {settings?.studioName || 'Laxmi Digital Photo Studio'}
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-sans">
                Fine Art & Wedding Cinema
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`text-sm tracking-wide transition-all font-medium relative py-1 cursor-pointer ${
                    active ? 'text-amber-300 font-semibold' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-200 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${settings?.phone || '+919810234567'}`}
              className="flex items-center gap-2 text-xs tracking-wider uppercase font-semibold text-neutral-300 hover:text-amber-300 transition-colors px-3 py-2 rounded-md hover:bg-neutral-900/60"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings?.phone || 'Call Us'}</span>
            </a>

            <button
              onClick={() => onNavigate('/book')}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase font-semibold text-neutral-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded transition-all shadow-md shadow-amber-500/10 cursor-pointer active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Session</span>
            </button>

            <button
              onClick={() => onNavigate('/admin')}
              title="Admin Portal"
              className="p-2 text-neutral-400 hover:text-amber-300 hover:bg-neutral-900/60 rounded transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('/book')}
              className="px-3 py-1.5 text-xs font-medium text-neutral-950 bg-amber-300 rounded"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white rounded-md bg-neutral-900/80 border border-neutral-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/95 border-b border-neutral-800 px-4 pt-4 pb-6 mt-3 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            ))}

            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onNavigate('/book');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center text-sm font-semibold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-200 to-amber-400 rounded-md shadow-lg"
              >
                Book Session Now
              </button>
              <div className="flex items-center justify-between text-xs text-neutral-400 px-2 pt-1">
                <span>Direct Studio Call:</span>
                <a href={`tel:${settings?.phone}`} className="text-amber-300 font-medium">
                  {settings?.phone}
                </a>
              </div>
              <button
                onClick={() => {
                  onNavigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-neutral-400 hover:text-amber-300 py-1 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Studio Admin Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

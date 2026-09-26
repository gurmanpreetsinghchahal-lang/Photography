import React from 'react';
import { Camera, Award, ShieldCheck, Heart, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  return (
    <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Since 2004</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mt-2 mb-4">
            The Soul Behind The Lens
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Crafting indelible visual memories of India’s most sacred rituals, opulent celebrations, and genuine human connection.
          </p>
        </div>

        {/* Hero Visual Section */}
        <div className="relative rounded-3xl overflow-hidden mb-20 aspect-[21/9] min-h-[350px] border border-neutral-800">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
            alt="Laxmi Studio Founders and Art"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-12">
            <p className="text-amber-300 font-serif text-2xl sm:text-3xl italic max-w-2xl">
              “Photography is the beauty of life captured. When words cannot express devotion, our images speak for generations.”
            </p>
          </div>
        </div>

        {/* Mission & Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-neutral-900/50 border border-neutral-800/80 p-8 sm:p-10 rounded-2xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
              Our Heritage & Studio Ethos
            </h3>
            <p className="text-neutral-300 leading-relaxed text-sm mb-4">
              {settings?.studioName || 'Laxmi Digital Photo Studio'} was established with a singular vision: to treat wedding and portrait photography not as a transactional commercial gig, but as a sacred family document.
            </p>
            <p className="text-neutral-400 leading-relaxed text-sm">
              Over two decades, we have chronicled the evolving tapestry of Indian weddings — from traditional mandap ceremonies in ancestral courtyards to grand palace destination spectacles in Udaipur and Jaipur. Throughout this journey, our core philosophy remains unchanged: reverence for cultural tradition, emotional intimacy, and editorial fine-art lighting.
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/80 p-8 sm:p-10 rounded-2xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
              Why We Are Different
            </h3>
            <ul className="space-y-4 text-sm text-neutral-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Unobtrusive Candid Storytelling:</strong> We allow real rituals and unscripted laughter to unfold naturally without disturbing the sanctity of the mantras.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Full-Frame Cinema Gear:</strong> We shoot with Sony FX3 & A7R cinema cameras, G-Master f/1.2 primes, and Profoto strobes for supreme clarity and color fidelity.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Archival Handcrafted Albums:</strong> Our flush-mount albums use Kodak Endura HD papers and Italian bindings that resist fading for over 100 years.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Studio Equipment & Master Craftsmanship */}
        <div className="bg-neutral-950 border border-neutral-800/90 rounded-2xl p-8 sm:p-12 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              The Gear & Technology
            </span>
            <h3 className="font-serif text-3xl font-bold text-white mt-1">
              Engineered For Visual Perfection
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800">
              <Camera className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-white mb-1">Cinema & Primes</h4>
              <p className="text-xs text-neutral-400">
                Sony FX3, A7RV, 35mm f/1.4, 50mm f/1.2, 85mm f/1.4, 70-200mm f/2.8 GM II
              </p>
            </div>
            <div className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-white mb-1">Sculpted Lighting</h4>
              <p className="text-xs text-neutral-400">
                Profoto B10X Plus, Broncolor softboxes, magnetic optical spot grids
              </p>
            </div>
            <div className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800">
              <Clock className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-white mb-1">Aerial & Stabilization</h4>
              <p className="text-xs text-neutral-400">
                DJI Mavic 3 Pro Cine with Apple ProRes & DJI Ronin RS3 Pro gimbal stabilization
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h3 className="font-serif text-3xl font-bold text-white">
            Meet Us Over A Cup of Chai at Our Delhi Studio
          </h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Experience our handcrafted luxury wedding albums in person and discuss your celebration dates.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/book')}
              className="px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-md transition-colors shadow-lg shadow-amber-950/20"
            >
              Schedule Studio Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

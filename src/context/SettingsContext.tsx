import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings } from '../types/index.ts';

interface SettingsContextType {
  settings: SiteSettings | null;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const defaultFallbackSettings: SiteSettings = {
  id: 1,
  studioName: 'Laxmi Digital Photo Studio',
  tagline: 'Your Moments. Our Passion. Your Memories Forever.',
  phone: '+91 98102 34567',
  whatsappNumber: '919810234567',
  email: 'hello@laxmidigitalstudio.com',
  address: 'Laxmi Digital Studio, Main Road, Connaught Place, New Delhi - 110001',
  googleMapsUrl: 'https://maps.google.com/?q=Connaught+Place+New+Delhi',
  businessHours: 'Mon - Sun: 9:00 AM - 9:00 PM',
  heroHeadline: 'Capturing Eternal Grandeur in Every Sacred Frame',
  heroSubheadline: 'Mastering royal Indian weddings, dreamy pre-wedding cinema, fine-art portraits, and legacy albums for over 22 years.',
  defaultSeoTitle: 'Laxmi Digital Photo Studio | Royal Wedding & Portrait Photography',
  defaultSeoDescription: 'Top-rated photography studio for weddings, cinematic films, pre-weddings, portraits, and traditional celebrations across India.',
  updatedAt: new Date().toISOString(),
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultFallbackSettings,
  refreshSettings: async () => {},
  loading: false,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultFallbackSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.warn('Using default settings fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings: settings || defaultFallbackSettings,
        refreshSettings: fetchSettings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

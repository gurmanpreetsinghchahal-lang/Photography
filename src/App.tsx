import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { SettingsProvider, useSettings } from './context/SettingsContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { WhatsAppFloating } from './components/WhatsAppFloating.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { PortfolioPage } from './pages/PortfolioPage.tsx';
import { PackagesPage } from './pages/PackagesPage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { BookingPage } from './pages/BookingPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const { settings } = useSettings();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Structured Data (JSON-LD) for LocalBusiness & PhotographyStudio SEO
  useEffect(() => {
    if (!settings) return;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': ['PhotographyStudio', 'LocalBusiness'],
      name: settings.studioName,
      description: settings.defaultSeoDescription || settings.tagline,
      telephone: settings.phone,
      email: settings.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'New Delhi',
        addressCountry: 'IN',
      },
      openingHours: 'Mo,Tu,We,Th,Fr,Sa,Su 09:00-21:00',
      priceRange: '₹₹₹',
      sameAs: [settings.instagramUrl, settings.facebookUrl, settings.youtubeUrl].filter(Boolean),
    };

    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, [settings]);

  // Page title dynamic SEO update
  useEffect(() => {
    let title = settings?.defaultSeoTitle || 'Laxmi Digital Photo Studio';
    if (currentPath === '/about') title = `About | ${settings?.studioName}`;
    else if (currentPath.startsWith('/services')) title = `Photography Services | ${settings?.studioName}`;
    else if (currentPath === '/portfolio') title = `Master Portfolio Showcase | ${settings?.studioName}`;
    else if (currentPath === '/packages') title = `Collections & Pricing Packages | ${settings?.studioName}`;
    else if (currentPath.startsWith('/gallery')) title = `Client Photo Galleries | ${settings?.studioName}`;
    else if (currentPath === '/contact') title = `Contact & Studio Visit | ${settings?.studioName}`;
    else if (currentPath === '/book') title = `Book A Session | ${settings?.studioName}`;
    else if (currentPath.startsWith('/admin')) title = `Studio Owner Dashboard | ${settings?.studioName}`;

    document.title = title;
  }, [currentPath, settings]);

  // Route parser
  let content = null;
  const isAdmin = currentPath.startsWith('/admin');

  if (currentPath === '/' || currentPath === '') {
    content = <HomePage onNavigate={navigateTo} />;
  } else if (currentPath === '/about') {
    content = <AboutPage onNavigate={navigateTo} />;
  } else if (currentPath === '/services') {
    content = <ServicesPage onNavigate={navigateTo} />;
  } else if (currentPath.startsWith('/services/')) {
    const slug = currentPath.replace('/services/', '');
    content = <ServicesPage onNavigate={navigateTo} selectedSlug={slug} />;
  } else if (currentPath === '/portfolio') {
    content = <PortfolioPage />;
  } else if (currentPath === '/packages') {
    content = <PackagesPage onNavigate={navigateTo} />;
  } else if (currentPath === '/gallery') {
    content = <GalleryPage onNavigate={navigateTo} />;
  } else if (currentPath.startsWith('/gallery/')) {
    const slug = currentPath.replace('/gallery/', '');
    content = <GalleryPage onNavigate={navigateTo} selectedSlug={slug} />;
  } else if (currentPath === '/contact') {
    content = <ContactPage />;
  } else if (currentPath.startsWith('/book')) {
    const urlParams = new URLSearchParams(window.location.search);
    content = (
      <BookingPage
        onNavigate={navigateTo}
        preSelectedService={urlParams.get('service') || undefined}
        preSelectedPackage={urlParams.get('package') || undefined}
      />
    );
  } else if (isAdmin) {
    content = <AdminDashboard onNavigate={navigateTo} />;
  } else {
    // Fallback
    content = <HomePage onNavigate={navigateTo} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 font-sans">
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />
      <div className="flex-1">{content}</div>
      {!isAdmin && <Footer onNavigate={navigateTo} />}
      {!isAdmin && <WhatsAppFloating currentPath={currentPath} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <MainRouter />
      </SettingsProvider>
    </AuthProvider>
  );
}

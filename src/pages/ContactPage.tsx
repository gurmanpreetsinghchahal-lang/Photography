import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext.tsx';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
  Youtube,
  MessageSquare,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceRequested, setServiceRequested] = useState('Royal Wedding Photography');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          serviceRequested,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error sending message. Please try WhatsApp or Call.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mt-2 mb-4">
            Connect With Our Studio
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Whether planning a destination wedding, an editorial fashion portrait, or seeking an archival album consultation, our doors and lines are always open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info & Address */}
          <div className="space-y-8">
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-8 space-y-6">
              <h3 className="font-serif text-2xl font-bold text-white">Studio Headquarters</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Address</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                    {settings?.address || 'Laxmi Digital Studio, Main Road, Connaught Place, New Delhi - 110001'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Telephone & WhatsApp</h4>
                  <a
                    href={`tel:${settings?.phone}`}
                    className="text-xs text-amber-300 hover:underline block mt-1"
                  >
                    {settings?.phone || '+91 98102 34567'}
                  </a>
                  <a
                    href={`https://wa.me/${(settings?.whatsappNumber || '919810234567').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:underline block mt-0.5"
                  >
                    Chat directly on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Email Desk</h4>
                  <a
                    href={`mailto:${settings?.email}`}
                    className="text-xs text-neutral-400 hover:text-white block mt-1"
                  >
                    {settings?.email || 'hello@laxmidigitalstudio.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Opening Hours</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                    {settings?.businessHours || 'Monday - Sunday: 9:00 AM - 9:00 PM'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center gap-4">
                <span className="text-xs text-neutral-400">Follow Our Social Stories:</span>
                <div className="flex items-center gap-3">
                  <a
                    href={settings?.instagramUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-amber-400"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={settings?.facebookUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-amber-400"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={settings?.youtubeUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-amber-400"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps / Directions Card */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 overflow-hidden">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Visit Our Central Delhi Studio</span>
              </h4>
              <div className="aspect-[16/9] w-full bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 relative flex items-center justify-center text-center p-6">
                <div className="space-y-2">
                  <p className="text-xs text-neutral-300">
                    Located in Central Delhi with convenient valet parking and private client viewing suites.
                  </p>
                  <a
                    href={settings?.googleMapsUrl || 'https://maps.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded border border-amber-400/30"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-8">
            <h3 className="font-serif text-2xl font-bold text-white mb-2">Send An Inquiry</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Leave your details below and our team will get in touch with you shortly.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-white">Message Dispatched!</h4>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                  Thank you, {name}. We have received your inquiry. One of our lead artists will call or message you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-xs text-red-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="vikram@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-1.5">
                    Service Interested In
                  </label>
                  <select
                    value={serviceRequested}
                    onChange={(e) => setServiceRequested(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Royal Wedding Photography">Royal Wedding Photography & Cinema</option>
                    <option value="Pre-Wedding & Couple Story">Pre-Wedding & Couple Story</option>
                    <option value="Studio Fine-Art Portraits">Studio Fine-Art Portraits</option>
                    <option value="Events & Celebrations">Events, Birthdays & Anniversaries</option>
                    <option value="Maternity & Newborn">Maternity & Newborn Baby</option>
                    <option value="Handcrafted Luxury Albums">Handcrafted Luxury Albums</option>
                    <option value="Other Inquiries">Other Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-1.5">
                    Your Message / Event Brief *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please include preferred dates, venue location, or any specific requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-neutral-950 rounded-lg transition-all cursor-pointer font-bold shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Transmit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

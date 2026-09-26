import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext.tsx';
import { Service, Package } from '../types/index.ts';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Phone,
  User,
  Mail,
  MapPin,
  Users,
} from 'lucide-react';

interface BookingPageProps {
  onNavigate: (path: string) => void;
  preSelectedService?: string;
  preSelectedPackage?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onNavigate,
  preSelectedService,
  preSelectedPackage,
}) => {
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedService, setSelectedService] = useState<string>(preSelectedService || '');
  const [selectedPackage, setSelectedPackage] = useState<string>(preSelectedPackage || '');
  const [eventDate, setEventDate] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [eventLocation, setEventLocation] = useState<string>('');
  const [estimatedGuests, setEstimatedGuests] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('₹1,00,000 - ₹2,00,000');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/packages').then((r) => r.json()),
    ])
      .then(([sList, pList]) => {
        setServices(sList);
        setPackages(pList);
        if (!selectedService && sList.length > 0) {
          setSelectedService(sList[0].name);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        serviceName: selectedService,
        packageName: selectedPackage || undefined,
        eventDate,
        eventLocation,
        estimatedGuests: estimatedGuests ? Number(estimatedGuests) : undefined,
        budgetRange,
        additionalNotes,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking inquiry');
      }

      setSubmittedBooking(data.booking);
      setStep(6); // Success Step
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Submission failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0b0c10] text-neutral-100 min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Online Studio Desk</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-3">
            Schedule Your Photography Session
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Tell us about your auspicious dates and venue. Our studio director will review your schedule and reach out with availability.
          </p>
        </div>

        {/* Multi-step progress bar */}
        {step < 6 && (
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-medium mb-3">
              <span className={step >= 1 ? 'text-amber-400' : ''}>1. Service</span>
              <span className={step >= 2 ? 'text-amber-400' : ''}>2. Package</span>
              <span className={step >= 3 ? 'text-amber-400' : ''}>3. Date & Venue</span>
              <span className={step >= 4 ? 'text-amber-400' : ''}>4. Details</span>
              <span className={step >= 5 ? 'text-amber-400' : ''}>5. Summary</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-200 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">Select Your Photography Discipline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s.name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                    selectedService === s.name
                      ? 'bg-amber-500/10 border-amber-400 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-medium text-sm text-white mb-1">{s.name}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-2">{s.shortDescription}</p>
                    {s.startingPrice && (
                      <span className="text-[11px] text-amber-300 font-semibold mt-1 block">
                        From ₹{s.startingPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-800">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedService}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Continue to Package</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Package */}
        {step === 2 && (
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-white">Choose A Package Option</h3>
              <button
                onClick={() => {
                  setSelectedPackage('Custom Tailored Package');
                  setStep(3);
                }}
                className="text-xs text-amber-300 hover:underline"
              >
                Skip / Request Custom Quote
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.name)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPackage === pkg.name
                      ? 'bg-amber-500/10 border-amber-400 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h4 className="font-serif text-lg font-bold text-white">{pkg.name}</h4>
                      <span className="font-serif text-xl font-bold text-amber-300">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-3">{pkg.description}</p>
                    <div className="space-y-1">
                      {pkg.deliverables.slice(0, 3).map((d, i) => (
                        <div key={i} className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-neutral-800">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Date & Venue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Event Date & Location */}
        {step === 3 && (
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">Event Date & Venue Location</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                  Event / Session Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                  Venue City & Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Udaipur Palace / New Delhi Farmhouse"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                  Estimated Gathering / Guests
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    placeholder="e.g. 350"
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                  Estimated Photography Budget
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Under ₹50,000">Under ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</option>
                  <option value="₹2,00,000 - ₹3,50,000">₹2,00,000 - ₹3,50,000</option>
                  <option value="₹3,50,000+ (Imperial Wedding)">₹3,50,000+ (Imperial Wedding)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-neutral-800">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!eventDate || !eventLocation}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Continue to Your Information</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Customer Information */}
        {step === 4 && (
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">Your Contact Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Radhika Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                  WhatsApp / Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 98123 45678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="e.g. radhika@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                  Special Notes or Ritual Preferences
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about specific traditions, drone interest, or destination logistics..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-neutral-800">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!customerName || !customerPhone}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Review Summary</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Summary & Confirm Submission */}
        {step === 5 && (
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">Review Booking Summary</h3>

            <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 space-y-4 text-sm">
              <div className="flex justify-between pb-3 border-b border-neutral-800">
                <span className="text-neutral-400">Selected Service:</span>
                <span className="font-semibold text-white">{selectedService}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-800">
                <span className="text-neutral-400">Chosen Package:</span>
                <span className="font-semibold text-amber-300">{selectedPackage || 'Custom Package'}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-800">
                <span className="text-neutral-400">Event Date:</span>
                <span className="font-semibold text-white">{eventDate}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-800">
                <span className="text-neutral-400">Venue & City:</span>
                <span className="font-semibold text-white">{eventLocation}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-800">
                <span className="text-neutral-400">Client Name:</span>
                <span className="font-semibold text-white">{customerName}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-neutral-800">
                <span className="text-neutral-400">Phone & WhatsApp:</span>
                <span className="font-semibold text-white">{customerPhone}</span>
              </div>
              {customerEmail && (
                <div className="flex justify-between pb-3 border-b border-neutral-800">
                  <span className="text-neutral-400">Email:</span>
                  <span className="font-semibold text-white">{customerEmail}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-neutral-800">
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Modify Details</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-neutral-950 rounded-lg transition-all cursor-pointer font-bold shadow-lg shadow-amber-500/20 active:scale-95"
              >
                {submitting ? 'Submitting to Studio...' : 'Confirm & Reserve'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Success Confirmation */}
        {step === 6 && (
          <div className="bg-neutral-900/80 border border-amber-400/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
              Booking Request Received
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Thank You, {customerName}!
            </h2>

            <div className="max-w-md mx-auto bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-2">
              <div className="flex justify-between">
                <span>Booking Reference:</span>
                <span className="font-mono text-amber-300 font-bold">
                  {submittedBooking?.bookingNumber || 'LDS-CONFIRMED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Selected Date:</span>
                <span>{eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Discipline:</span>
                <span>{selectedService}</span>
              </div>
            </div>

            <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
              Our lead photography coordinator has received your request. We will review date availability and contact you on{' '}
              <strong className="text-amber-300">{customerPhone}</strong> within 4 business hours with custom portfolio samples and quote verification.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('/')}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-md transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={() => onNavigate('/portfolio')}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
              >
                Explore More Works
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

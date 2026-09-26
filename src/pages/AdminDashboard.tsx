import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';
import {
  Calendar,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Package as PackageIcon,
  Layers,
  Settings,
  Star,
  Tag,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Booking, Customer, Inquiry, Service, Package, PortfolioImage, Gallery, Testimonial, Offer } from '../types/index.ts';

export const AdminDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, loginWithGoogle, logout, authFetch, loading: authLoading } = useAuth();
  const { settings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'bookings'
    | 'customers'
    | 'inquiries'
    | 'services'
    | 'packages'
    | 'portfolio'
    | 'galleries'
    | 'testimonials'
    | 'offers'
    | 'settings'
  >('dashboard');

  // Dashboard Summary Metrics
  const [metrics, setMetrics] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal / Form states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<any>({});

  const loadAllAdminData = async () => {
    if (!currentUser) return;
    setLoadingData(true);
    try {
      const safeFetchJson = async (resPromise: Promise<Response>) => {
        try {
          const res = await resPromise;
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      };

      const [dashRes, bookRes, custRes, inqRes, servRes, packRes, portRes, galRes, testRes, offRes] =
        await Promise.all([
          safeFetchJson(authFetch('/api/admin/dashboard')),
          safeFetchJson(authFetch('/api/admin/bookings')),
          safeFetchJson(authFetch('/api/admin/customers')),
          safeFetchJson(authFetch('/api/admin/inquiries')),
          safeFetchJson(fetch('/api/services')),
          safeFetchJson(fetch('/api/packages')),
          safeFetchJson(fetch('/api/portfolio')),
          safeFetchJson(fetch('/api/galleries')),
          safeFetchJson(fetch('/api/testimonials')),
          safeFetchJson(fetch('/api/offers')),
        ]);

      if (dashRes) setMetrics(dashRes);
      setBookings(Array.isArray(bookRes) ? bookRes : []);
      setCustomers(Array.isArray(custRes) ? custRes : []);
      setInquiries(Array.isArray(inqRes) ? inqRes : []);
      setServices(Array.isArray(servRes) ? servRes : []);
      setPackages(Array.isArray(packRes) ? packRes : []);
      setPortfolio(Array.isArray(portRes) ? portRes : []);
      setGalleries(Array.isArray(galRes) ? galRes : []);
      setTestimonials(Array.isArray(testRes) ? testRes : []);
      setOffers(Array.isArray(offRes) ? offRes : []);
      if (settings) setSettingsForm(settings);
    } catch (err) {
      console.error('Error fetching admin content:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadAllAdminData();
    }
  }, [currentUser]);

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center text-amber-300">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full bg-neutral-900 border border-amber-500/40 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-neutral-950 border border-amber-400 flex items-center justify-center text-amber-400 mx-auto mb-6">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Studio Security
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mb-2">Studio Owner Portal</h2>
          <p className="text-xs text-neutral-400 mb-8 leading-relaxed">
            Please authenticate using your verified Google credentials to manage bookings, client inquiries, pricing packages, and gallery archives.
          </p>

          <button
            onClick={() => loginWithGoogle()}
            className="w-full py-3.5 px-4 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-neutral-100 text-neutral-900 rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer font-sans"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Studio Account</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="mt-6 text-xs text-neutral-400 hover:text-amber-300 block w-full text-center"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  // Booking Status Handler
  const handleUpdateBookingStatus = async (id: number, status: string) => {
    try {
      const res = await authFetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status as any } : b)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to remove this booking permanently?')) return;
    try {
      await authFetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Inquiry Status Handler
  const handleUpdateInquiry = async (id: number, status: string) => {
    try {
      const res = await authFetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, isRead: true }),
      });
      if (res.ok) {
        setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: status as any, isRead: true } : inq)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await authFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        alert('Studio configurations updated successfully!');
        await refreshSettings();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update settings');
    }
  };

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Layers className="w-4 h-4" /> },
    { id: 'packages', label: 'Packages', icon: <PackageIcon className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'galleries', label: 'Galleries', icon: <Eye className="w-4 h-4" /> },
    { id: 'testimonials', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'offers', label: 'Promotions', icon: <Tag className="w-4 h-4" /> },
    { id: 'settings', label: 'Studio Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-neutral-100 flex flex-col md:flex-row pt-16">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-800/80 p-4 shrink-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-neutral-900 border border-neutral-800">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Admin"
                className="w-8 h-8 rounded-full border border-amber-400"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs">
                {currentUser.displayName ? currentUser.displayName[0] : 'A'}
              </div>
            )}
            <div className="overflow-hidden">
              <span className="block text-xs font-bold text-white truncate">
                {currentUser.displayName || 'Laxmi Studio Admin'}
              </span>
              <span className="block text-[10px] text-amber-400 truncate">
                {currentUser.email}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Live Site</span>
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-neutral-800 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
              Management Portal
            </span>
            <h1 className="font-serif text-3xl font-bold text-white capitalize">
              {activeTab === 'dashboard' ? 'Studio Overview & Performance' : activeTab}
            </h1>
          </div>
          <button
            onClick={loadAllAdminData}
            disabled={loadingData}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && metrics && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-xl">
                <span className="text-xs text-neutral-400">Total Bookings</span>
                <div className="font-serif text-3xl font-bold text-white mt-1">
                  {metrics.counts?.totalBookings || 0}
                </div>
                <span className="text-[10px] text-amber-400">
                  {metrics.counts?.pendingBookings || 0} Awaiting Action
                </span>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-xl">
                <span className="text-xs text-neutral-400">Confirmed Events</span>
                <div className="font-serif text-3xl font-bold text-emerald-400 mt-1">
                  {metrics.counts?.confirmedBookings || 0}
                </div>
                <span className="text-[10px] text-neutral-500">Scheduled on calendar</span>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-xl">
                <span className="text-xs text-neutral-400">Pending Inquiries</span>
                <div className="font-serif text-3xl font-bold text-amber-300 mt-1">
                  {metrics.counts?.pendingInquiries || 0}
                </div>
                <span className="text-[10px] text-neutral-500">Contact form leads</span>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-xl">
                <span className="text-xs text-neutral-400">Registered Clients</span>
                <div className="font-serif text-3xl font-bold text-white mt-1">
                  {metrics.counts?.totalCustomers || 0}
                </div>
                <span className="text-[10px] text-neutral-500">Customer directory</span>
              </div>
            </div>

            {/* Monthly Trend Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-xl">
                <h3 className="font-serif text-lg font-bold text-white mb-4">
                  Monthly Inquiry & Booking Volume
                </h3>
                <div className="space-y-3">
                  {metrics.monthlyData?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="w-12 text-neutral-400">{item.month}</span>
                      <div className="flex-1 mx-4 bg-neutral-950 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-amber-400 h-full"
                          style={{ width: `${Math.min(100, item.bookings * 25)}%` }}
                        />
                        <div
                          className="bg-emerald-500 h-full opacity-60"
                          style={{ width: `${Math.min(100, item.inquiries * 20)}%` }}
                        />
                      </div>
                      <span className="font-mono text-neutral-300">
                        {item.bookings} bkg / {item.inquiries} inq
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-xl">
                <h3 className="font-serif text-lg font-bold text-white mb-4">
                  Popular Service Categories
                </h3>
                <div className="space-y-3">
                  {metrics.servicePopularity?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium truncate max-w-xs">
                        {item.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 font-mono">
                        {item.count} sessions
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings preview */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-white">Recent Booking Leads</h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Manage All Bookings →
                </button>
              </div>
              <div className="divide-y divide-neutral-800 text-xs">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{b.customerName}</span>
                      <span className="text-neutral-400 mx-2">•</span>
                      <span className="text-amber-300">{b.serviceName}</span>
                      <span className="text-neutral-500 block text-[11px]">
                        Event: {b.eventDate} ({b.eventLocation})
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : b.status === 'Completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search name, phone, ref..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-neutral-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="p-4">Ref & Client</th>
                      <th className="p-4">Phone / WhatsApp</th>
                      <th className="p-4">Service & Package</th>
                      <th className="p-4">Event Date & Venue</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {bookings
                      .filter((b) => {
                        if (statusFilter !== 'all' && b.status !== statusFilter) return false;
                        if (!searchTerm) return true;
                        const s = searchTerm.toLowerCase();
                        return (
                          b.customerName.toLowerCase().includes(s) ||
                          b.bookingNumber.toLowerCase().includes(s) ||
                          b.customerPhone.includes(s)
                        );
                      })
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-amber-400 font-bold block">
                              {b.bookingNumber}
                            </span>
                            <span className="font-semibold text-white text-sm">{b.customerName}</span>
                            {b.customerEmail && (
                              <span className="text-[11px] text-neutral-500 block">{b.customerEmail}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <a
                              href={`tel:${b.customerPhone}`}
                              className="text-white hover:text-amber-400 block"
                            >
                              {b.customerPhone}
                            </a>
                            <a
                              href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${b.customerName}, this is regarding your Laxmi Digital Photo Studio booking (${b.bookingNumber}).`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              WhatsApp Customer
                            </a>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-white block">{b.serviceName}</span>
                            <span className="text-[11px] text-neutral-400 block">
                              {b.packageName || 'Custom Quote'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-white block">{b.eventDate}</span>
                            <span className="text-[11px] text-neutral-400 block">{b.eventLocation}</span>
                          </td>
                          <td className="p-4">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                              className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-800"
                              title="Delete booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. INQUIRIES MANAGEMENT */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">No inquiries logged.</div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-sm">{inq.name}</span>
                        <span className="text-xs text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                          {inq.serviceRequested || 'General Inquiry'}
                        </span>
                        {!inq.isRead && (
                          <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80 my-2">
                        “{inq.message}”
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-400">
                        <span>Phone: <strong className="text-white">{inq.phone}</strong></span>
                        {inq.email && <span>Email: {inq.email}</span>}
                        <span>Received: {new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiry(inq.id, e.target.value)}
                        className="bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-white"
                      >
                        <option value="New">New</option>
                        <option value="Replied">Replied</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone / WhatsApp</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Bookings Count</th>
                    <th className="p-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-800/40">
                      <td className="p-4 font-semibold text-white">{c.name}</td>
                      <td className="p-4 text-amber-300">{c.phone}</td>
                      <td className="p-4 text-neutral-400">{c.email || '—'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono">
                          {c.totalBookings}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400">
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400">
                Manage services listed on public website and booking flows.
              </p>
              <button
                onClick={() => {
                  const name = prompt('Enter Service Name:');
                  if (!name) return;
                  const shortDesc = prompt('Enter Short Description:') || '';
                  const startingPrice = Number(prompt('Starting Price in INR (e.g. 25000):') || '25000');
                  authFetch('/api/admin/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      shortDescription: shortDesc,
                      fullDescription: shortDesc,
                      imageUrl:
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
                      startingPrice,
                    }),
                  }).then(() => loadAllAdminData());
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 text-neutral-950 rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex gap-4 items-center justify-between"
                >
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{s.name}</h4>
                    <span className="text-xs text-amber-300">
                      Starting ₹{s.startingPrice?.toLocaleString('en-IN') || 'Custom'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete service "${s.name}"?`)) {
                        authFetch(`/api/admin/services/${s.id}`, { method: 'DELETE' }).then(() =>
                          loadAllAdminData()
                        );
                      }
                    }}
                    className="p-2 text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. PACKAGES MANAGEMENT */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400">
                Manage all pricing tiers and deliverable inclusions.
              </p>
              <button
                onClick={() => {
                  const name = prompt('Package Name:');
                  if (!name) return;
                  const price = Number(prompt('Price in INR (e.g. 55000):') || '50000');
                  const desc = prompt('Description:') || '';
                  authFetch('/api/admin/packages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      price,
                      description: desc,
                      deliverables: ['Full Photo & Cinema Coverage', 'High-Res Digital Delivery'],
                    }),
                  }).then(() => loadAllAdminData());
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 text-neutral-950 rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-lg font-bold text-white">{pkg.name}</h4>
                      <button
                        onClick={() => {
                          if (confirm(`Remove package "${pkg.name}"?`)) {
                            authFetch(`/api/admin/packages/${pkg.id}`, { method: 'DELETE' }).then(() =>
                              loadAllAdminData()
                            );
                          }
                        }}
                        className="text-neutral-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-serif text-2xl font-bold text-amber-300 mb-2">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                      {pkg.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. PORTFOLIO MANAGEMENT */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400">
                Upload and organize gallery photographs across wedding, pre-wedding, and portrait categories.
              </p>
              <button
                onClick={() => {
                  const title = prompt('Photo Title:');
                  if (!title) return;
                  const imageUrl = prompt('Image URL (Cloudinary or Unsplash):');
                  if (!imageUrl) return;
                  const category = prompt('Category (weddings / pre-weddings / portraits / events / studio):') || 'weddings';
                  authFetch('/api/admin/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title,
                      category,
                      imageUrl,
                      thumbnailUrl: imageUrl,
                      aspectRatio: '4:3',
                    }),
                  }).then(() => loadAllAdminData());
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 text-neutral-950 rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {portfolio.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-[4/3]"
                >
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <span className="text-[10px] text-amber-300 uppercase font-bold">
                      {img.category}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white truncate max-w-[120px]">{img.title}</span>
                      <button
                        onClick={() => {
                          if (confirm('Delete this portfolio image?')) {
                            authFetch(`/api/admin/portfolio/${img.id}`, { method: 'DELETE' }).then(
                              () => loadAllAdminData()
                            );
                          }
                        }}
                        className="text-red-400 p-1 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. GALLERIES & ALBUMS MANAGEMENT */}
        {activeTab === 'galleries' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400">
                Manage client event galleries and private password-protected albums.
              </p>
              <button
                onClick={() => {
                  const title = prompt('Gallery Title (e.g. Vikram & Radhika Wedding):');
                  if (!title) return;
                  const coverImage = prompt('Cover Image URL:') || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80';
                  const isPrivate = confirm('Is this a private password-protected gallery?');
                  let accessPassword = null;
                  if (isPrivate) {
                    accessPassword = prompt('Set Client Passcode:') || 'Laxmi2026Password';
                  }
                  authFetch('/api/admin/galleries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title,
                      coverImage,
                      isPrivate,
                      accessPassword,
                      category: 'weddings',
                    }),
                  }).then(() => loadAllAdminData());
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 text-neutral-950 rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Gallery</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleries.map((gal) => (
                <div
                  key={gal.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] relative">
                    <img src={gal.coverImage} alt={gal.title} className="w-full h-full object-cover" />
                    {gal.isPrivate && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-amber-300 border border-amber-400/40">
                        Private Vault
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white text-sm">{gal.title}</h4>
                      <span className="text-[11px] text-neutral-400">{gal.photoCount} photos</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete gallery "${gal.title}"?`)) {
                          authFetch(`/api/admin/galleries/${gal.id}`, { method: 'DELETE' }).then(() =>
                            loadAllAdminData()
                          );
                        }
                      }}
                      className="p-1.5 text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. REVIEWS & TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400">
                Customer reviews and wedding couple testimonials.
              </p>
              <button
                onClick={() => {
                  const clientName = prompt('Client / Couple Name:');
                  if (!clientName) return;
                  const review = prompt('Review text:');
                  if (!review) return;
                  authFetch('/api/admin/testimonials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      clientName,
                      review,
                      rating: 5,
                      clientRole: 'Wedding Couple',
                    }),
                  }).then(() => loadAllAdminData());
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 text-neutral-950 rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between"
                >
                  <p className="text-xs text-neutral-300 italic mb-4">“{t.review}”</p>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                    <div>
                      <h4 className="font-semibold text-white text-xs">{t.clientName}</h4>
                      <span className="text-[10px] text-amber-400">{t.clientRole}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Delete testimonial?')) {
                          authFetch(`/api/admin/testimonials/${t.id}`, { method: 'DELETE' }).then(() =>
                            loadAllAdminData()
                          );
                        }
                      }}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. OFFERS & PROMOTIONS */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400">
                Manage seasonal wedding offers and discount coupons.
              </p>
              <button
                onClick={() => {
                  const title = prompt('Offer Title:');
                  if (!title) return;
                  const discountText = prompt('Discount Highlight (e.g. 20% OFF or Free Pre-Wedding):') || '';
                  const description = prompt('Offer Description:') || '';
                  authFetch('/api/admin/offers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title,
                      discountText,
                      description,
                      code: 'ROYAL2026',
                    }),
                  }).then(() => loadAllAdminData());
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 text-neutral-950 rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Offer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((off) => (
                <div key={off.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      {off.discountText}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm('Delete offer?')) {
                          authFetch(`/api/admin/offers/${off.id}`, { method: 'DELETE' }).then(() =>
                            loadAllAdminData()
                          );
                        }
                      }}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">{off.title}</h4>
                  <p className="text-xs text-neutral-400 mb-3">{off.description}</p>
                  {off.code && (
                    <span className="px-2 py-1 rounded bg-black text-amber-300 font-mono text-xs border border-dashed border-amber-400/40">
                      Code: {off.code}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. STUDIO SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 space-y-4">
              <h3 className="font-serif text-xl font-bold text-white mb-4">
                Studio Contact & Identity Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    Studio Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.studioName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, studioName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    Official Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    WhatsApp Number (Digits with Country Code)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    Studio Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={settingsForm.businessHours || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 space-y-4">
              <h3 className="font-serif text-xl font-bold text-white mb-4">
                Social Media & SEO Metadata
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instagramUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    value={settingsForm.youtubeUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-semibold text-neutral-300 mb-1">
                    Hero Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubheadline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheadline: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors font-bold cursor-pointer"
            >
              Save Studio Configuration
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

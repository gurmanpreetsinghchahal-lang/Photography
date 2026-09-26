// src/types/index.ts

export interface SiteSettings {
  id: number;
  studioName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
  businessHours: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  updatedAt: string;
}

export interface Service {
  id: number;
  slug: string;
  name: string;
  tagline?: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  startingPrice?: number;
  features: string[];
  faqs: { question: string; answer: string }[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Package {
  id: number;
  serviceId?: number;
  serviceName?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  description: string;
  deliverables: string[];
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface PortfolioImage {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  description?: string;
  location?: string;
  aspectRatio?: string;
  isFeatured: boolean;
  displayOrder: number;
}

export interface GalleryPhoto {
  id: number;
  galleryId: number;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  clientName?: string;
  eventDate?: string;
  category: string;
  description?: string;
  photoCount: number;
  isPrivate: boolean;
  photos?: GalleryPhoto[];
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientRole?: string;
  avatarUrl?: string;
  review: string;
  rating: number;
  serviceName?: string;
  eventDate?: string;
  isActive: boolean;
}

export interface Offer {
  id: number;
  title: string;
  tagline?: string;
  description: string;
  discountText: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  bannerImage?: string;
  isActive: boolean;
}

export interface Booking {
  id: number;
  bookingNumber: string;
  customerId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId?: number;
  serviceName: string;
  packageId?: number;
  packageName?: string;
  eventDate: string;
  eventLocation: string;
  estimatedGuests?: number;
  budgetRange?: string;
  additionalNotes?: string;
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Completed' | 'Cancelled';
  internalNotes?: string;
  quotedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  serviceRequested?: string;
  message: string;
  isRead: boolean;
  status: 'New' | 'Replied' | 'Archived';
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

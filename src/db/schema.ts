// src/db/schema.ts
import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').notNull().default('user'), // 'admin' | 'staff' | 'user'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Customers directory
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  notes: text('notes'),
  totalBookings: integer('total_bookings').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Photography Services (Wedding, Pre-Wedding, Portraits, Cinematic, etc.)
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  tagline: text('tagline'),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  imageUrl: text('image_url').notNull(),
  startingPrice: integer('starting_price'), // in INR e.g. 25000
  features: jsonb('features').$type<string[]>().default([]).notNull(),
  faqs: jsonb('faqs').$type<{ question: string; answer: string }[]>().default([]).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Photography Packages (e.g. Silver, Gold, Luxury Royal)
export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  serviceId: integer('service_id').references(() => services.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  price: integer('price').notNull(), // in INR
  originalPrice: integer('original_price'),
  duration: text('duration'), // e.g. "Full Day (8-10 Hours)"
  description: text('description').notNull(),
  deliverables: jsonb('deliverables').$type<string[]>().default([]).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Portfolio Images & Showcases
export const portfolioImages = pgTable('portfolio_images', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'weddings' | 'pre-weddings' | 'portraits' | 'events' | 'studio' | 'cinematic'
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  description: text('description'),
  location: text('location'),
  aspectRatio: text('aspect_ratio').default('4:3'), // '16:9' | '4:3' | '3:4' | '1:1'
  isFeatured: boolean('is_featured').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Albums / Event Galleries (Public or Password-Protected Private Galleries)
export const galleries = pgTable('galleries', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  coverImage: text('cover_image').notNull(),
  clientName: text('client_name'),
  eventDate: text('event_date'), // e.g. "2026-02-14"
  category: text('category').notNull().default('weddings'),
  description: text('description'),
  photoCount: integer('photo_count').default(0).notNull(),
  isPrivate: boolean('is_private').default(false).notNull(),
  accessPassword: text('access_password'), // hashed or passkey for private galleries
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Images belonging to specific galleries
export const galleryPhotos = pgTable('gallery_photos', {
  id: serial('id').primaryKey(),
  galleryId: integer('gallery_id').references(() => galleries.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Booking and Session Inquiries
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingNumber: text('booking_number').notNull().unique(), // e.g. "LDS-2026-1001"
  customerId: integer('customer_id').references(() => customers.id),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  serviceId: integer('service_id').references(() => services.id),
  serviceName: text('service_name').notNull(),
  packageId: integer('package_id').references(() => packages.id),
  packageName: text('package_name'),
  eventDate: text('event_date').notNull(), // "YYYY-MM-DD"
  eventLocation: text('event_location').notNull(),
  estimatedGuests: integer('estimated_guests'),
  budgetRange: text('budget_range'),
  additionalNotes: text('additional_notes'),
  status: text('status').notNull().default('Pending'), // 'Pending' | 'Contacted' | 'Confirmed' | 'Completed' | 'Cancelled'
  internalNotes: text('internal_notes'),
  quotedAmount: integer('quoted_amount'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// General Contact Inquiries
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  serviceRequested: text('service_requested'),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  status: text('status').default('New').notNull(), // 'New' | 'Replied' | 'Archived'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Testimonials / Client Reviews
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  clientRole: text('client_role').default('Bride & Groom'), // e.g. "Bride & Groom", "Fashion Model", "Corporate Client"
  avatarUrl: text('avatar_url'),
  review: text('review').notNull(),
  rating: integer('rating').default(5).notNull(),
  serviceName: text('service_name'),
  eventDate: text('event_date'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Special Offers & Seasonal Promotions
export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  tagline: text('tagline'),
  description: text('description').notNull(),
  discountText: text('discount_text').notNull(), // e.g. "20% OFF Wedding Packages"
  code: text('code'), // e.g. "ROYALWEDDING2026"
  startDate: text('start_date'),
  endDate: text('end_date'),
  bannerImage: text('banner_image'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Studio Settings (Configurable contact, address, social media, SEO)
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  studioName: text('studio_name').notNull().default('Laxmi Digital Photo Studio'),
  tagline: text('tagline').notNull().default('Your Moments. Our Passion. Your Memories Forever.'),
  phone: text('phone').notNull().default('+91 98765 43210'),
  whatsappNumber: text('whatsapp_number').notNull().default('919876543210'),
  email: text('email').notNull().default('contact@laxmidigitalstudio.com'),
  address: text('address').notNull().default('Shop No. 12, Heritage Plaza, Near Clock Tower, Main Market, New Delhi, India'),
  googleMapsUrl: text('google_maps_url').default('https://maps.google.com'),
  businessHours: text('business_hours').notNull().default('Mon - Sat: 9:30 AM - 9:00 PM | Sun: 10:00 AM - 6:00 PM'),
  instagramUrl: text('instagram_url').default('https://instagram.com'),
  facebookUrl: text('facebook_url').default('https://facebook.com'),
  youtubeUrl: text('youtube_url').default('https://youtube.com'),
  heroHeadline: text('hero_headline').default('Capturing Eternal Stories in Every Frame'),
  heroSubheadline: text('hero_subheadline').default('Award-winning wedding, portrait, and cinematic photography crafted with timeless elegance and devotion.'),
  defaultSeoTitle: text('default_seo_title').default('Laxmi Digital Photo Studio | Premium Wedding & Portrait Photography'),
  defaultSeoDescription: text('default_seo_description').default('Premium photography studio specializing in Indian weddings, pre-wedding cinema, portraits, candid moments, and luxury albums.'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const servicesRelations = relations(services, ({ many }) => ({
  packages: many(packages),
  bookings: many(bookings),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  service: one(services, {
    fields: [packages.serviceId],
    references: [services.id],
  }),
  bookings: many(bookings),
}));

export const galleriesRelations = relations(galleries, ({ many }) => ({
  photos: many(galleryPhotos),
}));

export const galleryPhotosRelations = relations(galleryPhotos, ({ one }) => ({
  gallery: one(galleries, {
    fields: [galleryPhotos.galleryId],
    references: [galleries.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  customer: one(customers, {
    fields: [bookings.customerId],
    references: [customers.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
}));

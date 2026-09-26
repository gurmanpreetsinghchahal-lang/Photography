// server.ts
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { db } from './src/db/index.ts';
import {
  siteSettings,
  services,
  packages,
  portfolioImages,
  galleries,
  galleryPhotos,
  testimonials,
  offers,
  bookings,
  inquiries,
  customers,
  users,
} from './src/db/schema.ts';
import { eq, desc, asc, ilike, or } from 'drizzle-orm';
import { seedDatabase } from './src/db/seed.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize DB seeding quietly on boot
seedDatabase().catch((err) => console.error('Seed check failed:', err));

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// 1. Studio Settings
app.get('/api/settings', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(siteSettings).limit(1);
    if (list.length > 0) {
      return res.json(list[0]);
    }
    // Fallback defaults if table is empty
    return res.json({
      studioName: 'Laxmi Digital Photo Studio',
      tagline: 'Your Moments. Our Passion. Your Memories Forever.',
      phone: '+91 98102 34567',
      whatsappNumber: '919810234567',
      email: 'hello@laxmidigitalstudio.com',
      address: 'Laxmi Digital Studio, Main Road, Connaught Place, New Delhi - 110001',
      businessHours: 'Monday - Sunday: 9:00 AM - 9:00 PM',
      heroHeadline: 'Capturing Eternal Grandeur in Every Sacred Frame',
      heroSubheadline: 'Mastering royal Indian weddings, dreamy pre-wedding cinema, fine-art portraits, and legacy albums for over 22 years.',
      defaultSeoTitle: 'Laxmi Digital Photo Studio | Royal Wedding & Portrait Photography',
      defaultSeoDescription: 'Top-rated photography studio for weddings, cinematic films, pre-weddings, portraits, and traditional celebrations across India.',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// 2. Services List
app.get('/api/services', async (_req: Request, res: Response) => {
  try {
    const list = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.displayOrder), asc(services.id));
    res.json(list);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
});

// 3. Single Service by Slug
app.get('/api/services/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const found = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
    if (!found || found.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    const service = found[0];
    const servicePackages = await db
      .select()
      .from(packages)
      .where(eq(packages.serviceId, service.id))
      .orderBy(asc(packages.displayOrder));
    res.json({ ...service, packages: servicePackages });
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    res.status(500).json({ error: 'Failed to retrieve service' });
  }
});

// 4. Packages List
app.get('/api/packages', async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.query;
    let query = db.select().from(packages).where(eq(packages.isActive, true));
    if (serviceId) {
      query = db
        .select()
        .from(packages)
        .where(eq(packages.serviceId, Number(serviceId))) as any;
    }
    const list = await query.orderBy(asc(packages.displayOrder), asc(packages.price));
    res.json(list);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to retrieve packages' });
  }
});

// 5. Portfolio Images
app.get('/api/portfolio', async (req: Request, res: Response) => {
  try {
    const { category, featured } = req.query;
    let list;
    if (category && category !== 'all') {
      list = await db
        .select()
        .from(portfolioImages)
        .where(eq(portfolioImages.category, String(category)))
        .orderBy(asc(portfolioImages.displayOrder), desc(portfolioImages.id));
    } else if (featured === 'true') {
      list = await db
        .select()
        .from(portfolioImages)
        .where(eq(portfolioImages.isFeatured, true))
        .orderBy(asc(portfolioImages.displayOrder));
    } else {
      list = await db
        .select()
        .from(portfolioImages)
        .orderBy(asc(portfolioImages.displayOrder), desc(portfolioImages.id));
    }
    res.json(list);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to retrieve portfolio' });
  }
});

// 6. Public Galleries
app.get('/api/galleries', async (_req: Request, res: Response) => {
  try {
    const list = await db
      .select({
        id: galleries.id,
        title: galleries.title,
        slug: galleries.slug,
        coverImage: galleries.coverImage,
        clientName: galleries.clientName,
        eventDate: galleries.eventDate,
        category: galleries.category,
        description: galleries.description,
        photoCount: galleries.photoCount,
        isPrivate: galleries.isPrivate,
      })
      .from(galleries)
      .orderBy(desc(galleries.id));
    res.json(list);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({ error: 'Failed to retrieve galleries' });
  }
});

// 7. Single Gallery Details + Photos (Handles Password for private)
app.post('/api/galleries/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { password } = req.body || {};
    const found = await db.select().from(galleries).where(eq(galleries.slug, slug)).limit(1);
    if (!found || found.length === 0) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    const gallery = found[0];

    if (gallery.isPrivate) {
      if (!password || password !== gallery.accessPassword) {
        return res.status(403).json({
          error: 'Protected Gallery: Invalid or missing passcode',
          isProtected: true,
          title: gallery.title,
          coverImage: gallery.coverImage,
        });
      }
    }

    const photos = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.galleryId, gallery.id))
      .orderBy(asc(galleryPhotos.displayOrder), asc(galleryPhotos.id));

    // Exclude accessPassword from public response
    const { accessPassword, ...safeGallery } = gallery;
    res.json({ ...safeGallery, photos });
  } catch (error) {
    console.error('Error fetching gallery details:', error);
    res.status(500).json({ error: 'Failed to retrieve gallery photos' });
  }
});

// 8. Testimonials
app.get('/api/testimonials', async (_req: Request, res: Response) => {
  try {
    const list = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(desc(testimonials.id));
    res.json(list);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to retrieve testimonials' });
  }
});

// 9. Active Offers
app.get('/api/offers', async (_req: Request, res: Response) => {
  try {
    const list = await db
      .select()
      .from(offers)
      .where(eq(offers.isActive, true))
      .orderBy(desc(offers.id));
    res.json(list);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to retrieve offers' });
  }
});

// 10. Submit Booking Request
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      serviceId,
      serviceName,
      packageId,
      packageName,
      eventDate,
      eventLocation,
      estimatedGuests,
      budgetRange,
      additionalNotes,
    } = req.body;

    if (!customerName || !customerPhone || !eventDate || !eventLocation) {
      return res.status(400).json({ error: 'Name, Phone, Event Date, and Location are required.' });
    }

    // Upsert or retrieve customer
    let customerRecord = await db
      .select()
      .from(customers)
      .where(eq(customers.phone, customerPhone.trim()))
      .limit(1);

    let customerId: number;
    if (customerRecord.length > 0) {
      customerId = customerRecord[0].id;
      await db
        .update(customers)
        .set({
          totalBookings: customerRecord[0].totalBookings + 1,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customerId));
    } else {
      const created = await db
        .insert(customers)
        .values({
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail?.trim() || null,
          totalBookings: 1,
        })
        .returning();
      customerId = created[0].id;
    }

    const bookingNumber = `LDS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = await db
      .insert(bookings)
      .values({
        bookingNumber,
        customerId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || null,
        serviceId: serviceId ? Number(serviceId) : null,
        serviceName: serviceName || 'General Session',
        packageId: packageId ? Number(packageId) : null,
        packageName: packageName || null,
        eventDate,
        eventLocation,
        estimatedGuests: estimatedGuests ? Number(estimatedGuests) : null,
        budgetRange: budgetRange || null,
        additionalNotes: additionalNotes || null,
        status: 'Pending',
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Booking request registered successfully. Our studio team will reach out promptly!',
      booking: newBooking[0],
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to submit booking inquiry' });
  }
});

// 11. Submit General Contact Inquiry
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, serviceRequested, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message are required.' });
    }

    const newInquiry = await db
      .insert(inquiries)
      .values({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        serviceRequested: serviceRequested || null,
        message: message.trim(),
        isRead: false,
        status: 'New',
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Inquiry received. We will contact you via WhatsApp/Phone shortly.',
      inquiry: newInquiry[0],
    });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ error: 'Failed to submit contact message' });
  }
});

// ==========================================
// ADMIN API ENDPOINTS (Protected with requireAuth)
// ==========================================

// Admin: Current User verification & Sync
app.post('/api/admin/auth-sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const uid = user.uid;
    const email = user.email || 'admin@laxmidigitalstudio.com';
    const displayName = (user as any).name || (user as any).displayName || 'Studio Manager';
    const photoUrl = (user as any).picture || null;

    // Use atomic upsert to avoid race conditions when concurrent auth-sync requests occur
    const records = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName,
        photoUrl,
        role: 'admin',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName,
          photoUrl,
          updatedAt: new Date(),
        },
      })
      .returning();

    res.json({ success: true, user: records[0] });
  } catch (error) {
    console.error('Error syncing auth user:', error);
    res.status(500).json({ error: 'Failed to verify admin status' });
  }
});

// Admin: Analytics Dashboard Summary
app.get('/api/admin/dashboard', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const allBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    const allInquiries = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
    const allServices = await db.select().from(services);
    const allPortfolio = await db.select().from(portfolioImages);
    const allCustomers = await db.select().from(customers);

    const pendingInquiriesCount = allInquiries.filter((i) => !i.isRead || i.status === 'New').length;
    const pendingBookingsCount = allBookings.filter((b) => b.status === 'Pending').length;
    const confirmedBookingsCount = allBookings.filter((b) => b.status === 'Confirmed').length;
    const completedBookingsCount = allBookings.filter((b) => b.status === 'Completed').length;

    // Aggregate monthly bookings count
    const monthlyStats: Record<string, { bookings: number; inquiries: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Seed last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthNames[d.getMonth()]}`;
      monthlyStats[label] = { bookings: 0, inquiries: 0 };
    }

    allBookings.forEach((b) => {
      const d = new Date(b.createdAt);
      const label = monthNames[d.getMonth()];
      if (monthlyStats[label]) {
        monthlyStats[label].bookings += 1;
      }
    });

    allInquiries.forEach((inq) => {
      const d = new Date(inq.createdAt);
      const label = monthNames[d.getMonth()];
      if (monthlyStats[label]) {
        monthlyStats[label].inquiries += 1;
      }
    });

    const monthlyData = Object.entries(monthlyStats).map(([month, data]) => ({
      month,
      bookings: data.bookings,
      inquiries: data.inquiries,
    }));

    // Service popularity
    const servicePopularity: Record<string, number> = {};
    allBookings.forEach((b) => {
      const sName = b.serviceName || 'Other';
      servicePopularity[sName] = (servicePopularity[sName] || 0) + 1;
    });

    res.json({
      counts: {
        totalBookings: allBookings.length,
        pendingBookings: pendingBookingsCount,
        confirmedBookings: confirmedBookingsCount,
        completedBookings: completedBookingsCount,
        pendingInquiries: pendingInquiriesCount,
        totalCustomers: allCustomers.length,
        totalPortfolioImages: allPortfolio.length,
        activeServicesCount: allServices.filter((s) => s.isActive).length,
      },
      recentBookings: allBookings.slice(0, 5),
      recentInquiries: allInquiries.slice(0, 5),
      monthlyData,
      servicePopularity: Object.entries(servicePopularity).map(([name, count]) => ({ name, count })),
    });
  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard metrics' });
  }
});

// Admin: Bookings Management
app.get('/api/admin/bookings', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    let query = db.select().from(bookings);
    const list = await query.orderBy(desc(bookings.createdAt));

    let filtered = list;
    if (status && status !== 'all') {
      filtered = filtered.filter((b) => b.status === status);
    }
    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.customerName.toLowerCase().includes(s) ||
          b.bookingNumber.toLowerCase().includes(s) ||
          b.customerPhone.includes(s) ||
          b.serviceName.toLowerCase().includes(s)
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error loading admin bookings:', error);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

app.patch('/api/admin/bookings/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, quotedAmount } = req.body;
    const updated = await db
      .update(bookings)
      .set({
        ...(status ? { status } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(quotedAmount !== undefined ? { quotedAmount: Number(quotedAmount) } : {}),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, Number(id)))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

app.delete('/api/admin/bookings/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(bookings).where(eq(bookings.id, Number(id)));
    res.json({ success: true, message: 'Booking removed' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Admin: Inquiries Management
app.get('/api/admin/inquiries', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const list = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
    res.json(list);
  } catch (error) {
    console.error('Error fetching admin inquiries:', error);
    res.status(500).json({ error: 'Failed to load inquiries' });
  }
});

app.patch('/api/admin/inquiries/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isRead, status } = req.body;
    const updated = await db
      .update(inquiries)
      .set({
        ...(isRead !== undefined ? { isRead } : {}),
        ...(status ? { status } : {}),
      })
      .where(eq(inquiries.id, Number(id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

app.delete('/api/admin/inquiries/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(inquiries).where(eq(inquiries.id, Number(id)));
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// Admin: Customers Directory
app.get('/api/admin/customers', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const list = await db.select().from(customers).orderBy(desc(customers.updatedAt));
    res.json(list);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to retrieve customers' });
  }
});

// Admin: Services Management (CRUD)
app.post('/api/admin/services', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      slug,
      tagline,
      shortDescription,
      fullDescription,
      imageUrl,
      startingPrice,
      features,
      faqs,
      displayOrder,
      isActive,
    } = req.body;

    const created = await db
      .insert(services)
      .values({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: tagline || null,
        shortDescription,
        fullDescription,
        imageUrl,
        startingPrice: startingPrice ? Number(startingPrice) : null,
        features: Array.isArray(features) ? features : [],
        faqs: Array.isArray(faqs) ? faqs : [],
        displayOrder: displayOrder ? Number(displayOrder) : 0,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    res.status(201).json(created[0]);
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/admin/services/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      tagline,
      shortDescription,
      fullDescription,
      imageUrl,
      startingPrice,
      features,
      faqs,
      displayOrder,
      isActive,
    } = req.body;

    const updated = await db
      .update(services)
      .set({
        name,
        slug,
        tagline,
        shortDescription,
        fullDescription,
        imageUrl,
        startingPrice: startingPrice ? Number(startingPrice) : null,
        features: Array.isArray(features) ? features : [],
        faqs: Array.isArray(faqs) ? faqs : [],
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(services.id, Number(id)))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/admin/services/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(services).where(eq(services.id, Number(id)));
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Admin: Packages Management (CRUD)
app.post('/api/admin/packages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      serviceId,
      name,
      slug,
      price,
      originalPrice,
      duration,
      description,
      deliverables,
      isFeatured,
      isActive,
      displayOrder,
    } = req.body;

    const created = await db
      .insert(packages)
      .values({
        serviceId: serviceId ? Number(serviceId) : null,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        duration: duration || null,
        description,
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        displayOrder: displayOrder ? Number(displayOrder) : 0,
      })
      .returning();

    res.status(201).json(created[0]);
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

app.put('/api/admin/packages/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      serviceId,
      name,
      slug,
      price,
      originalPrice,
      duration,
      description,
      deliverables,
      isFeatured,
      isActive,
      displayOrder,
    } = req.body;

    const updated = await db
      .update(packages)
      .set({
        serviceId: serviceId ? Number(serviceId) : null,
        name,
        slug,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        duration: duration || null,
        description,
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, Number(id)))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

app.delete('/api/admin/packages/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(packages).where(eq(packages.id, Number(id)));
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// Admin: Portfolio Management (CRUD)
app.post('/api/admin/portfolio', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, imageUrl, thumbnailUrl, description, location, aspectRatio, isFeatured, displayOrder } =
      req.body;

    const created = await db
      .insert(portfolioImages)
      .values({
        title,
        category,
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        description: description || null,
        location: location || null,
        aspectRatio: aspectRatio || '4:3',
        isFeatured: Boolean(isFeatured),
        displayOrder: displayOrder ? Number(displayOrder) : 0,
      })
      .returning();

    res.status(201).json(created[0]);
  } catch (error) {
    console.error('Error adding portfolio image:', error);
    res.status(500).json({ error: 'Failed to add portfolio image' });
  }
});

app.delete('/api/admin/portfolio/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(portfolioImages).where(eq(portfolioImages.id, Number(id)));
    res.json({ success: true, message: 'Portfolio image removed' });
  } catch (error) {
    console.error('Error deleting portfolio image:', error);
    res.status(500).json({ error: 'Failed to delete portfolio image' });
  }
});

// Admin: Galleries Management (CRUD)
app.post('/api/admin/galleries', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, coverImage, clientName, eventDate, category, description, isPrivate, accessPassword, photos } =
      req.body;

    const created = await db
      .insert(galleries)
      .values({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        coverImage,
        clientName: clientName || null,
        eventDate: eventDate || null,
        category: category || 'weddings',
        description: description || null,
        photoCount: Array.isArray(photos) ? photos.length : 0,
        isPrivate: Boolean(isPrivate),
        accessPassword: accessPassword || null,
      })
      .returning();

    const newGallery = created[0];

    if (Array.isArray(photos) && photos.length > 0) {
      await db.insert(galleryPhotos).values(
        photos.map((p: any, idx: number) => ({
          galleryId: newGallery.id,
          imageUrl: typeof p === 'string' ? p : p.imageUrl,
          caption: p.caption || null,
          displayOrder: idx + 1,
        }))
      );
    }

    res.status(201).json(newGallery);
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({ error: 'Failed to create gallery' });
  }
});

app.delete('/api/admin/galleries/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(galleries).where(eq(galleries.id, Number(id)));
    res.json({ success: true, message: 'Gallery deleted' });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    res.status(500).json({ error: 'Failed to delete gallery' });
  }
});

// Admin: Testimonials Management
app.post('/api/admin/testimonials', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { clientName, clientRole, avatarUrl, review, rating, serviceName, eventDate, isActive } = req.body;
    const created = await db
      .insert(testimonials)
      .values({
        clientName,
        clientRole: clientRole || 'Client',
        avatarUrl: avatarUrl || null,
        review,
        rating: rating ? Number(rating) : 5,
        serviceName: serviceName || null,
        eventDate: eventDate || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    res.status(201).json(created[0]);
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.delete('/api/admin/testimonials/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(testimonials).where(eq(testimonials.id, Number(id)));
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// Admin: Offers Management
app.post('/api/admin/offers', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, tagline, description, discountText, code, startDate, endDate, bannerImage, isActive } = req.body;
    const created = await db
      .insert(offers)
      .values({
        title,
        tagline: tagline || null,
        description,
        discountText,
        code: code || null,
        startDate: startDate || null,
        endDate: endDate || null,
        bannerImage: bannerImage || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    res.status(201).json(created[0]);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

app.delete('/api/admin/offers/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(offers).where(eq(offers.id, Number(id)));
    res.json({ success: true, message: 'Offer deleted' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});

// Admin: Site Settings Update
app.put('/api/admin/settings', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    const current = await db.select().from(siteSettings).limit(1);

    if (current.length === 0) {
      const created = await db.insert(siteSettings).values(body).returning();
      return res.json(created[0]);
    }

    const updated = await db
      .update(siteSettings)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, current[0].id))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Vite Middleware for Frontend Serving in Dev & Static in Prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Laxmi Digital Photo Studio server running on port ${PORT}`);
  });
}

startServer();

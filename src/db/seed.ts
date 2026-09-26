// src/db/seed.ts
import { db } from './index.ts';
import {
  siteSettings,
  services,
  packages,
  portfolioImages,
  galleries,
  galleryPhotos,
  testimonials,
  offers,
  customers,
  bookings,
  inquiries,
} from './schema.ts';

export async function seedDatabase() {
  try {
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length > 0) {
      console.log('Database already seeded. Skipping initial seeding.');
      return;
    }

    console.log('Seeding initial studio data...');

    // 1. Site Settings
    await db.insert(siteSettings).values({
      studioName: 'Laxmi Digital Photo Studio',
      tagline: 'Your Moments. Our Passion. Your Memories Forever.',
      phone: '+91 98102 34567',
      whatsappNumber: '919810234567',
      email: 'hello@laxmidigitalstudio.com',
      address: 'Laxmi Digital Studio, Main Road, Near Central Heritage Gate, Connaught Place, New Delhi - 110001',
      googleMapsUrl: 'https://maps.google.com/?q=Connaught+Place+New+Delhi',
      businessHours: 'Monday - Sunday: 9:00 AM - 9:00 PM (Sessions by Appointment)',
      instagramUrl: 'https://instagram.com/laxmidigitalstudioreal',
      facebookUrl: 'https://facebook.com/laxmidigitalstudio',
      youtubeUrl: 'https://youtube.com/@laxmidigitalstudio',
      heroHeadline: 'Capturing Eternal Grandeur in Every Sacred Frame',
      heroSubheadline: 'Mastering royal Indian weddings, dreamy pre-wedding cinema, fine-art portraits, and legacy heirloom albums for over 22 years.',
      defaultSeoTitle: 'Laxmi Digital Photo Studio | Royal Wedding & Portrait Photography',
      defaultSeoDescription: 'Top-rated photography studio for weddings, cinematic films, pre-weddings, portraits, and traditional celebrations across India.',
    });

    // 2. Services
    const insertedServices = await db.insert(services).values([
      {
        slug: 'wedding-photography',
        name: 'Royal Wedding Photography & Cinema',
        tagline: 'Timeless luxury storytelling for your once-in-a-lifetime vows',
        shortDescription: 'Comprehensive coverage of your Mehndi, Sangeet, Haldi, Baraat, Pheras, and Reception with cinematic precision.',
        fullDescription: 'From intimate rituals to majestic palace receptions, our team brings two decades of expertise in capturing the pure emotion, colorful traditions, and grandeur of Indian weddings. Equipped with full-frame Sony FX3 & A7R cinema cameras, specialized primes, and dedicated lighting masters.',
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
        startingPrice: 65000,
        features: [
          'Dual Senior Candid & Traditional Photographers',
          '4K UHD Cinematic Teaser & Full-length Wedding Film',
          'Handcrafted Silk-bound Luxury Heirloom Album',
          'Same-Day Edit Slideshow for Reception Screen',
          'Drone / Aerial 4K Cinematography',
          'All High-Resolution Color-Graded RAW JPEGs on Custom Wooden USB'
        ],
        faqs: [
          { question: 'How early should we book our wedding dates?', answer: 'We typically book wedding dates 4 to 9 months in advance, especially during the auspicious wedding season (October to March).' },
          { question: 'Do you travel across India and internationally?', answer: 'Yes! We frequently cover destination weddings in Udaipur, Jaipur, Goa, Kerala, and international locations.' },
          { question: 'When do we receive our final photos and albums?', answer: 'Full edited digital gallery delivered within 3 weeks; printed bespoke albums delivered within 5 weeks.' }
        ],
        displayOrder: 1,
        isActive: true,
      },
      {
        slug: 'pre-wedding-shoot',
        name: 'Pre-Wedding & Couple Story Shoots',
        tagline: 'Romantic, cinematic, and unforgettable destination vignettes',
        shortDescription: 'Cinematic storytelling with designer styling, drone perspectives, and intimate locations that celebrate your love story.',
        fullDescription: 'Celebrate your courtship in iconic heritage havelis, serene lakeside landscapes, or urban architectural marvels. We coordinate wardrobe themes, dramatic sunset lighting, and music video-style cinematic films that evoke pure romance.',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        startingPrice: 35000,
        features: [
          'Full-day multi-location outdoor shoot',
          'Cinematic 3-Minute 4K Musical Love-Story Video',
          '3-4 Wardrobe theme changes with posing guidance',
          'Drone 4K aerial shots',
          '50+ High-end magazine retouched portrait frames',
          'Large acrylic wall art print for wedding entrance display'
        ],
        faqs: [
          { question: 'Can you help us choose locations and permissions?', answer: 'Absolutely. We have curated location partners including royal forts, beaches, flower valleys, and private farm villas.' },
          { question: 'Do you provide outfit consultation?', answer: 'Yes, our creative director shares a moodboard with color palettes complementing chosen environments.' }
        ],
        displayOrder: 2,
        isActive: true,
      },
      {
        slug: 'portrait-fashion-studio',
        name: 'Fine Art Portraits & Fashion Portfolios',
        tagline: 'Sculpted lighting, character, and magazine-grade retouching',
        shortDescription: 'Professional studio portraits, maternity sessions, actor/model portfolios, and executive corporate headshots.',
        fullDescription: 'Our state-of-the-art climate-controlled studio features Broncolor and Profoto strobe lights, diverse canvas backdrops, luxury props, and dedicated vanity makeup quarters to deliver striking fine-art portraits.',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
        startingPrice: 8500,
        features: [
          'Profoto studio lighting setup with softbox and beauty dish modifiers',
          '3 Backdrop selections (Charcoal canvas, Warm Sand, Classic White)',
          'High-end skin retouching retaining natural skin texture',
          'Express delivery in under 48 hours for portfolios',
          'High-resolution TIFF + web-optimized digital files'
        ],
        faqs: [
          { question: 'Do you offer hair and makeup support?', answer: 'Yes, we have an on-call celebrity-trained MUA team available on advance request.' }
        ],
        displayOrder: 3,
        isActive: true,
      },
      {
        slug: 'events-birthdays-celebrations',
        name: 'Birthdays, Anniversaries & Corporate Galas',
        tagline: 'Vibrant candid moments captured without missing a heartbeat',
        shortDescription: 'First birthday cakes, silver jubilee anniversaries, corporate summits, and cultural celebrations documented with energy.',
        fullDescription: 'From high-energy birthday parties to prestigious corporate galas, we deliver lively candid shots of guests, keynote stages, decor details, and family interactions with zero intrusion.',
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
        startingPrice: 15000,
        features: [
          'High-speed candid coverage of decor, guests, and stage moments',
          'On-site instant digital delivery preview QR code for guests',
          'High-resolution archive gallery with 1-year cloud backup',
          'Optional photo booth setup with instant 4x6 printouts'
        ],
        faqs: [
          { question: 'How quickly can we get the photos after the event?', answer: 'A preview set of 30 highlight frames is provided within 12 hours for social sharing!' }
        ],
        displayOrder: 4,
        isActive: true,
      },
      {
        slug: 'maternity-newborn',
        name: 'Maternity & Newborn Baby Shoots',
        tagline: 'Gentle, heartwarming portraits of life’s newest miracle',
        shortDescription: 'Safe, sanitized, temperature-regulated newborn baby shoots and graceful mother-to-be maternity sessions.',
        fullDescription: 'Creating timeless heirloom art during your most delicate milestones. We sanitize all sanitized knit wraps, rustic wooden bowls, and soft organic blankets for newborn safety.',
        imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1600&q=80',
        startingPrice: 12000,
        features: [
          'Safe & hygienic sanitized props and hypoallergenic fabrics',
          'Patience-driven shooting rhythm adapting to baby’s sleep and feeding',
          'Elegant backlit silhouettes and royal gowns for mother',
          'Complimentary mini coffee table album'
        ],
        faqs: [
          { question: 'What is the best time for newborn photography?', answer: 'Between day 7 and day 21 when the baby sleeps deeply and can be gently posed.' }
        ],
        displayOrder: 5,
        isActive: true,
      },
      {
        slug: 'premium-albums-framing',
        name: 'Handcrafted Albums & Heritage Framing',
        tagline: 'Archival flush-mount albums built to last for generations',
        shortDescription: 'Italian leather, pure silk, acrylic glass covers with Kodak Endura HD paper that never fades.',
        fullDescription: 'Digital files can be lost on old hard drives; an album is an heirloom you hold in your hands with your children and grandchildren. Designed page-by-page by our master layout artists.',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80',
        startingPrice: 9500,
        features: [
          'Kodak Metallic / Velvet Matte archival paper',
          'Lay-flat seamless 180-degree spread bindings',
          'Personalized gold/silver embossing of couple names',
          'Luxury velvet presentation briefcase'
        ],
        faqs: [
          { question: 'Can you design an album from photos we already took elsewhere?', answer: 'Yes! Bring us your digital files and we will design and print a bespoke luxury album.' }
        ],
        displayOrder: 6,
        isActive: true,
      }
    ]).returning();

    const weddingService = insertedServices.find(s => s.slug === 'wedding-photography') || insertedServices[0];
    const preWedService = insertedServices.find(s => s.slug === 'pre-wedding-shoot') || insertedServices[1];
    const portraitService = insertedServices.find(s => s.slug === 'portrait-fashion-studio') || insertedServices[2];

    // 3. Packages
    await db.insert(packages).values([
      {
        serviceId: weddingService.id,
        name: 'Classic Wedding Celebration',
        slug: 'classic-wedding',
        price: 65000,
        originalPrice: 75000,
        duration: '1-2 Days (Up to 14 Hours total)',
        description: 'Ideal for intimate weddings and traditional ceremonies with comprehensive coverage.',
        deliverables: [
          '1 Traditional Senior Photographer + 1 Traditional Videographer',
          '350+ Retouched High-Resolution Photographs',
          'Full-Length HD Event Video (60-90 Mins)',
          '1 Standard Hardcover Photo Album (40 Pages / 200 Photos)',
          'All Digital Media in 64GB USB Drive'
        ],
        isFeatured: false,
        isActive: true,
        displayOrder: 1,
      },
      {
        serviceId: weddingService.id,
        name: 'Royal Heritage Package',
        slug: 'royal-heritage',
        price: 125000,
        originalPrice: 145000,
        duration: '2-3 Days (Full Celebration Coverage)',
        description: 'Our most sought-after wedding package combining artistic candid imagery with breathtaking 4K cinematic film.',
        deliverables: [
          '2 Senior Candid Artists + 1 Traditional Photographer + 2 Cinematographers',
          '4K Cinematic Wedding Highlights Teaser (3-5 Mins) with licensed music',
          'Comprehensive Cinematic Film (45-60 Mins) with bride & groom interviews',
          'Aerial 4K Drone Coverage of Baraat and Venue architecture',
          '2 Handcrafted Italian Leather Flush-Mount Albums (50 Spreads each)',
          '2 Smaller Mini Parent Heirloom Albums (Complimentary)',
          'Private Online Cloud Gallery with 1-Year Streaming & Sharing Access'
        ],
        isFeatured: true,
        isActive: true,
        displayOrder: 2,
      },
      {
        serviceId: weddingService.id,
        name: 'Imperial Destination Luxury',
        slug: 'imperial-luxury',
        price: 240000,
        originalPrice: 280000,
        duration: '3-4 Days (Unlimited Multi-Day Festivities)',
        description: 'Bespoke high-end production for palace and destination celebrations with complete crew and instant delivery.',
        deliverables: [
          'Director-led crew of 6 master visual artists',
          'Same-Day Edit (SDE) teaser screened live at the Grand Reception',
          'Master Cinema Teaser + 90-Minute Director’s Cut Film',
          'Full Drone Cinematic Team with dual-operator precision',
          'Luxury Acrylic Glass Box Album with Gold Guilded Edging',
          'Pre-Wedding Destination Shoot included with zero crew fee',
          'Lifetime Cloud Archival Vault + High-Speed SSD Delivery'
        ],
        isFeatured: false,
        isActive: true,
        displayOrder: 3,
      },
      {
        serviceId: preWedService.id,
        name: 'Romantic Vignettes (Pre-Wedding)',
        slug: 'pre-wedding-classic',
        price: 35000,
        originalPrice: 42000,
        duration: 'Full Day (Sunrise to Sunset)',
        description: 'Designed for couples looking for expressive, cinematic frames and a music-video love story.',
        deliverables: [
          '1 Senior Candid Photographer + 1 Director Cinematographer',
          'Up to 3 Location Changes within city limits or scenic spots',
          '3-Minute 4K Cinematic Song Film with sound design',
          '60 Magisterial Color-Graded Portrait Masterpieces',
          '1 Large 24x36 Velvet Matte Framed Canvas Portrait for Wedding Stage'
        ],
        isFeatured: false,
        isActive: true,
        displayOrder: 4,
      },
      {
        serviceId: portraitService.id,
        name: 'Studio Signature Portrait Session',
        slug: 'studio-signature',
        price: 12000,
        originalPrice: 15000,
        duration: '2-3 Hours In-Studio',
        description: 'Exquisite fine-art portrait session with master lighting for individuals, couples, or executives.',
        deliverables: [
          '3 Wardrobe / Theme Changes',
          'Choice of Hand-Painted Canvas Backdrops',
          '25 Master-Retouched High-Res Editorial Deliverables',
          'Full Copyright Release for Commercial & Personal Use',
          'Express 48-Hour High-Resolution Digital Delivery'
        ],
        isFeatured: false,
        isActive: true,
        displayOrder: 5,
      }
    ]);

    // 4. Portfolio Images
    await db.insert(portfolioImages).values([
      {
        title: 'The Royal Pheras in Golden Radiance',
        category: 'weddings',
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=75',
        description: 'Bride and Groom sharing heartfelt vows amidst shower of marigold petals in Udaipur palace courtyard.',
        location: 'City Palace, Udaipur',
        aspectRatio: '16:9',
        isFeatured: true,
        displayOrder: 1,
      },
      {
        title: 'Heirloom Kundan & Crimson Gown',
        category: 'weddings',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=75',
        description: 'Intricate bridal jewelry and hand-embroidered lehenga details in natural morning window light.',
        location: 'The Leela Palace, New Delhi',
        aspectRatio: '4:3',
        isFeatured: true,
        displayOrder: 2,
      },
      {
        title: 'Twilight Reverie by the Lake',
        category: 'pre-weddings',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=75',
        description: 'Serenade session at Lake Pichola during sunset reflections.',
        location: 'Lake Pichola, Udaipur',
        aspectRatio: '16:9',
        isFeatured: true,
        displayOrder: 3,
      },
      {
        title: 'Architectural Romance in Heritage Arches',
        category: 'pre-weddings',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=75',
        description: 'Graceful silhouettes framed within ancient sandstone carvings.',
        location: 'Amer Fort, Jaipur',
        aspectRatio: '4:3',
        isFeatured: true,
        displayOrder: 4,
      },
      {
        title: 'Fine-Art Charcoal Monochrome Portrait',
        category: 'portraits',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=75',
        description: 'Moody Rembrandt lighting illuminating grace and contemplation.',
        location: 'Laxmi Studio Main Floor',
        aspectRatio: '3:4',
        isFeatured: true,
        displayOrder: 5,
      },
      {
        title: 'Sangeet Night Electrifying Joy',
        category: 'events',
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=75',
        description: 'High octane dance performances captured with freezing shutter flashes.',
        location: 'JW Marriott, Aerocity',
        aspectRatio: '16:9',
        isFeatured: true,
        displayOrder: 6,
      },
      {
        title: 'Intimate Bridal Preparation Whispers',
        category: 'weddings',
        imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=75',
        description: 'Tender moments between mother and daughter fastening the royal dupatta.',
        location: 'ITC Maurya, New Delhi',
        aspectRatio: '4:3',
        isFeatured: false,
        displayOrder: 7,
      },
      {
        title: 'Golden Hour Couple Silhouette',
        category: 'couples',
        imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=75',
        description: 'Basking in the warm embrace of dusk across the desert horizon.',
        location: 'Sam Sand Dunes, Jaisalmer',
        aspectRatio: '16:9',
        isFeatured: false,
        displayOrder: 8,
      },
      {
        title: 'Heirloom Artisan Album Showcase',
        category: 'studio',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=75',
        description: 'Hand-sewn Italian velvet wedding album spread with debossed golden scripture.',
        location: 'Laxmi Album Workshop',
        aspectRatio: '16:9',
        isFeatured: false,
        displayOrder: 9,
      }
    ]);

    // 5. Galleries
    const insertedGalleries = await db.insert(galleries).values([
      {
        title: 'Aman & Meher — A Royal Palace Wedding',
        slug: 'aman-meher-wedding',
        coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
        clientName: 'Aman & Meher Verma',
        eventDate: '2026-02-18',
        category: 'weddings',
        description: 'Three days of vibrant traditional ceremonies and emotional moments set against the dramatic Mewar architecture.',
        photoCount: 18,
        isPrivate: false,
      },
      {
        title: 'Rohan & Ananya — Sand Dunes Pre-Wedding',
        slug: 'rohan-ananya-prewedding',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        clientName: 'Rohan Kapoor & Ananya Sen',
        eventDate: '2026-01-22',
        category: 'pre-weddings',
        description: 'Desert winds, flowing silk gowns, and starry bonfire nights celebrating their courtship.',
        photoCount: 14,
        isPrivate: false,
      },
      {
        title: 'Khurana Family — Private Heirloom Gallery',
        slug: 'khurana-private-celebration',
        coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
        clientName: 'Vikram Khurana',
        eventDate: '2026-03-05',
        category: 'weddings',
        description: 'Confidential client preview for selection of 200 album master prints.',
        photoCount: 8,
        isPrivate: true,
        accessPassword: 'Laxmi2026Password',
      }
    ]).returning();

    // 6. Gallery Photos
    if (insertedGalleries.length > 0) {
      await db.insert(galleryPhotos).values([
        {
          galleryId: insertedGalleries[0].id,
          imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
          caption: 'The Sacred Pheras around the Agni Kund',
          displayOrder: 1,
        },
        {
          galleryId: insertedGalleries[0].id,
          imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
          caption: 'Bridal details in natural daylight',
          displayOrder: 2,
        },
        {
          galleryId: insertedGalleries[0].id,
          imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=80',
          caption: 'Intimate candid smiles before the entry',
          displayOrder: 3,
        },
        {
          galleryId: insertedGalleries[0].id,
          imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
          caption: 'Electrifying sangeet dance performance',
          displayOrder: 4,
        },
        {
          galleryId: insertedGalleries[1].id,
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
          caption: 'Golden sunset on lake promenade',
          displayOrder: 1,
        },
        {
          galleryId: insertedGalleries[1].id,
          imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80',
          caption: 'Twilight embrace across desert dunes',
          displayOrder: 2,
        }
      ]);
    }

    // 7. Testimonials
    await db.insert(testimonials).values([
      {
        clientName: 'Priya & Siddharth Malhotra',
        clientRole: 'Royal Wedding (Udaipur)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        review: 'Choosing Laxmi Digital Photo Studio was the single best decision we made for our wedding. The team was completely unobtrusive, kind, and when we saw the 4K cinematic film, my entire family had tears in our eyes. Truly world-class quality!',
        rating: 5,
        serviceName: 'Royal Wedding Photography & Cinema',
        eventDate: 'February 2026',
        isActive: true,
      },
      {
        clientName: 'Arjun & Sneha Singhal',
        clientRole: 'Pre-Wedding Shoot (Jaipur)',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        review: 'Neither of us knew how to pose, but the lead photographer guided us with such warmth and humor! Every picture looks like it belongs on the cover of Vogue. The handcrafted leather album is a showpiece in our living room.',
        rating: 5,
        serviceName: 'Pre-Wedding & Couple Story Shoots',
        eventDate: 'January 2026',
        isActive: true,
      },
      {
        clientName: 'Col. Rajesh & Anita Bakshi',
        clientRole: '25th Silver Jubilee Anniversary',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        review: 'Mr. Laxmi and his crew have been our family photographers for 18 years. From our daughter’s first birthday to her wedding last week, they carry a deep respect for our traditions and deliver unmatched warmth.',
        rating: 5,
        serviceName: 'Royal Heritage Package',
        eventDate: 'December 2025',
        isActive: true,
      }
    ]);

    // 8. Offers
    await db.insert(offers).values([
      {
        title: 'Auspicious Wedding Season Privilege',
        tagline: 'Book Early & Receive A Complimentary 4K Pre-Wedding Film',
        description: 'Confirm any Royal Heritage or Imperial Wedding Package for upcoming wedding dates and receive a complimentary full-day pre-wedding shoot with 4K drone cinematography worth ₹35,000.',
        discountText: 'Complimentary Pre-Wedding Shoot (Worth ₹35,000)',
        code: 'ROYALSEASON2026',
        startDate: '2026-03-01',
        endDate: '2026-11-30',
        bannerImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
        isActive: true,
      }
    ]);

    // 9. Customers
    const insertedCustomers = await db.insert(customers).values([
      {
        name: 'Kabir & Radhika Oberoi',
        phone: '+91 98111 22334',
        email: 'kabir.oberoi@example.com',
        notes: 'Preferred wedding dates in November 2026 in Neemrana Fort.',
        totalBookings: 1,
      },
      {
        name: 'Vikram & Tanvi Khurana',
        phone: '+91 98222 33445',
        email: 'vikram.khurana@example.com',
        notes: 'Requested expedited delivery for private preview gallery.',
        totalBookings: 1,
      }
    ]).returning();

    // 10. Bookings
    await db.insert(bookings).values([
      {
        bookingNumber: 'LDS-2026-1001',
        customerId: insertedCustomers[0]?.id,
        customerName: 'Kabir & Radhika Oberoi',
        customerPhone: '+91 98111 22334',
        customerEmail: 'kabir.oberoi@example.com',
        serviceId: weddingService.id,
        serviceName: 'Royal Wedding Photography & Cinema',
        packageId: 2,
        packageName: 'Royal Heritage Package',
        eventDate: '2026-11-20',
        eventLocation: 'Neemrana Fort-Palace, Rajasthan',
        estimatedGuests: 450,
        budgetRange: '₹1,50,000 - ₹2,50,000',
        additionalNotes: 'Require drone coverage for sunset Baraat and high-speed editing for next day reception.',
        status: 'Confirmed',
        internalNotes: 'Advance token of ₹35,000 paid. Creative moodboard shared with client.',
        quotedAmount: 145000,
      },
      {
        bookingNumber: 'LDS-2026-1002',
        customerId: insertedCustomers[1]?.id,
        customerName: 'Vikram & Tanvi Khurana',
        customerPhone: '+91 98222 33445',
        customerEmail: 'vikram.khurana@example.com',
        serviceId: preWedService.id,
        serviceName: 'Pre-Wedding & Couple Story Shoots',
        packageId: 4,
        packageName: 'Romantic Vignettes (Pre-Wedding)',
        eventDate: '2026-10-15',
        eventLocation: 'Lodhi Garden & Sunder Nursery, Delhi',
        estimatedGuests: 2,
        budgetRange: '₹35,000 - ₹50,000',
        additionalNotes: 'Morning 6 AM golden light shoot required.',
        status: 'Pending',
        internalNotes: 'Customer called via WhatsApp. Follow-up meeting scheduled for Saturday.',
        quotedAmount: 38000,
      }
    ]);

    // 11. Inquiries
    await db.insert(inquiries).values([
      {
        name: 'Deepak Sharma',
        phone: '+91 98990 11223',
        email: 'deepak.sharma@gmail.com',
        serviceRequested: 'Royal Wedding Photography & Cinema',
        message: 'Looking for full 3-day wedding photography coverage in Delhi for December 2026. Please share your complete brochure and team availability.',
        isRead: false,
        status: 'New',
      },
      {
        name: 'Sunita Chawla',
        phone: '+91 98711 55667',
        email: 'sunita.chawla@yahoo.com',
        serviceRequested: 'Maternity & Newborn Baby Shoots',
        message: 'Interested in booking an indoor studio maternity shoot next month. What are the gown and makeup options?',
        isRead: true,
        status: 'Replied',
      }
    ]);

    console.log('Database successfully seeded with realistic studio data.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

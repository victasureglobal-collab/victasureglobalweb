import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  initialCategories,
  initialProducts,
  initialEnquiries,
  initialDownloads,
  initialCertificates,
  initialBlogs,
  initialFounderDetails,
  initialWebsiteSettings,
  initialOrders
} from './mockData';

// Initialize localStorage if not already set
const initializeLocalStorage = () => {
  if (!localStorage.getItem('vs_initialized_v8')) {
    localStorage.setItem('vs_categories', JSON.stringify(initialCategories));
    localStorage.setItem('vs_products', JSON.stringify(initialProducts));
    localStorage.setItem('vs_enquiries', JSON.stringify(initialEnquiries));
    localStorage.setItem('vs_downloads', JSON.stringify(initialDownloads));
    localStorage.setItem('vs_certificates', JSON.stringify(initialCertificates));
    localStorage.setItem('vs_blogs', JSON.stringify(initialBlogs));
    localStorage.setItem('vs_founder', JSON.stringify(initialFounderDetails));
    localStorage.setItem('vs_settings', JSON.stringify(initialWebsiteSettings));
    localStorage.setItem('vs_orders', JSON.stringify(initialOrders));
    localStorage.setItem('vs_initialized_v8', 'true');
  }
};

initializeLocalStorage();

// Local Storage Helper CRUDs
const getLocal = (key) => JSON.parse(localStorage.getItem(key));
const setLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Unified DB Service
export const dbService = {
  // --- CATEGORIES ---
  async getCategories() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase categories query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_categories') || [];
  },

  async saveCategory(category) {
    if (!category.id) {
      category.id = 'cat-' + Math.random().toString(36).substr(2, 9);
    }
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('categories').upsert(category).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase category save failed, using localStorage:", err);
      }
    }
    const categories = getLocal('vs_categories') || [];
    const idx = categories.findIndex(c => c.id === category.id);
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...category };
    } else {
      categories.push(category);
    }
    setLocal('vs_categories', categories);
    return category;
  },

  async deleteCategory(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Supabase category delete failed, using localStorage:", err);
      }
    }
    const categories = getLocal('vs_categories') || [];
    const filtered = categories.filter(c => c.id !== id);
    setLocal('vs_categories', filtered);
    
    // Cascade delete: Nullify or delete products in this category locally
    const products = getLocal('vs_products') || [];
    const updatedProducts = products.map(p => p.category_id === id ? { ...p, category_id: "" } : p);
    setLocal('vs_products', updatedProducts);
    
    return true;
  },

  // --- PRODUCTS ---
  async getProducts() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase products query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_products') || [];
  },

  async saveProduct(product) {
    const timestamp = new Date().toISOString();
    if (!product.id) {
      product.id = 'prod-' + Math.random().toString(36).substr(2, 9);
      product.created_at = timestamp;
    }
    product.updated_at = timestamp;
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').upsert(product).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase product save failed, using localStorage:", err);
      }
    }
    const products = getLocal('vs_products') || [];
    const idx = products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...product };
    } else {
      products.push(product);
    }
    setLocal('vs_products', products);
    return product;
  },

  async deleteProduct(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Supabase product delete failed, using localStorage:", err);
      }
    }
    const products = getLocal('vs_products') || [];
    const filtered = products.filter(p => p.id !== id);
    setLocal('vs_products', filtered);
    return true;
  },

  // --- ENQUIRIES ---
  async getEnquiries() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase enquiries query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_enquiries') || [];
  },

  async createEnquiry(enquiry) {
    const newEnq = {
      id: 'enq-' + Math.random().toString(36).substr(2, 9),
      ...enquiry,
      status: 'new',
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('enquiries').insert(newEnq).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase enquiry creation failed, using localStorage:", err);
      }
    }
    const enquiries = getLocal('vs_enquiries') || [];
    enquiries.unshift(newEnq);
    setLocal('vs_enquiries', enquiries);
    return newEnq;
  },

  async updateEnquiryStatus(id, status) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('enquiries').update({ status }).eq('id', id).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase enquiry status update failed, using localStorage:", err);
      }
    }
    const enquiries = getLocal('vs_enquiries') || [];
    const idx = enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      enquiries[idx].status = status;
      setLocal('vs_enquiries', enquiries);
      return enquiries[idx];
    }
    throw new Error("Enquiry not found");
  },

  // --- CATALOGUE DOWNLOADS ---
  async getDownloads() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('catalogue_downloads').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase catalogue downloads query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_downloads') || [];
  },

  async createDownload(lead) {
    const newDl = {
      id: 'dl-' + Math.random().toString(36).substr(2, 9),
      ...lead,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('catalogue_downloads').insert(newDl).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase catalogue download log failed, using localStorage:", err);
      }
    }
    const downloads = getLocal('vs_downloads') || [];
    downloads.unshift(newDl);
    setLocal('vs_downloads', downloads);
    return newDl;
  },

  // --- CERTIFICATES ---
  async getCertificates() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase certificates query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_certificates') || [];
  },

  async saveCertificate(cert) {
    if (!cert.id) {
      cert.id = 'cert-' + Math.random().toString(36).substr(2, 9);
      cert.created_at = new Date().toISOString();
    }
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('certificates').upsert(cert).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase certificate save failed, using localStorage:", err);
      }
    }
    const certs = getLocal('vs_certificates') || [];
    const idx = certs.findIndex(c => c.id === cert.id);
    if (idx !== -1) {
      certs[idx] = { ...certs[idx], ...cert };
    } else {
      certs.push(cert);
    }
    setLocal('vs_certificates', certs);
    return cert;
  },

  async deleteCertificate(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('certificates').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Supabase certificate delete failed, using localStorage:", err);
      }
    }
    const certs = getLocal('vs_certificates') || [];
    const filtered = certs.filter(c => c.id !== id);
    setLocal('vs_certificates', filtered);
    return true;
  },

  // --- BLOGS ---
  async getBlogs() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase blogs query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_blogs') || [];
  },

  async saveBlog(blog) {
    const timestamp = new Date().toISOString();
    if (!blog.id) {
      blog.id = 'blog-' + Math.random().toString(36).substr(2, 9);
      blog.created_at = timestamp;
    }
    blog.updated_at = timestamp;
    
    if (!blog.slug) {
      blog.slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('blogs').upsert(blog).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase blog save failed, using localStorage:", err);
      }
    }
    const blogs = getLocal('vs_blogs') || [];
    const idx = blogs.findIndex(b => b.id === blog.id);
    if (idx !== -1) {
      blogs[idx] = { ...blogs[idx], ...blog };
    } else {
      blogs.push(blog);
    }
    setLocal('vs_blogs', blogs);
    return blog;
  },

  async deleteBlog(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Supabase blog delete failed, using localStorage:", err);
      }
    }
    const blogs = getLocal('vs_blogs') || [];
    const filtered = blogs.filter(b => b.id !== id);
    setLocal('vs_blogs', filtered);
    return true;
  },

  // --- FOUNDER DETAILS ---
  async getFounderDetails() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('founder_details').select('*').single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase founder query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_founder') || initialFounderDetails;
  },

  async saveFounderDetails(details) {
    details.id = 'main';
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('founder_details').upsert(details).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase founder save failed:", err);
        throw err;
      }
    }
    const current = getLocal('vs_founder') || {};
    const updated = { ...current, ...details, updated_at: new Date().toISOString() };
    setLocal('vs_founder', updated);
    return updated;
  },

  // --- WEBSITE SETTINGS ---
  async getWebsiteSettings() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('website_settings').select('*').single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase settings query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_settings') || initialWebsiteSettings;
  },

  async saveWebsiteSettings(settings) {
    settings.id = 'main';

    if (!isSupabaseConfigured()) {
      const current = getLocal('vs_settings') || {};
      const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
      setLocal('vs_settings', updated);
      return updated;
    }

    const trySave = async (payload, strippedKeys = {}) => {
      try {
        const { data, error } = await supabase.from('website_settings').upsert(payload).select().single();
        if (error) throw error;
        return { ...data, ...strippedKeys };
      } catch (err) {
        if (err.message && err.message.includes('column') && err.message.includes('schema cache')) {
          const match = err.message.match(/Could not find the '(.+?)' column/);
          if (match && match[1]) {
            const missingColumn = match[1];
            console.warn(`Column '${missingColumn}' missing in Supabase. Retrying settings save without it...`);
            const { [missingColumn]: value, ...remainingPayload } = payload;
            return trySave(remainingPayload, { ...strippedKeys, [missingColumn]: value });
          }
        }
        console.error("Supabase settings save failed:", err);
        throw err;
      }
    };

    return trySave(settings);
  },

  // --- ORDERS ---
  async getOrders() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase orders query failed, using localStorage:", err);
      }
    }
    return getLocal('vs_orders') || [];
  },

  async createOrder(order) {
    const orders = getLocal('vs_orders') || [];
    const newOrder = {
      id: 'ord-' + (1000 + orders.length + 1),
      ...order,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('orders').insert(newOrder).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase order creation failed, using localStorage:", err);
      }
    }
    orders.unshift(newOrder);
    setLocal('vs_orders', orders);
    return newOrder;
  },

  async updateOrderStatus(id, status) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Supabase order status update failed, using localStorage:", err);
      }
    }
    const orders = getLocal('vs_orders') || [];
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      setLocal('vs_orders', orders);
      return orders[idx];
    }
    throw new Error("Order not found");
  },

  async deleteEnquiry(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('enquiries').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase enquiry delete failed, using localStorage:", err);
      }
    }
    const list = getLocal('vs_enquiries') || [];
    setLocal('vs_enquiries', list.filter(e => e.id !== id));
  },

  async deleteDownload(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('catalogue_downloads').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase download delete failed, using localStorage:", err);
      }
    }
    const list = getLocal('vs_downloads') || [];
    setLocal('vs_downloads', list.filter(e => e.id !== id));
  },

  async deleteOrder(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase order delete failed, using localStorage:", err);
      }
    }
    const list = getLocal('vs_orders') || [];
    setLocal('vs_orders', list.filter(o => o.id !== id));
  },

  // --- TRAFFIC VIEWS ---
  async getTrafficViews() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('traffic_views').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase traffic_views failed:", err);
      }
    }
    return getLocal('vs_traffic_views') || [];
  },

  async logTrafficView(country) {
    const view = {
      id: 'view-' + Math.random().toString(36).substr(2, 9),
      country: country || 'Unknown',
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('traffic_views').insert(view);
      } catch (err) {
        console.warn("Supabase traffic_views log failed:", err);
      }
    }
    const list = getLocal('vs_traffic_views') || [];
    list.push(view);
    setLocal('vs_traffic_views', list);
    return view;
  },

  async checkSupabaseSchema() {
    const status = {
      configured: isSupabaseConfigured(),
      tables: {}
    };
    if (!status.configured) return status;

    const tablesToCheck = [
      'categories',
      'products',
      'enquiries',
      'catalogue_downloads',
      'certificates',
      'blogs',
      'founder_details',
      'website_settings',
      'orders',
      'traffic_views'
    ];

    for (const table of tablesToCheck) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
          status.tables[table] = { exists: false, error: error.message };
        } else {
          status.tables[table] = { exists: true };
        }
      } catch (err) {
        status.tables[table] = { exists: false, error: err.message || 'Unknown query error' };
      }
    }
    return status;
  },

  async seedDatabase() {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const results = {
      categories: 0,
      products: 0,
      founder_details: 0,
      website_settings: 0,
      certificates: 0,
      blogs: 0
    };

    // 1. Seed categories
    const { error: catErr } = await supabase.from('categories').upsert(initialCategories);
    if (catErr) throw new Error(`Categories seeding failed: ${catErr.message}`);
    results.categories = initialCategories.length;

    // 2. Seed products
    const cleanProducts = initialProducts.map(p => {
      return {
        id: p.id,
        category_id: p.category_id,
        name: p.name,
        short_description: p.short_description,
        detailed_description: p.detailed_description,
        specifications: p.specifications,
        dimensions: p.dimensions,
        material: p.material,
        moq: p.moq,
        price_inr: p.price_inr,
        price_usd: p.price_usd,
        country_availability: p.country_availability,
        status: p.status,
        is_featured: p.is_featured,
        images: p.images
      };
    });
    const { error: prodErr } = await supabase.from('products').upsert(cleanProducts);
    if (prodErr) throw new Error(`Products seeding failed: ${prodErr.message}`);
    results.products = cleanProducts.length;

    // 3. Seed Founder details
    const cleanFounder = {
      id: 'main',
      name: initialFounderDetails.name,
      photo_url: initialFounderDetails.photo_url,
      designation: initialFounderDetails.designation,
      message: initialFounderDetails.message,
      is_visible: initialFounderDetails.is_visible
    };
    const { error: founderErr } = await supabase.from('founder_details').upsert(cleanFounder);
    if (founderErr) throw new Error(`Founder details seeding failed: ${founderErr.message}`);
    results.founder_details = 1;

    // 4. Seed Settings
    const cleanSettings = {
      id: 'main',
      company_name: initialWebsiteSettings.company_name,
      hero_title: initialWebsiteSettings.hero_title,
      hero_subtitle: initialWebsiteSettings.hero_subtitle,
      hero_banner_url: initialWebsiteSettings.hero_banner_url,
      about_overview: initialWebsiteSettings.about_overview,
      about_mission: initialWebsiteSettings.about_mission,
      about_mission_icon: initialWebsiteSettings.about_mission_icon,
      about_vision: initialWebsiteSettings.about_vision,
      about_vision_icon: initialWebsiteSettings.about_vision_icon,
      about_core_values: initialWebsiteSettings.about_core_values,
      about_quality_commitment: initialWebsiteSettings.about_quality_commitment,
      why_choose_us_items: initialWebsiteSettings.why_choose_us_items,
      show_hero_section: initialWebsiteSettings.show_hero_section,
      show_featured_section: initialWebsiteSettings.show_featured_section,
      show_why_choose_us: initialWebsiteSettings.show_why_choose_us,
      show_founder_section: initialWebsiteSettings.show_founder_section,
      show_overview_section: initialWebsiteSettings.show_overview_section,
      contact_whatsapp: initialWebsiteSettings.contact_whatsapp,
      contact_email: initialWebsiteSettings.contact_email,
      contact_phone: initialWebsiteSettings.contact_phone,
      contact_address: initialWebsiteSettings.contact_address,
      testimonials: initialWebsiteSettings.testimonials || [],
      consignments: initialWebsiteSettings.consignments || [],
      faqs: initialWebsiteSettings.faqs || [],
      socials: initialWebsiteSettings.socials || []
    };
    const { error: settingsErr } = await supabase.from('website_settings').upsert(cleanSettings);
    if (settingsErr) throw new Error(`Website settings seeding failed: ${settingsErr.message}`);
    results.website_settings = 1;

    // 5. Seed Certificates
    const { error: certErr } = await supabase.from('certificates').upsert(initialCertificates);
    if (certErr) throw new Error(`Certificates seeding failed: ${certErr.message}`);
    results.certificates = initialCertificates.length;

    // 6. Seed Blogs
    const cleanBlogs = initialBlogs.map(b => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      content: b.content,
      featured_image: b.featured_image,
      seo_title: b.seo_title,
      seo_description: b.seo_description,
      status: b.status
    }));
    const { error: blogErr } = await supabase.from('blogs').upsert(cleanBlogs);
    if (blogErr) throw new Error(`Blogs seeding failed: ${blogErr.message}`);
    results.blogs = cleanBlogs.length;

    return { success: true, results };
  }
};

export const initialCategories = [
  { id: "cat-1", name: "Areca Leaf Plates", slug: "areca-leaf-plates", description: "Biodegradable heat-pressed plates made from fallen palm leaves." },
  { id: "cat-2", name: "Areca Leaf Bowls", slug: "areca-leaf-bowls", description: "Chemical-free compostable bowls for soups, desserts, and sides." },
  { id: "cat-3", name: "Areca Leaf Trays", slug: "areca-leaf-trays", description: "Sturdy organic serving trays, perfect for caterers and events." },
  { id: "cat-4", name: "Areca Cutlery", slug: "areca-cutlery", description: "100% natural birchwood and palm leaf forks and spoons." }
];

export const initialProducts = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "10 Inch Round Plates",
    short_description: "Large 10-inch round disposable plates made from fallen palm leaves, perfect for main courses.",
    detailed_description: "Crafted from 100% natural fallen Areca palm leaves, these 10-inch round plates offer a chemical-free, biodegradable, and compostable alternative to plastic and paper. Rigid enough to support heavy foods without leaking.",
    specifications: {
      "Shape": "Round",
      "Process": "Heat Pressed & Sterilized",
      "Heat Tolerance": "Microwave and Oven safe",
      "Moisture Level": "10-12% conditioned"
    },
    dimensions: "10-inch diameter",
    material: "Areca Palm Leaf",
    moq: "10,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["USA", "Germany", "UK", "Canada", "Australia"],
    status: "published",
    is_featured: true,
    images: [
      "/img/10 Inch Round Plates.png"
    ],
    created_at: "2026-05-10T12:00:00Z"
  },
  {
    id: "prod-2",
    category_id: "cat-1",
    name: "10 Inch Square Plates",
    short_description: "Large 10-inch square dinner plates with raised borders for clean, elegant B2B catering.",
    detailed_description: "These premium square dinner plates add a rustic and modern look to catering operations. Highly rigid, heat resistant, and fully compostable.",
    specifications: {
      "Shape": "Square",
      "Process": "Sterilized Heat Press",
      "Biodegradable": "Composts in 60-90 days",
      "Chemicals": "100% chemical-free"
    },
    dimensions: "10 x 10 inches",
    material: "Areca Palm Leaf",
    moq: "10,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["Germany", "France", "Japan", "USA", "UK"],
    status: "published",
    is_featured: true,
    images: [
      "/img/10 Inch Square Plates.png"
    ],
    created_at: "2026-05-11T12:00:00Z"
  },
  {
    id: "prod-3",
    category_id: "cat-1",
    name: "8 Inch Round Plates",
    short_description: "Standard 8-inch round plates, ideal for lunches, appetizers, and desserts.",
    detailed_description: "Perfect for serving salads, desserts, and sides at events and parties. Sturdy construction ensures no grease absorption or bending.",
    specifications: {
      "Shape": "Round",
      "Process": "Sterilized Heat Press",
      "Moisture": "Under 12%"
    },
    dimensions: "8-inch diameter",
    material: "Areca Palm Leaf",
    moq: "10,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["USA", "Netherlands", "UK", "Germany"],
    status: "published",
    is_featured: true,
    images: [
      "/img/8 Inch Round Plates.png"
    ],
    created_at: "2026-05-12T12:00:00Z"
  },
  {
    id: "prod-4",
    category_id: "cat-1",
    name: "8 Inch Square Plates",
    short_description: "Standard 8-inch square plates, perfect for appetizers and lunch portions.",
    detailed_description: "Our 8-inch square plates combine contemporary design with sustainability. Excellent liquid resistance allows serving of hot and cold dishes.",
    specifications: {
      "Shape": "Square",
      "Thermal resistance": "Oven safe up to 350°F"
    },
    dimensions: "8 x 8 inches",
    material: "Areca Palm Leaf",
    moq: "10,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["USA", "Germany", "France", "Switzerland"],
    status: "published",
    is_featured: true,
    images: [
      "/img/8 Inch Square Plates.png"
    ],
    created_at: "2026-05-13T12:00:00Z"
  },
  {
    id: "prod-5",
    category_id: "cat-1",
    name: "6 Inch Round Plates",
    short_description: "Compact 6-inch round plates for desserts, starters, and small side portions.",
    detailed_description: "Ideal for bakeries, dessert buffets, and small starters. Lightweight yet robust, made from selected sheaths.",
    specifications: {
      "Shape": "Round",
      "Usage": "Desserts & Starters"
    },
    dimensions: "6-inch diameter",
    material: "Areca Palm Leaf",
    moq: "15,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["Germany", "UK", "Australia", "Japan"],
    status: "published",
    is_featured: false,
    images: [
      "/img/6 Inch Round Plates.png"
    ],
    created_at: "2026-05-14T12:00:00Z"
  },
  {
    id: "prod-6",
    category_id: "cat-1",
    name: "6 Inch Square Plates",
    short_description: "Compact 6-inch square plates, perfect for pastries, cakes, and appetizers.",
    detailed_description: "Modern square profile for finger foods, cocktail parties, and catering desserts. Biodegrades back into the earth within months.",
    specifications: {
      "Shape": "Square",
      "Process": "Heat Pressed & Sterilized"
    },
    dimensions: "6 x 6 inches",
    material: "Areca Palm Leaf",
    moq: "15,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["USA", "Germany", "UK"],
    status: "published",
    is_featured: false,
    images: [
      "/img/6 Inch Square Plates.png"
    ],
    created_at: "2026-05-15T12:00:00Z"
  },
  {
    id: "prod-7",
    category_id: "cat-2",
    name: "4 Inch Square Bowls",
    short_description: "4-inch square deep bowls, perfect for dipping sauces, hot soups, and desserts.",
    detailed_description: "Deep wall square bowls carved for hot soups, side dips, frozen gelatos, and starters. Completely liquid leak-proof.",
    specifications: {
      "Shape": "Square Deep",
      "Liquid resistance": "High (up to 4 hours)"
    },
    dimensions: "4 x 4 x 1.5 inches",
    material: "Areca Palm Leaf",
    moq: "20,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["USA", "Germany", "UK", "Japan"],
    status: "published",
    is_featured: false,
    images: [
      "/img/4 Inch Square Bowls.png"
    ],
    created_at: "2026-05-16T12:00:00Z"
  },
  {
    id: "prod-8",
    category_id: "cat-3",
    name: "6 Inch Tray",
    short_description: "Small 6-inch rectangular tray for serving finger foods and small catering sets.",
    detailed_description: "Sturdy mini trays suitable for party platters, display sets, or small catering appetizers. Resists bend and moisture.",
    specifications: {
      "Shape": "Rectangular Tray"
    },
    dimensions: "6 x 4 inches",
    material: "Areca Palm Leaf",
    moq: "10,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["UK", "Canada", "Singapore"],
    status: "published",
    is_featured: false,
    images: [
      "/img/6 Inch Tray.png"
    ],
    created_at: "2026-05-17T12:00:00Z"
  },
  {
    id: "prod-9",
    category_id: "cat-3",
    name: "9 Inch Tray",
    short_description: "Medium 9-inch rectangular serving tray with raised borders for parties and buffets.",
    detailed_description: "Large enough to serve assortments of appetizers, bread, fruits, or sharing platters. Highly rigid border walls prevent spills.",
    specifications: {
      "Shape": "Rectangular Tray",
      "Capacity": "Holds up to 1.5 kg"
    },
    dimensions: "9 x 6 inches",
    material: "Areca Palm Leaf",
    moq: "10,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["USA", "Germany", "France", "UAE"],
    status: "published",
    is_featured: false,
    images: [
      "/img/9 Inch Tray.png"
    ],
    created_at: "2026-05-18T12:00:00Z"
  },
  {
    id: "prod-10",
    category_id: "cat-4",
    name: "Areca Leaf Spoon",
    short_description: "100% natural, sterilized disposable spoons made from premium organic materials.",
    detailed_description: "Splinter-free, solid, and sterilized spoons crafted from natural materials. Provides a smooth texture without chemical coatings or glues.",
    specifications: {
      "Type": "Spoon",
      "Chemicals": "Zero coatings/BPA free"
    },
    dimensions: "Standard length",
    material: "Natural Wood/Palm leaf",
    moq: "20,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["USA", "Germany", "UK", "Australia"],
    status: "published",
    is_featured: false,
    images: [
      "/img/Spoon.png"
    ],
    created_at: "2026-05-19T12:00:00Z"
  },
  {
    id: "prod-11",
    category_id: "cat-4",
    name: "Areca Leaf Fork",
    short_description: "Sturdy, splinter-free natural disposable forks, suitable for catering and events.",
    detailed_description: "High-rigidity forks suitable for hot and cold foods, salads, and fruits. An eco-friendly alternative to disposable plastic forks.",
    specifications: {
      "Type": "Fork"
    },
    dimensions: "Standard length",
    material: "Natural Wood/Palm leaf",
    moq: "20,000 Units",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["USA", "Germany", "UK"],
    status: "published",
    is_featured: false,
    images: [
      "/img/Fork.png"
    ],
    created_at: "2026-05-20T12:00:00Z"
  },
  {
    id: "prod-12",
    category_id: "cat-1",
    name: "All Products Assortment Pack",
    short_description: "Consolidated sample pack featuring all dinnerware dimensions, spoons, and forks.",
    detailed_description: "Designed for international buyers to evaluate our full collection. Contains 2 pieces of each plate, tray, bowl, spoon, and fork.",
    specifications: {
      "Contents": "Assorted tableware & cutlery",
      "Purpose": "Quality verification sample"
    },
    dimensions: "Sample Box",
    material: "Mixed Areca products",
    moq: "5,000 Packs",
    price_inr: 400,
    price_usd: 5,
    country_availability: ["Global Ports", "USA", "Europe", "Asia"],
    status: "published",
    is_featured: false,
    images: [
      "/img/All Products.png"
    ],
    created_at: "2026-05-21T12:00:00Z"
  }
];

export const initialEnquiries = [
  {
    id: "enq-1",
    name: "Jonathan Miller",
    email: "j.miller@ecotableware-dist.de",
    country: "Germany",
    phone: "+491701234567",
    state: "Bavaria",
    pincode: "80331",
    product_interested: "10 Inch Round Plates",
    message: "Hello VictaSure team, we are a major distributor of eco-friendly catering products in Germany. We are looking to import a container of 10-inch round plates. Could you please share your FOB pricing and bulk shipment lead times? Thank you.",
    status: "new",
    created_at: "2026-06-18T09:30:00Z"
  }
];

export const initialDownloads = [
  {
    id: "dl-1",
    name: "David Smith",
    email: "dsmith@earthplates.com",
    country: "USA",
    phone: "+15550199",
    state: "California",
    product_interest: "Areca Leaf Plates",
    created_at: "2026-06-17T08:12:00Z"
  }
];

export const initialCertificates = [
  {
    id: "cert-1",
    title: "ISO 9001:2015 Quality Management",
    file_url: "#",
    image_url: "https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?auto=format&fit=crop&q=80&w=400",
    is_visible: true,
    created_at: "2026-04-01T09:00:00Z"
  },
  {
    id: "cert-2",
    title: "USDA Organic Certification",
    file_url: "#",
    image_url: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=400",
    is_visible: true,
    created_at: "2026-04-02T09:00:00Z"
  },
  {
    id: "cert-3",
    title: "TUV Biodegradable Certificate (EN 13432)",
    file_url: "#",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
    is_visible: true,
    created_at: "2026-04-03T09:00:00Z"
  }
];

export const initialBlogs = [
  {
    id: "blog-1",
    title: "Why Areca Palm Leaf Plates are the Future of Sustainable Event Catering",
    slug: "areca-palm-leaf-plates-future-sustainable-catering",
    content: `
      <h2>The Shift in Global Catering Standards</h2>
      <p>As governments worldwide ban single-use plastics, the event catering and hospitality industries are actively looking for sturdy, stylish, and truly sustainable alternatives. Among the options, Areca Palm Leaf plates stand out as an exceptional alternative.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
    seo_title: "Areca Palm Leaf Plates in Catering | VictaSure Global",
    seo_description: "Discover why global event caterers are transitioning to biodegradable Areca leaf tableware for aesthetic appeal and rigid durability.",
    status: "published",
    created_at: "2026-06-10T10:00:00Z",
    updated_at: "2026-06-10T10:00:00Z"
  }
];

export const initialFounderDetails = {
  photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  name: "Vikraman Sundararajan",
  designation: "Founder & Managing Director",
  message: "Trust is earned through actions, not promises. At VictaSure Global, we are committed to delivering quality products, transparent communication, and dependable service that foster long-term partnerships across global markets.",
  is_visible: true
};

export const initialWebsiteSettings = {
  company_name: "VictaSure Global",
  hero_title: "Trusted Alliances. Assured Quality. Global Reach.",
  hero_subtitle: "Connecting premium eco-friendly manufacturers with high-end international retailers through a commitment to sustainability and excellence.",
  hero_banner_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600",
  about_overview: "Founded in 2026, VictaSure Global was established with a simple yet powerful mission—to bring the finest Made in India products to customers across the globe while delivering an exceptional export experience through transparent communication, seamless order tracking, and real-time shipment updates.\nWith the combined efforts of team over the years of experience in the industry we specialize in exporting premium eco-friendly products, with a strong focus on sustainability, quality, and customer satisfaction. Our portfolio includes Areca palm leaf tableware, biodegradable dining solutions, organic products,",
  about_mission: "Our mission is to become a trusted global export partner by supplying superior-quality products backed by reliable service, hassle-free shipping, and clear communication at every stage of the export process. We are committed to making international trade simple, transparent, and dependable for our customers while building long-term business relationships based on trust and consistency.",
  about_mission_icon: "Target",
  about_vision: "We envision VictaSure Global as a globally recognized exporter of sustainable and value-driven Indian products, contributing to a greener future while creating shared growth opportunities for our customers, suppliers, and communities. Our guiding philosophy is simple: We grow by helping our partners grow.",
  about_vision_icon: "Compass",
  about_core_values: "At VictaSure Global, our business is built on integrity and ethical business practices, Customer-first service and responsive communication. We support Sustainable and environmentally responsible sourcing through the long-term partnerships based on mutual trust and success. We believe in a mutually beneficial business framework where every stakeholder—customers, manufacturers, and communities—can thrive together.",
  about_quality_commitment: "Quality is at the heart of everything we do. We work closely with skilled and trusted manufacturers and suppliers to source high quality products that meet stringent quality standards and international export requirements. Every shipment undergoes careful evaluation to ensure consistency, durability, and customer satisfaction.\nOur commitment extends beyond the products themselves. From inquiry to delivery, we emphasize accurate documentation, timely updates, efficient logistics, and dependable support, ensuring a smooth and hassle-free experience for every client.\nAt VictaSure Global, we don't just export products—we support innovation that benefit the society, environment sustainability and build lasting relationships through reliability, excellence, and an unwavering commitment to quality.",
  why_choose_us_items: [
    {
      "icon": "ShieldCheck",
      "title": "Strict Quality Audits",
      "description": "Every batch undergoes moisture level checks and heat-pressed sterilization to ensure zero mold or structural cracking."
    },
    {
      "icon": "Globe",
      "title": "Global B2B Logistics",
      "description": "Smooth container booking, ocean freight coordination, and customs clearance documents compiled under one roof."
    },
    {
      "icon": "Award",
      "title": "Moisture-Proof Storage",
      "description": "Our raw leaf sorting and finished product inventories are stored in temperature-controlled warehouses prior to shipment."
    },
    {
      "icon": "Leaf",
      "title": "Chemical-Free Process",
      "description": "100% biodegradable plates heat-pressed solely from naturally shed Areca palm leaves without adhesives, plastics, or toxins."
    }
  ],
  show_hero_section: true,
  show_featured_section: true,
  show_why_choose_us: true,
  show_founder_section: true,
  show_overview_section: true,
  show_terms_page: true,
  terms_effective_date: "June 21, 2026",
  terms_notice: "All shipping transactions, wholesale purchases, and custom contract manufacturing orders executed with VictaSure Global are bound by the trade terms detailed below. Unless specified in a signed bilateral contract, these terms govern the agreement.",
  terms_content: `1. Standard Trade & Delivery Terms (Incoterms 2020)
Unless explicitly agreed otherwise in the sales invoice or proforma contract, all international shipments are conducted under FOB (Free on Board) terms at the port of origin in India (e.g., Port of Chennai or Tuticorin Port). Responsibility for cargo, insurance, and sea freight costs transfers to the buyer once the container successfully crosses the ship rail at the loading port.

2. Product Specifications & Quality Certification
VictaSure Global guarantees that Areca Leaf dinnerware meets strict biobased and EN 13432 biodegradability requirements. Products are shipped at moisture levels maintained between 10% and 12% to prevent mold formation during ocean transit. The buyer has the right to appoint third-party inspection firms (e.g., SGS, Intertek) to audit the container load at our production units prior to dispatch.

3. Payment Terms
Standard B2B export payment channels accepted:
- Telegraphic Transfer (T/T): 30% advanced deposit upon contract sign, and 70% balance paid upon presentation of the scanned Bill of Lading (B/L) copy.
- Letter of Credit (L/C): 100% Irrevocable Letter of Credit at sight, issued by a prime international bank, confirmed by our corporate banking desk in India.

4. Customs Inspections, Claims & Quarantine
Phytosanitary and fumigation credentials are provided with every shipment. The importer is responsible for providing all correct documentation needed for customs entry at the port of destination. Any quality claims (such as moisture damage or count discrepancies) must be submitted in writing within fourteen (14) calendar days of cargo discharge at the destination port, supported by official surveyor inspection reports and photos.`,
  contact_whatsapp: "+91 83909 00120",
  contact_email: "export@victasure.com",
  contact_phone: "+91 83909 00120",
  contact_address: "Bengaluru, Karnataka, India",
  socials: [
    { "platform": "Facebook", "url": "https://www.facebook.com/profile.php?id=61590500655930" },
    { "platform": "Instagram", "url": "https://www.instagram.com/victasure?igsh=MTJvdnRqbm5uZHhsdg%3D%3D&utm_source=qr" }
  ],
  faqs: [
    {
      question: "What is your Minimum Order Quantity (MOQ) for export consignments?",
      answer: "Our standard Minimum Order Quantity (MOQ) is generally 10,000 to 20,000 units per product type, depending on product dimensions and whether custom packaging/branding is requested. We can consolidate multiple product sizes in a single 20ft or 40ft FCL container."
    },
    {
      question: "How do you ensure moisture level control for ocean transit?",
      answer: "We carry out mandatory heat-treatment and moisture-meter checks on every batch prior to packing. The moisture content is strictly stabilized between 10% and 12% to prevent mold formation and structural warping during long sea shipments across temperature changes."
    },
    {
      question: "Which international safety and composting standards do your products meet?",
      answer: "Our Areca palm leaf tableware is certified compostable under international norms (including EN 13432 compostability standards). They are also FDA food-contact compliant and USDA Biobased certified, verifying that they contain no toxic chemicals, glues, or lacquer coatings."
    },
    {
      question: "What are your standard trade shipping and payment terms?",
      answer: "We primarily work on FOB (Free on Board) loading port terms or CIF (Cost, Insurance and Freight) destination port terms. Payment terms are typically structured as 30% advance TT deposit with the remaining 70% payable against scanned Bill of Lading (B/L) copy."
    },
    {
      question: "Can we request custom shapes, sizing, or brand embossing?",
      answer: "Yes, we support private-label manufacturing. We can custom-laser or heat-emboss your brand logo directly onto the bottom of the plates and design customized retail packaging carton sleeves matching your supermarket or distribution requirements."
    }
  ],
  testimonials: [
    {
      name: "Markus Vance",
      role: "Director of Operations",
      company: "EcoTableware Distribution GmbH",
      location: "Hamburg, Germany",
      rating: 5,
      port: "Port of Hamburg",
      volume: "12 Containers / Year",
      text: "VictaSure Global has been our primary supplier of Areca Leaf plates for three years. Their strict moisture control audits are second to none—we have never had a single instance of mold or cracking upon customs clearance. Absolute professionals in B2B scheduling."
    },
    {
      name: "Sarah Jenkins",
      role: "Lead Procurement Manager",
      company: "GreenLife Catering Network",
      location: "Chicago, USA",
      rating: 5,
      port: "Port of New York / Newark",
      volume: "8 Containers / Year",
      text: "The custom private-label solutions provided by VictaSure allowed us to launch our branded eco-tableware line ahead of schedule. Their packaging is ocean-worthy, ensuring plates arrive pristine without moisture absorption during transit."
    },
    {
      name: "Akira Tanaka",
      role: "Senior Importer",
      company: "Organic Foods Japan Co.",
      location: "Tokyo, Japan",
      rating: 5,
      port: "Port of Tokyo",
      volume: "60 Metric Tons / Year",
      text: "We import organic palm leaf tableware and birchwood cutlery packs from VictaSure. Their USDA Organic equivalent and biobased certificates are always fully compliant. The tableware is incredibly sturdy, and cargo clears Tokyo customs swiftly."
    },
    {
      name: "Alastair Ross",
      role: "Founder",
      company: "Boreal Green Goods",
      location: "Toronto, Canada",
      rating: 5,
      port: "Port of Montreal",
      volume: "5 Containers / Year",
      text: "FOB pricing quotes from VictaSure are highly transparent. They coordinate directly with our freight forwarders, handling container inspections and bill of lading documents smoothly. High recommendation for B2B wholesale buyers."
    }
  ],
  consignments: [
    {
      id: 1,
      title: "FCL Areca Tableware Dispatch to Rotterdam",
      cargo: "85,000 Units (Plates & Bowls)",
      destination: "Hamburg / Rotterdam Port, Europe",
      transitTime: "24 Days (Port-to-Port)",
      inspection: "Phytosanitary & EN 13432 Compostability Audited",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600",
      description: "Successfully packed, fumigated, and exported a Full Container Load (FCL) of mixed Areca Leaf tableware for a German catering distributor. Humidity levels were stabilized at 11% to survive ocean temperature swings."
    },
    {
      id: 2,
      title: "FCL Areca Bowls Consignment to Tokyo",
      cargo: "60,000 Units (Square & Round Bowls)",
      destination: "Port of Tokyo, Japan",
      transitTime: "18 Days (Port-to-Port)",
      inspection: "USDA Biobased & Customs Cleared",
      image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=600",
      description: "Coordinated a high-volume areca leaf bowl consignment for a premium restaurant chain in Tokyo. Bowls were customized with heat-embossed brand markings, meeting Japanese food safety standards."
    },
    {
      id: 3,
      title: "Mixed Areca Dinnerware & Cutlery to Chicago",
      cargo: "120,000 Units (Cutlery, Trays & Plates)",
      destination: "Port of Chicago, USA",
      transitTime: "28 Days",
      inspection: "EN 13432 & FDA Food-Contact Compliant",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
      description: "Custom white-label sustainable dining packs (containing Areca plates, bowls, and birchwood forks/spoons) prepared for a major US eco-retail brand. Shipped in ocean-worthy moisture-sealed pallets."
    },
    {
      id: 4,
      title: "Areca Serving Trays Wholesale to Sydney",
      cargo: "40,000 Units (Rectangular Trays)",
      destination: "Port of Sydney, Australia",
      transitTime: "16 Days",
      inspection: "AQIS Custom Quarantine Cleared",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
      description: "Supplied heavy-duty biodegradable areca leaf serving platters for an eco-conscious festival consortium in New South Wales. Consignment successfully cleared Australian biosecurity screening on arrival."
    }
  ]
};

export const initialOrders = [
  {
    id: "ord-1001",
    customer_name: "Jonathan Miller",
    email: "j.miller@ecotableware-dist.de",
    phone: "+491701234567",
    company_name: "EcoTableware Distribution GmbH",
    country: "Germany",
    state: "Bavaria",
    address: "St.-Martin-Straße 76, Munich",
    pincode: "81541",
    delivery_port: "Port of Hamburg",
    notes: "Please prioritize standard ocean-worthy double wall packing.",
    items: [
      {
        product_id: "prod-1",
        product_name: "10 Inch Round Plates",
        quantity: 50,
        price_inr: 400,
        price_usd: 5
      },
      {
        product_id: "prod-10",
        product_name: "Areca Leaf Spoon",
        quantity: 100,
        price_inr: 400,
        price_usd: 5
      }
    ],
    total_inr: 60000,
    total_usd: 750,
    status: "confirmed",
    created_at: "2026-06-19T10:00:00Z"
  }
];

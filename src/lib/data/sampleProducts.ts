import { Product, Review } from '@/types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Tomato Thokku',
    slug: 'tomato-thokku',
    description: 'Slow-cooked country tomatoes tempered with mustard seeds, cold-pressed sesame oil, fresh curry leaves, and secret Mangalorean home spices. A tangy and rich accompaniment for dosas, hot rice, and rotis.',
    ingredients: 'Fresh Ripe Tomatoes, Cold-Pressed Gingelly Oil, Mustard Seeds, Fenugreek Powder, Red Chilli Powder, Asafoetida, Rock Salt, Curry Leaves.',
    storage: 'Store in a cool dry place. Use a clean dry spoon. Refrigerate after opening for extended freshness.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🍅',
    images: ['/images/products/tomato-thokku.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 },
      { label: '500g', price: 190, mrp: 230 },
      { label: '1kg', price: 360, mrp: 440 }
    ],
    badge: 'SALE',
    is_featured: true,
    in_stock: true,
    sort_order: 1,
    rating: 4.9,
    review_count: 48
  },
  {
    id: 'prod-2',
    name: 'Avakaya Mango Pickle',
    slug: 'avakaya-mango-pickle',
    description: 'Classic Coastal Karnataka style cut raw mango pickle steeped in aromatic mustard powder, fiery Byadagi chillies, and pure wood-pressed sesame oil. Crispy, spicy, and bursting with homemade nostalgia.',
    ingredients: 'Raw Totapuri/Appemidi Mangoes, Cold-Pressed Mustard Oil, Guntur & Byadagi Chilli Powder, Roasted Fenugreek, Mustard Seeds, Turmeric, Salt.',
    storage: 'Keep in glass jar away from direct sunlight. Do not introduce moisture.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🥭',
    images: ['/images/products/mango-pickle.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 },
      { label: '500g', price: 190, mrp: 230 }
    ],
    badge: 'SALE',
    is_featured: true,
    in_stock: true,
    sort_order: 2,
    rating: 4.8,
    review_count: 52
  },
  {
    id: 'prod-3',
    name: 'Garlic Thokku (Poondu Thokku)',
    slug: 'garlic-thokku',
    description: 'Hand-peeled small country garlic cloves simmered until tender in tangy tamarind pulp, roasted cumin, and fragrant gingelly oil. Immensely rich in gut health and authentic coastal aroma.',
    ingredients: 'Country Garlic (Nattu Poondu), Tamarind, Gingelly Oil, Red Chilli Powder, Roasted Cumin, Mustard, Turmeric, Sea Salt.',
    storage: 'Store at room temperature. Ensure oil layer sits on top for preservation.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🧄',
    images: ['/images/products/garlic-thokku.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 },
      { label: '500g', price: 190, mrp: 230 }
    ],
    badge: 'SALE',
    is_featured: true,
    in_stock: true,
    sort_order: 3,
    rating: 5.0,
    review_count: 64
  },
  {
    id: 'prod-4',
    name: 'Kothambari Thokku (Coriander Thokku)',
    slug: 'kothambari-thokku',
    description: 'Fresh aromatic coriander leaves harvested and ground with tamarind, roasted lentils, and green chillies into an intensely flavorful chutney relish. Pair with curd rice and idlis.',
    ingredients: 'Fresh Farm Coriander, Tamarind Pulp, Green Chillies, Urad Dal, Chana Dal, Sesame Oil, Asafoetida, Rock Salt.',
    storage: 'Refrigerate after opening.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🌿',
    images: ['/images/products/kothambari-thokku.jpg'],
    sizes: [
      { label: '300g', price: 125, mrp: 145 },
      { label: '500g', price: 195, mrp: 235 }
    ],
    badge: 'NEW',
    is_featured: true,
    in_stock: true,
    sort_order: 4,
    rating: 4.7,
    review_count: 19
  },
  {
    id: 'prod-5',
    name: 'Red Chilli Thokku',
    slug: 'red-chilli-thokku',
    description: 'Fresh red ripe chillies (Pandu Mirapakaya) crushed with tamarind and tempered in gingelly oil. Unmistakable spicy punch with a smooth tangy finish.',
    ingredients: 'Fresh Red Chillies, Tamarind, Cold-Pressed Oil, Fenugreek, Mustard Seeds, Garlic, Salt.',
    storage: 'Store in a cool, dry pantry.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🌶️',
    images: ['/images/products/red-chilli-thokku.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 },
      { label: '500g', price: 190, mrp: 230 }
    ],
    badge: 'HOT',
    is_featured: true,
    in_stock: true,
    sort_order: 5,
    rating: 4.9,
    review_count: 38
  },
  {
    id: 'prod-6',
    name: 'Amla Thokku (Nellikai)',
    slug: 'amla-thokku',
    description: 'Vitamin-C powerhouse Indian gooseberries shredded and cooked with traditional spices and pure sesame oil. Tangy, slightly astringent, and deeply rejuvenating.',
    ingredients: 'Fresh Indian Gooseberry (Amla), Sesame Oil, Fenugreek, Red Chilli, Mustard Seeds, Turmeric, Salt.',
    storage: 'Store in dry place.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🫒',
    images: ['/images/products/amla-thokku.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 }
    ],
    badge: 'SALE',
    is_featured: true,
    in_stock: true,
    sort_order: 6,
    rating: 4.8,
    review_count: 27
  },
  {
    id: 'prod-7',
    name: 'Avalakki Paper Poha',
    slug: 'avalakki-paper-poha',
    description: 'Thin, crispy Mangalore paper avalakki roasted with crunchy groundnuts, roasted gram, curry leaves, turmeric, and subtle sweet-spicy seasoning. The ultimate evening tea snack.',
    ingredients: 'Thin Rice Flakes (Paper Poha), Peanuts, Roasted Gram (Putani), Curry Leaves, Green Chillies, Turmeric, Sugar, Salt.',
    storage: 'Store in an airtight container to retain crispness.',
    category: 'Rice & Grains',
    brand: 'Vishnu Home Products',
    emoji: '🍚',
    images: ['/images/products/avalakki.jpg'],
    sizes: [
      { label: '500g', price: 65, mrp: 70 },
      { label: '1kg', price: 125, mrp: 140 }
    ],
    badge: 'SALE',
    is_featured: true,
    in_stock: true,
    sort_order: 7,
    rating: 4.9,
    review_count: 45
  },
  {
    id: 'prod-8',
    name: 'Sankranti Kusri (Yellu Bella)',
    slug: 'sankranti-kusri',
    description: 'Festive handmade Mangalorean Yellu Bella mix containing pure white sesame seeds, organic jaggery chunks, finely diced dry coconut (kopra), roasted groundnuts, and sweet sugar balls (kusri).',
    ingredients: 'White Sesame, Organic Jaggery, Roasted Groundnuts, Dry Coconut Pieces, Fried Gram, Sugar Kusri Balls.',
    storage: 'Keep sealed in cool, dry environment.',
    category: 'Sweets & Festive',
    brand: 'Vishnu Home Products',
    emoji: '🍬',
    images: ['/images/products/sankranti-kusri.jpg'],
    sizes: [
      { label: '250g', price: 100, mrp: 120 },
      { label: '500g', price: 180, mrp: 220 },
      { label: '1kg', price: 340, mrp: 400 }
    ],
    badge: 'FESTIVE',
    is_featured: true,
    in_stock: true,
    sort_order: 8,
    rating: 5.0,
    review_count: 31
  },
  {
    id: 'prod-9',
    name: 'Dry Fish Kollatharu (Anchovy / Nethili)',
    slug: 'dry-fish-kollatharu',
    description: 'Sun-dried small silver anchovies from the pristine Arabian Sea coast of Mangalore. Cleaned, minimally salted, and naturally sun-cured. Perfect for spicy chutneys and deep-fried fish roasts.',
    ingredients: 'Fresh Sea Anchovy (Kollatharu / Nethili), Natural Sea Salt.',
    storage: 'Store in airtight pouch in freezer or dry airtight container.',
    category: 'Dry Fish',
    brand: 'Vishnu Home Products',
    emoji: '🐟',
    images: ['/images/products/dry-fish.jpg'],
    sizes: [
      { label: '200g', price: 199, mrp: 240 },
      { label: '500g', price: 470, mrp: 550 }
    ],
    badge: 'COASTAL',
    is_featured: true,
    in_stock: true,
    sort_order: 9,
    rating: 4.9,
    review_count: 76
  },
  {
    id: 'prod-10',
    name: 'Ayurvedic Herbal Hair Oil',
    slug: 'ayurvedic-hair-oil',
    description: 'Traditional wood-pressed coconut oil slow-infused with 18 coastal herbs including Bhringraj, Brahmi, Hibiscus flowers, Curry leaves, Amla, and Vetiver roots. Prevents hairfall and stimulates natural growth.',
    ingredients: 'Pure Wood-Pressed Coconut Oil, Bhringraj, Brahmi, Amla, Hibiscus, Fenugreek Seeds, Curry Leaves, Vetiver (Khas), Henna.',
    storage: 'Keep in glass bottle away from direct sunlight.',
    category: 'Wellness',
    brand: 'Vishnu Home Products',
    emoji: '🪔',
    images: ['/images/products/hair-oil.jpg'],
    sizes: [
      { label: '200ml', price: 249, mrp: 299 },
      { label: '500ml', price: 549, mrp: 650 }
    ],
    badge: 'NEW',
    is_featured: true,
    in_stock: true,
    sort_order: 10,
    rating: 4.9,
    review_count: 83
  },
  {
    id: 'prod-11',
    name: 'Green Chilli Thokku',
    slug: 'green-chilli-thokku',
    description: 'Fiery and zesty thokku prepared with fresh hand-picked green chillies, sour tamarind, and aromatic fenugreek tempering.',
    ingredients: 'Fresh Green Chillies, Tamarind, Sesame Oil, Fenugreek, Mustard Seeds, Salt.',
    storage: 'Store in cool dry place.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🌶️',
    images: ['/images/products/green-chilli.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 }
    ],
    badge: 'HOT',
    is_featured: false,
    in_stock: true,
    sort_order: 11,
    rating: 4.7,
    review_count: 22
  },
  {
    id: 'prod-12',
    name: 'Tamarind Thokku (Puliyodharai Paste)',
    slug: 'tamarind-thokku',
    description: 'Thick, tangy Mangalore temple-style Puliyogare paste made with aged sour tamarind, jaggery, peanuts, roasted sesame, and aromatic spice blend. Make instant tamarind rice in 2 minutes.',
    ingredients: 'Aged Tamarind Extract, Sesame Oil, Groundnuts, Chana Dal, Mustard, Red Chillies, Jaggery, Curry Leaves, Spices.',
    storage: 'Keeps fresh for up to 12 months in airtight container.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🍯',
    images: ['/images/products/tamarind-thokku.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 },
      { label: '500g', price: 190, mrp: 230 }
    ],
    badge: 'SALE',
    is_featured: false,
    in_stock: true,
    sort_order: 12,
    rating: 5.0,
    review_count: 39
  },
  {
    id: 'prod-13',
    name: 'Gongura Thokku (Sorrel Leaves)',
    slug: 'gongura-thokku',
    description: 'Tart red sorrel leaves sautéed with fiery chillies and crushed garlic in cold-pressed oil. Distinctively tangy and appetizing.',
    ingredients: 'Gongura (Red Sorrel Leaves), Gingelly Oil, Garlic, Red Chillies, Mustard, Fenugreek, Salt.',
    storage: 'Store in a dry location.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🍃',
    images: ['/images/products/gongura-thokku.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 }
    ],
    badge: null,
    is_featured: false,
    in_stock: true,
    sort_order: 13,
    rating: 4.8,
    review_count: 18
  },
  {
    id: 'prod-14',
    name: 'Hagalakai (Bitter Gourd) Thokku',
    slug: 'hagalakai-bitter-gourd-thokku',
    description: 'Thinly sliced bitter gourd cooked gently in tamarind, jaggery, and coastal spices to eliminate excess bitterness while preserving maximum health benefits.',
    ingredients: 'Fresh Bitter Gourd, Tamarind, Organic Jaggery, Sesame Oil, Turmeric, Red Chillies, Salt.',
    storage: 'Store in dry place.',
    category: 'Pickles & Thokkus',
    brand: 'Vishnu Home Products',
    emoji: '🥒',
    images: ['/images/products/bitter-gourd.jpg'],
    sizes: [
      { label: '300g', price: 120, mrp: 145 }
    ],
    badge: 'SALE',
    is_featured: false,
    in_stock: true,
    sort_order: 14,
    rating: 4.6,
    review_count: 14
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🫙' },
  { id: 'Pickles & Thokkus', name: 'Pickles & Thokkus', icon: '🥒' },
  { id: 'Spices & Masalas', name: 'Spices & Masalas', icon: '🌶️' },
  { id: 'Dry Fish', name: 'Dry Fish', icon: '🐟' },
  { id: 'Ghee & Oils', name: 'Ghee & Oils', icon: '🫒' },
  { id: 'Wellness', name: 'Wellness', icon: '🌿' },
  { id: 'Sweets & Festive', name: 'Sweets & Festive', icon: '🍬' },
  { id: 'Rice & Grains', name: 'Rice & Grains', icon: '🍚' },
];

export const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    name: 'Pooja Hegde',
    city: 'Bengaluru',
    rating: 5,
    review: 'The Garlic and Tomato Thokku reminded me of my grandmother in Udupi! The oil quality is exceptional, zero artificial vinegar or color. Ordering another batch for my parents.',
    created_at: '2026-08-14'
  },
  {
    id: 'rev-2',
    product_id: 'prod-9',
    name: 'Karthik Shenoy',
    city: 'Mumbai',
    rating: 5,
    review: 'Proper Mangalore dry fish delivered cleanly packed without any odor leaks. Fresh, clean, and frying it with sambar powder was unbelievable nostalgia.',
    created_at: '2026-08-28'
  },
  {
    id: 'rev-3',
    product_id: 'prod-10',
    name: 'Rashmi Rao',
    city: 'Mangaluru',
    rating: 5,
    review: 'Authentic pure herbal hair oil! The natural Bhringraj and coconut oil smell is so grounding and genuinely stopped hairfall within 3 weeks.',
    created_at: '2026-09-02'
  }
];

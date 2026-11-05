'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Clock,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatINR } from '@/lib/utils';

interface CoastalRecipe {
  id: string;
  title: string;
  subtitle: string;
  prepTime: string;
  servings: string;
  spiceLevel: 'Mild' | 'Medium Tangy' | 'Fiery Coastal';
  chilies: number;
  emoji: string;
  heroProductSlug: string;
  fallbackProductName: string;
  ingredientsList: string[];
  steps: string[];
  chefTip: string;
}

const COASTAL_RECIPES: CoastalRecipe[] = [
  {
    id: 'rec-1',
    title: 'Authentic Kundapura Chicken / Paneer Ghee Roast',
    subtitle: 'Mangalore’s iconic fiery, tangy, roasted Byadagi chilli & aromatic pure ghee delicacy',
    prepTime: '20 Mins',
    servings: '3–4 Servings',
    spiceLevel: 'Fiery Coastal',
    chilies: 3,
    emoji: '🌶️',
    heroProductSlug: 'garlic-thokku',
    fallbackProductName: 'Garlic Thokku (Poondu Thokku)',
    ingredientsList: [
      '400g Paneer cubes or marinated Chicken pieces',
      '3 tbsp Pure Cow Ghee',
      '2 heaped tbsp Vishnu Home Products Garlic Thokku / Kundapura Masala',
      '3 tbsp thick Curd (Yogurt) & 1 tsp Tamarind extract',
      'Fresh curry leaves & 1 tsp jaggery to balance the heat',
    ],
    steps: [
      'Sear the paneer cubes or chicken pieces in 2 tbsp pure cow ghee until golden on the edges.',
      'Lower the flame and add 2 heaped tablespoons of Vishnu Home Products Garlic Thokku / Masala along with whisked curd.',
      'Slow-roast on medium-low heat for 8–10 minutes until the ghee separates and coats every piece in a deep crimson glaze.',
      'Garnish with crisp curry leaves and serve piping hot with lacy Mangalorean Neer Dosa or flaky Parotta.',
    ],
    chefTip:
      'Adding a pinch of jaggery right at the end unlocks the signature Mangalorean sweet-tangy-fiery balance!',
  },
  {
    id: 'rec-2',
    title: 'Temple-Style Tempered Curd Rice & Tomato Thokku Bowl',
    subtitle: 'Creamy, cooling South Indian mosaranna paired with wood-pressed gingelly Tomato Thokku',
    prepTime: '10 Mins',
    servings: '2 Servings',
    spiceLevel: 'Medium Tangy',
    chilies: 2,
    emoji: '🍅',
    heroProductSlug: 'tomato-thokku',
    fallbackProductName: 'Tomato Thokku',
    ingredientsList: [
      '1.5 cups soft-cooked Sona Masoori rice (mashed while warm)',
      '1 cup fresh thick Curd & 1/4 cup warm milk',
      '2 tbsp Vishnu Home Products Tomato Thokku',
      '1 tsp mustard seeds, urad dal, green chilli & curry leaves for tempering',
      'Pomegranate pearls & fresh coriander',
    ],
    steps: [
      'Mash warm rice with milk and salt, then fold in fresh curd so it remains creamy even hours later in a tiffin box.',
      'Temper mustard seeds, urad dal, and curry leaves in 1 tsp sesame oil and pour over the curd rice.',
      'Place a generous swirl of Vishnu Home Products Tomato Thokku right in the center and top with pomegranate pearls.',
    ],
    chefTip:
      'You can also spread 1 tbsp of Tomato Thokku inside a hot crispy Masala Dosa instead of red chutney!',
  },
  {
    id: 'rec-3',
    title: 'Crispy Coastal Rava-Fried Sun-Dried Mackerel (Bangude)',
    subtitle: 'Traditional Malpe & Kundapura coastal fish side dish for boiled red rice & rasam',
    prepTime: '15 Mins',
    servings: '3 Servings',
    spiceLevel: 'Fiery Coastal',
    chilies: 3,
    emoji: '🐟',
    heroProductSlug: 'kundapura-dry-mackerel',
    fallbackProductName: 'Sun-Dried Kundapura Mackerel',
    ingredientsList: [
      '200g Vishnu Home Products Sun-Dried Kundapura Mackerel',
      '2 tbsp Bombay Rava (Semolina) & 1 tbsp Rice Flour',
      '1.5 tbsp Kashmiri/Byadagi Red Chilli Powder & 1/2 tsp Turmeric',
      '1 tbsp crushed Country Garlic & Tamarind pulp',
      '2 tbsp Cold-Pressed Coconut Oil for pan-searing',
    ],
    steps: [
      'Soak the sun-dried mackerel in warm water for 10 minutes to soften and remove excess sea salt, then pat dry.',
      'Marinate with tamarind pulp, crushed garlic, turmeric, and red chilli powder for 5 minutes.',
      'Coat lightly in the rava + rice flour mix and shallow-fry in pure coconut oil for 3 minutes per side until golden and crunchy.',
    ],
    chefTip:
      'Serve alongside steaming Mangalorean boiled rice (Kaje Akki), hot pepper rasam, and a wedge of lime.',
  },
  {
    id: 'rec-4',
    title: 'Steaming Dal-Ghee Rice with Cut Avakaya Mango Pickle',
    subtitle: 'The ultimate Indian comfort meal elevated with crunchy coastal raw mango pickle',
    prepTime: '12 Mins',
    servings: '2 Servings',
    spiceLevel: 'Fiery Coastal',
    chilies: 3,
    emoji: '🥭',
    heroProductSlug: 'avakaya-mango-pickle',
    fallbackProductName: 'Avakaya Mango Pickle',
    ingredientsList: [
      '1 bowl steaming hot Rice & 1 bowl tempered Toor Dal (Mudda Pappu)',
      '1.5 tbsp melted Pure Cow Ghee',
      '1 heaped tbsp Vishnu Home Products Avakaya Mango Pickle (with its mustard-sesame oil)',
      'Roasted papad / appalam on the side',
    ],
    steps: [
      'Fluff steaming hot rice on a banana leaf or warm plate and ladle thick, unspiced toor dal on top.',
      'Pour warm cow ghee over the dal and add a spoonful of Vishnu Avakaya Mango Pickle along with its aromatic spice oil.',
      'Mix each bite with crushed papad for an unforgettable nostalgic home meal.',
    ],
    chefTip:
      'Use a clean, dry wooden or steel spoon every time to keep your Avakaya mango chunks crisp for 6+ months.',
  },
];

export default function RecipesPage() {
  const { products } = useProducts();
  const { addItem } = useCart();
  const [addedRecipeId, setAddedRecipeId] = useState<string | null>(null);

  const handleAddHeroJar = (recipe: CoastalRecipe) => {
    const matched =
      products.find(
        (p) =>
          p.slug === recipe.heroProductSlug ||
          p.name.toLowerCase().includes(recipe.fallbackProductName.toLowerCase().split(' ')[0])
      ) || products[0];

    if (!matched) return;
    const sz = matched.sizes?.[0] || { label: '300g', price: 120, mrp: 145 };

    addItem({
      product_id: matched.id,
      name: matched.name,
      slug: matched.slug,
      size: sz.label,
      price: sz.price,
      base_price: sz.price,
      mrp: sz.mrp,
      tiered_price_type: matched.tiered_price_type,
      tiered_price_slabs: matched.tiered_price_slabs,
      emoji: matched.emoji || recipe.emoji,
      qty: 1,
    });

    setAddedRecipeId(recipe.id);
    setTimeout(() => setAddedRecipeId(null), 2000);
  };

  return (
    <div className="bg-brandBg min-h-screen py-10">
      <div className="max-w-site mx-auto px-4 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brandText font-semibold">Coastal Kitchen Recipes & Pairing Guide</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#2b090b] via-[#1a0808] to-[#3b120b] text-white p-8 sm:p-10 shadow-xl border border-amber-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Utensils className="w-3.5 h-3.5" />
              Mangalore Heritage Culinary Guide
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
              5-Minute Coastal Recipes with <span className="text-amber-400">Vishnu Jars</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Our slow-cooked thokkus, pickles, and sun-cured dry fish aren&apos;t just side relishes—they are power-packed coastal cooking bases. Discover how Mangalorean families turn a single spoonful into a feast.
            </p>
          </div>

          <Link
            href="/combos"
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-brandDark font-bold text-xs inline-flex items-center gap-2 shadow-lg shrink-0 transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Build a 3-Jar Recipe Combo (Save 15%)</span>
          </Link>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {COASTAL_RECIPES.map((recipe) => {
            const matchedProduct =
              products.find(
                (p) =>
                  p.slug === recipe.heroProductSlug ||
                  p.name.toLowerCase().includes(recipe.fallbackProductName.toLowerCase().split(' ')[0])
              ) || products[0];
            const sz = matchedProduct?.sizes?.[0] || { label: '300g', price: 120, mrp: 145 };

            return (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl border border-brandBorder shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  {/* Top Meta */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brandAccent-light text-brandRed">
                      <Clock className="w-3.5 h-3.5" />
                      {recipe.prepTime} • {recipe.servings}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      <Flame className="w-3.5 h-3.5 text-brandRed fill-brandRed" />
                      <span>
                        {'🌶️'.repeat(recipe.chilies)} {recipe.spiceLevel}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brandAccent-light border border-red-200/60 flex items-center justify-center text-2xl shrink-0">
                      {recipe.emoji}
                    </div>
                    <div>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-brandText">
                        {recipe.title}
                      </h2>
                      <p className="text-xs text-brandText2 mt-0.5">{recipe.subtitle}</p>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="p-3.5 rounded-xl bg-brandBg border border-brandBorder space-y-1.5 text-xs">
                    <div className="font-bold text-brandText uppercase tracking-wider text-[10px]">
                      What You Need:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-brandText2">
                      {recipe.ingredientsList.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div className="space-y-1.5 text-xs">
                    <div className="font-bold text-brandText uppercase tracking-wider text-[10px]">
                      Quick Preparation Steps:
                    </div>
                    <ol className="list-decimal pl-4 space-y-1.5 text-brandText2 leading-relaxed">
                      {recipe.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Chef Tip */}
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-950">
                    <strong>👩‍🍳 Mangalore Kitchen Secret:</strong> {recipe.chefTip}
                  </div>
                </div>

                {/* Bottom Action Bar: 1-Tap Buy Star Ingredient */}
                {matchedProduct && (
                  <div className="p-4 bg-gradient-to-r from-[#fff5f3] to-[#fffbeb] border-t border-red-200/60 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-brandRed">
                        Star Vishnu Ingredient
                      </div>
                      <Link
                        href={`/product/${matchedProduct.slug}`}
                        className="font-bold text-xs sm:text-sm text-brandText hover:text-brandRed truncate block"
                      >
                        {matchedProduct.name} ({sz.label}) — {formatINR(sz.price)}
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddHeroJar(recipe)}
                      className="px-4 py-2.5 rounded-xl bg-brandRed hover:bg-brandRed/90 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shrink-0 transition-all active:scale-95"
                    >
                      {addedRecipeId === recipe.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>+ Add Jar ({formatINR(sz.price)})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


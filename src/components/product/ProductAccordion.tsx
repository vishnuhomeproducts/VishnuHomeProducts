'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, Utensils, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '@/types';

interface ProductAccordionProps {
  product: Product;
}

export const ProductAccordion: React.FC<ProductAccordionProps> = ({ product }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sections = [
    {
      title: 'Detailed Description',
      icon: <Sparkles className="w-4 h-4 text-brandAccent" />,
      content: product.description,
    },
    {
      title: 'Ingredients & Sourcing',
      icon: <Utensils className="w-4 h-4 text-brandAccent" />,
      content:
        product.ingredients ||
        '100% natural ingredients sourced directly from small coastal farms in Dakshina Kannada. Prepared with cold-pressed sesame and mustard oils.',
    },
    {
      title: 'Storage & Shelf Life',
      icon: <ShieldCheck className="w-4 h-4 text-brandAccent" />,
      content:
        product.storage ||
        'Best before 12 months from date of manufacture. Store in a cool, dry place. Use a clean and dry spoon for every use.',
    },
    {
      title: 'Shipping & Easy Returns',
      icon: <Truck className="w-4 h-4 text-brandAccent" />,
      content:
        'Dispatched in 24–48 hours via premium express couriers. Standard delivery arrives in 3–5 business days across India. 7-day hassle-free return or replacement if damaged in transit.',
    },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="divide-y divide-brandBorder border-t border-b border-brandBorder my-6">
      {sections.map((section, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={section.title} className="py-3.5">
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full flex items-center justify-between text-left group text-xs sm:text-sm font-semibold text-brandText hover:text-brandAccent transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {section.icon}
                <span>{section.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-brandText3 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-brandAccent' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="pt-2.5 pb-1 text-xs text-brandText2 leading-relaxed pl-6 animate-fadeIn">
                {section.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const message = encodeURIComponent(
    'Namaskara Vishnu Home Products! I would like to inquire about your homemade pickles and coastal products.'
  );

  return (
    <a
      href={`https://wa.me/919845012345?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 lg:bottom-6 right-4 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-xs shadow-xl hover:scale-105 transition-all"
    >
      <MessageCircle className="w-4 h-4 fill-white" />
      <span className="hidden sm:inline">WhatsApp Order / Help</span>
    </a>
  );
};


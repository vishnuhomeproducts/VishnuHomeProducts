'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '@/lib/data/sampleProducts';

export const Reviews: React.FC = () => {
  const [liveReviews, setLiveReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setLiveReviews(
            data.reviews.slice(0, 6).map((r: any) => ({
              id: r.id,
              name: r.customer_name,
              city: r.city,
              rating: r.rating || 5,
              review: r.comment,
              product: r.product_name,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const displayReviews = liveReviews.length > 0 ? liveReviews.slice(0, 3) : CUSTOMER_REVIEWS;

  return (
    <section className="py-14 bg-brandBg border-t border-brandBorder">
      <div className="max-w-site mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-brandAccent">
            Customer Love
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
            Loved by 2,000+ Homes Across India
          </h2>
          <p className="text-xs sm:text-sm text-brandText2">
            Real feedback from customers savoring the genuine taste of coastal Mangalore.
          </p>
        </div>

        {/* 3-Column Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((rev: any) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-card border border-brandBorder shadow-sm flex flex-col justify-between hover:shadow-cardHover transition-shadow duration-200 relative"
            >
              <Quote className="w-8 h-8 text-brandAccent/15 absolute top-4 right-4 pointer-events-none" />

              <div className="space-y-3">
                {/* Amber Stars */}
                <div className="flex items-center gap-1 text-brandAccent-mid">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brandAccent-mid" />
                  ))}
                </div>

                {rev.product && (
                  <div className="text-[11px] font-bold text-brandAccent uppercase tracking-wider">
                    {rev.product}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-brandText leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-brandBorder flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-brandText">{rev.name}</div>
                  {rev.city && <div className="text-[11px] text-brandText3">📍 {rev.city}</div>}
                </div>
                <span className="text-[10px] font-semibold text-brandGreen bg-brandGreen/10 px-2 py-0.5 rounded">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';

const TRUST_ITEMS = [
  {
    icon: '🚚',
    title: 'Free Delivery',
    description: 'On orders above ₹999',
  },
  {
    icon: '🏡',
    title: '100% Homemade',
    description: 'No factory, no chemicals',
  },
  {
    icon: '✅',
    title: 'FSSAI Certified',
    description: 'Safe & quality assured',
  },
  {
    icon: '↩️',
    title: 'Easy Returns',
    description: '7-day return policy',
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-white border-b border-brandBorder py-6 select-none">
      <div className="max-w-site mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-brandBorder">
          {TRUST_ITEMS.map((item, idx) => (
            <div
              key={item.title}
              className={`flex items-center gap-3.5 ${idx > 0 ? 'pt-3 md:pt-0 md:pl-6' : ''}`}
            >
              <div className="text-2xl sm:text-3xl shrink-0 p-2 bg-brandBg rounded-card border border-brandBorder">
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-brandText">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-brandText2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

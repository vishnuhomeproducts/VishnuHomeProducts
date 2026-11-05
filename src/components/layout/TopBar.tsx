'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const TopBar: React.FC = () => {
  const [announcementText, setAnnouncementText] = useState('Free shipping on orders above ₹499');
  const [promoCode, setPromoCode] = useState('VISHNU10');
  const [promoSubtext, setPromoSubtext] = useState('for 10% off your order');
  const [flashSaleActive, setFlashSaleActive] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          if (data.settings.announcementText) setAnnouncementText(data.settings.announcementText);
          if (data.settings.promoCode) setPromoCode(data.settings.promoCode);
          if (data.settings.promoSubtext) setPromoSubtext(data.settings.promoSubtext);
          if (data.settings.flashSaleActive !== undefined) {
            setFlashSaleActive(Boolean(data.settings.flashSaleActive));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyCode = () => {
    if (!promoCode) return;
    navigator.clipboard?.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brandDark text-[11px] text-white/75 py-2 px-4 border-b border-white/10 select-none">
      <div className="max-w-site mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="flex items-center gap-1.5 font-medium">
          <span>📦</span>
          <span>{announcementText}</span>
        </div>

        {flashSaleActive && promoCode && (
          <div className="flex items-center gap-1.5 font-medium text-brandAccent-mid">
            <span>🎉</span>
            <span>
              Use code{' '}
              <button
                type="button"
                onClick={handleCopyCode}
                title="Click to copy coupon code"
                className="font-bold underline tracking-wide hover:text-white transition-colors cursor-pointer"
              >
                {promoCode}
              </button>{' '}
              {promoSubtext}
              {copied && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-brandGreen text-white text-[9px] font-bold">
                  Copied!
                </span>
              )}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 font-mono text-[10px] text-white/60">
          <Link href="/track-order" className="hover:text-white transition-colors underline underline-offset-2">
            Track Order
          </Link>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brandGreen"></span>
            <span>FSSAI: 21223181000014</span>
          </div>
        </div>
      </div>
    </div>
  );
};

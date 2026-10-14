'use client';

import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-brandDark text-[11px] text-white/70 py-2 px-4 border-b border-white/10 select-none">
      <div className="max-w-site mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="flex items-center gap-1.5 font-medium">
          <span>📦</span>
          <span>Free shipping on orders above ₹999</span>
        </div>
        
        <div className="flex items-center gap-1.5 font-medium text-brandAccent-mid">
          <span>🎉</span>
          <span>
            Use code <strong className="font-bold underline tracking-wide">VISHNU10</strong> for 10% off your first order
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brandGreen"></span>
          <span>FSSAI: 21223181000014</span>
        </div>
      </div>
    </div>
  );
};

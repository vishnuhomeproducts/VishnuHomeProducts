'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="py-14 bg-brandBg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-brandBorder shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-1.5 group">
            <div className="bg-brandRed text-white font-black text-lg px-2.5 py-0.5 rounded tracking-tighter">
              VISHNU
            </div>
            <div className="border border-brandText text-brandText font-bold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
              Home Products
            </div>
          </Link>
          <h1 className="font-display text-2xl font-bold text-brandText pt-2">
            Reset Password
          </h1>
          <p className="text-xs text-brandText2">
            Enter your registered email and we will send you a password recovery link
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-brandGreen mx-auto" />
            <h3 className="font-semibold text-xs text-emerald-900">Reset instructions sent!</h3>
            <p className="text-[11px] text-emerald-800">
              If an account exists with <strong>{email}</strong>, you will receive an email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="pooja@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full bg-brandAccent hover:bg-brandAccent-mid text-white font-bold"
            >
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="pt-2 text-center text-xs">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-brandText2 hover:text-brandAccent font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

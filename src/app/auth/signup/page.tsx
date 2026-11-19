'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Gift } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();
  const { loginDemo } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName,
            },
          },
        });

        if (!error && data?.user) {
          loginDemo(cleanEmail, cleanName);
          router.push('/account');
          return;
        }
      }

      loginDemo(cleanEmail, cleanName);
      router.push('/account');
    } catch (err: any) {
      loginDemo(cleanEmail, cleanName);
      router.push('/account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 bg-brandBg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-brandBorder shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Heritage Showcase Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#190d0c] via-[#331113] to-[#591318] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brandRed/30 blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-white text-brandRed font-black text-xl flex items-center justify-center tracking-tighter shadow-lg group-hover:scale-105 transition-transform">
                V
              </div>
              <div>
                <div className="text-white font-black text-base tracking-tight leading-tight">
                  VISHNU
                </div>
                <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                  Home Products · Mangaluru
                </div>
              </div>
            </Link>

            <div className="space-y-2 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-amber-300 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wood-Pressed · Sun-Dried · Pure</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                Join 2,500+ Families Across India
              </h2>
              <p className="text-xs text-white/75 leading-relaxed">
                Create your free account to unlock 10% OFF your first order, save multiple delivery addresses, and reorder your favourite coastal jars in one click.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-8 relative z-10 text-xs">
            <div className="flex items-center gap-2.5 text-white/90">
              <Gift className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Welcome Code: <strong className="text-amber-300">VISHNU10</strong> (10% OFF)</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/90">
              <Truck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Express Mangaluru &amp; Pan-India Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/90">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Preservatives · Pure Wood-Pressed Oils</span>
            </div>
          </div>
        </div>

        {/* Right Signup Form Panel (7 cols) */}
        <div className="lg:col-span-7 p-7 sm:p-10 space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-brandText">
              Create Your Account
            </h1>
            <p className="text-xs text-brandText2 mt-0.5">
              Start your coastal culinary journey with Vishnu Home Products
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-brandRed font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Input
              label="Create Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full bg-brandRed hover:bg-brandAccent-dark text-white font-bold shadow-md"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="pt-1 text-center text-xs text-brandText2">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brandRed font-bold hover:underline">
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

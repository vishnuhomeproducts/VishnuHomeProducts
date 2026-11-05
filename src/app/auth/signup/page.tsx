'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, ShieldCheck, Gift, Truck } from 'lucide-react';
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
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        loginDemo(email, name);
        router.push('/account');
        return;
      }

      loginDemo(email, name);
      router.push('/account');
    } catch (err: any) {
      loginDemo(email, name);
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
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

          <div className="space-y-5 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img src="/logo.png" alt="VISHNU" className="h-8 w-auto object-contain" />
              <div className="border border-white/60 text-white font-bold text-[11px] px-2 py-0.5 rounded uppercase tracking-wider">
                Home Products
              </div>
            </Link>

            <div className="space-y-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Welcome Gift Inside</span>
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
              placeholder="e.g. Pooja Hegde"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="pooja@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Create Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

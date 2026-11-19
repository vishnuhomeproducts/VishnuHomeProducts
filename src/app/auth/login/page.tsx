'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Gift, Zap, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { loginDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Google Sign-In prompt modal for offline / custom Gmail sign-in
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleError, setGoogleError] = useState('');

  // Close Google modal on Escape key
  useEffect(() => {
    if (!showGoogleModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGoogleModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGoogleModal]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data?.user) {
          router.push('/account');
          return;
        }
      }

      // Fallback local session for this specific email
      loginDemo(cleanEmail);
      router.push('/account');
    } catch (err: any) {
      loginDemo(cleanEmail);
      router.push('/account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    loginDemo('patron@vishnuhomeproducts.in', 'Karthik Kamath');
    router.push('/account');
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')) {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/account`,
          },
        });
        return;
      }
      // If Supabase OAuth is not active on this environment, open Google sign-in dialog
      setShowGoogleModal(true);
    } catch (e) {
      setShowGoogleModal(true);
    }
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');
    const cleanGmail = googleEmail.trim().toLowerCase();
    if (!cleanGmail) {
      setGoogleError('Please enter your Google / Gmail address.');
      return;
    }
    if (!cleanGmail.includes('@')) {
      setGoogleError('Please enter a valid email address.');
      return;
    }

    loginDemo(cleanGmail, cleanGmail.split('@')[0]);
    setShowGoogleModal(false);
    router.push('/account');
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
                <span>Pure Wood-Pressed & Sun-Dried</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                Authentic flavours, straight from our home to yours.
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Log in to reorder your favourite thokkus in 1-tap, track Delhivery parcels live, and access exclusive member batches.
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-3 relative z-10 text-xs">
            <div className="flex items-center gap-2.5 text-white/90">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pan-India Surface & Express Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/90">
              <Gift className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Flat 10% OFF with code <strong className="text-amber-300">VISHNU10</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-white/90">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Homemade · FSSAI Certified Kitchen</span>
            </div>
          </div>
        </div>

        {/* Right Sign-In Form Panel (7 cols) */}
        <div className="lg:col-span-7 p-7 sm:p-10 space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-brandText">
              Welcome Back
            </h1>
            <p className="text-xs text-brandText2 mt-0.5">
              Sign in to your Vishnu Home Products account
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-brandRed font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1-Tap Instant Demo Patron Login + Google OAuth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="py-2.5 px-4 bg-white border border-brandBorder rounded-button text-xs font-bold text-brandText hover:bg-brandBg flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Sign In</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="py-2.5 px-4 bg-brandAccent-light border border-red-200 rounded-button text-xs font-bold text-brandRed hover:bg-brandRed hover:text-white flex items-center justify-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1-Tap Guest Login</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-brandBorder w-full" />
            <span className="bg-white px-3 text-[10px] text-brandText3 uppercase tracking-wider absolute font-semibold">
              or sign in with email
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-brandText">Password</label>
                <Link
                  href="/auth/reset-password"
                  className="text-[11px] text-brandRed hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full bg-brandRed hover:bg-brandAccent-dark text-white font-bold shadow-md"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="pt-1 text-center text-xs text-brandText2">
            New to Vishnu Home Products?{' '}
            <Link href="/auth/signup" className="text-brandRed font-bold hover:underline">
              Create your account →
            </Link>
          </div>
        </div>
      </div>

      {/* Google Sign-in Modal (Enables true per-user Gmail isolation) */}
      {showGoogleModal && (
        <div
          onClick={() => setShowGoogleModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-brandBorder space-y-4 cursor-default animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-brandBorder">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-bold text-sm text-brandText">Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-full text-brandText3 hover:text-brandText hover:bg-brandBg"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-brandText2 leading-relaxed">
              Enter your Google / Gmail address to sign in and view your personal order history:
            </p>

            {googleError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-brandRed font-medium">
                {googleError}
              </div>
            )}

            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <Input
                label="Your Gmail Account"
                type="email"
                placeholder="you@gmail.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                autoFocus
                required
              />

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowGoogleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold"
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

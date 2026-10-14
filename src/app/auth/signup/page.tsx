'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
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
      const { data, error } = await supabase.auth.signUp({
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
    <div className="py-14 bg-brandBg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-brandBorder shadow-xl space-y-6">
        
        {/* Brand Header */}
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
            Create Account
          </h1>
          <p className="text-xs text-brandText2">
            Join the Vishnu family for exclusive batches, discounts & fast ordering
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-brandRed font-medium">
            {errorMessage}
          </div>
        )}

        {/* Email Signup Form */}
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
            className="w-full bg-brandAccent hover:bg-brandAccent-mid text-white font-bold"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-brandText2">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brandAccent font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}

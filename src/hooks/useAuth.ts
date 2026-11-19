'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local session storage first
    const savedActiveUser = typeof window !== 'undefined'
      ? localStorage.getItem('vishnu-active-user') || localStorage.getItem('vishnu-demo-user')
      : null;

    if (savedActiveUser) {
      try {
        const parsed = JSON.parse(savedActiveUser);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      } catch (e) {
        // ignore parse error
      }
    }

    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const cleanEmail = (session.user.email || '').toLowerCase();
          const u: UserProfile = {
            id: session.user.id,
            email: cleanEmail,
            name: session.user.user_metadata?.name || cleanEmail.split('@')[0],
            phone: session.user.phone || session.user.user_metadata?.phone || '',
          };
          setUser(u);
          localStorage.setItem('vishnu-active-user', JSON.stringify(u));
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const cleanEmail = (session.user.email || '').toLowerCase();
          const u: UserProfile = {
            id: session.user.id,
            email: cleanEmail,
            name: session.user.user_metadata?.name || cleanEmail.split('@')[0],
            phone: session.user.phone || session.user.user_metadata?.phone || '',
          };
          setUser(u);
          localStorage.setItem('vishnu-active-user', JSON.stringify(u));
        } else if (!localStorage.getItem('vishnu-active-user')) {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const loginDemo = (email: string, name?: string, phone?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    // Unique deterministic user ID based on email address
    const safeTag = cleanEmail.replace(/[^a-z0-9]/g, '_').slice(0, 24);
    const userId = `usr_${safeTag}`;

    const activeUser: UserProfile = {
      id: userId,
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      phone: phone || '',
    };
    localStorage.setItem('vishnu-active-user', JSON.stringify(activeUser));
    localStorage.removeItem('vishnu-demo-user');
    setUser(activeUser);
    return activeUser;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('vishnu-active-user', JSON.stringify(updated));
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('vishnu-active-user');
    localStorage.removeItem('vishnu-demo-user');
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    loginDemo,
    updateUserProfile,
    logout,
  };
}

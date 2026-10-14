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
    // Check localStorage first for demo / offline auth state
    const savedDemoUser = localStorage.getItem('vishnu-demo-user');
    if (savedDemoUser) {
      try {
        setUser(JSON.parse(savedDemoUser));
      } catch (e) {
        // ignore parse error
      }
    }

    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            phone: session.user.phone,
          });
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            phone: session.user.phone,
          });
        } else if (!localStorage.getItem('vishnu-demo-user')) {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const loginDemo = (email: string, name?: string) => {
    const demoUser = {
      id: 'demo-user-123',
      email,
      name: name || email.split('@')[0],
    };
    localStorage.setItem('vishnu-demo-user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('vishnu-demo-user');
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    loginDemo,
    logout,
  };
}

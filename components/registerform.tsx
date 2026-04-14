'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, ArrowRight, Truck } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import axios from 'axios';

export default function RegisterForm({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  // Prefetch for speed
  const prefetchTarget = callbackUrl || '/dashboard';
  useState(() => {
    if (prefetchTarget) router.prefetch(prefetchTarget);
  });

  const redirectTo = callbackUrl || '/dashboard';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', form);
      const { user, token } = response.data;

      // Zustand (UI only)
      login(user, token);

      toast.success(`Account created for ${user.name}!`);
      router.push(redirectTo);
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Registration failed.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-card border border-border/50 rounded-[3rem] p-2 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pure-green/5 rounded-full blur-3xl" />

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-pure-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pure-green/20">
              <Truck className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground italic">
              Join Emisco for premium truck maintenance.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-pure-green/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-8 rounded-2xl text-lg font-bold group"
            >
              {isLoading ? 'Registering...' : 'Register Now'}
              {!isLoading && (
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>

          <p className="text-center mt-10 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href={`/login${
                callbackUrl
                  ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : ''
              }`}
              className="text-pure-green font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
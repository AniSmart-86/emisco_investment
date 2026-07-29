'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1-minute (60s) countdown timer state for resend button
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccessMsg(res.data.message || 'OTP sent to your email.');
      setStep(2);
      setCountdown(60); // Start 1-minute countdown
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccessMsg('A new 6-digit OTP code has been sent to your email!');
      setCountdown(60); // Reset 60s countdown
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });

      setSuccessMsg(res.data.message || 'Password reset successful!');

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password. Check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorator Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pure-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Header Icon & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pure-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pure-green/20">
              <KeyRound className="w-8 h-8 text-pure-green" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {step === 1 ? 'Forgot Password?' : 'Enter 6-Digit OTP'}
            </h1>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {step === 1
                ? 'No worries! Enter your account email address and we will send you a 6-digit OTP verification code.'
                : `Enter the code sent to ${email} and choose your new password.`}
            </p>
          </div>

          {/* Feedback Banners */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-pure-green/10 border border-pure-green/20 text-pure-green text-xs font-semibold flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1: EMAIL ENTRY */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-muted/40 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-6 rounded-2xl text-base font-bold shadow-lg shadow-pure-green/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP Code…' : 'Send 6-Digit Code'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* STEP 2: OTP + NEW PASSWORD */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP CODE INPUT */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    6-Digit OTP Code
                  </label>
                  <span className="text-[10px] font-bold text-pure-green bg-pure-green/10 px-2 py-0.5 rounded-full">
                    Expires in 20m
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-muted/40 border border-border rounded-2xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-pure-green/50 transition-all"
                />
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-muted/40 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50 transition-all"
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-muted/40 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pure-green/50 transition-all"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-pure-green hover:bg-pure-green-hover text-white py-6 rounded-2xl text-base font-bold shadow-lg shadow-pure-green/20"
              >
                {loading ? 'Updating Password…' : 'Reset Password'}
              </Button>

              {/* RESEND OTP COUNTDOWN SECTION */}
              <div className="pt-3 text-center border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
                {countdown > 0 ? (
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-xl">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-pure-green" />
                    Resend code in <span className="text-pure-green">{countdown}s</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="inline-flex items-center gap-2 text-xs font-bold text-pure-green hover:underline cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                    {resending ? 'Resending Code…' : 'Resend 6-Digit Code'}
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

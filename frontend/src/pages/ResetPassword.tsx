import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../lib/api';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: password,
      });
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired reset token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex bg-[#F7F5EF] items-center justify-center px-6">
        <div className="w-full max-w-[26rem] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="font-serif text-[1.9rem] leading-tight text-[#1B2130]">Password reset</h2>
          <p className="mt-3 text-[14.5px] text-[#6B7280]">
            Your password has been reset successfully. Redirecting to sign in&hellip;
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#B8873D] transition-colors hover:text-[#96692A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F7F5EF]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between overflow-hidden bg-[#0B1220] px-14 py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #D9C79A 27px, #D9C79A 28px)',
          }}
        />
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #B8873D 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#B8873D]/40">
            <ShieldCheck className="h-4.5 w-4.5 text-[#D9C79A]" strokeWidth={1.75} />
          </div>
          <span className="font-mono text-[13px] tracking-[0.2em] text-[#D9C79A]">AUDIT&nbsp;PRO</span>
        </div>

        <div className="relative z-10 flex flex-col gap-10">
          <h1 className="max-w-sm font-serif text-[2.65rem] leading-[1.15] text-[#F2EFE6]">
            Choose a new
            <br />
            password
          </h1>
          <p className="max-w-[16rem] font-sans text-[13.5px] leading-relaxed text-[#8B93A7]">
            Make it at least 8 characters and something you haven&rsquo;t used before.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6 font-mono text-[11px] tracking-wide text-[#5A6273]">
          <span>SESSION&nbsp;SECURED</span>
          <span className="h-1 w-1 rounded-full bg-[#5A6273]" />
          <span>&copy; {new Date().getFullYear()} Audit Pro</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[26rem]">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0B1220]">
              <ShieldCheck className="h-4.5 w-4.5 text-[#D9C79A]" strokeWidth={1.75} />
            </div>
            <span className="font-mono text-[13px] tracking-[0.2em] text-[#0B1220]">AUDIT&nbsp;PRO</span>
          </div>

          <h2 className="font-serif text-[1.9rem] leading-tight text-[#1B2130]">Reset password</h2>
          <p className="mt-2 text-[14.5px] text-[#6B7280]">
            Enter your new password below.
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-[#F0D8D3] bg-[#FBEEEC] px-4 py-3 text-[13.5px] text-[#9A3B2D]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B4483A]" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B7280]"
              >
                New password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  autoFocus
                  className="w-full rounded-lg border border-[#E3DFD2] bg-white py-3 pl-11 pr-11 text-[14.5px] text-[#1B2130] placeholder:text-[#B0B4BE] transition-colors focus:border-[#B8873D] focus:outline-none focus:ring-2 focus:ring-[#B8873D]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B7280]"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-[#E3DFD2] bg-white py-3 pl-11 pr-4 text-[14.5px] text-[#1B2130] placeholder:text-[#B0B4BE] transition-colors focus:border-[#B8873D] focus:outline-none focus:ring-2 focus:ring-[#B8873D]/25"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1220] py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[#16223A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Resetting&hellip;
                </>
              ) : (
                <>
                  <CheckCircle className="h-[18px] w-[18px]" />
                  Reset password
                </>
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#B8873D] transition-colors hover:text-[#96692A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

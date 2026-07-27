import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import api from '../lib/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setResetToken(response.data.data?.resetToken || '');
      setStep('sent');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

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
            Réinitialisez
            <br />
            vos identifiants
          </h1>
          <p className="max-w-[16rem] font-sans text-[13.5px] leading-relaxed text-[#8B93A7]">
            Saisissez l&rsquo;adresse email liée à votre compte et nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6 font-mono text-[11px] tracking-wide text-[#5A6273]">
          <span>SESSION&nbsp;SÉCURISÉE</span>
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

          {step === 'email' && (
            <>
              <h2 className="font-serif text-[1.9rem] leading-tight text-[#1B2130]">Mot de passe oublié ?</h2>
              <p className="mt-2 text-[14.5px] text-[#6B7280]">
                Pas d&rsquo;inquiétude, nous vous enverrons les instructions.
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
                    htmlFor="email"
                    className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B7280]"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@entreprise.com"
                      autoComplete="email"
                      autoFocus
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
                      Envoi&hellip;
                    </>
                  ) : (
                    <>
                      <Send className="h-[18px] w-[18px]" />
                      Envoyer les instructions
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
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}

          {step === 'sent' && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Send className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="font-serif text-[1.9rem] leading-tight text-[#1B2130]">Vérifiez votre email</h2>
              <p className="mt-3 text-[14.5px] text-[#6B7280]">
                Nous avons envoyé un lien de réinitialisation à <strong className="text-[#1B2130]">{email}</strong>
              </p>
              <p className="mt-1 text-[13px] text-[#9CA3AF]">
                Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe. Il expire dans 1 heure.
              </p>

              {resetToken && (
                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-left">
                  <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#9A7B3A] mb-2">
                    Mode développement — lien ci-dessous
                  </p>
                  <p className="text-[13px] text-[#1B2130]">
                    Aucun service email configuré. Utilisez ce lien pour réinitialiser votre mot de passe :
                  </p>
                  <Link
                    to={`/reset-password/${resetToken}`}
                    className="mt-2 block text-[13px] font-mono text-[#B8873D] break-all hover:text-[#96692A] underline underline-offset-2"
                  >
                    /reset-password/{resetToken.substring(0, 16)}&hellip;
                  </Link>
                </div>
              )}

              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#B8873D] transition-colors hover:text-[#96692A]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

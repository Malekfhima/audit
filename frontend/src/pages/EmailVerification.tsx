import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle, XCircle, Loader2, ArrowLeft, Mail } from 'lucide-react';
import api from '../lib/api';

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Lien de vérification invalide.');
      return;
    }

    const verify = async () => {
      try {
        const response = await api.post('/auth/verify-email', { token });
        if (response.data.success) {
          setStatus('success');
          setMessage('Votre email a été vérifié avec succès !');
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Échec de la vérification.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Lien de vérification invalide ou expiré.');
      }
    };

    verify();
  }, [token]);

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
            {status === 'success'
              ? 'Identity&nbsp;confirmed'
              : status === 'error'
              ? 'Link&nbsp;expired'
              : 'Vérification&hellip;'}
          </h1>
          <p className="max-w-[16rem] font-sans text-[13.5px] leading-relaxed text-[#8B93A7]">
            {status === 'success'
              ? 'Votre compte est maintenant actif. Connectez-vous pour accéder à votre espace.'
              : status === 'error'
              ? 'Le lien de vérification a peut-être expiré. Demandez-en un nouveau.'
              : 'Veuillez patienter pendant la vérification de votre adresse email.'}
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
        <div className="w-full max-w-[26rem] text-center">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0B1220]">
              <ShieldCheck className="h-4.5 w-4.5 text-[#D9C79A]" strokeWidth={1.75} />
            </div>
            <span className="font-mono text-[13px] tracking-[0.2em] text-[#0B1220]">AUDIT&nbsp;PRO</span>
          </div>

          {/* Status icon */}
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            status === 'verifying' ? 'bg-amber-50' :
            status === 'success' ? 'bg-emerald-50' : 'bg-red-50'
          }`}>
            {status === 'verifying' ? (
              <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>

          <h2 className="font-serif text-[1.9rem] leading-tight text-[#1B2130]">
            {status === 'verifying' ? 'Vérification de votre email' :
             status === 'success' ? 'Email vérifié !' :
             'Échec de la vérification'}
          </h2>
          <p className="mt-3 text-[14.5px] text-[#6B7280]">
            {status === 'verifying' ? 'Veuillez patienter un instant\u2026' : message}
          </p>

          <div className="mt-8 space-y-3">
            {status === 'success' && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1220] px-8 py-3 text-[14.5px] font-medium text-white transition-colors hover:bg-[#16223A]"
              >
                <ArrowLeft className="h-[18px] w-[18px]" />
                Se connecter à mon compte
              </Link>
            )}
            {status === 'error' && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1220] px-8 py-3 text-[14.5px] font-medium text-white transition-colors hover:bg-[#16223A]"
              >
                <Mail className="h-[18px] w-[18px]" />
                Demander une nouvelle vérification
              </Link>
            )}
            <div>
              <Link
                to="/login"
                className={`inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#B8873D] transition-colors hover:text-[#96692A] ${
                  status === 'verifying' ? 'mt-4' : 'mt-2'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

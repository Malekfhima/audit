import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Veuillez saisir votre nom complet');
      return;
    }
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await register(firstName, lastName, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-[#E3DFD2] bg-white py-3 pl-11 pr-4 text-[14.5px] text-[#1B2130] placeholder:text-[#B0B4BE] transition-colors focus:border-[#B8873D] focus:outline-none focus:ring-2 focus:ring-[#B8873D]/25';
  const labelClass = 'mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B7280]';

  return (
    <div className="min-h-screen w-full flex bg-[#F7F5EF]">
      {/* ===== Left panel — brand identity ===== */}
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

        {/* Wordmark */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#B8873D]/40">
            <ShieldCheck className="h-4.5 w-4.5 text-[#D9C79A]" strokeWidth={1.75} />
          </div>
          <span className="font-mono text-[13px] tracking-[0.2em] text-[#D9C79A]">AUDIT&nbsp;PRO</span>
        </div>

        {/* Headline + seal */}
        <div className="relative z-10 flex flex-col gap-10">
          <h1 className="max-w-sm font-serif text-[2.65rem] leading-[1.15] text-[#F2EFE6]">
            Un espace,
            <br />
            chaque&nbsp;mission&nbsp;archivée.
          </h1>

          <div className="flex items-center gap-6">
            <div className="relative h-28 w-28 shrink-0">
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <defs>
                  <path
                    id="sealPathReg"
                    d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
                  />
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="#B8873D"
                  strokeOpacity="0.55"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                  style={{ transformOrigin: '100px 100px' }}
                  className="motion-safe:animate-[spin_50s_linear_infinite]"
                />
                <circle cx="100" cy="100" r="72" fill="none" stroke="#D9C79A" strokeOpacity="0.5" strokeWidth="1" />
                <text fontSize="8.5" fill="#D9C79A" letterSpacing="2.5">
                  <textPath href="#sealPathReg" startOffset="0%">
                    NOUVEAU COMPTE • ACCÈS ÉQUIPE • NOUVEAU COMPTE • ACCÈS ÉQUIPE •
                  </textPath>
                </text>
                <path
                  d="M68,101 L90,122 L133,74"
                  fill="none"
                  stroke="#D9C79A"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="max-w-[13rem] font-sans text-[13.5px] leading-relaxed text-[#8B93A7]">
              Invitez votre équipe, assignez des missions et conservez chaque constat traçable dès le premier jour.
            </p>
          </div>
        </div>

        {/* Footer line */}
        <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6 font-mono text-[11px] tracking-wide text-[#5A6273]">
          <span>INSCRIPTION&nbsp;CHIFFRÉE</span>
          <span className="h-1 w-1 rounded-full bg-[#5A6273]" />
          <span>&copy; {new Date().getFullYear()} Audit Pro — Système de gestion</span>
        </div>
      </div>

      {/* ===== Right panel — form ===== */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[26rem]">
          {/* Mobile-only mark */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0B1220]">
              <ShieldCheck className="h-4.5 w-4.5 text-[#D9C79A]" strokeWidth={1.75} />
            </div>
            <span className="font-mono text-[13px] tracking-[0.2em] text-[#0B1220]">AUDIT&nbsp;PRO</span>
          </div>

          <h2 className="font-serif text-[1.9rem] leading-tight text-[#1B2130]">Créez votre compte</h2>
          <p className="mt-2 text-[14.5px] text-[#6B7280]">
            Configurez l&rsquo;accès à l&rsquo;espace d&rsquo;audit de votre équipe.
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-[#F0D8D3] bg-[#FBEEEC] px-4 py-3 text-[13.5px] text-[#9A3B2D]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B4483A]" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelClass}>Prénom</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    autoComplete="given-name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>Nom</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>Adresse email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>Mot de passe</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  autoComplete="new-password"
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  autoComplete="new-password"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1220] py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[#16223A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Création du compte&hellip;
                </>
              ) : (
                <>
                  <UserPlus className="h-[18px] w-[18px]" />
                  Créer un compte
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-[13.5px] text-[#6B7280]">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-semibold text-[#B8873D] transition-colors hover:text-[#96692A]">
              Se connecter
            </Link>
          </p>

          <p className="mt-10 text-center font-mono text-[11px] tracking-wide text-[#B0B4BE] lg:hidden">
            &copy; {new Date().getFullYear()} Audit Pro Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { X, User, Mail, Lock, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onAdminNavigate?: () => void;
}

function getFriendlyAuthError(rawMsg: string | null): string {
  if (!rawMsg) return 'Identifiants incorrects. Veuillez réessayer.';

  const lower = rawMsg.toLowerCase();
  if (
    lower.includes('invalid login credentials') ||
    lower.includes('invalid credentials') ||
    lower.includes('invalid_grant') ||
    lower.includes('adresse e-mail ou mot de passe incorrect') ||
    lower.includes('identifiants')
  ) {
    return 'Adresse e-mail ou mot de passe incorrect.';
  }

  if (
    lower.includes('already registered') ||
    lower.includes('already exists') ||
    lower.includes('déjà un compte') ||
    lower.includes('déjà associée')
  ) {
    return 'Cette adresse e-mail possède déjà un compte.';
  }

  if (lower.includes('email not confirmed') || lower.includes('confirmation')) {
    return 'Veuillez confirmer votre adresse e-mail avant de vous connecter.';
  }

  if (lower.includes('too many requests') || lower.includes('rate limit') || lower.includes('tentatives')) {
    return 'Trop de tentatives consécutives. Patientez un instant.';
  }

  if (lower.includes('6 caractères') || lower.includes('au moins 6')) {
    return 'Le mot de passe doit comporter au moins 6 caractères.';
  }

  if (lower.includes('invalide') || lower.includes('invalid email')) {
    return 'Format d’adresse e-mail invalide.';
  }

  return rawMsg;
}

export default function AuthModal({ onAdminNavigate }: AuthModalProps) {
  const { closeModal, login, signup } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Adresse e-mail ou mot de passe incorrect.');
        setIsLoading(false);
        return;
      }

      await new Promise(r => setTimeout(r, 600));
      closeModal();
      if (res.isAdmin && onAdminNavigate) {
        onAdminNavigate();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    if (password && password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await signup(name, email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Erreur lors de la création du compte.');
        setIsLoading(false);
        return;
      }

      await new Promise(r => setTimeout(r, 600));
      closeModal();
      router.push('/compte');
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white w-full max-w-[390px] max-h-[calc(100dvh-2rem)] flex flex-col rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden animate-slideUp my-auto">
        {/* Subtle decorative top line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-800 via-teal-600 to-amber-500 shrink-0" />

        <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {tab === 'login' ? 'Bon retour !' : 'Créer un compte'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {tab === 'login'
                  ? 'Retrouvez vos favoris et vos alertes.'
                  : 'Rejoignez la communauté des explorateurs.'}
              </p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Fermer la fenêtre"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-100 border border-stone-200/70">
            <button
              type="button"
              onClick={() => { setTab('login'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                closeModal();
                router.push('/inscription');
              }}
              className="py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-teal-900 transition-all cursor-pointer"
            >
              Créer un compte
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-[11px] leading-tight">{successMsg}</span>
            </div>
          )}

          {/* Compact Error Banner */}
          {errorMsg && (
            <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs flex items-center justify-between gap-2 animate-fadeIn shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium text-[11px] leading-tight truncate">
                  {getFriendlyAuthError(errorMsg)}
                </span>
              </div>
              {tab === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    router.push('/inscription');
                  }}
                  className="text-[10px] font-bold text-teal-800 hover:text-teal-950 underline underline-offset-2 shrink-0 cursor-pointer"
                >
                  S’inscrire ?
                </button>
              )}
            </div>
          )}

          {/* Form */}
          {!successMsg && (
            <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-3">
              {tab === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Prénom & Nom
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex : Nathan Martin"
                      className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                      required={tab === 'signup'}
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Mot de passe
                  </label>
                  {tab === 'signup' && (
                    <span className="text-[10px] text-slate-400">6 car. min</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white transition-all outline-none"
                    required
                    minLength={tab === 'signup' ? 6 : undefined}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold bg-teal-800 hover:bg-teal-900 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Chargement...</span>
                  </>
                ) : (
                  <>
                    <span>{tab === 'login' ? 'Accéder à mon espace' : 'Créer mon compte'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {tab === 'login' && (
                <div className="pt-2 border-t border-stone-200/80 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      router.push('/inscription');
                    }}
                    className="text-[11px] text-slate-500 hover:text-teal-900 transition-colors cursor-pointer"
                  >
                    Pas encore de compte ?{' '}
                    <strong className="text-teal-800 font-bold underline underline-offset-2">
                      Découvrir & s&apos;inscrire (+30 XP) →
                    </strong>
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

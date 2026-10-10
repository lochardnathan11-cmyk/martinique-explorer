'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { X, Shield, User, Mail, Lock, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

interface AuthModalProps {
  onAdminNavigate?: () => void;
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
        setErrorMsg(res.error || 'Erreur lors de la connexion. Vérifiez vos identifiants.');
        setIsLoading(false);
        return;
      }

      await new Promise(r => setTimeout(r, 2000));
      
      if (res.isAdmin) {
        closeModal();
        if (onAdminNavigate) onAdminNavigate();
        router.push('/admin');
      } else {
        closeModal();
        router.push('/compte');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
      setIsLoading(false);
    }
  };

  const handleQuickPapaLogin = async () => {
    setEmail('papa@martinique-explorer.com');
    setPassword('admin');
    setErrorMsg(null);
    setIsLoading(true);
    await login('papa@martinique-explorer.com', 'admin');
    await new Promise(r => setTimeout(r, 2000));
    closeModal();
    if (onAdminNavigate) onAdminNavigate();
    router.push('/admin');
  };

  const handleQuickMemberLogin = async () => {
    setEmail('voyageur@martinique-explorer.com');
    setErrorMsg(null);
    setIsLoading(true);
    await login('voyageur@martinique-explorer.com');
    await new Promise(r => setTimeout(r, 2000));
    closeModal();
    router.push('/compte');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    if (password && password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
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

      await new Promise(r => setTimeout(r, 2000));
      closeModal();
      router.push('/compte');
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-deep/60 backdrop-blur-md animate-fadeIn">
      {/* Animated Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-action/20 blur-[120px] mix-blend-overlay" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-coral/20 blur-[120px] mix-blend-overlay" />
      </div>

      <div className="relative bg-white w-full max-w-[420px] rounded-[32px] border border-white/20 shadow-2xl overflow-hidden animate-slideUp">
        {/* Elegant Top Decorative Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-action via-lagon to-action-hover" />

        <div className="p-8 space-y-7">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-action/80">
                Martinique Explorer
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-deep tracking-tight">
                {tab === 'login' ? 'Bon retour !' : 'Bienvenue !'}
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pr-4">
                {tab === 'login'
                  ? 'Connectez-vous pour retrouver vos favoris et vos alertes.'
                  : 'Rejoignez la communauté pour partager vos meilleures découvertes.'}
              </p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-ink-muted hover:text-deep flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Fermer la fenêtre de connexion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Toggle (Segmented Control style) */}
          <div className="flex p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/50">
            <button
              type="button"
              onClick={() => { setTab('login'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === 'login' 
                  ? 'bg-white text-action shadow-sm border border-slate-200/50' 
                  : 'text-ink-muted hover:text-deep hover:bg-white/50'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === 'signup' 
                  ? 'bg-white text-action shadow-sm border border-slate-200/50' 
                  : 'text-ink-muted hover:text-deep hover:bg-white/50'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Success Message Banner */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex items-center gap-3 animate-fadeIn shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="font-medium leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs flex items-center gap-3 animate-fadeIn shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Unified Form with Fluid Transitions */}
          {!successMsg && (
            <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-4.5">
              
              {/* Name Field (Only for Signup, animates height smoothly) */}
              <div 
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  tab === 'signup' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1.5 pb-4.5">
                    <label className="block text-xs font-semibold text-deep pl-1">
                      Prénom & Nom
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ex : Aurélie Martin"
                        className="w-full text-sm pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-ink placeholder:text-slate-400 focus:border-action focus:ring-4 focus:ring-action/10 focus:bg-white transition-all outline-none"
                        required={tab === 'signup'}
                        tabIndex={tab === 'signup' ? 0 : -1}
                      />
                      <User className="w-4 h-4 text-slate-400 group-focus-within:text-action transition-colors absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-deep pl-1">
                  Adresse e-mail
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full text-sm pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-ink placeholder:text-slate-400 focus:border-action focus:ring-4 focus:ring-action/10 focus:bg-white transition-all outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-action transition-colors absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pl-1 pr-1">
                  <label className="block text-xs font-semibold text-deep">
                    Mot de passe 
                    <span className={`transition-opacity duration-300 ${tab === 'signup' ? 'opacity-100' : 'opacity-0'} font-normal text-ink-muted`}>
                      {' '}(6 caractères min.)
                    </span>
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-ink placeholder:text-slate-400 focus:border-action focus:ring-4 focus:ring-action/10 focus:bg-white transition-all outline-none"
                    required
                    minLength={tab === 'signup' ? 6 : undefined}
                  />
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-action transition-colors absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-2 py-3.5 rounded-2xl text-white text-sm font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                  tab === 'login' 
                    ? 'bg-action hover:bg-action-hover shadow-action/30 hover:shadow-xl hover:shadow-action/40' 
                    : 'bg-deep hover:bg-deep-muted shadow-deep/30 hover:shadow-xl hover:shadow-deep/40'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{tab === 'login' ? 'Connexion...' : 'Création en cours...'}</span>
                  </>
                ) : (
                  <>
                    <span>{tab === 'login' ? 'Accéder à mon espace' : 'Rejoindre la communauté'}</span>
                    {tab === 'login' && <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

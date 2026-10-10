'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Shield, User, Mail, Lock, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

interface AuthModalProps {
  onAdminNavigate?: () => void;
}

export default function AuthModal({ onAdminNavigate }: AuthModalProps) {
  const { closeModal, login, signup } = useApp();
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

      if (res.isAdmin) {
        setSuccessMsg('Bienvenue Papa ! Connexion Administrateur confirmée.');
        setTimeout(() => {
          closeModal();
          if (onAdminNavigate) onAdminNavigate();
        }, 900);
      } else {
        setSuccessMsg('Connexion réussie ! Bon retour sur Martinique Explorer.');
        setTimeout(() => {
          closeModal();
        }, 900);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPapaLogin = async () => {
    setEmail('papa@martinique-explorer.com');
    setPassword('admin');
    setErrorMsg(null);
    setIsLoading(true);
    const res = await login('papa@martinique-explorer.com', 'admin');
    setIsLoading(false);
    setSuccessMsg('Bienvenue Papa ! Accès complet à votre Espace Gestion Zéro Code.');
    setTimeout(() => {
      closeModal();
      if (onAdminNavigate) onAdminNavigate();
    }, 800);
  };

  const handleQuickMemberLogin = async () => {
    setEmail('voyageur@martinique-explorer.com');
    setErrorMsg(null);
    setIsLoading(true);
    await login('voyageur@martinique-explorer.com');
    setIsLoading(false);
    setSuccessMsg('Connecté en tant que membre !');
    setTimeout(() => {
      closeModal();
    }, 800);
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

      setSuccessMsg(`Bienvenue ${name} ! Votre compte membre a été créé.`);
      setTimeout(() => {
        closeModal();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-deep/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-4xl border border-lagon-border shadow-modal overflow-hidden p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-action">
                Espace Membre & Administration
              </span>
            </div>
            <h3 className="text-2xl font-semibold text-deep">
              {tab === 'login' ? 'Connexion' : 'Créer un compte'}
            </h3>
            <p className="text-xs text-ink-muted">
              {tab === 'login'
                ? 'Accédez à vos favoris, alertes et à votre espace.'
                : 'Rejoignez la communauté pour partager vos avis et alertes.'}
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-lagon-bg text-ink-muted hover:text-deep flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer la fenêtre de connexion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-lagon-bg p-1 border border-lagon-border text-xs">
          <button
            type="button"
            onClick={() => { setTab('login'); setSuccessMsg(null); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              tab === 'login' ? 'bg-white text-deep shadow-soft font-semibold' : 'text-ink-muted hover:text-deep'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setSuccessMsg(null); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              tab === 'signup' ? 'bg-white text-deep shadow-soft font-semibold' : 'text-ink-muted hover:text-deep'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Success Message Banner */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-sand-light border border-sand-border text-deep text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-action shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Error Message Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Login Form */}
        {tab === 'login' && !successMsg && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-deep mb-1">
                Adresse email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:bg-white focus:outline-none transition-colors"
                  required
                />
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:bg-white focus:outline-none transition-colors"
                  required
                />
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-action hover:bg-action-hover text-white text-sm font-medium transition-colors shadow-soft flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Signup Form */}
        {tab === 'signup' && !successMsg && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-deep mb-1">
                Prénom & Nom
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex : Aurélie Martin"
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:bg-white focus:outline-none transition-colors"
                  required
                />
                <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep mb-1">
                Adresse email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:bg-white focus:outline-none transition-colors"
                  required
                />
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep mb-1">
                Mot de passe (6 caractères min.)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:bg-white focus:outline-none transition-colors"
                  required
                  minLength={6}
                />
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-action hover:bg-action-hover text-white text-sm font-medium transition-colors shadow-soft flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Création du compte...</span>
                </>
              ) : (
                <span>Créer mon compte (+50 XP)</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

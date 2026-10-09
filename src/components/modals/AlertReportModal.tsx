'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Check, ChevronDown, CheckCircle2, MapPin } from 'lucide-react';
import { MARTINIQUE_COMMUNES, normalizeSearchText } from '@/data/communes';

export default function AlertReportModal() {
  const { closeModal, addAlert } = useApp();
  const [type, setType] = useState<'sargasses' | 'meduses' | 'houle' | 'plage_fermee' | 'embouteillage' | 'info'>('sargasses');
  const [location, setLocation] = useState('');
  const [commune, setCommune] = useState('');
  const [showCommuneSuggestions, setShowCommuneSuggestions] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const ALERT_TYPES = [
    { value: 'sargasses', label: 'Arrivage de sargasses', icon: '🌿' },
    { value: 'meduses', label: 'Présence de méduses', icon: '🪼' },
    { value: 'houle', label: 'Forte houle ou rouleaux', icon: '🌊' },
    { value: 'embouteillage', label: 'Ralentissement routier', icon: '🚗' },
    { value: 'info', label: 'Conditions calmes & Tortues', icon: '🐢' },
  ];

  const currentTypeObj = ALERT_TYPES.find(t => t.value === type) || ALERT_TYPES[0];

  const filteredCommunes = MARTINIQUE_COMMUNES.filter(c =>
    normalizeSearchText(c).includes(normalizeSearchText(commune))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    addAlert({
      type,
      location,
      commune: commune.trim() || 'Martinique',
      title,
      description,
      reportedBy: 'Membre résident',
      severity: 'warning',
    });

    setSuccess(true);
    setTimeout(() => {
      closeModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-deep/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl sm:rounded-4xl border border-lagon-border shadow-modal p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-coral">
              Signalement communautaire
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-deep leading-tight">
              Partager une observation en direct
            </h3>
            <p className="text-xs text-ink-muted">
              Aidez les autres voyageurs et habitants à adapter leurs sorties en mer.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-lagon-bg text-ink-muted hover:text-deep flex items-center justify-center transition-colors shrink-0"
            aria-label="Fermer le modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-lagon-bg text-action flex items-center justify-center">
              <Check className="w-6 h-6 text-[#087E8B]" />
            </div>
            <h4 className="font-bold text-deep text-base">Signalement enregistré</h4>
            <p className="text-xs text-ink-muted">Merci pour votre contribution à la communauté.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-deep mb-1">Nature de l&apos;observation</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-lagon-bg hover:bg-white border border-lagon-border hover:border-action text-ink text-sm font-medium flex items-center justify-between transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{currentTypeObj.icon}</span>
                    <span>{currentTypeObj.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-action' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-lagon-border p-1.5 z-50 animate-fadeIn space-y-1">
                      {ALERT_TYPES.map(opt => {
                        const isSelected = type === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setType(opt.value as any);
                              setDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                              isSelected
                                ? 'bg-lagon-bg text-action font-bold'
                                : 'text-ink hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{opt.icon}</span>
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-action shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Champ Commune avec suggestions automatiques */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-deep">Commune *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={commune}
                    onChange={e => {
                      setCommune(e.target.value);
                      setShowCommuneSuggestions(true);
                    }}
                    onFocus={() => setShowCommuneSuggestions(true)}
                    placeholder="Tapez ex: Sainte-Anne..."
                    className="w-full text-sm py-2.5 px-3.5 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                    required
                  />

                  {showCommuneSuggestions && commune.trim() && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowCommuneSuggestions(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-lagon-border p-1.5 z-50 max-h-44 overflow-y-auto space-y-0.5 animate-fadeIn">
                        {filteredCommunes.slice(0, 6).map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setCommune(c);
                              setShowCommuneSuggestions(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-deep hover:bg-lagon-bg hover:text-action text-left transition-colors cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5 text-action shrink-0" />
                            <span>{c}</span>
                          </button>
                        ))}
                        {filteredCommunes.length === 0 && (
                          <div className="px-3 py-2 text-xs text-ink-muted">
                            Aucune commune trouvée
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-deep">Plage / Secteur *</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Ex : Anse Cafard"
                  className="w-full text-sm py-2.5 px-3.5 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-deep">Titre de votre remarque *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex : Nappe d'algues sur le côté droit de l'anse"
                className="w-full text-sm py-2.5 px-3.5 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-deep">Détails complémentaires</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="Précisez la zone praticable ou les conseils pour la baignade..."
                className="w-full text-sm py-2 px-3.5 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none resize-none bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            <div className="pt-2.5 flex items-center justify-end gap-3 border-t border-lagon-border">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-ink-muted hover:text-ink transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-bold transition-all shadow-soft cursor-pointer flex items-center gap-1.5"
              >
                Transmettre l&apos;observation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

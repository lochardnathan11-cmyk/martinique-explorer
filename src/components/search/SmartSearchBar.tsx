'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Search, X, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '@/data/translations';

interface SmartSearchBarProps {
  onSearchSubmit?: () => void;
}

export default function SmartSearchBar({ onSearchSubmit }: SmartSearchBarProps) {
  const { searchQuery, setSearchQuery, language, openModal } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;

  const quickSuggestions = [
    'Plages de sable blanc',
    'Snorkeling tortues',
    'Randonnées ombragées',
    'Restaurants les pieds dans l\'eau',
  ];

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl text-left">
      {/* Search Input Box */}
      <div className="relative bg-white rounded-3xl p-2 sm:p-2.5 shadow-card border border-lagon-border transition-all duration-300 focus-within:border-action focus-within:shadow-modal flex items-center gap-2">
        <div className="pl-3 text-ink-muted">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Où souhaitez-vous aller en Martinique ?"
          aria-label="Rechercher une plage, une activité ou une commune"
          className="flex-1 bg-transparent py-2 px-1 text-sm sm:text-base text-ink placeholder-ink-muted focus:outline-none"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-ink-muted hover:text-ink rounded-full transition-colors"
            aria-label="Effacer la recherche"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Single Primary Action Button */}
        <button
          type="button"
          onClick={() => {
            if (onSearchSubmit) onSearchSubmit();
          }}
          className="px-5 py-2.5 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-soft shrink-0"
        >
          Rechercher
        </button>
      </div>

      {/* Discrete, calm suggestion chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/90">
        <span className="text-white/70 font-light hidden sm:inline">Idées :</span>
        {quickSuggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSearchQuery(item);
              if (onSearchSubmit) onSearchSubmit();
            }}
            className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm text-xs font-normal transition-all duration-200 border border-white/20"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  recommendations?: {
    beaches?: string[];
    activities?: string[];
    hotels?: string[];
    budgetEstimate?: string;
  };
}

export default function AIAssistantModal({ initialQuery = '' }: { initialQuery?: string }) {
  const { closeModal } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Bonjour, je suis Ti-Bot, votre conseiller voyage pour la Martinique. Vous préparez un séjour en famille, en couple ou en solo ? Décrivez-moi votre projet et je vous orienterai vers les anses les plus adaptées.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse: ChatMessage;
      const lower = query.toLowerCase();

      if (lower.includes('famille') || lower.includes('enfant')) {
        botResponse = {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: `Pour un séjour serein avec de jeunes enfants, privilégiez le calme des anses du Sud-Caraïbe, abritées de la houle atlantique :`,
          recommendations: {
            beaches: ['Plage des Salines (Sainte-Anne) — ombragée par les raisiniers', 'Pointe Marin — eau tiède et fonds très progressifs', 'Anse Dufour — pour observer les tortues sans vagues'],
            activities: ['Excursion vers les fonds blancs du François', 'Balade au Jardin de Balata'],
            hotels: ['Résidence hôtelière en bord de mer à Sainte-Luce'],
            budgetEstimate: 'Budget prévisionnel conseillé : 2 400 € pour 10 jours (logement, voiture et restauration)'
          }
        };
      } else if (lower.includes('tortue') || lower.includes('snorkeling')) {
        botResponse = {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: `Les herbiers sous-marins des Anses-d'Arlet offrent une excellente visibilité matinale :`,
          recommendations: {
            beaches: ['Anse Dufour : arrivez vers 8h00 pour profiter de l\'eau calme', 'Grande Anse d\'Arlet : tortues vertes souvent visibles à 30m du rivage'],
            activities: ['Baptême de plongée respectueux vers le Rocher du Diamant'],
            budgetEstimate: 'Accès libre et gratuit avec votre propre équipement de masque et tuba.'
          }
        };
      } else {
        botResponse = {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: `Voici une sélection équilibrée pour profiter à la fois de la nature préservée et de la douceur de vivre antillaise :`,
          recommendations: {
            beaches: ['Anse Noire et Anse Dufour (Les Anses-d\'Arlet)', 'Les Salines (Sainte-Anne)'],
            activities: ['Ascension matinale de la Montagne Pelée', 'Sortie en bateau vers les îlets du Robert'],
            budgetEstimate: 'Comptez environ 80 € à 120 € par jour et par personne.'
          }
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 700);
  };

  const prompts = [
    '🐢 Où observer les tortues le matin sans foule ?',
    '👨‍👩‍👧 Séjour 10 jours en famille sans sargasses',
    '🌋 Conseils pour monter la Pelée par beau temps',
    '🍽️ Meilleurs restos créoles pieds dans le sable',
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-deep/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-4xl border border-lagon-border shadow-modal overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header with Caribbean Luxe identity */}
        <div className="p-5 sm:p-6 border-b border-lagon-border bg-gradient-to-r from-lagon-bg via-white to-sable-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-action to-deep flex items-center justify-center text-white shadow-soft shrink-0 border border-white/40">
              <Sparkles className="w-5 h-5 text-lagon-light" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-deep text-base sm:text-lg">
                  Ti-Bot — Conseiller Martinique
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En direct de l'île
                </span>
              </div>
              <p className="text-xs text-ink-muted">
                Recommandations locales en temps réel : plages abritées, faune, météo & budgets
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-white text-ink-muted hover:text-deep border border-lagon-border flex items-center justify-center transition-colors shadow-soft"
            aria-label="Fermer l'assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-lagon-bg/40">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-5 text-sm leading-relaxed shadow-soft ${
                  msg.sender === 'user'
                    ? 'bg-deep text-white rounded-tr-none'
                    : 'bg-white text-ink border border-lagon-border rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>

                {msg.recommendations && (
                  <div className="mt-4 pt-3 border-t border-lagon-border/70 space-y-3 text-xs">
                    {msg.recommendations.beaches && (
                      <div>
                        <strong className="text-deep block mb-1">Plages conseillées :</strong>
                        <ul className="list-disc list-inside space-y-1 text-ink-muted pl-1">
                          {msg.recommendations.beaches.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.recommendations.activities && (
                      <div>
                        <strong className="text-deep block mb-1">Expériences :</strong>
                        <ul className="list-disc list-inside space-y-1 text-ink-muted pl-1">
                          {msg.recommendations.activities.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.recommendations.budgetEstimate && (
                      <div className="p-3 rounded-xl bg-sand-light border border-sand-border text-deep font-medium">
                        {msg.recommendations.budgetEstimate}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="text-xs text-ink-muted pl-2 animate-pulse">
              Ti-Bot prépare vos conseils...
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3.5 bg-white border-t border-lagon-border flex flex-wrap gap-2">
          {prompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-lagon-bg/70 hover:bg-lagon-light/60 text-deep font-medium border border-lagon-border transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* User Input Bar */}
        <div className="p-4 bg-white border-t border-lagon-border flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question (ex: 'Où loger pour éviter les bouchons ?')"
            className="flex-1 px-4 py-2.5 text-sm bg-lagon-bg border border-lagon-border rounded-2xl focus:border-action focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="px-5 py-2.5 rounded-2xl bg-action hover:bg-action-hover disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-soft"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

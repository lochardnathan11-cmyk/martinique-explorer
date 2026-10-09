'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Check, MessageSquare, Search, CheckCircle2, HelpCircle, ChevronDown } from 'lucide-react';

export default function ForumSection() {
  const { forumTopics, addForumTopic } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Tourisme');
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  const categories = ['Tous', 'Tourisme', 'Restaurants', 'Activités', 'Retraite', 'Vie locale'];

  const filteredTopics = forumTopics.filter(t => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = t.title.toLowerCase().includes(q) || t.excerpt.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCat === 'Tous') return true;
    return t.category === selectedCat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addForumTopic(title, category as any, excerpt);
    setTitle('');
    setExcerpt('');
    setShowModal(false);
  };

  return (
    <section className="space-y-8 text-left">
      {/* Forum Header with Subtle Category Chips */}
      <div className="bg-white rounded-3xl border border-lagon-border p-8 sm:p-12 shadow-soft space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-semibold tracking-wider uppercase text-action">
              Entraide & Expériences
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-deep tracking-tight">
              Forum de la communauté
            </h1>
            <p className="text-sm text-ink-muted leading-relaxed">
              Échangez avec des résidents et des voyageurs réguliers : conseils d&apos;hébergement, vie quotidienne, installation en retraite et bonnes tables antillaises.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-5 py-3 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-soft flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Poser une question (+15 XP)</span>
          </button>
        </div>

        {/* Search Bar for Questions */}
        <div className="pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher une question ou un sujet (ex : enfants, retraite, budget, voiture)..."
              className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-lagon-border/70">
          {categories.map(c => {
            const isSelected = selectedCat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCat(c)}
                className={`px-4 py-2 rounded-2xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-deep text-white font-semibold shadow-soft'
                    : 'bg-lagon-bg text-ink border border-lagon-border hover:bg-lagon-light/50'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map(topic => (
            <article
              key={topic.id}
              className="bg-white rounded-3xl border border-lagon-border p-6 sm:p-8 shadow-soft hover:shadow-card transition-all duration-300 space-y-3 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-action bg-lagon-bg px-2.5 py-0.5 rounded-full border border-lagon-border">
                    {topic.category}
                  </span>
                  {topic.solved && (
                    <span className="text-[11px] font-medium text-action flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Résolu
                    </span>
                  )}
                </div>
                <span className="text-xs text-ink-muted">
                  {topic.createdAt}
                </span>
              </div>

              <h3 className="font-semibold text-deep text-lg group-hover:text-action transition-colors">
                {topic.title}
              </h3>

              <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                {topic.excerpt}
              </p>

              <div className="pt-3 border-t border-lagon-border/70 flex items-center justify-between text-xs text-ink-muted">
                <span>Initié par <strong className="text-deep font-medium">{topic.author.name}</strong></span>
                <span className="flex items-center gap-1.5 font-medium text-deep">
                  <MessageSquare className="w-3.5 h-3.5 text-action" />
                  {topic.repliesCount} réponses
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-lagon-border p-8 space-y-2">
            <p className="text-base text-deep font-semibold">Aucune discussion ne correspond à votre recherche</p>
            <p className="text-xs text-ink-muted">Soyez le premier à poser votre question à la communauté !</p>
          </div>
        )}
      </div>

      {/* Minimal New Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-deep/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 border border-lagon-border shadow-modal space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-deep">
                Poser une question à la communauté
              </h3>
              <p className="text-xs text-ink-muted mt-1">
                Les résidents locaux et voyageurs expérimentés vous répondront rapidement.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-deep mb-1.5">
                  Thématique
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                    className="w-full p-3 rounded-2xl bg-lagon-bg hover:bg-white border border-lagon-border hover:border-action text-ink text-sm font-medium flex items-center justify-between transition-all cursor-pointer shadow-xs"
                  >
                    <span>{category}</span>
                    <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${catDropdownOpen ? 'rotate-180 text-action' : ''}`} />
                  </button>

                  {catDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setCatDropdownOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-lagon-border p-1.5 z-50 animate-fadeIn space-y-1">
                        {categories.filter(c => c !== 'Tous').map(c => {
                          const isSelected = category === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setCategory(c);
                                setCatDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-lagon-bg text-action font-bold'
                                  : 'text-ink hover:bg-slate-50'
                              }`}
                            >
                              <span>{c}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-action shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-deep mb-1.5">
                  Titre de votre sujet
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex : Quel secteur privilégier avec des enfants en bas âge ?"
                  className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-deep mb-1.5">
                  Précisions
                </label>
                <textarea
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  rows={4}
                  placeholder="Donnez quelques détails sur votre projet de voyage ou de séjour..."
                  className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-lagon-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-action hover:bg-action-hover disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-soft"
                >
                  Publier la question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

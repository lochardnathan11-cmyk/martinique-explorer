'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Heart, MessageCircle, Share2, Plus, Image as ImageIcon, Tag, Check } from 'lucide-react';

export default function SocialFeed() {
  const { posts, addPost, likePost, currentUser, openModal } = useApp();
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('Les Anses-d\'Arlet');
  const [newPhoto, setNewPhoto] = useState('');
  const [newTag, setNewTag] = useState('#Plage');
  const [isPosting, setIsPosting] = useState(false);
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [activeTagFilter, setActiveTagFilter] = useState('all');

  const tagsList = ['all', '#Plage', '#Tortues', '#Snorkeling', '#Resto', '#Sargasses', '#BonPlan'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openModal('auth');
      return;
    }
    if (!newContent.trim()) return;

    addPost(newContent, newLocation, newPhoto.trim() || undefined, newTag);
    setNewContent('');
    setNewPhoto('');
    setShowPhotoInput(false);
    setIsPosting(false);
  };

  const handleStartPosting = () => {
    if (!currentUser) {
      openModal('auth');
      return;
    }
    setIsPosting(true);
  };

  const filteredPosts = posts.filter(p => {
    if (activeTagFilter === 'all') return true;
    return p.tags.some(t => t.toLowerCase() === activeTagFilter.toLowerCase());
  });

  return (
    <div className="space-y-8 text-left">
      {/* Editorial Input Area */}
      <div className="bg-white rounded-3xl border border-lagon-border p-6 sm:p-8 shadow-soft space-y-4">
        {!isPosting ? (
          <div
            onClick={handleStartPosting}
            className="flex items-center justify-between p-4 rounded-2xl bg-lagon-bg border border-lagon-border text-ink-muted text-sm cursor-pointer hover:border-action transition-colors"
          >
            <span>Partagez un bon plan, une observation météo ou une photo en direct...</span>
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                handleStartPosting();
              }}
              className="px-4 py-2 rounded-xl bg-action text-white text-xs font-medium hover:bg-action-hover transition-colors shrink-0 cursor-pointer"
            >
              Écrire
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="Décrivez votre trouvaille (ex: 'Observation de deux tortues à 8h du matin à Anse Dufour, eau limpide !')..."
              rows={3}
              className="w-full text-sm text-ink placeholder-ink-muted bg-lagon-bg rounded-2xl p-4 border border-lagon-border focus:border-action focus:bg-white focus:outline-none transition-colors resize-none"
            />

            {showPhotoInput && (
              <div className="space-y-1">
                <input
                  type="text"
                  value={newPhoto}
                  onChange={e => setNewPhoto(e.target.value)}
                  placeholder="Lien de la photo (URL https://...)"
                  className="w-full text-xs p-2.5 rounded-xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-lagon-border">
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                <div>
                  <span>Lieu : </span>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="bg-transparent border-b border-lagon-border text-ink text-xs py-1 focus:border-action focus:outline-none font-medium max-w-[130px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowPhotoInput(!showPhotoInput)}
                  className="text-xs text-action hover:underline flex items-center gap-1 font-medium"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{showPhotoInput ? 'Masquer photo' : 'Ajouter une photo'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="px-4 py-2 rounded-xl text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="px-5 py-2.5 rounded-xl bg-action hover:bg-action-hover disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-soft"
                >
                  Publier sur le mur
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter tags bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-lagon-border/70 text-xs">
          <span className="text-ink-muted text-[11px] font-semibold mr-1">Filtrer par thème :</span>
          {tagsList.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTagFilter(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTagFilter === tag
                  ? 'bg-deep text-white font-semibold shadow-soft'
                  : 'bg-lagon-bg text-ink border border-lagon-border hover:bg-lagon-light/50'
              }`}
            >
              {tag === 'all' ? 'Toutes' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Publications Stream */}
      <div className="space-y-6">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            className="bg-white rounded-3xl border border-lagon-border p-6 sm:p-8 shadow-soft space-y-5"
          >
            {/* Author Line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={post.author.avatar}
                  alt={`Photo de profil de ${post.author.name}`}
                  className="w-11 h-11 rounded-full object-cover border border-lagon-border"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-deep text-sm">
                      {post.author.name}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-sand-light text-deep font-medium border border-sand-border">
                      {post.author.badge}
                    </span>
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5">
                    {post.timestamp} {post.location && `• ${post.location}`}
                  </div>
                </div>
              </div>

              {post.tags[0] && (
                <span className="text-xs font-medium text-action bg-lagon-bg px-2.5 py-1 rounded-full border border-lagon-border">
                  {post.tags[0]}
                </span>
              )}
            </div>

            {/* Post Content */}
            <p className="text-ink text-sm sm:text-base leading-relaxed">
              {post.content}
            </p>

            {/* Optional Attached Photography */}
            {post.photos && post.photos.length > 0 && (
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-lagon-bg shadow-soft">
                <img
                  src={post.photos[0]}
                  alt="Photographie partagée par un membre"
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Quiet Interaction Row */}
            <div className="pt-3 border-t border-lagon-border/70 flex items-center justify-between text-xs text-ink-muted">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-coral transition-colors group font-medium"
                >
                  <Heart className="w-4 h-4 transition-colors group-hover:text-coral" />
                  <span>{post.likes}</span> J&apos;aime
                </button>

                <div className="flex items-center gap-1.5 hover:text-action transition-colors cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount} commentaires</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('Lien copié dans le presse-papier !')}
                className="hover:text-deep transition-colors"
              >
                Partager
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

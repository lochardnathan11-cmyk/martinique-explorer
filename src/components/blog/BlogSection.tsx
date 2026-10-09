'use client';

import React from 'react';
import { INITIAL_BLOG_POSTS } from '@/data/mockData';
import { BlogPost } from '@/types';
import { ArrowRight } from 'lucide-react';

interface BlogSectionProps {
  onOpenArticle?: (post: BlogPost) => void;
}

export default function BlogSection({ onOpenArticle }: BlogSectionProps) {
  return (
    <section className="space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2 max-w-xl text-left">
        <span className="text-xs font-semibold tracking-wider uppercase text-action">
          Guides & Récits
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold text-deep tracking-tight">
          Carnets d&apos;inspiration martiniquais
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed">
          Articles rédigés par des connaisseurs de l&apos;île pour apprécier la nature, la faune marine et le patrimoine antillais.
        </p>
      </div>

      {/* Grid of 3 Editorial Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INITIAL_BLOG_POSTS.map(post => (
          <article
            key={post.id}
            onClick={() => onOpenArticle && onOpenArticle(post)}
            className="group bg-white rounded-3xl border border-lagon-border overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col cursor-pointer text-left"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-lagon-bg">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-deep text-xs font-medium backdrop-blur-sm shadow-soft">
                {post.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs text-ink-muted">
                  {post.readTime} • {post.date}
                </div>
                <h3 className="font-semibold text-deep text-lg leading-snug group-hover:text-action transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-ink-muted line-clamp-3 leading-relaxed pt-1">
                  {post.summary}
                </p>
              </div>

              <div className="pt-2 text-xs font-medium text-action flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Lire le guide complet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

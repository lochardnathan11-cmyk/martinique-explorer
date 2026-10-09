'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  BarChart3,
  Plus,
  Trash2,
  Edit3,
  Check,
  ShieldCheck,
  Sun,
  Waves,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  DollarSign,
  TrendingUp,
  X,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { PlaceCategory, PlaceItem, SargassumLevel } from '@/types';

export default function AdminDashboard() {
  const { places, addPlace, updatePlace, deletePlace, alerts, deleteAlert, verifyAlert, posts, deletePost } = useApp();
  const [activeTab, setActiveTab] = useState<'kpi' | 'content' | 'weather' | 'moderation' | 'monetization' | 'users'>('kpi');

  // Search & Filters in Content List
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Editing state
  const [editingPlace, setEditingPlace] = useState<PlaceItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form state for new place
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<PlaceCategory>('beach');
  const [newSubCategory, setNewSubCategory] = useState('Baignade & Famille');
  const [newCommune, setNewCommune] = useState('Sainte-Anne');
  const [newDescription, setNewDescription] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newParking, setNewParking] = useState<'Facile et gratuit' | 'Payant' | 'Limité' | 'Difficile'>('Facile et gratuit');
  const [newCrowd, setNewCrowd] = useState<'Faible' | 'Modérée' | 'Forte'>('Modérée');
  const [newIsVerifiedPro, setNewIsVerifiedPro] = useState(false);
  const [newSargassum, setNewSargassum] = useState<SargassumLevel>('none');

  // Live island weather quick update state
  const [globalTempAir, setGlobalTempAir] = useState(29);
  const [globalTempWater, setGlobalTempWater] = useState(28);
  const [globalSeaState, setGlobalSeaState] = useState<'Calme' | 'Peu agitée' | 'Agitée' | 'Forte houle'>('Calme');
  const [globalSargassumText, setGlobalSargassumText] = useState('Côte Sud Caraïbe 100% propre et limpide');

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCreatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDescription.trim()) return;

    addPlace({
      name: newName,
      category: newCategory,
      subCategory: newSubCategory,
      commune: newCommune,
      description: newDescription,
      coords: [14.45, -60.9],
      photos: [
        newPhotoUrl.trim() ||
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      ],
      rating: 5.0,
      reviewsCount: 1,
      parking: newParking,
      crowdLevel: newCrowd,
      isVerifiedPro: newIsVerifiedPro,
      realTime: {
        weather: 'Ensoleillé',
        tempAir: globalTempAir,
        tempWater: globalTempWater,
        windSpeed: 12,
        uvIndex: 8,
        seaState: globalSeaState,
        sargassum: newSargassum,
        lastUpdate: 'À l\'instant',
      },
    });

    setNewName('');
    setNewDescription('');
    setNewPhotoUrl('');
    setShowAddModal(false);
    triggerToast('Nouveau lieu publié avec succès !');
  };

  const handleUpdatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlace) return;

    updatePlace(editingPlace.id, editingPlace);
    setEditingPlace(null);
    triggerToast(`Fiche "${editingPlace.name}" mise à jour !`);
  };

  // Filtered places list
  const filteredPlaces = places.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch =
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.commune.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="bg-white rounded-3xl border border-lagon-border shadow-soft overflow-hidden text-left">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-deep text-white px-5 py-3 rounded-2xl shadow-modal border border-lagon-border flex items-center gap-3 animate-fadeIn pointer-events-auto">
          <CheckCircle2 className="w-5 h-5 text-lagon-light shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Top Header - Welcoming and reassuring for his father */}
      <div className="p-8 sm:p-10 border-b border-lagon-border bg-gradient-to-r from-lagon-bg via-white to-sand-light flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-light border border-sand-border text-xs text-deep font-semibold">
            <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
            <span>Mode Zéro Code • Tout est géré facilement en un clic</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-deep tracking-tight">
            Bonjour Papa 👋 — Espace Gestion Martinique Explorer
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
            Pilotez tout le site sans toucher au code : ajoutez des plages, modifiez les restaurants, actualisez la météo des sargasses et suivez les visites.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-soft flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une nouvelle fiche</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-lagon-bg border-b border-lagon-border px-6 sm:px-8 py-3 flex gap-2 overflow-x-auto">
        {[
          { id: 'kpi', label: '📊 Tableau de Bord & Revenus' },
          { id: 'content', label: `🏖️ Lieux & Fiches (${places.length})` },
          { id: 'weather', label: '☀️ Météo & Sargasses en Direct' },
          { id: 'moderation', label: `🚨 Modération & Alertes (${alerts.length})` },
          { id: 'monetization', label: '💼 Pros & Affiliation' },
          { id: 'users', label: '👥 Membres & Sécurité' },
        ].map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-deep text-white font-semibold shadow-soft'
                  : 'text-ink-muted hover:text-deep hover:bg-white/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================
          ONGLET 1 : TABLEAU DE BORD & KPIS
          ======================================================== */}
      {activeTab === 'kpi' && (
        <div className="p-8 sm:p-10 space-y-10">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-lagon-bg border border-lagon-border space-y-2">
              <div className="flex items-center justify-between text-ink-muted">
                <span className="text-xs font-medium">Visiteurs ce mois</span>
                <Users className="w-4 h-4 text-action" />
              </div>
              <div className="text-3xl font-semibold text-deep">48 920</div>
              <span className="text-xs text-action font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +28% par rapport au mois passé
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-sand-light border border-sand-border space-y-2">
              <div className="flex items-center justify-between text-ink-muted">
                <span className="text-xs font-medium">Pages consultées</span>
                <Eye className="w-4 h-4 text-deep" />
              </div>
              <div className="text-3xl font-semibold text-deep">164 450</div>
              <span className="text-xs text-ink-muted">Moyenne de 3.4 pages par visiteur</span>
            </div>

            <div className="p-6 rounded-3xl bg-lagon-bg border border-lagon-border space-y-2">
              <div className="flex items-center justify-between text-ink-muted">
                <span className="text-xs font-medium">Revenus estimés</span>
                <DollarSign className="w-4 h-4 text-action" />
              </div>
              <div className="text-3xl font-semibold text-deep">1 420 €</div>
              <span className="text-xs text-action font-medium">Commissions Booking & Voitures</span>
            </div>

            <div className="p-6 rounded-3xl bg-sand-light border border-sand-border space-y-2">
              <div className="flex items-center justify-between text-ink-muted">
                <span className="text-xs font-medium">Membres inscrits</span>
                <ShieldCheck className="w-4 h-4 text-coral" />
              </div>
              <div className="text-3xl font-semibold text-deep">3 840</div>
              <span className="text-xs text-ink-muted">Communauté active sur l&apos;île</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-lagon-border space-y-4 shadow-soft">
            <h3 className="text-base font-semibold text-deep">
              Que souhaitez-vous faire aujourd&apos;hui ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="p-4 rounded-2xl bg-lagon-bg hover:bg-lagon-light/50 border border-lagon-border text-deep font-semibold text-left transition-colors flex items-center justify-between"
              >
                <span>➕ Ajouter une plage ou un restaurant</span>
                <span className="text-action">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('weather')}
                className="p-4 rounded-2xl bg-sand-light hover:bg-sand-border border border-sand-border text-deep font-semibold text-left transition-colors flex items-center justify-between"
              >
                <span>☀️ Mettre à jour la météo des sargasses</span>
                <span className="text-coral">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('moderation')}
                className="p-4 rounded-2xl bg-lagon-bg hover:bg-lagon-light/50 border border-lagon-border text-deep font-semibold text-left transition-colors flex items-center justify-between"
              >
                <span>🚨 Valider les signalements membres ({alerts.length})</span>
                <span className="text-action">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Top consulted places */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-lagon-border space-y-4">
            <h3 className="text-base font-semibold text-deep">
              Fiches les plus consultées cette semaine
            </h3>
            <div className="divide-y divide-lagon-border text-xs text-ink">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-deep font-semibold text-sm">Plage des Salines</strong>
                  <span className="text-ink-muted block">Sainte-Anne • Plage baignade</span>
                </div>
                <div className="text-right">
                  <strong className="text-deep font-semibold">12 400 vues</strong>
                  <span className="text-action text-[11px] block">★ 4.8 / 5</span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-deep font-semibold text-sm">Anse Dufour (Tortues marines)</strong>
                  <span className="text-ink-muted block">Les Anses-d&apos;Arlet • Snorkeling</span>
                </div>
                <div className="text-right">
                  <strong className="text-deep font-semibold">10 150 vues</strong>
                  <span className="text-action text-[11px] block">★ 4.9 / 5</span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-deep font-semibold text-sm">Excursion Baignoire de Joséphine</strong>
                  <span className="text-ink-muted block">Le François • Catamaran & fonds blancs</span>
                </div>
                <div className="text-right">
                  <strong className="text-deep font-semibold">7 820 vues</strong>
                  <span className="text-action text-[11px] block">★ 4.9 / 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ONGLET 2 : GESTION DES FICHES & LIEUX
          ======================================================== */}
      {activeTab === 'content' && (
        <div className="p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-deep">
                Toutes les fiches du site ({filteredPlaces.length})
              </h3>
              <p className="text-xs text-ink-muted">
                Modifiez facilement les photos, textes, avis et conditions de chaque endroit.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-action hover:bg-action-hover text-white text-xs font-medium transition-colors shadow-soft flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une fiche</span>
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Rechercher par nom ou commune (ex: Diamant, Salines)..."
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs px-4 py-2.5 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
            >
              <option value="all">Toutes les catégories</option>
              <option value="beach">Plages</option>
              <option value="snorkeling">Snorkeling</option>
              <option value="activity">Activités & Rando</option>
              <option value="restaurant">Restaurants</option>
              <option value="accommodation">Hébergements</option>
              <option value="event">Événements</option>
            </select>
          </div>

          {/* Table / Cards of places */}
          <div className="divide-y divide-lagon-border border border-lagon-border rounded-3xl overflow-hidden bg-white text-xs">
            {filteredPlaces.map(place => (
              <div
                key={place.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-lagon-bg/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-lagon-bg shrink-0">
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-deep text-sm">{place.name}</h4>
                      {place.isVerifiedPro && (
                        <span className="px-2 py-0.5 rounded-full bg-sand-light text-deep text-[10px] font-semibold border border-sand-border">
                          Pro Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-ink-muted">
                      {place.commune} • <span className="capitalize">{place.subCategory || place.category}</span>
                    </p>
                    {place.realTime && (
                      <span className="text-[11px] text-action font-medium">
                        {place.realTime.sargassum === 'none' ? '🟢 Eau propre' : '🟡 Algues signalées'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setEditingPlace(place)}
                    className="px-3.5 py-1.5 rounded-xl border border-lagon-border hover:border-action text-deep font-medium bg-white hover:bg-lagon-bg transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-action" />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Êtes-vous certain de vouloir supprimer "${place.name}" ?`)) {
                        deletePlace(place.id);
                        triggerToast(`"${place.name}" a été supprimé.`);
                      }
                    }}
                    className="p-2 rounded-xl text-ink-muted hover:text-coral hover:bg-coral-soft transition-colors"
                    title="Supprimer la fiche"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          ONGLET 3 : MÉTÉO & SARGASSES EN DIRECT
          ======================================================== */}
      {activeTab === 'weather' && (
        <div className="p-8 sm:p-10 space-y-8 max-w-3xl">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-deep">
              Mise à jour de la météo et des sargasses
            </h3>
            <p className="text-xs text-ink-muted">
              Ce que vous modifiez ici apparaît immédiatement sur le bandeau en haut de tout le site pour rassurer les touristes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-lagon-bg border border-lagon-border space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-deep mb-1">
                  Température de l&apos;air (°C)
                </label>
                <input
                  type="number"
                  value={globalTempAir}
                  onChange={e => setGlobalTempAir(Number(e.target.value))}
                  className="w-full text-sm p-3 rounded-2xl bg-white border border-lagon-border text-ink focus:border-action focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-deep mb-1">
                  Température de l&apos;eau (°C)
                </label>
                <input
                  type="number"
                  value={globalTempWater}
                  onChange={e => setGlobalTempWater(Number(e.target.value))}
                  className="w-full text-sm p-3 rounded-2xl bg-white border border-lagon-border text-ink focus:border-action focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep mb-1">
                État général de la mer
              </label>
              <select
                value={globalSeaState}
                onChange={e => setGlobalSeaState(e.target.value as any)}
                className="w-full text-sm p-3 rounded-2xl bg-white border border-lagon-border text-ink focus:border-action focus:outline-none"
              >
                <option value="Calme">Calme (Mer d&apos;huile)</option>
                <option value="Peu agitée">Peu agitée (Baignade idéale)</option>
                <option value="Agitée">Agitée (Attention aux rouleaux)</option>
                <option value="Forte houle">Forte houle (Prudence recommandée)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep mb-1">
                Bulletin Sargasses du jour
              </label>
              <input
                type="text"
                value={globalSargassumText}
                onChange={e => setGlobalSargassumText(e.target.value)}
                placeholder="Ex : Côte Caraïbe 100% limpide, aucune sargasse signalée"
                className="w-full text-sm p-3 rounded-2xl bg-white border border-lagon-border text-ink focus:border-action focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Météo générale de l\'île actualisée en direct !')}
              className="px-6 py-3 rounded-2xl bg-action hover:bg-action-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-soft"
            >
              Enregistrer et diffuser sur le site
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ONGLET 4 : MODÉRATION & SÉCURITÉ
          ======================================================== */}
      {activeTab === 'moderation' && (
        <div className="p-8 sm:p-10 space-y-8">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-deep">
              Modération des signalements et publications
            </h3>
            <p className="text-xs text-ink-muted">
              Validez les observations transmises par les membres pour qu&apos;elles soient certifiées sur la carte.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Alertes en attente de vérification ({alerts.length})
            </h4>

            {alerts.length === 0 ? (
              <p className="text-xs text-ink-muted">Aucun signalement en attente actuellement.</p>
            ) : (
              alerts.map(a => (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl border border-lagon-border bg-lagon-bg/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-deep text-sm">{a.title}</span>
                      {a.verified ? (
                        <span className="px-2 py-0.5 rounded-full bg-sand-light text-deep font-semibold text-[10px]">
                          Vérifié
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-coral-soft text-coral font-semibold text-[10px]">
                          À valider
                        </span>
                      )}
                    </div>
                    <p className="text-ink-muted">
                      {a.location} ({a.commune}) • Signalé par <strong>{a.reportedBy}</strong> ({a.timestamp})
                    </p>
                    <p className="text-ink pt-1">{a.description}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!a.verified && (
                      <button
                        type="button"
                        onClick={() => {
                          verifyAlert(a.id);
                          triggerToast('Alerte validée et certifiée !');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-action hover:bg-action-hover text-white font-medium"
                      >
                        Valider l&apos;alerte
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        deleteAlert(a.id);
                        triggerToast('Alerte supprimée.');
                      }}
                      className="p-2 rounded-xl text-ink-muted hover:text-coral"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          ONGLET 5 : PROS & MONÉTISATION
          ======================================================== */}
      {activeTab === 'monetization' && (
        <div className="p-8 sm:p-10 space-y-8 max-w-3xl">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-deep">
              Partenaires Professionnels & Monétisation
            </h3>
            <p className="text-xs text-ink-muted">
              Gérez les badges professionnels vérifiés et les commissions d&apos;affiliation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-sand-light border border-sand-border space-y-1">
              <span className="text-ink-muted font-medium">Booking.com</span>
              <div className="text-xl font-semibold text-deep">840 €</div>
              <span className="text-action">42 réservations</span>
            </div>

            <div className="p-5 rounded-2xl bg-lagon-bg border border-lagon-border space-y-1">
              <span className="text-ink-muted font-medium">RentalCars</span>
              <div className="text-xl font-semibold text-deep">390 €</div>
              <span className="text-action">18 locations de voiture</span>
            </div>

            <div className="p-5 rounded-2xl bg-sand-light border border-sand-border space-y-1">
              <span className="text-ink-muted font-medium">Sorties Catamaran</span>
              <div className="text-xl font-semibold text-deep">190 €</div>
              <span className="text-action">9 réservations</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-lagon-border space-y-3">
            <h4 className="font-semibold text-deep text-sm">
              Attribution du Badge Professionnel Vérifié ✅
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Pour accorder le badge vérifié à un restaurant ou hôtel partenaire, ouvrez sa fiche dans l&apos;onglet <strong>Lieux & Fiches</strong> et activez l&apos;option &ldquo;Partenaire Vérifié&rdquo;.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          ONGLET 6 : MEMBRES & SÉCURITÉ
          ======================================================== */}
      {activeTab === 'users' && (
        <div className="p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-deep">
              Membres & Rôles
            </h3>
            <p className="text-xs text-ink-muted">
              Consultez les inscrits et gérez les permissions en toute simplicité.
            </p>
          </div>

          <div className="divide-y divide-lagon-border border border-lagon-border rounded-3xl overflow-hidden bg-white text-xs">
            {[
              { name: 'Papa Administrateur', email: 'papa@martinique-explorer.com', role: 'Administrateur Général', status: 'Actif' },
              { name: 'Yannick B.', email: 'yannick.local@martinique.com', role: 'Modérateur / Guide Local', status: 'Actif' },
              { name: 'Aurélie Martin', email: 'aurelie.martin@gmail.com', role: 'Membre Voyageur', status: 'Actif' },
              { name: 'Chloé & Thomas', email: 'chloe.thomas@voyage.fr', role: 'Membre Voyageur', status: 'Actif' },
            ].map((u, i) => (
              <div key={i} className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-deep text-sm">{u.name}</h4>
                  <span className="text-ink-muted">{u.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-lagon-bg text-deep font-semibold text-[11px] border border-lagon-border">
                    {u.role}
                  </span>
                  <span className="text-ink-muted hidden sm:inline">{u.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL D'ÉDITION D'UNE FICHE EXISTANTE
          ======================================================== */}
      {editingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-deep/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-4xl border border-lagon-border shadow-modal overflow-hidden p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-action">
                  Modification de fiche
                </span>
                <h3 className="text-2xl font-semibold text-deep">
                  Modifier {editingPlace.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlace(null)}
                className="w-9 h-9 rounded-full bg-lagon-bg text-ink-muted hover:text-deep flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePlace} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-deep mb-1">Nom du lieu</label>
                <input
                  type="text"
                  value={editingPlace.name}
                  onChange={e => setEditingPlace({ ...editingPlace, name: e.target.value })}
                  className="w-full text-sm p-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-deep mb-1">Commune</label>
                  <input
                    type="text"
                    value={editingPlace.commune}
                    onChange={e => setEditingPlace({ ...editingPlace, commune: e.target.value })}
                    className="w-full text-sm p-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-deep mb-1">Sous-titre / Spécificité</label>
                  <input
                    type="text"
                    value={editingPlace.subCategory || ''}
                    onChange={e => setEditingPlace({ ...editingPlace, subCategory: e.target.value })}
                    className="w-full text-sm p-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-deep mb-1">Description</label>
                <textarea
                  value={editingPlace.description}
                  onChange={e => setEditingPlace({ ...editingPlace, description: e.target.value })}
                  rows={4}
                  className="w-full text-sm p-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-deep mb-1">Photo (URL)</label>
                <input
                  type="text"
                  value={editingPlace.photos[0] || ''}
                  onChange={e => setEditingPlace({ ...editingPlace, photos: [e.target.value] })}
                  className="w-full text-sm p-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="pro-edit"
                  checked={editingPlace.isVerifiedPro || false}
                  onChange={e => setEditingPlace({ ...editingPlace, isVerifiedPro: e.target.checked })}
                  className="w-4 h-4 rounded text-action"
                />
                <label htmlFor="pro-edit" className="font-semibold text-deep cursor-pointer">
                  Badge Partenaire Vérifié ✅
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-lagon-border">
                <button
                  type="button"
                  onClick={() => setEditingPlace(null)}
                  className="px-4 py-2.5 rounded-xl text-ink-muted hover:text-ink"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-action hover:bg-action-hover text-white font-medium shadow-soft"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE CRÉATION D'UNE NOUVELLE FICHE
          ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-deep/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-4xl border border-lagon-border shadow-modal overflow-hidden p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-action">
                  Nouvelle fiche
                </span>
                <h3 className="text-2xl font-semibold text-deep">
                  Ajouter un lieu en Martinique
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-9 h-9 rounded-full bg-lagon-bg text-ink-muted hover:text-deep flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlace} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-deep mb-1">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full text-sm p-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
                  >
                    <option value="beach">Plage</option>
                    <option value="snorkeling">Snorkeling</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="activity">Activité / Randonnée</option>
                    <option value="accommodation">Hébergement</option>
                    <option value="event">Événement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-deep mb-1">Commune</label>
                  <select
                    value={newCommune}
                    onChange={e => setNewCommune(e.target.value)}
                    className="w-full text-sm p-3 rounded-2xl bg-lagon-bg border border-lagon-border text-ink focus:border-action focus:outline-none"
                  >
                    <option value="Sainte-Anne">Sainte-Anne</option>
                    <option value="Les Anses-d'Arlet">Les Anses-d&apos;Arlet</option>
                    <option value="Le Diamant">Le Diamant</option>
                    <option value="Les Trois-Îlets">Les Trois-Îlets</option>
                    <option value="Le François">Le François</option>
                    <option value="Saint-Pierre">Saint-Pierre</option>
                    <option value="Fort-de-France">Fort-de-France</option>
                    <option value="Le Prêcheur">Le Prêcheur</option>
                    <option value="Sainte-Luce">Sainte-Luce</option>
                    <option value="Le Vauclin">Le Vauclin</option>
                    <option value="Tartane">Tartane / La Caravelle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-deep mb-1">Nom du lieu</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ex : Plage de Pointe Marin"
                  className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-deep mb-1">Sous-titre / Caractéristique</label>
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={e => setNewSubCategory(e.target.value)}
                  placeholder="Ex : Eaux calmes façon lagon & ombragée"
                  className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-deep mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Présentez l'endroit, l'ambiance et les accès..."
                  rows={4}
                  className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-deep mb-1">Photo (URL de l&apos;image)</label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={e => setNewPhotoUrl(e.target.value)}
                  placeholder="https://... (laisser vide pour photo automatique)"
                  className="w-full text-sm p-3 rounded-2xl border border-lagon-border text-ink focus:border-action focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="pro-new"
                  checked={newIsVerifiedPro}
                  onChange={e => setNewIsVerifiedPro(e.target.checked)}
                  className="w-4 h-4 rounded text-action"
                />
                <label htmlFor="pro-new" className="font-semibold text-deep cursor-pointer">
                  Attribuer le badge Partenaire Vérifié ✅
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-lagon-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-ink-muted hover:text-ink"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-action hover:bg-action-hover text-white font-medium shadow-soft"
                >
                  Publier la fiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

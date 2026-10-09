'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PlaceItem, PlaceCategory, CommunityAlert } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Compass,
  Star,
  ExternalLink,
  Navigation,
  Heart,
  Share2,
  Check,
  X,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Layers,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface InteractiveMartiniqueMapProps {
  places: PlaceItem[];
  alerts?: CommunityAlert[];
  onSelectPlace: (place: PlaceItem) => void;
  selectedCategory?: string | null;
  fullscreenMode?: boolean;
}

// Simplified, elegant category groupings to keep legend uncluttered & beautiful
const PRIMARY_FILTERS = [
  { id: 'all', label: 'Tous', icon: '📍', color: '#073B4C' },
  { id: 'beach', label: 'Plages', icon: '🏖️', color: '#0284C7' },
  { id: 'restaurant', label: 'Restos', icon: '🍽️', color: '#EA580C' },
  { id: 'hiking', label: 'Randos', icon: '🥾', color: '#059669' },
  { id: 'accommodation', label: 'Hôtels', icon: '🏨', color: '#2563EB' },
  { id: 'activity', label: 'Activités', icon: '🏄', color: '#0891B2' },
  { id: 'hidden_gem', label: 'Secrets', icon: '💎', color: '#DB2777' },
];

// Distance calculation (Haversine formula in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function InteractiveMartiniqueMap({
  places,
  onSelectPlace,
  selectedCategory,
  fullscreenMode = false
}: InteractiveMartiniqueMapProps) {
  const { favorites, toggleFavorite } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);

  const [activeFilter, setActiveFilter] = useState<string>(selectedCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showThematics, setShowThematics] = useState(false);
  const [activeThematic, setActiveThematic] = useState<string | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

  // Prebuilt itineraries according to spec
  const prebuiltRoutes = [
    {
      id: 'sud',
      title: 'Journée Sud Caraïbe',
      desc: 'Salines, Anse Dufour, Ti Sable',
      stopIds: ['salines', 'anse-dufour', 'ti-sable'],
    },
    {
      id: 'nord',
      title: 'Journée Nord & Pelée',
      desc: 'Montagne Pelée, Anse Couleuvre, Le Petibonum',
      stopIds: ['montagne-pelee', 'anse-couleuvre', 'petibonum'],
    },
    {
      id: 'secrets',
      title: 'Trésors Secrets 💎',
      desc: 'Anse Trabaud, Cap 110, Ponton Anses d\'Arlet',
      stopIds: ['secret-anse-trabaud', 'spot-memorial-cap110', 'spot-ponton-anses-arlet'],
    }
  ];

  // 1. Initialize Leaflet Map with CartoDB Voyager by default
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Martinique center coordinates
      const map = L.map(mapContainerRef.current, {
        center: [14.6415, -61.0242],
        zoom: 10,
        minZoom: 9,
        maxZoom: 18,
        zoomControl: false, // NO ugly default leaflet zoom controls
        attributionControl: false
      });

      // Satellite HD: Esri World Imagery exclusively
      const tiles = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution: '&copy; Esri &copy; Earthstar Geographics'
        }
      ).addTo(map);

      tileLayerRef.current = tiles;

      const markersLayer = L.layerGroup().addTo(map);
      const routeLayer = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = markersLayer;
      routeLayerRef.current = routeLayer;

      // Invalidate size after layout stabilization
      setTimeout(() => {
        map.invalidateSize();
      }, 250);

      renderMarkers(places, activeFilter, activeThematic, searchQuery, userLocation);
    });

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);



  // 2. Filter places cleanly
  const getFilteredPlaces = () => {
    return places.filter((p) => {
      // Primary category groupings
      if (activeFilter === 'beach') {
        if (p.category !== 'beach' && p.category !== 'snorkeling') return false;
      } else if (activeFilter === 'restaurant') {
        if (p.category !== 'restaurant' && p.category !== 'bar') return false;
      } else if (activeFilter === 'hiking') {
        if (p.category !== 'hiking' && p.category !== 'viewpoint') return false;
      } else if (activeFilter === 'accommodation') {
        if (p.category !== 'accommodation') return false;
      } else if (activeFilter === 'activity') {
        if (p.category !== 'activity' && p.category !== 'excursion') return false;
      } else if (activeFilter === 'hidden_gem') {
        if (!p.isHiddenGem && p.category !== 'hidden_gem') return false;
      }

      // Thematics
      if (activeThematic === 'secret' && !p.isHiddenGem && !p.tags?.includes('Spot Secret')) return false;
      if (activeThematic === 'sunset' && !p.tags?.includes('Coucher de soleil') && !p.badges?.includes('🌅 Plus beau coucher de soleil')) return false;
      if (activeThematic === 'turtles' && p.category !== 'snorkeling' && !p.tags?.includes('Tortues marines')) return false;
      if (activeThematic === 'favorites' && !favorites.includes(p.id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCommune = p.commune.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchCommune && !matchDesc && !matchTags) return false;
      }

      return true;
    });
  };

  // 3. Render Leaflet Markers with sleek modern pins
  const renderMarkers = async (
    allPlaces: PlaceItem[],
    filterId: string,
    thematicId: string | null,
    query: string,
    userPos: [number, number] | null
  ) => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const L = await import('leaflet');
    markersLayerRef.current.clearLayers();

    const filtered = allPlaces.filter((p) => {
      if (filterId === 'beach') {
        if (p.category !== 'beach' && p.category !== 'snorkeling') return false;
      } else if (filterId === 'restaurant') {
        if (p.category !== 'restaurant' && p.category !== 'bar') return false;
      } else if (filterId === 'hiking') {
        if (p.category !== 'hiking' && p.category !== 'viewpoint') return false;
      } else if (filterId === 'accommodation') {
        if (p.category !== 'accommodation') return false;
      } else if (filterId === 'activity') {
        if (p.category !== 'activity' && p.category !== 'excursion') return false;
      } else if (filterId === 'hidden_gem') {
        if (!p.isHiddenGem && p.category !== 'hidden_gem') return false;
      }

      if (thematicId === 'secret' && !p.isHiddenGem && !p.tags?.includes('Spot Secret')) return false;
      if (thematicId === 'sunset' && !p.tags?.includes('Coucher de soleil') && !p.badges?.includes('🌅 Plus beau coucher de soleil')) return false;
      if (thematicId === 'turtles' && p.category !== 'snorkeling' && !p.tags?.includes('Tortues marines')) return false;
      if (thematicId === 'favorites' && !favorites.includes(p.id)) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCommune = p.commune.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchCommune && !matchDesc) return false;
      }
      return true;
    });

    filtered.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const isHidden = place.isHiddenGem || place.category === 'hidden_gem';

      // Pin Color definition
      let pinColor = '#073B4C';
      let pinIcon = '📍';

      if (isHidden) {
        pinColor = '#DB2777';
        pinIcon = '💎';
      } else if (place.category === 'beach' || place.category === 'snorkeling') {
        pinColor = '#0284C7';
        pinIcon = place.category === 'snorkeling' ? '🤿' : '🏖️';
      } else if (place.category === 'restaurant' || place.category === 'bar') {
        pinColor = '#EA580C';
        pinIcon = place.category === 'bar' ? '🍸' : '🍽️';
      } else if (place.category === 'hiking' || place.category === 'viewpoint') {
        pinColor = '#059669';
        pinIcon = place.category === 'hiking' ? '🥾' : '🌄';
      } else if (place.category === 'accommodation') {
        pinColor = '#2563EB';
        pinIcon = '🏨';
      } else if (place.category === 'activity' || place.category === 'excursion') {
        pinColor = '#0891B2';
        pinIcon = place.category === 'excursion' ? '⛵' : '🏄';
      }

      // Exact SVG Teardrop Pin where tip is mathematically anchored at (pinWidth/2, pinHeight)
      const pinWidth = isSelected ? 34 : 28;
      const pinHeight = isSelected ? 42 : 36;
      const anchorX = pinWidth / 2;
      const anchorY = pinHeight;
      const fontSize = isSelected ? 15 : 12;

      const pinHtml = `
        <div style="width: ${pinWidth}px; height: ${pinHeight}px; cursor: pointer; transition: transform 0.15s ease;" class="hover:scale-110">
          <svg width="${pinWidth}" height="${pinHeight}" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
            <path d="M14 36C14 36 28 22.5 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 22.5 14 36 14 36Z" fill="${pinColor}"/>
            <circle cx="14" cy="14" r="11" fill="white"/>
            <text x="14" y="19" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${pinIcon}</text>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'martinique-fixed-pin',
        html: pinHtml,
        iconSize: [pinWidth, pinHeight],
        iconAnchor: [anchorX, anchorY],
        popupAnchor: [0, -anchorY]
      });

      const marker = L.marker(place.coords, { icon: customIcon });

      marker.on('click', () => {
        setSelectedPlace(place);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(place.coords, { animate: true, duration: 0.6 });
        }
      });

      markersLayerRef.current.addLayer(marker);
    });

    // If user position exists, draw clean pulsing user marker
    if (userPos) {
      const userPinHtml = `
        <div style="width: 20px; height: 20px;">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
            <circle cx="10" cy="10" r="9" fill="#2563EB" stroke="white" stroke-width="2.5"/>
            <circle cx="10" cy="10" r="4" fill="white"/>
          </svg>
        </div>
      `;
      const userIcon = L.divIcon({
        className: 'martinique-user-pin',
        html: userPinHtml,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      const userMarker = L.marker(userPos, { icon: userIcon });
      markersLayerRef.current.addLayer(userMarker);
    }
  };

  // Re-render markers when filter, query or location changes
  useEffect(() => {
    renderMarkers(places, activeFilter, activeThematic, searchQuery, userLocation);
  }, [activeFilter, activeThematic, searchQuery, userLocation, selectedPlace, favorites]);

  // Geolocation "Autour de moi"
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        setIsLocating(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(coords, 12, { animate: true });
        }
      },
      () => {
        // Fallback Fort-de-France for demo
        setIsLocating(false);
        const fallback: [number, number] = [14.6037, -61.0677];
        setUserLocation(fallback);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(fallback, 12, { animate: true });
        }
      },
      { timeout: 7000 }
    );
  };

  // Prebuilt route polyline
  const handleSelectRoute = async (routeId: string) => {
    if (activeRouteId === routeId) {
      setActiveRouteId(null);
      if (routeLayerRef.current) routeLayerRef.current.clearLayers();
      return;
    }

    const L = await import('leaflet');
    setActiveRouteId(routeId);
    if (!mapInstanceRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    const selectedRoute = prebuiltRoutes.find((r) => r.id === routeId);
    if (!selectedRoute) return;

    const routeStops = places.filter((p) => selectedRoute.stopIds.includes(p.id));
    if (routeStops.length < 2) return;

    const latlngs = routeStops.map((p) => p.coords);

    const polyline = L.polyline(latlngs, {
      color: '#087E8B',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.9
    }).addTo(routeLayerRef.current);

    mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40], animate: true });
  };

  const handleShare = (id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/lieux/${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const filteredPlaces = getFilteredPlaces();

  return (
    <div className="w-full flex flex-col lg:flex-row gap-5 items-stretch">
      {/* =========================================================================
          1. GAUCHE : CARTE INTERACTIVE (3/5 DE LA LARGEUR SUR DESKTOP)
          ========================================================================= */}
      <div
        className={`relative isolate z-0 w-full lg:w-3/5 ${
          fullscreenMode ? 'h-[580px] lg:h-[760px]' : 'h-[520px] lg:h-[660px]'
        } flex flex-col rounded-3xl overflow-hidden border border-lagon-border shadow-soft bg-white text-ink shrink-0`}
      >
        {/* TOP SEARCH & ACTION BAR */}
        <div className="absolute top-3 left-3 right-3 z-[400] flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Minimalist Search Input */}
            <div className="relative flex-1 min-w-[180px] shadow-soft">
              <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une plage, commune..."
                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-lagon-border text-xs text-ink placeholder:text-ink-muted focus:border-action focus:bg-white focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autour de moi (GPS) */}
            <button
              type="button"
              onClick={handleGeolocate}
              disabled={isLocating}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-semibold shadow-soft backdrop-blur-md transition-all cursor-pointer ${
                userLocation
                  ? 'bg-action text-white border-action'
                  : 'bg-white/95 text-deep border-lagon-border hover:border-action'
              }`}
              title="Activer la géolocalisation"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{userLocation ? 'GPS' : 'Autour de moi'}</span>
            </button>
          </div>

          {/* ALL 7 CATEGORIES FIT EXACTLY ON ONE LINE WITHOUT SCROLLING */}
          <div className="grid grid-cols-7 gap-1 w-full pointer-events-auto">
            {PRIMARY_FILTERS.map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(f.id);
                  }}
                  className={`flex items-center justify-center gap-1 py-1.5 px-0.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer text-center truncate ${
                    isSelected
                      ? 'bg-deep text-white border-deep font-semibold shadow-soft'
                      : 'bg-white/95 text-deep border border-lagon-border hover:border-action/60 hover:bg-white shadow-2xs'
                  }`}
                  title={f.label}
                >
                  <span className="text-[11px] shrink-0">{f.icon}</span>
                  <span className="truncate">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAP CANVAS CONTAINER */}
        <div ref={mapContainerRef} className="w-full h-full z-[100]" />

        {/* FLOATING ZOOM CONTROLS */}
        <div className="absolute right-3 bottom-3 z-[400] flex flex-col gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md shadow-soft border border-lagon-border text-deep hover:bg-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Zoomer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md shadow-soft border border-lagon-border text-deep hover:bg-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Dézoomer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.setView([14.6415, -61.0242], 10, { animate: true })}
            className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md shadow-soft border border-lagon-border text-deep hover:bg-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Recentrer sur la Martinique"
          >
            <Compass className="w-3.5 h-3.5 text-action" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. DROITE : PANNEAU D'INFORMATIONS (2/5 DE LA LARGEUR SUR DESKTOP)
          ========================================================================= */}
      <div
        className={`w-full lg:w-2/5 ${
          fullscreenMode ? 'h-[580px] lg:h-[760px]' : 'h-[520px] lg:h-[660px]'
        } bg-white rounded-3xl border border-lagon-border shadow-soft flex flex-col overflow-hidden text-left`}
      >
        {selectedPlace ? (
          /* VUE DÉTAILLÉE DU LIEU SÉLECTIONNÉ */
          <div className="flex flex-col h-full overflow-hidden animate-fadeIn">
            {/* Header Photo */}
            <div className="relative aspect-[16/10] w-full bg-lagon-bg shrink-0 overflow-hidden">
              <img
                src={selectedPlace.photos[0]}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/75 via-transparent to-transparent pointer-events-none" />

              {/* Bouton pour revenir à la liste */}
              <button
                type="button"
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-deep text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-soft cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tous les lieux</span>
              </button>

              {/* Favorite Button */}
              <button
                type="button"
                onClick={() => toggleFavorite(selectedPlace.id)}
                className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-deep flex items-center justify-center transition-colors shadow-soft cursor-pointer"
                aria-label="Favori"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(selectedPlace.id) ? 'fill-coral text-coral' : 'text-ink-muted'
                  }`}
                />
              </button>

              {/* Badges on image */}
              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-deep/80 backdrop-blur-sm">
                  {selectedPlace.subCategory || selectedPlace.commune}
                </span>

                {userLocation && (
                  <span className="px-2 py-0.5 rounded-full bg-deep/80 text-[10px] font-bold">
                    📍 {calculateDistance(userLocation[0], userLocation[1], selectedPlace.coords[0], selectedPlace.coords[1]).toFixed(1)} km
                  </span>
                )}
              </div>
            </div>

            {/* Corps du contenu */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-action font-bold uppercase tracking-wider">
                    {selectedPlace.commune}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedPlace.rating.toFixed(1)}</span>
                    <span className="text-ink-muted font-normal text-[11px]">({selectedPlace.reviewsCount} avis)</span>
                  </div>
                </div>

                <h3 className="font-semibold text-deep text-lg sm:text-xl leading-snug">
                  {selectedPlace.name}
                </h3>

                {selectedPlace.badges && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedPlace.badges.map((b, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sand-light text-deep border border-sand-border">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                {selectedPlace.description}
              </p>

              {/* Conditions en temps réel si existantes */}
              {selectedPlace.realTime && (
                <div className="p-3 rounded-2xl bg-lagon-bg border border-lagon-border/70 text-xs space-y-1">
                  <div className="font-semibold text-deep text-[11px] uppercase tracking-wider">Conditions marines en direct</div>
                  <div className="grid grid-cols-2 gap-2 text-ink text-[11px]">
                    <div>🌊 État : <span className="font-semibold">{selectedPlace.realTime.seaState}</span></div>
                    <div>🌿 Sargasses : <span className="font-semibold">{selectedPlace.realTime.sargassum === 'none' ? 'Aucune' : 'Présentes'}</span></div>
                    <div>☀️ Temp. eau : <span className="font-semibold">{selectedPlace.realTime.tempWater}°C</span></div>
                    <div>💨 Vent : <span className="font-semibold">{selectedPlace.realTime.windSpeed} km/h</span></div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedPlace.tags && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedPlace.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-lagon-bg/60 text-ink-muted border border-lagon-border/50">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions : Voir fiche, Itinéraire, Partager */}
              <div className="pt-3 border-t border-lagon-border space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectPlace(selectedPlace)}
                  className="w-full py-2.5 rounded-xl bg-action hover:bg-action-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-soft cursor-pointer"
                >
                  <span>Voir la fiche détaillée</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.coords[0]},${selectedPlace.coords[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-lagon-bg hover:bg-lagon-light/60 border border-lagon-border text-deep text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-action" />
                    <span>Itinéraire GPS</span>
                  </a>

                  {selectedPlace.website ? (
                    <a
                      href={selectedPlace.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-lagon-bg hover:bg-lagon-light/60 border border-lagon-border text-deep text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-action" />
                      <span>Site web</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleShare(selectedPlace.id)}
                      className="py-2 px-3 rounded-xl bg-lagon-bg hover:bg-lagon-light/60 border border-lagon-border text-deep text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedId === selectedPlace.id ? <Check className="w-3.5 h-3.5 text-action" /> : <Share2 className="w-3.5 h-3.5 text-action" />}
                      <span>{copiedId === selectedPlace.id ? 'Lien copié' : 'Partager'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* AUCUN LIEU SÉLECTIONNÉ : LISTE / FLUX DES LIEUX DE CETTE CATÉGORIE */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header du panneau */}
            <div className="p-4 border-b border-lagon-border bg-gradient-to-r from-lagon-bg/40 to-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-deep text-sm sm:text-base">
                  Lieux à explorer ({filteredPlaces.length})
                </h3>
                <p className="text-[11px] text-ink-muted">
                  Cliquez sur la carte ou un lieu ci-dessous
                </p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sand-light text-action font-semibold border border-sand-border">
                {PRIMARY_FILTERS.find(f => f.id === activeFilter)?.label || 'Sélection'}
              </span>
            </div>

            {/* Liste scrollable des lieux */}
            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => {
                    setSelectedPlace(place);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.panTo(place.coords, { animate: true, duration: 0.6 });
                    }
                  }}
                  className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-lagon-bg/70 border border-transparent hover:border-lagon-border transition-all cursor-pointer"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-lagon-bg shrink-0">
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-action truncate">
                        {place.commune}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px] shrink-0">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{place.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-deep truncate group-hover:text-action transition-colors">
                      {place.name}
                    </h4>

                    <p className="text-[11px] text-ink-muted line-clamp-1">
                      {place.subCategory || place.description}
                    </p>
                  </div>
                </div>
              ))}

              {filteredPlaces.length === 0 && (
                <div className="py-16 text-center text-ink-muted text-xs">
                  Aucun lieu trouvé pour ces critères.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

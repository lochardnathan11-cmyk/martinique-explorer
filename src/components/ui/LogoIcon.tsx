'use client';

import React from 'react';

export default function LogoIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background soft pebble/shield with smooth organic radius */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="14"
        fill="#BFEFF2"
        className="transition-colors group-hover:fill-[#A6E8EC]"
      />

      {/* Gentle Caribbean Sun Rising */}
      <circle
        cx="31"
        cy="17"
        r="6.5"
        fill="#FF8066"
        opacity="0.9"
      />

      {/* Tropical Mountain / Pitons de la Martinique (Pelée silhouette) */}
      <path
        d="M12 33L21 21C21.6 20.2 22.8 20.2 23.4 21L31 33H12Z"
        fill="#073B4C"
        opacity="0.85"
      />
      <path
        d="M23 33L29 24.5C29.5 23.8 30.5 23.8 31 24.5L37 33H23Z"
        fill="#073B4C"
        opacity="0.65"
      />

      {/* Tropical Palm Frond Branch (Courbe végétale dessinée) */}
      <path
        d="M10 32C12 25 18 19 26 16"
        stroke="#087E8B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M14 26C16.5 24 19.5 23.5 22 24"
        stroke="#087E8B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 21C20 19 23 18.5 26 19.5"
        stroke="#087E8B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Stylized Turquoise Lagoon Waves */}
      <path
        d="M8 35.5C12 34 16 36 20 34.5C24 33 28 35 32 33.5C36 32 39 34 40 34"
        stroke="#087E8B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M11 38.5C15 37.5 18 39 22 38C26 37 29 38.5 33 37.5C35 37 37 37.5 38 37.5"
        stroke="#073B4C"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

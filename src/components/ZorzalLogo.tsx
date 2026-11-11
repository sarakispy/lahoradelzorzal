import React from 'react';

interface ZorzalLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const ZorzalLogo: React.FC<ZorzalLogoProps> = ({
  className = '',
  size = 48,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-full p-2 border border-[#D4AF37]/40 bg-gradient-to-br from-[#4A0E17] via-[#2D080E] to-[#121013] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#D4AF37]"
        >
          {/* Outer concentric subtle ornament */}
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />

          {/* Paraguayan Harp pillar / neck curve (Harmonic curve) */}
          <path
            d="M 28 80 C 28 35, 38 22, 60 22 C 72 22, 78 28, 76 34 C 74 39, 64 38, 58 44 C 54 48, 56 60, 58 80"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Arpa Strings (Afinación diatónica de 36 cuerdas estilizadas) */}
          <line x1="38" y1="30" x2="38" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="44" y1="34" x2="44" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="50" y1="40" x2="50" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.9" />
          <line x1="56" y1="50" x2="56" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.8" />

          {/* Zorzal Bird Silhouette (El Zorzal Cantor) */}
          {/* Head & beak */}
          <path
            d="M 68 28 Q 72 24 76 25 Q 75 29 70 31"
            fill="currentColor"
          />
          {/* Bird body perched with open musical beak */}
          <path
            d="M 59 38 C 65 31, 74 29, 75 25 C 80 23, 83 23, 86 24 C 82 27, 78 29, 76 33 C 78 38, 77 46, 70 52 C 64 57, 54 53, 59 38 Z"
            fill="currentColor"
          />
          {/* Wing accent & musical flight tail */}
          <path
            d="M 64 42 Q 78 44 82 56 Q 72 50 63 46"
            stroke="#FAF7F2"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Sound waves emerging from the Zorzal's melody */}
          <path
            d="M 78 18 Q 83 20 86 25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 83 14 Q 90 18 93 25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Base of the harp */}
          <path
            d="M 22 80 L 64 80"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif-display font-bold tracking-wider text-base md:text-lg text-[#FAF7F2] leading-tight">
            LA HORA DEL ZORZAL
          </span>
          <span className="text-[10px] md:text-xs tracking-[0.2em] font-medium text-[#D4AF37] uppercase">
            El Canto de Nuestra Tierra
          </span>
        </div>
      )}
    </div>
  );
};

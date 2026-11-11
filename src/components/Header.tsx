import React from 'react';
import { ZorzalLogo } from './ZorzalLogo.tsx';
import { Radio } from 'lucide-react';
import { RadioConfig } from '../types.ts';

interface HeaderProps {
  config: RadioConfig;
  isPlaying: boolean;
}

export const Header: React.FC<HeaderProps> = ({ config, isPlaying }) => {
  return (
    <header className="w-full bg-[#121013]/90 backdrop-blur-md border-b border-[var(--color-dorado,#D4AF37)]/20 shrink-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title & logo */}
        <div className="flex items-center gap-3 text-left">
          {config.logo_url ? (
            <img
              src={config.logo_url}
              alt={config.station_name || 'Logo'}
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-full border border-[var(--color-dorado,#D4AF37)]/40 bg-black/40 p-0.5"
            />
          ) : (
            <ZorzalLogo size={42} showText={false} />
          )}

          <div className="flex flex-col">
            <span className="font-serif-display font-extrabold tracking-wider text-base sm:text-xl text-[#FAF7F2] whitespace-nowrap">
              {config.station_name || 'LA HORA DEL ZORZAL'}
            </span>
            <span className="text-[9px] sm:text-xs tracking-[0.2em] uppercase text-[var(--color-dorado,#D4AF37)] font-medium whitespace-nowrap">
              {config.slogan || 'Programa de música y cultura del py con Rubén Sosa'}
            </span>
          </div>
        </div>

        {/* Zone 3: Live indicator status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-[var(--color-bordo,#4A0E17)]/40 border border-[var(--color-dorado,#D4AF37)]/30 text-xs text-[#FAF7F2]">
            <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-[var(--color-dorado,#D4AF37)] animate-pulse' : 'text-[#FAF7F2]/50'}`} />
            <span className="font-semibold tracking-wider text-[10px] sm:text-[11px] uppercase whitespace-nowrap">
              {isPlaying ? 'En Transmisión' : '24 Horas En Vivo'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

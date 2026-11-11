import React from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, RefreshCw } from 'lucide-react';
import { PlaybackStatus, RadioConfig } from '../types.ts';
import { ZorzalLogo } from './ZorzalLogo.tsx';

interface StickyBottomPlayerProps {
  config: RadioConfig;
  status: PlaybackStatus;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onVolumeChange: (newVolume: number) => void;
  onToggleMute: () => void;
}

export const StickyBottomPlayer: React.FC<StickyBottomPlayerProps> = ({
  config,
  status,
  volume,
  isMuted,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
}) => {
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';

  return (
    <aside 
      aria-label="Reproductor fijo de La Hora del Zorzal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#161217]/95 backdrop-blur-md border-t border-[#D4AF37]/30 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Station branding & play button */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onTogglePlay}
            disabled={isLoading}
            aria-label={isPlaying ? 'Pausar radio' : 'Reproducir radio'}
            className={`flex items-center justify-center w-11 h-11 rounded-full border shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
              isPlaying
                ? 'border-[#D4AF37] bg-[#4A0E17] text-[#FAF7F2] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                : 'border-[#D4AF37]/60 bg-[#1C181E] text-[#D4AF37] hover:border-[#D4AF37] hover:scale-105'
            }`}
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37]" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          <div className="flex items-center gap-2.5 min-w-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ZorzalLogo size={32} showText={false} className="hidden sm:inline-flex shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif-display font-bold text-sm text-[#FAF7F2] truncate">
                  {config.station_name || 'LA HORA DEL ZORZAL'}
                </span>
                <span className="flex items-center gap-1 text-[10px] uppercase font-semibold text-[#D4AF37] shrink-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-stone-500'}`} />
                  {isPlaying ? 'EN VIVO' : 'PAUSADO'}
                </span>
                {(config.stream_format === 'ogg' || (config.stream_url && config.stream_url.toLowerCase().includes('ogg'))) && (
                  <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-semibold hidden sm:inline-block">
                    OGG
                  </span>
                )}
              </div>
              <p className="text-xs text-[#FAF7F2]/60 truncate hidden xs:block">
                {config.slogan || 'Programa de música y cultura del py con Rubén Sosa'} · 24 Horas
              </p>
            </div>
          </div>
        </div>

        {/* Center: Waveform indicator (Desktop) */}
        <div className="hidden md:flex items-center gap-1 h-6 shrink-0" aria-hidden="true">
          {[
            'animate-wave-1',
            'animate-wave-3',
            'animate-wave-2',
            'animate-wave-5',
            'animate-wave-4',
            'animate-wave-1',
            'animate-wave-2',
          ].map((cls, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                isPlaying ? `bg-[#D4AF37] ${cls} h-5` : 'bg-stone-700 h-1.5'
              }`}
            />
          ))}
        </div>

        {/* Right: Volume & Quick Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="text-[#FAF7F2]/70 hover:text-[#D4AF37] transition-colors p-1"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            aria-label="Volumen en reproductor compacto"
            className="w-16 sm:w-24 h-1 bg-stone-700 rounded appearance-none cursor-pointer accent-[#D4AF37]"
          />
        </div>
      </div>
    </aside>
  );
};

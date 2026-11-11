import React from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, AlertCircle, RefreshCw, Radio } from 'lucide-react';
import { PlaybackStatus, RadioConfig } from '../types.ts';

interface HeroPlayerProps {
  config: RadioConfig;
  status: PlaybackStatus;
  errorMessage: string | null;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onVolumeChange: (newVolume: number) => void;
  onToggleMute: () => void;
  onRetry: () => void;
}

export const HeroPlayer: React.FC<HeroPlayerProps> = ({
  config,
  status,
  errorMessage,
  volume,
  isMuted,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onRetry,
}) => {
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <section className="relative w-full py-12 md:py-20 px-4 sm:px-6 overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative Paraguayan harp & acoustic string background motifs */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-center">
        <div className="w-full max-w-5xl h-full flex justify-between px-6">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent"
              style={{
                opacity: 0.15 + (i % 3) * 0.15,
                transform: `rotate(${(i - 9) * 0.8}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Radial Burgundy Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[750px] h-[500px] md:h-[600px] rounded-full bg-gradient-to-br from-[#6B1422]/25 via-[#4A0E17]/20 to-transparent blur-3xl pointer-events-none" />

      {/* Main Player Card */}
      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#1C181E]/95 via-[#161217]/95 to-[#121013]/98 rounded-3xl border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-10 md:p-12 text-center backdrop-blur-xl">
        
        {/* Top Badges / Indicators */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4AF37]/15">
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {isPlaying && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-red-500' : isLoading ? 'bg-[#D4AF37]' : 'bg-stone-500'}`} />
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#FAF7F2]">
              {isLoading ? 'Conectando...' : isPlaying ? 'EN VIVO' : 'SEÑAL LISTA'}
            </span>
          </div>

          {/* Quality & Format */}
          <div className="flex items-center gap-2 text-[11px] text-[#D4AF37]/80 uppercase tracking-widest font-medium">
            <Radio className="w-3.5 h-3.5" />
            <span>Transmisión Digital 24/7</span>
          </div>
        </div>

        {/* Emisora Identity */}
        <div className="mb-6 space-y-2">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#D4AF37]">
            {config.slogan || 'EL CANTO DE NUESTRA TIERRA'}
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FAF7F2] drop-shadow-md">
            {config.station_name || 'LA HORA DEL ZORZAL'}
          </h1>
          <p className="text-sm md:text-base text-[#FAF7F2]/80 font-normal">
            Música paraguaya las 24 horas · Polcas y guaranias
          </p>
        </div>

        {/* Visualizer Animation (Waveform Spectrum) */}
        <div className="h-14 flex items-center justify-center gap-1.5 sm:gap-2 my-6 px-4" aria-hidden="true">
          {[
            'animate-wave-1',
            'animate-wave-2',
            'animate-wave-3',
            'animate-wave-4',
            'animate-wave-5',
            'animate-wave-2',
            'animate-wave-4',
            'animate-wave-1',
            'animate-wave-3',
            'animate-wave-5',
            'animate-wave-2',
            'animate-wave-3',
            'animate-wave-4',
            'animate-wave-1',
            'animate-wave-5',
            'animate-wave-2',
          ].map((animClass, idx) => (
            <div
              key={idx}
              className={`w-1 sm:w-1.5 rounded-full transition-all duration-300 ${
                isPlaying
                  ? `bg-gradient-to-t from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] ${animClass} h-10`
                  : isLoading
                  ? 'bg-[#D4AF37]/40 h-3 animate-pulse'
                  : 'bg-stone-700 h-2'
              }`}
            />
          ))}
        </div>

        {/* Large Protagonist PLAY / PAUSE Button */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative group">
            {/* Glowing Ring when playing */}
            {isPlaying && (
              <div className="absolute -inset-2 rounded-full bg-[#D4AF37]/30 blur-xl animate-pulse pointer-events-none" />
            )}

            <button
              onClick={onTogglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pausar transmisión de La Hora del Zorzal' : 'Reproducir transmisión de La Hora del Zorzal'}
              className={`relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D4AF37] ${
                isLoading
                  ? 'border-[#D4AF37]/40 bg-[#4A0E17]/60 cursor-wait'
                  : isPlaying
                  ? 'border-[#D4AF37] bg-gradient-to-br from-[#4A0E17] via-[#6B1422] to-[#2D080E] text-[#FAF7F2] hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]'
                  : 'border-[#D4AF37] bg-gradient-to-br from-[#4A0E17] to-[#121013] text-[#D4AF37] hover:text-[#FAF7F2] hover:scale-105 hover:border-[#F3E5AB] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-10 h-10 animate-spin text-[#D4AF37]" />
              ) : isPlaying ? (
                <Pause className="w-10 h-10 sm:w-12 sm:h-12 fill-current" />
              ) : (
                <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current translate-x-1" />
              )}
            </button>
          </div>

          {/* Connection Status Text */}
          <div className="mt-4 min-h-[28px] flex items-center justify-center text-center">
            {isLoading && (
              <p className="text-sm text-[#D4AF37] flex items-center gap-1.5 animate-pulse font-medium">
                <span>Conectando con la transmisión en vivo...</span>
              </p>
            )}

            {isPlaying && (
              <p className="text-sm text-[#FAF7F2] font-medium tracking-wide">
                Reproduciendo señal en directo · Audio HD
              </p>
            )}

            {!isLoading && !isPlaying && !isError && (
              <p className="text-sm text-[#FAF7F2]/60">
                Presioná el botón para comenzar a escuchar
              </p>
            )}

            {isError && (
              <div className="flex flex-col sm:flex-row items-center gap-2 text-rose-300 text-sm">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>{errorMessage || 'Error de conexión con el streaming.'}</span>
                </span>
                <button
                  onClick={onRetry}
                  className="px-3 py-1 text-xs rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 transition-colors inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reintentar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Volume Controls */}
        <div className="pt-6 border-t border-[#D4AF37]/15 flex items-center justify-center gap-4 max-w-xs mx-auto">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="text-[#FAF7F2]/70 hover:text-[#D4AF37] transition-colors p-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="Control de volumen"
              className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <span className="text-xs font-mono tabular-nums text-[#FAF7F2]/60 w-8 text-right">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

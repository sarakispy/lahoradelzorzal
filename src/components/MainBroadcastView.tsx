import React from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, AlertCircle, RefreshCw, Radio, MessageCircle, Music } from 'lucide-react';
import { PlaybackStatus, RadioConfig } from '../types.ts';

interface MainBroadcastViewProps {
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

export const MainBroadcastView: React.FC<MainBroadcastViewProps> = ({
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

  const rawNumber = config.whatsapp_number || '595985160699';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = config.whatsapp_message || '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  const playerTitle = config.player_title || 'SEÑAL EN DIRECTO';
  const playerSubtitle = config.player_subtitle || '24 hs con lo mejor del folklore paraguayo';

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 md:py-8 flex-1 flex flex-col justify-center">
      {/* Decorative subtle string lines backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden flex justify-center">
        <div className="w-full max-w-5xl h-full flex justify-between px-8">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-dorado,#D4AF37)]/30 to-transparent"
              style={{
                opacity: 0.15 + (i % 2) * 0.15,
                transform: `rotate(${(i - 7) * 0.6}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Radial Burgundy Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] md:w-[700px] h-[400px] rounded-full bg-gradient-to-br from-[var(--color-bordo,#4A0E17)]/25 via-[var(--color-bordo,#4A0E17)]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Side-by-side 2-column Grid Layout (No-scroll on desktop) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
        
        {/* ========================================================
            COLUMN 1: EL REPRODUCTOR PRINCIPAL (7 cols on Desktop)
           ======================================================== */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#1C181E]/95 via-[#161217]/95 to-[#121013]/98 rounded-3xl border border-[var(--color-dorado,#D4AF37)]/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-5 sm:p-7 md:p-8 flex flex-col justify-between backdrop-blur-xl">
          
          {/* Top Status & Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-dorado,#D4AF37)]/15">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-red-500' : isLoading ? 'bg-[var(--color-dorado,#D4AF37)]' : 'bg-stone-500'}`} />
              </span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[#FAF7F2]">
                {isLoading ? 'Conectando...' : isPlaying ? 'EN VIVO' : 'SEÑAL LISTA'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[var(--color-dorado,#D4AF37)]/80 uppercase tracking-widest font-medium">
              <Radio className="w-3.5 h-3.5" />
              <span>Transmisión Digital 24/7</span>
            </div>
          </div>

          {/* Clean Non-Redundant Broadcast Content */}
          <div className="my-3 text-center sm:text-left space-y-1">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-dorado,#D4AF37)]">
              {config.slogan || 'Programa de música y cultura del py con Rubén Sosa'}
            </p>
            <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#FAF7F2] drop-shadow-md leading-tight">
              {playerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/75 font-normal">
              {playerSubtitle}
            </p>
          </div>

          {/* Equalizer Visualizer Wave */}
          <div className="h-9 flex items-center justify-center gap-1.5 my-2" aria-hidden="true">
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
            ].map((animClass, idx) => (
              <div
                key={idx}
                className={`w-1 sm:w-1.5 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? `bg-gradient-to-t from-[var(--color-dorado,#D4AF37)] via-[#F3E5AB] to-[var(--color-dorado,#D4AF37)] ${animClass} h-8`
                    : isLoading
                    ? 'bg-[var(--color-dorado,#D4AF37)]/40 h-2.5 animate-pulse'
                    : 'bg-stone-700/80 h-1.5'
                }`}
              />
            ))}
          </div>

          {/* Central Play/Pause Button & Connection Text */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative group">
              {isPlaying && (
                <div className="absolute -inset-2 rounded-full bg-[var(--color-dorado,#D4AF37)]/25 blur-lg animate-pulse pointer-events-none" />
              )}

              <button
                onClick={onTogglePlay}
                disabled={isLoading}
                aria-label={isPlaying ? 'Pausar transmisión de La Hora del Zorzal' : 'Reproducir transmisión de La Hora del Zorzal'}
                className={`relative flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-dorado,#D4AF37)] ${
                  isLoading
                    ? 'border-[var(--color-dorado,#D4AF37)]/40 bg-[var(--color-bordo,#4A0E17)]/60 cursor-wait'
                    : isPlaying
                    ? 'border-[var(--color-dorado,#D4AF37)] bg-gradient-to-br from-[var(--color-bordo,#4A0E17)] via-[#6B1422] to-[#2D080E] text-[#FAF7F2] hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]'
                    : 'border-[var(--color-dorado,#D4AF37)] bg-gradient-to-br from-[var(--color-bordo,#4A0E17)] to-[#121013] text-[var(--color-dorado,#D4AF37)] hover:text-[#FAF7F2] hover:scale-105 hover:border-[#F3E5AB] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="w-8 h-8 animate-spin text-[var(--color-dorado,#D4AF37)]" />
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 sm:w-9 sm:h-9 fill-current" />
                ) : (
                  <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Connection Status Text */}
            <div className="mt-3 min-h-[24px] flex items-center justify-center text-center">
              {isLoading && (
                <p className="text-xs text-[var(--color-dorado,#D4AF37)] animate-pulse font-medium">
                  Conectando con la transmisión en vivo...
                </p>
              )}

              {isPlaying && (
                <p className="text-xs text-[#FAF7F2] font-medium tracking-wide">
                  Reproduciendo señal en directo · Audio HD
                </p>
              )}

              {!isLoading && !isPlaying && !isError && (
                <p className="text-xs text-[#FAF7F2]/60">
                  Presioná para escuchar ahora
                </p>
              )}

              {isError && (
                <div className="flex flex-col sm:flex-row items-center gap-2 text-rose-300 text-xs">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{errorMessage || 'Error de conexión.'}</span>
                  </span>
                  <button
                    onClick={onRetry}
                    className="px-2.5 py-0.5 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Reintentar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Volume Control Bar */}
          <div className="pt-3 border-t border-[var(--color-dorado,#D4AF37)]/15 flex items-center justify-center gap-3 max-w-xs mx-auto w-full">
            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              className="text-[#FAF7F2]/70 hover:text-[var(--color-dorado,#D4AF37)] transition-colors p-1 rounded focus:outline-none"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
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
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-dorado,#D4AF37)]"
              />
              <span className="text-[11px] font-mono tabular-nums text-[#FAF7F2]/60 w-8 text-right">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================
            COLUMN 2: CONTACTO POR WHATSAPP & INFO (5 cols on Desktop)
           ======================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#1C181E]/95 via-[#18131A]/95 to-[#121013]/98 rounded-3xl border border-[var(--color-dorado,#D4AF37)]/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-5 sm:p-7 md:p-8 flex flex-col justify-between backdrop-blur-xl text-center">
          
          {/* Top Divider with Paraguayan note */}
          <div className="pb-3 border-b border-[var(--color-dorado,#D4AF37)]/15 flex items-center justify-between text-left">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[var(--color-dorado,#D4AF37)] font-semibold">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Línea de Oyentes</span>
            </div>
            <span className="text-[10px] text-[#FAF7F2]/50 tracking-wider">
              Enlace Directo
            </span>
          </div>

          {/* Contact Content */}
          <div className="my-auto py-3 space-y-3">
            <div className="space-y-1">
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF7F2]">
                CONTACTANOS
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 font-light leading-relaxed max-w-sm mx-auto">
                ¿Querés comunicarte con nosotros? Escribinos directamente por WhatsApp.
              </p>
            </div>

            {/* Official Big WhatsApp Button */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl text-sm sm:text-base font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_8px_25px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
              >
                {/* Official WhatsApp SVG Icon */}
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.7C7.02 10.92 7.91 12.09 8.03 12.25C8.16 12.41 9.77 14.9 12.24 15.96C12.83 16.21 13.28 16.36 13.64 16.48C14.23 16.67 14.77 16.64 15.2 16.58C15.68 16.51 16.68 15.97 16.89 15.38C17.1 14.79 17.1 14.28 17.04 14.18C16.98 14.07 16.81 14.01 16.56 13.88C16.31 13.76 15.08 13.15 14.85 13.07C14.62 12.99 14.46 12.95 14.29 13.19C14.13 13.44 13.65 14.01 13.51 14.18C13.36 14.34 13.22 14.36 12.97 14.24C12.72 14.11 11.92 13.85 10.97 13.01C10.23 12.35 9.73 11.54 9.58 11.29C9.44 11.04 9.57 10.91 9.69 10.78C9.8 10.67 9.94 10.49 10.07 10.34C10.2 10.19 10.24 10.08 10.32 9.92C10.4 9.75 10.36 9.61 10.3 9.49C10.24 9.36 9.77 8.2 9.57 7.74C9.38 7.29 9.19 7.35 9.04 7.34C8.9 7.33 8.73 7.33 8.53 7.33Z"/>
                </svg>
                <span className="tracking-wide uppercase font-extrabold whitespace-nowrap">
                  ESCRIBINOS POR WHATSAPP
                </span>
              </a>
            </div>

            {/* Direct Number */}
            <p className="text-xs text-[#FAF7F2]/60 font-mono">
              +{cleanNumber}
            </p>

            <p className="text-[11px] text-[#FAF7F2]/50 italic max-w-xs mx-auto leading-relaxed">
              Envianos tus saludos, pedidos de polcas y guaranias, o comentarios sobre nuestra programación.
            </p>
          </div>

          {/* Paraguayan Folk Culture Highlights */}
          <div className="pt-3 border-t border-[var(--color-dorado,#D4AF37)]/15 flex items-center justify-center gap-2 text-[11px] text-[var(--color-dorado,#D4AF37)]">
            <Music className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">24 hs con lo mejor del folklore paraguayo</span>
          </div>

        </div>

      </div>
    </div>
  );
};

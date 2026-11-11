import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { MainBroadcastView } from './components/MainBroadcastView.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { RadioConfig, PlaybackStatus } from './types.ts';

const DEFAULT_CONFIG: RadioConfig = {
  station_name: 'LA HORA DEL ZORZAL',
  slogan: 'Programa de música y cultura del py con Rubén Sosa',
  stream_url: 'https://stream.zeno.fm/fvrx452718quv',
  whatsapp_number: '595985160699',
  whatsapp_message: '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.',
  player_title: 'SEÑAL EN DIRECTO',
  player_subtitle: '24 hs con lo mejor del folklore paraguayo',
};

export default function App() {
  const [config, setConfig] = useState<RadioConfig>(DEFAULT_CONFIG);
  
  // The Admin panel is on a completely separate, hidden URL route (/admin)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  // Audio Playback States
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('zorzal_radio_volume');
    return saved !== null ? parseFloat(saved) : 0.85;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Listen to popstate and browser navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdm = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setIsAdminRoute(isAdm);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: '/' | '/admin') => {
    window.history.pushState(null, '', path);
    setIsAdminRoute(path === '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch active radio configuration from server
  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/config');
      const text = await res.text();
      if (text && text.trim()) {
        try {
          const data = JSON.parse(text);
          if (data && data.station_name) {
            setConfig(data);
            return;
          }
        } catch {
          // not valid JSON, fallback to local
        }
      }
    } catch (err) {
      console.warn('Usando configuración local de La Hora del Zorzal:', err);
    }

    const saved = localStorage.getItem('zorzal_radio_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.station_name) {
          setConfig(parsed);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Audio instance initialization and event binding
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = isMuted ? 0 : volume;

    const onPlaying = () => {
      setStatus('playing');
      setErrorMessage(null);
    };

    const onPause = () => {
      if (status !== 'error') {
        setStatus('paused');
      }
    };

    const onWaiting = () => {
      setStatus('loading');
    };

    const onError = () => {
      console.error('Error en el stream de audio:', audio.error);
      setStatus('error');
      setErrorMessage('La transmisión no está disponible o hubo un corte de señal.');
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update audio volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('zorzal_radio_volume', volume.toString());
  }, [volume, isMuted]);

  // Audio Play/Pause Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (status === 'playing') {
      audioRef.current.pause();
      setStatus('paused');
    } else {
      setStatus('loading');
      setErrorMessage(null);

      // Append clean live query parameter to prevent stale cache on reconnect
      const baseStream = config.stream_url;
      const separator = baseStream.includes('?') ? '&' : '?';
      const liveStreamUrl = `${baseStream}${separator}_t=${Date.now()}`;

      audioRef.current.src = liveStreamUrl;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error or blocked by browser policy:', err);
          setStatus('error');
          setErrorMessage('No se pudo conectar a la transmisión. Verifique su conexión a internet.');
        });
      }
    }
  };

  const retryPlayback = () => {
    togglePlay();
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleConfigUpdated = (newConfig: RadioConfig) => {
    setConfig(newConfig);
    // If stream URL changed, reload player if playing
    if (audioRef.current && status === 'playing' && newConfig.stream_url !== config.stream_url) {
      audioRef.current.pause();
      const separator = newConfig.stream_url.includes('?') ? '&' : '?';
      audioRef.current.src = `${newConfig.stream_url}${separator}_t=${Date.now()}`;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  };

  // Dynamically inject custom theme colors into CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (config.color_primary) {
      root.style.setProperty('--color-bordo', config.color_primary);
    }
    if (config.color_accent) {
      root.style.setProperty('--color-dorado', config.color_accent);
    }
  }, [config.color_primary, config.color_accent]);

  // -------------------------------------------------------------
  // VIEW: HIDDEN ADMIN ROUTE (/admin)
  // -------------------------------------------------------------
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#121013] text-[#FAF7F2] font-sans selection:bg-[#D4AF37]/30 selection:text-[#FAF7F2]">
        <AdminDashboard
          config={config}
          onConfigUpdated={handleConfigUpdated}
          onBackToRadio={() => navigateTo('/')}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: PUBLIC NO-SCROLL / RESPONSIVE RADIO PAGE (/)
  // -------------------------------------------------------------
  return (
    <div className="relative min-h-screen lg:h-screen bg-[#121013] text-[#FAF7F2] flex flex-col justify-between font-sans selection:bg-[#D4AF37]/30 selection:text-[#FAF7F2] overflow-x-hidden">
      
      {/* Fixed Responsive Background Image with dynamic URL & Opacity */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {config.background_url ? (
          <img
            src={config.background_url}
            alt=""
            aria-hidden="true"
            style={{ opacity: (config.background_opacity ?? 25) / 100 }}
            className="w-full h-full object-cover object-center filter brightness-90 contrast-115 scale-[1.02] transition-opacity duration-1000"
          />
        ) : null}
        {/* Gradients to guarantee high contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121013] via-[#121013]/75 to-[#121013]/90" />
        <div
          className="absolute inset-0 bg-radial via-transparent to-[#121013]/80"
          style={{ backgroundColor: `${config.color_primary || '#4A0E17'}20` }}
        />
      </div>

      {/* Header (No visible admin link) */}
      <div className="relative z-10">
        <Header config={config} isPlaying={status === 'playing'} />
      </div>

      {/* Main Broadcast Experience: Player & WhatsApp Side-by-Side */}
      <main className="relative z-10 flex-1 flex flex-col justify-center my-auto w-full">
        <MainBroadcastView
          config={config}
          status={status}
          errorMessage={errorMessage}
          volume={volume}
          isMuted={isMuted}
          onTogglePlay={togglePlay}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onRetry={retryPlayback}
        />
      </main>

      {/* Clean Minimal Footer (No visible admin link) */}
      <div className="relative z-10">
        <Footer config={config} />
      </div>

    </div>
  );
}

export interface RadioConfig {
  id?: number;
  station_name: string;
  slogan: string;
  stream_url: string;
  whatsapp_number: string;
  whatsapp_message: string;
  background_url?: string;
  background_opacity?: number;
  logo_url?: string;
  color_primary?: string;
  color_accent?: string;
  player_title?: string;
  player_subtitle?: string;
  stream_format?: 'auto' | 'ogg' | 'mp3' | 'aac' | string;
  stream_url_fallback?: string;
  updated_at?: string;
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

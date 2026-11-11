export interface RadioConfig {
  id?: number;
  station_name: string;
  slogan: string;
  stream_url: string;
  whatsapp_number: string;
  whatsapp_message: string;
  updated_at?: string;
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

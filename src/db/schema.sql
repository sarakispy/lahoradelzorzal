-- Schema for LA HORA DEL ZORZAL (PostgreSQL)

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS radio_config (
  id SERIAL PRIMARY KEY,
  station_name VARCHAR(150) NOT NULL DEFAULT 'LA HORA DEL ZORZAL',
  slogan VARCHAR(255) NOT NULL DEFAULT 'Programa de música y cultura del py con Rubén Sosa',
  stream_url TEXT NOT NULL DEFAULT 'https://stream.zeno.fm/fvrx452718quv',
  whatsapp_number VARCHAR(50) NOT NULL DEFAULT '595985160699',
  whatsapp_message TEXT NOT NULL DEFAULT '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.',
  background_url TEXT DEFAULT '/fondo_arpa_zorzal.jpg',
  background_opacity NUMERIC DEFAULT 25,
  logo_url TEXT DEFAULT '',
  color_primary VARCHAR(25) DEFAULT '#4A0E17',
  color_accent VARCHAR(25) DEFAULT '#D4AF37',
  player_title VARCHAR(150) DEFAULT 'SEÑAL EN DIRECTO',
  player_subtitle VARCHAR(255) DEFAULT '24 hs con lo mejor del folklore paraguayo',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial radio configuration if none exists
INSERT INTO radio_config (
  id, station_name, slogan, stream_url, whatsapp_number, whatsapp_message,
  background_url, background_opacity, logo_url, color_primary, color_accent,
  player_title, player_subtitle
)
SELECT 1, 'LA HORA DEL ZORZAL', 'Programa de música y cultura del py con Rubén Sosa',
       'https://stream.zeno.fm/fvrx452718quv', '595985160699',
       '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.',
       '/fondo_arpa_zorzal.jpg', 25, '', '#4A0E17', '#D4AF37',
       'SEÑAL EN DIRECTO', '24 hs con lo mejor del folklore paraguayo'
WHERE NOT EXISTS (SELECT 1 FROM radio_config WHERE id = 1);

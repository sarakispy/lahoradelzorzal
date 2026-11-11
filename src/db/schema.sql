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
  slogan VARCHAR(255) NOT NULL DEFAULT 'EL CANTO DE NUESTRA TIERRA',
  stream_url TEXT NOT NULL DEFAULT 'https://stream.zeno.fm/fvrx452718quv',
  whatsapp_number VARCHAR(50) NOT NULL DEFAULT '595981123456',
  whatsapp_message TEXT NOT NULL DEFAULT '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial radio configuration if none exists
INSERT INTO radio_config (id, station_name, slogan, stream_url, whatsapp_number, whatsapp_message)
SELECT 1, 'LA HORA DEL ZORZAL', 'EL CANTO DE NUESTRA TIERRA', 'https://stream.zeno.fm/fvrx452718quv', '595981123456', '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.'
WHERE NOT EXISTS (SELECT 1 FROM radio_config WHERE id = 1);

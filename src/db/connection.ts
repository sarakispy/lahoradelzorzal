import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

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
  updated_at?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}

// Fallback in-memory database for local sandbox or when PostgreSQL server is not running
class FallbackDatabase {
  private config: RadioConfig = {
    id: 1,
    station_name: 'LA HORA DEL ZORZAL',
    slogan: 'Programa de música y cultura del py con Rubén Sosa',
    stream_url: 'https://stream.zeno.fm/fvrx452718quv',
    whatsapp_number: '595985160699',
    whatsapp_message: '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.',
    background_url: '/fondo_arpa_zorzal.jpg',
    background_opacity: 25,
    logo_url: '',
    color_primary: '#4A0E17',
    color_accent: '#D4AF37',
    player_title: 'SEÑAL EN DIRECTO',
    player_subtitle: '24 hs con lo mejor del folklore paraguayo',
    updated_at: new Date().toISOString(),
  };

  private users: AdminUser[] = [];

  constructor() {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'zorzaladmin2024';
    const defaultUsername = process.env.ADMIN_DEFAULT_USER || 'admin';
    const hash = bcrypt.hashSync(defaultPassword, 10);
    this.users.push({
      id: 1,
      username: defaultUsername,
      password_hash: hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  async getConfig(): Promise<RadioConfig> {
    return { ...this.config };
  }

  async updateConfig(data: Partial<Omit<RadioConfig, 'id'>>): Promise<RadioConfig> {
    this.config = {
      ...this.config,
      ...data,
      updated_at: new Date().toISOString(),
    };
    return { ...this.config };
  }

  async getUserByUsername(username: string): Promise<AdminUser | null> {
    const user = this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    return user ? { ...user } : null;
  }

  async updateAdminPassword(username: string, newPasswordHash: string): Promise<boolean> {
    const user = this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      user.password_hash = newPasswordHash;
      user.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }
}

const fallbackDb = new FallbackDatabase();

let pool: pg.Pool | null = null;
let isPostgresReady = false;

export async function initDatabase(): Promise<{ isPostgres: boolean }> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('[Database] No DATABASE_URL provided. Running in secure local memory fallback mode.');
    return { isPostgres: false };
  }

  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    console.log('[Database] Connected successfully to PostgreSQL.');

    // Create tables if not exist
    await client.query(`
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
    `);

    // Ensure columns exist if table was already created in an earlier migration
    const alterQueries = [
      `ALTER TABLE radio_config ADD COLUMN IF NOT EXISTS background_url TEXT DEFAULT '/fondo_arpa_zorzal.jpg'`,
      `ALTER TABLE radio_config ADD COLUMN IF NOT EXISTS background_opacity NUMERIC DEFAULT 25`,
      `ALTER TABLE radio_config ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT ''`,
      `ALTER TABLE radio_config ADD COLUMN IF NOT EXISTS color_primary VARCHAR(25) DEFAULT '#4A0E17'`,
      `ALTER TABLE radio_config ADD COLUMN IF NOT EXISTS color_accent VARCHAR(25) DEFAULT '#D4AF37'`,
      `ALTER TABLE radio_config ADD COLUMN IF NOT EXISTS player_title VARCHAR(150) DEFAULT 'SEÑAL EN DIRECTO'`,
      `ALTER TABLE radio_config ADD COLUMN IF NOT EXISTS player_subtitle VARCHAR(255) DEFAULT '24 hs con lo mejor del folklore paraguayo'`,
    ];

    for (const q of alterQueries) {
      try {
        await client.query(q);
      } catch (err) {
        // ignore if exists
      }
    }

    // Ensure initial radio config exists
    const configRes = await client.query('SELECT * FROM radio_config WHERE id = 1');
    if (configRes.rowCount === 0) {
      await client.query(`
        INSERT INTO radio_config (
          id, station_name, slogan, stream_url, whatsapp_number, whatsapp_message,
          background_url, background_opacity, logo_url, color_primary, color_accent,
          player_title, player_subtitle
        )
        VALUES (
          1, 'LA HORA DEL ZORZAL', 'Programa de música y cultura del py con Rubén Sosa',
          'https://stream.zeno.fm/fvrx452718quv', '595985160699',
          '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.',
          '/fondo_arpa_zorzal.jpg', 25, '', '#4A0E17', '#D4AF37',
          'SEÑAL EN DIRECTO', '24 hs con lo mejor del folklore paraguayo'
        )
      `);
      console.log('[Database] Default radio configuration seeded into PostgreSQL.');
    } else {
      // Migrate legacy seed values if present
      await client.query(`
        UPDATE radio_config
        SET slogan = 'Programa de música y cultura del py con Rubén Sosa',
            player_subtitle = '24 hs con lo mejor del folklore paraguayo',
            whatsapp_number = '595985160699'
        WHERE id = 1 AND (slogan = 'EL CANTO DE NUESTRA TIERRA' OR whatsapp_number = '595981123456');
      `);
    }

    // Ensure default admin user exists
    const userRes = await client.query('SELECT * FROM admin_users LIMIT 1');
    if (userRes.rowCount === 0) {
      const defaultUser = process.env.ADMIN_DEFAULT_USER || 'admin';
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'zorzaladmin2024';
      const passwordHash = bcrypt.hashSync(defaultPassword, 10);
      await client.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        [defaultUser, passwordHash]
      );
      console.log(`[Database] Seeded initial admin account (${defaultUser}) into PostgreSQL.`);
    }

    client.release();
    isPostgresReady = true;
    return { isPostgres: true };
  } catch (error) {
    console.warn('[Database] PostgreSQL connection failed or timed out. Operating in memory fallback mode:', (error as Error).message);
    isPostgresReady = false;
    return { isPostgres: false };
  }
}

export async function getRadioConfig(): Promise<RadioConfig> {
  if (isPostgresReady && pool) {
    try {
      const res = await pool.query('SELECT * FROM radio_config WHERE id = 1');
      if (res.rows[0]) {
        return res.rows[0];
      }
    } catch (err) {
      console.error('[Database] Failed to get config from PostgreSQL, falling back to memory:', err);
    }
  }
  return fallbackDb.getConfig();
}

export async function updateRadioConfig(data: Partial<Omit<RadioConfig, 'id'>>): Promise<RadioConfig> {
  if (isPostgresReady && pool) {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let idx = 1;

      const keys: (keyof Omit<RadioConfig, 'id'>)[] = [
        'station_name',
        'slogan',
        'stream_url',
        'whatsapp_number',
        'whatsapp_message',
        'background_url',
        'background_opacity',
        'logo_url',
        'color_primary',
        'color_accent',
        'player_title',
        'player_subtitle',
      ];

      for (const k of keys) {
        if (data[k] !== undefined) {
          fields.push(`${k} = $${idx++}`);
          values.push(data[k]);
        }
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      if (fields.length > 0) {
        const query = `
          UPDATE radio_config 
          SET ${fields.join(', ')} 
          WHERE id = 1 
          RETURNING *;
        `;
        const res = await pool.query(query, values);
        if (res.rows[0]) {
          return res.rows[0];
        }
      }
    } catch (err) {
      console.error('[Database] Failed to update config in PostgreSQL, updating fallback:', err);
    }
  }
  return fallbackDb.updateConfig(data);
}

export async function getAdminUser(username: string): Promise<AdminUser | null> {
  if (isPostgresReady && pool) {
    try {
      const res = await pool.query(
        'SELECT * FROM admin_users WHERE LOWER(username) = LOWER($1) LIMIT 1',
        [username]
      );
      if (res.rows[0]) {
        return res.rows[0];
      }
      return null;
    } catch (err) {
      console.error('[Database] Failed to get user from PostgreSQL, falling back:', err);
    }
  }
  return fallbackDb.getUserByUsername(username);
}

export async function updateAdminPassword(username: string, newPasswordHash: string): Promise<boolean> {
  if (isPostgresReady && pool) {
    try {
      const res = await pool.query(
        'UPDATE admin_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE LOWER(username) = LOWER($2)',
        [newPasswordHash, username]
      );
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.error('[Database] Failed to update password in PostgreSQL, falling back:', err);
    }
  }
  return fallbackDb.updateAdminPassword(username, newPasswordHash);
}

export function isUsingPostgres(): boolean {
  return isPostgresReady;
}

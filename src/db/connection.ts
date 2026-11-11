import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

export interface RadioConfig {
  id: number;
  station_name: string;
  slogan: string;
  stream_url: string;
  whatsapp_number: string;
  whatsapp_message: string;
  updated_at?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}

// Fallback in-memory database for local sandbox when PostgreSQL server is not running
class FallbackDatabase {
  private config: RadioConfig = {
    id: 1,
    station_name: 'LA HORA DEL ZORZAL',
    slogan: 'EL CANTO DE NUESTRA TIERRA',
    // Live high-stability stream for traditional folk / radio
    stream_url: 'https://stream.zeno.fm/fvrx452718quv',
    whatsapp_number: '595981123456',
    whatsapp_message: '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.',
    updated_at: new Date().toISOString(),
  };

  private users: AdminUser[] = [];

  constructor() {
    // Seed default admin: username: 'admin', password: 'zorzaladmin2024'
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
        slogan VARCHAR(255) NOT NULL DEFAULT 'EL CANTO DE NUESTRA TIERRA',
        stream_url TEXT NOT NULL DEFAULT 'https://stream.zeno.fm/fvrx452718quv',
        whatsapp_number VARCHAR(50) NOT NULL DEFAULT '595981123456',
        whatsapp_message TEXT NOT NULL DEFAULT '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure initial radio config exists
    const configRes = await client.query('SELECT * FROM radio_config WHERE id = 1');
    if (configRes.rowCount === 0) {
      await client.query(`
        INSERT INTO radio_config (id, station_name, slogan, stream_url, whatsapp_number, whatsapp_message)
        VALUES (1, 'LA HORA DEL ZORZAL', 'EL CANTO DE NUESTRA TIERRA', 'https://stream.zeno.fm/fvrx452718quv', '595981123456', '¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes.')
      `);
      console.log('[Database] Default radio configuration seeded into PostgreSQL.');
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

      if (data.station_name !== undefined) {
        fields.push(`station_name = $${idx++}`);
        values.push(data.station_name);
      }
      if (data.slogan !== undefined) {
        fields.push(`slogan = $${idx++}`);
        values.push(data.slogan);
      }
      if (data.stream_url !== undefined) {
        fields.push(`stream_url = $${idx++}`);
        values.push(data.stream_url);
      }
      if (data.whatsapp_number !== undefined) {
        fields.push(`whatsapp_number = $${idx++}`);
        values.push(data.whatsapp_number);
      }
      if (data.whatsapp_message !== undefined) {
        fields.push(`whatsapp_message = $${idx++}`);
        values.push(data.whatsapp_message);
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

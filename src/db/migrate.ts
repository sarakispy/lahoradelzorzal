import dotenv from 'dotenv';
import { initDatabase } from './connection.ts';

dotenv.config();

async function runMigration() {
  console.log('[Migration] Starting database migration for La Hora del Zorzal...');
  try {
    const result = await initDatabase();
    if (result.isPostgres) {
      console.log('[Migration] PostgreSQL database migration completed successfully!');
    } else {
      console.log('[Migration] No PostgreSQL database reached. Database layer initialized in memory mode.');
    }
    process.exit(0);
  } catch (err) {
    console.error('[Migration] Migration error:', err);
    process.exit(1);
  }
}

runMigration();

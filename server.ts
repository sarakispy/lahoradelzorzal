import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  initDatabase,
  getRadioConfig,
  updateRadioConfig,
  getAdminUser,
  updateAdminPassword,
  isUsingPostgres,
} from './src/db/connection.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'zorzal_secret_key_super_secure_paraguay_2024';

app.use(cors());
app.use(express.json());

// Initialize database on boot
initDatabase().catch((err) => {
  console.error('[Server] Database initialization failed:', err);
});

// Authentication middleware
interface AuthenticatedRequest extends Request {
  adminUser?: { username: string };
}

const requireAdminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Se requiere inicio de sesión.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    req.adminUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Sesión expirada o token inválido.' });
  }
};

// ----------------------------------------------------
// PUBLIC ROUTES
// ----------------------------------------------------

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'La Hora del Zorzal',
    uptime: Math.floor(process.uptime()),
    database: isUsingPostgres() ? 'postgresql' : 'in-memory-fallback',
    timestamp: new Date().toISOString(),
  });
});

// Public radio configuration
app.get('/api/config', async (_req: Request, res: Response) => {
  try {
    const config = await getRadioConfig();
    res.json(config);
  } catch (error) {
    console.error('Error fetching radio config:', error);
    res.status(500).json({ error: 'Error al obtener la configuración de la radio.' });
  }
});

// Admin login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Debe ingresar usuario y contraseña.' });
    }

    const user = await getAdminUser(username);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Issue JWT valid for 24h
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// ----------------------------------------------------
// PROTECTED ADMIN ROUTES
// ----------------------------------------------------

// Verify token session
app.get('/api/auth/verify', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    authenticated: true,
    user: req.adminUser,
    database: isUsingPostgres() ? 'postgresql' : 'in-memory',
  });
});

// Update radio configuration
app.put('/api/admin/config', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { station_name, slogan, stream_url, whatsapp_number, whatsapp_message } = req.body;

    if (!station_name || !stream_url) {
      return res.status(400).json({ error: 'El nombre de la emisora y la URL del streaming son requeridos.' });
    }

    // Clean whatsapp number (remove spaces and dashes)
    const cleanedWhatsapp = whatsapp_number ? whatsapp_number.replace(/[\s\-\+\(\)]/g, '') : '';

    const updated = await updateRadioConfig({
      station_name: station_name.trim(),
      slogan: slogan ? slogan.trim() : '',
      stream_url: stream_url.trim(),
      whatsapp_number: cleanedWhatsapp,
      whatsapp_message: whatsapp_message ? whatsapp_message.trim() : '',
    });

    res.json({
      message: 'Configuración guardada exitosamente.',
      config: updated,
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Error al actualizar la configuración.' });
  }
});

// Change admin password
app.post('/api/auth/change-password', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const username = req.adminUser?.username;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    const user = await getAdminUser(username);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'La contraseña actual no es correcta.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const success = await updateAdminPassword(username, newHash);

    if (success) {
      res.json({ message: 'Contraseña actualizada correctamente.' });
    } else {
      res.status(500).json({ error: 'No se pudo actualizar la contraseña.' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Test streaming URL connectivity
app.post('/api/admin/test-stream', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ valid: false, error: 'URL requerida.' });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LaHoraDelZorzal/1.0)',
        'Range': 'bytes=0-1024',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const status = response.status;

    const isAudio = contentType.includes('audio') || contentType.includes('mpeg') || contentType.includes('aac') || contentType.includes('ogg') || status === 200 || status === 206;

    res.json({
      valid: isAudio,
      status,
      contentType,
      statusText: response.statusText,
    });
  } catch (error: any) {
    res.json({
      valid: false,
      error: error.name === 'AbortError' ? 'Tiempo de espera agotado al conectar al servidor de audio' : error.message,
    });
  }
});

// ----------------------------------------------------
// VITE DEV SERVER & PRODUCTION STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] La Hora del Zorzal running on http://0.0.0.0:${PORT}`);
  });
}

// Only launch standalone server listener when not running as a Vercel serverless function
if (process.env.VERCEL !== '1') {
  startServer().catch((err) => {
    console.error('[Server] Fatal startup error:', err);
  });
}

export default app;

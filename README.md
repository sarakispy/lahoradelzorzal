# 📻 LA HORA DEL ZORZAL — El Canto de Nuestra Tierra

Página web profesional y moderna para la radio online **LA HORA DEL ZORZAL**, dedicada exclusivamente a transmitir las 24 horas música paraguaya tradicional: polcas, guaranias y música folclórica.

---

## 🇵🇾 Identidad y Características

- **Diseño Paraguayo Minimalista y Elegante**: Paleta de colores en bordó (`#4A0E17`), dorado (`#D4AF37`), crema (`#FAF7F2`) y negro (`#121013`), con detalles sutiles inspirados en el arpa paraguaya y la guitarra tradicional.
- **Reproductor Central Protagonista**:
  - Botón Play/Pause táctil de gran presencia.
  - Indicador EN VIVO y estado de conexión en tiempo real.
  - Control de volumen con silenciador rápido.
  - Animación discreta de ecualizador mientras suena la música.
  - Reproductor compacto flotante inferior que permanece activo mientras se navega.
  - Soporte universal para streaming MP3 y AAC (computadoras y celulares).
- **Contacto Directo por WhatsApp**:
  - Botón oficial de WhatsApp con enlace directo `https://wa.me/NUMERO`.
  - Mensaje predeterminado: *"¡Hola! Estoy escuchando La Hora del Zorzal y quisiera comunicarme con ustedes."*
  - Número y mensaje configurables desde el panel de administración.
- **Panel Administrativo Protegido (`/admin`)**:
  - Autenticación segura mediante usuario y contraseña con bcrypt y JWT.
  - Configuración de nombre, eslogan, URL de streaming y WhatsApp.
  - Verificador de conectividad de streaming en tiempo real.
  - Cambio de clave administrativa.
- **Base de Datos PostgreSQL**:
  - Tablas: `admin_users` y `radio_config`.
  - Soporte automático con `DATABASE_URL` y modo fallback seguro para desarrollo local.
- **Servicio Web Unificado**:
  - Frontend en React + Vite y backend en Node.js + Express servidos desde un único proceso.
  - Endpoint `/health` para monitorización de disponibilidad.

---

## 🛠️ Tecnologías

- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript (`tsx`).
- **Base de Datos**: PostgreSQL (`pg`), migraciones automáticas.
- **Seguridad**: `bcryptjs`, `jsonwebtoken` (JWT).

---

## 🚀 Despliegue en Render desde GitHub

Este proyecto está 100% listo para desplegarse en [Render](https://render.com) en un solo paso mediante `render.yaml`:

1. Sube este repositorio a tu cuenta de **GitHub**.
2. Ingresa a tu panel de **Render** y selecciona **New +** > **Blueprint**.
3. Conecta tu repositorio de GitHub.
4. Render detectará automáticamente `render.yaml` y aprovisionará:
   - **Web Service**: Node.js con `npm install && npm run build` y `npm run start`.
   - **PostgreSQL Database**: Instancia administrada de PostgreSQL `zorzal-postgres`.
5. La variable `DATABASE_URL` se vinculará de forma automática entre la base de datos y el servicio web.
6. ¡Listo! Tu radio online estará transmitiendo en vivo con URL pública HTTPS.

---

## 💻 Ejecución en Desarrollo Local

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Inicia el servidor de desarrollo unificado (servidor Express + Vite en puerto 3000):
   ```bash
   npm run dev
   ```

4. Abre en tu navegador:
   - Sitio público: `http://localhost:3000/`
   - Panel de administración: `http://localhost:3000/admin`

### Credenciales iniciales por defecto:
- **Usuario**: `admin`
- **Contraseña**: `zorzaladmin2024` *(Se recomienda cambiarla en `/admin` al iniciar)*

---

## 📡 Endpoints del Backend

- `GET /health`: Estado de salud, tiempo de actividad y conexión a base de datos.
- `GET /api/config`: Configuración pública de la emisora (nombre, eslogan, stream, WhatsApp).
- `POST /api/auth/login`: Autenticación de administrador (emite token JWT).
- `GET /api/auth/verify`: Verificación de sesión administrativa.
- `PUT /api/admin/config`: Actualización de la configuración (requiere token Bearer).
- `POST /api/auth/change-password`: Cambio de contraseña de administrador (requiere token Bearer).
- `POST /api/admin/test-stream`: Verificación técnica del stream de audio.

---

## 📜 Licencia

© La Hora del Zorzal — El Canto de Nuestra Tierra. Todos los derechos reservados.

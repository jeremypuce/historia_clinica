# Hospital Vida

Proyecto educativo dividido en dos aplicaciones independientes:

- `frontend/`: interfaz responsive servida por Vite.
- `backend/`: API REST Express con arquitectura por capas, Prisma ORM y PostgreSQL en Supabase.

> **Sólo para aprendizaje.** La API no tiene autenticación ni está preparada para información personal o clínica real. No uses datos reales.

## Arquitectura

El backend separa rutas, controladores, servicios y repositorios. Todos los repositorios comparten el cliente Prisma singleton en `backend/src/lib/prisma.js`.

```text
frontend (Vite) → /api (proxy de desarrollo) → backend (Express)
                                                routes → controllers
                                                → services → repositories
                                                → Prisma singleton → Supabase
```

## Requisitos

- Node.js 22.x
- Una base PostgreSQL de Supabase para ejecutar el backend

## Preparación local

Configura el backend:

```powershell
cd backend
Copy-Item .env.example .env
npm ci
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

Configura el frontend en otra terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Abre <http://127.0.0.1:5173>. Vite reenvía las peticiones `/api` al backend en el puerto `3001`.

## API

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/health` | Comprobar la conexión con PostgreSQL |
| GET | `/api/pacientes?page=1&limit=20&q=ana` | Listar y buscar por nombre, cédula o email |
| GET | `/api/pacientes/:id` | Consultar un registro |
| POST | `/api/pacientes` | Crear un registro |
| PUT | `/api/pacientes/:id` | Reemplazar los campos |
| PATCH | `/api/pacientes/:id` | Actualizar campos seleccionados |
| DELETE | `/api/pacientes/:id` | Eliminar un registro |

## Publicación en GitHub Pages

El workflow `.github/workflows/pages.yml` construye `frontend/` con Node.js 22 y publica el artefacto de Vite en cada push a `main`. La URL del sitio será <https://jeremypuce.github.io/historia_clinica/>.

Antes del primer despliegue, un administrador del repositorio debe abrir **Settings → Pages** y seleccionar **GitHub Actions** como origen de compilación. Después, los pushes a `main` publican el sitio automáticamente.

GitHub Pages sólo aloja contenido estático: no ejecuta Express ni conecta PostgreSQL. El formulario se muestra como demostración y su envío está desactivado en la publicación de Pages. Para guardar datos se necesita desplegar el backend y configurar su API por separado.

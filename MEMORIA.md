# Memoria del proyecto — Bazar Los Estudiantes

## Regla crítica para el agente (Cursor / IA)

**PROHIBIDO hacer `git commit`, `git push`, o cualquier operación que cree commits o los suba al remoto.**

- El usuario se encargará **exclusivamente** de los commits y pushes.
- Motivo: no debe aparecer la IA como co-autora en el historial de GitHub/Git.
- El agente **sí puede** editar archivos, instalar dependencias, correr el servidor local y proponer mensajes de commit en texto.
- Si el usuario pide “commitea” o “pushea”, el agente debe **rechazarlo** y recordarle esta regla, salvo que el usuario anule explícitamente esta memoria por escrito.

---

## Qué es este proyecto

Sitio web sencillo para el **Bazar Los Estudiantes** (Sandra Freire), local en Av. Apoquindo 7490, Las Condes.

- **Público:** catálogo digital de productos (sin pago en línea).
- **Privado:** panel para que Sandra gestione productos e inventario.

Referencias de origen: informe de avance, requerimientos del sitio y carta Gantt (octubre–noviembre 2026).

## Requerimientos funcionales (resumen)

| ID | Qué |
|----|-----|
| RF-01 | Catálogo: nombre, imagen, precio, descripción |
| RF-02 | Detalle de producto |
| RF-03 | Categorías |
| RF-04 | Búsqueda por nombre/palabra clave |
| RF-05 | Disponible / agotado según stock |
| RF-06 | Login al panel admin |
| RF-07 | Crear productos (nombre, categoría, precio, descripción, imagen, stock) |
| RF-08 | Editar y desactivar productos |
| RF-09 | Entradas, salidas y ajustes de stock |
| RF-10 | Resumen de inventario |
| RF-11 | Buscar/filtrar en admin |
| RF-12 | Aviso de stock bajo |
| RF-13 | Historial de movimientos |
| RF-14 | Info del negocio (horarios, ubicación, contacto autorizado) |
| RF-15 | Contacto para compras (canal acordado, sin pago online) |

## No funcionales (resumen)

Usabilidad simple, responsive (PC y móvil), autenticación del panel, validar precios/cantidades (sin stock negativo), privacidad, respaldo, revisar costos antes de publicar.

## Stack elegido (cerrar planificación 1.1.4)

- **Next.js** (App Router) + TypeScript
- **Prisma** + **Supabase Postgres** (proyecto org `BazarLosEstudiantes`, MCP `supabase-bazarlosestudiantes`)
- **Auth** por credenciales (NextAuth / sesión cookie) para el panel
- **Deploy web:** Vercel → https://bazarlosestudiantes.vercel.app
- Estilos con CSS variables (UI clara para no-técnica)

## Producción

| Servicio | Detalle |
|----------|---------|
| Web | https://bazarlosestudiantes.vercel.app |
| Supabase API | https://begorbkencsgipsudbuv.supabase.co |
| Admin seed | ver `.env.example` / variables en Vercel |

Redeploy sin git (respetando la regla de no-commit del agente):

```bash
npx vercel deploy --prod --yes --token "$VERCEL_TOKEN"
```

## Cómo correr en local

```bash
npm install
# .env con DATABASE_URL + DIRECT_URL del pooler Supabase
npx prisma generate
npm run db:seed   # solo si la DB está vacía
npm run dev
```

## Alcance explícitamente fuera

- Pagos en línea / carrito de checkout
- Redes sociales / marketplace externo
- App móvil nativa

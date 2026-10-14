# Bazar Los Estudiantes

Sitio web sencillo: **catálogo público** + **panel de administración e inventario** para el bazar de Sandra (Apoquindo 7490, Las Condes).

Lee `MEMORIA.md` para el contexto del proyecto y la regla de Git.

## Stack

- Next.js 15 (App Router) + TypeScript
- Prisma + Supabase (Postgres)
- NextAuth (credenciales)
- Vercel (producción)

**Producción:** https://bazarlosestudiantes.vercel.app

## Arranque

```bash
npm install
cp .env.example .env   # completa URLs de Supabase + secrets
npx prisma generate
npm run db:seed        # solo si hace falta
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

Credenciales por defecto (seed):

- Correo: `sandra@bazar.local`
- Contraseña: `sandra123`

## Respaldo

Usa backups de Supabase (Dashboard → Database → Backups) o `pg_dump` con la connection string.

## Git

Los commits y pushes los hace el equipo humano. La IA no debe commitear ni pushear (ver `MEMORIA.md`).

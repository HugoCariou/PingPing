# PingPing

Application progressive web app (PWA) minimaliste : listes partagées et secrets isolés.

## Fonctionnalités

- Courses : tri par rayons, ajouts rapides, gestion des articles pris.
- Tâches : suivi des tâches communes et notes.
- Secrets : listes privées avec accès restreint par profil (PostgreSQL RLS).
- PWA : installable sur iOS et Android, support hors-ligne (Workbox).
- Design : composants inspirés de shadcn/ui (palette Zinc).

## Démarrage

```bash
npm install
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`.

## Supabase (Optionnel)

Pour activer la synchronisation entre plusieurs appareils :

1. Créer un projet sur Supabase.
2. Exécuter `supabase/schema.sql`.
3. Renseigner `.env` :
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

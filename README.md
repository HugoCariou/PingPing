# PingPing — Application PWA Partagée pour Couple

Une application progressive web app (PWA) minimaliste, élégante et apaisante pour deux personnes, combinant **listes partagées en temps réel** et **coffre à cadeaux secret anti-spoil**.

---

## Fonctionnalités

### 1. Courses en commun
- Tri par rayons (Fruits & Légumes, Frais & Crémerie, Épicerie, Boulangerie, Boissons, etc.).
- Ajout rapide et suggestions d'articles fréquents en un clic.
- Cases à cocher tactiles et gestion des articles déjà pris.

### 2. To-Do partagée
- Missions du quotidien, réservations et projets à deux.
- Ajout de notes complémentaires et historique des tâches terminées.

### 3. Coffre secret (Idées cadeaux anti-spoil)
- Données strictement isolées par utilisateur (garanti côté base de données par PostgreSQL Row Level Security).
- Suivi du statut des surprises : *Idée ➔ Commandé ➔ Reçu ➔ Prêt*.
- Estimation de budget et lien direct vers le produit.

### 4. PWA Mobile-First
- Installable en plein écran (*standalone*) sur iOS (Safari) et Android (Chrome).
- Support du mode hors-ligne via Service Worker (Workbox).
- Design sobre et apaisant inspiré des standards **shadcn/ui** (palette Zinc neutre).

---

## Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`. Le sélecteur de vue dans le bandeau supérieur permet de basculer instantanément entre les deux profils pour vérifier l'étanchéité du coffre secret.

---

## Backend Cloud Supabase (Optionnel)

L'application fonctionne immédiatement en mode local-first. Pour activer la synchronisation permanente en ligne entre deux téléphones distants :

1. Créer un projet gratuit sur [Supabase](https://supabase.com).
2. Exécuter le script `supabase/schema.sql` dans le SQL Editor.
3. Renseigner les variables d'environnement dans un fichier `.env` :
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

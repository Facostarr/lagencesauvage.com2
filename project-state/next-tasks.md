# Next Tasks — Refonte lagencesauvage.com

## Priorité immédiate (Phase 0)

1. Cloner le repo localement et créer la branche `refonte-2026`
2. Installer les dépendances Tailwind v4 : `npm install -D @tailwindcss/postcss postcss`
3. Créer `postcss.config.js` et `assets/css/main.css` (point d'entrée Tailwind v4)
4. Modifier `config/_default/hugo.toml` : supprimer `uglyURLs = true`, ajouter `postcss` aux security.exec
5. Mettre à jour `config/_default/menus.toml` : URLs pretty (/services/, /about/, etc.)
6. Compléter le `vercel.json` avec toutes les redirections 301 (voir playbook)
7. Supprimer `Hugo_projet/` et le dossier `public/` (pages HTML statiques — sera régénéré par Hugo)
8. Ajouter `.mcp.json` et `.claude/` au `.gitignore`
9. Tester `hugo server` — corriger les erreurs
10. Push initial → vérifier la Preview URL Vercel

## En attente de Franck

- Photo professionnelle (franck-sauvage.jpg — 400x400 min)
- Liste des clients autorisés pour la preuve sociale (noms + entreprises)
- Screenshots anonymisés de livrables réels (flux n8n, chatbot, dashboard)
- Choix typographie : DM Serif Display + DM Sans ou Fraunces + Work Sans (ou autre)

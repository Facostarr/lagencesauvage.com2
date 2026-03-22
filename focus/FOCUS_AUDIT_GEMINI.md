# FOCUS — Corrections Audit Gemini (pré-Phase 1)

> Audit réalisé via Gemini Pro (thinking high) le 2026-03-22.
> Objectif : corriger les 9 points identifiés AVANT de démarrer la Phase 1.
> Priorité : toutes les corrections sont rapides (< 30 min total).

---

## Contexte

Audit croisé Claude (Setup Factory) + Gemini du setup complet du projet lagencesauvage.com2. Gemini a identifié des points valides sur l'architecture technique (Hugo + Tailwind v4 + Vercel) et le setup Claude Code. Les faux positifs ont été filtrés (Gemini ne connaît pas bien les features Claude Code).

---

## Corrections à appliquer

### 1. vercel.json — Supprimer le curl, utiliser le preset Hugo natif

**Problème** : Le `buildCommand` télécharge Hugo via curl à chaque build. Anti-pattern : pas de cache, risque de timeout, risque de rate-limit GitHub.

**Action** :
```json
{
  "buildCommand": "npm install && hugo --gc --minify",
  "outputDirectory": "public",
  "framework": "hugo"
}
```

**Action complémentaire** : Dans Vercel Dashboard → Settings → Environment Variables, ajouter :
- `HUGO_VERSION` = `0.145.0`

**Impact** : Aussi mettre à jour le script `build` dans package.json pour cohérence :
```json
"build": "hugo --gc --minify"
```

---

### 2. assets/css/main.css — Ajouter les directives @source pour Tailwind v4

**Problème** : Tailwind v4 scanne automatiquement les fichiers pour détecter les classes utilisées, mais depuis `assets/css/`, il ne voit PAS `layouts/` ni `content/`. Résultat : des classes Tailwind dans les templates Hugo seront absentes du CSS final.

**Action** : Ajouter après `@import "tailwindcss"` :
```css
@import "tailwindcss";

/* Indispensable Hugo : dire à TW v4 où scanner les classes */
@source "../../layouts";
@source "../../content";

@theme {
  /* ... existing theme config ... */
}
```

---

### 3. Liens internes .html dans le blog — 3 articles à corriger

**Problème** : 3 articles contiennent des liens internes pointant vers des URLs `.html`. Avec la migration en pretty URLs, ces liens déclencheront une chaîne de redirection (lien → 301 → page), ce qui dégrade le SEO (budget crawl) et l'UX.

**Note** : Ce sont des corrections de LIENS (URLs techniques), pas de contenu éditorial. La règle "blog intouchable" protège le contenu texte, pas les URLs de navigation.

**Articles et corrections** :

#### a) `content/blog/automatiser-emails-gmail-ia.md`
Dernière ligne du fichier :
```
AVANT : [Réservez votre audit gratuit](/index.html#audit-gratuit)
APRÈS : [Réservez votre audit gratuit](/#audit-gratuit)
```

#### b) `content/blog/ia-cabinet-comptable-donnees-2025-reussir-2026.md`
Section "Passez à l'action" :
```
AVANT : [Réserver mon audit gratuit →](/audit-ia-gratuit.html)
APRÈS : [Réserver mon audit gratuit →](/diagnostic/)
```
(Note : /audit-ia-gratuit.html n'a pas de redirection 301 dans vercel.json ! Soit ajouter une redirection, soit corriger le lien vers la destination prévue.)

#### c) `content/blog/impact-ia-pme-françaises-2025.md`
Section CTA en fin d'article :
```
AVANT : [→ Découvrez le Diagnostic de Transformation IA](/diagnostic-transformation-ia.html)
APRÈS : [→ Découvrez le Diagnostic de Transformation IA](/diagnostic/)
```

---

### 4. CLAUDE.md — Ajouter règle sur les redirections

**Problème** : Hugo peut gérer des redirections via `aliases` dans le front matter. Si Claude Code utilise les deux mécanismes (vercel.json + Hugo aliases), risque de boucles ou conflits.

**Action** : Ajouter dans la section "Règles critiques" :
```
9. **REDIRECTIONS = VERCEL.JSON UNIQUEMENT** : ne jamais utiliser les `aliases` Hugo pour les redirections. Single source of truth = vercel.json.
```

---

### 5. CLAUDE.md — Ajouter règle sur les classes Tailwind dynamiques

**Problème** : Dans les templates Go Hugo, une classe dynamique comme `bg-{{ .Params.color }}-500` ne sera pas détectée par Tailwind v4 (le scanner ne peut pas résoudre les variables Go).

**Action** : Ajouter dans la section "Conventions" ou "Règles critiques" :
```
10. **PAS DE CLASSES TAILWIND DYNAMIQUES INCOMPLÈTES** : dans les templates Go, ne jamais construire une classe Tailwind par concaténation (ex: `bg-{{ .Params.color }}-500`). Utiliser des classes complètes ou des mappings explicites.
```

---

### 6. project-state/lessons.md — Ajouter les leçons Gemini

**Action** : Ajouter ces entrées :

```markdown
## Tailwind v4 + Hugo

- Tailwind v4 ne scanne PAS automatiquement `layouts/` et `content/` depuis `assets/css/`. Il faut des directives `@source "../../layouts"` et `@source "../../content"` dans main.css.
- Ne jamais construire une classe Tailwind par concaténation dynamique dans les templates Go — le scanner ne résout pas les variables Go.

## Vercel

- Ne pas télécharger Hugo via curl dans le buildCommand. Utiliser `"framework": "hugo"` + variable d'environnement `HUGO_VERSION` dans Vercel Dashboard.
- Les serverless functions (api/) utilisent pdfkit + nodemailer = potentiellement lourd. Limite Vercel = 50MB zippé, timeout 10s (Hobby) / 15s (Pro). Surveiller au premier déploiement.
- Pour tester les serverless functions localement : `vercel dev` (pas `hugo server` qui ne les voit pas).

## SEO/GEO — Migration blog

- Les redirections 301 protègent le trafic entrant, mais les liens INTERNES dans le markdown des articles doivent aussi être mis à jour (sinon chaîne de redirection interne = mauvais pour le budget crawl).
- En Phase 4 (intégration blog), mapper la structure HTML actuelle des articles AVANT de coder le nouveau layout : balises sémantiques (article, header), IDs des titres, JSON-LD, dates. Un changement de DOM peut dégrader les citations LLM.
- Redirections = vercel.json UNIQUEMENT. Ne jamais utiliser les `aliases` Hugo (risque de conflit/boucle).
```

---

### 7. docs/playbook-refonte.md — Notes à ajouter

**Action** : Ajouter dans la section Phase 0 :
```
- [ ] Configurer HUGO_VERSION dans Vercel Environment Variables
- [ ] Vérifier taille des serverless functions au premier déploiement Vercel
```

**Action** : Ajouter dans la section Phase 4 :
```
### Pré-requis avant de coder le layout blog
1. Mapper la structure HTML actuelle des 8 articles (balises sémantiques, IDs titres, JSON-LD existant)
2. Le nouveau layout DOIT préserver : balise <article>, structure <header>, IDs auto-générés par Hugo pour les titres, dates exactes (date + lastmod)
3. Ajouter le schema markup BlogPosting/Article si absent
```

**Action** : Ajouter une note générale :
```
### Serverless Functions — Test local
`hugo server` ne fait PAS tourner les fonctions api/. Pour tester l'intégration formulaire + serverless : utiliser `vercel dev`. Non bloquant tant qu'on ne modifie pas les formulaires.
```

---

### 8. vercel.json — Redirection manquante

**Problème** : L'article `ia-cabinet-comptable` contient un lien vers `/audit-ia-gratuit.html` mais cette URL n'a PAS de redirection 301 dans vercel.json.

**Action** : Soit corriger le lien dans l'article (correction #3b), soit ajouter la redirection :
```json
{ "source": "/audit-ia-gratuit.html", "destination": "/diagnostic/", "statusCode": 301 }
```

**Recommandation** : Faire les deux (ceinture + bretelles).

---

### 9. project-state/status.md — Mettre à jour

**Action** : Cocher les tâches Phase 0 déjà complétées par la session Claude Code :
- [x] Installer Tailwind CSS v4
- [x] Migrer config Hugo (uglyURLs, menus, PostCSS security.exec)
- [x] Créer le vercel.json complet
- [x] Supprimer Hugo_projet/
- [x] Ajouter .mcp.json au .gitignore

Et ajouter les nouvelles tâches de cet audit :
- [ ] Corriger vercel.json buildCommand (preset Hugo natif)
- [ ] Ajouter @source dans main.css
- [ ] Corriger 3 liens .html dans articles blog
- [ ] Ajouter règles CLAUDE.md (redirections vercel.json only + classes TW dynamiques)
- [ ] Configurer HUGO_VERSION dans Vercel Dashboard

---

## Ordre d'exécution recommandé

1. vercel.json + package.json (correction #1 + #8)
2. assets/css/main.css (correction #2)
3. 3 articles blog (correction #3)
4. CLAUDE.md (corrections #4 + #5)
5. project-state/lessons.md (correction #6)
6. project-state/status.md (correction #9)
7. docs/playbook-refonte.md (correction #7)
8. Commit : `fix: corrections audit Gemini pré-Phase 1`
9. Configurer HUGO_VERSION dans Vercel Dashboard (action manuelle)
10. Push → vérifier le build Vercel avec le nouveau preset

---

## Post-corrections

Une fois ces 9 points corrigés, le setup est validé pour démarrer la Phase 1 (Design System). Les corrections Phase 4 (mapping HTML blog) sont documentées dans le playbook pour le moment venu.

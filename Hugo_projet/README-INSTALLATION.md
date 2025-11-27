# 🚀 Installation du Blog Hugo - L'Agence Sauvage

## Pré-requis

1. **Git** installé sur votre machine
2. **Hugo** installé (optionnel pour test local) : https://gohugo.io/installation/

---

## 📦 Installation rapide (5 minutes)

### Étape 1 : Cloner votre repo actuel

```bash
git clone https://github.com/Facostarr/lagencesauvage.com2.git
cd lagencesauvage.com2
```

### Étape 2 : Copier les fichiers Hugo

Décompressez le ZIP et copiez TOUS les dossiers/fichiers dans votre repo :

```bash
# Sur Mac/Linux
cp -r chemin/vers/hugo-blog-agencesauvage/* .

# Ou copiez manuellement ces dossiers :
# - config/
# - content/
# - layouts/
# - static/assets/css/blog.css
# - .github/
```

### Étape 3 : Configurer Vercel pour Hugo

Créez le fichier `vercel.json` à la racine :

```json
{
  "buildCommand": "hugo --minify",
  "outputDirectory": "public",
  "installCommand": "yum install -y golang && go install github.com/gohugoio/hugo@latest",
  "framework": null
}
```

**OU** plus simple - allez dans Vercel Dashboard :
1. Settings → General → Framework Preset → **Hugo**
2. Build Command : `hugo --minify`
3. Output Directory : `public`

### Étape 4 : Push vers GitHub

```bash
git add .
git commit -m "feat: ajout blog Hugo avec SEO/GEO optimisé"
git push origin main
```

### Étape 5 : Vérifier le déploiement

Vercel détecte automatiquement le push et déploie.
Votre blog sera accessible sur : `https://www.lagencesauvage.com/blog/`

---

## 🧪 Test local (optionnel)

```bash
# Installer Hugo si pas fait
brew install hugo  # Mac
# ou
sudo apt install hugo  # Ubuntu

# Lancer le serveur de dev
hugo server -D

# Ouvrir http://localhost:1313/blog/
```

---

## 📝 Ajouter un nouvel article

1. Créer un fichier dans `content/blog/mon-article.md`
2. Copier le front matter du fichier exemple
3. Rédiger le contenu en Markdown
4. Commit + Push → Publication automatique !

### Template front matter minimal :

```yaml
---
title: "Titre de l'article"
date: 2025-01-20
description: "Description SEO de 150-160 caractères max"
summary: "Résumé court pour la page liste"
categories:
  - Guides pratiques
tags:
  - tag1
  - tag2
emoji: "🚀"
draft: false
---

Contenu de l'article en Markdown...
```

---

## 🔗 Structure des URLs

- Liste : `/blog/`
- Article : `/blog/mon-article.html`
- Catégories : `/blog/categories/guides-pratiques/`
- Tags : `/blog/tags/automatisation/`
- RSS : `/blog/index.xml`
- Sitemap : `/sitemap-blog.xml`

---

## ⚠️ Important

Les pages existantes (index.html, services.html, etc.) ne sont PAS affectées.
Hugo génère UNIQUEMENT la section /blog/*.

---

## 🆘 Support

Questions ? hello@lagencesauvage.com

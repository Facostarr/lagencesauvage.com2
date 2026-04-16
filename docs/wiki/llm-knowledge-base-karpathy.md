# Wiki — LLM Knowledge Base (méthode Karpathy)

> Référence interne. Mise à jour : 2026-04-16.

## Contexte

Le 1er avril 2026, Andrej Karpathy (co-fondateur OpenAI, ex-directeur IA Tesla) publie un thread viral sur X :  
[Tweet original →](https://x.com/karpathy/status/2039805659525644595)  
~20 millions de vues. Le 3 avril, il publie un "Idea File" (GitHub Gist) : l'architecture complète en texte brut, sans code exécutable — à coller dans Claude Code ou Cursor pour que l'agent construise le système.

## Concept central

> "Shift a large fraction of token budget from manipulating code to manipulating knowledge stored as markdown."
> — Andrej Karpathy

**Principe** : au lieu d'utiliser un LLM comme générateur de code ou chatbot éphémère, l'utiliser comme **bibliothécaire permanent** qui compile des sources brutes en une wiki Markdown interconnectée, persistante et auditable.

**Différence clé avec RAG** :
| Dimension | RAG classique | LLM Wiki |
|-----------|--------------|----------|
| Persistance | Réponses éphémères | Connaissance compilée permanente |
| Synthèse | Re-dérivée à chaque requête | Incrémentale, se bonifie |
| Auditabilité | Embeddings opaques | Markdown tracé, backlinks vérifiables |
| Coût | Stateless (re-traite à chaque fois) | Investissement amorti |

## Architecture (3 dossiers)

```
vault/
├── raw/          # Sources immuables — l'IA ne modifie JAMAIS ce dossier
│   ├── articles/
│   ├── papers/
│   └── assets/
├── wiki/         # Domaine de l'IA — créé et maintenu par l'agent
│   ├── index.md        # Catalogue de toutes les pages
│   ├── log.md          # Journal append-only (grep-able)
│   ├── overview.md     # Synthèse haut niveau
│   ├── concepts/       # Pages concept
│   ├── entities/       # Pages entité (personnes, outils, produits)
│   └── comparisons/    # Tableaux comparatifs
└── CLAUDE.md     # Schéma : conventions, templates, workflows pour l'agent
```

**Règle d'or** : `raw/` est immuable (l'humain y dépose), `wiki/` est le domaine de l'IA.

## 3 opérations fondamentales

### Ingest
1. Déposer une source dans `raw/`
2. Demander à l'agent : "ingest [fichier]"
3. L'agent lit la source, crée/met à jour 10-15 pages wiki simultanément, actualise `index.md` et `log.md`

### Query  
1. Poser une question à l'agent
2. L'agent consulte le wiki (via `index.md` pour trouver les pages pertinentes)
3. Synthèse avec citations → output formaté (Markdown, slides Marp, tableau)
4. L'output peut être réintégré en wiki (compounding)

### Lint
Audit périodique : contradictions, pages orphelines, lacunes de recherche, références manquantes.

## Schéma CLAUDE.md (conventions)

Le fichier `CLAUDE.md` à la racine définit :
- **Frontmatter YAML obligatoire** sur chaque page wiki : `title`, `type` (concept/entity/source-summary/comparison), `sources`, `related`, `created`, `updated`, `confidence`
- **Nommage** : kebab-case, préfixes par type (`concept-`, `entity-`, `source-`)
- **Backlinks** : chaque page liste ses relations vers d'autres pages
- **Log** : format `## [YYYY-MM-DD] operation | description` (grep-able)

## Chiffres de référence

- Wiki de Karpathy : 100+ articles, ~400 000 mots
- Coût ingestion : ~0,01–0,10 € par document (API Claude)
- Setup initial : ~5 minutes (copier le Gist dans Claude Code, créer les dossiers, ouvrir dans Obsidian)
- Contexte suffisant pour raisonnement multi-hop sans base vectorielle jusqu'à ~400k mots

## Outils complémentaires

| Outil | Rôle |
|-------|------|
| **Obsidian** | Frontend visuel — graph view, navigation rapide, canvas |
| **Obsidian Web Clipper** | Clip d'articles web → Markdown dans `raw/` |
| **qmd** | Recherche hybride (BM25 + vector + LLM re-ranking) pour grandes wikis |
| **Git** | Versioning de l'évolution de la wiki |
| **Marp** | Génération de slides depuis les pages wiki |
| **Dataview** (plugin Obsidian) | Dashboards dynamiques sur frontmatter YAML |
| **NetworkX/Gephi** | Analyse du graphe sémantique — centralité, communautés |

## Cas d'usage entreprise

| Secteur | Application |
|---------|------------|
| RH / Onboarding | Base de connaissance corporate queryable par les nouveaux arrivants |
| R&D | Wiki patents/papiers cross-projets |
| Knowledge Management | Slack/meetings/tickets → wiki d'équipe (anti-tribal knowledge loss) |
| Support client | Résolution de tickets via wiki historique sans re-expliquer |
| Due diligence | Analyse évolutive auditable |
| Gestion de projet | CR réunions → wiki projet avec historique de décisions |

## Implémentation PME (stack low-code)

**Stack recommandée** : Obsidian + Claude API + n8n

```
Sources (emails, CR, PDF) 
  → n8n (trigger + nettoyage)
  → Claude API (ingest → wiki Markdown)
  → Obsidian vault (stockage local, souveraineté RGPD)
  → n8n (sync optionnel vers Notion/Slack)
```

**Coût mensuel estimé** :
- Obsidian : gratuit (usage personnel) / 50$/an (commercial)
- Claude API : variable selon volume (~10-50€/mois pour PME active)
- n8n : self-hosted gratuit / cloud ~20€/mois

## Limites et points d'attention

1. **Scaling** : au-delà de ~1M mots, le raisonnement multi-hop peut se dégrader sans index vectoriel
2. **Hallucinations** : mitigées par grounding sur sources immuables + lint régulier
3. **Multi-utilisateurs** : vaults séparés par équipe ou par domaine (pas de vault partagé sans gouvernance)
4. **Maintenance schéma** : le CLAUDE.md doit évoluer avec la wiki — c'est un actif à maintenir
5. **Qualité des sources** : garbage in, garbage out — la curation de `raw/` est critique

## Références clés

- [Tweet original Karpathy](https://x.com/karpathy/status/2039805659525644595)
- [VentureBeat — analyse architecture](https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an)
- [Antigravity Codes — guide complet](https://antigravity.codes/blog/karpathy-llm-wiki-idea-file)
- [GitHub — Karpathy LLM Wiki Stack](https://github.com/ScrapingArt/Karpathy-LLM-Wiki-Stack)
- [Medium — Mehul Gupta — explication](https://medium.com/data-science-in-your-pocket/andrej-karpathys-llm-knowledge-bases-explained-2d9fd3435707)
- [Jose Luis Chavez Calva — Substack](https://joseluischavezcalva.substack.com/p/karpathys-llm-knowledge-bases)

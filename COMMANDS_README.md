# Commandes Slash — Projet Refonte lagencesauvage.com

4 commandes disponibles dans Claude Code pour piloter le projet.
Tape `/` dans le terminal Claude Code pour les voir.

---

## `/start-session`

**Quand :** au début de chaque session de travail.

Charge automatiquement le contexte : phase en cours, dernière tâche complétée, état Git, prochaines priorités. Claude sait immédiatement où on en est sans que tu aies à le briefer.

---

## `/end-session`

**Quand :** à la fin de chaque session de travail.

Met à jour les fichiers project-state/ (status, next-tasks, changelog, lessons). Propose un commit si des modifications sont en cours. Rappelle la Preview URL Vercel si un push a été fait.

---

## `/push-preview`

**Quand :** tu veux envoyer le travail en cours sur la branche `refonte-2026` et obtenir une Preview URL Vercel.

Vérifie qu'on est sur la bonne branche, que Hugo compile sans erreur, que les redirections sont en place. Fait le commit + push + récupère la Preview URL.

---

## `/quality-gate`

**Quand :** avant un push important ou avant de demander ta validation sur une page/phase.

Passe la checklist complète : conversion (témoignages, KPI, emojis, CTA, preuves visuelles), SEO (meta, schema, sitemap, OG), technique (responsive, accessibilité, perf), redirections 301, protection blog, et hygiène Git. Signale les items en échec à corriger.

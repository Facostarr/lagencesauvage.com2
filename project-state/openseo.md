# OpenSEO (instance self-host)

Mis en place le 2026-09-12. Alternative open source a Semrush/Ahrefs (`every-app/open-seo`, MIT).
Sert deux choses : le SEO du site ASV, et l'audit SEO comme porte d'entree en clientele TPE/PME.

## Ou ca tourne

`vps1-prod`, dans `/opt/open-seo`, en Docker (image `ghcr.io/every-app/open-seo:latest`).
Donnees dans le volume `open-seo_open_seo_data`, il n'y a pas de base externe a sauvegarder a part lui.

Exploitation : `/opt/open-seo/openseo.sh {status|start|stop|restart|logs|update|key}`.

## Ce que la lecture du compose ne dit pas

**Port 3011, pas 3001.** Le port par defaut d'OpenSEO est deja pris par `twenty-server` sur ce VPS.

**Reseau `twenty_default`.** C'est celui de `cloudflared`. Le conteneur y est attache pour que le tunnel
le joigne par son nom (`http://open-seo:3011`) sans ouvrir de port public. Le port n'est publie que sur
`127.0.0.1`.

**`ALLOWED_HOST` fait du filtrage de Host.** Une requete avec un autre `Host` que `seo.lagencesauvage.com`
recoit un 403 de Vite, y compris depuis le reseau Docker. Un 403 en test local ne veut donc pas dire
que le service est casse : refaire le test avec `-H 'Host: seo.lagencesauvage.com'`.

**Le mode Docker tourne sans authentification** (`AUTH_MODE=local_noauth`, admin injecte `admin@localhost`).
C'est Cloudflare Access qui protege, rien d'autre. Ne jamais exposer ce port autrement.

**Premier demarrage long.** L'image compile l'app au premier `up` : environ 60 secondes avant le premier 200.
Un conteneur `health: starting` pendant une minute est normal, ce n'est pas un echec.

**Telemetrie coupee** (`OPENSEO_TELEMETRY_DISABLED=1` et `DO_NOT_TRACK=1`).

## Couts

OpenSEO self-host ne coute rien. DataForSEO est le seul poste : pay-as-you-go, sans abonnement,
1 $ offert a l'inscription, recharge minimum 50 $. Le service heberge d'OpenSEO (10 $/mois) facture
28 % de marge sur DataForSEO, le self-host paye le prix nu.

Surveiller le solde sans depenser un centime, depuis le VPS (l'endpoint est gratuit, et la
commande ne contient pas la cle, elle la lit dans le `.env`) :

```sh
cd /opt/open-seo && K=$(grep '^DATAFORSEO_API_KEY=' .env | cut -d= -f2-)   && curl -s -H "Authorization: Basic $K" https://api.dataforseo.com/v3/appendix/user_data
```

La cle est le base64 de `login:motdepasse`, pas le mot de passe API seul. Les deux se ressemblent
sur le dashboard et seul le base64 fonctionne : un mot de passe brut est accepte par le fichier
mais rejete par l'API, et OpenSEO le signale en preflight.

Les outils MCP consomment des credits a chaque appel. Les skills tiennent un journal de recherche
dans le contexte projet et sont censees reutiliser un resultat de moins de 30 jours plutot que
le racheter, mais ca reste a surveiller les premieres semaines.

## Exposition et acces

Publie via le tunnel cloudflared `vps1-prod` sur `seo.lagencesauvage.com`, route
`http://open-seo:3011`. Le DNS est un CNAME proxifie cree automatiquement par Cloudflare.
Protege par l'application Cloudflare Access `openseo`, qui reutilise la politique `Allow team`
(une seule adresse autorisee, celle de Franck), la meme que le CRM. Managed OAuth est active
sur cette application, c'est ce qui permet au MCP de s'authentifier.

Team domain Access : `lagencesauvage.cloudflareaccess.com`.

**Bot Fight Mode a du etre desactive sur la zone `lagencesauvage.com`** le 2026-09-12.
Il challengeait tout client non navigateur, donc il renvoyait un 403 `cf-mitigated: challenge`
sur `/mcp` avant meme qu'Access reponde, ce qui rendait le MCP inutilisable. Sur le plan gratuit
il s'applique a toute la zone et n'accepte aucune exception par regle WAF.

Ce que ca ne coute pas : `lagencesauvage.com` et `www` pointent vers Vercel, `geo.` et `mcp.`
vers l'IP du VPS, tous en DNS-only donc hors proxy Cloudflare. Bot Fight Mode ne couvrait que
`seo.` et `crm.`, les deux seuls hostnames proxifies, tous deux deja derriere Access. La couche
etait redondante. **Si un hostname proxifie sans Access est ajoute un jour a cette zone, ce
constat tombe et la question se repose.**

Verifier l'etat sans se connecter, depuis le VPS :
`curl -i -X POST https://seo.lagencesauvage.com/mcp` doit renvoyer `401` avec un en-tete
`www-authenticate: Bearer`. Un `403` avec `cf-mitigated: challenge` signifie que Bot Fight Mode
est revenu.

## MCP et skills

Endpoint MCP : `https://seo.lagencesauvage.com/mcp` (46 outils), declare en portee **locale**
au projet lagencesauvage.com2 (`claude mcp add --transport http openseo <url> -s local`).
La premiere utilisation demande une authentification OAuth, a faire depuis une session
interactive, le flux ouvrant le navigateur.
Les 9 skills officielles sont installees dans `.claude/skills/` **prefixees `openseo-`**, parce que
`keyword-research`, `competitor-analysis` et `seo-audit` existaient deja, importees de packs tiers.
Le prefixe evite la collision de declencheurs, et il faudra le remettre a chaque mise a jour des skills.

Le plugin Claude Code officiel n'est pas installe : son `mcp.json` pointe vers `app.openseo.so`,
donc vers le service payant, pas vers cette instance.

A noter : la ligne `keyword-research` du releve d'arbitrage (`.claude/skills/README-arbitrage.md`)
est caduque depuis cette installation. Son motif de suppression etait l'absence d'outils de volume
de recherche dans le projet, ce qui n'est plus vrai.

## Ce que ca ne fait pas

C'est un instrument de mesure, pas un levier d'acquisition. D'apres le diagnostic d'aout 2026,
le deficit du blog est l'autorite et la falaise du rang 5, pas le manque de donnees. Les modules
qui repondent vraiment a ce diagnostic sont les backlinks (`openseo-link-prospecting`) et le
keyword gap concurrentiel, la ou GSC est aveugle par construction.

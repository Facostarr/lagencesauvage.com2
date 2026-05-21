// Lead Magnet A — "50 Prompts IA Prêts à l'Emploi pour les PME"
// L'Agence Sauvage — lagencesauvage.com
// Généré avec docx@9.6.1

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, LevelFormat,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── COULEURS ───────────────────────────────────────────────────────────────
const C = {
  indigo:      "4F46E5",
  indigoLight: "EEF2FF",
  indigoMid:   "C7D2FE",
  indigoDark:  "3730A3",
  slate:       "0F172A",
  slateMed:    "334155",
  slateLight:  "64748B",
  white:       "FFFFFF",
  bgLight:     "F8FAFC",
  separator:   "E2E8F0",
};

// A4 avec marges 1 pouce (1440 DXA)
const PAGE_W  = 11906;
const PAGE_H  = 16838;
const MARGIN  = 1440;
const CW      = PAGE_W - 2 * MARGIN; // 9026 DXA

const noB = { style: BorderStyle.NONE, size: 0, color: C.white };
const NB  = { top: noB, bottom: noB, left: noB, right: noB };

// ─── ASSETS ─────────────────────────────────────────────────────────────────
const logoPath = path.resolve(__dirname, '../../static/assets/images/Logo-Agence-Sauvage.svg');
const logoData = fs.readFileSync(logoPath);

// ─── HELPERS ────────────────────────────────────────────────────────────────

function sp(before, after) { return { spacing: { before, after } }; }

function gap(h = 160) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun("")] });
}

// PNG 1x1 transparent — fallback requis par docx v9 pour les SVG
const PNG_FALLBACK = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

function logoImg(w, h) {
  return new ImageRun({
    type: "svg",
    data: logoData,
    fallback: { type: "png", data: PNG_FALLBACK },
    transformation: { width: w, height: h },
    altText: { title: "Logo L'Agence Sauvage", description: "Logo", name: "Logo" },
  });
}

// Ligne séparatrice
function rule(color = C.separator) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    children: [new TextRun("")],
  });
}

// Cellule pleine largeur dans un tableau (helper)
function fullCell(children, fillColor, borders = NB, margins = { top: 160, bottom: 160, left: 280, right: 280 }) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CW, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        borders,
        margins,
        children,
      })],
    })],
  });
}

// En-tête de catégorie (nouvelle page + bandeau indigo)
function catHeader(num, title) {
  return [
    new Paragraph({ children: [new PageBreak()] }),
    fullCell([
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: `CATÉGORIE ${num}`, bold: true, size: 18, color: C.indigoMid, font: "Arial" })],
      }),
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: title, bold: true, size: 32, color: C.white, font: "Arial" })],
      }),
    ], C.indigo),
    gap(200),
  ];
}

// Entrée de prompt
function promptEntry(num, title, use, lines, time) {
  const leftBorder = {
    top: noB, bottom: noB, right: noB,
    left: { style: BorderStyle.SINGLE, size: 20, color: C.indigo },
  };
  return [
    new Paragraph({
      ...sp(260, 60),
      children: [
        new TextRun({ text: `${num}. `, bold: true, size: 22, color: C.indigo, font: "Arial" }),
        new TextRun({ text: title, bold: true, size: 22, color: C.slate, font: "Arial" }),
      ],
    }),
    new Paragraph({
      ...sp(0, 80),
      children: [
        new TextRun({ text: "Usage : ", bold: true, italics: true, size: 18, color: C.slateMed, font: "Arial" }),
        new TextRun({ text: use, italics: true, size: 18, color: C.slateLight, font: "Arial" }),
      ],
    }),
    new Table({
      width: { size: CW, type: WidthType.DXA },
      columnWidths: [CW],
      rows: [new TableRow({
        children: [new TableCell({
          width: { size: CW, type: WidthType.DXA },
          shading: { fill: C.indigoLight, type: ShadingType.CLEAR },
          borders: leftBorder,
          margins: { top: 120, bottom: 120, left: 200, right: 160 },
          children: lines.map((line, i) => new Paragraph({
            spacing: { before: 0, after: line === "" ? 80 : 20 },
            children: [new TextRun({ text: line, size: 17, font: "Courier New", color: C.slate })],
          })),
        })],
      })],
    }),
    new Paragraph({
      ...sp(80, 60),
      children: [
        new TextRun({ text: "Gain estime : ", bold: true, size: 16, color: C.indigo, font: "Arial" }),
        new TextRun({ text: time, size: 16, color: C.slateMed, font: "Arial" }),
      ],
    }),
    new Paragraph({
      spacing: { before: 40, after: 0 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.separator } },
      children: [new TextRun("")],
    }),
  ];
}

// ─── DONNÉES — 50 PROMPTS ───────────────────────────────────────────────────

const CATEGORIES = [
  {
    num: 1, title: "FINANCE & RECOUVREMENT",
    prompts: [
      {
        num: 1, title: "Relance impayé — amiable (niveau 1)",
        use: "Relancer une facture en retard sans froisser la relation commerciale",
        lines: [
          "Agis comme un responsable recouvrement empathique.",
          "Facture n°[NUMÉRO] — [MONTANT]€ — Client : [NOM] — échue depuis [X] jours.",
          "Rédige un email de relance amiable (4 lignes max) qui rappelle l'échéance,",
          "propose un règlement rapide, et mentionne la possibilité d'un délai",
          "si une difficulté passagère explique le retard. Ton professionnel et courtois.",
        ],
        time: "10 min de rédaction + 5 min relecture = 15 min nets",
      },
      {
        num: 2, title: "Relance impayé — ferme (niveau 2)",
        use: "Deuxième relance, ton plus direct, avant mise en demeure",
        lines: [
          "Agis comme un directeur administratif et financier.",
          "Facture n°[NUMÉRO] — [MONTANT]€ — [CLIENT] — impayée depuis [X] jours.",
          "Rédige un email ferme (non agressif) rappelant les pénalités de retard",
          "prévues aux CGV et fixant une échéance de règlement sous 5 jours ouvrés.",
          "Mentionne qu'une mise en demeure suivra sans réponse.",
        ],
        time: "10 min nets",
      },
      {
        num: 3, title: "Mise en demeure — niveau 3",
        use: "Courrier formel avant procédure, à faire valider par votre conseil",
        lines: [
          "Agis comme un juriste en droit des affaires français.",
          "Débiteur : [SOCIÉTÉ] — Montant : [MONTANT]€ — Facture : [N°] — Date : [DATE].",
          "Rédige un courrier de mise en demeure conforme au droit français.",
          "Inclus : intérêts de retard au taux légal, indemnité forfaitaire de 40€,",
          "délai de 8 jours et mention des voies de recours disponibles.",
        ],
        time: "20 min nets — à valider avec votre expert-comptable",
      },
      {
        num: 4, title: "Plan d'urgence trésorerie — 60 jours",
        use: "Traverser une tension de trésorerie avec un plan d'action concret",
        lines: [
          "Agis comme un DAF de transition expert en PME françaises.",
          "Situation : tréso actuelle [X€], charges fixes/mois [X€],",
          "encours clients [X€], dettes fournisseurs urgentes [X€].",
          "Propose un plan d'action sur 60 jours : accélération encaissements,",
          "négociation délais fournisseurs et 3 leviers d'économie rapides.",
        ],
        time: "30 min nets — vs 2h sans IA",
      },
      {
        num: 5, title: "Vulgarisation du bilan comptable",
        use: "Comprendre son bilan sans être expert-comptable",
        lines: [
          "Tu es un professeur de finance d'entreprise très pédagogue.",
          "Mon bilan : Fonds de Roulement [X€] — BFR [X€] — Trésorerie Nette [X€].",
          "Explique ces 3 concepts avec une analogie simple (ex : réservoir d'eau).",
          "Conclus sur ce que mes chiffres signifient pour la santé de mon entreprise.",
          "Zéro jargon comptable. Niveau : dirigeant non-financier.",
        ],
        time: "15 min nets",
      },
      {
        num: 6, title: "Calcul de prix de vente — artisan et prestataire",
        use: "Fixer le bon tarif pour garantir la rentabilité réelle",
        lines: [
          "Agis comme un consultant en pricing pour artisans et PME de services.",
          "Coûts : matériaux [X€], temps [X heures] à [X€/h], déplacements [X€],",
          "quote-part charges fixes allouées au projet : [X€].",
          "Objectif : marge nette de [X%]. Calcule le prix final étape par étape.",
          "Propose aussi 3 arguments pour justifier ce tarif auprès du client.",
        ],
        time: "20 min nets",
      },
      {
        num: 7, title: "ROI d'un investissement logiciel — CRM, ERP, IA",
        use: "Décider si un outil vaut vraiment son coût avant de signer",
        lines: [
          "Agis comme un auditeur financier et technologique.",
          "Logiciel : [NOM] — Coût : [X€/mois] — Formation estimée : [X jours].",
          "Mon équipe de [X personnes] perd [X heures/semaine] sur des tâches",
          "que cet outil automatisera. Taux horaire moyen : [X€].",
          "Calcule le ROI réel sur 12 mois, coûts cachés inclus. Format tableau.",
        ],
        time: "20 min nets",
      },
      {
        num: 8, title: "Rapport financier mensuel",
        use: "Automatiser le reporting pour les associés ou le CODIR",
        lines: [
          "Tu es un DAF. Rédige un rapport financier mensuel structuré.",
          "Données : Revenus [X€], Dépenses fixes [X€], Dépenses variables [X€].",
          "Structure : 1) Analyse comparative vs mois précédent,",
          "2) Ecarts vs budget, 3) Profit net, 4) 3 recommandations.",
          "Format professionnel, titres clairs, prêt pour insertion en PowerPoint.",
        ],
        time: "25 min nets — vs 1h30 de reporting manuel",
      },
      {
        num: 9, title: "Négociation délai de paiement fournisseur",
        use: "Demander un report sans abîmer une relation commerciale de longue date",
        lines: [
          "Tu es assistant de direction. Mon fournisseur [SOCIÉTÉ], partenaire",
          "depuis [X] ans, attend le règlement d'une facture de [X€].",
          "J'ai un retard dû à [RAISON BRÈVE]. J'ai besoin de [X] jours supplémentaires.",
          "Rédige un email de 150 mots : historique de confiance, demande transparente,",
          "engagement ferme de règlement au [DATE]. Ton chaleureux mais sérieux.",
        ],
        time: "10 min nets",
      },
    ],
  },
  {
    num: 2, title: "VENTE & PROSPECTION",
    prompts: [
      {
        num: 10, title: "Cold email B2B — méthode AIDA",
        use: "Contacter un décideur inconnu sans paraître intrusif",
        lines: [
          "Tu es un commercial B2B d'élite, expert en copywriting persuasif.",
          "Prospect : [NOM], [FONCTION] chez [ENTREPRISE — SECTEUR].",
          "Notre solution [SERVICE] résout son problème de [PROBLÈME PRÉCIS].",
          "Rédige un email de 120 mots max (méthode AIDA). Objet : 5 mots maximum.",
          "Ton direct, orienté valeur — terminer par invitation à un appel de 10 min.",
        ],
        time: "15 min nets",
      },
      {
        num: 11, title: "Préparation discovery call — SPIN Selling",
        use: "Qualifier un prospect au téléphone en 15 minutes sans improviser",
        lines: [
          "Agis comme un coach en vente B2B. Je vais appeler [FONCTION]",
          "dans une PME du secteur [SECTEUR] pour un besoin en [SERVICE].",
          "Génère : 1) Pitch d'ouverture de 20 secondes,",
          "2) 7 questions SPIN (Situation, Problème, Implication, Need-payoff),",
          "3) 3 objections probables avec les réponses pour les contrer.",
        ],
        time: "20 min nets",
      },
      {
        num: 12, title: "Relance de devis sans réponse",
        use: "Relancer sans pression pour obtenir au minimum une réponse",
        lines: [
          "Tu es commercial empathique. J'ai envoyé une proposition pour [SERVICE]",
          "à [CLIENT] il y a [X] jours. Aucune nouvelle.",
          "Rédige un email de relance de 4 lignes max.",
          "Objectif : raviver la conversation. Propose une porte de sortie :",
          "'Si ce n'est plus d'actualite, n'hesitez pas a me le dire.'",
        ],
        time: "10 min nets",
      },
      {
        num: 13, title: "Traitement objection prix — méthode CRAC",
        use: "Répondre à 'C'est trop cher' sans brader son offre",
        lines: [
          "Agis comme un expert en négociation commerciale.",
          "Notre service coûte [X€]. Le concurrent facture [X€].",
          "Notre valeur ajoutée différenciante : [ARG 1] et [ARG 2].",
          "Rédige 3 réponses à l'objection 'C'est trop cher pour nous'.",
          "Méthode CRAC : Creuser, Reformuler, Argumenter, Contrôler. Ton conversationnel.",
        ],
        time: "20 min nets",
      },
      {
        num: 14, title: "Proposition commerciale engageante",
        use: "Transformer un devis basique en vraie proposition de valeur",
        lines: [
          "Tu es expert en rédaction commerciale B2B.",
          "Prestation : [DESCRIPTION]. Client : [PROFIL ET ENJEUX].",
          "Rédige l'email d'accompagnement du devis en 3 parties :",
          "1) Compréhension du besoin client (pas features — enjeux),",
          "2) Notre approche spécifique, 3) Bénéfices concrets attendus.",
        ],
        time: "20 min nets",
      },
      {
        num: 15, title: "Profil client idéal — ICP B2B",
        use: "Cibler sa prospection pour ne pas perdre de temps sur des leads froids",
        lines: [
          "Agis comme un directeur commercial stratégique.",
          "Nous vendons [SERVICE] à [PRIX MOYEN] en B2B.",
          "Génère un profil client idéal (ICP) détaillé : rôle exact,",
          "3 objectifs pro, 3 frustrations (pain points), objections probables,",
          "et déclencheurs d'achat. Format : tableau structuré.",
        ],
        time: "25 min nets",
      },
      {
        num: 16, title: "Message d'approche LinkedIn",
        use: "Contacter un prospect ou candidat passif avec un message qui se démarque",
        lines: [
          "Tu es un expert en recrutement et développement commercial LinkedIn.",
          "La cible est [FONCTION] chez [ENTREPRISE], expertise : [DOMAINE].",
          "Rédige un message LinkedIn de 100 mots max.",
          "Objectif : susciter la curiosité pour un appel de 10 min —",
          "pas de vente directe. Ton flatteur, personnel, professionnel.",
        ],
        time: "10 min nets",
      },
      {
        num: 17, title: "Script upsell — vente additionnelle",
        use: "Proposer une montée en gamme à un client satisfait",
        lines: [
          "Agis comme un Customer Success Manager expert.",
          "Client actuel sur notre offre [BASIQUE]. Résultats obtenus : [BÉNÉFICES].",
          "Rédige un script d'appel de 3 minutes pour proposer l'offre [PREMIUM].",
          "Angle : féliciter ses résultats, puis révéler ce qu'il manque.",
          "Appel à l'action clair et peu engageant en fin de script.",
        ],
        time: "15 min nets",
      },
      {
        num: 18, title: "Analyse notes de RDV + email de suivi",
        use: "Capitaliser sur chaque rendez-vous avec le bon next step",
        lines: [
          "Tu es un Sales Manager senior. Notes brutes de mon RDV :",
          "[COLLER VOS NOTES BRUTES].",
          "Analyse : quels sont les signaux d'achat ? Quels sont les freins ?",
          "Rédige l'email de suivi (follow-up) idéal à envoyer aujourd'hui :",
          "récapitulatif des enjeux identifiés + proposition d'un next step concret.",
        ],
        time: "20 min nets",
      },
      {
        num: 19, title: "Réponse à un appel d'offres public",
        use: "Traiter un AO sans y passer une nuit entière",
        lines: [
          "Agis comme un chef de projet expert en marchés publics français.",
          "Cahier des charges : [COLLER OU RÉSUMER LE CDC].",
          "1) Extrais les 5 critères d'évaluation pondérés les plus importants,",
          "2) Identifie les 3 pièges ou points de vigilance à anticiper,",
          "3) Propose un plan de mémoire technique en 5 parties.",
        ],
        time: "45 min nets — vs une demi-journée sans IA",
      },
      {
        num: 20, title: "Programme de fidélisation et parrainage",
        use: "Augmenter la valeur client sans outil ni budget complexe",
        lines: [
          "Tu es spécialiste de la rétention client pour PME de services.",
          "Notre service : [DESCRIPTION] — Base clients : [NOMBRE] contacts.",
          "Conçois un programme de parrainage simple (sans logiciel dédié).",
          "Propose la mécanique, la récompense parrain/filleul,",
          "et rédige l'email d'annonce à envoyer à notre base clients.",
        ],
        time: "20 min nets",
      },
    ],
  },
  {
    num: 3, title: "RELATION CLIENT & RÉPUTATION",
    prompts: [
      {
        num: 21, title: "Répondre à un client en colère",
        use: "Désamorcer une plainte sans perdre la relation commerciale",
        lines: [
          "Tu es responsable service client, expert en gestion de crise relationnelle.",
          "Message du client mécontent : [COLLER LE MESSAGE].",
          "Rédige une réponse empathique et professionnelle en 3 étapes :",
          "1) Empathie sincère (pas d'excuse vide), 2) Explication transparente,",
          "3) Solution concrète : [VOTRE SOLUTION]. Ton calme et rassurant.",
        ],
        time: "15 min nets",
      },
      {
        num: 22, title: "Réponse à un avis Google 5 étoiles",
        use: "Renforcer la relation et améliorer le référencement local",
        lines: [
          "Agis comme le gérant de l'entreprise. Avis client reçu :",
          "[COLLER L'AVIS].",
          "Rédige une réponse chaleureuse et personnalisée (non générique).",
          "Mentionne subtilement [NOM DU SERVICE] pour le SEO local.",
          "Invite le client à revenir. Ton sincère, ni trop formel ni familier.",
        ],
        time: "8 min nets",
      },
      {
        num: 23, title: "Réponse à un avis Google 1 étoile",
        use: "Gérer un avis négatif avec calme — visible par tous les futurs clients",
        lines: [
          "Agis comme le directeur de l'entreprise, très diplomate.",
          "Avis négatif reçu : [COLLER L'AVIS].",
          "Rédige une réponse : 1) Remerciement pour le retour,",
          "2) Empathie sans reconnaissance de responsabilité si non justifiée,",
          "3) Invitation à échanger en direct via [EMAIL ou TÉLÉPHONE].",
        ],
        time: "12 min nets",
      },
      {
        num: 24, title: "Optimisation fiche Google Business Profile",
        use: "Améliorer la visibilité locale sans agence SEO",
        lines: [
          "Tu es expert en SEO local. Mon entreprise : [TYPE DE COMMERCE]",
          "à [VILLE/QUARTIER]. Atouts : [LISTE VOS POINTS FORTS].",
          "Rédige la description GBP parfaite (750 caractères max)",
          "avec les mots-clés locaux que mes clients tapent dans Google.",
          "Bonus : propose 3 idées de Google Posts à publier ce mois-ci.",
        ],
        time: "20 min nets",
      },
      {
        num: 25, title: "Email d'onboarding client — bienvenue",
        use: "Accueillir un nouveau client pour réduire le churn dès le départ",
        lines: [
          "Agis comme un Customer Success Manager. Service souscrit : [DESCRIPTION].",
          "Rédige l'email de bienvenue automatique envoyé post-signature.",
          "Structure : 1) Accueil chaleureux et personnalisé (pas robotique),",
          "2) Les 3 premières étapes claires à réaliser en bullet points,",
          "3) Contact direct pour toute question. Ton humain.",
        ],
        time: "15 min nets",
      },
      {
        num: 26, title: "FAQ automatique depuis description de service",
        use: "Créer une FAQ complète sans se creuser la tête sur ce que les clients demandent",
        lines: [
          "Agis comme un agent support senior très expérimenté.",
          "Description du service : [COLLER LA DESCRIPTION].",
          "Génère les 6 questions les plus fréquentes que les clients vont poser,",
          "avec leurs réponses claires et concises (2-3 lignes max chacune).",
          "Format : question en gras, réponse en dessous.",
        ],
        time: "20 min nets",
      },
      {
        num: 27, title: "Alerte incident — communication de crise",
        use: "Informer les clients d'un dysfonctionnement sans perdre leur confiance",
        lines: [
          "Agis comme un responsable communication de crise.",
          "Incident : [DESCRIPTION] — Durée estimée : [X heures/jours].",
          "Rédige l'email d'alerte aux clients affectés. Ton transparent et rassurant.",
          "Explique sans chercher d'excuses. Donne une échéance de résolution claire.",
          "Propose un suivi : 'Nous vous informons dès résolution.'",
        ],
        time: "15 min nets",
      },
      {
        num: 28, title: "Relance renouvellement de contrat",
        use: "Sécuriser un contrat récurrent avant son expiration",
        lines: [
          "Agis comme un gestionnaire de compte fidélisation.",
          "Client [NOM] — contrat [SERVICE] arrivant à échéance dans [X] jours.",
          "Rédige un email amical qui valorise la collaboration passée,",
          "facilite le renouvellement en un clic (lien : [URL/PORTAIL]),",
          "et propose un appel de 15 min si des questions se posent.",
        ],
        time: "10 min nets",
      },
      {
        num: 29, title: "Demande d'avis client post-prestation",
        use: "Collecter des témoignages sans être intrusif",
        lines: [
          "Agis comme un chargé qualité attentionné.",
          "Prestation terminée : [DESCRIPTION] pour [NOM CLIENT].",
          "Rédige un message court (3 lignes) pour demander",
          "un avis sur [GOOGLE/TRUSTPILOT/AUTRE]. Ton léger, zéro obligation.",
          "Lien direct vers la page d'avis : [URL].",
        ],
        time: "8 min nets",
      },
    ],
  },
  {
    num: 4, title: "MARKETING & CONTENU",
    prompts: [
      {
        num: 30, title: "Post LinkedIn — storytelling entreprise",
        use: "Rayonner sur LinkedIn sans paraître commercial ou arrogant",
        lines: [
          "Tu es créateur de contenu LinkedIn expert B2B.",
          "Actualité : [CE QUE VOUS VENEZ D'ACCOMPLIR, D'APPRENDRE, DE VIVRE].",
          "Rédige un post engageant :",
          "1) Accroche curiosité (jamais 'Je suis fier de...'),",
          "2) Contexte/défi, 3) Apprentissage. Max 3 hashtags pertinents.",
        ],
        time: "20 min nets",
      },
      {
        num: 31, title: "Newsletter mensuelle",
        use: "Nourrir la relation client régulièrement sans lasser l'audience",
        lines: [
          "Tu es expert en email marketing pour PME. Audience : [DESCRIPTION].",
          "Sujets du mois : [NOUVEAUTÉ/PROMO], [CONSEIL PRATIQUE], [COULISSES].",
          "Rédige la newsletter avec un ton conversationnel et aéré.",
          "Propose 3 objets d'email différents très incitatifs au clic.",
          "CTA final vers [URL]. Format bullet points, zéro mur de texte.",
        ],
        time: "25 min nets",
      },
      {
        num: 32, title: "Fiche produit — artisanat ou prestation haut de gamme",
        use: "Vendre la valeur émotionnelle, pas juste les caractéristiques techniques",
        lines: [
          "Agis comme un rédacteur luxe senior.",
          "Produit/service : [DESCRIPTION TECHNIQUE DU PRODUIT].",
          "Rédige une fiche produit sensorielle et émotionnelle.",
          "Mets l'accent sur [ATOUT 1], [ATOUT 2] et [ATOUT 3].",
          "Fais ressentir avant de convaincre. Zéro jargon technique.",
        ],
        time: "20 min nets",
      },
      {
        num: 33, title: "Plan d'article de blog — SEO et GEO",
        use: "Structurer un article qui se classe sur Google ET dans les IA",
        lines: [
          "Tu es expert SEO et GEO (Generative Engine Optimization).",
          "Mot-clé cible : '[MOT-CLÉ]'. Audience : [PROFIL LECTEUR].",
          "Génère : H1, 5 H2 avec H3 si nécessaire, intro avec réponse directe,",
          "section FAQ (3 questions), meta description (155 caractères).",
          "Bonus : quelles sources citer pour renforcer le E-E-A-T ?",
        ],
        time: "25 min nets",
      },
      {
        num: 34, title: "Stratégie GEO — être cité par les IA comme Perplexity",
        use: "Apparaître dans les réponses de ChatGPT, Perplexity et Google IA Overview",
        lines: [
          "Tu es expert en GEO (Generative Engine Optimization).",
          "Spécialité : [ACTIVITÉ PRÉCISE] — Zone : [RÉGION/VILLE/SECTEUR].",
          "Propose la structure de page optimisée pour que les IA génératives",
          "nous citent comme référence de confiance.",
          "Quelles FAQ, quelles preuves E-E-A-T, quelle sémantique privilégier ?",
        ],
        time: "30 min nets",
      },
      {
        num: 35, title: "Meta descriptions SEO — lot de 5 pages",
        use: "Améliorer le taux de clic dans Google sans faire appel à une agence",
        lines: [
          "Agis comme un spécialiste SEO. Rédige 5 meta descriptions",
          "optimisées pour le taux de clic (155 caractères max chacune).",
          "Pour chaque page, inclus le mot-clé cible naturellement.",
          "Pages : [PAGE 1 et son mot-clé], [PAGE 2], [PAGE 3],",
          "[PAGE 4], [PAGE 5]. Ton : incitatif, clair, sans clickbait.",
        ],
        time: "15 min nets",
      },
      {
        num: 36, title: "Accroches pub Facebook/Instagram — A/B testing",
        use: "Multiplier les variantes créatives pour tester et optimiser les campagnes",
        lines: [
          "Tu es concepteur-rédacteur expert en publicité sociale.",
          "Produit/service : [DESCRIPTION] — Cible : [AUDIENCE].",
          "Génère 10 accroches (2 phrases max chacune) en variant les angles :",
          "2 urgence, 2 preuve sociale, 2 résolution de douleur,",
          "2 chiffres/stats, 2 ton humain et authentique.",
        ],
        time: "20 min nets",
      },
    ],
  },
  {
    num: 5, title: "RH & RECRUTEMENT",
    prompts: [
      {
        num: 37, title: "Offre d'emploi attractive et inclusive",
        use: "Attirer les bons profils avec une annonce qui donne envie de postuler",
        lines: [
          "Tu es recruteur expert. Poste : [INTITULÉ] — Contrat : [TYPE]",
          "chez [ENTREPRISE], spécialisée en [SECTEUR], basée à [LIEU].",
          "Structure : 1) Qui sommes-nous (ton dynamique, 3 lignes),",
          "2) Tes missions, 3) Ton profil (hard skills + soft skills),",
          "4) Ce qu'on t'offre : [AVANTAGES, SALAIRE]. Ton [VOUVOIEMENT/TUTOIEMENT].",
        ],
        time: "30 min nets",
      },
      {
        num: 38, title: "Questions d'entretien comportemental — STAR",
        use: "Évaluer les candidats de manière objective et reproductible",
        lines: [
          "Agis comme un DRH expert en évaluation des talents.",
          "Poste : [INTITULÉ]. Compétences clés à évaluer : [COMP 1], [COMP 2], [COMP 3].",
          "Pour chaque compétence, génère une question STAR",
          "(Situation, Tâche, Action, Résultat) qui oblige le candidat",
          "à prouver son niveau par un exemple concret. Grille de notation incluse.",
        ],
        time: "25 min nets",
      },
      {
        num: 39, title: "Email de refus candidature — bienveillant",
        use: "Maintenir une bonne image employeur même en refusant",
        lines: [
          "Agis comme un assistant RH attentionné. Candidat : [PROFIL — étape atteinte].",
          "Motif de refus (interne, ne pas copier-coller) : [RAISON PRÉCISE].",
          "Rédige un email de refus poli et constructif.",
          "Valorise un point fort de son profil, explique le critère décisif",
          "sans être trop précis, et laisse une porte ouverte pour l'avenir.",
        ],
        time: "12 min nets",
      },
      {
        num: 40, title: "Checklist d'intégration — semaine 1",
        use: "Fidéliser un nouvel arrivant et raccourcir le temps d'autonomie",
        lines: [
          "Tu es Office Manager. Nous intégrons un nouveau [POSTE] lundi.",
          "Construis le programme d'intégration jour par jour pour la semaine 1.",
          "Inclus : accueil RH (contrat, badges), setup outils ([OUTIL 1], [OUTIL 2]),",
          "rencontres équipe programmées, premier dossier confié vendredi,",
          "et point de bilan fin de semaine. Objectif : autonomie en 2 semaines.",
        ],
        time: "30 min nets",
      },
      {
        num: 41, title: "Trame d'entretien annuel constructif",
        use: "Rendre l'entretien annuel utile, pas anxiogène",
        lines: [
          "Agis comme un expert en management RH.",
          "Collaborateur : [PRÉNOM], [FONCTION]. Point fort : [SUCCÈS RÉCENT].",
          "Axe d'amélioration à aborder : [POINT À TRAVAILLER].",
          "Fournis : 5 questions d'auto-évaluation ouvertes +",
          "une façon constructive d'aborder l'axe sans braquer. Méthode bienveillante.",
        ],
        time: "20 min nets",
      },
    ],
  },
  {
    num: 6, title: "DIRECTION & OPÉRATIONS",
    prompts: [
      {
        num: 42, title: "Compte-rendu depuis notes brutes",
        use: "Transformer des notes volantes en CR professionnel en 5 minutes",
        lines: [
          "Agis comme un assistant de direction efficace.",
          "Notes brutes de la réunion [SUJET — DATE] :",
          "[COLLER VOS NOTES BRUTES ICI].",
          "Rédige un compte-rendu professionnel prêt à envoyer aux participants.",
          "Structure : contexte, décisions prises, points en suspens, tableau Qui/Quoi/Quand.",
        ],
        time: "15 min nets — vs 1h de rédaction",
      },
      {
        num: 43, title: "Ordre du jour — réunion kick-off projet",
        use: "Lancer un projet sur de bonnes bases sans réunion improductive",
        lines: [
          "Agis comme un chef de projet senior. Réunion de lancement :",
          "Projet [NOM] — Durée : 1h — Participants : [LISTE DES FONCTIONS].",
          "Rédige un ordre du jour minuté avec le rôle de chaque participant.",
          "Inclus : contexte, objectifs, livrables, risques identifiés,",
          "prochaines étapes et désignation d'un référent par action clé.",
        ],
        time: "20 min nets",
      },
      {
        num: 44, title: "Matrice Eisenhower — prioriser sa semaine",
        use: "Sortir de la surcharge et décider quoi faire, déléguer ou supprimer",
        lines: [
          "Tu es coach en productivité pour dirigeants de PME.",
          "Voici mes tâches en vrac pour cette semaine :",
          "[LISTER 8 À 12 TÂCHES SANS ORDRE DE PRIORITÉ].",
          "Classe-les en matrice Eisenhower (4 quadrants).",
          "Pour les tâches 'à déléguer', propose à qui ou comment. Format tableau.",
        ],
        time: "15 min nets",
      },
      {
        num: 45, title: "Executive Summary — préparation CODIR",
        use: "Résumer un long document pour un décideur qui n'a pas le temps",
        lines: [
          "Tu es assistant de direction analytique. Données du mois :",
          "[COLLER LES DONNÉES BRUTES OU NOTES].",
          "Rédige un Executive Summary de 150 mots max.",
          "Structure : 1) Contexte, 2) 3 succès chiffrés,",
          "3) 2 points bloquants, 4) Ordre du jour suggéré pour la réunion d'1h.",
        ],
        time: "20 min nets",
      },
      {
        num: 46, title: "Discours de motivation — équipe sous pression",
        use: "Remotiver ses troupes lors d'une période difficile sans paraître creux",
        lines: [
          "Agis comme un leader inspirant et authentique. Mon équipe de [X] personnes",
          "traverse [DIFFICULTÉ : ex. surcharge, résultat décevant, départ d'un collègue].",
          "Rédige un discours de 3 minutes (environ 400 mots).",
          "Inclus : empathie réelle, reconnaissance pour [SUCCÈS RÉCENT],",
          "2 actions immédiates concrètes pour alléger la pression. Pas de clichés.",
        ],
        time: "20 min nets",
      },
      {
        num: 47, title: "Plan d'action RSE et conformité CSRD",
        use: "Préparer la conformité environnementale sans consultant à 10 000€",
        lines: [
          "Agis comme un expert RSE spécialisé en PME françaises.",
          "Mon entreprise : [SECTEUR], [TAILLE EN SALARIÉS], [RÉGION].",
          "Directive CSRD et obligations ESG 2026 : quelles sont mes obligations concrètes ?",
          "Génère un plan d'action sur 6 mois :",
          "1) Priorités réglementaires, 2) Actions rapides (<1 semaine), 3) KPIs à suivre.",
        ],
        time: "40 min nets — vs 2-3 jours de veille réglementaire",
      },
      {
        num: 48, title: "Traduction technique vers langage client",
        use: "Rendre un devis ou rapport compréhensible pour un non-spécialiste",
        lines: [
          "Agis comme un traducteur expert entre techniciens et clients.",
          "Public cible : [PROFIL DU CLIENT : ex. artisan, dirigeant PME, élu].",
          "Voici le document technique, devis ou rapport à vulgariser :",
          "[COLLER LE DOCUMENT].",
          "Rédige un résumé en 3 points simples. Aucun jargon autorisé.",
        ],
        time: "15 min nets",
      },
      {
        num: 49, title: "Communication interne — annonce de changement",
        use: "Annoncer une réorganisation sans générer d'anxiété dans l'équipe",
        lines: [
          "Agis comme un directeur des opérations expert en conduite du changement.",
          "Changement annoncé : [DESCRIPTION DU CHANGEMENT ORGANISATIONNEL].",
          "Rédige un mémo interne positif pour l'équipe.",
          "Ton : transparent sur les raisons, rassurant sur l'impact individuel,",
          "précis sur le calendrier de mise en oeuvre et les prochaines étapes.",
        ],
        time: "15 min nets",
      },
      {
        num: 50, title: "Timeblocking — planning hebdomadaire dirigeant",
        use: "Reprendre le contrôle de son agenda quand tout semble urgent",
        lines: [
          "Tu es expert en gestion du temps pour dirigeants de PME multi-tâches.",
          "Je dois gérer : production/service ([X]h/sem), commercial ([X]h),",
          "admin/finance ([X]h), management équipe ([X]h).",
          "Crée un planning timeblocking sur 5 jours. Regroupe les tâches similaires.",
          "Intègre 20% de marge pour imprévus. Format : tableau Jour/Créneau/Tâche.",
        ],
        time: "15 min nets",
      },
    ],
  },
];

// ─── CONSTRUCTION DU DOCUMENT ────────────────────────────────────────────────

// Header des pages de contenu (logo + ligne)
const contentHeader = new Header({
  children: [
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [
        logoImg(100, 29),
        new TextRun({ text: "   |   50 Prompts IA — L'Agence Sauvage", size: 16, color: C.slateLight, font: "Arial" }),
      ],
    }),
    rule(C.indigoMid),
  ],
});

// Footer des pages de contenu
const contentFooter = new Footer({
  children: [
    rule(C.separator),
    new Paragraph({
      spacing: { before: 80, after: 0 },
      children: [
        new TextRun({ text: "lagencesauvage.com", size: 16, color: C.slateLight, font: "Arial" }),
        new TextRun({ text: "                                                                      ", size: 16, font: "Arial" }),
        new TextRun({ text: "Page ", size: 16, color: C.slateLight, font: "Arial" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.slateLight, font: "Arial" }),
      ],
    }),
  ],
});

// ─── PAGE DE COUVERTURE ─────────────────────────────────────────────────────
const coverChildren = [
  // Bandeau indigo top
  fullCell([
    new Paragraph({
      spacing: { before: 0, after: 0 },
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: "GUIDE PRATIQUE IA — PME & TPE", bold: true, size: 20, color: C.indigoMid, font: "Arial" })],
    }),
  ], C.indigo, NB, { top: 200, bottom: 200, left: 280, right: 280 }),

  gap(400),

  // Logo
  new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [logoImg(200, 59)],
  }),

  gap(320),

  // Titre principal
  new Paragraph({
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: "50 Prompts IA", bold: true, size: 72, color: C.indigo, font: "Arial" })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: "Prêts à l'Emploi", bold: true, size: 60, color: C.slate, font: "Arial" })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: "pour les PME et TPE", bold: false, size: 44, color: C.slateMed, font: "Arial" })],
  }),

  gap(200),
  rule(C.indigoMid),
  gap(100),

  new Paragraph({
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: "Copiez. Adaptez. Gagnez du temps.", italics: true, size: 28, color: C.slateLight, font: "Arial" })],
  }),

  gap(360),

  // Bandeau stats
  fullCell([
    new Paragraph({
      spacing: { before: 0, after: 60 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Seuls 15% des dirigeants de PME utilisent l'IA regulièrement.", bold: true, size: 20, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 0 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Ce guide est fait pour que vous en fassiez partie.", size: 20, color: C.indigoMid, font: "Arial" })],
    }),
  ], C.indigoDark, NB, { top: 200, bottom: 200, left: 320, right: 320 }),

  gap(320),

  new Paragraph({
    spacing: { before: 0, after: 0 },
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text: "lagencesauvage.com", size: 20, color: C.slateLight, font: "Arial" })],
  }),
];

// ─── PAGE INTRODUCTION ───────────────────────────────────────────────────────
const introChildren = [
  new Paragraph({ children: [new PageBreak()] }),

  new Paragraph({
    ...sp(0, 160),
    children: [new TextRun({ text: "Comment utiliser ce guide", bold: true, size: 44, color: C.slate, font: "Arial" })],
  }),
  rule(C.indigo),
  gap(120),

  new Paragraph({
    ...sp(0, 80),
    children: [new TextRun({ text: "Vous avez entre les mains 50 prompts prêts à l'emploi, testés et structurés pour les réalités quotidiennes des PME et TPE françaises. Chaque prompt suit la méthode ROCF, recommandée par les experts en productivité IA.", size: 20, color: C.slateMed, font: "Arial" })],
  }),

  gap(160),

  // Table ROCF
  new Paragraph({ ...sp(0, 80), children: [new TextRun({ text: "La méthode ROCF — le secret d'un prompt efficace", bold: true, size: 24, color: C.slate, font: "Arial" })] }),

  new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [1400, 2800, 4826],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 1400, type: WidthType.DXA },
            shading: { fill: C.indigo, type: ShadingType.CLEAR },
            borders: NB,
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "Lettre", bold: true, size: 20, color: C.white, font: "Arial" })] })],
          }),
          new TableCell({
            width: { size: 2800, type: WidthType.DXA },
            shading: { fill: C.indigo, type: ShadingType.CLEAR },
            borders: NB,
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "Composante", bold: true, size: 20, color: C.white, font: "Arial" })] })],
          }),
          new TableCell({
            width: { size: 4826, type: WidthType.DXA },
            shading: { fill: C.indigo, type: ShadingType.CLEAR },
            borders: NB,
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "Rôle dans le prompt", bold: true, size: 20, color: C.white, font: "Arial" })] })],
          }),
        ],
      }),
      ...[
        ["R", "Rôle",    "Qui est l'IA ? 'Agis comme un [expert]...' — définit le ton et le niveau"],
        ["O", "Objectif","Quelle est la tâche précise à accomplir ?"],
        ["C", "Contexte","Votre entreprise, votre client, vos contraintes spécifiques"],
        ["F", "Format",  "Comment livrer le résultat : tableau, email, bullet points, longueur"],
      ].map(([letter, comp, role], i) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 1400, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? C.indigoLight : C.bgLight, type: ShadingType.CLEAR },
              borders: NB,
              margins: { top: 100, bottom: 100, left: 160, right: 160 },
              children: [new Paragraph({ children: [new TextRun({ text: letter, bold: true, size: 22, color: C.indigo, font: "Arial" })] })],
            }),
            new TableCell({
              width: { size: 2800, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? C.indigoLight : C.bgLight, type: ShadingType.CLEAR },
              borders: NB,
              margins: { top: 100, bottom: 100, left: 160, right: 160 },
              children: [new Paragraph({ children: [new TextRun({ text: comp, bold: true, size: 20, color: C.slate, font: "Arial" })] })],
            }),
            new TableCell({
              width: { size: 4826, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? C.indigoLight : C.bgLight, type: ShadingType.CLEAR },
              borders: NB,
              margins: { top: 100, bottom: 100, left: 160, right: 160 },
              children: [new Paragraph({ children: [new TextRun({ text: role, size: 20, color: C.slateMed, font: "Arial" })] })],
            }),
          ],
        })
      ),
    ],
  }),

  gap(200),

  new Paragraph({ ...sp(0, 80), children: [new TextRun({ text: "3 règles pour de meilleurs résultats", bold: true, size: 24, color: C.slate, font: "Arial" })] }),

  ...[
    ["1.", "Remplacez TOUS les [CROCHETS] par vos données réelles avant d'envoyer."],
    ["2.", "Le premier jet est un brouillon. Dites à l'IA : 'Raccourcis de 30%' ou 'Rends ça plus naturel'."],
    ["3.", "Ne collez jamais de données confidentielles (noms de clients, RIB, contrats) dans une IA publique."],
  ].map(([num, text]) =>
    new Paragraph({
      ...sp(0, 100),
      children: [
        new TextRun({ text: `${num}  `, bold: true, size: 20, color: C.indigo, font: "Arial" }),
        new TextRun({ text, size: 20, color: C.slateMed, font: "Arial" }),
      ],
    })
  ),
];

// ─── CONTENU DES CATÉGORIES ──────────────────────────────────────────────────
const categoriesChildren = CATEGORIES.flatMap(cat => [
  ...catHeader(cat.num, cat.title),
  ...cat.prompts.flatMap(p => promptEntry(p.num, p.title, p.use, p.lines, p.time)),
]);

// ─── PAGE FINALE — ERREURS + CTA ────────────────────────────────────────────
const ctaChildren = [
  new Paragraph({ children: [new PageBreak()] }),

  new Paragraph({
    ...sp(0, 160),
    children: [new TextRun({ text: "Les 5 erreurs qui sabotent vos prompts", bold: true, size: 36, color: C.slate, font: "Arial" })],
  }),
  rule(C.indigo),
  gap(120),

  ...[
    ["1", "Taper trop vague",           "\"Rédige-moi un email\" sans contexte = résultat générique. Toujours briefer avec ROCF."],
    ["2", "Accepter le premier jet",     "L'IA produit un brouillon. Demandez : 'Raccourcis de 20%' ou 'Rends ça moins formel'."],
    ["3", "Oublier le format de sortie", "Précisez toujours : 'sous forme de tableau', 'en 3 bullet points', 'en 100 mots max'."],
    ["4", "Coller des données sensibles","Anonymisez les noms, RIB et contrats. Sur une IA publique, les données peuvent être retenues."],
    ["5", "Croire que l'IA ne se trompe pas", "L'IA peut halluciner. Toujours relire et vérifier chiffres, lois et citations."],
  ].map(([num, title, detail]) =>
    new Paragraph({
      ...sp(0, 100),
      children: [
        new TextRun({ text: `${num}.  `, bold: true, size: 22, color: C.indigo, font: "Arial" }),
        new TextRun({ text: `${title}  `, bold: true, size: 22, color: C.slate, font: "Arial" }),
        new TextRun({ text: `— ${detail}`, size: 20, color: C.slateMed, font: "Arial" }),
      ],
    })
  ),

  gap(280),

  // CTA
  fullCell([
    new Paragraph({
      spacing: { before: 0, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Ces prompts ont une limite.", bold: true, size: 32, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Copier-coller, c'est de l'IA artisanale. Pour automatiser vraiment —", size: 20, color: C.indigoMid, font: "Arial" })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "connecter l'IA à votre messagerie, votre CRM, vos devis —", size: 20, color: C.indigoMid, font: "Arial" })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 120 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "il faut l'automatisation sur mesure.", bold: true, size: 20, color: C.white, font: "Arial" })],
    }),
    rule(C.indigoMid),
    gap(120),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Diagnostic Potentiel IA — 30 minutes offertes", bold: true, size: 28, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Nous analysons VOS processus et vous disons exactement où l'IA", size: 20, color: C.indigoMid, font: "Arial" })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "peut vous faire gagner 10h/semaine. Gratuitement. Sans engagement.", size: 20, color: C.indigoMid, font: "Arial" })],
    }),
    gap(80),
    new Paragraph({
      spacing: { before: 0, after: 0 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: ">> lagencesauvage.com/audit", bold: true, size: 24, color: C.white, font: "Arial" })],
    }),
  ], C.indigo, NB, { top: 280, bottom: 280, left: 360, right: 360 }),
];

// ─── ASSEMBLAGE FINAL ────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 20, color: C.slateMed } },
    },
  },
  sections: [
    {
      properties: {
        titlePage: true,
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      headers: {
        default: contentHeader,
        first:   new Header({ children: [new Paragraph({ children: [new TextRun("")] })] }),
      },
      footers: {
        default: contentFooter,
        first:   new Footer({ children: [new Paragraph({ children: [new TextRun("")] })] }),
      },
      children: [
        ...coverChildren,
        ...introChildren,
        ...categoriesChildren,
        ...ctaChildren,
      ],
    },
  ],
});

// ─── EXPORT ──────────────────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, '50-prompts-pme-agence-sauvage.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('OK — fichier genere :', outPath);
}).catch(err => {
  console.error('ERREUR :', err.message);
  process.exit(1);
});

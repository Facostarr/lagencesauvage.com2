// Lead Magnet B — "Checklist 30 Jours pour déployer Claude dans votre PME"
// L'Agence Sauvage — lagencesauvage.com
// Généré avec docx@9.6.1

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── COULEURS ────────────────────────────────────────────────────────────────
const C = {
  indigo:       "4F46E5",
  indigoLight:  "EEF2FF",
  indigoMid:    "C7D2FE",
  indigoDark:   "3730A3",
  slate:        "0F172A",
  slateMed:     "334155",
  slateLight:   "64748B",
  white:        "FFFFFF",
  bgLight:      "F8FAFC",
  separator:    "E2E8F0",
  claudeCream:  "F5F0E8",
  claudeBeige:  "EDE8DF",
  claudeSalmon: "DA7756",
};

// A4 avec marges 1 pouce (1440 DXA)
const PAGE_W = 11906;
const PAGE_H = 16838;
const MARGIN = 1440;
const CW = PAGE_W - 2 * MARGIN; // 9026 DXA

const noB = { style: BorderStyle.NONE, size: 0, color: C.white };
const NB  = { top: noB, bottom: noB, left: noB, right: noB };

// ─── ASSETS ──────────────────────────────────────────────────────────────────
const logoPath     = path.resolve(__dirname, '../../static/assets/images/Logo-Agence-Sauvage.svg');
const logoData     = fs.readFileSync(logoPath);
const coverImgPath = path.resolve(__dirname, 'checklist-cover.jpg');
const coverImgData = fs.readFileSync(coverImgPath);

const PNG_FALLBACK = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

function logoImg(w, h) {
  return new ImageRun({
    type: "svg", data: logoData,
    fallback: { type: "png", data: PNG_FALLBACK },
    transformation: { width: w, height: h },
    altText: { title: "Logo L'Agence Sauvage", description: "Logo", name: "Logo" },
  });
}

function coverImg(w, h) {
  return new ImageRun({
    type: "jpg", data: coverImgData,
    transformation: { width: w, height: h },
    altText: { title: "Checklist 30 Jours — L'Agence Sauvage", description: "Cover", name: "Cover" },
  });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function sp(before, after) { return { spacing: { before, after } }; }

function gap(h = 160) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun("")] });
}

function rule(color = C.separator) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    children: [new TextRun("")],
  });
}

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

// En-tête de semaine : bande indigo à gauche + cream à droite
function weekHeader(num, label, title, objectif) {
  const BAND = 280;
  return [
    new Paragraph({ children: [new PageBreak()] }),
    new Table({
      width: { size: CW, type: WidthType.DXA },
      columnWidths: [BAND, CW - BAND],
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: BAND, type: WidthType.DXA },
            shading: { fill: C.indigo, type: ShadingType.CLEAR },
            borders: NB,
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: [new Paragraph({ children: [new TextRun("")] })],
          }),
          new TableCell({
            width: { size: CW - BAND, type: WidthType.DXA },
            shading: { fill: C.claudeCream, type: ShadingType.CLEAR },
            borders: NB,
            margins: { top: 240, bottom: 240, left: 280, right: 280 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [new TextRun({ text: `SEMAINE ${num} · J${(num - 1) * 7 + 1}–J${num * 7}  ·  ${label}`, bold: true, size: 18, color: C.claudeSalmon, font: "Arial" })],
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: title, bold: true, size: 32, color: C.slate, font: "Arial" })],
              }),
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [new TextRun({ text: objectif, italics: true, size: 18, color: C.slateLight, font: "Arial" })],
              }),
            ],
          }),
        ],
      })],
    }),
    gap(200),
  ];
}

// Item de checklist
function checkItem(text, detail = null) {
  const items = [
    new Paragraph({
      ...sp(0, detail ? 40 : 140),
      children: [
        new TextRun({ text: "□  ", bold: true, size: 26, color: C.indigo, font: "Arial" }),
        new TextRun({ text, size: 20, color: C.slate, font: "Arial" }),
      ],
    }),
  ];
  if (detail) {
    items.push(new Paragraph({
      ...sp(0, 140),
      indent: { left: 400 },
      children: [new TextRun({ text: detail, italics: true, size: 17, color: C.slateLight, font: "Arial" })],
    }));
  }
  return items;
}

// Bloc Quick Win avec prompt copier-coller
function quickWinBlock(metierLabel, metierColor, tache, prompt, gain) {
  const leftBorder = {
    top: noB, bottom: noB, right: noB,
    left: { style: BorderStyle.SINGLE, size: 24, color: C.claudeSalmon },
  };
  return [
    gap(160),
    new Paragraph({
      ...sp(0, 60),
      children: [new TextRun({ text: metierLabel, bold: true, size: 26, color: C.slate, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 100),
      children: [new TextRun({ text: tache, size: 18, color: C.slateMed, font: "Arial" })],
    }),
    new Table({
      width: { size: CW, type: WidthType.DXA },
      columnWidths: [CW],
      rows: [new TableRow({
        children: [new TableCell({
          width: { size: CW, type: WidthType.DXA },
          shading: { fill: C.claudeCream, type: ShadingType.CLEAR },
          borders: leftBorder,
          margins: { top: 120, bottom: 120, left: 220, right: 200 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 60 },
              children: [new TextRun({ text: "Prompt copier-coller dans Claude :", bold: true, size: 16, color: C.claudeSalmon, font: "Arial" })],
            }),
            new Paragraph({
              spacing: { before: 0, after: 0 },
              children: [new TextRun({ text: prompt, size: 17, font: "Courier New", color: C.slate })],
            }),
          ],
        })],
      })],
    }),
    new Paragraph({
      ...sp(80, 80),
      children: [
        new TextRun({ text: "Gain estimé : ", bold: true, size: 16, color: C.indigo, font: "Arial" }),
        new TextRun({ text: gain, size: 16, color: C.slateMed, font: "Arial" }),
      ],
    }),
    rule(C.claudeBeige),
  ];
}

// Erreur fatale
function erreurFatale(num, titre, detail, solution) {
  return [
    new Paragraph({
      ...sp(160, 60),
      children: [
        new TextRun({ text: `${num}.  `, bold: true, size: 28, color: C.claudeSalmon, font: "Arial" }),
        new TextRun({ text: titre, bold: true, size: 22, color: C.slate, font: "Arial" }),
      ],
    }),
    new Paragraph({
      ...sp(0, 70),
      children: [new TextRun({ text: detail, size: 19, color: C.slateMed, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 40),
      children: [
        new TextRun({ text: "✓  Solution : ", bold: true, size: 18, color: C.indigo, font: "Arial" }),
        new TextRun({ text: solution, size: 18, color: C.slateLight, font: "Arial" }),
      ],
    }),
  ];
}

// ─── SECTION COUVERTURE (marges minimales, pleine page) ──────────────────────
const coverSection = {
  properties: {
    titlePage: true,
    page: {
      size: { width: PAGE_W, height: PAGE_H },
      margin: { top: 100, right: 100, bottom: 100, left: 100 },
    },
  },
  headers: {
    default: new Header({ children: [new Paragraph({ children: [new TextRun("")] })] }),
    first:   new Header({ children: [new Paragraph({ children: [new TextRun("")] })] }),
  },
  footers: {
    default: new Footer({ children: [new Paragraph({ children: [new TextRun("")] })] }),
    first:   new Footer({ children: [new Paragraph({ children: [new TextRun("")] })] }),
  },
  children: [
    new Paragraph({
      spacing: { before: 0, after: 0 },
      children: [coverImg(773, 1159)],
    }),
  ],
};

// ─── HEADER / FOOTER PAGES DE CONTENU ────────────────────────────────────────
const contentHeader = new Header({
  children: [
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [
        logoImg(100, 29),
        new TextRun({ text: "   |   Checklist 30 Jours — Déployer Claude dans votre PME", size: 16, color: C.slateLight, font: "Arial" }),
      ],
    }),
    rule(C.claudeSalmon),
  ],
});

const contentFooter = new Footer({
  children: [
    rule(C.separator),
    new Paragraph({
      spacing: { before: 80, after: 0 },
      children: [
        new TextRun({ text: "lagencesauvage.com", size: 16, color: C.slateLight, font: "Arial" }),
        new TextRun({ text: "                                                                         ", size: 16, font: "Arial" }),
        new TextRun({ text: "Page ", size: 16, color: C.slateLight, font: "Arial" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.slateLight, font: "Arial" }),
      ],
    }),
  ],
});

// ─── PAGE INTRO — Chiffres clés ──────────────────────────────────────────────
const introChildren = [
  new Paragraph({
    ...sp(0, 100),
    children: [new TextRun({ text: "Votre guide opérationnel — 30 jours pour décoller", bold: true, size: 44, color: C.slate, font: "Arial" })],
  }),
  rule(C.indigo),
  gap(120),

  new Paragraph({
    ...sp(0, 160),
    children: [new TextRun({ text: "Cette checklist est conçue pour les PME qui veulent des résultats concrets, pas un cours théorique. Cochez chaque item quand c’est fait. Chaque semaine a un objectif unique — une seule priorité à la fois.", size: 20, color: C.slateMed, font: "Arial" })],
  }),

  new Paragraph({
    ...sp(0, 100),
    children: [new TextRun({ text: "Les chiffres qui justifient les 30 jours", bold: true, size: 26, color: C.slate, font: "Arial" })],
  }),

  new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [3008, 3009, 3009],
    rows: [new TableRow({
      children: [
        { chiffre: "7,5h", label: "gagnées par semaine et par collaborateur (BCG + London School of Economics, 2025)" },
        { chiffre: "25€", label: "par personne/mois pour le plan Claude Team — remboursé si Claude fait gagner 1h/mois" },
        { chiffre: "30j", label: "pour les premiers résultats mesurables selon les études PME françaises 2025" },
      ].map(({ chiffre, label }) =>
        new TableCell({
          width: { size: 3008, type: WidthType.DXA },
          shading: { fill: C.claudeCream, type: ShadingType.CLEAR },
          borders: {
            top: noB, bottom: noB, right: noB,
            left: { style: BorderStyle.SINGLE, size: 10, color: C.claudeSalmon },
          },
          margins: { top: 200, bottom: 200, left: 200, right: 120 },
          children: [
            new Paragraph({
              ...sp(0, 60),
              children: [new TextRun({ text: chiffre, bold: true, size: 52, color: C.indigo, font: "Arial" })],
            }),
            new Paragraph({
              ...sp(0, 0),
              children: [new TextRun({ text: label, size: 16, color: C.slateMed, font: "Arial" })],
            }),
          ],
        })
      ),
    })],
  }),

  gap(200),
  rule(C.separator),
  gap(120),

  new Paragraph({
    ...sp(0, 80),
    children: [new TextRun({ text: "Comment utiliser cette checklist", bold: true, size: 26, color: C.slate, font: "Arial" })],
  }),
  ...[
    "1.  Commencez par la Semaine 1 — ne sautez pas d’étape.",
    "2.  Cochez □ chaque item quand il est fait. Pas avant.",
    "3.  Si vous bloquez sur un item, passez au suivant — revenez-y la semaine d’après.",
    "4.  Chaque semaine a un objectif unique : lisez-le avant de commencer.",
  ].map(line =>
    new Paragraph({
      ...sp(0, 80),
      children: [new TextRun({ text: line, size: 19, color: C.slateMed, font: "Arial" })],
    })
  ),
];

// ─── SEMAINE 1 ────────────────────────────────────────────────────────────────
const semaine1Children = [
  ...weekHeader(1, "Le Commando", "Lancer le Commando", "3 pionniers. 1 tâche réelle. Pas de formation massive — des résultats dès vendredi."),
  ...checkItem(
    "Créer le compte Claude Team sur claude.com/pricing/team et souscrire à 3 à 5 licences.",
    "Choisissez le plan mensuel — pas d’engagement annuel pour commencer."
  ),
  ...checkItem(
    "Identifier 2 à 4 « pionniers » : des collaborateurs curieux, à l’aise avec le digital, volontaires.",
    "Pas les plus anciens, pas les plus résistants — les plus curieux."
  ),
  ...checkItem(
    "Envoyer l’email sécurité à toute l’équipe avec la règle d’or (template page 8) : ce qu’on ne met JAMAIS dans Claude.",
    "30 secondes à lire. Décision managériale, pas technique."
  ),
  ...checkItem(
    "Activer Artifacts dans les paramètres de chaque compte Claude (réglages → Fonctionnalités en avant-première).",
    "Artifacts permet à Claude de créer des documents, tableaux et présentations directement dans l’interface."
  ),
  ...checkItem(
    "Demander à chaque pionnier de réaliser UNE tâche pénible avec Claude avant vendredi — et de noter le temps gagné.",
    "Pas de consigne précise : ils choisissent leur tâche. L’autonomie crée l’engagement."
  ),
];

// ─── SEMAINE 2 ────────────────────────────────────────────────────────────────
const semaine2Children = [
  ...weekHeader(2, "Les Cerveaux d'Équipe", "Créer les Cerveaux d’Équipe", "Exploiter Projects pour que Claude connaisse votre entreprise par cœur."),
  ...checkItem(
    "Créer le premier Project dans Claude : cliquez « Projects » dans la barre latérale → « New project ».",
    "Nommez-le par pôle : « Marketing », « SAV », « Direction »... Un Project par métier."
  ),
  ...checkItem(
    "Uploader 3 à 5 documents de référence dans ce Project : anciens emails types, plaquette commerciale, procédures internes.",
    "Claude les mémorise pour toute la session — il parle comme vous, avec vos contenus."
  ),
  ...checkItem(
    "Organiser un « Café IA » de 30 min : les pionniers montrent leur meilleur résultat de la Semaine 1.",
    "Format : chacun partage son écran 5 min. Pas de présentation — juste la démonstration en live."
  ),
  ...checkItem(
    "Rédiger 3 prompts standards basés sur les succès du Café IA — des phrases copier-coller prêtes à l’emploi.",
    "Ex : « Résume ce compte rendu de réunion en 5 décisions actionnables avec responsable et délai. »"
  ),
  ...checkItem(
    "Sauvegarder ces 3 prompts dans les « Instructions du Project » pour que toute l’équipe y accède.",
    "Project → « Instructions » → coller les 3 prompts avec leur contexte d’utilisation."
  ),
];

// ─── SEMAINE 3 ────────────────────────────────────────────────────────────────
const semaine3Children = [
  ...weekHeader(3, "L’Extension", "Passer à l’Échelle", "Les pionniers deviennent les guides. On déploie à toute l’équipe."),
  ...checkItem(
    "Acheter les licences manquantes pour le reste des équipes concernées.",
    "Commencez par un seul département — pas toute l’entreprise d’un coup."
  ),
  ...checkItem(
    "Organiser la réunion de lancement officielle (45 min) — animée par vous + un pionnier.",
    "Structure : 5 min contexte dirigeant + 2 démos pionniers live + 10 min questions-réponses."
  ),
  ...checkItem(
    "Présenter 2 cas d’usage réels réalisés par l’équipe pendant la réunion.",
    "La preuve par l’exemple vaut 10 fois mieux que n’importe quelle promesse théorique."
  ),
  ...checkItem(
    "Assigner un parrainage : chaque nouveau membre est guidé par un pionnier pendant 2 semaines.",
    "1 pionnier = 2 à 3 filleuls max. Disponible 15 min/semaine pour répondre aux questions."
  ),
  ...checkItem(
    "Créer un canal « Pépites Claude » (Slack, Teams ou WhatsApp) pour partager les réussites du quotidien.",
    "Une bonne pratique partagée chaque semaine suffit à maintenir la dynamique collective."
  ),
];

// ─── SEMAINE 4 ────────────────────────────────────────────────────────────────
const semaine4Children = [
  ...weekHeader(4, "La Standardisation", "Standardiser & Mesurer", "Ancrer les usages. Calculer le ROI réel. Définir la suite."),
  ...checkItem(
    "Transformer les 5 meilleures utilisations en modes d’emploi de 2 lignes : contexte + prompt + résultat attendu.",
    "Ce sont vos procédures IA internes. Partagez-les dans le Project commun."
  ),
  ...checkItem(
    "Interroger chaque collaborateur : « Combien d’heures as-tu gagnées cette semaine grâce à Claude ? »",
    "Pas besoin de méthode complexe — une estimation honнête par chacun suffit."
  ),
  ...checkItem(
    "Calculer le ROI réel : (Heures gagnées × Taux horaire moyen) − Coût des licences = Bénéfice net mensuel.",
    "Voir la calculette ci-dessous."
  ),
  ...checkItem(
    "Réorganiser les Projects Claude par pôle : supprimer les tests, structurer par département.",
    "Un Project propre = un outil qu’on utilise. Un Project en vrac = un outil qu’on abandonne."
  ),
  ...checkItem(
    "Définir collectivement les 3 prochaines tâches chronophages à déléguer à Claude le mois prochain."
  ),

  gap(240),

  fullCell([
    new Paragraph({
      ...sp(0, 100),
      children: [new TextRun({ text: "Calculez votre ROI maintenant", bold: true, size: 24, color: C.white, font: "Arial" })],
    }),
    ...[
      ["Heures gagnées/semaine/collaborateur", "_________ h  × 4 semaines = _________ h/mois"],
      ["× Nombre de collaborateurs équipés", "× _________"],
      ["× Taux horaire moyen (€)", "× _________ €"],
      ["= Gain mensuel brut", "= _________ €"],
      ["− Coût licences/mois (25€ × nb personnes)", "− _________ €"],
      ["= Bénéfice net premier mois", "= _________ €  ✓"],
    ].map(([label, val]) =>
      new Paragraph({
        ...sp(0, 60),
        children: [
          new TextRun({ text: label + "  ", size: 18, color: C.indigoMid, font: "Arial" }),
          new TextRun({ text: val, bold: true, size: 18, color: C.white, font: "Arial" }),
        ],
      })
    ),
  ], C.indigoDark, NB, { top: 240, bottom: 240, left: 320, right: 320 }),
];

// ─── QUICK WINS PAR MÉTIER ────────────────────────────────────────────────────
const quickWinsChildren = [
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({
    ...sp(0, 80),
    children: [new TextRun({ text: "Quick Wins par Métier — Dès J1", bold: true, size: 40, color: C.slate, font: "Arial" })],
  }),
  rule(C.claudeSalmon),
  new Paragraph({
    ...sp(80, 0),
    children: [new TextRun({ text: "Trois prompts copier-coller pour des résultats immédiats dans les métiers les plus courants.", size: 19, color: C.slateMed, font: "Arial" })],
  }),

  ...quickWinBlock(
    "Comptabilité & Finance",
    C.indigo,
    "Uploader l’export CSV ou PDF des dépenses mensuelles dans Claude.",
    "Agis comme mon expert-comptable. Analyse ces dépenses, catégorise chaque ligne par nature de charge, identifie les 3 anomalies ou dépassements à surveiller, et génère un tableau de synthèse prêt pour ma réunion de gestion mensuelle.",
    "2h d’Excel → 15 min · Économie : ~105 min par mois"
  ),

  ...quickWinBlock(
    "Marketing & Communication",
    C.indigo,
    "Uploader vos 3 derniers articles ou posts dans un Project Claude dédié.",
    "Lis ce contenu pour comprendre mon ton, mon style et mes sujets de prédilection. Génère maintenant 4 posts LinkedIn anonçant [votre actualité], en respectant exactement ma façon d’écrire. Commence chaque post par une accroche différente.",
    "3h de rédaction → 30 min · Économie : ~150 min pour un lot de 4 posts"
  ),

  ...quickWinBlock(
    "Service Client & SAV",
    C.indigo,
    "Uploader votre FAQ et vos modèles de réponse dans un Project Claude dédié.",
    "Agis comme mon responsable SAV empathique. Voici un email de client insatisfait : [coller l’email]. Rédige une réponse qui reconnaît son insatisfaction, explique la situation clairement, et propose une solution concrète avec un délai précis.",
    "15 min/ticket → 2 min · Économie : ~65 min pour 5 tickets/jour"
  ),
];

// ─── 3 ERREURS FATALES + BONUS EMAIL ─────────────────────────────────────────
const erreursChildren = [
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({
    ...sp(0, 80),
    children: [new TextRun({ text: "Les 3 Erreurs Fatales qui tuent l’adoption", bold: true, size: 36, color: C.slate, font: "Arial" })],
  }),
  rule(C.claudeSalmon),
  gap(40),

  ...erreurFatale(
    "1",
    "La page blanche sans exemple",
    "Laisser l’équipe face au chat sans prompt de départ = paralysie. 80% des utilisateurs abandonnent si la première tentative ne donne rien.",
    "Fournir les 3 prompts standards (Semaine 2) AVANT le lancement officiel."
  ),
  ...erreurFatale(
    "2",
    "Ignorer les Projects",
    "Utiliser Claude sans nourrir les Projects avec vos documents internes = réponses génériques. L’équipe est déçue et n’y retourne pas.",
    "Uploader au minimum votre plaquette + 3 emails types dans chaque Project avant de le partager."
  ),
  ...erreurFatale(
    "3",
    "La délégation aveugle",
    "Claude hallucine parfois : chiffres incorrects, citations inventées, raisonnements erronés. Un livrable non relu peut coûter cher.",
    "Règle d’or : l’humain valide TOUJOURS le livrable final. Claude est un stagiaire brillant, pas un expert certifié."
  ),

  gap(200),
  rule(C.separator),
  gap(160),

  new Paragraph({
    ...sp(0, 80),
    children: [
      new TextRun({ text: "BONUS — ", bold: true, size: 22, color: C.claudeSalmon, font: "Arial" }),
      new TextRun({ text: "Template email sécurité à envoyer dès J1", bold: true, size: 22, color: C.slate, font: "Arial" }),
    ],
  }),
  new Paragraph({
    ...sp(0, 100),
    children: [new TextRun({ text: "Copiez-collez dans votre messagerie. Objet : Notre règle d’or pour utiliser Claude", italics: true, size: 17, color: C.slateLight, font: "Arial" })],
  }),

  fullCell([
    ...[
      "Bonjour à tous,",
      "",
      "À partir d’aujourd’hui, nous testons Claude pour gagner du temps sur nos tâches quotidiennes.",
      "",
      "Une seule règle à respecter — ne jamais insérer dans Claude :",
      "  ·  Des données personnelles de clients (nom + email + téléphone ensemble)",
      "  ·  Des RIB ou coordonnées bancaires",
      "  ·  Des contrats ou documents marqués « confidentiel »",
      "",
      "Pour tout le reste (emails, rapports, posts LinkedIn, résumés de réunion, FAQ) : à vous de jouer !",
      "",
      "Si vous avez un doute, venez me voir avant d’envoyer quoi que ce soit.",
      "",
      "[Votre prénom]",
    ].map(line =>
      new Paragraph({
        spacing: { before: 0, after: line === "" ? 80 : 20 },
        children: [new TextRun({ text: line, size: 18, font: "Arial", color: C.slate })],
      })
    ),
  ], C.claudeCream, NB, { top: 200, bottom: 200, left: 280, right: 280 }),
];

// ─── BACK COVER ───────────────────────────────────────────────────────────────
const backCoverChildren = [
  new Paragraph({ children: [new PageBreak()] }),
  gap(320),

  fullCell([
    new Paragraph({
      ...sp(0, 120),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Félicitations.", bold: true, size: 48, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 80),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Vous faites partie des 5% de PME qui déploient l’IA sérieusement.", size: 22, color: C.indigoMid, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 0),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Les 95% autres ratent le coche. Pas vous.", size: 20, color: C.indigoMid, font: "Arial" })],
    }),

    gap(200),
    rule(C.indigoMid),
    gap(160),

    new Paragraph({
      ...sp(0, 80),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Vous voulez aller plus loin ?", bold: true, size: 28, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 60),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Configurer les Projects Claude sur-mesure pour vos métiers,", size: 19, color: C.indigoMid, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 60),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "connecter Claude à vos outils (CRM, messagerie, devis),", size: 19, color: C.indigoMid, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 60),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "ou automatiser des workflows entiers sans développeur :", size: 19, color: C.indigoMid, font: "Arial" })],
    }),
    gap(160),

    new Paragraph({
      ...sp(0, 80),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Diagnostic IA — 30 minutes offertes", bold: true, size: 28, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 60),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "On analyse VOS processus et on vous dit exactement où l’IA", size: 19, color: C.indigoMid, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 60),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "peut vous faire gagner 10h/semaine. Sans engagement.", size: 19, color: C.indigoMid, font: "Arial" })],
    }),
    gap(120),
    new Paragraph({
      ...sp(0, 0),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: ">> lagencesauvage.com/diagnostic-ia/", bold: true, size: 24, color: C.white, font: "Arial" })],
    }),
  ], C.indigo, NB, { top: 320, bottom: 320, left: 400, right: 400 }),

  gap(320),

  new Paragraph({
    ...sp(0, 80),
    alignment: AlignmentType.CENTER,
    children: [logoImg(160, 47)],
  }),
  new Paragraph({
    ...sp(0, 0),
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "lagencesauvage.com  ·  hello@lagencesauvage.com", size: 17, color: C.slateLight, font: "Arial" })],
  }),
];

// ─── SECTION CONTENU ─────────────────────────────────────────────────────────
const contentSection = {
  properties: {
    page: {
      size: { width: PAGE_W, height: PAGE_H },
      margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
    },
  },
  headers: { default: contentHeader },
  footers: { default: contentFooter },
  children: [
    ...introChildren,
    ...semaine1Children,
    ...semaine2Children,
    ...semaine3Children,
    ...semaine4Children,
    ...quickWinsChildren,
    ...erreursChildren,
    ...backCoverChildren,
  ],
};

// ─── DOCUMENT FINAL ───────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 20, color: C.slateMed } },
    },
  },
  sections: [coverSection, contentSection],
});

// ─── EXPORT ──────────────────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, 'checklist-30-jours-claude-pme.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('OK — fichier généré :', outPath);
}).catch(err => {
  console.error('ERREUR :', err.message);
  process.exit(1);
});

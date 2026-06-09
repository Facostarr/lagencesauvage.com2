// Lead Magnet — "Grille de pilotage SEO + GEO 2026 — 10 indicateurs de gouvernance"
// L'Agence Sauvage — lagencesauvage.com
// Généré avec docx@9.6.1  (workflow validé : cf. memory project-lead-magnets)

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── COULEURS ────────────────────────────────────────────────────────────────
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
  amber:       "B45309",
};

// A4, marges 1 pouce (1440 DXA)
const PAGE_W = 11906;
const PAGE_H = 16838;
const MARGIN = 1440;
const CW = PAGE_W - 2 * MARGIN; // 9026 DXA

const noB = { style: BorderStyle.NONE, size: 0, color: C.white };
const NB  = { top: noB, bottom: noB, left: noB, right: noB };

// ─── ASSETS ──────────────────────────────────────────────────────────────────
const logoPath = path.resolve(__dirname, '../../static/assets/images/Logo-Agence-Sauvage.svg');
const logoData = fs.readFileSync(logoPath);
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function sp(before, after) { return { spacing: { before, after } }; }
function gap(h = 160) { return new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun("")] }); }
function rule(color = C.separator, size = 4) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size, color } },
    children: [new TextRun("")],
  });
}
function fullCell(children, fillColor, borders = NB, margins = { top: 200, bottom: 200, left: 300, right: 300 }) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CW, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        borders, margins, children,
      })],
    })],
  });
}

// Bandeau de catégorie : bande indigo + libellé
function catHeader(label) {
  const BAND = 240;
  return [
    gap(200),
    new Table({
      width: { size: CW, type: WidthType.DXA },
      columnWidths: [BAND, CW - BAND],
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: BAND, type: WidthType.DXA },
            shading: { fill: C.indigo, type: ShadingType.CLEAR },
            borders: NB, margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: [new Paragraph({ children: [new TextRun("")] })],
          }),
          new TableCell({
            width: { size: CW - BAND, type: WidthType.DXA },
            shading: { fill: C.indigoLight, type: ShadingType.CLEAR },
            borders: NB, margins: { top: 140, bottom: 140, left: 240, right: 240 },
            children: [new Paragraph({
              spacing: { before: 0, after: 0 },
              children: [new TextRun({ text: label, bold: true, size: 24, color: C.indigoDark, font: "Arial" })],
            })],
          }),
        ],
      })],
    }),
    gap(120),
  ];
}

// Un indicateur : numéro + titre, preuve à exiger, réf. optionnelle, ligne de notation
function indicateur(num, titre, preuve, ref) {
  const out = [
    new Paragraph({
      ...sp(120, 50),
      children: [
        new TextRun({ text: `${num}.  `, bold: true, size: 24, color: C.indigo, font: "Arial" }),
        new TextRun({ text: titre, bold: true, size: 22, color: C.slate, font: "Arial" }),
      ],
    }),
    new Paragraph({
      ...sp(0, ref ? 30 : 70),
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Preuve à exiger : ", bold: true, size: 18, color: C.indigo, font: "Arial" }),
        new TextRun({ text: preuve, size: 18, color: C.slateMed, font: "Arial" }),
      ],
    }),
  ];
  if (ref) {
    out.push(new Paragraph({
      ...sp(0, 70),
      indent: { left: 360 },
      children: [new TextRun({ text: `Réf. : ${ref}`, italics: true, size: 15, color: C.slateLight, font: "Arial" })],
    }));
  }
  out.push(new Paragraph({
    ...sp(0, 60),
    indent: { left: 360 },
    children: [new TextRun({ text: "Note :    ☐ 0  absent        ☐ 1  partiel        ☐ 2  en place et prouvé", size: 18, color: C.slate, font: "Arial" })],
  }));
  out.push(rule(C.separator));
  return out;
}

// ─── COUVERTURE (typographique, sans image) ──────────────────────────────────
const coverSection = {
  properties: {
    titlePage: true,
    page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } },
  },
  headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun("")] })] }), first: new Header({ children: [new Paragraph({ children: [new TextRun("")] })] }) },
  footers: { default: new Footer({ children: [new Paragraph({ children: [new TextRun("")] })] }), first: new Footer({ children: [new Paragraph({ children: [new TextRun("")] })] }) },
  children: [
    gap(700),
    new Paragraph({ ...sp(0, 80), children: [logoImg(180, 53)] }),
    gap(240),
    new Paragraph({
      ...sp(0, 40),
      children: [new TextRun({ text: "GUIDE DIRIGEANT · 2026", bold: true, size: 20, color: C.indigo, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 120),
      children: [new TextRun({ text: "Grille de pilotage SEO + GEO", bold: true, size: 64, color: C.slate, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 200),
      children: [new TextRun({ text: "Les 10 indicateurs de gouvernance pour vérifier que votre prestataire a pris le virage de l'IA.", size: 28, color: C.slateMed, font: "Arial" })],
    }),
    rule(C.indigo, 8),
    gap(160),
    new Paragraph({
      ...sp(0, 80),
      children: [new TextRun({ text: "À utiliser à votre prochain point mensuel — avec votre agence, votre freelance ou votre équipe interne.", italics: true, size: 20, color: C.slateLight, font: "Arial" })],
    }),
    gap(2600),
    new Paragraph({
      ...sp(0, 0),
      children: [new TextRun({ text: "L'Agence Sauvage  ·  IA & automatisation pour TPE/PME  ·  lagencesauvage.com", size: 17, color: C.slateLight, font: "Arial" })],
    }),
  ],
};

// ─── HEADER / FOOTER CONTENU ─────────────────────────────────────────────────
const contentHeader = new Header({
  children: [
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [
        logoImg(100, 29),
        new TextRun({ text: "   |   Grille de pilotage SEO + GEO 2026", size: 16, color: C.slateLight, font: "Arial" }),
      ],
    }),
    rule(C.indigo),
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

// ─── INTRO ───────────────────────────────────────────────────────────────────
const introChildren = [
  new Paragraph({
    ...sp(0, 100),
    children: [new TextRun({ text: "Pourquoi cette grille", bold: true, size: 40, color: C.slate, font: "Arial" })],
  }),
  rule(C.indigo),
  gap(80),
  new Paragraph({
    ...sp(0, 140),
    children: [new TextRun({ text: "Le marché de la recherche bascule. Vos clients vous évaluent désormais autant dans ChatGPT, Claude ou Perplexity que sur Google. Ceci n'est pas un audit technique : c'est un outil de gouvernance. En un point mensuel, vous vérifiez que votre prestataire — agence, freelance ou équipe interne — a pris ce virage.", size: 20, color: C.slateMed, font: "Arial" })],
  }),
  new Paragraph({
    ...sp(0, 160),
    children: [
      new TextRun({ text: "Pas besoin d'être technique. ", bold: true, size: 20, color: C.slate, font: "Arial" }),
      new TextRun({ text: "Pour chaque indicateur, demandez la preuve indiquée. Une preuve qu'on ne peut pas vous montrer à l'écran est une case non cochée.", size: 20, color: C.slateMed, font: "Arial" }),
    ],
  }),
  fullCell([
    new Paragraph({
      ...sp(0, 40),
      children: [new TextRun({ text: "Comment noter", bold: true, size: 22, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 0),
      children: [new TextRun({ text: "Attribuez à chaque indicateur :   0 (absent)   ·   1 (partiel)   ·   2 (en place et prouvé).   Total sur 20.", size: 19, color: C.indigoMid, font: "Arial" })],
    }),
  ], C.indigoDark),
];

// ─── LES 10 INDICATEURS ──────────────────────────────────────────────────────
const indicateursChildren = [
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({
    ...sp(0, 80),
    children: [new TextRun({ text: "Les 10 indicateurs", bold: true, size: 40, color: C.slate, font: "Arial" })],
  }),
  rule(C.indigo),

  ...catHeader("Fondations techniques"),
  ...indicateur(1, "Vitesse & mobile sous contrôle",
    "un rapport de performance (Core Web Vitals) commenté, où les lenteurs éventuelles sont identifiées et justifiées."),
  ...indicateur(2, "Aucune page stratégique perdue",
    "la liste des redirections en place ; vos pages offres et contact répondent toujours, sans erreur."),
  ...indicateur(3, "Site indexable et sécurisé",
    "la couverture d'indexation dans Google Search Console ; connexion HTTPS active sur tout le site."),

  ...catHeader("Autorité — ce qui inspire confiance aux IA comme à Google"),
  ...indicateur(4, "Contenus signés et page « À propos » crédible",
    "les pages auteur (nom, fonction, expérience réelle), pas des articles anonymes."),
  ...indicateur(5, "Preuves et sources",
    "des cas clients chiffrés et vérifiables, et des affirmations appuyées par des sources datées."),

  ...catHeader("Visibilité IA (GEO) — la partie qui distingue un prestataire à jour"),
  ...indicateur(6, "Porte ouverte aux IA",
    "vos fichiers robots.txt et llms.txt : le premier autorise les robots d'OpenAI, Anthropic, Perplexity et Google ; le second guide les IA vers vos contenus clés.",
    "documentation officielle OpenAI (GPTBot) et Anthropic (ClaudeBot)."),
  ...indicateur(7, "Contenu lisible par les machines",
    "le test Google Rich Results sur vos pages clés : données structurées (auteur, questions fréquentes, offre) et réponses directes en tête de section.",
    "schema.org et Google Search Central (données structurées)."),
  ...indicateur(8, "Empreinte externe",
    "la liste des mentions et citations de votre marque obtenues sur des sites tiers d'autorité — les IA s'appuient massivement sur ce que les autres disent de vous, pas seulement sur votre propre site.",
    "Forrester, enquête 2026 sur les sources de recherche B2B."),

  ...catHeader("Pilotage & mesure"),
  ...indicateur(9, "Suivi de la visibilité IA",
    "une capture du suivi : êtes-vous cité par les IA, et sur quelles questions ? Via Google Search Console (AI Overviews) et un outil de brand tracking.",
    "Google Search Console (rapports AI Overviews)."),
  ...indicateur(10, "Reporting orienté résultat",
    "le reporting du mois : nombre de leads et de conversions par source, lisible en 5 minutes — pas un tableau d'« impressions »."),
];

// ─── TESTS DIY + SCORE ───────────────────────────────────────────────────────
const testsScoreChildren = [
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({
    ...sp(0, 80),
    children: [new TextRun({ text: "2 tests à faire vous-même", bold: true, size: 36, color: C.slate, font: "Arial" })],
  }),
  new Paragraph({
    ...sp(0, 120),
    children: [new TextRun({ text: "En une minute, sans aucune compétence technique.", italics: true, size: 19, color: C.slateLight, font: "Arial" })],
  }),
  fullCell([
    new Paragraph({
      ...sp(0, 60),
      children: [
        new TextRun({ text: "Test 1 — Les IA ont-elles le droit de vous lire ?  ", bold: true, size: 20, color: C.indigoDark, font: "Arial" }),
      ],
    }),
    new Paragraph({
      ...sp(0, 80),
      children: [
        new TextRun({ text: "Tapez dans votre navigateur ", size: 18, color: C.slateMed, font: "Arial" }),
        new TextRun({ text: "votre-domaine.com/robots.txt", bold: true, size: 18, color: C.slate, font: "Courier New" }),
        new TextRun({ text: "  puis cherchez « GPTBot ». S'il est absent ou suivi de « Disallow », votre site bloque l'IA — souvent à votre insu.", size: 18, color: C.slateMed, font: "Arial" }),
      ],
    }),
    new Paragraph({
      ...sp(80, 60),
      children: [
        new TextRun({ text: "Test 2 — Le standard d'orientation des IA est-il en place ?  ", bold: true, size: 20, color: C.indigoDark, font: "Arial" }),
      ],
    }),
    new Paragraph({
      ...sp(0, 0),
      children: [
        new TextRun({ text: "Tapez ", size: 18, color: C.slateMed, font: "Arial" }),
        new TextRun({ text: "votre-domaine.com/llms.txt", bold: true, size: 18, color: C.slate, font: "Courier New" }),
        new TextRun({ text: "  . Page introuvable ? Le fichier qui guide les IA vers vos contenus clés n'existe pas encore.", size: 18, color: C.slateMed, font: "Arial" }),
      ],
    }),
  ], C.bgLight, { top: { style: BorderStyle.SINGLE, size: 8, color: C.indigo }, bottom: noB, left: noB, right: noB }),

  gap(260),
  new Paragraph({
    ...sp(0, 80),
    children: [new TextRun({ text: "Votre score sur 20", bold: true, size: 36, color: C.slate, font: "Arial" })],
  }),
  rule(C.indigo),
  gap(60),
  ...[
    ["16 – 20", "Prestataire à jour des enjeux 2026. Continuez, et fixez le prochain cap.", C.indigo],
    ["10 – 15", "Des angles morts. Fixez avec votre prestataire un plan IA à 3 mois, avec des objectifs clairs.", C.amber],
    ["Moins de 10", "Votre visibilité 2026 est exposée. Il est temps d'en parler avant que vos concurrents ne prennent la place.", C.slate],
  ].map(([plage, txt, col]) =>
    new Paragraph({
      ...sp(0, 110),
      children: [
        new TextRun({ text: `${plage}  —  `, bold: true, size: 21, color: col, font: "Arial" }),
        new TextRun({ text: txt, size: 19, color: C.slateMed, font: "Arial" }),
      ],
    })
  ),
];

// ─── 5 QUESTIONS DE PILOTAGE ─────────────────────────────────────────────────
const questionsChildren = [
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({
    ...sp(0, 80),
    children: [new TextRun({ text: "5 questions de pilotage", bold: true, size: 36, color: C.slate, font: "Arial" })],
  }),
  new Paragraph({
    ...sp(0, 160),
    children: [new TextRun({ text: "À poser à votre prochain point. Notez ceux qui esquivent — c'est aussi instructif que les réponses.", italics: true, size: 19, color: C.slateLight, font: "Arial" })],
  }),
  ...[
    "Comment mesurez-vous si une IA cite notre entreprise, et sur quelles questions ?",
    "Notre site autorise-t-il les robots d'OpenAI et d'Anthropic — et pourquoi avez-vous fait ce choix ?",
    "Ces trois derniers mois, avez-vous obtenu des mentions de notre marque sur des sites tiers ?",
    "Combien de demandes qualifiées le canal organique a-t-il généré le mois dernier ?",
    "Pouvez-vous me montrer un reporting que je comprends en cinq minutes ?",
  ].map((q, i) =>
    new Paragraph({
      ...sp(0, 130),
      children: [
        new TextRun({ text: `${i + 1}.  `, bold: true, size: 22, color: C.indigo, font: "Arial" }),
        new TextRun({ text: q, size: 20, color: C.slate, font: "Arial" }),
      ],
    })
  ),
];

// ─── BACK COVER — CTA AUDIT ──────────────────────────────────────────────────
const backCoverChildren = [
  new Paragraph({ children: [new PageBreak()] }),
  gap(360),
  fullCell([
    new Paragraph({
      ...sp(0, 100),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Un doute sur les réponses ?", bold: true, size: 40, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 60),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Vous préférez un regard extérieur, sans langue de bois ?", size: 21, color: C.indigoMid, font: "Arial" })],
    }),
    gap(200),
    rule(C.indigoMid),
    gap(160),
    new Paragraph({
      ...sp(0, 80),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Audit IA gratuit — 30 minutes", bold: true, size: 30, color: C.white, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 60),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Nous passons votre site au crible de ces 10 indicateurs", size: 20, color: C.indigoMid, font: "Arial" })],
    }),
    new Paragraph({
      ...sp(0, 60),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "et vous repartez avec vos priorités. Sans engagement.", size: 20, color: C.indigoMid, font: "Arial" })],
    }),
    gap(140),
    new Paragraph({
      ...sp(0, 0),
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: ">> lagencesauvage.com/#audit-form", bold: true, size: 26, color: C.white, font: "Arial" })],
    }),
  ], C.indigo, NB, { top: 360, bottom: 360, left: 400, right: 400 }),
  gap(360),
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
  properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
  headers: { default: contentHeader },
  footers: { default: contentFooter },
  children: [
    ...introChildren,
    ...indicateursChildren,
    ...testsScoreChildren,
    ...questionsChildren,
    ...backCoverChildren,
  ],
};

// ─── DOCUMENT ────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 20, color: C.slateMed } } } },
  sections: [coverSection, contentSection],
});

const outPath = path.resolve(__dirname, 'grille-pilotage-seo-geo-2026.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('OK — fichier généré :', outPath);
}).catch(err => {
  console.error('ERREUR :', err.message);
  process.exit(1);
});

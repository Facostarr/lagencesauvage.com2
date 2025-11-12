// =============================================================================
// VERCEL FUNCTION - Get Blog Posts from Notion
// =============================================================================
// Fichier : /api/get-blog-posts.js
// 
// Cette fonction récupère les articles de blog depuis Notion et les formate
// pour affichage sur le site. Elle est appelée automatiquement lors du build.
//
// Configuration requise dans Vercel Dashboard :
// - NOTION_API_KEY = secret_xxx...
// - NOTION_BLOG_DATABASE_ID = xxx...
// =============================================================================

/**
 * Handler principal de la fonction Vercel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function handler(req, res) {
  // ========================================
  // 1. CORS Headers
  // ========================================
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Gérer preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // ========================================
  // 2. Vérifier la méthode HTTP
  // ========================================
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET requests are accepted'
    });
  }
  
  // ========================================
  // 3. Vérifier les variables d'environnement
  // ========================================
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_BLOG_DATABASE_ID) {
    console.error('Missing environment variables');
    return res.status(500).json({
      error: 'Configuration error',
      message: 'Notion API credentials not configured'
    });
  }
  
  try {
    // ========================================
    // 4. Récupérer les articles depuis Notion
    // ========================================
    const notionResponse = await fetch('https://api.notion.com/v1/databases/' + process.env.NOTION_BLOG_DATABASE_ID + '/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        filter: {
          property: 'Statut',
          select: {
            equals: 'Publié'
          }
        },
        sorts: [
          {
            property: 'Date de publication',
            direction: 'descending'
          }
        ]
      })
    });
    
    if (!notionResponse.ok) {
      const errorData = await notionResponse.json();
      console.error('Notion API Error:', errorData);
      throw new Error(`Notion API returned ${notionResponse.status}`);
    }
    
    const notionData = await notionResponse.json();
    
    // ========================================
    // 5. Formater les articles
    // ========================================
    const articles = notionData.results.map(page => {
      return {
        id: page.id,
        titre: extractPlainText(page.properties.Titre),
        slug: extractPlainText(page.properties.Slug),
        categorie: extractSelect(page.properties.Catégorie),
        tags: extractMultiSelect(page.properties.Tags),
        datePublication: extractDate(page.properties['Date de publication']),
        description: extractPlainText(page.properties['Description courte']),
        imageCover: extractFile(page.properties['Image cover']),
        url: `/blog/${extractPlainText(page.properties.Slug)}.html`
      };
    });
    
    // ========================================
    // 6. Retourner les articles
    // ========================================
    return res.status(200).json({
      success: true,
      count: articles.length,
      articles: articles
    });
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch blog posts from Notion',
      // En développement uniquement :
      // debug: error.message
    });
  }
}

// =============================================================================
// FONCTIONS UTILITAIRES POUR EXTRAIRE LES DONNÉES NOTION
// =============================================================================

/**
 * Extrait le texte brut d'une propriété rich_text ou title
 */
function extractPlainText(property) {
  if (!property) return '';
  
  if (property.type === 'title' && property.title) {
    return property.title.map(t => t.plain_text).join('');
  }
  
  if (property.type === 'rich_text' && property.rich_text) {
    return property.rich_text.map(t => t.plain_text).join('');
  }
  
  return '';
}

/**
 * Extrait une valeur select
 */
function extractSelect(property) {
  if (!property || property.type !== 'select') return '';
  return property.select?.name || '';
}

/**
 * Extrait les valeurs multi-select
 */
function extractMultiSelect(property) {
  if (!property || property.type !== 'multi_select') return [];
  return property.multi_select?.map(item => item.name) || [];
}

/**
 * Extrait une date
 */
function extractDate(property) {
  if (!property || property.type !== 'date') return '';
  return property.date?.start || '';
}

/**
 * Extrait un fichier/URL
 */
function extractFile(property) {
  if (!property || property.type !== 'files') return '';
  
  if (property.files && property.files.length > 0) {
    const file = property.files[0];
    return file.file?.url || file.external?.url || '';
  }
  
  return '';
}

// =============================================================================
// UTILISATION
// =============================================================================
// 
// Pour tester en local :
// 1. Créer .env.local avec :
//    NOTION_API_KEY=secret_xxx...
//    NOTION_BLOG_DATABASE_ID=xxx...
// 
// 2. Lancer : vercel dev
// 
// 3. Accéder à : http://localhost:3000/api/get-blog-posts
// 
// Pour déployer :
// 1. Ajouter les variables d'environnement dans Vercel Dashboard
// 2. Push sur GitHub → déploiement automatique
// 
// =============================================================================

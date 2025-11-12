// ============================================
// BLOG.JS - L'Agence Sauvage
// Recherche et filtres pour le blog
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Éléments du DOM
  const searchInput = document.getElementById('searchInput');
  const categoryFilters = document.querySelectorAll('.category-filter');
  const articleCards = document.querySelectorAll('.article-card:not(.article-card--coming-soon)');
  const articlesGrid = document.getElementById('articlesGrid');
  const noResults = document.getElementById('noResults');

  let activeCategory = 'all';
  let searchQuery = '';

  // ============================================
  // Fonction de filtrage des articles
  // ============================================
  function filterArticles() {
    let visibleCount = 0;

    articleCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTags = card.getAttribute('data-tags')?.toLowerCase() || '';
      const cardTitle = card.querySelector('.article-card__title')?.textContent.toLowerCase() || '';
      const cardDescription = card.querySelector('.article-card__description')?.textContent.toLowerCase() || '';
      
      // Recherche dans titre, description et tags
      const searchContent = `${cardTitle} ${cardDescription} ${cardTags}`;
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());
      
      // Filtrage par catégorie
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      
      // Afficher/masquer la card
      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Afficher le message "Aucun résultat" si nécessaire
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // ============================================
  // Événement : Recherche
  // ============================================
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      searchQuery = e.target.value;
      filterArticles();
    });
  }

  // ============================================
  // Événement : Filtres par catégorie
  // ============================================
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Retirer la classe active de tous les filtres
      categoryFilters.forEach(f => f.classList.remove('active'));
      
      // Ajouter la classe active au filtre cliqué
      this.classList.add('active');
      
      // Mettre à jour la catégorie active
      activeCategory = this.getAttribute('data-category');
      
      // Filtrer les articles
      filterArticles();
    });
  });

  // ============================================
  // Smooth scroll pour la table des matières
  // ============================================
  const tocLinks = document.querySelectorAll('.toc__list a');
  
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 100; // Offset pour le header sticky
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Analytics : Tracking des clics sur articles
  // ============================================
  articleCards.forEach(card => {
    card.addEventListener('click', function() {
      const articleTitle = this.querySelector('.article-card__title a')?.textContent || 'Unknown';
      const articleCategory = this.getAttribute('data-category') || 'Unknown';
      
      // Envoyer l'événement à Plausible Analytics si disponible
      if (typeof plausible !== 'undefined') {
        plausible('Article Click', {
          props: {
            title: articleTitle,
            category: articleCategory
          }
        });
      }
    });
  });

  // ============================================
  // Tracking des partages sociaux
  // ============================================
  const shareButtons = document.querySelectorAll('.share-button');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', function() {
      const platform = this.classList.contains('share-button--linkedin') ? 'LinkedIn' :
                      this.classList.contains('share-button--twitter') ? 'Twitter' :
                      this.classList.contains('share-button--email') ? 'Email' : 'Unknown';
      
      // Envoyer l'événement à Plausible Analytics si disponible
      if (typeof plausible !== 'undefined') {
        plausible('Article Share', {
          props: {
            platform: platform,
            article: document.title
          }
        });
      }
    });
  });
});

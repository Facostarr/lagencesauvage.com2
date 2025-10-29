// =============================================================================
// L'AGENCE SAUVAGE - JavaScript Principal
// =============================================================================

// Menu Hamburger Mobile
const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');
const body = document.body;

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fermer menu au clic sur un lien
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });

  // Fermer menu au clic en dehors
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('active')) {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });
}

// Formulaire d'audit
const auditForm = document.getElementById('auditForm');
const feedback = document.getElementById('formFeedback');

if (auditForm) {
  auditForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Envoi en cours...';
    
    if (feedback) {
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';
    }
    
    try {
      const formData = new FormData(this);
      
      // Simulation d'envoi (remplacer par vraie intégration)
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('📧 Données du formulaire:', Object.fromEntries(formData));
      
      // Succès
      if (feedback) {
        feedback.textContent = '✅ Merci ! Nous vous contacterons sous 24h pour planifier votre audit gratuit.';
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
      }
      
      this.reset();
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      
      if (feedback) {
        feedback.textContent = '❌ Une erreur est survenue. Veuillez réessayer ou nous contacter directement à contact@lagencesauvage.com';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
      }
      
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

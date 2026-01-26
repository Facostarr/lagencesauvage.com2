// =============================================================================
// PRESENTATION.JS - L'Agence Sauvage
// Animations scroll, indicateurs de progression, formulaire
// =============================================================================

(function() {
  'use strict';

  // =============================================================================
  // 1. INTERSECTION OBSERVER - Animations au scroll
  // =============================================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionnel : désactiver l'observation après animation
        // animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observer tous les éléments animables
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animationObserver.observe(el);
  });

  // =============================================================================
  // 2. INDICATEURS DE PROGRESSION
  // =============================================================================
  const sections = document.querySelectorAll('.pres-section');
  const progressDots = document.querySelectorAll('.pres-progress__dot');

  // Observer pour les sections
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionNumber = entry.target.dataset.section;
        updateProgressDots(sectionNumber);
      }
    });
  }, {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  function updateProgressDots(activeSection) {
    progressDots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.dataset.section === activeSection) {
        dot.classList.add('active');
      }
    });
  }

  // Click sur les dots pour naviguer
  progressDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetSection = document.querySelector(`[data-section="${dot.dataset.section}"]`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // =============================================================================
  // 3. ANIMATION DES COMPTEURS (Stats)
  // =============================================================================
  const counters = document.querySelectorAll('.pres-stats__number[data-count]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, {
    threshold: 0.5
  });

  const statsSection = document.querySelector('.pres-stats');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000; // 2 secondes
      const increment = target / (duration / 16); // ~60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }

  // =============================================================================
  // 4. SMOOTH SCROLL
  // =============================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =============================================================================
  // 5. GESTION DU FORMULAIRE
  // =============================================================================
  const form = document.getElementById('presentationForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Envoi en cours...</span>';

      feedback.style.display = 'none';

      try {
        const formData = {
          name: form.querySelector('[name="name"]').value.trim(),
          email: form.querySelector('[name="email"]').value.trim(),
          phone: form.querySelector('[name="phone"]').value.trim() || '',
          company: form.querySelector('[name="company"]').value.trim(),
          company_size: form.querySelector('[name="company_size"]').value,
          challenge: form.querySelector('[name="challenge"]').value.trim() || '',
          source: form.querySelector('[name="source"]').value
        };

        // Validation
        if (!formData.name || !formData.email || !formData.company || !formData.company_size) {
          throw new Error('Veuillez remplir tous les champs obligatoires');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          throw new Error('Veuillez fournir une adresse email valide');
        }

        // Envoi API
        const response = await fetch('/api/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Une erreur est survenue');
        }

        // Succès
        showFeedback('success', '✅ Merci ! Nous vous contacterons sous 24h pour planifier votre audit gratuit.');
        form.reset();

        // Tracking Plausible (si disponible)
        if (typeof plausible !== 'undefined') {
          plausible('Form Submission', { props: { source: 'Page Présentation' } });
        }

      } catch (error) {
        console.error('Erreur soumission:', error);
        showFeedback('error', `❌ ${error.message || 'Une erreur est survenue. Veuillez réessayer.'}`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

  function showFeedback(type, message) {
    feedback.className = `form-feedback form-feedback--${type}`;
    feedback.textContent = message;
    feedback.style.display = 'block';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (type === 'success') {
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 10000);
    }
  }

  // =============================================================================
  // 6. CTA FLOTTANT - Animation d'apparition
  // =============================================================================
  const ctaFloat = document.querySelector('.pres-cta-float');
  let ctaVisible = false;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Afficher après avoir scrollé 50% de la première section
    if (scrollY > windowHeight * 0.5 && !ctaVisible) {
      ctaFloat.style.opacity = '1';
      ctaFloat.style.transform = 'translateY(0)';
      ctaVisible = true;
    }

    // Cacher quand on est sur la section contact
    const contactSection = document.querySelector('.pres-contact');
    if (contactSection) {
      const contactTop = contactSection.offsetTop;
      if (scrollY + windowHeight > contactTop + 200) {
        ctaFloat.style.opacity = '0';
        ctaFloat.style.transform = 'translateY(20px)';
      } else if (scrollY > windowHeight * 0.5) {
        ctaFloat.style.opacity = '1';
        ctaFloat.style.transform = 'translateY(0)';
      }
    }
  }, { passive: true });

  // État initial du CTA
  if (ctaFloat) {
    ctaFloat.style.opacity = '0';
    ctaFloat.style.transform = 'translateY(20px)';
    ctaFloat.style.transition = 'all 0.3s ease';
  }

  // =============================================================================
  // 7. PARALLAX LÉGER SUR LE HERO
  // =============================================================================
  const heroBackground = document.querySelector('.pres-hero__background');
  
  if (heroBackground) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.pres-hero').offsetHeight;
      
      if (scrollY < heroHeight) {
        const parallaxOffset = scrollY * 0.4;
        heroBackground.style.transform = `translateY(${parallaxOffset}px)`;
      }
    }, { passive: true });
  }

  // =============================================================================
  // 8. KEYBOARD NAVIGATION
  // =============================================================================
  document.addEventListener('keydown', (e) => {
    // Flèches haut/bas pour naviguer entre sections
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const currentSection = document.querySelector('.pres-progress__dot.active');
      if (!currentSection) return;

      const currentIndex = parseInt(currentSection.dataset.section);
      let nextIndex;

      if (e.key === 'ArrowDown') {
        nextIndex = Math.min(currentIndex + 1, sections.length);
      } else {
        nextIndex = Math.max(currentIndex - 1, 1);
      }

      const targetSection = document.querySelector(`[data-section="${nextIndex}"]`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // =============================================================================
  // 9. ANALYTICS - Tracking du scroll depth
  // =============================================================================
  const scrollDepthMarkers = [25, 50, 75, 100];
  const trackedDepths = new Set();

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    scrollDepthMarkers.forEach(marker => {
      if (scrollPercent >= marker && !trackedDepths.has(marker)) {
        trackedDepths.add(marker);
        
        // Plausible tracking
        if (typeof plausible !== 'undefined') {
          plausible('Scroll Depth', { props: { depth: `${marker}%`, page: 'presentation' } });
        }
        
        console.log(`📊 Scroll depth: ${marker}%`);
      }
    });
  }, { passive: true });

  // =============================================================================
  // 10. PRELOAD - Performance
  // =============================================================================
  window.addEventListener('load', () => {
    // Marquer la page comme chargée pour les animations CSS
    document.body.classList.add('loaded');
    
    console.log('✅ Presentation page loaded');
  });

})();

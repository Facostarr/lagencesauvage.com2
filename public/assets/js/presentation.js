// =============================================================================
// PRESENTATION.JS - L'Agence Sauvage
// Animations scroll, indicateurs de progression, compteurs
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
  
  // =============================================================================
  // 1. INTERSECTION OBSERVER POUR ANIMATIONS
  // =============================================================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };
  
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
          element.classList.add('animated');
        }, parseInt(delay));
        
        // Unobserve après animation (performance)
        animationObserver.unobserve(element);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => {
    animationObserver.observe(el);
  });
  
  // =============================================================================
  // 2. INDICATEURS DE PROGRESSION
  // =============================================================================
  const sections = document.querySelectorAll('.pres-section');
  const progressDots = document.querySelectorAll('.pres-progress__dot');
  
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionIndex = entry.target.dataset.section;
        
        // Mettre à jour les indicateurs
        progressDots.forEach(dot => {
          dot.classList.remove('active');
          if (dot.dataset.section === sectionIndex) {
            dot.classList.add('active');
          }
        });
      }
    });
  }, sectionObserverOptions);
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Navigation par clic sur les indicateurs
  progressDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionIndex = dot.dataset.section;
      const targetSection = document.querySelector(`[data-section="${sectionIndex}"]`);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // =============================================================================
  // 3. COMPTEURS ANIMÉS
  // =============================================================================
  const counters = document.querySelectorAll('.pres-stats__number[data-count]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        const duration = 2000; // 2 secondes
        const increment = target / (duration / 16); // 60fps
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
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
  
  // =============================================================================
  // 4. SCROLL FLUIDE POUR LES ANCRES
  // =============================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || href === '#!') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // =============================================================================
  // 5. CTA FLOTTANT - MASQUER EN SECTION CONTACT
  // =============================================================================
  const ctaFloat = document.querySelector('.pres-cta-float');
  const contactSection = document.getElementById('contact');
  
  if (ctaFloat && contactSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ctaFloat.style.opacity = '0';
          ctaFloat.style.pointerEvents = 'none';
        } else {
          ctaFloat.style.opacity = '1';
          ctaFloat.style.pointerEvents = 'auto';
        }
      });
    }, { threshold: 0.3 });
    
    ctaObserver.observe(contactSection);
  }
  
  // =============================================================================
  // 6. PARALLAX LÉGER SUR HERO (optionnel)
  // =============================================================================
  const heroSection = document.querySelector('.pres-hero');
  const heroBgPattern = document.querySelector('.pres-hero__bg-pattern');
  
  if (heroSection && heroBgPattern && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroHeight = heroSection.offsetHeight;
      
      if (scrolled < heroHeight) {
        const translateY = scrolled * 0.3;
        heroBgPattern.style.transform = `translateY(${translateY}px)`;
      }
    }, { passive: true });
  }
  
  // =============================================================================
  // 7. KEYBOARD NAVIGATION
  // =============================================================================
  document.addEventListener('keydown', (e) => {
    // Navigation par flèches haut/bas
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const currentDot = document.querySelector('.pres-progress__dot.active');
      if (!currentDot) return;
      
      const currentIndex = parseInt(currentDot.dataset.section);
      let nextIndex;
      
      if (e.key === 'ArrowDown') {
        nextIndex = Math.min(currentIndex + 1, sections.length - 1);
      } else {
        nextIndex = Math.max(currentIndex - 1, 0);
      }
      
      const targetSection = document.querySelector(`[data-section="${nextIndex}"]`);
      if (targetSection) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  
  // =============================================================================
  // 8. PRÉCHARGEMENT DE LA SECTION SUIVANTE
  // =============================================================================
  // Optionnel : précharger les images de la section suivante pour fluidité
  const preloadNextSection = (currentIndex) => {
    const nextSection = document.querySelector(`[data-section="${currentIndex + 1}"]`);
    if (nextSection) {
      const images = nextSection.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    }
  };
  
  // =============================================================================
  // 9. ANALYTICS TRACKING (si Plausible disponible)
  // =============================================================================
  sections.forEach(section => {
    const sectionIndex = section.dataset.section;
    const sectionTracker = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && window.plausible) {
          const sectionNames = [
            'hero', 'probleme', 'solution', 'benefices', 
            'stats', 'pourquoi', 'process', 'contact'
          ];
          const sectionName = sectionNames[sectionIndex] || `section-${sectionIndex}`;
          
          window.plausible('Section View', { props: { section: sectionName } });
          sectionTracker.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    sectionTracker.observe(section);
  });
  
});

// =============================================================================
// 10. GESTION DU SCROLL REVEAL INITIAL
// =============================================================================
// Déclencher les animations pour les éléments déjà visibles au chargement
window.addEventListener('load', () => {
  // Petit délai pour laisser le DOM se stabiliser
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.pres-hero .animate-on-scroll');
    heroElements.forEach((el, index) => {
      const delay = el.dataset.delay || (index * 150);
      setTimeout(() => {
        el.classList.add('animated');
      }, parseInt(delay));
    });
  }, 100);
});

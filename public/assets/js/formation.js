// =============================================================================
// FORMATION QUESTIONNAIRE - JavaScript
// =============================================================================
// Gestion du formulaire multi-sections avec navigation et soumission
// =============================================================================

(function() {
  'use strict';
  
  // === CONFIGURATION ===
  const CONFIG = {
    apiEndpoint: '/api/submit-formation-flexible',
    animationDuration: 600,
    scrollOffset: 100
  };
  
  // === STATE ===
  const state = {
    currentSection: 0,
    totalSections: 0,
    formData: {},
    isSubmitting: false
  };
  
  // === DOM ELEMENTS ===
  let form, sections, progressBar, navItems, loader, successSection;
  
  // === INITIALISATION ===
  function init() {
    form = document.getElementById('formationForm');
    if (!form) return;
    
    sections = document.querySelectorAll('.form-section[data-section]');
    progressBar = document.querySelector('.form-progress__bar');
    navItems = document.querySelectorAll('.form-nav__item');
    loader = document.querySelector('.form-loader');
    successSection = document.querySelector('.form-success');
    
    state.totalSections = sections.length;
    
    // Event listeners
    setupNavigation();
    setupOptions();
    setupFormSubmission();
    
    // Afficher section initiale
    showSection(0);
    updateProgress();
    
    console.log('✅ Formation form initialized');
  }
  
  // === NAVIGATION ===
  function setupNavigation() {
    // Boutons Précédent/Suivant
    document.querySelectorAll('[data-action="prev"]').forEach(btn => {
      btn.addEventListener('click', () => navigateSection(-1));
    });
    
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateCurrentSection()) {
          navigateSection(1);
        }
      });
    });
    
    // Navigation latérale
    navItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (index <= state.currentSection || validateSectionsUpTo(index)) {
          showSection(index);
        }
      });
    });
    
    // Bouton Start (Hero)
    const startBtn = document.querySelector('.form-hero__start');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(1);
      });
    }
  }
  
  function navigateSection(direction) {
    const newIndex = state.currentSection + direction;
    if (newIndex >= 0 && newIndex < state.totalSections) {
      showSection(newIndex);
    }
  }
  
  function showSection(index) {
    // Masquer toutes les sections
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Afficher la section cible
    const targetSection = sections[index];
    if (targetSection) {
      targetSection.classList.add('active');
      state.currentSection = index;
      
      // Scroll vers le HAUT de la section (avec offset pour le header)
      setTimeout(() => {
        const headerOffset = 120; // Espace pour la barre de progression
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
    
    updateProgress();
    updateNavigation();
  }
  
  function updateProgress() {
    if (progressBar) {
      const progress = ((state.currentSection + 1) / state.totalSections) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }
  
  function updateNavigation() {
    navItems.forEach((item, index) => {
      item.classList.remove('active', 'completed');
      
      if (index === state.currentSection) {
        item.classList.add('active');
      } else if (index < state.currentSection) {
        item.classList.add('completed');
      }
    });
  }
  
  // === OPTIONS (Checkboxes/Radios personnalisés) ===
  function setupOptions() {
    document.querySelectorAll('.form-option').forEach(option => {
      option.addEventListener('click', function() {
        const input = this.querySelector('input');
        const isMultiple = input.type === 'checkbox';
        
        if (isMultiple) {
          // Toggle checkbox
          input.checked = !input.checked;
          this.classList.toggle('selected', input.checked);
        } else {
          // Radio: désélectionner les autres du même groupe
          const name = input.name;
          document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.closest('.form-option').classList.remove('selected');
          });
          input.checked = true;
          this.classList.add('selected');
        }
      });
    });
  }
  
  // === VALIDATION ===
  function validateCurrentSection() {
    const section = sections[state.currentSection];
    return validateSection(section);
  }
  
  function validateSection(section) {
    let isValid = true;
    const requiredFields = section.querySelectorAll('[required]');
    
    // Reset erreurs
    section.querySelectorAll('.form-error').forEach(el => el.remove());
    section.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    requiredFields.forEach(field => {
      if (!field.value || field.value.trim() === '') {
        markFieldError(field, 'Ce champ est requis');
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        markFieldError(field, 'Email invalide');
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  function validateSectionsUpTo(targetIndex) {
    for (let i = 0; i < targetIndex; i++) {
      if (!validateSection(sections[i])) {
        showSection(i);
        return false;
      }
    }
    return true;
  }
  
  function markFieldError(field, message) {
    field.classList.add('error');
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
    
    // Focus sur le premier champ en erreur
    if (!document.querySelector('.form-error')) {
      field.focus();
    }
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // === SOUMISSION ===
  function setupFormSubmission() {
    const submitBtn = document.querySelector('[data-action="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', handleSubmit);
    }
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(e);
    });
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (state.isSubmitting) return;
    
    // Valider toutes les sections
    for (let i = 0; i < state.totalSections; i++) {
      if (!validateSection(sections[i])) {
        showSection(i);
        return;
      }
    }
    
    state.isSubmitting = true;
    showLoader(true);
    
    try {
      const formData = collectFormData();
      console.log('📤 Envoi des données:', formData);
      
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Soumission réussie:', result);
        showSuccess();
      } else {
        throw new Error(result.message || 'Erreur lors de la soumission');
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      showLoader(false);
    } finally {
      state.isSubmitting = false;
    }
  }
  
  function collectFormData() {
    const data = {};
    
    // Inputs texte, email, select
    form.querySelectorAll('input[type="text"], input[type="email"], select, textarea').forEach(field => {
      if (field.name) {
        data[field.name] = field.value.trim();
      }
    });
    
    // Radios
    form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
      data[radio.name] = radio.value;
    });
    
    // Checkboxes (multi-select)
    const checkboxGroups = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      if (!checkboxGroups[cb.name]) {
        checkboxGroups[cb.name] = [];
      }
      checkboxGroups[cb.name].push(cb.value);
    });
    Object.assign(data, checkboxGroups);
    
    // Données cachées
    form.querySelectorAll('input[type="hidden"]').forEach(hidden => {
      if (hidden.name) {
        data[hidden.name] = hidden.value;
      }
    });
    
    return data;
  }
  
  function showLoader(show) {
    if (loader) {
      loader.classList.toggle('active', show);
    }
    
    // Masquer le formulaire si loader actif
    sections.forEach(section => {
      section.style.display = show ? 'none' : '';
    });
  }
  
  function showSuccess() {
    showLoader(false);
    
    // Masquer formulaire
    form.style.display = 'none';
    document.querySelector('.form-nav')?.remove();
    document.querySelector('.form-progress')?.remove();
    
    // Afficher succès
    if (successSection) {
      successSection.style.display = 'flex';
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // === INIT ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();

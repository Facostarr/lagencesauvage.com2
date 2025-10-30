// form-handler.js
// Gestion avancée du formulaire avec validation temps réel

// Configuration
const API_ENDPOINT = '/api/submit-form';

// État du formulaire
const formState = {
  fields: ['name', 'email', 'phone', 'company', 'company_size', 'challenge'],
  validatedFields: new Set(),
  isSubmitting: false
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFormValidation();
  initProgressIndicator();
});

// ===== MENU MOBILE =====
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const menuLinks = document.querySelectorAll('.nav__mobile-menu a');
  
  if (!toggle || !mobileMenu) return;
  
  // Toggle menu
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    
    toggle.setAttribute('aria-expanded', !isOpen);
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-hidden', isOpen);
    
    // Bloquer le scroll body
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });
  
  // Fermer au clic sur un lien
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
  
  // Fermer au clic en dehors
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

// ===== VALIDATION FORMULAIRE =====
function initFormValidation() {
  const form = document.getElementById('auditForm');
  if (!form) return;
  
  // Validation en temps réel sur chaque champ
  formState.fields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Validation au blur (perte de focus)
    field.addEventListener('blur', () => validateField(field));
    
    // Validation pendant la saisie (avec debounce)
    let timeout;
    field.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        validateField(field);
        updateProgressIndicator();
        updateSubmitButton();
      }, 500);
    });
  });
  
  // Compteur de caractères pour le textarea
  const challengeField = document.getElementById('challenge');
  if (challengeField) {
    challengeField.addEventListener('input', updateCharCount);
  }
  
  // Soumission du formulaire
  form.addEventListener('submit', handleFormSubmit);
}

// Validation d'un champ
function validateField(field) {
  const fieldName = field.name;
  const value = field.value.trim();
  const errorSpan = document.getElementById(`${fieldName}-error`);
  const formGroup = field.closest('.form-group');
  
  // Reset état
  field.setAttribute('aria-invalid', 'false');
  formGroup.classList.remove('error', 'success');
  if (errorSpan) errorSpan.textContent = '';
  
  // Champ vide
  if (!value && field.hasAttribute('required')) {
    setFieldError(field, 'Ce champ est obligatoire');
    formState.validatedFields.delete(fieldName);
    return false;
  }
  
  // Validation spécifique par type
  let isValid = true;
  let errorMessage = '';
  
  switch (fieldName) {
    case 'name':
      if (value.length < 2) {
        errorMessage = 'Le nom doit contenir au moins 2 caractères';
        isValid = false;
      } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(value)) {
        errorMessage = 'Le nom ne peut contenir que des lettres';
        isValid = false;
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Email invalide';
        isValid = false;
      } else if (/tempmail|throwaway|10minutemail|guerrillamail/i.test(value)) {
        errorMessage = 'Les emails temporaires ne sont pas acceptés';
        isValid = false;
      }
      break;
      
    case 'phone':
      const phoneClean = value.replace(/\s/g, '');
      const phoneRegex = /^(?:(?:\+|00)33|0)[67]\d{8}$/;
      if (!phoneRegex.test(phoneClean)) {
        errorMessage = 'Format invalide. Ex: 06 12 34 56 78';
        isValid = false;
      }
      break;
      
    case 'company':
      if (value.length < 2) {
        errorMessage = 'Le nom de l\'entreprise doit contenir au moins 2 caractères';
        isValid = false;
      }
      break;
      
    case 'company_size':
      if (!value) {
        errorMessage = 'Veuillez sélectionner une taille';
        isValid = false;
      }
      break;
      
    case 'challenge':
      if (value.length < 20) {
        errorMessage = `Minimum 20 caractères (${value.length}/20)`;
        isValid = false;
      }
      break;
  }
  
  if (!isValid) {
    setFieldError(field, errorMessage);
    formState.validatedFields.delete(fieldName);
    return false;
  }
  
  // Champ valide
  setFieldSuccess(field);
  formState.validatedFields.add(fieldName);
  return true;
}

// Marquer un champ en erreur
function setFieldError(field, message) {
  const errorSpan = document.getElementById(`${field.name}-error`);
  const formGroup = field.closest('.form-group');
  
  field.setAttribute('aria-invalid', 'true');
  formGroup.classList.add('error');
  formGroup.classList.remove('success');
  
  if (errorSpan) {
    errorSpan.textContent = message;
  }
  
  // Animation shake
  formGroup.style.animation = 'shake 0.3s';
  setTimeout(() => {
    formGroup.style.animation = '';
  }, 300);
}

// Marquer un champ en succès
function setFieldSuccess(field) {
  const formGroup = field.closest('.form-group');
  
  field.setAttribute('aria-invalid', 'false');
  formGroup.classList.remove('error');
  formGroup.classList.add('success');
  
  // Animation checkmark
  const validationIcon = formGroup.querySelector('.validation-icon');
  if (validationIcon) {
    validationIcon.style.animation = 'checkmark 0.5s ease';
    setTimeout(() => {
      validationIcon.style.animation = '';
    }, 500);
  }
}

// ===== INDICATEUR DE PROGRESSION =====
function initProgressIndicator() {
  updateProgressIndicator();
}

function updateProgressIndicator() {
  const totalFields = formState.fields.length;
  const completedFields = formState.validatedFields.size;
  const percentage = (completedFields / totalFields) * 100;
  
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  
  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
    progressFill.style.transition = 'width 0.3s ease';
  }
  
  if (progressText) {
    progressText.textContent = `${completedFields} champ${completedFields > 1 ? 's' : ''} sur ${totalFields} complété${completedFields > 1 ? 's' : ''}`;
  }
}

// ===== COMPTEUR DE CARACTÈRES =====
function updateCharCount(e) {
  const field = e.target;
  const count = field.value.length;
  const minLength = parseInt(field.getAttribute('minlength')) || 20;
  const charCountSpan = field.parentElement.querySelector('.char-count');
  
  if (charCountSpan) {
    charCountSpan.textContent = `${count} / ${minLength} caractères minimum`;
    
    if (count >= minLength) {
      charCountSpan.style.color = 'var(--electric-green, #7dc242)';
    } else {
      charCountSpan.style.color = '';
    }
  }
}

// ===== BOUTON SUBMIT =====
function updateSubmitButton() {
  const submitBtn = document.querySelector('.btn--submit');
  if (!submitBtn) return;
  
  const allFieldsValid = formState.validatedFields.size === formState.fields.length;
  
  submitBtn.disabled = !allFieldsValid || formState.isSubmitting;
  
  if (allFieldsValid && !formState.isSubmitting) {
    submitBtn.classList.add('ready');
  } else {
    submitBtn.classList.remove('ready');
  }
}

// ===== SOUMISSION DU FORMULAIRE =====
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('.btn--submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  const successMessage = form.querySelector('.form-message--success');
  const errorMessage = form.querySelector('.form-message--error');
  
  // Validation finale de tous les champs
  let allValid = true;
  formState.fields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field && !validateField(field)) {
      allValid = false;
    }
  });
  
  if (!allValid) {
    // Scroll vers le premier champ en erreur
    const firstError = form.querySelector('.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // État de soumission
  formState.isSubmitting = true;
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'flex';
  
  // Masquer les anciens messages
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
  
  try {
    // Récupérer les données du formulaire
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      company_size: formData.get('company_size'),
      challenge: formData.get('challenge'),
      honeypot: formData.get('honeypot') // Anti-spam
    };
    
    // Envoyer à l'API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      // Succès
      successMessage.style.display = 'block';
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Reset du formulaire après 2 secondes
      setTimeout(() => {
        form.reset();
        formState.validatedFields.clear();
        updateProgressIndicator();
        
        // Reset des états visuels
        form.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('success', 'error');
        });
      }, 2000);
      
      // Analytics (si disponible)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'Lead',
          event_label: 'Audit Gratuit'
        });
      }
      
    } else {
      // Erreur
      throw new Error(result.error || 'Une erreur est survenue');
    }
    
  } catch (error) {
    console.error('Erreur soumission:', error);
    
    errorMessage.style.display = 'block';
    errorMessage.querySelector('.error-text').textContent = 
      error.message || 'Une erreur est survenue. Veuillez réessayer.';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } finally {
    // Reset état
    formState.isSubmitting = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    updateSubmitButton();
  }
}

// ===== ANIMATIONS CSS (définies dans styles.css) =====
// @keyframes shake
// @keyframes checkmark
// @keyframes spin

// ========================================
// FUNCIONES DE TEMA
// ========================================

function toggleTheme() {
  const html = document.documentElement;
  const themeIcon = document.querySelector('.theme-icon');
  const currentTheme = html.getAttribute('data-theme');

  if (currentTheme === 'dark') {
    html.removeAttribute('data-theme');
    themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const html = document.documentElement;
  const themeIcon = document.querySelector('.theme-icon');

  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  } else {
    html.removeAttribute('data-theme');
    themeIcon.textContent = '🌙';
  }
}

// ========================================
// ANIMACIÓN DE FONDO
// ========================================

function createBackgroundAnimation() {
  const container = document.getElementById('backgroundAnimation');
  if (!container) return;
  
  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 5 + 3) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 5 + 6) + 's';

    container.appendChild(particle);
  }
}

// ========================================
// ANIMACIÓN DE CONTADORES
// ========================================

function animateCounters() {
  const counters = document.querySelectorAll('.achievement-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    const increment = target / 50;
    let current = 0;
    const hasPlus = counter.textContent.includes('+');

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + (hasPlus ? '+' : '');
      }
    };

    // Comenzar animación cuando el elemento sea visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(updateCounter, Math.random() * 500);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(counter);
  });
}

// ========================================
// OCULTAR PRELOADER
// ========================================

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
}

// ========================================
// ANIMACIONES DE ENTRADA ESCALONADAS
// ========================================

function initFadeInAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach((el, index) => {
    el.style.animationDelay = (index * 0.2) + 's';
    el.classList.add('animated');
  });
}

// ========================================
// DETECCIÓN DE PREFERENCIA DE TEMA
// ========================================

function detectSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }
}

function listenSystemThemeChanges() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  });
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  hidePreloader();
  loadTheme();
  createBackgroundAnimation();
  animateCounters();
  initFadeInAnimations();
  detectSystemTheme();
  listenSystemThemeChanges();
});
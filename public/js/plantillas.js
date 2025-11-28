// ========================================
// FUNCIÓN PARA DESCARGAR PDF
// ========================================

function descargarPDF(ruta) {
  const button = event.target;
  const originalText = button.innerHTML;
  
  // Mostrar indicador de descarga
  button.innerHTML = '⏳ Descargando...';
  button.disabled = true;

  // Crear enlace para descarga
  const enlace = document.createElement('a');
  enlace.href = ruta;
  enlace.download = '';
  enlace.style.display = 'none';
  document.body.appendChild(enlace);

  // Simular delay y ejecutar descarga
  setTimeout(() => {
    enlace.click();
    document.body.removeChild(enlace);

    // Restaurar botón
    button.innerHTML = originalText;
    button.disabled = false;

    // Mostrar confirmación
    showDownloadConfirmation();
  }, 700);
}

// ========================================
// MOSTRAR CONFIRMACIÓN DE DESCARGA
// ========================================

function showDownloadConfirmation() {
  const notification = document.createElement('div');
  notification.innerHTML = '✅ Descarga iniciada exitosamente';
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--accent-color);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideIn 0.4s ease-out forwards;
    font-weight: 500;
    opacity: 0;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.4s ease-in forwards';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 400);
  }, 3000);
}

// ========================================
// ANIMACIONES CSS PARA NOTIFICACIONES
// ========================================

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ========================================
// IMPORTAR FUNCIONES COMUNES
// ========================================

// Funciones de tema
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

// Animación de fondo
function createBackgroundAnimation() {
  const container = document.getElementById('backgroundAnimation');
  if (!container) return;
  
  const particleCount = 20;

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

// Animaciones de entrada
function initFadeInAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach((el, index) => {
    el.style.animationDelay = (index * 0.2) + 's';
    el.classList.add('animated');
  });
}

// Detección de tema del sistema
function detectSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  createBackgroundAnimation();
  initFadeInAnimations();
  detectSystemTheme();
});
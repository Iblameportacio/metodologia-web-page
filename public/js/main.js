// public/js/main.js

// Importación de módulos auxiliares (Asegúrate de que plantillas.js exista y exporte la función)
import { createPdfCard } from './plantillas.js'; 

// ========================================
// GESTIÓN DEL TEMA (CLARO/OSCURO) - (Sin cambios)
// ========================================

export function toggleTheme() {
    // ... (Tu código de toggleTheme aquí) ...
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
    // ... (Tu código de loadTheme aquí) ...
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

// ... (Resto de funciones de UI: createBackgroundAnimation, hidePreloader, initFadeInAnimations, etc.) ...
// Mantén todas las funciones de UI que ya tenías aquí.

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

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
}

function initFadeInAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
        el.style.animationDelay = (index * 0.2) + 's';
        el.classList.add('animated');
    });
}

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
// 📊 CARGA DINÁMICA DE PDFS (/api/list)
// ========================================

async function fetchPdfs() {
    const listContainer = document.getElementById('pdfListContainer'); 
    if (!listContainer) return;
    listContainer.innerHTML = 'Cargando documentos...'; 

    try {
        const response = await fetch('/api/list');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const pdfs = await response.json();
        listContainer.innerHTML = ''; 

        if (pdfs.length === 0) {
            listContainer.innerHTML = '<p>No hay documentos disponibles por el momento.</p>';
            return;
        }

        pdfs.forEach(pdf => {
            const card = createPdfCard(pdf); 
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error al obtener la lista de PDFs:', error);
        listContainer.innerHTML = `<p class="error-message">Error al cargar los documentos. Inténtalo más tarde.</p>`;
    }
}

// ========================================
// 🔑 LÓGICA DE AUTENTICACIÓN DOCENTE
// ========================================

function setupAuthModal() {
    const modal = document.getElementById('adminModal');
    const openBtn = document.getElementById('openAdminModal');
    const loginForm = document.getElementById('adminLoginForm');
    const passwordInput = document.getElementById('adminPassword');
    const message = document.getElementById('authMessage');
    
    if (!modal || !openBtn || !loginForm) return;

    // Abrir Modal
    openBtn.onclick = () => {
        modal.style.display = "flex";
        passwordInput.focus();
    }

    // Cerrar Modal (usando el botón de cerrar o click fuera)
    document.querySelector('.close-button').onclick = closeModal;
    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    }

    function closeModal() {
        modal.style.display = "none";
        message.style.display = "none";
        passwordInput.value = "";
    }

    // Manejar el submit del login
    loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    
    const passwordInput = document.getElementById('adminPassword');
    const message = document.getElementById('authMessage');
    const loginBtn = document.getElementById('loginSubmitBtn');
    
    const password = passwordInput.value;
    message.style.display = 'none';
    loginBtn.disabled = true;

    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                // ⚠️ CORREGIDO: Usamos el header que espera el backend.
                'X-Professor-Password': password, 
                'Content-Type': 'application/json' 
            },
        });

        if (response.ok) {
            message.textContent = "✅ Acceso concedido. Redirigiendo a profeGian...";
            message.style.color = 'green';
            message.style.display = 'block';
            
            setTimeout(() => {
                window.location.href = 'profegian.html'; 
            }, 1000); 

        } else {
            const errorData = await response.json();
            message.textContent = `❌ ${errorData.error || 'Contraseña incorrecta.'}`;
            message.style.color = 'red';
            message.style.display = 'block';
        }
    } catch (error) {
        console.error('Error de red al autenticar:', error);
        message.textContent = '❌ Error de conexión con el servidor.';
        message.style.color = 'red';
        message.style.display = 'block';
    } finally {
        loginBtn.disabled = false;
    }
}


// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    hidePreloader();
    loadTheme();
    createBackgroundAnimation();
    initFadeInAnimations();
    detectSystemTheme();
    listenSystemThemeChanges();
    
    // Funciones de lógica de negocio
    fetchPdfs();
    setupAuthModal();
});

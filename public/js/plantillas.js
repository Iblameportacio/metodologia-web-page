// public/js/plantillas.js

// ========================================
// 1. UTILIDAD: GENERAR CARD DE PDF (Usada por main.js)
// ========================================

/**
 * Genera el elemento HTML para la tarjeta de un PDF en la vista principal.
 * @param {object} pdf - Objeto PDF con propiedades {id, nombre, url, fecha}.
 * @returns {HTMLElement} - El elemento div de la tarjeta.
 */
export function createPdfCard(pdf) {
    // Si la fecha existe, la formateamos. Si no, usamos una cadena vacía.
    const date = pdf.fecha ? new Date(pdf.fecha).toLocaleDateString() : 'Fecha desconocida';
    
    const card = document.createElement('div');
    card.className = 'work-card'; 
    card.setAttribute('data-id', pdf.id); 
    
    card.innerHTML = `
        <span class="icon">📄</span>
        <h3>${pdf.nombre}</h3>
        <p>Documento subido el ${date}.</p> 
        <a href="${pdf.url}" target="_blank" rel="noopener noreferrer" class="view-button">Ver PDF</a>
    `;
    return card;
}

// ========================================
// 2. UTILIDAD: MOSTRAR MENSAJES DE ESTADO (Usada por docente.js)
// ========================================

/**
 * Muestra mensajes de estado (éxito, error, etc.) en un elemento específico.
 * @param {string} elementId - ID del elemento donde se mostrará el mensaje (e.g., 'authMessage').
 * @param {string} type - Tipo de mensaje ('success', 'error', 'clear').
 * @param {string} text - Contenido del mensaje.
 */
export function showMessage(elementId, type, text) {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        if (type === 'clear') {
            messageDiv.style.display = 'none';
            messageDiv.textContent = "";
            return;
        }
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
    }
}


// ========================================
// 3. UTILIDAD: CONFIRMACIÓN DE DESCARGA
// ========================================

// Mantenemos la inyección de estilos para las animaciones, ya que es local a esta funcionalidad.
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


/**
 * Muestra una notificación temporal de éxito de descarga.
 */
export function showDownloadConfirmation() {
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

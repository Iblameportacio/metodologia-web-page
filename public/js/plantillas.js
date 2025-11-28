// public/js/plantillas.js

// ========================================
// 1. UTILIDAD: GENERAR CARD DE PDF (Usada por main.js para vista pública)
// ========================================

/**
 * Genera el elemento HTML para la tarjeta de un PDF en la vista principal.
 * @param {object} pdf - Objeto PDF con propiedades {id, nombre, url, created_at}.
 * @returns {HTMLElement} - El elemento div de la tarjeta.
 */
export function createPdfCard(pdf) {
    // Usamos 'created_at' de la DB Supabase
    const date = pdf.created_at ? new Date(pdf.created_at).toLocaleDateString() : 'Fecha desconocida';
    
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
// 2. UTILIDAD: GENERAR CARD DE GESTIÓN (Usada por docente.js)
// ========================================

/**
 * Genera el elemento HTML para la tarjeta de gestión en el panel docente.
 * Incluye un botón para eliminar.
 * @param {object} pdf - Objeto PDF con propiedades {id, nombre, url, created_at}.
 * @param {function} deleteHandler - Función de callback para manejar el borrado.
 * @returns {HTMLElement} - El elemento div de la tarjeta de gestión.
 */
export function createAdminPdfCard(pdf, deleteHandler) {
    const date = pdf.created_at ? new Date(pdf.created_at).toLocaleDateString() : 'Fecha desconocida';
    const filePath = pdf.url.split('/').pop(); // Extrae el path de Storage para borrar

    const card = document.createElement('div');
    card.className = 'work-card admin-card';
    card.setAttribute('data-id', pdf.id);

    card.innerHTML = `
        <h3>${pdf.nombre}</h3>
        <p>ID: ${pdf.id}</p>
        <p class="metadata">Subido el: ${date}</p>
        <div class="card-actions">
            <a href="${pdf.url}" target="_blank" class="btn-view">Ver PDF</a>
            <button class="btn-delete" data-id="${pdf.id}">Eliminar</button>
        </div>
    `;

    // 🔨 Configurar el botón de eliminar
    card.querySelector('.btn-delete').addEventListener('click', () => {
        // Llama al manejador de borrado en docente.js
        deleteHandler(
            pdf.id,             // ID de la base de datos
            filePath,           // Nombre/ruta del archivo en Storage
            card                // El elemento HTML para borrarlo
        );
    });

    return card;
}

// ========================================
// 3. UTILIDAD: MOSTRAR MENSAJES DE ESTADO (Usada por docente.js)
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
        // Usamos la clase para estilos (debes tener estilos CSS definidos)
        messageDiv.className = `message ${type}`; 
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
    }
}


// ========================================
// 4. UTILIDAD: CONFIRMACIÓN DE DESCARGA
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

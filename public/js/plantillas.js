// PLANTILLAS PARA LA VISTA PÚBLICA (index.html)

/**
 * Crea una tarjeta HTML simple para mostrar un PDF en la vista pública (index.html).
 * @param {object} pdf - El objeto PDF de Supabase (id, nombre, url).
 * @returns {HTMLElement} El elemento div de la tarjeta.
 */
export function createPublicPdfCard(pdf) {
    const card = document.createElement('div');
    card.className = 'pdf-card public-card';
    
    // Extrae el nombre del archivo del final de la URL si es necesario
    // O usa un nombre de archivo limpio si lo tienes en 'pdf.file_name' (depende de tu estructura)
    const fileLink = pdf.url; 

    card.innerHTML = `
        <h3>${pdf.nombre}</h3>
        <p>ID de Registro: ${pdf.id}</p>
        <a href="${fileLink}" target="_blank" class="download-link">
            <i class="fas fa-file-pdf"></i> Descargar Documento
        </a>
    `;

    return card;
}
// PLANTILLAS PARA LA VISTA ADMIN (docente.js)
/**
 * Crea una tarjeta HTML con botón de borrar para la vista de gestión (docente.html).
 * @param {object} pdf - El objeto PDF de Supabase (debe contener id y url).
 * @param {function} handleDeleteCallback - La función de borrado de docente.js (handleDelete).
 * @returns {HTMLElement} El elemento div de la tarjeta.
 */
export function createAdminPdfCard(pdf, handleDeleteCallback) {
    const card = document.createElement('div');
    card.className = 'pdf-card admin-card';
    
    // Asumimos que el nombre del archivo está contenido en la URL de Supabase. 
    // Si tu tabla tiene un campo 'file_name' limpio, úsalo. Si no, extraemos de la URL.
    
    // Ejemplo de extracción simple del nombre del archivo de la URL:
    // La URL de Supabase se ve así: .../storage/v1/object/public/BUCKET_NAME/NOMBRE_DEL_ARCHIVO
    const urlParts = pdf.url.split('/');
    // Tomamos el último segmento de la URL como el nombre/path del archivo en Storage:
    const fileNameInStorage = urlParts[urlParts.length - 1]; 

    card.innerHTML = `
        <h3>${pdf.nombre}</h3>
        <p>ID de Registro: ${pdf.id}</p>
        <a href="${pdf.url}" target="_blank" class="view-link">
            Ver Archivo
        </a>
        <button class="delete-btn" data-id="${pdf.id}" data-filename="${fileNameInStorage}">
            Eliminar
        </button>
    `;

    // LÓGICA DE BORRADO - Aquí se conecta el botón con la función de docente.js
    const deleteButton = card.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        
        const id = pdf.id;
        const nombre_archivo = fileNameInStorage; 
        const cardElement = card; // Pasamos el elemento de la tarjeta para borrarlo del DOM

        // (ID de la BD, NOMBRE del archivo en Storage, y el elemento de la tarjeta)
        handleDeleteCallback(id, nombre_archivo, cardElement);
    });

    return card;
}

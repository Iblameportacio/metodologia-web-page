// public/js/docente.js

// Importación para crear las tarjetas (Asegúrate de que plantillas.js tiene la función createAdminPdfCard)
// ASUMO que necesitas una función similar a createPdfCard pero con el botón de borrar. 
import { createAdminPdfCard } from './plantillas.js'; 

// ========================================
// 🔑 VERIFICACIÓN DE AUTENTICACIÓN
// ========================================

function checkAuthAndRedirect() {
    const password = sessionStorage.getItem('professor_password');
    if (!password) {
        // Si no hay contraseña en la sesión, redirigir al login
        alert('Acceso no autorizado. Por favor, inicie sesión.');
        window.location.href = 'index.html'; 
    }
}

// ========================================
// 📤 LÓGICA DE SUBIDA DE PDFS (/api/upload)
// ========================================

function setupUploadForm() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }
}

async function handleUpload(event) {
    event.preventDefault();

    const pdfFile = document.getElementById('pdfFile').files[0];
    const uploadMessage = document.getElementById('uploadMessage');
    const professorPassword = sessionStorage.getItem('professor_password');
    const documentName = document.getElementById('pdfName').value.trim(); // Capturamos el nuevo campo

    uploadMessage.textContent = '';
    uploadMessage.className = 'message-status';
    
    if (!professorPassword) {
        uploadMessage.textContent = '❌ Error: Sesión expirada. Vuelva a iniciar sesión.';
        return;
    }

    if (!pdfFile || !documentName) {
        uploadMessage.textContent = '❌ Por favor, ingrese un nombre y seleccione un archivo PDF.';
        return;
    }
    
    // Iniciar carga
    uploadMessage.textContent = 'Cargando... No cierre la página.';
    document.getElementById('submitUploadBtn').disabled = true;

    const formData = new FormData();
    formData.append('nombre', documentName); // Enviamos el nombre legible
    formData.append('file', pdfFile); // Enviamos el archivo

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'X-Professor-Password': professorPassword,
                // El navegador maneja Content-Type: multipart/form-data automáticamente
            },
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            uploadMessage.textContent = `✅ Documento "${result.nombre}" subido y registrado exitosamente.`;
            uploadMessage.className = 'message-status success';
            
            // Limpiar campos después del éxito
            document.getElementById('pdfName').value = ''; 
            document.getElementById('pdfFile').value = ''; 
            
            // Actualizar la lista de PDFs
            fetchAdminPdfs(); 

        } else {
            uploadMessage.textContent = `❌ Error al subir: ${result.error || response.statusText}`;
            uploadMessage.className = 'message-status error';
        }
    } catch (error) {
        console.error('Error de red al subir:', error);
        uploadMessage.textContent = '❌ Error de conexión con el servidor.';
        uploadMessage.className = 'message-status error';
    } finally {
        document.getElementById('submitUploadBtn').disabled = false;
    }
}


// ========================================
// 📊 LISTADO DE PDFS ADMIN (/api/list & /api/delete)
// ========================================

async function fetchAdminPdfs() {
    const listContainer = document.getElementById('adminPdfListContainer');
    if (!listContainer) return;
    listContainer.innerHTML = 'Cargando documentos de gestión...'; 

    try {
        // Usamos /api/list (Endpoint público) para obtener la lista
        const response = await fetch('/api/list');
        const pdfs = await response.json();
        
        listContainer.innerHTML = ''; 

        if (pdfs.length === 0) {
            listContainer.innerHTML = '<p>No hay documentos para gestionar.</p>';
            return;
        }

        pdfs.forEach(pdf => {
            // ASUMO que createAdminPdfCard recibe el PDF y un manejador de borrado
            const card = createAdminPdfCard(pdf, handleDelete); 
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error al obtener la lista de PDFs para admin:', error);
        listContainer.innerHTML = `<p class="error-message">Error al cargar la lista de documentos.</p>`;
    }
}


async function handleDelete(id, fileName, cardElement) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el archivo con ID ${id} (Esto es permanente)?`)) {
        return;
    }
    
    const professorPassword = sessionStorage.getItem('professor_password');
    if (!professorPassword) {
        alert('Sesión expirada. No se pudo borrar el archivo.');
        return;
    }

    try {
        const response = await fetch('/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Professor-Password': professorPassword, // Autenticación
            },
            body: JSON.stringify({ id: id, file_name: fileName }), // file_name debe ser el path completo que guardó Supabase
        });

        if (response.ok) {
            alert(`Documento ID ${id} eliminado exitosamente.`);
            cardElement.remove(); // Elimina la tarjeta del DOM
            // Podrías llamar a fetchAdminPdfs() para refrescar todo si es necesario
        } else {
            const errorData = await response.json();
            alert(`Error al eliminar: ${errorData.error || response.statusText}`);
        }
    } catch (error) {
        alert('Error de red al intentar eliminar el archivo.');
        console.error('Error al eliminar:', error);
    }
}


// ========================================
// INICIALIZACIÓN DE LA PÁGINA DOCENTE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. Verificar Sesión antes de hacer cualquier cosa
    checkAuthAndRedirect(); 
    
    // 2. Inicializar la UI (Mantienes estas funciones, solo las he reordenado)
    hidePreloader();
    loadTheme();
    createBackgroundAnimation();
    animateCounters();
    initFadeInAnimations();
    detectSystemTheme();
    listenSystemThemeChanges();

    // 3. Inicializar Lógica de Negocio
    setupUploadForm();
    fetchAdminPdfs();
});

import { createAdminPdfCard } from './plantillas.js'; 

// ========================================
// VERIFICACIÓN DE AUTENTICACIÓN
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
// LÓGICA DE SUBIDA DE PDFS (/api/upload)
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
    const documentName = document.getElementById('pdfName').value.trim(); // Nombre público
    const submitUploadBtn = document.getElementById('submitUploadBtn');

    uploadMessage.textContent = '';
    uploadMessage.className = 'message-status';
    
    if (!professorPassword) {
        uploadMessage.textContent = 'Error: Sesión expirada. Vuelva a iniciar sesión.';
        return;
    }

    if (!pdfFile || !documentName) {
        uploadMessage.textContent = 'Por favor, ingrese un nombre y seleccione un archivo PDF.';
        return;
    }
    
    // Iniciar carga
    uploadMessage.textContent = 'Cargando... No cierre la página.';
    submitUploadBtn.disabled = true;

    const formData = new FormData();
    formData.append('nombre', documentName); // Enviamos el nombre legible
    formData.append('file', pdfFile); // Enviamos el archivo

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                // ENVIAMOS LA CONTRASEÑA EN EL HEADER PARA AUTENTICACIÓN
                'X-Professor-Password': professorPassword,
            },
            body: formData,
        });

        // Intentamos leer el JSON, incluso si hay error 400/500
        const result = await response.json(); 

        if (response.ok) {
            uploadMessage.textContent = `Documento "${result.nombre}" subido y registrado exitosamente.`;
            uploadMessage.className = 'message-status success';
            
            // Limpiar campos después del éxito
            document.getElementById('pdfName').value = ''; 
            document.getElementById('pdfFile').value = ''; 
            
            // Actualizar la lista de PDFs para ver el nuevo archivo
            fetchAdminPdfs(); 

        } else {
            // Maneja errores 400/401/500 enviados por el backend (Vercel)
            uploadMessage.textContent = `Error al subir: ${result.error || response.statusText}`;
            uploadMessage.className = 'message-status error';
        }
    } catch (error) {
        console.error('Error de red al subir:', error);
        uploadMessage.textContent = 'Error de conexión con el servidor. (Verifique el log de Vercel)';
        uploadMessage.className = 'message-status error';
    } finally {
        submitUploadBtn.disabled = false;
    }
}


// ========================================
// LISTADO DE PDFS ADMIN (/api/list & /api/delete)
// ========================================

async function fetchAdminPdfs() {
    const listContainer = document.getElementById('adminPdfListContainer');
    if (!listContainer) return;
    listContainer.innerHTML = 'Cargando documentos de gestión...'; 

    try {
        const response = await fetch('/api/list');
        
        // 🚨 MANEJO DE ERROR 500 EN LISTADO: Si no es OK, no intentes leer JSON, usa statusText
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const pdfs = await response.json();
        
        listContainer.innerHTML = ''; 

        if (pdfs.length === 0) {
            listContainer.innerHTML = '<p>No hay documentos para gestionar.</p>';
            return;
        }

        pdfs.forEach(pdf => {
            // Asegúrate de que tu función createAdminPdfCard reciba pdf.file_path
            const card = createAdminPdfCard(pdf, handleDelete); 
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error al obtener la lista de PDFs para admin:', error);
        listContainer.innerHTML = `<p class="error-message">Error al cargar la lista de documentos. (Verifique RLS/ANON Key o logs de Vercel)</p>`;
    }
}

async function handleDelete(id, filePath, cardElement) {  // Cambiado nombre_archivo a filePath
    if (!confirm(`¿Estás seguro de que deseas eliminar el archivo ID ${id}? Esto borrará el archivo y el registro.`)) {
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
                'X-Professor-Password': professorPassword,
            },
            // 🚨 CORRECCIÓN 4: Enviamos el file_path que obtuvimos del listado
            body: JSON.stringify({ id: id, file_path: filePath }),
        });

        if (response.ok) {
            alert(`Documento ID ${id} eliminado exitosamente.`);
            cardElement.remove(); // Elimina la tarjeta del DOM sin recargar
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
    // 1. Verificar Sesión
    checkAuthAndRedirect(); 
     
    // 2. Inicializar Lógica de Negocio
    setupUploadForm();
    fetchAdminPdfs();
    
    // NOTA: Las funciones de tema/animación (hidePreloader, loadTheme, etc.) deben estar definidas
    //       en otro script si las quieres mantener, ya que no están en el código que me enviaste.
});



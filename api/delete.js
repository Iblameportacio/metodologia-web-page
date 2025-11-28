// /api/delete.js
import { createClient } from '@supabase/supabase-js';
import { validateProfessorPassword } from './auth.js';

// 🔑 USAMOS LA CLAVE DE ROL DE SERVICIO para eliminar
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'documentos';
const TABLE_NAME = 'pdfs';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Use POST.' });
    }

    // 1. VALIDACIÓN DE AUTENTICACIÓN
    const password = req.headers['x-professor-password'];
    if (!password || !validateProfessorPassword(password)) {
        return res.status(401).json({ error: 'Acceso no autorizado.' });
    }

    // 2. OBTENER DATOS
    const { id, file_name } = req.body; // id del registro de la tabla y nombre del archivo en Storage

    if (!id || !file_name) {
        return res.status(400).json({ error: 'Faltan parámetros: ID y nombre del archivo.' });
    }

    try {
        // A. Eliminar Archivo del Storage
        const { error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([file_name]); 

        if (storageError && storageError.statusCode !== '404') {
            console.error("Error Supabase Storage:", storageError);
            // Advertencia, pero se continúa para limpiar la BD
        }

        // B. Eliminar Registro de la Base de Datos
        const { error: dbError } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (dbError) {
            throw new Error(`Error en DB: ${dbError.message}`);
        }

        res.status(200).json({ message: `Documento ID ${id} eliminado.` });

    } catch (err) {
        console.error('Error interno de eliminación:', err.message);
        res.status(500).json({ error: err.message || 'Error interno del servidor durante la eliminación.' });
    }
};

import { createClient } from '@supabase/supabase-js';
import Busboy from 'busboy'; // Requerido para procesar archivos multipart/form-data
import { validateProfessorPassword } from './auth.js';

// USAMOS LA CLAVE DE ROL DE SERVICIO para escribir/subir seguro
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'documentos';
const TABLE_NAME = 'pdfs';

export default (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Use POST.' });
    }

    // 1. VALIDACIÓN DE AUTENTICACIÓN
    const password = req.headers['x-professor-password'];
    if (!password || !validateProfessorPassword(password)) {
        return res.status(401).json({ error: 'Acceso no autorizado.' });
    }

    // 2. PROCESAMIENTO MULTIPART
    const busboy = Busboy({ headers: req.headers });
    const fileData = {};
    const fields = {};

    return new Promise((resolve) => {
        busboy.on('file', (fieldname, file, info) => {
            const { filename, mimeType } = info;
            if (mimeType !== 'application/pdf') {
                busboy.destroy(new Error('Tipo de archivo no permitido. Solo PDFs.'));
                return;
            }
            fileData.buffer = [];
            fileData.mimeType = mimeType;
            fileData.originalName = filename;
            file.on('data', (data) => fileData.buffer.push(data));
            file.on('end', () => { fileData.buffer = Buffer.concat(fileData.buffer); });
        });

        busboy.on('field', (fieldname, val) => { fields[fieldname] = val; });

        busboy.on('finish', async () => {
            if (!fileData.buffer || !fields.nombre) {
                res.status(400).json({ error: 'Faltan datos: Archivo PDF o Nombre del documento.' });
                return resolve();
            }

            try {
                // A. Subir Archivo a Storage
                const cleanFileName = fields.nombre.replace(/[^a-zA-Z0-9]/g, '_');
                const filePath = `${Date.now()}_${cleanFileName}.pdf`; 

                const { data: uploadData, error: storageError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(filePath, fileData.buffer, { contentType: fileData.mimeType });

                if (storageError) throw new Error(`Error en Storage: ${storageError.message}`);

                // Obtener URL pública
                const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData.path);

                // B. Insertar Metadata en la Base de Datos
                const { data: dbData, error: dbError } = await supabase
                    .from(TABLE_NAME)
                    .insert([{ nombre: fields.nombre, url: publicUrl }])
                    .select()
                    .single();

                if (dbError) {
                    // Si falla el registro, intenta borrar el archivo subido
                    await supabase.storage.from(BUCKET_NAME).remove([uploadData.path]);
                    throw new Error(`Error en DB: ${dbError.message}`);
                }

                res.status(200).json({ message: 'Archivo subido y registrado exitosamente.', nombre: dbData.nombre });
                resolve();

            } catch (err) {
                console.error('Error interno de subida:', err.message);
                res.status(500).json({ error: err.message || 'Error interno del servidor durante la subida.' });
                resolve();
            }
        });

        busboy.on('error', (err) => {
            res.status(400).json({ error: err.message || 'Error en el procesamiento del formulario.' });
            resolve();
        });

        req.pipe(busboy);
    });
};

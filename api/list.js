import { createClient } from '@supabase/supabase-js';

// Las variables de entorno se leen automáticamente en el entorno de Vercel.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('pdfs') // Nombre de la tabla
      // Incluir *todos* los campos de la tabla
      .select('id, created_at, nombre, url, fecha, file_path') 
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      // Asegurar que se devuelve un JSON válido
      return res.status(500).json({ error: error.message || 'Database query failed' });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error('Server Error:', err.message);
    // 🚨 CORRECCIÓN 3: Asegurar que el catch general SIEMPRE devuelve JSON válido
    res.status(500).json({ error: err.message || 'A server error occurred.' });
  }
}


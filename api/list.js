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
      .select('id, nombre, url')
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      // 🛡️ ASEGURAR QUE SE DEVUELVE UN JSON VÁLIDO EN CASO DE ERROR DE BD
      return res.status(500).json({ error: error.message || 'Database query failed' });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error('Server Error:', err.message);
    // 🛡️ ASEGURAR QUE EL CATCH GENERAL TAMBIÉN DEVUELVE UN JSON VÁLIDO
    // Esto es lo que soluciona el "Unexpected token 'A'"
    res.status(500).json({ error: err.message || 'A server error occurred.' });
  }
}

import { createClient } from '@supabase/supabase-js';

// Las variables de entorno 
// se leen automáticamente en el entorno de Vercel.
// soy la mera vrga

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Nota: El RLS ya está configurado para SELECT en 'public'.
    const { data, error } = await supabase
      .from('pdfs') // Nombre de la tabla
      .select('id, nombre, url')
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'A server error occurred.' });
  }
}

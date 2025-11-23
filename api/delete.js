import { del } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // cambio bien fakin critico pa ver si sirve esta mierrda Esperamos el parámetro 'url'
    const fileUrl = req.query.url; 
    
    // Verifica si la URL c paso
    if (!fileUrl) {
      // Devolver 400 si el frontend no envió el paramtro correcto
      return res.status(400).json({ error: "Missing 'url' query parameter with the full Blob URL" });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Missing BLOB_READ_WRITE_TOKEN env var");
      return res.status(500).json({ error: "Server misconfiguration: missing BLOB_READ_WRITE_TOKEN" });
    }

    // DEBUG: Añadir esto para verificar en los logs de Vercel qué URL se intenta eliminar
    console.log('DEBUG DELETE: Intentando eliminar URL:', fileUrl);

    // Llama a del() con la URL completa
    await del(fileUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Si llega asqui es q significa que la eliminación fue exitosa
    console.log('DEBUG DELETE: Eliminación exitosa.');
    res.status(200).json({ ok: true });
    
  } catch (err) {
    // Si la eliminación falló se captura aquí
    console.error("DELETE ERROR:", err);
    // Devolver un error 500 para que el frontend sepa que algo salio mal como siempre aaaa.
    res.status(500).json({ error: "Delete failed", details: err.toString() });
  }
}

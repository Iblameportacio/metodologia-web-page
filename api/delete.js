import { del } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    //Esperamos el parámetro url que contiene la URL COMPLETA del Blob
    const fileUrl = req.query.url; 
    
    //Verificación de Parámetros
    if (!fileUrl) {
      return res.status(400).json({ error: "Missing 'url' query parameter with the full Blob URL" });
    }

    //Verificación de Token 
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Missing BLOB_READ_WRITE_TOKEN env var");
      return res.status(500).json({ error: "Server misconfiguration: missing BLOB_READ_WRITE_TOKEN" });
    }

    //Verificamos q URL se intenta eliminar 
    console.log('DEBUG DELETE: Intentando eliminar URL:', fileUrl);

    //Llamada de Eliminación con la URL completa
    await del(fileUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // exito
    console.log('DEBUG DELETE: Eliminación exitosa.');
    res.status(200).json({ ok: true });
    
  } catch (err) {
    //anejo de Errores
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed", details: err.toString() });
  }
}

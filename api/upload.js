import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false, // importante: recibimos body crudo (stream)
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "PUT" && req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Nombre del archivo enviado desde el cliente en la cabecera
    const name = req.headers["x-file-name"];
    if (!name) {
      return res.status(400).json({ error: "Missing x-file-name header" });
    }

    // Verifica token disponible (mejor logging para debug)
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Missing BLOB_READ_WRITE_TOKEN env var");
      return res.status(500).json({ error: "Server misconfiguration: missing BLOB_READ_WRITE_TOKEN" });
    }

    // req es un stream -> pasamos directamente a put
    const blob = await put(name, req, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // (opcional) pathname: 'folder/' + name
    });

    // blob tendrá metadata (url/pathname según versión SDK); devolvemos todo
    res.status(200).json(blob);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.toString() });
  }
}

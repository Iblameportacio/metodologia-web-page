import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // Métodos permitidos
    if (req.method !== "PUT" && req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Nombre del archivo desde el header
    const name = req.headers["x-file-name"];
    if (!name) {
      return res.status(400).json({ error: "Missing x-file-name header" });
    }

    // Token desde variables de entorno
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    // Log para depurar (NO muestra el token)
    console.log("⛳ TOKEN:", token ? "OK" : "MISSING");

    if (!token) {
      return res.status(500).json({ error: "Missing BLOB_READ_WRITE_TOKEN" });
    }

    // Subir archivo como stream
    const blob = await put(name, req, {
      access: "public",
      token,
    });

    return res.status(200).json(blob);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({
      error: "Upload failed",
      details: err?.message
    });
  }
}

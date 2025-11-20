import { del } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Aceptamos ?path=... o ?pathname=...
    const pathname = req.query.path || req.query.pathname;
    if (!pathname) {
      return res.status(400).json({ error: "Missing path query param" });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Missing BLOB_READ_WRITE_TOKEN env var");
      return res.status(500).json({ error: "Server misconfiguration: missing BLOB_READ_WRITE_TOKEN" });
    }

    await del(pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.toString() });
  }
}

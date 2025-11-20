import { del } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const { path } = req.query;

    await del(path, {
      token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.toString() });
  }
}

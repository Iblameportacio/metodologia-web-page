import { del } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const { pathname } = req.query;

    await del(pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}

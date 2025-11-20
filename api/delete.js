import { del } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  await del(url);

  res.status(200).json({ ok: true });
}



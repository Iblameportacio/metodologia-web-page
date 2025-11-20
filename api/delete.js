import { del } from '@vercel/blob';

export default async function handler(req, res) {
  const { url } = req.body;

  await del(url);

  res.status(200).json({ deleted: true });
}

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const file = req.body;
    const blob = await put(`${Date.now()}.png`, file, {
      access: 'public',
    });

    res.status(200).json({ url: blob.url });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir archivo' });
  }
}

import { list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const blobs = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
    res.status(200).json(blobs.blobs);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}

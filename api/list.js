import { list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const { blobs } = await list({
      token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json(blobs);
  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: err.toString() });
  }
}

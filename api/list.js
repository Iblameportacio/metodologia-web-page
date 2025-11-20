import { list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Missing BLOB_READ_WRITE_TOKEN env var");
      return res.status(500).json({ error: "Server misconfiguration: missing BLOB_READ_WRITE_TOKEN" });
    }

    // opcional: support prefix/query param ?prefix=works/
    const prefix = req.query.prefix || undefined;

    const result = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      prefix,
    });

    // result usually contains { blobs, cursor, ... } depending on SDK version
    // Normalize to return an array in `blobs`
    const blobs = result?.blobs || result?.items || [];
    res.status(200).json(blobs);
  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: err.toString() });
  }
}

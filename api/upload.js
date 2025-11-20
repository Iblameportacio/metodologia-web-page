import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const name = req.headers["x-file-name"];

    if (!name) {
      return res.status(400).json({ error: "Missing file name" });
    }

    const blob = await put(name, req, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.toString() });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

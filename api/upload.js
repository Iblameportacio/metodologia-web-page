import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const file = req.body;
    const name = req.headers["x-file-name"];

    const blob = await put(name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    res.status(200).json({ url: blob.url });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

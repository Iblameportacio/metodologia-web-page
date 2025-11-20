import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "PUT" && req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const name = req.headers["x-file-name"];
    if (!name) {
      return res.status(400).json({ error: "Missing x-file-name header" });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error("Missing BLOB_READ_WRITE_TOKEN");
      return res.status(500).json({ error: "Missing BLOB_READ_WRITE_TOKEN" });
    }

    const blob = await put(name, req, {
      access: "public",
      token,
    });

    res.status(200).json(blob);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
}

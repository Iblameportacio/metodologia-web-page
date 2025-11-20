import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filename, content } = req.body;

  const blob = await put(filename, Buffer.from(content, "base64"), {
    access: "public",
  });

  res.status(200).json({ url: blob.url });
}


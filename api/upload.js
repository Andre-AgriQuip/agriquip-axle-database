import { put } from '@vercel/blob';

function safeName(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const brand = safeName(req.headers['x-tractor-brand']);
    const model = safeName(req.headers['x-tractor-model']);
    const filename = safeName(req.headers['x-file-name']);

    if (!brand || !model || !filename) {
      return res.status(400).json({ error: 'Missing brand, model, or filename' });
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const blob = await put(
      `uploads/${brand}/${model}/${Date.now()}-${filename}`,
      buffer,
      { access: 'public' }
    );

    return res.status(200).json(blob);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

import { list } from '@vercel/blob';

function safeName(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req, res) {
  try {
    const brand = safeName(req.query.brand);
    const model = safeName(req.query.model);

    if (!brand || !model) {
      return res.status(400).json({ error: 'Missing brand or model' });
    }

    const result = await list({
      prefix: `uploads/${brand}/${model}/`,
    });

    return res.status(200).json(result.blobs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

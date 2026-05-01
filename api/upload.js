import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const file = req.body;

  const blob = await put('uploads/' + Date.now(), file, {
    access: 'public',
  });

  return res.json(blob);
}

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url || !url.startsWith('https://uploads.mangadex.org/')) {
        return res.status(400).json({ error: 'Invalid or missing url' });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch image' });
        }
        res.setHeader('Content-Type', response.headers.get('content-type'));
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
    } catch (err) {
        res.status(500).json({ error: 'Proxy error', details: err.message });
    }
} 
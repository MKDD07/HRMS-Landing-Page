import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Pexels API proxy route
app.get('/api/pexels', async (req, res) => {
  const type = req.query.type || 'photos';
  const query = req.query.query || '';
  const perPage = req.query.per_page || '3';
  const orientation = req.query.orientation || 'landscape';

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  let targetEndpoint = 'https://api.pexels.com/v1/search';
  if (type === 'videos') {
    targetEndpoint = 'https://api.pexels.com/videos/search';
  }

  const pexelsUrl = `${targetEndpoint}?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}`;

  try {
    const apiKey = process.env.PEXELS_API_KEY || 'bPSCecg8osP489H4AQexmZwG3OXpL1DUNjhrX1hafiSE8IapAM9EgZOu';
    const response = await fetch(pexelsUrl, {
      headers: {
        Authorization: apiKey,
      },
    });

    const data = await response.json();
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Serve static files
app.use(express.static(__dirname));

// Fallback to index.html for SPA/root navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

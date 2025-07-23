import express from 'express';
import { handler } from './api/callback.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(__dirname));

app.get('/api/callback', (req, res) => handler(req, res));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Demo app running at http://localhost:${PORT}`);
});

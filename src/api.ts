import express from 'express';
import type { Server } from 'node:http';
import { search } from './search.ts';
import { download } from './download.ts';
import { library } from './library.ts';

const app = express();
app.use(express.json());

app.post('/search', async (req, res) => {
  const query = req.body?.query;
  if (typeof query !== 'string' || !query.trim()) {
    res.status(400).json({ error: 'El campo "query" es requerido' });
    return;
  }

  try {
    res.json(await search(query.trim()));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno' });
  }
});

app.post('/download/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: 'Invalid request' });
  }

  const path = await resolvePath(id);
  res.sendFile(path);
});

async function resolvePath(id: string) {
  const storedPath = library.findPath(id);
  if (storedPath) {
    return storedPath;
  }

  const path = await download(id);
  library.save(id, path);
  return path;
}

export function runWebServer(port: number) {
  return new Promise<Server>((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.on('error', reject); // p. ej. EADDRINUSE
  });
}

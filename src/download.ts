import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadConfig } from './config.ts';

/** Descarga el audio y devuelve la ruta absoluta del MP3 final. */
export async function download(videoId: string): Promise<string> {
  const { outputDir } = loadConfig();

  // yt-dlp escribe aquí la ruta final (después de convertir y mover), sin tocar su salida normal
  const tmp = await mkdtemp(join(tmpdir(), 'yt-dwld-'));
  const pathFile = join(tmp, 'filepath.txt');

  try {
    await run(videoId, outputDir, pathFile);
    const filePath = (await readFile(pathFile, 'utf8')).trim().split('\n').at(-1);
    if (!filePath) {
      throw new Error('yt-dlp no informó la ruta del archivo descargado');
    }
    return filePath;
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

function run(videoId: string, outputDir: string, pathFile: string) {
  const ytdlp = spawn(
    'yt-dlp',
    [
      '-x',
      '--audio-format',
      'mp3',
      '--audio-quality',
      '0',
      '-P',
      outputDir,
      '-o',
      '%(title)s.%(ext)s',
      '--print-to-file',
      'after_move:filepath',
      pathFile,
      `https://music.youtube.com/watch?v=${videoId}`,
    ],
    { stdio: 'inherit' },
  );

  return new Promise<void>((resolve, reject) => {
    ytdlp.on('error', reject); // p.ej. yt-dlp no instalado
    ytdlp.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`yt-dlp salió con código ${code}`)),
    );
  });
}

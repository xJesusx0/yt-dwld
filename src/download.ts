import { spawn } from 'child_process';

// Carpeta de destino, relativa a donde ejecutas el programa. yt-dlp la crea si no existe.
const MUSIC_DIR = 'music';

export async function download(videoId: string) {
  const ytdlp = spawn(
    'yt-dlp',
    [
      '-x',
      '--audio-format',
      'mp3',
      '--audio-quality',
      '0',
      '-P',
      MUSIC_DIR,
      '-o',
      '%(title)s.%(ext)s',
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

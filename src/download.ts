import { spawn } from 'child_process';
import { loadConfig } from './config.ts';

export async function download(videoId: string) {
  const { outputDir } = loadConfig();
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

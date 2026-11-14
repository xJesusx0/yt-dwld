import { db } from './db.ts';

export interface Library {
  findPath(id: string): string | null;
  save(id: string, path: string): void;
}

class MusicResult {
  file_path: string | null;

  constructor(path: string) {
    this.file_path = path;
  }
}

class DbLibrary implements Library {
  findPath(id: string): string | null {
    const query = db
      .query('SELECT file_path FROM music_library WHERE video_id = $videoId')
      .as(MusicResult);
    const result = query.get({
      $videoId: id,
    });

    return result?.file_path ?? null;
  }
  save(id: string, path: string): void {
    const query = db.prepare(`
        INSERT INTO music_library (file_path, video_id)
        VALUES ($filePath, $videoId)
    `);

    query.run({
      $filePath: path,
      $videoId: id,
    });
  }
}

export const library: Library = new DbLibrary();

import { Database } from 'bun:sqlite';

const db = new Database('database/app.db', {
  create: true,
});

const INIT = `
    CREATE TABLE IF NOT EXISTS music_library (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path TEXT NOT NULL,
        video_id TEXT NOT NULL
    );
`;

db.run('PRAGMA foreign_keys = ON');
db.run(INIT);

export { db };

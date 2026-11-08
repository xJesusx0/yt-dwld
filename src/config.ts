import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface Config {
  /** Carpeta donde se guardan las descargas. Acepta "~" al inicio. */
  outputDir: string;
  /** Cookie de YouTube Music. La variable de entorno YT_COOKIE tiene prioridad. */
  cookie?: string;
}

const DEFAULT_CONFIG: Config = { outputDir: '~/Music', cookie: '' };

const configDir = join(process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config'), 'yt-dwld');
export const configPath = join(configDir, 'config.json');

function expandHome(path: string) {
  return path === '~' || path.startsWith('~/') ? join(homedir(), path.slice(1)) : path;
}

export function loadConfig(): Config {
  let raw: string;
  try {
    raw = readFileSync(configPath, 'utf8');
  } catch {
    // Primera ejecución: crea el archivo con los valores por defecto
    mkdirSync(configDir, { recursive: true });
    // 0600: el archivo puede contener la cookie de tu sesión
    writeFileSync(configPath, `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`, { mode: 0o600 });
    raw = JSON.stringify(DEFAULT_CONFIG);
  }

  let parsed: Partial<Config>;
  try {
    parsed = JSON.parse(raw) as Partial<Config>;
  } catch {
    throw new Error(`Config inválida (JSON mal formado): ${configPath}`);
  }

  const outputDir = parsed.outputDir ?? DEFAULT_CONFIG.outputDir;
  if (typeof outputDir !== 'string' || !outputDir.trim()) {
    throw new Error(`"outputDir" debe ser un texto no vacío en ${configPath}`);
  }

  const cookie = process.env.YT_COOKIE || parsed.cookie || undefined;

  return { outputDir: expandHome(outputDir.trim()), cookie };
}

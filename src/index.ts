#!/usr/bin/env node
import { cancel, intro, isCancel, log, outro, select, spinner, text } from '@clack/prompts';
import { download } from './download.ts';
import { search } from './search.ts';

const TITLE_WIDTH = 45;

function truncate(value: string, width: number) {
  return value.length > width ? `${value.slice(0, width - 1)}…` : value.padEnd(width);
}

intro('yt-dwld');

while (true) {
  const query = await text({
    message: 'Buscar en YT Music',
    validate: (value) => (value?.trim() ? undefined : 'Escribe algo para buscar'),
  });
  if (isCancel(query)) {
    cancel('Cancelado');
    process.exit(0);
  }

  const s = spinner();
  s.start('Buscando...');
  const results = await search(query.trim());
  s.stop(`${results.length} resultados`);

  if (results.length === 0) {
    log.warn('Sin resultados, prueba con otra búsqueda');
    continue;
  }

  const id = await select({
    message: 'Elige qué descargar (↑/↓ y Enter)',
    maxItems: 10,
    options: results.map((r) => ({
      value: r.id,
      label: `${truncate(r.title, TITLE_WIDTH)} ${r.description ?? ''}`,
    })),
  });
  if (isCancel(id)) {
    cancel('Cancelado');
    process.exit(0);
  }

  try {
    await download(id);
    outro('Listo');
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    outro('Falló la descarga');
  }
  break;
}

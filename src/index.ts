#!/usr/bin/env node
import { runWebServer } from './api.ts';
import { runCli } from './cli.ts';

const USAGE = `Uso:
  yt-dwld                 Menú interactivo
  yt-dwld serve [puerto]  Servidor web (por defecto en el puerto 3000)`;

const [command, ...args] = process.argv.slice(2);

async function serve(portArg?: string) {
  const port = portArg === undefined ? 3000 : Number(portArg);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error(`Puerto inválido: ${portArg}`);
    process.exit(1);
  }

  let server;
  try {
    server = await runWebServer(port);
  } catch (error) {
    console.error(
      `No se pudo arrancar el servidor: ${error instanceof Error ? error.message : error}`,
    );
    process.exit(1);
  }
  console.log(`API escuchando en http://localhost:${port}`);

  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

switch (command) {
  case undefined:
    await runCli();
    break;
  case 'serve':
    await serve(args[0]);
    break;
  case '-h':
  case '--help':
    console.log(USAGE);
    break;
  default:
    console.error(`Comando desconocido: ${command}\n\n${USAGE}`);
    process.exit(1);
}

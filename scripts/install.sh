#!/usr/bin/env bash
# Instala yt-dwld: dependencias, comando global (bun link) y config.json.
set -euo pipefail

cd "$(dirname "$0")/.."

command -v bun >/dev/null || { echo "Error: Bun no está instalado (https://bun.sh)." >&2; exit 1; }

echo "→ Instalando dependencias..."
bun install

chmod +x src/index.ts

echo "→ Registrando el comando global yt-dwld..."
bun link

echo "→ Creando configuración..."
bun -e "import('./src/config.ts').then(m => { m.loadConfig(); console.log('  ' + m.configPath); })"

for dep in yt-dlp ffmpeg; do
  command -v "$dep" >/dev/null || echo "Aviso: no se encontró '$dep' en el PATH; instálalo antes de descargar." >&2
done

echo
echo "Listo. Edita la configuración (outputDir, cookie) y ejecuta: yt-dwld"

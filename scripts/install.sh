#!/usr/bin/env bash
# Instala yt-dwld: dependencias, compilación a dist/, comando global y config.json.
set -euo pipefail

cd "$(dirname "$0")/.."

command -v node >/dev/null || { echo "Error: Node.js no está instalado (se requiere 24+)." >&2; exit 1; }
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 24 ] || { echo "Error: se requiere Node 24+, tienes $(node -v)." >&2; exit 1; }

echo "→ Instalando dependencias..."
npm install

echo "→ Compilando..."
npm run build
chmod +x dist/index.js

echo "→ Registrando el comando global yt-dwld..."
npm link

echo "→ Creando configuración..."
node -e "import('./dist/config.js').then(m => { m.loadConfig(); console.log('  ' + m.configPath); })"

for dep in yt-dlp ffmpeg; do
  command -v "$dep" >/dev/null || echo "Aviso: no se encontró '$dep' en el PATH; instálalo antes de descargar." >&2
done

echo
echo "Listo. Edita la configuración (outputDir, cookie) y ejecuta: yt-dwld"

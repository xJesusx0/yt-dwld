# yt-dwld

CLI interactivo para buscar canciones en YouTube Music y descargarlas como MP3.

Busca con [youtubei.js](https://github.com/LuanRT/YouTube.js), te muestra los resultados en un menú navegable con las flechas ([@clack/prompts](https://github.com/bombshell-dev/clack)) y descarga el audio con [yt-dlp](https://github.com/yt-dlp/yt-dlp).

## Requisitos

- **Node.js 24+** (ejecuta TypeScript directamente).
- **yt-dlp**, actualizado. Las versiones viejas fallan con `Please sign in` o `Signature extraction failed`; instala el binario oficial desde las [releases](https://github.com/yt-dlp/yt-dlp/releases) o con `pipx install -U yt-dlp`.
- **ffmpeg**, que `yt-dlp` necesita para convertir a MP3.
- Un runtime de JavaScript para `yt-dlp` (Node sirve) si tu versión lo exige para resolver la firma de YouTube.

## Instalación

```bash
git clone <repo> && cd yt-dwld
bash scripts/install.sh   # o: npm run install:cli
```

El script instala dependencias, compila a `dist/`, registra el comando global `yt-dwld` (`npm link`) y crea `~/.config/yt-dwld/config.json` si no existe. Si cambias el código, vuelve a ejecutar `npm run build`.

Después edita la configuración (ver abajo) y pega tu cookie de YouTube Music. Para obtenerla: abre <https://music.youtube.com> con tu sesión iniciada, abre las herramientas de desarrollador, ve a Network, elige cualquier petición y copia el valor de la cabecera `Cookie`.

> El `config.json` se crea con permisos `600` porque contiene la cookie, que da acceso a tu cuenta de Google. No lo compartas ni lo subas a ningún repositorio.

## Uso

```bash
yt-dwld        # o, en desarrollo: npm run dev
```

1. Escribe lo que quieres buscar.
2. Elige una canción con ↑/↓ y Enter.
3. El MP3 se guarda en la carpeta `outputDir` de la configuración (por defecto `~/Music`).

Con Ctrl+C sales en cualquier paso.

### Configuración

En la primera descarga se crea `~/.config/yt-dwld/config.json` (o `$XDG_CONFIG_HOME/yt-dwld/config.json`):

```json
{
  "outputDir": "~/Music",
  "cookie": ""
}
```

- `outputDir`: carpeta de destino. Acepta `~` y se crea si no existe.
- `cookie`: cookie de YouTube Music. La variable de entorno `YT_COOKIE` tiene prioridad si está definida.

### Producción

```bash
npm run build
npm start
```

## Scripts

| Script                 | Descripción                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Ejecuta `src/index.ts` con recarga           |
| `npm run build`        | Compila a `dist/` con `tsc`                  |
| `npm start`            | Ejecuta la versión compilada                 |
| `npm run typecheck`    | Revisa tipos sin generar archivos            |
| `npm run lint`         | Analiza el código con oxlint                 |
| `npm run lint:fix`     | Aplica los arreglos automáticos de oxlint    |
| `npm run format`       | Formatea con Prettier                        |
| `npm run format:check` | Comprueba el formato sin modificar archivos  |

## Estructura

```
src/
├── index.ts       # Menú interactivo (entrada del programa)
├── search.ts      # Búsqueda en YouTube Music y mapeo de resultados
├── config.ts      # Lee/crea ~/.config/yt-dwld/config.json
├── download.ts    # Descarga y conversión a MP3 con yt-dlp
├── music-type.ts  # Tipos de resultado y filtro (solo canciones)
└── types.ts       # Tipos compartidos
```

## Solución de problemas

- **`Please sign in` / `Precondition check failed`**: actualiza `yt-dlp`. Si persiste, añade `--cookies-from-browser <navegador>` a los argumentos en `src/download.ts`.
- **`yt-dlp salió con código 1`**: revisa las líneas `ERROR` del log justo encima.
- **Aviso `... not found!` del parser de youtubei.js**: es inofensivo, se silencia con `Log.setLevel(Log.Level.NONE)` en `src/search.ts`.
- **`spawn yt-dlp ENOENT`**: `yt-dlp` no está instalado o no está en el `PATH`.

## Aviso legal

Úsalo solo para contenido que tengas derecho a descargar. Descargar material protegido puede incumplir los términos de YouTube y las leyes de derechos de autor de tu país.

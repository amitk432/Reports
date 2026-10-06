import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// records/ (original reports + index.json) and reports/ (summaries) live at the
// project root. Serve them in dev and copy them into dist on build.
const ROOT = path.resolve(import.meta.dirname, '..');
const STATIC_DIRS = ['records', 'reports'];
const TYPES = { '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.pdf': 'application/pdf', '.md': 'text/plain; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

function projectFiles() {
  return {
    name: 'project-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent(req.url.split('?')[0]);
        const dir = STATIC_DIRS.find(d => url.startsWith(`/${d}/`));
        if (!dir) return next();
        const file = path.join(ROOT, url);
        if (!file.startsWith(path.join(ROOT, dir)) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
        res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
        fs.createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      for (const d of STATIC_DIRS) fs.cpSync(path.join(ROOT, d), path.resolve(import.meta.dirname, 'dist', d), { recursive: true });
    },
  };
}

export default defineConfig({
  base: './', // works at any GitHub Pages sub-path
  plugins: [react(), projectFiles()],
  server: { port: 3000 },
});

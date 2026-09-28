import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

if (fs.existsSync(distDir)) {
  // 1. Create .nojekyll to prevent GitHub Pages Jekyll processing
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

  // 2. Duplicate index.html to 404.html for SPA fallback routing
  const indexPath = path.join(distDir, 'index.html');
  const fallbackPath = path.join(distDir, '404.html');
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, fallbackPath);
    console.log('✓ Successfully created dist/.nojekyll and dist/404.html for GitHub Pages');
  }
}

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error("dist directory does not exist. Run npm run build first.");
  process.exit(1);
}

// 1. Ensure .nojekyll and 404.html exist
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
const indexPath = path.join(distDir, 'index.html');
const fallbackPath = path.join(distDir, '404.html');
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, fallbackPath);
}

console.log("Preparing clean deployment to gh-pages branch...");

try {
  // 2. Initialize a clean standalone repository inside dist/
  const gitDir = path.join(distDir, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  execSync('git init', { cwd: distDir, stdio: 'pipe' });
  execSync('git config user.name "shourya2327"', { cwd: distDir, stdio: 'pipe' });
  execSync('git config user.email "shourya2327@users.noreply.github.com"', { cwd: distDir, stdio: 'pipe' });
  execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'pipe' });
  execSync('git add -A', { cwd: distDir, stdio: 'pipe' });
  execSync('git commit -m "Deploy GramMitraAI to GitHub Pages"', { cwd: distDir, stdio: 'pipe' });
  execSync('git remote add origin https://github.com/shourya2327/SIH-GramMitraAI.git', { cwd: distDir, stdio: 'pipe' });
  
  console.log("Pushing dist directory to origin/gh-pages...");
  execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });

  // Clean up temporary .git inside dist
  fs.rmSync(gitDir, { recursive: true, force: true });

  console.log("✓ Successfully deployed GramMitraAI to GitHub Pages (gh-pages branch)!");
} catch (err) {
  console.error("Deployment failed:", err);
  process.exit(1);
}

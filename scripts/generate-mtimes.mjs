import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, '..', 'src');

function collect(relativeDir) {
  const out = {};
  const dir = join(srcDir, relativeDir);
  try {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      if (statSync(join(dir, file)).isDirectory()) continue;
      out[`./${relativeDir}/${file}`] = statSync(join(dir, file)).mtimeMs;
    }
  } catch {
    // source directory missing → leave empty
  }
  return out;
}

const manifest = {
  summaries: collect('summaries'),
  experiences: collect('experiences'),
};

writeFileSync(join(srcDir, 'md-mtimes.json'), `${JSON.stringify(manifest, null, 2)}\n`);
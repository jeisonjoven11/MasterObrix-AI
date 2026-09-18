import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const ignored = new Set(['node_modules', '.git', 'dist', 'android', 'coverage']);
const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.yml', '.yaml', '.md']);

const secretPatterns = [
  { name: 'OpenAI-style API key', re: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: 'Google API key', re: /AIza[0-9A-Za-z_-]{20,}/ },
  { name: 'AWS access key', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'Private key', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Bearer token', re: /Bearer\s+[A-Za-z0-9._-]{20,}/i },
  { name: 'Hard-coded credential assignment', re: /(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]{12,}['"]/i }
];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (ignored.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else if (extensions.has(full.slice(full.lastIndexOf('.')))) files.push(full);
  }
  return files;
}

let files = [];
try {
  files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean)
    .filter(p => !ignored.has(p.split('/')[0]));
} catch {
  files = walk(root).map(p => relative(root, p));
}

const findings = [];
for (const path of files) {
  let source = '';
  try { source = readFileSync(join(root, path), 'utf8'); } catch { continue; }
  for (const pattern of secretPatterns) {
    if (pattern.re.test(source)) findings.push(`${path}: ${pattern.name}`);
  }
}

if (findings.length) {
  console.error('Security audit failed: possible hard-coded secrets found.');
  findings.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}
console.log('Security audit passed: no known hard-coded secret patterns found in tracked source files.');

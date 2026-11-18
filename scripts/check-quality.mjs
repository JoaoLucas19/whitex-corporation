import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = name => readFileSync(resolve(root, name), 'utf8');
const html = read('index.html');
const css = read('style.css');
const js = read('script.js');
const robots = read('robots.txt');
const sitemap = read('sitemap.xml');

let failures = 0;
const check = (condition, description) => {
  console.log(`${condition ? '✔' : '✘'} ${description}`);
  if (!condition) failures++;
};

check(/<html\b[^>]*\blang="pt-BR"/i.test(html), 'Idioma do HTML configurado');
check(/<title>[^<]+<\/title>/i.test(html), 'Título de página presente');
check(/<meta\s+name="description"\s+content="[^"]+"/i.test(html), 'Meta description presente');
check(/<main\b[^>]*\bid="conteudo"/i.test(html), 'Marco principal e link de acesso rápido');
check(/<link\s+rel="canonical"\s+href="https:\/\/whitexcorporation\.com\.br\/"/i.test(html), 'Canonical aponta para produção');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
check(new Set(ids).size === ids.length, 'IDs HTML sem duplicação');

for (const [, target] of html.matchAll(/\bhref="#([^"]+)"/g)) {
  check(ids.includes(target), `Âncora #${target} possui destino`);
}

for (const [, attr, rawUrl] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
  if (/^(?:https?:|mailto:|tel:|data:|#|\/\/)/i.test(rawUrl)) continue;
  const file = rawUrl.split(/[?#]/)[0];
  if (!file) continue;
  const absolutePath = resolve(root, file);
  check(absolutePath.startsWith(root + '/') && existsSync(absolutePath), `Recurso local ${attr}=${rawUrl} existe`);
}

for (const match of html.matchAll(/<img\b([^>]+)>/gi)) {
  check(/\balt="[^"]*"/i.test(match[1]), 'Imagem possui atributo alt');
}

check(/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(css), 'CSS respeita movimento reduzido');
check((css.match(/\{/g) || []).length === (css.match(/\}/g) || []).length, 'Chaves CSS equilibradas');
check(/\baria-expanded\b/.test(html) && /\baria-expanded\b/.test(js), 'Menu possui estado de acessibilidade');
check(/Sitemap:\s*https:\/\/whitexcorporation\.com\.br\/sitemap\.xml/i.test(robots), 'robots.txt referencia sitemap');
check(/<loc>https:\/\/whitexcorporation\.com\.br\/<\/loc>/.test(sitemap), 'Sitemap contém a URL oficial');
check(!/whitex-(?:git|develop)-preview/.test(sitemap), 'Sitemap não divulga URLs de teste');

const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
let validJsonLd = false;
try {
  if (jsonLd) validJsonLd = JSON.parse(jsonLd[1])['@type'] === 'Organization';
} catch { /* failed validation is reported below */ }
check(validJsonLd, 'JSON-LD de Organization válido');

if (failures) {
  console.error(`\nFalharam ${failures} verificações.`);
  process.exitCode = 1;
} else {
  console.log('\nTodas as verificações de qualidade passaram.');
}

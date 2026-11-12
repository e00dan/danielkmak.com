// Inserts the server-rendered page into dist/index.html so crawlers and AI
// agents get the full content without running JavaScript.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const dist = resolve('dist');
const ssr = resolve('dist-ssr');
const { render } = await import(pathToFileURL(resolve(ssr, 'entry-server.js')).href);

const htmlPath = resolve(dist, 'index.html');
const html = await readFile(htmlPath, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('prerender: #root marker not found in dist/index.html');

const appHtml = render();
if (/hi@danielkmak|mailto:/i.test(appHtml)) throw new Error('prerender: email address leaked into static HTML');

await writeFile(htmlPath, html.replace(marker, `<div id="root">${appHtml}</div>`));
await rm(ssr, { recursive: true, force: true });
console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`);

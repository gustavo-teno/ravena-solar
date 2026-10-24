// Captura a página inteira em 390 px e 1440 px usando um Chrome/Edge já aberto com --remote-debugging-port.
// Uso: node scripts/capturar.mjs <url> <pasta> [porta]
import { writeFileSync, mkdirSync } from 'node:fs';

const [url, pasta, porta = '9333'] = process.argv.slice(2);
if (!url || !pasta) throw new Error('uso: node scripts/capturar.mjs <url> <pasta> [porta]');
mkdirSync(pasta, { recursive: true });

const alvo = await (await fetch(`http://localhost:${porta}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise((ok) => (ws.onopen = ok));
let id = 0;
const pendentes = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pendentes.has(msg.id)) pendentes.get(msg.id)(msg);
};
const cdp = (method, params = {}) =>
  new Promise((ok) => {
    const n = ++id;
    pendentes.set(n, ok);
    ws.send(JSON.stringify({ id: n, method, params }));
  });

for (const [largura, nome, movel] of [[390, 'pagina-390.png', true], [1440, 'pagina-1440.png', false]]) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: largura, height: 844, deviceScaleFactor: 1, mobile: movel });
  await cdp('Page.navigate', { url });
  await new Promise((ok) => setTimeout(ok, 2500));
  const medidas = (await cdp('Runtime.evaluate', {
    expression: 'JSON.stringify({h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})',
    returnByValue: true,
  })).result.result.value;
  const { h, sw, cw } = JSON.parse(medidas);
  console.log(`${largura}px: altura ${h}, scrollWidth ${sw}, clientWidth ${cw}${sw > cw ? '  <-- ROLAGEM HORIZONTAL' : ''}`);
  const png = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: largura, height: h, scale: 1 } });
  writeFileSync(`${pasta}/${nome}`, Buffer.from(png.result.data, 'base64'));
}
await fetch(`http://localhost:${porta}/json/close/${alvo.id}`);
ws.close();

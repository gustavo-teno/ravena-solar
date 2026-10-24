// Resume um relatório JSON do Lighthouse: notas, métricas e auditorias que falharam.
import { readFileSync } from 'node:fs';

const r = JSON.parse(readFileSync(process.argv[2], 'utf8'));
console.log(`${r.finalDisplayedUrl} | ${r.configSettings.formFactor} | ${r.lighthouseVersion}`);
for (const [k, v] of Object.entries(r.categories)) console.log(`  ${k}: ${Math.round(v.score * 100)}`);
for (const k of ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index']) {
  console.log(`  ${k}: ${r.audits[k].displayValue}`);
}
for (const [k, v] of Object.entries(r.audits)) {
  if (v.score !== null && v.score < 1 && ['binary', 'numeric'].includes(v.scoreDisplayMode)) console.log(`  ! ${k} (${v.score}): ${v.title}`);
}

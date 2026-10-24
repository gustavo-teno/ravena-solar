// Cores da marca: lidas do logo.svg por código. Nenhum hex da marca é digitado à mão.
// Os tons derivados (papel, linha, texto suave...) são misturas calculadas das cores do logo.
import { readFileSync } from 'node:fs';

const svg = readFileSync(new URL('../logo.svg', import.meta.url), 'utf8');

function pegar(regex, nome) {
  const achou = svg.match(regex);
  if (!achou) throw new Error(`logo.svg: não encontrei a cor "${nome}". O logo mudou de estrutura?`);
  return achou[1].toUpperCase();
}

export const marca = {
  azul: pegar(/<path[^>]*fill="(#[0-9a-f]{6})"/i, 'azul (casa/painel)'),
  ambar: pegar(/<circle[^>]*fill="(#[0-9a-f]{6})"/i, 'âmbar (sol)'),
  laranja: pegar(/<text[^>]*fill="(#[0-9a-f]{6})"[^>]*>\s*SOLAR/i, 'laranja (SOLAR)'),
};

const BRANCO = '#FFFFFF';

function paraRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function paraHex(rgb) {
  return '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Mistura `a` com `b`; `parte` é a fração de `a` (0 a 1). */
export function misturar(a, b, parte) {
  const ra = paraRgb(a);
  const rb = paraRgb(b);
  return paraHex(ra.map((v, i) => v * parte + rb[i] * (1 - parte)));
}

export const tokens = {
  azul: marca.azul,
  ambar: marca.ambar,
  laranja: marca.laranja,
  branco: BRANCO,
  papel: misturar(marca.azul, BRANCO, 0.04),
  'azul-claro': misturar(marca.azul, BRANCO, 0.09),
  linha: misturar(marca.azul, BRANCO, 0.18),
  suave: misturar(marca.azul, BRANCO, 0.8),
  'ambar-fundo': misturar(marca.ambar, BRANCO, 0.2),
  'ambar-hover': misturar(marca.ambar, BRANCO, 0.7),
  alerta: misturar(marca.laranja, marca.azul, 0.45),
  'alerta-fundo': misturar(marca.laranja, BRANCO, 0.1),
  'sobre-azul': misturar(BRANCO, marca.azul, 0.82),
};

export function luminancia(hex) {
  const [r, g, b] = paraRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a, b) {
  const [la, lb] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (la + 0.05) / (lb + 0.05);
}

export function cssDeTokens() {
  return ':root{' + Object.entries(tokens).map(([k, v]) => `--${k}:${v}`).join(';') + '}';
}

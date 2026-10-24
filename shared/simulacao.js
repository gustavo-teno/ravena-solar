// HTML de dentro de .sim-saida (simulador do hero). Um único lugar, usado pelo build
// (resultado de exemplo no HTML inicial) e pelo navegador (resultado da pessoa).
// Sem DOM: roda no Node e no navegador. A conta em si vem de estimarConta (validacao.js).
import { VALOR_MINIMO_CONTA } from './validacao.js';

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

// As barras usam uma escala em reais, a mesma para as duas: assim a de hoje cresce com a conta
// digitada e a de depois fica sempre menor. Acima de ESCALA_BARRAS a escala acompanha a conta.
const ESCALA_BARRAS = 1500;
const pct = (valor, escala) => `${Math.round((valor / escala) * 1000) / 10}%`;

// Mesma frase no simulador e no aviso do formulário (o build a põe no HTML).
export const AVISO_ABAIXO_DO_MINIMO = `Abaixo de ${reais.format(VALOR_MINIMO_CONTA)} por mês a conta não fecha, e nós mesmos desaconselhamos a instalação.`;

/**
 * `estimativa` é o retorno de estimarConta; null/undefined quando o campo está vazio.
 * `exemplo: true` rotula a conta como a do caso real, para ninguém ler como a própria.
 */
export function htmlDaSimulacao(estimativa, { exemplo = false } = {}) {
  if (!estimativa) {
    return '<p class="nota">Digite o valor e veja a estimativa pela média dos nossos clientes.</p>';
  }
  if (!estimativa.valido) {
    return '<p class="aviso">Digite só o valor em reais, por exemplo 780 ou 780,00.</p>';
  }
  if (!estimativa.atende) {
    return `<p class="aviso">${AVISO_ABAIXO_DO_MINIMO}</p>`;
  }

  const { conta, de, ate } = estimativa;
  const escala = Math.max(conta, ESCALA_BARRAS);
  const selo = exemplo ? '<p class="selo">Exemplo: a conta do nosso caso em Sorocaba</p>' : '';
  const hoje = exemplo ? 'Conta de hoje' : 'Sua conta hoje';
  const descricao = `Conta de ${reais.format(conta)} hoje; com o sistema, entre ${reais.format(de)} e ${reais.format(ate)} pela média dos clientes`;
  return `
    ${selo}
    <div class="conta-barras" role="img" aria-label="${descricao}">
      <div class="comparo">
        <div class="comparo-topo"><span>${hoje}</span><b class="num">${reais.format(conta)}</b></div>
        <div class="trilho trilho-hoje" style="--largura:${pct(conta, escala)}"></div>
      </div>
      <div class="comparo">
        <div class="comparo-topo"><span>Com o sistema, pela média</span><b class="num">${reais.format(de)} a ${reais.format(ate)}</b></div>
        <div class="trilho trilho-depois" style="--piso:${pct(de, escala)};--teto:${pct(ate, escala)}"></div>
      </div>
    </div>
    <p class="nota">Pela média dos nossos clientes. A conta não zera: sobra a taxa mínima e o custo do fio.</p>`;
}

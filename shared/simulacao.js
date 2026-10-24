// HTML de dentro de .sim-saida (simulador do hero). Um único lugar, usado pelo build
// (resultado de exemplo no HTML inicial) e pelo navegador (resultado da pessoa).
// Sem DOM: roda no Node e no navegador. A conta em si vem de estimarConta (validacao.js).
import { VALOR_MINIMO_CONTA } from './validacao.js';

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

// Largura como parte da conta de hoje, arredondada em uma casa decimal.
const pct = (parte, total) => `${Math.round((parte / total) * 1000) / 10}%`;

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
  const rotulo = exemplo ? 'Exemplo: a conta do nosso caso em Sorocaba' : 'Sua conta hoje';
  const descricao = `Conta de ${reais.format(conta)} hoje; com o sistema, entre ${reais.format(de)} e ${reais.format(ate)} pela média dos clientes`;
  return `
    <div class="linha"><span>${rotulo}</span><span class="valor num">${reais.format(conta)}</span></div>
    <div class="linha"><span>Estimativa com o sistema</span><span class="valor num">${reais.format(de)} a ${reais.format(ate)}</span></div>
    <div class="conta-barras" role="img" aria-label="${descricao}">
      <div>
        <div class="barra-info"><span>Hoje</span></div>
        <div class="barra" style="--largura:${pct(conta, conta)}"></div>
      </div>
      <div>
        <div class="barra-info"><span>Com o sistema, pela média</span></div>
        <div class="barra-faixa"><div class="barra-seg" style="--inicio:${pct(de, conta)};--fim:${pct(ate, conta)}"></div></div>
      </div>
    </div>
    <p class="nota">Estimativa pela média dos nossos clientes, que veem a conta cair de 75% a 90%. A conta não zera: sobra a taxa mínima e o custo do fio. Quem dimensiona o seu caso é a visita técnica.</p>`;
}

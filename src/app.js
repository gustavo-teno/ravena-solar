// Melhorias da página: simulador e envio sem recarregar.
// O texto, os números e o formulário já funcionam sem este script (POST nativo).
import {
  lerValorEmReais,
  estimarConta,
  validarPedido,
  VALOR_MINIMO_CONTA,
  ANEXO_MAX_BYTES,
} from './validacao.js';

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const $ = (id) => document.getElementById(id);

/* ---------- Simulador ---------- */
const entradaSim = $('sim-valor');
const saidaSim = $('sim-saida');
const continuar = $('sim-continuar');
const selectConta = $('conta');

function mostrarSimulacao() {
  const texto = entradaSim.value.trim();
  continuar.hidden = true;
  if (!texto) {
    saidaSim.innerHTML = '<p class="nota">Digite o valor e veja a estimativa pela média dos nossos clientes.</p>';
    return;
  }
  const estimativa = estimarConta(lerValorEmReais(texto));
  if (!estimativa.valido) {
    saidaSim.innerHTML = '<p class="aviso">Digite só o valor em reais, por exemplo 780 ou 780,00.</p>';
    return;
  }
  if (!estimativa.atende) {
    saidaSim.innerHTML =
      `<p class="aviso"><strong>Nesse valor a conta não fecha.</strong> Abaixo de ${reais.format(VALOR_MINIMO_CONTA)} por mês nós mesmos desaconselhamos a instalação.</p>`;
    return;
  }
  saidaSim.innerHTML = `
    <div class="linha"><span>Sua conta hoje</span><span class="valor num">${reais.format(estimativa.conta)}</span></div>
    <div class="linha"><span>Estimativa com o sistema</span><span class="valor num">${reais.format(estimativa.de)} a ${reais.format(estimativa.ate)}</span></div>
    <p class="nota">Estimativa pela média dos nossos clientes, que veem a conta cair de 75% a 90%. Nunca chega a zero: sempre resta a taxa mínima e o custo do fio. Quem dimensiona o seu caso é a visita técnica.</p>`;
  continuar.dataset.faixa = estimativa.faixa;
  continuar.hidden = false;
}

entradaSim.addEventListener('input', mostrarSimulacao);
continuar.addEventListener('click', () => {
  if (continuar.dataset.faixa) {
    selectConta.value = continuar.dataset.faixa;
    atualizarAvisoConta();
  }
});

/* ---------- Formulário ---------- */
const form = $('form-pedido');
const botaoEnviar = $('enviar');
const avisoConta = $('aviso-conta');
const erroGeral = $('erro-geral');
const campos = ['nome', 'whatsapp', 'cidade', 'conta', 'anexo'];

form.noValidate = true; // sem JS, o navegador valida; com JS, usamos a regra compartilhada

function atualizarAvisoConta() {
  const abaixo = selectConta.value === 'abaixo-450';
  avisoConta.hidden = !abaixo;
  botaoEnviar.hidden = abaixo;
}
selectConta.addEventListener('change', atualizarAvisoConta);
atualizarAvisoConta();

function limparErros() {
  erroGeral.hidden = true;
  for (const id of campos) {
    const campo = $(id);
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
    const antigo = $('erro-' + id);
    if (antigo) antigo.remove();
  }
  $('anexo').setAttribute('aria-describedby', 'dica-anexo');
}

function mostrarErros(erros) {
  let primeiro = null;
  for (const id of campos) {
    if (!erros[id]) continue;
    const campo = $(id);
    campo.setAttribute('aria-invalid', 'true');
    const p = document.createElement('p');
    p.className = 'erro';
    p.id = 'erro-' + id;
    p.textContent = erros[id];
    campo.parentElement.append(p);
    campo.setAttribute('aria-describedby', p.id);
    primeiro ??= campo;
  }
  primeiro?.focus();
}

function dadosDoFormulario() {
  const dados = new FormData(form);
  const arquivo = dados.get('anexo');
  const temArquivo = arquivo instanceof File && arquivo.size > 0;
  return {
    dados,
    entrada: {
      nome: dados.get('nome'),
      whatsapp: dados.get('whatsapp'),
      cidade: dados.get('cidade'),
      conta: dados.get('conta'),
      anexo: temArquivo ? { nome: arquivo.name, tipo: arquivo.type, tamanho: arquivo.size } : null,
    },
  };
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparErros();
  const { dados, entrada } = dadosDoFormulario();
  const resultado = validarPedido(entrada);
  if (!resultado.ok) {
    mostrarErros(resultado.erros);
    return;
  }
  if (!entrada.anexo) dados.delete('anexo');

  botaoEnviar.disabled = true;
  const textoOriginal = botaoEnviar.textContent;
  botaoEnviar.textContent = 'Enviando…';

  try {
    const controle = new AbortController();
    const prazo = setTimeout(() => controle.abort(), 20000);
    const resposta = await fetch(form.action, {
      method: 'POST',
      body: dados,
      headers: { Accept: 'application/json' },
      signal: controle.signal,
    });
    clearTimeout(prazo);

    if (resposta.status === 422) {
      const corpo = await resposta.json().catch(() => ({}));
      mostrarErros(corpo.erros || {});
      return;
    }
    if (!resposta.ok) throw new Error('status ' + resposta.status);

    // Só aqui, com o destino confirmando, a página diz que o pedido foi recebido.
    form.hidden = true;
    const confirmacao = $('confirmacao');
    confirmacao.hidden = false;
    confirmacao.focus();
    confirmacao.scrollIntoView({ block: 'center' });
  } catch {
    erroGeral.textContent =
      'Não conseguimos enviar o seu pedido agora. Seus dados continuam no formulário: confira a conexão e tente de novo.';
    erroGeral.hidden = false;
  } finally {
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = textoOriginal;
  }
});

// Aviso antecipado de tamanho do anexo, com a mesma regra do servidor.
$('anexo').addEventListener('change', (e) => {
  const arquivo = e.target.files[0];
  const antigo = $('erro-anexo');
  if (antigo) antigo.remove();
  e.target.removeAttribute('aria-invalid');
  if (arquivo && arquivo.size > ANEXO_MAX_BYTES) {
    mostrarErros({ anexo: 'O arquivo passa de 4 MB. Envie uma foto menor ou um PDF.' });
  }
});

// Melhorias da página: simulador e envio sem recarregar.
// O texto, os números e o formulário já funcionam sem este script (POST nativo).
import {
  lerValorEmReais,
  estimarConta,
  validarPedido,
  FAIXAS_CONTA,
  ANEXO_MAX_BYTES,
} from './validacao.js';
import { htmlDaSimulacao } from './simulacao.js';

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const $ = (id) => document.getElementById(id);

/* ---------- Simulador ---------- */
// O HTML inicial já traz o exemplo (calculado no build); este código só age quando a pessoa mexe.
const entradaSim = $('sim-valor');
const saidaSim = $('sim-saida');
const continuar = $('sim-continuar');
const selectConta = $('conta');

function mostrarSimulacao() {
  const texto = entradaSim.value.trim();
  const estimativa = texto ? estimarConta(lerValorEmReais(texto)) : null;
  saidaSim.innerHTML = htmlDaSimulacao(estimativa);
  continuar.hidden = !estimativa?.atende;
  if (estimativa?.atende) continuar.dataset.faixa = estimativa.faixa;
  else delete continuar.dataset.faixa;
}

entradaSim.addEventListener('input', mostrarSimulacao);

// Foco no campo: o exemplo é trocado por cima, sem apagar na mão.
let recemFocado = false;
entradaSim.addEventListener('focus', () => {
  entradaSim.select();
  recemFocado = true;
});
entradaSim.addEventListener('mouseup', (evento) => {
  if (recemFocado) evento.preventDefault(); // o clique não desfaz a seleção
  recemFocado = false;
});

// Atalhos: os limites das faixas do formulário (o último, sem teto, não é um valor).
const atalhos = document.createElement('div');
atalhos.className = 'sim-atalhos';
for (const { ate } of FAIXAS_CONTA.filter((f) => Number.isFinite(f.ate))) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = reais.format(ate);
  botao.addEventListener('click', () => {
    entradaSim.value = String(ate);
    mostrarSimulacao();
  });
  atalhos.append(botao);
}
entradaSim.closest('.sim-campo').after(atalhos);

/* ---------- Formulário ---------- */
const form = $('form-pedido');
const botaoEnviar = $('enviar');
const avisoConta = $('aviso-conta');
const erroGeral = $('erro-geral');
const campos = ['conta', 'cidade', 'nome', 'whatsapp', 'anexo']; // ordem da tela

form.noValidate = true; // sem JS, o navegador valida; com JS, usamos a regra compartilhada

function atualizarAvisoConta() {
  const abaixo = selectConta.value === 'abaixo-450';
  avisoConta.hidden = !abaixo;
  botaoEnviar.hidden = abaixo;
}
selectConta.addEventListener('change', atualizarAvisoConta);
atualizarAvisoConta();

// Todo "Pedir simulação" que carrega uma faixa (o do caso, o do simulador) leva a conta já escolhida.
// A faixa nunca vai na URL: o link só aponta para #pedido.
document.addEventListener('click', (evento) => {
  const link = evento.target.closest('a[data-faixa][href="#pedido"]');
  if (!link) return;
  selectConta.value = link.dataset.faixa;
  atualizarAvisoConta();
});

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

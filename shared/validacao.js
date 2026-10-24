// Regras do pedido de simulação. Um único módulo, usado pela página (navegador)
// e pelo destino (servidor). Não duplique estas regras em outro lugar.

export const VALOR_MINIMO_CONTA = 450;

// Média dos clientes (brief): a conta cai de 75% a 90%. Nunca chega a zero.
export const QUEDA_MINIMA = 75;
export const QUEDA_MAXIMA = 90;

export const CIDADES = [
  { id: 'sorocaba', rotulo: 'Sorocaba' },
  { id: 'votorantim', rotulo: 'Votorantim' },
  { id: 'itu', rotulo: 'Itu' },
  { id: 'salto', rotulo: 'Salto' },
  { id: 'outra', rotulo: 'Outra cidade (fora da área que atendemos)' },
];

// Faixas do formulário: decisão de design, não afirmação sobre a empresa.
// O corte em 450 vem do brief; os demais limites só organizam a escolha.
export const FAIXAS_CONTA = [
  { id: 'abaixo-450', rotulo: 'Abaixo de R$ 450', de: 0, ate: 450 },
  { id: '450-700', rotulo: 'R$ 450 a R$ 700', de: 450, ate: 700 },
  { id: '700-1000', rotulo: 'R$ 700 a R$ 1.000', de: 700, ate: 1000 },
  { id: 'acima-1000', rotulo: 'Acima de R$ 1.000', de: 1000, ate: Infinity },
];

export const ANEXO_TIPOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
];
const ANEXO_EXTENSOES = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'pdf'];
export const ANEXO_MAX_BYTES = 4 * 1024 * 1024;

/**
 * Lê um valor em reais digitado por uma pessoa.
 * "780" "780,00" "R$ 1.250,50" "1250" "1.250" -> número. Texto inválido -> NaN.
 */
export function lerValorEmReais(texto) {
  if (typeof texto !== 'string') return NaN;
  const limpo = texto.replace(/R\$|\s| /gi, '');
  if (!/^\d[\d.,]*$/.test(limpo)) return NaN;

  const temPonto = limpo.includes('.');
  const temVirgula = limpo.includes(',');
  let normal;

  if (temPonto && temVirgula) {
    // O último separador é o decimal; o outro é de milhar.
    const decimal = limpo.lastIndexOf(',') > limpo.lastIndexOf('.') ? ',' : '.';
    const milhar = decimal === ',' ? '.' : ',';
    normal = limpo.split(milhar).join('').replace(decimal, '.');
  } else if (temVirgula) {
    if ((limpo.match(/,/g) || []).length > 1) return NaN;
    normal = limpo.replace(',', '.');
  } else if (temPonto) {
    const grupos = limpo.split('.');
    const milhar = grupos.length > 2 || /^\d{1,3}\.\d{3}$/.test(limpo);
    normal = milhar ? grupos.join('') : limpo;
  } else {
    normal = limpo;
  }

  const valor = Number(normal);
  if (!Number.isFinite(valor) || valor <= 0 || valor > 1_000_000) return NaN;
  return valor;
}

export function faixaDoValor(valor) {
  if (!Number.isFinite(valor)) return null;
  return FAIXAS_CONTA.find((f) => valor >= f.de && valor < f.ate) || null;
}

/**
 * Estimativa do simulador: só a faixa média de queda aplicada ao valor digitado.
 * Não estima potência, painéis, preço nem economia em reais por ano.
 */
export function estimarConta(valor) {
  if (!Number.isFinite(valor) || valor <= 0) return { valido: false };
  if (valor < VALOR_MINIMO_CONTA) return { valido: true, atende: false, conta: valor };
  const restaMin = Math.max(1, Math.round((valor * (100 - QUEDA_MAXIMA)) / 100));
  const restaMax = Math.max(restaMin, Math.round((valor * (100 - QUEDA_MINIMA)) / 100));
  return {
    valido: true,
    atende: true,
    conta: valor,
    de: restaMin,
    ate: restaMax,
    faixa: faixaDoValor(valor).id,
  };
}

function soDigitos(texto) {
  return String(texto ?? '').replace(/\D/g, '');
}

/** Devolve os dígitos com DDD (10 ou 11) ou null se não parecer um celular/telefone brasileiro. */
export function normalizarWhatsapp(texto) {
  let d = soDigitos(texto);
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) d = d.slice(2);
  if (d.length !== 10 && d.length !== 11) return null;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return null;
  if (d.length === 11 && d[2] !== '9') return null;
  return d;
}

function anexoValido(anexo) {
  if (!anexo) return null;
  const tipo = String(anexo.tipo || '').toLowerCase();
  const extensao = String(anexo.nome || '').split('.').pop().toLowerCase();
  const tipoOk = ANEXO_TIPOS.includes(tipo) || (!tipo && ANEXO_EXTENSOES.includes(extensao));
  if (!tipoOk) return 'Envie uma foto (JPG, PNG, HEIC) ou um PDF da conta.';
  if (anexo.tamanho > ANEXO_MAX_BYTES) return 'O arquivo passa de 4 MB. Envie uma foto menor ou um PDF.';
  return null;
}

/**
 * Valida o pedido. `entrada` traz textos (nome, whatsapp, cidade, conta = id da faixa)
 * e `anexo` ({ tipo, tamanho, nome } ou null). Devolve { ok, erros, pedido }.
 */
export function validarPedido(entrada) {
  const erros = {};
  const nome = String(entrada?.nome ?? '').trim().replace(/\s+/g, ' ');
  if (nome.length < 2) erros.nome = 'Informe seu nome.';
  else if (nome.length > 100) erros.nome = 'O nome está muito longo.';

  const whatsapp = normalizarWhatsapp(entrada?.whatsapp);
  if (!whatsapp) erros.whatsapp = 'Informe o WhatsApp com DDD, por exemplo (15) 99999-9999.';

  const cidade = CIDADES.find((c) => c.id === entrada?.cidade);
  if (!cidade) erros.cidade = 'Escolha a sua cidade.';

  const faixa = FAIXAS_CONTA.find((f) => f.id === entrada?.conta);
  if (!faixa) erros.conta = 'Escolha a faixa da sua conta de luz.';
  else if (faixa.id === 'abaixo-450') {
    erros.conta = `Abaixo de R$ ${VALOR_MINIMO_CONTA} por mês a conta não fecha, e nós mesmos desaconselhamos a instalação.`;
  }

  const erroAnexo = anexoValido(entrada?.anexo);
  if (erroAnexo) erros.anexo = erroAnexo;

  const ok = Object.keys(erros).length === 0;
  return {
    ok,
    erros,
    pedido: ok
      ? {
          nome,
          whatsapp: `+55${whatsapp}`,
          cidade: cidade.id,
          foraDaArea: cidade.id === 'outra',
          conta: faixa.id,
          anexo: entrada.anexo
            ? { nome: entrada.anexo.nome, tipo: entrada.anexo.tipo, tamanho: entrada.anexo.tamanho }
            : null,
        }
      : null,
  };
}

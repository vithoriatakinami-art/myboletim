// ============================================================
// DADOS FICTÍCIOS — 9º ANO
// ============================================================
// Cada item do array é um OBJETO que representa uma disciplina.
// "array" = lista. "objeto" = conjunto de informações com nomes.
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Média mínima para "Bom desempenho"
const MEDIA_MINIMA = 6.0;

// Frequência FICTÍCIA só para demonstração nesta etapa.
// No futuro, será calculada de outra forma (não a partir das faltas).
const FREQUENCIA_DEMONSTRATIVA = 92;

// ============================================================
// FUNÇÃO: normalizarNota
// ============================================================
// Recebe um valor bruto e devolve:
//   - número entre 0 e 10 (válido)
//   - null (quando não há nota lançada ou valor inválido)
function normalizarNota(valor) {
  // Vazio, null ou undefined = ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto
  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  // Se não for número válido, trata como inválido
  if (isNaN(numero)) {
    return null;
  }

  // Regra: entre 0 e 10 permanece igual
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Regra: maior que 10 e até 100 divide por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras = inválido
  return null;
}

// ============================================================
// FUNÇÃO: formatarNota
// ============================================================
// Mostra a nota com uma casa decimal ou "Ainda não lançada".
function formatarNota(nota) {
  if (nota === null) return "Ainda não lançada";
  return nota.toFixed(1).replace(".", ",");
}

// ============================================================
// FUNÇÃO: calcularMedia
// ============================================================
// Usa somente notas válidas. Nota ausente nunca vira zero.
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) return null;

  const soma = validas.reduce(function (total, n) {
    return total + n;
  }, 0);

  return soma / validas.length;
}

// ============================================================
// FUNÇÃO: definirSituacao
// ============================================================
// Decide a etiqueta de situação com base na média disponível.
function definirSituacao(media) {
  if (media === null) {
    return { texto: "Nota ainda não disponível", classe: "indisponivel" };
  }
  if (media >= MEDIA_MINIMA) {
    return { texto: "Bom desempenho", classe: "bom" };
  }
  return { texto: "Atenção", classe: "atencao" };
}

// ============================================================
// PROCESSAMENTO DOS DADOS
// ============================================================
// "forEach" percorre cada item do array e monta um objeto novo
// já com as notas normalizadas e a média calculada.
const disciplinasProcessadas = dadosBrutos.map(function (item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const totalFaltas = item.faltas.reduce(function (t, f) { return t + f; }, 0);
  const situacao = definirSituacao(media);

  return {
    disciplina: item.disciplina,
    tri1: n1,
    tri2: n2,
    tri3: n3,
    media: media,
    faltas: totalFaltas,
    situacao: situacao
  };
});

// ============================================================
// PREENCHER A TABELA
// ============================================================
// "DOM" = a página HTML que o JavaScript consegue ler e alterar.
const corpoTabela = document.getElementById("corpoTabela");

disciplinasProcessadas.forEach(function (d) {
  const linha = document.createElement("tr");

  linha.innerHTML =
    "<td>" + d.disciplina + "</td>" +
    "<td>" + formatarNota(d.tri1) + "</td>" +
    "<td>" + formatarNota(d.tri2) + "</td>" +
    "<td>" + formatarNota(d.tri3) + "</td>" +
    "<td>" + (d.media === null ? "—" : formatarNota(d.media)) + "</td>" +
    "<td>" + d.faltas + "</td>" +
    "<td><span class='etiqueta " + d.situacao.classe + "'>" + d.situacao.texto + "</span></td>";

  corpoTabela.appendChild(linha);
});

// ============================================================
// CALCULAR OS CARDS DE RESUMO
// ============================================================
let somaMedias = 0;
let qtdMedias = 0;
let totalFaltasGeral = 0;
let bons = 0;
let atencao = 0;

disciplinasProcessadas.forEach(function (d) {
  if (d.media !== null) {
    somaMedias += d.media;
    qtdMedias++;
  }
  totalFaltasGeral += d.faltas;

  if (d.situacao.classe === "bom") bons++;
  if (d.situacao.classe === "atencao") atencao++;
});

const mediaGeral = qtdMedias > 0 ? somaMedias / qtdMedias : null;

// ============================================================
// MONTAR OS CARDS
// ============================================================
const areaCards = document.getElementById("cards");

// Lista com os 5 cards que vamos mostrar
const listaCards = [
  { titulo: "Média geral", valor: mediaGeral === null ? "—" : formatarNota(mediaGeral) },
  { titulo: "Total de faltas", valor: totalFaltasGeral },
  { titulo: "Bom desempenho", valor: bons + " disciplinas" },
  { titulo: "Precisam de atenção", valor: atencao + " disciplinas" },
  { titulo: "Frequência", valor: FREQUENCIA_DEMONSTRATIVA + "% — Frequência adequada" }
];

// "forEach" percorre a lista e cria um card para cada item
listaCards.forEach(function (c) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = "<h3>" + c.titulo + "</h3><p>" + c.valor + "</p>";
  areaCards.appendChild(card);
});
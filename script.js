// ============================================================
// CONFIGURAÇÃO FIXA DO ALUNO
// ============================================================
const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 30,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// ============================================================
// DADOS FICTÍCIOS — 9º ANO
// ============================================================
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
const FREQUENCIA_DEMONSTRATIVA = 92;

// Varíaveis de Sessão e Estado
let pinSessao = null;
let modoEdicao = false;
let dadosAtuais = [];

// ============================================================
// FUNÇÕES DE NORMALIZAÇÃO E FORMATÇÃO
// ============================================================
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

function formatarNota(nota) {
  if (nota === null || nota === undefined) return "Ainda não lançada";
  return Number(nota).toFixed(1).replace(".", ",");
}

function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null && n !== undefined && !isNaN(n);
  });

  if (validas.length === 0) return null;

  const soma = validas.reduce(function (total, n) {
    return total + n;
  }, 0);

  return soma / validas.length;
}

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
// PROCESSAR DADOS INICIAIS LOCAIS
// ============================================================
function obterDadosPadrao() {
  return dadosBrutos.map(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const f1 = Array.isArray(item.faltas) ? item.faltas[0] : 0;
    const f2 = Array.isArray(item.faltas) ? item.faltas[1] : 0;
    const f3 = Array.isArray(item.faltas) ? item.faltas[2] : 0;

    return {
      disciplina: item.disciplina,
      tri1: n1,
      tri2: n2,
      tri3: n3,
      faltas1: f1,
      faltas2: f2,
      faltas3: f3
    };
  });
}

// ============================================================
// RENDERIZAÇÃO DA INTERFACE (TABELA E CARDS)
// ============================================================
function renderizarTabela() {
  const corpoTabela = document.getElementById("corpoTabela");
  corpoTabela.innerHTML = "";

  dadosAtuais.forEach(function (d, index) {
    const linha = document.createElement("tr");

    const n1 = d.tri1;
    const n2 = d.tri2;
    const n3 = d.tri3;
    const f1 = d.faltas1 !== undefined ? d.faltas1 : 0;
    const f2 = d.faltas2 !== undefined ? d.faltas2 : 0;
    const f3 = d.faltas3 !== undefined ? d.faltas3 : 0;

    const media = calcularMedia([n1, n2, n3]);
    const totalFaltas = Number(f1) + Number(f2) + Number(f3);
    const situacao = definirSituacao(media);

    if (modoEdicao) {
      const tdNome = document.createElement("td");
      tdNome.textContent = d.disciplina;

      const tdTri1 = document.createElement("td");
      tdTri1.innerHTML = '<input type="text" class="input-edicao" data-index="' + index + '" data-campo="tri1" value="' + (n1 === null || n1 === undefined ? "" : n1.toString().replace(".", ",")) + '">';

      const tdTri2 = document.createElement("td");
      tdTri2.innerHTML = '<input type="text" class="input-edicao" data-index="' + index + '" data-campo="tri2" value="' + (n2 === null || n2 === undefined ? "" : n2.toString().replace(".", ",")) + '">';

      const tdTri3 = document.createElement("td");
      tdTri3.innerHTML = '<input type="text" class="input-edicao" data-index="' + index + '" data-campo="tri3" value="' + (n3 === null || n3 === undefined ? "" : n3.toString().replace(".", ",")) + '">';

      const tdMedia = document.createElement("td");
      tdMedia.textContent = media === null ? "—" : formatarNota(media);

      const tdFaltas = document.createElement("td");
      tdFaltas.innerHTML = 
        '<input type="text" class="input-edicao" title="Faltas Tri 1" data-index="' + index + '" data-campo="faltas1" value="' + f1 + '"> ' +
        '<input type="text" class="input-edicao" title="Faltas Tri 2" data-index="' + index + '" data-campo="faltas2" value="' + f2 + '"> ' +
        '<input type="text" class="input-edicao" title="Faltas Tri 3" data-index="' + index + '" data-campo="faltas3" value="' + f3 + '">';

      const tdSituacao = document.createElement("td");
      tdSituacao.innerHTML = "<span class='etiqueta " + situacao.classe + "'>" + situacao.texto + "</span>";

      linha.appendChild(tdNome);
      linha.appendChild(tdTri1);
      linha.appendChild(tdTri2);
      linha.appendChild(tdTri3);
      linha.appendChild(tdMedia);
      linha.appendChild(tdFaltas);
      linha.appendChild(tdSituacao);
    } else {
      const tdNome = document.createElement("td");
      tdNome.textContent = d.disciplina;

      const tdTri1 = document.createElement("td");
      tdTri1.textContent = formatarNota(n1);

      const tdTri2 = document.createElement("td");
      tdTri2.textContent = formatarNota(n2);

      const tdTri3 = document.createElement("td");
      tdTri3.textContent = formatarNota(n3);

      const tdMedia = document.createElement("td");
      tdMedia.textContent = media === null ? "—" : formatarNota(media);

      const tdFaltas = document.createElement("td");
      tdFaltas.textContent = totalFaltas;

      const tdSituacao = document.createElement("td");
      tdSituacao.innerHTML = "<span class='etiqueta " + situacao.classe + "'>" + situacao.texto + "</span>";

      linha.appendChild(tdNome);
      linha.appendChild(tdTri1);
      linha.appendChild(tdTri2);
      linha.appendChild(tdTri3);
      linha.appendChild(tdMedia);
      linha.appendChild(tdFaltas);
      linha.appendChild(tdSituacao);
    }

    corpoTabela.appendChild(linha);
  });
}

function renderizarCards() {
  let somaMedias = 0;
  let qtdMedias = 0;
  let totalFaltasGeral = 0;
  let bons = 0;
  let atencao = 0;

  dadosAtuais.forEach(function (d) {
    const n1 = d.tri1;
    const n2 = d.tri2;
    const n3 = d.tri3;
    const f1 = d.faltas1 !== undefined ? d.faltas1 : 0;
    const f2 = d.faltas2 !== undefined ? d.faltas2 : 0;
    const f3 = d.faltas3 !== undefined ? d.faltas3 : 0;

    const media = calcularMedia([n1, n2, n3]);
    const totalFaltas = Number(f1) + Number(f2) + Number(f3);
    const situacao = definirSituacao(media);

    if (media !== null) {
      somaMedias += media;
      qtdMedias++;
    }
    totalFaltasGeral += totalFaltas;

    if (situacao.classe === "bom") bons++;
    if (situacao.classe === "atencao") atencao++;
  });

  const mediaGeral = qtdMedias > 0 ? somaMedias / qtdMedias : null;
  const areaCards = document.getElementById("cards");
  areaCards.innerHTML = "";

  const listaCards = [
    { titulo: "Média geral", valor: mediaGeral === null ? "—" : formatarNota(mediaGeral) },
    { titulo: "Total de faltas", valor: totalFaltasGeral },
    { titulo: "Bom desempenho", valor: bons + " disciplinas" },
    { titulo: "Precisam de atenção", valor: atencao + " disciplinas" },
    { titulo: "Frequência", valor: FREQUENCIA_DEMONSTRATIVA + "% — Frequência adequada" }
  ];

  listaCards.forEach(function (c) {
    const card = document.createElement("div");
    card.className = "card";

    const h3 = document.createElement("h3");
    h3.textContent = c.titulo;

    const p = document.createElement("p");
    p.textContent = c.valor;

    card.appendChild(h3);
    card.appendChild(p);
    areaCards.appendChild(card);
  });
}

function atualizarTela() {
  renderizarTabela();
  renderizarCards();
}

// ============================================================
// CONEXÃO COM A API
// ============================================================
document.getElementById("btnEntrar").addEventListener("click", function () {
  const campoPin = document.getElementById("campoPin");
  const msgLogin = document.getElementById("mensagemLogin");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Por favor, digite o PIN.";
    return;
  }

  msgLogin.className = "mensagem-status";
  msgLogin.textContent = "Conectando...";

  fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinDigitado
    })
  })
    .then(function (resposta) {
      if (resposta.status === 401) {
        throw new Error("Turma, chamada ou PIN inválidos.");
      }
      if (resposta.status === 429) {
        throw new Error("Muitas tentativas. Aguarde um minuto e tente novamente.");
      }
      if (!resposta.ok) {
        throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
      }
      return resposta.json();
    })
    .then(function (dadosRetornados) {
      pinSessao = pinDigitado;
      campoPin.value = "";

      if (dadosRetornados.dados && Array.isArray(dadosRetornados.dados.disciplinas) && dadosRetornados.dados.disciplinas.length > 0) {
        dadosAtuais = dadosRetornados.dados.disciplinas.map(function (d) {
          return {
            disciplina: d.disciplina,
            tri1: d.tri1 !== undefined ? d.tri1 : null,
            tri2: d.tri2 !== undefined ? d.tri2 : null,
            tri3: d.tri3 !== undefined ? d.tri3 : null,
            faltas1: d.faltas1 !== undefined ? d.faltas1 : 0,
            faltas2: d.faltas2 !== undefined ? d.faltas2 : 0,
            faltas3: d.faltas3 !== undefined ? d.faltas3 : 0
          };
        });
      } else {
        dadosAtuais = obterDadosPadrao();
      }

      document.getElementById("areaLogin").classList.add("escondido");
      document.getElementById("conteudoBoletim").classList.remove("escondido");
      atualizarTela();
    })
    .catch(function (erro) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = erro.message || "Não foi possível conectar ao servidor. Tente novamente.";
    });
});

// ============================================================
// EDIÇÃO E VALIDAÇÃO DOS CAMPOS
// ============================================================
document.getElementById("btnAlternarEdicao").addEventListener("click", function () {
  modoEdicao = !modoEdicao;
  const btnSalvar = document.getElementById("btnSalvar");
  const msgStatus = document.getElementById("mensagemStatus");

  msgStatus.textContent = "";

  if (modoEdicao) {
    this.textContent = "Cancelar edição";
    btnSalvar.classList.remove("escondido");
  } else {
    this.textContent = "Alterar dados";
    btnSalvar.classList.add("escondido");
  }

  atualizarTela();
});

function validarNotaInput(valorTexto) {
  const texto = valorTexto.trim();
  if (texto === "") return { valido: true, valor: null };

  const textoPonto = texto.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(textoPonto)) {
    return { valido: false };
  }

  const num = parseFloat(textoPonto);
  if (num >= 0 && num <= 10) {
    return { valido: true, valor: num };
  }

  return { valido: false };
}

function validarFaltaInput(valorTexto) {
  const texto = valorTexto.trim();
  if (texto === "") return { valido: false };

  if (!/^\d+$/.test(texto)) {
    return { valido: false };
  }

  const num = parseInt(texto, 10);
  if (num >= 0) {
    return { valido: true, valor: num };
  }

  return { valido: false };
}

// ============================================================
// SALVAMENTO DOS DADOS NA API
// ============================================================
document.getElementById("btnSalvar").addEventListener("click", function () {
  const msgStatus = document.getElementById("mensagemStatus");
  msgStatus.className = "mensagem-status";
  msgStatus.textContent = "Salvando...";

  const inputs = document.querySelectorAll(".boletim input.input-edicao");
  let existemErros = false;

  inputs.forEach(function (inp) {
    inp.classList.remove("campo-invalido");
  });

  const novosDados = JSON.parse(JSON.stringify(dadosAtuais));

  inputs.forEach(function (input) {
    const idx = parseInt(input.getAttribute("data-index"), 10);
    const campo = input.getAttribute("data-campo");
    const valorTexto = input.value;

    if (campo.startsWith("tri")) {
      const res = validarNotaInput(valorTexto);
      if (!res.valido) {
        input.classList.add("campo-invalido");
        existemErros = true;
      } else {
        novosDados[idx][campo] = res.valor;
      }
    } else if (campo.startsWith("faltas")) {
      const res = validarFaltaInput(valorTexto);
      if (!res.valido) {
        input.classList.add("campo-invalido");
        existemErros = true;
      } else {
        novosDados[idx][campo] = res.valor;
      }
    }
  });

  if (existemErros) {
    msgStatus.className = "mensagem-status erro";
    msgStatus.textContent = "Verifique os campos destacados em vermelho.";
    return;
  }

  fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinSessao,
      dados: {
        disciplinas: novosDados
      }
    })
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Erro ao salvar alterações no servidor.");
      }
      return resposta.json();
    })
    .then(function () {
      dadosAtuais = novosDados;
      modoEdicao = false;
      document.getElementById("btnAlternarEdicao").textContent = "Alterar dados";
      document.getElementById("btnSalvar").classList.add("escondido");
      msgStatus.className = "mensagem-status sucesso";
      msgStatus.textContent = "Dados salvos com sucesso.";
      atualizarTela();
    })
    .catch(function (erro) {
      msgStatus.className = "mensagem-status erro";
      msgStatus.textContent = erro.message || "Erro ao salvar alterações.";
    });
});
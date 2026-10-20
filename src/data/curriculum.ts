export type Lesson = { id: string; title: string; body: string; concepts: string[]; exercise: string; options?: { text: string; correct: boolean; why: string }[] };
export type Track = { id: string; title: string; latin: string; prereq?: string; summary: string; lessons: Lesson[] };

export const TRACKS: Track[] = [
  {
    id: "logica", title: "Lógica", latin: "Logica", summary: "Termos, proposições e silogismos: o instrumento de todo saber.",
    lessons: [
      { id: "log-1", title: "Termo, proposição e argumento", concepts: ["Simples apreensão", "Juízo", "Raciocínio"],
        body: "A tradição aristotélica distingue três operações do intelecto. A simples apreensão capta o que algo é, expresso no termo. O juízo une ou separa conceitos, afirmando ou negando, e se expressa na proposição, que pode ser verdadeira ou falsa. O raciocínio passa de juízos conhecidos a um juízo novo, e se expressa no argumento. Um argumento pode ter premissas verdadeiras e ainda assim ser inválido; validade diz respeito à forma, verdade diz respeito ao conteúdo.",
        exercise: "Considere: 'Todo homem é mortal; Sócrates é mortal; logo Sócrates é homem.' O argumento é válido?",
        options: [
          { text: "Sim, pois todas as proposições são verdadeiras.", correct: false, why: "Verdade das partes não garante validade da forma." },
          { text: "Não: o termo médio 'mortal' não é distribuído.", correct: true, why: "Exato. É a falácia do termo médio não distribuído; um cão também é mortal." },
        ] },
      { id: "log-2", title: "O silogismo categórico", concepts: ["Termo maior, menor e médio", "Figuras", "Barbara"],
        body: "O silogismo possui três termos e três proposições. O termo médio aparece nas duas premissas e liga o termo maior ao menor. Na forma Barbara: todo M é P; todo S é M; logo todo S é P. Antes de aceitar uma conclusão, o estudante deve perguntar: as premissas são verdadeiras? A forma é válida? Os termos são usados no mesmo sentido?",
        exercise: "Construa um silogismo em Barbara sobre a virtude e identifique o termo médio." },
    ],
  },
  {
    id: "platao", title: "Platão", latin: "Plato", prereq: "logica", summary: "As Formas, a alma e o diálogo socrático, lidos nos próprios termos de Platão.",
    lessons: [
      { id: "pla-1", title: "Opinião e conhecimento", concepts: ["Doxa", "Episteme", "Linha dividida"],
        body: "Na República, Platão distingue a opinião, que versa sobre o sensível e mutável, do conhecimento, que versa sobre o inteligível e imutável. As Formas são, para Platão, realidades separadas, das quais as coisas sensíveis participam. Leia Platão primeiro como Platão: a separação das Formas é tese dele, não uma metáfora. Só depois compare: São Tomás, seguindo Aristóteles, não admite Formas subsistentes separadas das coisas materiais, mas situa as razões exemplares no intelecto divino.",
        exercise: "Formule com suas palavras por que Platão julga que o sensível não pode ser objeto de ciência. Depois, escreva uma objeção aristotélica." },
    ],
  },
  {
    id: "aristoteles", title: "Aristóteles", latin: "Aristoteles", prereq: "logica", summary: "Substância, causas, ato e potência: a filosofia da natureza e do ser.",
    lessons: [
      { id: "ari-1", title: "As quatro causas", concepts: ["Material", "Formal", "Eficiente", "Final"],
        body: "Na Física e na Metafísica, Aristóteles afirma que conhecer é conhecer pelas causas. A causa material é aquilo de que algo é feito; a formal, o que algo é; a eficiente, o que o produz; a final, aquilo para o qual existe. A causa final não exige consciência: a natureza age em vista de um fim. Note a diferença em relação a Platão: a forma está na coisa, não separada dela.",
        exercise: "Aplique as quatro causas a uma árvore. Qual delas parece mais difícil de defender diante de um interlocutor moderno, e por quê?" },
    ],
  },
  {
    id: "metafisica", title: "Metafísica", latin: "Metaphysica", prereq: "aristoteles", summary: "Ente, essência e existência; ato e potência.",
    lessons: [
      { id: "met-1", title: "Ato e potência", concepts: ["Mudança", "Ato", "Potência"],
        body: "Parmênides negava a mudança: o ser não pode vir do não-ser. Aristóteles responde distinguindo o ser em ato do ser em potência: a semente é árvore em potência. A mudança é a passagem da potência ao ato, que exige algo já em ato. São Tomás desenvolverá a distinção real entre essência e ato de ser (esse) nas criaturas, tese que vai além do texto aristotélico.",
        exercise: "Reconstrua o argumento de Parmênides em forma silogística e mostre em qual premissa Aristóteles introduz uma distinção." },
    ],
  },
  {
    id: "patristica", title: "Patrística", latin: "Patres", summary: "Agostinho, Atanásio e João Damasceno: fé que busca inteligência.",
    lessons: [
      { id: "pat-1", title: "Agostinho: crede ut intelligas", concepts: ["Iluminação", "Fé e razão", "Interioridade"],
        body: "Agostinho ensina que a fé precede e prepara a compreensão, sem dispensá-la. Contra os céticos acadêmicos, mostra que quem duvida sabe que duvida, e portanto existe. Atanásio, em Sobre a Encarnação do Verbo, defende a divindade do Filho contra o arianismo. João Damasceno, na Exposição da Fé Ortodoxa, sistematiza a tradição grega e será muito citado por São Tomás.",
        exercise: "Explique o argumento 'si fallor, sum' e compare-o, com cautela histórica, ao cogito de Descartes." },
    ],
  },
  {
    id: "tomista", title: "Introdução Tomista", latin: "Introductio ad Thomam", prereq: "metafisica", summary: "O método da questão disputada e as grandes teses de São Tomás.",
    lessons: [
      { id: "tom-1", title: "Como ler um artigo da Suma", concepts: ["Videtur quod", "Sed contra", "Respondeo", "Ad primum"],
        body: "Cada artigo da Suma começa com uma pergunta e apresenta objeções que parecem provar o contrário da posição do autor. Segue-se o 'sed contra', normalmente uma autoridade. No 'respondeo', São Tomás expõe sua solução, com distinções. Por fim, responde a cada objeção. O método exige levar a sério a posição adversária: quem não sabe formular a melhor objeção ainda não compreendeu a questão.",
        exercise: "Escolha uma tese em que você acredita e escreva a objeção mais forte possível contra ela." },
    ],
  },
];

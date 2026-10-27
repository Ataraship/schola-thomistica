import type { Activity, LanguageCourse } from "@/lib/activities";

const provenance =
  "Exercício e texto autorais para esta demonstração; não reproduzem os anexos privados nem certificam um curso completo.";
export const ACTIVITIES: readonly Activity[] = [
  {
    id: "la-pax",
    revision: 1,
    course: "la",
    kind: "multiple-choice",
    title: "Vocabulário: pax",
    prompt: "No vocabulário latino introdutório, qual é o sentido de pax?",
    provenance,
    correctId: "peace",
    options: [
      {
        id: "book",
        label: "Livro",
        explanation:
          "Livro corresponde a liber neste uso. Pax significa paz. Releia e tente novamente sem confundir as duas palavras.",
      },
      {
        id: "peace",
        label: "Paz",
        explanation:
          "Pax significa paz; seu genitivo é pacis. É uma palavra da terceira declinação, não da primeira.",
      },
      {
        id: "voice",
        label: "Voz",
        explanation:
          "Voz corresponde a vox. Pax significa paz. A semelhança de extensão não basta para identificar o significado.",
      },
    ],
  },
  {
    id: "la-rosa",
    revision: 1,
    course: "la",
    kind: "gap-fill",
    title: "Casos: rosa e rosae",
    prompt:
      "Complete as formas do substantivo rosa, rosae, no singular. O caso expressa uma função; não é apenas uma troca de terminação.",
    provenance,
    gaps: [
      {
        id: "nominative",
        label: "Nominativo singular (a rosa)",
        accepted: ["rosa"],
        explanation: "O nominativo singular é rosa, usado, por exemplo, para o sujeito.",
      },
      {
        id: "genitive",
        label: "Genitivo singular (da rosa)",
        accepted: ["rosae"],
        explanation:
          "O genitivo singular é rosae. A forma rosae também tem outros usos; aqui o enunciado especifica caso e número.",
      },
    ],
  },
  {
    id: "de-lernen",
    revision: 1,
    course: "de",
    kind: "grammar",
    title: "Gramática: ich lerne",
    prompt:
      "Complete: Ich ___ Deutsch. (Eu estudo/aprendo alemão.) Use lernen no presente com ich.",
    provenance,
    gaps: [
      {
        id: "verb",
        label: "Forma de lernen com ich",
        accepted: ["lerne"],
        explanation:
          "Com ich, a forma regular é lerne: radical lern- e terminação -e. Ich lerne Deutsch. A forma lernt corresponde, entre outros usos, a er/sie/es.",
      },
    ],
  },
  {
    id: "de-concepts",
    revision: 1,
    course: "de",
    kind: "matching",
    title: "Associe palavras e sentidos",
    prompt:
      "Relacione os termos neste contexto introdutório. Equivalências de vocabulário não dispensam examinar o sentido de uma frase.",
    provenance,
    pairs: [
      { id: "buch", label: "das Buch", target: "book" },
      { id: "wahrheit", label: "die Wahrheit", target: "truth" },
    ],
    targets: [
      { id: "truth", label: "a verdade" },
      { id: "book", label: "o livro" },
    ],
  },
  {
    id: "en-reading",
    revision: 1,
    course: "en",
    kind: "reading",
    title: "Leitura: examinar uma razão",
    prompt:
      "The student reads a claim. She asks for reasons before accepting it. A familiar sentence is not necessarily true.\nExplique em português: o que a estudante pede e por que familiaridade não garante verdade?",
    provenance,
    fields: [
      {
        id: "interpretation",
        label: "Sua interpretação",
        hint: "Distinga o que está escrito de uma hipótese sua sobre a estudante.",
      },
    ],
    criteria: [
      "Identifiquei o pedido de razões antes da aceitação.",
      "Expliquei a diferença entre familiaridade e verdade sem acrescentar fatos ao texto.",
    ],
    guide:
      "O texto descreve uma atitude de exame: pedir razões. Não afirma que toda frase familiar seja falsa nem que o testemunho deva sempre ser rejeitado. Compare essa orientação com o que escreveu; não há nota automática para sua interpretação.",
  },
  {
    id: "en-error",
    revision: 1,
    course: "en",
    kind: "error-identification",
    title: "Identifique um erro de concordância",
    prompt:
      "A frase pretende descrever um hábito no presente: He read every day. Qual revisão corresponde a esse sentido?",
    provenance,
    correctId: "reads",
    options: [
      {
        id: "reads",
        label: "He reads every day.",
        explanation:
          "No presente simples, a terceira pessoa do singular recebe -s: he reads. Read também pode ser passado, mas o enunciado exige um hábito no presente.",
      },
      {
        id: "reading",
        label: "He reading every day.",
        explanation:
          "Reading sozinho não funciona aqui como verbo finito. Para o hábito solicitado, use he reads; uma construção progressiva exigiria auxiliar e outro recorte de sentido.",
      },
      {
        id: "keep",
        label: "Manter a frase como hábito no presente.",
        explanation:
          "Para he no presente simples, a forma é reads. A grafia read pode expressar passado, mas não atende ao sentido explicitamente solicitado.",
      },
    ],
  },
  {
    id: "phi-argument",
    revision: 1,
    course: "philosophy",
    kind: "argument",
    title: "Análise: validade, verdade e contraexemplo",
    prompt:
      "Examine A: Todo livro é feito de metal; todo missal é livro; logo, todo missal é feito de metal. Compare B: Toda pessoa humana é mortal; Sócrates é mortal; logo, Sócrates é uma pessoa humana. Reconstrua as razões antes de julgar. Os exemplos são didáticos, não demonstrações históricas atribuídas a um autor.",
    provenance,
    fields: [
      { id: "thesis", label: "Tese e conclusão de cada argumento" },
      { id: "premises", label: "Premissas e verdade das afirmações" },
      {
        id: "inference",
        label: "Validade da passagem às conclusões",
        hint: "Concedidas as premissas, a conclusão poderia ser falsa?",
      },
      {
        id: "counterexample",
        label: "Contraexemplo à forma de B e argumento próprio",
        hint: "Troque o nome Sócrates por um ser mortal que não seja humano, para testar a forma. Depois construa uma inferência válida com premissas justificadas.",
      },
    ],
    criteria: [
      "Separei validade e verdade.",
      "Expliquei por que A tem forma válida, mas uma premissa falsa.",
      "Testei a forma de B com um contraexemplo, sem concluir que Sócrates não era humano.",
      "Explicitei as premissas e os limites do argumento que construí.",
    ],
    guide:
      "A segue a forma Barbara: sua primeira premissa falsa impede a solidez, sem destruir a validade formal. B não é válido em virtude da forma apresentada: ser mortal não distingue humanos de outros mortais. Um contraexemplo à forma não torna falsa a conclusão sobre Sócrates. Registre onde seu argumento próprio ainda exige prova. Estes critérios orientam revisão, não um julgamento algorítmico do seu raciocínio.",
  },
  {
    id: "phi-objection",
    revision: 1,
    course: "philosophy",
    kind: "objection",
    title: "A melhor objeção e sua resposta",
    prompt:
      "Tese proposta para exame: a fragilidade de um manuscrito basta, por si só, para proibir toda consulta. Construa uma objeção que atinja o alcance universal ou uma razão da tese, sem atacar quem a defende.",
    provenance,
    fields: [
      { id: "objection", label: "Objeção forte ou contraexemplo pertinente" },
      { id: "reply", label: "Resposta: conceder, negar ou distinguir com razões" },
      { id: "limits", label: "O que a resposta permite concluir e o que permanece aberto" },
    ],
    criteria: [
      "Minha objeção atinge uma premissa ou inferência identificável.",
      "Respondi à dificuldade real, sem trocar a tese por um espantalho.",
      "Não confundi uma defesa falha com a falsidade automática de toda tese.",
    ],
    guide:
      "Uma consulta supervisionada compatível com a conservação, se comprovada, refutaria a proibição universal; não autorizaria toda consulta. Uma resposta pode distinguir riscos e condições, mas precisa justificar a distinção. Os fatos de uma biblioteca real exigem investigação. Dar nome a uma falácia não substitui explicar seu mecanismo.",
  },
  {
    id: "phi-revision",
    revision: 1,
    course: "philosophy",
    kind: "revision",
    sourceActivityId: "phi-argument",
    title: "Revisar sem apagar a versão anterior",
    prompt:
      "Registre primeiro uma versão da análise argumentativa. Retome-a, considere uma objeção e explicite o que mudou. A versão de partida ficará vinculada ao registro desta revisão.",
    provenance,
    fields: [
      { id: "revised", label: "Juízo revisto com razões" },
      {
        id: "change",
        label: "Qual objeção motivou a revisão?",
        hint: "Se manteve a tese, explique que razão adicional responde à dificuldade.",
      },
    ],
    criteria: [
      "Comparei minha nova formulação com a versão de partida.",
      "Justifiquei a alteração ou manutenção da tese.",
      "Reconheci uma dúvida ou limite que ainda preciso investigar.",
    ],
    guide:
      "Revisar pode significar limitar o alcance de uma afirmação, corrigir uma inferência ou defender melhor uma premissa. Não é necessário trocar de opinião para demonstrar que levou a objeção a sério. Nenhum texto anterior será substituído pelo registro da revisão.",
  },
  {
    id: "phi-assessment",
    revision: 1,
    course: "philosophy",
    kind: "self-assessment",
    title: "Autoavaliação fundamentada",
    prompt:
      "Escolha uma atividade que realizou. Indique uma passagem sua que satisfaz um critério e outra que ainda precisa de trabalho. Uma lista assinalada não comprova domínio filosófico.",
    provenance,
    fields: [
      { id: "evidence", label: "Critério e evidência no meu texto" },
      { id: "next", label: "Dificuldade reconhecida e próximo passo de investigação" },
    ],
    criteria: [
      "Citei uma razão concreta do meu registro.",
      "Propus um próximo passo verificável, além de reler ou clicar novamente.",
    ],
    guide:
      "Aponte a premissa, inferência, objeção ou revisão que sustenta sua autoavaliação. O sistema conserva o que você declara; não certifica a verdade da conclusão nem mede domínio por cliques.",
  },
];

export const LANGUAGE_COURSES: readonly LanguageCourse[] = [
  {
    id: "la",
    title: "Latim",
    levels: [
      {
        id: "intro",
        title: "Introdução demonstrativa",
        units: [
          {
            id: "la-forms",
            title: "Palavras e casos",
            lessons: [
              {
                id: "methodus-la-forms",
                title: "Vocabulário e primeira declinação",
                vocabulary: [
                  { term: "pax, pacis", meaning: "paz (terceira declinação)" },
                  { term: "rosa, rosae", meaning: "rosa (primeira declinação)" },
                ],
                grammar:
                  "Rosa é nominativo singular; rosae é genitivo singular no recorte proposto. Casos e números precisam ser especificados.",
                reading: "Rosa pulchra est. A rosa é bela. Frase autoral introdutória.",
                activityIds: ["la-pax", "la-rosa"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "de",
    title: "Alemão",
    levels: [
      {
        id: "intro",
        title: "Introdução demonstrativa",
        units: [
          {
            id: "de-study",
            title: "Falar do estudo",
            lessons: [
              {
                id: "methodus-de-study",
                title: "Verbo e vocabulário",
                vocabulary: [
                  { term: "das Buch", meaning: "o livro" },
                  { term: "die Wahrheit", meaning: "a verdade" },
                ],
                grammar:
                  "No presente regular, ich combina aqui com lerne. Não se generaliza esta regra para todos os verbos sem estudar suas formas.",
                reading: "Ich lerne Deutsch. Das ist ein Buch. Texto autoral.",
                activityIds: ["de-lernen", "de-concepts"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "en",
    title: "Inglês",
    levels: [
      {
        id: "intro",
        title: "Introdução demonstrativa",
        units: [
          {
            id: "en-reasons",
            title: "Ler e pedir razões",
            lessons: [
              {
                id: "methodus-en-reasons",
                title: "Leitura e presente simples",
                vocabulary: [
                  { term: "claim", meaning: "afirmação, no contexto da leitura" },
                  { term: "reason", meaning: "razão" },
                ],
                grammar:
                  "No presente simples, he reads: terceira pessoa singular. Read também pode ser passado; o contexto decide o sentido.",
                reading: "The student asks for reasons. Frase autoral para leitura.",
                activityIds: ["en-reading", "en-error"],
              },
            ],
          },
        ],
      },
    ],
  },
];

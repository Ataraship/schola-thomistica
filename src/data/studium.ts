export const IMAGES_STUDIUM_ID = "studium-imagens";
export type StudiumStageId = "lectio" | "quaestio" | "argumentatio" | "disputatio" | "iudicium";
export type StudiumStage = {
  id: StudiumStageId;
  title: string;
  purpose: string;
  prompt: string;
  questions: string[];
};

/** Original teaching material. No quotation or passage from the modern PDF is reproduced. */
export const IMAGES_STUDIUM = {
  id: IMAGES_STUDIUM_ID,
  title: "Veneração de imagens e adoração",
  question: "Pode a veneração de imagens sagradas distinguir-se da adoração?",
  source: {
    referenceId: "REF-2026-03",
    author: "São João Damasceno",
    work: "Apologia contra os que condenam as imagens sagradas",
    edition:
      "Tradução/edição de Rafael Rodrigues; crédito conferido na folha editorial do anexo privado.",
    availability:
      "Referência bibliográfica catalogada; o texto integral não está integrado ao aplicativo.",
    verification:
      "Verificação parcial do anexo de 77 páginas: folha de rosto, crédito editorial e introdução. Não houve leitura integral ou revisão da tradução; nenhuma passagem não conferida é apresentada como citação.",
    rights:
      "Esta atividade contém explicações e exercícios autorais. Não reproduz a tradução moderna nem disponibiliza seu PDF.",
  },
  exposition: [
    "João Damasceno, autor cristão do século VIII, defendeu o uso de imagens sagradas no contexto das controvérsias sobre seu lugar no culto. Sua posição deve ser compreendida no horizonte da Encarnação e da tradição eclesial, antes de ser avaliada por um interlocutor que talvez não compartilhe essas premissas.",
    "Na defesa das imagens, o Verbo ter assumido uma humanidade visível é decisivo para pensar a representação de Cristo. Representar sua humanidade não significa reduzir a natureza divina a uma figura nem afirmar que a matéria de uma imagem seja Deus. É preciso distinguir a pessoa representada, o suporte material e a ação de quem se aproxima da imagem.",
    "A tradição católica distingue a adoração devida somente a Deus da honra prestada aos santos e às suas imagens. No segundo caso, a imagem é considerada em referência à pessoa representada: madeira, tinta ou pedra não recebem o estatuto de divindade. Essa distinção conceitual não torna qualquer gesto automaticamente adequado; a intenção, o sentido público da prática e o risco de superstição também exigem exame.",
    "Dois termos gregos ajudam a formular a questão, mas não dispensam o contexto. Latreia designa aqui o culto devido a Deus. Proskynesis pode nomear gestos de reverência ou prostração em diferentes usos e não equivale, em toda ocorrência, apenas à veneração de imagens. O objeto e o sentido do gesto importam para interpretá-lo.",
    "Uma objeção séria pergunta se, apesar da distinção, uma prática concreta pode tratar a imagem como portadora de poder autônomo ou confundir os fiéis. A resposta precisa enfrentar essa possibilidade e mostrar que condições distinguem a veneração legítima de um uso idolátrico. Repetir a terminologia, sem examinar o caso, não resolve a dificuldade.",
  ],
  terms: [
    {
      term: "Latreia",
      description: "Culto de adoração devido somente a Deus no contexto desta discussão.",
    },
    {
      term: "Proskynesis",
      description:
        "Reverência ou prostração; o uso do termo depende do destinatário e do contexto, sem equivalência automática com um único tipo de culto.",
    },
    {
      term: "Imagem e pessoa representada",
      description:
        "Distinguir o suporte material da referência à pessoa permite formular a tese; ainda é necessário justificar como essa distinção orienta uma prática concreta.",
    },
    {
      term: "Encarnação",
      description:
        "Premissa teológica central na defesa da representação de Cristo. Identificá-la não a transforma em premissa filosófica aceita por todo interlocutor.",
    },
  ],
  stages: [
    {
      id: "lectio",
      title: "Lectio · compreender antes de julgar",
      purpose: "Reconstruir com fidelidade a posição apresentada, separando relato e avaliação.",
      prompt:
        "A partir da exposição autoral acima, explique a defesa das imagens nos próprios termos do autor. Distinga o que o texto apresenta daquilo que você pensa a respeito. Registre o que precisaria conferir na fonte primária.",
      questions: [
        "Qual é a função da Encarnação nesse argumento?",
        "Que confusão entre matéria, imagem e pessoa representada a posição procura evitar?",
        "Que afirmação desta exposição ainda exige conferência direta na Apologia?",
      ],
    },
    {
      id: "quaestio",
      title: "Quaestio · delimitar a pergunta",
      purpose: "Definir os termos e tornar explícito o ponto de divergência.",
      prompt:
        "Formule a questão em uma frase e defina adoração, veneração e imagem no sentido em que os empregará. Diga se sua pergunta trata da possibilidade de uma distinção conceitual ou da adequação de uma prática particular.",
      questions: [
        "Um mesmo gesto exterior pode ter sentidos diferentes? Por quê?",
        "Seu interlocutor aceita suas definições?",
        "O uso de proskynesis foi interpretado pelo contexto ou apenas por uma tradução isolada?",
      ],
    },
    {
      id: "argumentatio",
      title: "Argumentatio · explicitar as razões",
      purpose:
        "Examinar premissas e inferência sem confundir doutrina recebida com demonstração compartilhada.",
      prompt:
        "Construa um argumento numerado: P1, P2 e conclusão. Identifique a origem de cada premissa: teológica, histórica, conceitual ou referente a uma prática observada. Explique por que a conclusão decorre das premissas e o que mudaria se uma delas fosse rejeitada.",
      questions: [
        "Você defende a possibilidade da distinção ou sua realização em todo caso?",
        "Alguma premissa depende de uma crença que o interlocutor não compartilha?",
        "É possível admitir as premissas e negar a conclusão sem contradição? Se for, a inferência precisa ser revista.",
      ],
    },
    {
      id: "disputatio",
      title: "Disputatio · enfrentar a melhor objeção",
      purpose: "Responder a uma dificuldade real com concessões e distinções pertinentes.",
      prompt:
        "Apresente a objeção mais forte de quem teme idolatria ou superstição. Indique qual premissa ou passagem ela atinge. Depois responda: o que você concede, o que nega e que distinção justifica a resposta? Não atribua ao interlocutor uma tese mais fraca do que a dele.",
      questions: [
        "Como lidar com uma prática em que a imagem é tratada como poder autônomo?",
        "Uma distinção conceitual basta para prevenir todo abuso?",
        "Que parte da objeção permanece sem resposta?",
      ],
    },
    {
      id: "iudicium",
      title: "Iudicium · justificar e revisar o próprio juízo",
      purpose: "Chegar a uma conclusão proporcional às razões e reconhecer seus limites.",
      prompt:
        "Registre seu juízo após o debate, suas razões e as condições em que ele vale. Diga o que mudou no seu entendimento, o que ainda ignora e qual leitura ou evidência poderia levar você a rever a conclusão.",
      questions: [
        "Você distinguiu compreender uma posição de concordar com ela?",
        "Seu juízo sobre um caso foi indevidamente estendido a toda prática?",
        "Qual próximo passo permitiria investigar uma dúvida concreta?",
      ],
    },
  ] satisfies StudiumStage[],
  criteria: [
    {
      id: "fidelidade",
      text: "Reconstruí a posição sem atribuir ao autor palavras que não conferi na fonte.",
    },
    { id: "termos", text: "Defini os termos e interpretei latreia e proskynesis pelo contexto." },
    {
      id: "premissas",
      text: "Explicitei as premissas e distingui sua origem da validade da inferência.",
    },
    { id: "objecao", text: "Formulei uma objeção forte e respondi ao ponto que ela atinge." },
    {
      id: "juizo",
      text: "Justifiquei o próprio juízo, reconheci limites e indiquei uma investigação seguinte.",
    },
  ],
};

export const studiumNoteKey = (stage: StudiumStageId) => `${IMAGES_STUDIUM_ID}:${stage}`;
export const studiumCriterionKey = (criterion: string) =>
  `${IMAGES_STUDIUM_ID}:criterion:${criterion}`;

export const IMAGES_STUDIUM_ID = "studium-imagens";
export const PRUDENCE_STUDIUM_ID = "studium-prudencia";
export type StudiumStageId = "lectio" | "quaestio" | "argumentatio" | "disputatio" | "iudicium";
export type StudiumStage = {
  id: StudiumStageId;
  title: string;
  purpose: string;
  prompt: string;
  questions: string[];
};
export type StudiumActivity = {
  id: string;
  title: string;
  question: string;
  source: {
    referenceId: string;
    author: string;
    work: string;
    edition: string;
    availability: string;
    verification: string;
    rights: string;
  };
  expositionTitle: string;
  exposition: string[];
  terms: { term: string; description: string }[];
  caseStudy?: { title: string; scenario: string; questions: string[] };
  stages: StudiumStage[];
  criteria: { id: string; text: string }[];
};

/** Original teaching material. No quotation or passage from the modern PDF is reproduced. */
export const IMAGES_STUDIUM: StudiumActivity = {
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
  expositionTitle: "Compreender a distinção antes do debate",
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

/** Original introduction and case; not a translation of the private edition. */
export const PRUDENCE_STUDIUM: StudiumActivity = {
  id: PRUDENCE_STUDIUM_ID,
  title: "Virtudes intelectuais, reta razão e prudência",
  question: "Escolher meios eficazes basta para agir prudentemente?",
  source: {
    referenceId: "REF-2026-02",
    author: "Aristóteles e São Tomás de Aquino",
    work: "Ética a Nicômaco, livro VI; comentário de Tomás, Sententia libri Ethicorum, livro VI",
    edition:
      "Consulta ao Teil 2 (Buch 6 bis 10), tradução alemã de Josef Spindelböck, que apresenta o texto de Aristóteles e, separadamente, o comentário tomista.",
    availability:
      "Exposição e exercício autorais disponíveis nesta oficina. A tradução alemã é referência bibliográfica; o PDF não está integrado.",
    verification:
      "Consulta parcial ao livro VI: Ética VI.3–7 (1139b14–1141b22), VI.12–13 (1143b18–1145a11); comentário, lições 3–4 (§§1142–1174) e 10–11 (§§1257–1291), na numeração da edição. Os cinco hábitos são apresentados em VI.3. Não houve leitura integral dos livros VI–X nem revisão da tradução.",
    rights:
      "As explicações, o caso fictício e as perguntas são originais em português. Não são citações ou traduções de passagens da edição moderna; nenhum arquivo privado é disponibilizado.",
  },
  expositionTitle: "Da competência técnica ao juízo sobre o agir",
  exposition: [
    "Comece por Aristóteles em seus próprios termos. No livro VI da Ética a Nicômaco, a pergunta pela reta razão procura esclarecer como a razão orienta uma vida boa. Dizer apenas que se deve agir conforme a razão não resolve a questão: é preciso investigar o que torna o juízo correto, sobre que objetos ele incide e como se relaciona com o desejo e a escolha.",
    "Aristóteles distingue cinco disposições intelectuais pelas quais se alcança a verdade: arte ou técnica, ciência, prudência, sabedoria e intelecto. Não são cinco graus de inteligência nem cinco disciplinas escolares. A técnica diz respeito ao produzir; a ciência, no sentido demonstrativo empregado aqui, conhece mediante princípios e demonstrações; o intelecto apreende os princípios; a sabedoria reúne intelecto e ciência acerca dos objetos mais elevados; a prudência diz respeito ao agir bem. Essa apresentação inicial não substitui o estudo de cada disposição.",
    "A distinção entre produzir e agir ajuda a entender a prudência. Na produção, podemos avaliar a qualidade de uma obra, como a legibilidade de uma cópia. Na ação, avaliamos também o que a escolha faz da vida de quem age e de sua relação com os outros. A mesma situação pode exigir competência técnica e juízo moral: uma cópia tecnicamente excelente pode ser utilizada para uma fraude. O êxito do produto, considerado isoladamente, não demonstra que seu uso seja justo.",
    "Em Aristóteles, prudência é uma disposição racional verdadeira voltada aos bens humanos e à boa deliberação sobre a vida como um todo. Não equivale a timidez ou a calcular o caminho mais eficiente para qualquer objetivo. A habilidade de encontrar meios pode servir a um fim bom ou mau; por isso, a eficácia sozinha não basta. O livro VI relaciona prudência e virtude moral: desejos desordenados podem corromper o modo como o fim aparece ao agente. Isso não significa que bastem boas intenções ou que as circunstâncias dispensem razões.",
    "Leia agora Tomás como comentador, sem apagar a diferença entre autor e intérprete. Nas lições 3–4 do livro VI, ele explicita a distinção entre a razão que dirige o fazer e a que dirige o agir, bem como a referência da prudência ao bem da vida humana inteira. Reta razão, ou recta ratio, não significa raciocínio eficaz a serviço de qualquer desejo: é preciso examinar a verdade do juízo e a bondade da ação. A oficina acompanha essa continuidade interpretativa; não atribui a Aristóteles premissas da fé cristã nem apresenta o comentário como se fosse uma passagem da Suma.",
    "Nas lições 10–11, Tomás comenta a diferença entre habilidade e prudência e a ligação entre prudência e virtude moral. Isso permite uma pergunta crítica compartilhada: como justificar que um fim é bom, em vez de tomar o desejo do agente como prova? A resposta precisa apresentar razões examináveis sobre o fim, os meios e a situação. Invocar a autoridade de um autor não substitui a reconstrução do argumento.",
    "No exercício, distinga a informação disponível no momento da decisão do resultado conhecido depois. Um resultado favorável pode acompanhar uma escolha injusta; um resultado adverso por circunstância imprevisível não basta, sozinho, para provar imprudência. Essa distinção é uma orientação de análise do caso, não uma garantia de que você já conhece tudo o que uma decisão prudente exige.",
  ],
  terms: [
    {
      term: "Téchne · arte ou técnica",
      description:
        "Disposição racional relativa ao produzir. Arte tem aqui um alcance mais amplo que as belas-artes: inclui saber realizar uma obra.",
    },
    {
      term: "Epistéme · ciência",
      description:
        "Conhecimento demonstrativo a partir de princípios, no uso do livro VI. Não se deve identificar sem mais esse sentido com todos os usos atuais da palavra ciência.",
    },
    {
      term: "Noûs · intelecto",
      description:
        "Apreensão dos princípios dos quais parte a demonstração; eles não são demonstrados dentro da própria cadeia demonstrativa. Isso não equivale a aceitar qualquer opinião como princípio.",
    },
    {
      term: "Sophía · sabedoria",
      description:
        "Intelecto e ciência acerca dos objetos mais elevados; não se reduz ao êxito prático ou a um conjunto de conselhos de vida.",
    },
    {
      term: "Phrónesis · prudentia · prudência",
      description:
        "Disposição intelectual prática para deliberar bem sobre os bens humanos. Exige mais que habilidade, cautela ou boa intenção isoladas.",
    },
    {
      term: "Recta ratio · reta razão",
      description:
        "Razão correta que orienta o juízo e a ação. Na comparação desta oficina, distinguir a correção do fazer da correção do agir ajuda a investigar seu sentido.",
    },
    {
      term: "Klugheit · Vernunft · Tugend",
      description:
        "Na edição alemã consultada: prudência, razão e virtude, respectivamente. São equivalências contextuais de leitura, não traduções únicas para toda ocorrência dessas palavras.",
    },
  ],
  caseStudy: {
    title: "O catálogo e a carta de autoria incerta",
    scenario:
      "Caso fictício: uma biblioteca precisa de recursos urgentes para conservar manuscritos. Seu responsável sabe produzir cópias digitais fiéis. Uma carta está catalogada como de autoria incerta: há indícios de atribuição a um mestre célebre, mas nenhum exame conclusivo. Um benfeitor oferece financiar a conservação se o catálogo a anunciar como obra certamente autêntica desse mestre. O responsável considera aceitar para salvar o acervo. Também pode manter a incerteza explícita, procurar outros recursos ou adiar a divulgação para investigar; não sabe se essas alternativas chegarão a tempo. Considere apenas esses dados. A competência para copiar, a autoria da carta, a honestidade do anúncio e a escolha de financiamento são questões diferentes.",
    questions: [
      "O que é fato do caso, o que é incerteza e o que você precisaria investigar antes de decidir?",
      "Qual bem se procura e que razões sustentam ou limitam os meios propostos? Compare ao menos duas alternativas.",
      "Se a conservação for bem-sucedida após uma atribuição enganosa, esse resultado basta para justificar a escolha? E se uma decisão honesta fracassar por algo imprevisível?",
    ],
  },
  stages: [
    {
      id: "lectio",
      title: "Lectio · distinguir as vozes e os conceitos",
      purpose: "Compreender Aristóteles antes de comparar a interpretação de Tomás.",
      prompt:
        "Reconstrua com suas palavras a distinção aristotélica entre produzir, agir e encontrar meios eficazes. Depois explique o que o comentário de Tomás explicita. Separe exposição do autor, interpretação do comentador e avaliação sua; indique o localizador que consultaria para conferir uma afirmação.",
      questions: [
        "Qual das cinco disposições se refere ao produzir e qual ao agir bem?",
        "Por que habilidade e prudência não são equivalentes?",
        "Sua comparação identifica uma continuidade efetiva ou inventa uma divergência entre os autores?",
      ],
    },
    {
      id: "quaestio",
      title: "Quaestio · formular a dificuldade prática",
      purpose: "Delimitar o problema sem confundir o êxito técnico com a justificação moral.",
      prompt:
        "Formule a questão do bibliotecário em uma frase. Defina prudência, eficácia e reta razão no sentido em que os usará. Liste os fatos disponíveis e as incertezas; distinga a qualidade da cópia do juízo sobre o anúncio e o financiamento.",
      questions: [
        "Você pergunta se o meio funciona ou se deve ser escolhido?",
        "Que fim está em jogo e quem é afetado pela escolha?",
        "Qual dado ausente poderia mudar a decisão sem mudar arbitrariamente seus critérios?",
      ],
    },
    {
      id: "argumentatio",
      title: "Argumentatio · justificar fins e meios",
      purpose: "Construir um argumento examinável e comparar alternativas concretas.",
      prompt:
        "Escolha uma decisão para o caso e escreva premissas numeradas e conclusão. Distinga premissas sobre os fatos, sobre bens humanos e sobre a ligação entre meios e fins. Justifique a premissa moral mais discutível, explique a inferência e compare sua decisão com ao menos uma alternativa. Dizer que um autor concorda não substitui essa justificação.",
      questions: [
        "Se todas as premissas forem aceitas, a conclusão decorre delas? Qual é a ligação?",
        "Você presumiu como certa alguma consequência que o caso deixa incerta?",
        "Seu argumento reconhece que um meio eficaz pode ser injusto e que uma boa intenção pode escolher mal os meios?",
      ],
    },
    {
      id: "disputatio",
      title: "Disputatio · responder à urgência sem caricatura",
      purpose:
        "Enfrentar a melhor razão da posição contrária e rever uma premissa quando necessário.",
      prompt:
        "Construa a objeção mais forte à sua decisão: quem insiste em salvar o acervo pode alegar que a demora causará perdas irreversíveis; quem recusa o anúncio pode exigir que você justifique por que o bem pretendido autorizaria enganar. Desenvolva a objeção adequada à sua posição, indique a premissa atingida e responda com uma concessão, uma distinção e uma razão. Revise o argumento se a objeção mostrar uma falha.",
      questions: [
        "A objeção enfrenta seu argumento real ou uma versão mais fraca?",
        "Que custo ou risco legítimo do outro lado você reconhece?",
        "Sua resposta oferece uma alternativa justificada ou apenas repete a conclusão?",
      ],
    },
    {
      id: "iudicium",
      title: "Iudicium · decidir e reconhecer limites",
      purpose: "Formular um juízo proporcional às razões e à informação disponível.",
      prompt:
        "Registre a decisão que julga melhor e suas razões após a objeção. Diga o que mudou entre seu primeiro argumento e este juízo, o que permanece incerto e que informação o faria reconsiderar. Examine também por que um sucesso posterior ou um fracasso imprevisível, isoladamente, não encerraria a avaliação da prudência.",
      questions: [
        "Você avaliou a qualidade da escolha ou apenas seu resultado?",
        "Que ponto exige investigação das fontes e que ponto exige apurar fatos do caso?",
        "Como distinguiria uma revisão honesta de uma desculpa criada depois para salvar sua conclusão?",
      ],
    },
  ],
  criteria: [
    {
      id: "vozes",
      text: "Reconstruí Aristóteles e distingui o texto do autor, o comentário de Tomás e minha avaliação.",
    },
    {
      id: "distincoes",
      text: "Distingui prudência, competência técnica e habilidade para atingir qualquer fim.",
    },
    {
      id: "justificacao",
      text: "Justifiquei fins e meios, comparei alternativas e separei fatos, incertezas e premissas morais.",
    },
    {
      id: "objecao",
      text: "Enfrentei uma objeção forte a uma premissa identificada e reconheci um custo real da decisão.",
    },
    {
      id: "revisao",
      text: "Expliquei minha revisão e seus limites sem tomar êxito ou fracasso como prova suficiente de prudência.",
    },
  ],
};

export const STUDIUM_ACTIVITIES: StudiumActivity[] = [IMAGES_STUDIUM, PRUDENCE_STUDIUM];

// The default keeps all notes and criteria saved by the first workshop compatible.
export const studiumNoteKey = (stage: StudiumStageId, activityId = IMAGES_STUDIUM_ID) =>
  `${activityId}:${stage}`;
export const studiumCriterionKey = (criterion: string, activityId = IMAGES_STUDIUM_ID) =>
  `${activityId}:criterion:${criterion}`;

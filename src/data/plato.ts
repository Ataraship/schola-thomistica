import type { Lesson } from "@/data/curriculum";

/** Original teaching material based on the explicitly identified passages. */
export const PLATO_LESSONS: Lesson[] = [
  {
    id: "pla-1",
    title: "Opinião e conhecimento",
    concepts: ["Dóxa", "Epistéme", "Linha dividida", "Hipótese"],
    body: "Na República, Sócrates pergunta o que distingue apreciar muitas coisas belas de conhecer o belo em si. A investigação não se limita a medir a convicção de alguém: relaciona os modos de conhecer aos objetos conhecidos. A linha dividida, no livro VI, distingue o visível e o inteligível e, dentro do inteligível, o raciocínio que parte de hipóteses e a dialética que procura examiná-las até um princípio. Reconstrua essa proposta antes de decidir se suas premissas são aceitáveis.",
    exercise:
      "Formule com suas palavras por que, na passagem estudada, Platão julga que as aparências sensíveis variáveis não bastam para constituir ciência. Numere as premissas que consegue reconstruir e explique a função das hipóteses na geometria. Depois escreva uma objeção: conhecer regularidades de coisas que mudam seria impossível? Distinga essa pergunta de uma prova de que existem Formas separadas. Se sua resposta antiga já propõe uma objeção aristotélica, preserve-a e indique que premissa ela atinge.",
    options: [
      {
        text: "Toda opinião é falsa e todo uso de figuras pertence apenas ao nível mais baixo da linha.",
        correct: false,
        why: "A distinção não equivale a opinião sempre falsa. A geometria utiliza figuras, mas pensa objetos inteligíveis; não se reduz à percepção de uma sombra.",
      },
      {
        text: "A geometria raciocina sobre objetos inteligíveis a partir de hipóteses; a dialética procura examinar os próprios pontos de partida.",
        correct: true,
        why: "Essa diferença aparece na divisão do inteligível em República VI, 510b–511d. O desenho serve ao raciocínio sem ser o objeto exato da demonstração. Ainda é preciso investigar como se justifica o princípio procurado pela dialética.",
      },
      {
        text: "Distinguir um desenho do quadrado basta para demonstrar toda a teoria das Formas e a imortalidade da alma.",
        correct: false,
        why: "A distinção ajuda a esclarecer o objeto do raciocínio geométrico. Uma conclusão metafísica mais ampla exige premissas e argumentos adicionais; a aula não fornece uma prova da imortalidade.",
      },
    ],
    study: {
      objective:
        "Reconstruir a relação entre objeto e modo de conhecer na República, distinguir hipótese de princípio examinado e formular uma objeção ao argumento sem deformar a posição platônica.",
      sections: [
        {
          title: "Ler um diálogo e localizar a questão",
          text: "Platão escreve um diálogo: nesta passagem, Sócrates conduz perguntas às quais Glauco responde. Reconstruir o argumento desse personagem não significa que cada fala isolada seja uma declaração final sobre toda a obra de Platão. No livro V, o contraste entre muitas coisas belas e o belo em si prepara a distinção entre opinião e conhecimento. O filósofo procura o que o objeto é, e não apenas acumular exemplos que agradam. Essa exigência deve ser compreendida antes da comparação com Aristóteles ou Tomás.",
        },
        {
          title: "Ser, aparecer e o objeto da ciência",
          text: "Em República V, Sócrates associa conhecimento ao que é e situa a opinião entre conhecimento e ignorância. As muitas coisas belas podem aparecer também feias em determinadas relações; não se trata de afirmar uma contradição no mesmo sentido e sob o mesmo aspecto. A questão é se esses casos variáveis oferecem, por si sós, o objeto estável que a ciência procura. Não reduza Formas a palavras úteis ou imagens mentais: a posição platônica tem alcance ontológico. Ainda assim, a passagem do caráter variável dos exemplos à existência e ao modo de ser das Formas exige exame das premissas, não apenas a repetição de uma classificação.",
        },
        {
          title: "O geômetra pensa além do traço",
          text: "Um quadrado desenhado tem espessura, pequenas irregularidades e pode ser apagado. A demonstração geométrica não pretende valer somente para esse traço: examina o quadrado e suas relações inteligíveis. Por isso, usar um desenho não torna a geometria mera opinião sobre uma imagem. No livro VI, a geometria assume pontos de partida e deduz consequências. O termo hipótese descreve aqui um ponto de partida do raciocínio; não deve ser identificado automaticamente com uma hipótese experimental da ciência atual.",
        },
        {
          title: "A dialética interroga os pontos de partida",
          text: "Na seção superior do inteligível, a dialética toma hipóteses como apoios para investigar um princípio que não permaneça apenas suposto. Não é só discutir com outra pessoa nem ter uma convicção mais forte. O trecho descreve uma tarefa exigente, e não entrega ao leitor uma demonstração completa de todos os seus fundamentos. Uma objeção pertinente pergunta como reconhecer esse princípio e justificar a passagem até ele. Compare isso com a unidade de lógica: mostrar uma inferência válida não prova, sozinho, as premissas das quais ela partiu.",
        },
        {
          title: "Compreender, objetar e comparar",
          text: "Perguntar se podemos conhecer regularidades em seres mutáveis é uma objeção séria à passagem de certas características do sensível às exigências da ciência. Ela deve atingir uma premissa identificada, sem atribuir a Platão a afirmação de que qualquer observação é inútil. Só depois dessa reconstrução comece a comparação histórica entre escolas. A existência de um objeto inteligível da geometria não resolve, isoladamente, todas as questões sobre sua relação com as coisas sensíveis. Nesta aula, a avaliação tomista é uma investigação posterior a preparar, não uma conclusão usada para dispensar a leitura de Platão.",
        },
      ],
      comparison: {
        caption: "A linha dividida · mapa de leitura de República VI, 509d–511e",
        columns: ["Atividade", "O que considera", "Como procede"],
        rows: [
          [
            "Eikasía · imagens",
            "Sombras, reflexos e imagens do visível.",
            "Relaciona-se com a imagem, que remete a um original visível.",
          ],
          [
            "Pístis · crença",
            "Seres vivos e objetos do domínio visível.",
            "Toma os objetos visíveis como referência, em contraste com suas imagens.",
          ],
          [
            "Diánoia · pensamento discursivo",
            "Objetos inteligíveis da geometria e ciências afins.",
            "Parte de hipóteses e pode empregar figuras sensíveis como apoio.",
          ],
          [
            "Nóesis · intelecção",
            "O inteligível examinado pela dialética.",
            "Investiga as hipóteses em direção a um princípio não meramente suposto.",
          ],
        ],
        note: "Mapa conceitual, sem representar comprimentos ou proporções da linha. A nomenclatura varia entre traduções. Pístis significa crença nesta classificação; não designa aqui a virtude teologal da fé.",
      },
      argument: {
        premises: [
          "Se a ciência exige um objeto estável e inteligível, a mera sucessão de aparências variáveis não basta, por si só, para constituí-la.",
          "Na caracterização da República aqui examinada, a ciência exige um objeto estável e inteligível.",
        ],
        conclusion:
          "Nessa caracterização, a mera sucessão de aparências variáveis não basta, por si só, para constituir ciência.",
        analysis:
          "Esta é uma reconstrução didática delimitada, não uma citação nem o argumento completo do livro V. Concedidas as duas premissas, a conclusão segue por uma inferência condicional válida. O exame filosófico recai também sobre as premissas: por que a variação das aparências impede que elas bastem? Conhecer uma regularidade de coisas mutáveis satisfaria a exigência? A conclusão não demonstra, sozinha, a existência de Formas separadas. Na linha dividida, a geometria já se refere ao inteligível, embora utilize imagens e deixe seus pontos de partida como hipóteses; a dialética é apresentada como investigação desses fundamentos.",
      },
      criteria: [
        "Reconstruí a questão da República e separei a fala do personagem, a exposição da aula e minha avaliação.",
        "Distingui imagem, objeto visível, raciocínio hipotético e exame dialético dos princípios.",
        "Expliquei por que um desenho pode apoiar uma investigação do inteligível.",
        "Formulei uma objeção a uma premissa identificada e não tratei a reconstrução como prova de toda a metafísica platônica.",
      ],
      reflection:
        "Retome a objeção sobre conhecer o que muda. Escreva a melhor resposta que um defensor da posição platônica daria e depois seu próprio juízo. Registre se alterou uma premissa, delimitou a conclusão ou manteve uma dúvida. Liste o texto de Aristóteles ou Tomás que precisaria consultar para transformar sua objeção em uma comparação histórica fundamentada.",
      source:
        "Exposição, quadro e reconstrução autorais. Consulta parcial: Platão, República V, 476c–480a, e VI, 509d–511e. Localizadores de Stephanus conferidos na edição inglesa de Paul Shorey (1935–1937), corpus Perseus; comparação com Benjamin Jowett, Project Gutenberg 1497. Também consultado parcialmente o anexo português, cuja tradução não foi identificada com segurança. Nenhum texto integral ou tradução consultada é reproduzido.",
      referenceIds: ["platao-republica"],
      practice: {
        href: "/disputatio#sua-disputatio",
        label: "Disputar uma premissa sobre o conhecimento",
      },
    },
  },
  {
    id: "pla-menon",
    title: "Mênon: como investigar o que ainda não sabemos?",
    concepts: ["Aporia", "Paradoxo da investigação", "Anámnesis", "Saber parcial"],
    body: "Mênon pergunta como procurar aquilo que não se conhece: se já sabemos, a busca parece desnecessária; se ignoramos completamente, como reconhecer o que encontramos? Sócrates responde recorrendo à rememoração e apresenta uma investigação geométrica conduzida por perguntas. O episódio permite examinar o papel do saber parcial, do reconhecimento do erro e da orientação do interlocutor. Compreender essa atividade e aceitar sua explicação pela história anterior da alma são passos argumentativos diferentes.",
    exercise:
      "Um aluno sabe reconhecer um quadrado e calcular área como lado × lado, mas não sabe construir um quadrado com o dobro da área de outro. O inicial tem lado 2 e área 4. Teste as propostas de lado 4 e lado 3; procure depois uma solução por desenho ou pela diagonal. Explique que saber anterior permite investigar a resposta ainda desconhecida. Formule a objeção mais forte a concluir que acertar por meio de perguntas prova que a alma já conhecia a solução antes desta vida. Não precisa dominar raízes: uma construção e a comparação de áreas podem justificar a resposta.",
    options: [
      {
        text: "Como o aluno não sabe a solução, ele não sabe nada pertinente e nenhuma pergunta pode ajudá-lo.",
        correct: false,
        why: "O caso concede que ele reconhece quadrados e sabe calcular áreas. Esse saber parcial permite testar e rejeitar respostas, embora a solução ainda seja desconhecida.",
      },
      {
        text: "Chegar à resposta correta por perguntas demonstra, sem outras premissas, a preexistência da alma.",
        correct: false,
        why: "É preciso justificar essa explicação da aprendizagem e examinar o papel das perguntas e dos conhecimentos já disponíveis. O resultado do exercício não escolhe, sozinho, entre todas as explicações possíveis.",
      },
      {
        text: "O episódio permite examinar uma investigação orientada por saber parcial; a explicação por rememoração exige examinar premissas adicionais.",
        correct: true,
        why: "Distinguir o que o aluno fez da explicação metafísica proposta por Sócrates evita tanto apagar a rememoração do texto quanto apresentá-la como conclusão automática de um acerto geométrico.",
      },
    ],
    study: {
      objective:
        "Reconstruir o paradoxo da investigação, acompanhar erro e descoberta e avaliar a passagem da atividade observada à teoria da rememoração.",
      sections: [
        {
          title: "A dificuldade de reconhecer o que se procura",
          text: "Em Mênon 80d–e, a dificuldade não é simplesmente a preguiça de estudar: pergunta-se o que orienta uma investigação e permite reconhecer seu êxito. A alternativa entre já saber e ignorar deve ser examinada. Podemos não saber a solução e, ao mesmo tempo, compreender a pergunta, reconhecer relações e possuir critérios para rejeitar uma tentativa. Essa distinção oferece uma resposta pedagógica ao dilema, mas ainda não é toda a explicação que Sócrates apresenta no diálogo.",
        },
        {
          title: "Rememoração é uma tese a reconstruir",
          text: "Sócrates apresenta a anámnesis, ou rememoração, no horizonte de um saber anterior da alma e de sua existência anterior à vida presente. Não reduza a tese a uma metáfora sobre lembrar a aula de ontem. Também não a confunda com premissa da fé cristã ou com a iluminação agostiniana. Reconstrua primeiro a posição do diálogo: que relação ele estabelece entre ter a verdade na alma, ser interrogado e recuperar um saber? A avaliação da tese exige discutir essas ligações e as alternativas explicativas.",
        },
        {
          title: "Aporia: reconhecer o erro pode iniciar a investigação",
          text: "No episódio, Sócrates interroga um jovem escravizado da casa de Mênon sobre duplicar um quadrado. A primeira confiança na resposta cede quando se examina o resultado. Aporia é a dificuldade que deixa o interlocutor sem uma solução satisfatória; não é, por si só, fracasso definitivo. A aula pede acompanhar o que foi concedido, o que foi refutado e o que passou a ser procurado. Reconhecer uma resposta errada não torna a próxima verdadeira: é preciso testá-la por uma razão independente.",
        },
        {
          title: "Perguntar também pode orientar a resposta",
          text: "Sócrates insiste que pergunta em vez de transmitir a solução. Uma objeção forte observa, porém, que escolher figuras, decompor áreas e formular perguntas já oferece direção à atividade. Isso não torna falso o resultado geométrico; torna discutível inferir dele uma única origem possível do conhecimento. Separe a validade da construção da explicação de como o aluno chegou a entendê-la. Pergunte como distinguir reconhecimento racional, aprendizagem orientada e rememoração, sem decidir a questão só pelo nome dado ao episódio.",
        },
        {
          title: "O cuidado final de Sócrates",
          text: "Em 86b–c, Sócrates não atribui o mesmo grau de segurança a todos os pontos de sua exposição, mas defende com firmeza o valor de investigar o que ainda não se sabe. Essa cautela impede ler o episódio como se encerrasse todas as questões sobre alma e aprendizagem. Preserve a diferença entre reconstruir a explicação proposta e afirmar o que o episódio efetivamente demonstra. O anexo usado é parcial: esta aula se limita a 80d–86c e não presume ter consultado as discussões posteriores do diálogo.",
        },
      ],
      argument: {
        premises: [
          "Se um saber parcial relevante permite formular e testar tentativas, não é preciso conhecer a solução completa antes de começar a investigar.",
          "No exercício, reconhecer quadrados e calcular áreas permite formular e testar tentativas sem conhecer previamente a solução.",
        ],
        conclusion:
          "No caso proposto, é possível começar a investigar sem já conhecer a solução completa.",
        analysis:
          "O lado 4 produz área 16, quatro vezes a inicial; o lado 3 produz área 9, e não 8. A diagonal do quadrado de lado 2 permite construir o quadrado de área 8: pelo teorema de Pitágoras, seu comprimento ao quadrado é 2² + 2². Para justificar sem raízes, reúna quatro quadrados de lado 2 num quadrado de lado 4. Una os pontos médios dos lados externos: o quadrado central tem por lados diagonais dos quadrados menores. Cada um dos quatro triângulos dos cantos tem área 2; retirados da área 16, deixam área central 8. O cálculo mostra uma solução geométrica, e a reconstrução mostra a função de saber parcial na investigação. Não demonstram, sozinhos, a preexistência da alma: essa explicação proposta no diálogo exige premissas adicionais e confronto com a hipótese de aprendizagem orientada. A reconstrução é pedagógica, não uma transcrição do raciocínio inteiro de Sócrates.",
      },
      criteria: [
        "Reconstruí a dificuldade de procurar e reconhecer, sem caricaturá-la como mera recusa de estudar.",
        "Separei saber a resposta completa de possuir conhecimentos e critérios parciais pertinentes.",
        "Testei as propostas de lado 4 e lado 3 e justifiquei a solução pela diagonal ou por áreas.",
        "Distingui a construção geométrica da explicação pela rememoração e considerei o papel das perguntas.",
        "Indiquei qual premissa adicional precisaria defender para sustentar a conclusão sobre a alma.",
      ],
      reflection:
        "Compare sua primeira tentativa com a revisão: qual erro reconheceu, que pergunta ajudou e que razão justifica a resposta agora? Depois escreva a melhor defesa da rememoração e a objeção da aprendizagem orientada. Registre seu juízo sobre o alcance do episódio, sem fingir que o exercício resolveu sozinho toda a questão metafísica.",
      source:
        "Exposição, exercício adaptado e reconstrução autorais. Consulta parcial: Platão, Mênon 80d–86c, tradução de Maura Iglésias, PUC-Rio/Loyola, no anexo privado de 34 páginas. O arquivo contém elementos editoriais e um excerto que termina por volta de 86d, não o diálogo integral. Texto grego não está integrado. Não se reproduz a tradução moderna nem se atribui ao anexo acesso às passagens posteriores.",
      referenceIds: ["platao-menon"],
      practice: {
        href: "/disputatio#sua-disputatio",
        label: "Disputar o alcance do episódio do Mênon",
      },
    },
  },
];

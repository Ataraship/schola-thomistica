import type { Lesson } from "@/data/curriculum";

/** Original introduction; the modern translation is consulted, not reproduced. */
export const ARISTOTLE_LESSONS: Lesson[] = [
  {
    id: "ari-1",
    title: "As quatro causas",
    concepts: ["Matéria", "Forma", "Princípio da mudança", "Fim", "Natureza e arte"],
    body: "Na Física, conhecer pelas causas significa procurar por que algo é ou acontece. Aristóteles distingue quatro sentidos explicativos: aquilo de que algo é feito, o que o caracteriza, de onde procede a mudança e aquilo em vista do qual ocorre. São perguntas relacionadas, não quatro acontecimentos obrigatoriamente separados no tempo. Antes de transportar o esquema para a natureza, examine como cada resposta explica um caso e que razões a sustentam.",
    exercise:
      "Aplique as quatro causas a uma árvore, preservando sua resposta antiga, se houver. Diga qual processo pretende explicar: germinação, crescimento ou outra atividade. Para cada causa, apresente uma razão e uma dúvida. Qual parece mais difícil de defender diante de um interlocutor moderno, e por quê? Desenvolva especialmente esta objeção: uma parte pode ser útil à árvore sem que essa utilidade, sozinha, prove uma explicação por finalidade. Indique que investigação ajudaria a decidir.",
    options: [
      {
        text: "As quatro causas são sempre quatro etapas cronológicas, terminando numa intenção consciente.",
        correct: false,
        why: "A classificação distingue sentidos do porquê. Uma explicação final não precisa atribuir deliberação consciente à planta, e as causas não são quatro momentos de uma receita.",
      },
      {
        text: "Se uma parte é útil, já está demonstrado que surgiu para essa função; nenhuma objeção adicional importa.",
        correct: false,
        why: "Um efeito favorável pode ser incidental. Atribuir finalidade exige razões sobre a organização e o processo, além de enfrentar explicações concorrentes.",
      },
      {
        text: "Uma descrição correta dos materiais pode deixar a organização ou a função sem explicação; cada atribuição causal precisa de razões.",
        correct: true,
        why: "Identificar a matéria responde a uma pergunta pertinente, mas não resolve automaticamente as demais. Também não basta acrescentar os outros três nomes sem justificar como explicam o caso.",
      },
    ],
    study: {
      objective:
        "Distinguir quatro perguntas causais, justificar sua aplicação e avaliar uma objeção à finalidade sem confundir natureza com fabricação.",
      sections: [
        {
          title: "Quatro sentidos do porquê",
          text: "Em Física II, 3, matéria e forma, princípio da mudança e fim são modos de responder por que algo é ou se produz. O bronze e a atividade do escultor podem explicar a mesma estátua sob aspectos diferentes. Não competem necessariamente pela mesma função explicativa. Pergunte o que cada resposta esclarece e o que deixa em aberto. Enumerar quatro substantivos não demonstra que você já explicou o objeto.",
        },
        {
          title: "Natureza e arte não têm o mesmo princípio",
          text: "Em II, 1, Aristóteles distingue o princípio de movimento e repouso próprio do ser natural da produção artesanal. Uma árvore cresce e se nutre por suas capacidades naturais; um banco não cresce como banco. A madeira do banco continua tendo propriedades naturais, mas sua organização como assento resulta da fabricação. Assim, o exemplo artesanal ajuda a distinguir perguntas; não autoriza descrever a árvore como uma máquina montada por um artesão.",
        },
        {
          title: "A forma de um vivente não é só o contorno",
          text: "Na árvore, perguntar pela forma envolve sua organização e suas atividades próprias, não apenas desenhar sua silhueta. Perguntar pela matéria envolve os constituintes do vivente; pela origem da mudança, o princípio ou agente responsável pelo processo escolhido. As condições do processo também precisam ser investigadas, sem classificar qualquer condição como causa eficiente. Aqui não basta substituir bronze por madeira: é preciso explicar um organismo. A distinção entre matéria e forma, em Aristóteles, também não se reduz a aplicar nomes diferentes ao mesmo inventário de partes.",
        },
        {
          title: "Finalidade e a objeção do benefício acidental",
          text: "Em II, 8, o interlocutor pode alegar que um resultado favorável decorre de processos necessários sem ocorrer em vista dele: beneficiar uma plantação não torna esse benefício a finalidade da chuva. Aristóteles enfrenta a dificuldade examinando a regularidade e a articulação dos processos naturais. Sua posição não atribui planejamento consciente a cada vivente. Uma objeção forte pergunta se regularidade e adequação bastam para estabelecer finalidade ou admitem outra explicação. Reconstrua a resposta antes de julgá-la.",
        },
        {
          title: "Condições materiais e fim não se substituem",
          text: "Em II, 9, Aristóteles examina condições necessárias para realizar um fim. Uma serra precisa de material e configuração adequados ao corte; o fim não elimina essas condições nem as torna suficientes por mera declaração. Na árvore, indicar uma atividade como nutrição pede mostrar como suas partes e processos se relacionam com ela. Sua conclusão deve reconhecer o que foi observado, o que foi interpretado e o que continua em disputa.",
        },
      ],
      comparison: {
        caption: "Quatro perguntas · um banco de madeira como exemplo artesanal",
        columns: ["Sentido causal", "Pergunta", "Resposta a justificar"],
        rows: [
          ["Material", "De que é feito?", "Madeira e demais materiais que o constituem."],
          [
            "Formal",
            "O que caracteriza esse objeto?",
            "Organização das partes que o constitui como assento.",
          ],
          [
            "Eficiente",
            "De onde procede sua produção?",
            "Atividade do artífice, com técnica e instrumentos.",
          ],
          ["Final", "Em vista de quê foi produzido?", "Servir como assento no uso pretendido."],
        ],
        note: "O quadro distingue perguntas num artefato. Aplicá-las a uma árvore exige investigar a atividade de um vivente, em vez de presumir que sua forma seja apenas um desenho ou seu fim uma intenção consciente.",
      },
      argument: {
        premises: [
          "Para explicar por que um objeto é uma estátua em vez de um sino, é preciso indicar algo que distinga esses objetos.",
          "O mesmo tipo de bronze pode constituir tanto uma estátua como um sino.",
          "Identificar somente esse material não distingue os dois objetos.",
        ],
        conclusion:
          "Identificar somente o bronze não basta para explicar por que este objeto é uma estátua em vez de um sino.",
        analysis:
          "A reconstrução mostra uma insuficiência explicativa delimitada: uma descrição material pode ser verdadeira e ainda deixar outra pergunta sem resposta. Não conclui que a matéria seja irrelevante nem demonstra toda a teoria causal. Tampouco prova finalidade em cada fenômeno natural. No exercício da árvore, é preciso justificar a passagem do exemplo artesanal à atividade natural e enfrentar a hipótese de benefício incidental.",
      },
      criteria: [
        "Delimitei o objeto e o processo e expliquei quais perguntas minhas respostas causais procuram resolver.",
        "Distingui natureza e arte e evitei reduzir a forma de um vivente a seu contorno.",
        "Reconstruí a objeção do benefício incidental sem atribuir intenção consciente à árvore.",
        "Justifiquei uma resposta à objeção e reconheci o que minha análise ainda não estabeleceu.",
      ],
      reflection:
        "Releia sua resposta antiga e escolha a atribuição causal mais fraca. Escreva a melhor objeção, responda sem apenas repetir o nome da causa e revise o juízo. Se não puder decidir, indique qual premissa falta justificar e qual observação ou leitura permitiria avançar.",
      source:
        "Exposição, quadro, exercício e reconstrução autorais. Consulta parcial: Aristóteles, Física II, capítulos 1, 3, 8 e 9, na tradução espanhola de Guillermo R. de Echandía, Gredos (1995)/Planeta De Agostini, anexo privado de 321 páginas. Foram distinguidos o texto do autor e as notas modernas. Não houve leitura integral da obra nem reprodução da tradução ou do PDF.",
      referenceIds: ["aristoteles-fisica"],
      practice: {
        href: "/disputatio#sua-disputatio",
        label: "Disputar uma explicação causal",
      },
    },
  },
];

import type { Lesson } from "@/data/curriculum";

/** Original lesson; the consulted modern translation is not reproduced. */
export const ILLUMINATION_LESSON: Lesson = {
  id: "pat-agostinho-iluminacao",
  title: "Iluminação: compreender não é recordar uma vida anterior",
  concepts: ["Iluminação", "Mente criada", "Inteligível e sensível", "Rememoração"],
  body: "Em A Trindade XII, 15, 24, Agostinho examina o episódio geométrico associado ao Mênon e rejeita explicá-lo por conhecimentos adquiridos em uma vida anterior. Sua proposta é afirmativa: o Criador constitui a mente apta a reconhecer o inteligível numa luz incorpórea. Compreenda essa explicação antes de avaliá-la e distinga-a dos meios pelos quais investigamos fatos particulares.",
  exercise:
    "Uma estudante compreende por que dobrar o lado de um quadrado quadruplica sua área. Depois recebe uma carta supostamente escrita em 1670 e aceita a data porque sente a mesma convicção interior. Compare as duas tarefas: que razões sustentam a relação geométrica e que evidências sustentariam a data? Reconstrua a explicação agostiniana da aptidão para compreender; formule a objeção de que nomear essa aptidão não basta para explicá-la. Responda sem reduzir iluminação a uma lembrança de outra vida nem usá-la para dispensar a investigação da carta.",
  options: [
    {
      text: "Agostinho identifica iluminação com a recordação de geometria aprendida pela alma antes de nascer.",
      correct: false,
      why: "Essa identificação atribui como solução ao autor a explicação por vida anterior que ele critica em XII, 15, 24. É preciso preservar a diferença entre as posições.",
    },
    {
      text: "A aptidão criada para compreender o inteligível não dispensa experiência, testemunho e estudo na investigação de fatos sensíveis.",
      correct: true,
      why: "O próprio parágrafo distingue esses meios. Reconstruir a iluminação exige considerar a dependência da mente em relação ao Criador e justificar cada juízo conforme seu objeto.",
    },
    {
      text: "Uma convicção interior intensa torna certa a data da carta e equivale a contemplar diretamente a essência divina.",
      correct: false,
      why: "A intensidade da convicção não fornece a evidência histórica que falta. A passagem não autoriza identificar qualquer entendimento humano com visão imediata da essência divina.",
    },
  ],
  study: {
    objective:
      "Distinguir iluminação e rememoração, reconstruir a dependência da mente criada e justificar por meios pertinentes um juízo inteligível e uma afirmação histórica.",
    sections: [
      {
        title: "O mesmo episódio, explicações a comparar",
        text: "No Mênon 80d–86c, a investigação geométrica conduz ao exame do saber anterior da alma. Agostinho retoma o caso e contesta essa explicação. Não basta dizer que ambos valorizam a interioridade: pergunte o que explica a possibilidade de compreender para cada autor. A comparação deve conferir o sentido do saber anterior proposto no diálogo e o alcance da crítica agostiniana, sem trocar uma posição por uma versão mais fácil de rejeitar.",
      },
      {
        title: "Uma mente criada para reconhecer o inteligível",
        text: "Em XII, 15, 24, Agostinho atribui ao Criador a constituição da mente intelectiva e sua aptidão para o inteligível. A comparação com os olhos aptos à luz esclarece uma relação de natureza e ordem: compreender depende de como a mente foi constituída. A luz incorpórea não é apenas uma imagem para nossa preferência subjetiva. A explicação inclui Deus e a condição criada da razão; suprimi-los alteraria a posição que estamos procurando compreender.",
      },
      {
        title: "Compreender não torna qualquer impressão infalível",
        text: "Entender uma relação não significa saber todos os conteúdos nem conhecer automaticamente a história de um objeto. Tampouco a passagem permite equiparar uma resposta correta à visão imediata da essência divina. O aluno ainda precisa identificar as razões de seu juízo e reconhecer erros. Na geometria, deve explicar a relação de áreas sob os pressupostos usados; sentir certeza não substitui a demonstração. A luz considerada pelo autor não é uma licença para declarar verdadeira qualquer convicção.",
      },
      {
        title: "A carta exige outras formas de investigação",
        text: "O próprio parágrafo distingue o conhecimento das coisas sensíveis, adquirido por experiência, pelo testemunho de quem sabe e pelo estudo de escritos ou palavras. Para datar a carta, examine procedência, material, escrita e documentação; avalie a competência e as razões dos testemunhos. Um parecer pode sustentar uma conclusão revisável. Isso não reduz toda verdade à percepção: mostra que reconhecer uma relação inteligível e estabelecer quando algo aconteceu exigem operações e razões que não devem ser confundidas.",
      },
      {
        title: "Avaliar a explicação sem apagá-la",
        text: "Uma objeção pergunta se afirmar uma aptidão criada explica a compreensão ou apenas renomeia o problema. Reconstrua a resposta possível: para Agostinho, a aptidão integra uma ordem estabelecida pelo Criador, não uma propriedade sem fundamento. Depois pergunte quais razões justificam essa explicação e se o parágrafo, sozinho, as oferece integralmente. A leitura fiel e a avaliação filosófica são tarefas relacionadas, mas distintas. Faça também justiça ao Mênon: refutar uma identificação simplista não encerra toda a investigação platônica.",
      },
    ],
    comparison: {
      caption: "Questões diferentes, razões e meios pertinentes",
      columns: ["Questão", "O que investigar", "Limite a reconhecer"],
      rows: [
        [
          "Relação geométrica",
          "Pressupostos, construção e passos da demonstração.",
          "Um acerto ou uma figura isolada não explicam toda a origem do conhecimento.",
        ],
        [
          "Data de uma carta",
          "Material, procedência, escrita e testemunhos documentados.",
          "Convicção interior não estabelece uma data histórica.",
        ],
        [
          "Recordar uma aula",
          "Memória de uma experiência efetivamente vivida e meios de conferi-la.",
          "Lembrança biográfica não equivale a recordar uma existência anterior.",
        ],
        [
          "Explicação agostiniana",
          "Mente criada, inteligível e dependência do Criador.",
          "Reconstruir a posição não demonstra automaticamente todos os seus pressupostos.",
        ],
      ],
      note: "O quadro organiza o exercício; não oferece uma classificação completa da gnoseologia agostiniana. Uma mesma pesquisa pode combinar compreensão, experiência e testemunhos.",
    },
    argument: {
      premises: [
        "Uma interpretação que apresenta como solução do autor aquilo que o trecho expressamente rejeita não é fiel a esse trecho.",
        "Apresentar a iluminação como recordação de geometria aprendida em outra vida atribui a Agostinho a explicação que ele rejeita em XII, 15, 24.",
      ],
      conclusion:
        "Identificar assim iluminação e recordação de uma vida anterior não é uma leitura fiel dessa passagem de Agostinho.",
      analysis:
        "A conclusão decorre do critério de fidelidade e da identificação conferida no texto. Seu alcance é interpretativo: não demonstra, por si, toda a teoria da iluminação nem refuta todas as razões de Platão. Agostinho propõe a aptidão criada da mente, que deve ser compreendida e examinada em seus próprios termos. No exercício, justificar a relação geométrica pede explicitar seus passos; justificar a data exige evidências pertinentes. Alegar iluminação não fornece os documentos ausentes nem corrige uma inferência inválida. Esses exemplos são autorais, não casos narrados pelo parágrafo.",
    },
    criteria: [
      "Distingui a rememoração examinada no Mênon da explicação de Agostinho.",
      "Reconstruí a aptidão da mente criada sem excluir sua dependência do Criador.",
      "Justifiquei por meios pertinentes a relação geométrica e a investigação da carta.",
      "Enfrentei uma objeção à explicação e delimitei o que o argumento estabelece.",
    ],
    reflection:
      "Releia sua resposta e identifique uma confusão entre sentir certeza e oferecer uma razão. Depois escreva a melhor defesa da explicação agostiniana e a objeção que ela ainda deve enfrentar. Registre o que mudou em seu juízo e que premissa ou fonte precisaria investigar antes de chegar a uma conclusão mais ampla.",
    source:
      "Exposição, quadro, exercício e reconstrução autorais. Consulta parcial: Agostinho, A Trindade XII, 15, 24, tradução de Frei Agustino Belmonte, Paulus, no anexo privado de 472 páginas. As notas modernas foram distinguidas do texto do autor. Comparação com Mênon 80d–86c, no excerto de Maura Iglésias já identificado na biblioteca; o anexo termina por volta de 86d. Não se reproduzem as traduções nem se afirma leitura integral das obras.",
    referenceIds: ["agostinho-trindade", "platao-menon"],
    practice: {
      href: "/disputatio#sua-disputatio",
      label: "Disputar uma interpretação da iluminação",
    },
  },
};

export type LessonStudy = {
  objective: string;
  sections: { title: string; text: string }[];
  argument: { premises: string[]; conclusion: string; analysis: string };
  criteria: string[];
  reflection: string;
  source: string;
};
export type Lesson = {
  id: string;
  title: string;
  body: string;
  concepts: string[];
  exercise: string;
  options?: { text: string; correct: boolean; why: string }[];
  study?: LessonStudy;
};
export type Track = {
  id: string;
  title: string;
  latin: string;
  prereq?: string;
  summary: string;
  lessons: Lesson[];
};

export const TRACKS: Track[] = [
  {
    id: "logica",
    title: "Lógica",
    latin: "Logica",
    summary:
      "Conceito → juízo → definição → silogismo → validade: aprender a justificar o próprio juízo.",
    lessons: [
      {
        id: "log-1",
        title: "Termo, proposição e argumento",
        concepts: ["Conceito", "Termo", "Simples apreensão"],
        body: "A tradição aristotélica distingue três operações do intelecto. A simples apreensão capta o que algo é, expresso no termo. O juízo une ou separa conceitos, afirmando ou negando, e se expressa na proposição, que pode ser verdadeira ou falsa. O raciocínio passa de juízos conhecidos a um juízo novo, e se expressa no argumento. Um argumento pode ter premissas verdadeiras e ainda assim ser inválido; validade diz respeito à forma, verdade diz respeito ao conteúdo.",
        exercise:
          "Considere: 'Todo homem é mortal; Sócrates é mortal; logo Sócrates é homem.' O argumento é válido? Antes de escolher, identifique os termos e as proposições e escreva sua justificativa. Sua resposta antiga, se houver, permanece neste campo.",
        options: [
          {
            text: "Sim, pois todas as proposições são verdadeiras.",
            correct: false,
            why: "A verdade de cada proposição não garante que a conclusão decorra dessas premissas. Procure outro ser mortal que não seja homem.",
          },
          {
            text: "Não: o termo médio 'mortal' não é distribuído.",
            correct: true,
            why: "As premissas não dizem que todos os mortais são homens. Um cavalo também é mortal e não é homem; a mesma forma admite premissas verdadeiras e conclusão falsa. Isso não nega que Sócrates seja homem.",
          },
        ],
        study: {
          objective:
            "Distinguir compreender um conceito, afirmar uma proposição e oferecer razões; explicar por que conhecer as palavras ainda não é demonstrar uma conclusão.",
          sections: [
            {
              title: "Conceito não é apenas uma palavra",
              text: "Posso compreender o que significa triângulo sem afirmar que exista um triângulo desenhado nesta sala. O conceito permite considerar o objeto; o termo é sua expressão na linguagem. Duas línguas podem expressar um conceito por palavras diferentes. Inversamente, uma palavra pode ter sentidos distintos: banco pode designar um assento ou uma instituição. Antes de examinar uma afirmação, esclareça de que objeto ela fala e em que sentido emprega seus termos.",
            },
            {
              title: "Do conceito à afirmação",
              text: "Compare ‘justiça’ e ‘esta decisão é justa’. A primeira expressão nomeia algo considerado; a segunda afirma algo sobre uma decisão e pode ser contestada como verdadeira ou falsa. É possível dominar o vocabulário de uma tradição e ainda não ter justificado nenhuma tese. Para estudar com autonomia, pergunte o que está sendo apenas definido, o que está sendo afirmado e quais razões sustentam a afirmação. Essas perguntas também devem valer para uma posição com a qual você já concorda.",
            },
            {
              title: "A primeira passagem para um argumento",
              text: "Quando alguém diz ‘esta medida recebeu apoio; portanto é justa’, oferece apoio como razão de justiça. Falta investigar a ligação entre as duas coisas. Uma conclusão pode ser verdadeira por uma razão diferente daquela apresentada. No exercício a seguir, não pergunte apenas o que sabe sobre Sócrates: examine se as duas premissas bastam. As próximas unidades darão instrumentos para tornar esse exame mais preciso. Não há problema em registrar aqui uma dificuldade inicial e voltar a ela depois.",
            },
          ],
          argument: {
            premises: ["Todo homem é mortal.", "Sócrates é mortal."],
            conclusion: "Logo, Sócrates é homem.",
            analysis:
              "As três proposições são verdadeiras no exemplo usual, mas a inferência é inválida. A forma é ‘todo A é B; C é B; logo C é A’. Substituir C por um cavalo mantém premissas verdadeiras e produz conclusão falsa. O contraexemplo refuta a necessidade da passagem, sem provar que a conclusão original seja falsa. Distinguir esses dois resultados será central na última unidade.",
          },
          criteria: [
            "Distingui termos, afirmações e a razão oferecida para a conclusão.",
            "Expliquei por que saber que Sócrates é homem não basta para validar esta inferência.",
            "Testei a ligação com outro exemplo e indiquei o que o teste prova.",
          ],
          reflection:
            "Releia sua primeira resposta. Você examinou as razões ou apenas reconheceu uma conclusão familiar? Registre a diferença e uma pergunta que pretende resolver nas próximas unidades.",
          source:
            "Exposição e exemplos autorais. Orientação clássica: Aristóteles, Categorias, capítulo 2; Primeiros Analíticos I, 1. Não é transcrição de Lógica e Dialética nem de seu PDF, indisponível neste repositório.",
        },
      },
      {
        id: "log-juizo",
        title: "Juízo e proposição: o que está sendo afirmado?",
        concepts: ["Afirmação e negação", "Sujeito e predicado", "Quantidade"],
        body: "O juízo afirma ou nega algo de algo. Sua expressão é uma proposição, que pode ser verdadeira ou falsa. Uma ordem e uma pergunta podem ser úteis sem afirmar uma proposição. Para avaliar o que foi dito, identifique o sujeito, o predicado, a quantidade e a qualidade: ‘todo’, ‘algum’ e ‘nenhum’ não dizem a mesma coisa; afirmar e negar também não.",
        exercise:
          "Separe o que é termo, proposição ou ordem em ‘a justiça’, ‘toda decisão popular é justa’ e ‘examine a decisão’. Na proposição, identifique sujeito e predicado. Escreva depois sua negação exata e um caso que permitiria testar a afirmação original.",
        study: {
          objective:
            "Identificar uma proposição e negar precisamente uma afirmação universal, sem trocar ‘nem todos’ por ‘nenhum’.",
          sections: [
            {
              title: "A frase precisa assumir um compromisso",
              text: "‘Feche o livro’ pede uma ação; ‘o livro está fechado’ afirma um estado que pode ser conferido. ‘O livro está fechado?’ solicita uma resposta. A forma gramatical pode exigir atenção ao contexto, mas a distinção orienta o exame: qual conteúdo está sendo proposto como verdadeiro? Antes de acusar alguém de contradição, reconstrua a afirmação efetiva, evitando transformar uma pergunta exploratória numa tese que a pessoa não defendeu.",
            },
            {
              title: "Quanto a afirmação abrange?",
              text: "‘Todo manuscrito da caixa é legível’ abrange cada manuscrito da caixa; ‘algum manuscrito da caixa é legível’ exige ao menos um. Na lógica aqui utilizada, ‘algum’ significa pelo menos um, podendo incluir todos. No uso coloquial, a frase pode sugerir ‘algum, mas não todos’; essa sugestão não integra a forma lógica. Declare o domínio considerado: a caixa desta sala e todo o acervo de uma biblioteca são conjuntos diferentes. Uma mudança silenciosa do domínio altera a tese.",
            },
            {
              title: "Negar sem exagerar",
              text: "Para negar ‘todo manuscrito da caixa é legível’, basta afirmar ‘há ao menos um manuscrito da caixa que não é legível’. Dizer ‘nenhum é legível’ é muito mais forte. Um manuscrito ilegível refuta a universal; não permite concluir que os demais também o sejam. Ao escrever uma objeção, respeite esse alcance. A precisão evita que a descoberta de uma exceção seja usada como autorização para rejeitar tudo de uma vez.",
            },
          ],
          argument: {
            premises: [
              "Se todos os manuscritos da caixa fossem legíveis, não haveria nela um manuscrito ilegível.",
              "Há nesta caixa um manuscrito que não é legível.",
            ],
            conclusion: "Portanto, não são todos os manuscritos desta caixa que são legíveis.",
            analysis:
              "A conclusão nega a universal sem afirmar que nenhum manuscrito seja legível. O caso contrário basta porque pertence ao domínio que a universal abrangia. Um manuscrito de outra caixa não seria, sozinho, um contraexemplo pertinente. O argumento ainda depende de verificar o estado do exemplar indicado.",
          },
          criteria: [
            "Distingui nomear, afirmar e ordenar sem avaliar uma ordem como verdadeira ou falsa.",
            "Escrevi a negação de ‘toda’ como existência de ao menos uma exceção.",
            "Delimitei o conjunto ao qual meu exemplo pertence e não concluí além dele.",
          ],
          reflection:
            "Compare sua negação com ‘nenhuma decisão popular é justa’. Explique por que as duas frases não são equivalentes e indique que evidência seria necessária para a afirmação mais forte.",
          source:
            "Exposição e exemplos autorais. Referência clássica para proposição, afirmação e negação: Aristóteles, Da interpretação, capítulos 4–7. Sem transcrição de traduções modernas.",
        },
      },
      {
        id: "log-definicao",
        title: "Definição: delimitar sem decidir por decreto",
        concepts: ["Gênero e diferença", "Necessário e suficiente", "Contraexemplo"],
        body: "Uma definição procura esclarecer o que se entende por algo e distingui-lo do que não é. Enumerar exemplos pode ajudar, mas não fornece necessariamente um critério para casos novos. Uma definição ampla demais inclui o que deveria excluir; uma estreita demais exclui o que deveria incluir. A investigação começa quando testamos a formulação, em vez de tratá-la como uma palavra final.",
        exercise:
          "Examine ‘biblioteca é um prédio para guardar livros’. Apresente um caso incluído indevidamente e outro excluído indevidamente. Proponha uma definição melhor para o contexto de acesso organizado ao conhecimento e explique uma dificuldade que ainda permanece.",
        study: {
          objective:
            "Avaliar uma definição por inclusão, exclusão e circularidade; revisá-la com um critério que possa ser testado por um interlocutor.",
          sections: [
            {
              title: "Dar exemplos e explicar um conceito",
              text: "Mostrar três quadrados pode ensinar a reconhecer casos, mas não determina por si só o que faz deles quadrados. Dizer ‘é uma figura com quatro lados’ inclui retângulos e outros quadriláteros que não são quadrados. Uma definição adequada precisa distinguir o objeto dentro de uma classe mais ampla. O método de gênero e diferença organiza essa procura, mas não garante que uma diferença encontrada seja a correta: ela continua sujeita a exame.",
            },
            {
              title: "Necessário não significa suficiente",
              text: "Ter quatro lados é necessário para um quadrado, mas não basta. Ser um quadrado azul é suficiente para ser quadrado, mas a cor azul não é necessária. Teste uma definição nas duas direções: todo caso genuíno satisfaz o critério? Tudo que satisfaz o critério é um caso genuíno? Essa dupla pergunta mostra por que acrescentar condições sem pensar pode corrigir a amplitude e criar, ao mesmo tempo, uma exclusão indevida.",
            },
            {
              title: "Definições não substituem razões",
              text: "‘Bom argumento é o que prova minha opinião’ é circular como critério de investigação: a posição a examinar já foi usada para decidir o resultado. Às vezes propomos uma convenção útil para uma atividade, sem pretender haver descoberto uma essência. Dizer isso claramente é melhor que apresentar uma escolha de vocabulário como prova sobre a realidade. No caso de biblioteca, declare o contexto que a definição deve servir e deixe espaço para o interlocutor testar sua proposta.",
            },
          ],
          argument: {
            premises: [
              "Se ‘figura de quatro lados’ fosse uma definição suficiente de quadrado, toda figura de quatro lados seria quadrada.",
              "Um retângulo de dois por três centímetros tem quatro lados, mas não é quadrado.",
            ],
            conclusion:
              "Portanto, ter quatro lados não é condição suficiente para definir um quadrado.",
            analysis:
              "O exemplo preserva uma condição necessária e mostra que ela não distingue todos os casos. Não conclui que um quadrado possa ter três lados, nem oferece sozinho uma definição completa. Para completar a investigação, seria preciso explicitar as propriedades que separam quadrados de outros quadriláteros e testar também se a formulação exclui algum quadrado.",
          },
          criteria: [
            "Apresentei um caso incluído e outro excluído indevidamente pela definição inicial.",
            "Expliquei meu critério sem repetir a palavra a definir nem pressupor a conclusão.",
            "Testei minha revisão nas duas direções e reconheci um limite.",
          ],
          reflection:
            "Compare a definição revisada com a inicial. Qual contraexemplo levou a cada mudança? Se alguém discordar do contexto escolhido, diga que parte da discussão é terminológica e que parte diz respeito ao objeto.",
          source:
            "Exposição e exemplos autorais. Orientação clássica: Aristóteles, Tópicos VI, 1, sobre o exame de definições. Os exemplos não foram extraídos de PDFs privados.",
        },
      },
      {
        id: "log-2",
        title: "O silogismo categórico",
        concepts: ["Termo maior, menor e médio", "Figuras", "Barbara"],
        body: "O silogismo possui três termos e três proposições. O termo médio aparece nas duas premissas e liga o termo maior ao menor. Na forma Barbara: todo M é P; todo S é M; logo todo S é P. Antes de aceitar uma conclusão, o estudante deve perguntar: as premissas são verdadeiras? A forma é válida? Os termos são usados no mesmo sentido?",
        exercise:
          "Construa um silogismo em Barbara sobre a virtude e identifique o termo médio. Justifique as premissas ou indique qual delas um interlocutor poderia recusar.",
        study: {
          objective:
            "Construir uma inferência em Barbara com exatamente três termos, distinguindo a ligação formal da evidência das premissas.",
          sections: [
            {
              title: "Por que o termo médio importa",
              text: "Em ‘todo carvalho é árvore; todo sobreiro é carvalho; logo todo sobreiro é árvore’, árvore é o termo maior, sobreiro o menor e carvalho o médio. O termo médio conecta sujeito e predicado, mas desaparece da conclusão. A forma Barbara usa três proposições universais afirmativas. Primeiro identifique a conclusão e seus dois termos; depois procure a ponte nas premissas. A função dos termos não depende de qual frase foi escrita primeiro.",
            },
            {
              title: "As letras deixam visível a forma",
              text: "Substituir os conteúdos por M, P e S ajuda a examinar se a ligação foi preservada. Se todo S está compreendido em M e todo M em P, nenhum S pode escapar de P sob essas premissas. Mas empregar três letras não salva uma mudança de sentido. Se ‘virtude’ significa hábito moral numa premissa e capacidade técnica noutra, há mais conceitos do que o esquema admite. No exercício, escreva ao lado de cada termo o sentido utilizado.",
            },
            {
              title: "A forma não fornece as premissas",
              text: "Uma inferência válida ainda pode usar uma premissa falsa ou controversa. Ao construir um exemplo moral, não esconda toda a dificuldade dentro de ‘toda virtude é…’. Pergunte de onde conhece a premissa e se o interlocutor concede sua universalidade. Pode ser necessário defendê-la por outra investigação. Reconhecer essa dependência não enfraquece o trabalho: mostra precisamente o que a inferência realiza e o que ainda precisa ser justificado.",
            },
          ],
          argument: {
            premises: ["Todo carvalho é árvore.", "Todo sobreiro é carvalho."],
            conclusion: "Logo, todo sobreiro é árvore.",
            analysis:
              "O termo médio carvalho liga sobreiro a árvore. A forma é válida porque a inclusão de todos os sobreiros nos carvalhos e de todos os carvalhos nas árvores obriga a conclusão. No exemplo usual, as premissas também são verdadeiras. Forma e conteúdo, porém, foram verificados por motivos diferentes; a forma não estabeleceu por si mesma a classificação botânica.",
          },
          criteria: [
            "Usei três termos sem mudar seu sentido.",
            "Identifiquei o médio e escrevi a forma ‘todo M é P; todo S é M; logo todo S é P’.",
            "Distingui a necessidade da conclusão da justificativa de cada premissa.",
          ],
          reflection:
            "Retome seu argumento sobre a virtude. Escreva a objeção mais forte a uma de suas premissas; depois diga se precisa corrigi-la ou defendê-la por uma razão adicional.",
          source:
            "Exposição e exemplos autorais. Orientação clássica: Aristóteles, Primeiros Analíticos I, 1 e 4. Não se atribuem estes exemplos ao texto de Mário Ferreira dos Santos.",
        },
      },
      {
        id: "log-validade",
        title: "Validade, verdade e o alcance de uma prova",
        concepts: ["Validade", "Verdade das premissas", "Argumento sólido"],
        body: "Uma inferência é válida quando, se suas premissas fossem verdadeiras, a conclusão teria de ser verdadeira. Isso não afirma que as premissas são de fato verdadeiras. Um argumento sólido tem forma válida e premissas verdadeiras. A verdade de uma conclusão também não prova que o argumento usado para defendê-la seja válido: ela pode ter sido alcançada por um caminho inadequado.",
        exercise:
          "Compare A: ‘Todo homem é mortal; Sócrates é mortal; logo Sócrates é homem’ com B: ‘Todo peixe é mamífero; todo salmão é peixe; logo todo salmão é mamífero’. Para cada um, avalie separadamente a validade e a verdade das premissas. No B, use a classificação biológica usual. Justifique antes de escolher uma alternativa sobre B.",
        options: [
          {
            text: "B é inválido, porque sua conclusão é falsa.",
            correct: false,
            why: "Uma conclusão falsa pode resultar validamente de uma premissa falsa. Em B, a ligação segue a forma Barbara; o defeito está na primeira premissa.",
          },
          {
            text: "B é válido, mas tem a primeira premissa falsa; portanto não é sólido.",
            correct: true,
            why: "Todo peixe é mamífero é falso na classificação biológica usual; todo salmão é peixe é verdadeiro. Se ambas fossem verdadeiras, a conclusão decorreria necessariamente. Por isso a forma é válida, embora o argumento não seja sólido.",
          },
          {
            text: "B é sólido, porque segue a forma Barbara.",
            correct: false,
            why: "Barbara garante a validade da forma, não a verdade das premissas. A primeira premissa de B é falsa, o que impede chamá-lo sólido.",
          },
        ],
        study: {
          objective:
            "Diagnosticar um argumento inválido com premissas verdadeiras e um válido com premissa falsa, sem transformar uma dessas avaliações na outra.",
          sections: [
            {
              title: "Duas avaliações independentes",
              text: "A pergunta sobre verdade examina o que cada proposição afirma do objeto. A pergunta sobre validade examina a consequência: concedidas as premissas, seria possível a conclusão ser falsa? Uma conclusão verdadeira pode aparecer em uma inferência inválida. Já numa inferência válida não podem coexistir premissas todas verdadeiras e conclusão falsa. Esse limite é um critério para testar o raciocínio, não uma licença para presumir que toda afirmação favorável à nossa posição é verdadeira.",
            },
            {
              title: "Um caso com premissa falsa",
              text: "Considere ‘todo livro é feito de metal; todo missal é livro; logo todo missal é feito de metal’. A forma é Barbara: se as duas premissas fossem verdadeiras, a conclusão teria de valer. Na realidade, a primeira é falsa. É preciso recusar aquela premissa para que o exemplo deixe de funcionar como prova sobre os missais. Dizer apenas ‘a conclusão é falsa, logo o argumento é inválido’ mistura os níveis que estamos aprendendo a separar.",
            },
            {
              title: "O que sua crítica permite concluir",
              text: "Mostrar uma premissa falsa retira daquela inferência a força de provar sua conclusão. Não prova automaticamente que a conclusão seja falsa em qualquer outro argumento. Mostrar uma forma inválida também não é refutar a tese por todas as razões possíveis. No debate filosófico e no estudo da fé, seja exigente com suas próprias razões: uma convicção não ganha sustentação por ter sido defendida com um salto inferencial. Procure um argumento melhor ou reconheça o ponto ainda não estabelecido.",
            },
          ],
          argument: {
            premises: ["Todo peixe é mamífero.", "Todo salmão é peixe."],
            conclusion: "Logo, todo salmão é mamífero.",
            analysis:
              "B segue Barbara e é válido. Na classificação biológica usual, a primeira premissa é falsa e a segunda verdadeira; o argumento não é sólido. A, retomado da primeira unidade, possui premissas verdadeiras e é inválido: ser mortal não distingue o homem dos demais mortais. Nenhuma das duas avaliações dispensa explicitar qual nível está sob exame.",
          },
          criteria: [
            "Avaliei forma e verdade das premissas separadamente em A e B.",
            "Construí ou expliquei um contraexemplo formal para A e reconheci Barbara em B.",
            "Distingui negar a força de uma prova de negar por qualquer razão sua conclusão.",
          ],
          reflection:
            "Construa um novo argumento válido com uma premissa falsa e outro inválido com premissas verdadeiras. Troque os conteúdos dos exemplos da aula, conserve as formas e explique por que as classificações permanecem. Revise sua resposta inicial de log-1 à luz do que aprendeu.",
          source:
            "Exposição, exemplos e critérios autorais. Orientação clássica: Aristóteles, Primeiros Analíticos I, 1 e 4; Segundos Analíticos I, 2, sobre as exigências da demonstração. A distinção é ensinada aqui sem reproduzir traduções modernas.",
        },
      },
    ],
  },
  {
    id: "platao",
    title: "Platão",
    latin: "Plato",
    prereq: "logica",
    summary: "As Formas, a alma e o diálogo socrático, lidos nos próprios termos de Platão.",
    lessons: [
      {
        id: "pla-1",
        title: "Opinião e conhecimento",
        concepts: ["Doxa", "Episteme", "Linha dividida"],
        body: "Na República, Platão distingue a opinião, que versa sobre o sensível e mutável, do conhecimento, que versa sobre o inteligível e imutável. As Formas são, para Platão, realidades separadas, das quais as coisas sensíveis participam. Leia Platão primeiro como Platão: a separação das Formas é tese dele, não uma metáfora. Só depois compare: São Tomás, seguindo Aristóteles, não admite Formas subsistentes separadas das coisas materiais, mas situa as razões exemplares no intelecto divino.",
        exercise:
          "Formule com suas palavras por que Platão julga que o sensível não pode ser objeto de ciência. Depois, escreva uma objeção aristotélica.",
      },
    ],
  },
  {
    id: "aristoteles",
    title: "Aristóteles",
    latin: "Aristoteles",
    prereq: "logica",
    summary: "Substância, causas, ato e potência: a filosofia da natureza e do ser.",
    lessons: [
      {
        id: "ari-1",
        title: "As quatro causas",
        concepts: ["Material", "Formal", "Eficiente", "Final"],
        body: "Na Física e na Metafísica, Aristóteles afirma que conhecer é conhecer pelas causas. A causa material é aquilo de que algo é feito; a formal, o que algo é; a eficiente, o que o produz; a final, aquilo para o qual existe. A causa final não exige consciência: a natureza age em vista de um fim. Note a diferença em relação a Platão: a forma está na coisa, não separada dela.",
        exercise:
          "Aplique as quatro causas a uma árvore. Qual delas parece mais difícil de defender diante de um interlocutor moderno, e por quê?",
      },
    ],
  },
  {
    id: "metafisica",
    title: "Metafísica",
    latin: "Metaphysica",
    prereq: "aristoteles",
    summary: "Ente, essência e existência; ato e potência.",
    lessons: [
      {
        id: "met-1",
        title: "Ato e potência",
        concepts: ["Mudança", "Ato", "Potência"],
        body: "Parmênides negava a mudança: o ser não pode vir do não-ser. Aristóteles responde distinguindo o ser em ato do ser em potência: a semente é árvore em potência. A mudança é a passagem da potência ao ato, que exige algo já em ato. São Tomás desenvolverá a distinção real entre essência e ato de ser (esse) nas criaturas, tese que vai além do texto aristotélico.",
        exercise:
          "Reconstrua o argumento de Parmênides em forma silogística e mostre em qual premissa Aristóteles introduz uma distinção.",
      },
    ],
  },
  {
    id: "patristica",
    title: "Patrística",
    latin: "Patres",
    summary: "Agostinho, Atanásio e João Damasceno: fé que busca inteligência.",
    lessons: [
      {
        id: "pat-1",
        title: "Agostinho: crede ut intelligas",
        concepts: ["Iluminação", "Fé e razão", "Interioridade"],
        body: "Agostinho ensina que a fé precede e prepara a compreensão, sem dispensá-la. Contra os céticos acadêmicos, mostra que quem duvida sabe que duvida, e portanto existe. Atanásio, em Sobre a Encarnação do Verbo, defende a divindade do Filho contra o arianismo. João Damasceno, na Exposição da Fé Ortodoxa, sistematiza a tradição grega e será muito citado por São Tomás.",
        exercise:
          "Explique o argumento 'si fallor, sum' e compare-o, com cautela histórica, ao cogito de Descartes.",
      },
    ],
  },
  {
    id: "tomista",
    title: "Introdução Tomista",
    latin: "Introductio ad Thomam",
    prereq: "metafisica",
    summary: "O método da questão disputada e as grandes teses de São Tomás.",
    lessons: [
      {
        id: "tom-1",
        title: "Como ler um artigo da Suma",
        concepts: ["Videtur quod", "Sed contra", "Respondeo", "Ad primum"],
        body: "Cada artigo da Suma começa com uma pergunta e apresenta objeções que parecem provar o contrário da posição do autor. Segue-se o 'sed contra', normalmente uma autoridade. No 'respondeo', São Tomás expõe sua solução, com distinções. Por fim, responde a cada objeção. O método exige levar a sério a posição adversária: quem não sabe formular a melhor objeção ainda não compreendeu a questão.",
        exercise:
          "Escolha uma tese em que você acredita e escreva a objeção mais forte possível contra ela.",
      },
    ],
  },
];

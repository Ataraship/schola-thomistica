import { PLATO_LESSONS } from "@/data/plato";
import { ARISTOTLE_LESSONS } from "@/data/aristotle";
import { METAPHYSICS_LESSONS } from "@/data/metaphysics";

export type LessonStudy = {
  objective: string;
  sections: { title: string; text: string }[];
  argument: { premises: string[]; conclusion: string; analysis: string };
  criteria: string[];
  reflection: string;
  source: string;
  referenceIds: string[];
  comparison?: {
    caption: string;
    columns: [string, string, string];
    rows: [string, string, string][];
    note: string;
  };
  practice?: { href: string; label: string };
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
      "Conceito → juízo → definição → silogismo → validade → falácias → dialética: justificar e revisar o próprio juízo.",
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
          referenceIds: ["REF-2026-01"],
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
          referenceIds: ["REF-2026-01"],
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
          referenceIds: ["REF-2026-01"],
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
          referenceIds: ["REF-2026-01"],
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
          referenceIds: ["REF-2026-01"],
          source:
            "Exposição, exemplos e critérios autorais. Orientação clássica: Aristóteles, Primeiros Analíticos I, 1 e 4; Segundos Analíticos I, 2, sobre as exigências da demonstração. A distinção é ensinada aqui sem reproduzir traduções modernas.",
        },
      },
      {
        id: "log-falacias",
        title: "Falácias: diagnosticar e corrigir uma razão",
        concepts: ["Equivocação", "Relevância", "Reconstrução do argumento"],
        body: "Uma falácia parece oferecer uma boa razão, mas falha no apoio à conclusão. Dar um nome ao defeito não basta: explique onde ele ocorre, por que importa e como corrigir a passagem. Uma falácia pode ser cometida sem intenção de enganar. Descobri-la também não demonstra, por si só, que a conclusão seja falsa ou que o interlocutor seja desonesto.",
        exercise:
          "Examine A: ‘Todo banco, no sentido de instituição financeira, realiza operações financeiras; este assento é um banco, no sentido de mobiliário; logo este assento realiza operações financeiras’. Explique o defeito sem apenas nomeá-lo e reescreva as premissas com termos inequívocos. Depois compare B: ‘Esse autor é vaidoso, logo sua demonstração é falsa’ com C: ‘O catalogador especializado examinou a escrita e o material do manuscrito; seu parecer é uma razão inicial para investigar a data proposta’. Indique o que falta a B e por que C não é automaticamente um erro por recorrer a alguém competente. Não trate C como certeza demonstrativa.",
        options: [
          {
            text: "A é válido, porque repete a palavra banco nas duas premissas.",
            correct: false,
            why: "O que conecta as premissas é um conceito usado no mesmo sentido, não a repetição de letras. Aqui banco designa objetos distintos.",
          },
          {
            text: "A muda o sentido de banco e não estabelece a ligação necessária à conclusão.",
            correct: true,
            why: "A primeira premissa fala de instituições financeiras e a segunda, de um assento. Ao explicitar os sentidos, desaparece a aparência de um termo médio comum. Isso é equivocar o termo, não refutar toda forma de silogismo.",
          },
          {
            text: "A é inválido apenas porque toda conclusão falsa torna inválido um argumento.",
            correct: false,
            why: "A unidade anterior mostrou argumentos válidos com premissa falsa. Aqui é preciso apontar a mudança de sentido que impede a inferência, em vez de usar só a falsidade da conclusão.",
          },
        ],
        study: {
          objective:
            "Localizar uma falha de apoio à conclusão, explicar seu mecanismo e revisar o argumento sem usar a classificação como ataque pessoal.",
          sections: [
            {
              title: "O diagnóstico vem depois da reconstrução",
              text: "Escreva primeiro o que se pretende concluir e quais razões foram oferecidas. Verifique se reconstruiu a posição que o outro realmente sustenta. Um espantalho troca uma tese por uma versão mais fácil de atacar: responder a ‘alguma consulta exige supervisão’ como se fosse ‘todo estudo deve ser proibido’ muda o objeto do debate. Um falso dilema trata duas opções como únicas sem justificar que esgotam as possibilidades. Antes de aplicar qualquer nome, mostre a tese substituída ou a alternativa que ficou indevidamente de fora.",
            },
            {
              title: "A mesma palavra pode esconder conceitos diferentes",
              text: "Na equivocação, a aparência de conexão depende de mudar o sentido de um termo. Não é errado que uma palavra tenha muitos sentidos; o defeito está em raciocinar como se o sentido permanecesse o mesmo. Em A, marque banco financeiro e banco-assento antes de desenhar a forma do argumento. A solução não é proibir a palavra: é manter um sentido em cada inferência ou oferecer uma razão adicional que realmente conecte os objetos. Se uma distinção destrói a ligação, a conclusão ainda precisa de outra prova.",
            },
            {
              title: "Relevância e autoridade precisam de contexto",
              text: "A vaidade de um autor não identifica um erro na demonstração que ele apresentou. Se a questão fosse a confiabilidade de um testemunho, fatos pertinentes sobre sinceridade e competência poderiam importar; ainda seria necessário mostrar sua ligação com o caso. De modo semelhante, um parecer especializado pode oferecer uma razão revisável quando há competência pertinente, evidências e possibilidade de exame. Não vira demonstração só pelo prestígio do especialista. No estudo católico, explicite também se está reconstruindo uma prova filosófica ou trabalhando com uma autoridade reconhecida como premissa teológica: esses usos pedem justificativas diferentes.",
            },
            {
              title: "Criticar também exige disciplina",
              text: "Após mostrar uma falha, diga exatamente o que ela retira do argumento. De ‘esta defesa não prova a tese’ não se segue ‘a tese contrária está provada’. Esse salto é às vezes chamado de falácia da falácia. Refaça a mesma exigência sobre uma opinião que você aprecia: se recusaria uma razão na boca do adversário, não a aceite apenas porque agora favorece sua conclusão. Uma boa crítica propõe um reparo, procura evidência ou reconhece o ponto ainda em aberto.",
            },
          ],
          argument: {
            premises: [
              "Todo banco, no sentido de instituição financeira, realiza operações financeiras.",
              "Este assento é um banco, no sentido de mobiliário.",
            ],
            conclusion: "Logo, este assento realiza operações financeiras.",
            analysis:
              "A usa banco financeiro e banco-assento como se fossem um único termo médio. Ao explicitar os dois conceitos, percebe-se que as premissas não ligam o assento a operações financeiras. A inferência é inválida por equivocação. Em B, uma característica pessoal não refuta a demonstração sem uma razão pertinente. Em C, competência e exame de evidências podem oferecer apoio inicial revisável; é preciso investigar métodos, razões e objeções ao parecer. Nem toda referência a autoridade tem a mesma função ou o mesmo valor.",
          },
          criteria: [
            "Reconstruí a tese e indiquei o ponto exato em que o apoio falha.",
            "Mostrei os dois sentidos de banco e expliquei por que não constituem um termo médio comum.",
            "Distingui um ataque pessoal de uma crítica pertinente e um parecer revisável de uma demonstração.",
            "Corrigi a razão ou reconheci a lacuna sem concluir que toda tese mal defendida seja falsa.",
          ],
          reflection:
            "Escolha uma afirmação com a qual concorda e formule uma defesa ruim dela. Diagnostique o defeito, depois ofereça uma razão melhor ou declare o que ainda precisa investigar. Escreva a objeção que seu argumento revisado ainda deve enfrentar.",
          referenceIds: ["REF-2026-01"],
          source:
            "Exposição, nomenclatura pedagógica e exemplos autorais. Consulta parcial: Aristóteles, Refutações sofísticas, capítulos 1 e 4, na compilação alemã Organon enviada pelo responsável, sobre refutações aparentes e equívocos da linguagem. Não se atribui a Aristóteles toda a terminologia atual desta aula nem se reproduz a tradução.",
          practice: {
            href: "/disputatio#sua-disputatio",
            label: "Examinar uma razão na Disputatio",
          },
        },
      },
      {
        id: "log-dialetica",
        title: "Dialética: da objeção ao juízo revisto",
        concepts: ["Éndoxa", "Objeção forte", "Concedo, nego, distingo"],
        body: "Nos Tópicos, Aristóteles distingue o raciocínio demonstrativo do dialético, que parte de opiniões reputadas, os éndoxa. Isso permite examinar problemas e dificuldades a partir de posições reconhecidas, sem fazer da popularidade uma prova da verdade. Nesta oficina, passamos desse exame à prática da questão disputada: compreender o argumento adversário, identificar o que ele atinge e responder com razões.",
        exercise:
          "Discuta ‘A fragilidade de um manuscrito basta, por si só, para proibir toda consulta?’. Defina o domínio e formule uma tese inicial. Apresente duas premissas, a melhor objeção e uma resposta. Considere o caso hipotético de um exemplar frágil que, segundo exame de conservação, admite uma consulta supervisionada sem dano: explique o que esse caso atinge e o que ele não permite generalizar. Conclua com um juízo revisto e diga que fato ou argumento o faria reconsiderar.",
        study: {
          objective:
            "Conduzir uma primeira disputatio, respondendo a uma objeção real e delimitando o alcance do próprio juízo.",
          sections: [
            {
              title: "Uma opinião reputada é um ponto de exame",
              text: "Aristóteles chama éndoxa às opiniões aceitas por todos, pela maioria ou pelos sábios, com distinções entre esses grupos. Partir delas numa discussão não é afirmar que toda maioria tem razão. A investigação torna visíveis tensões, consequências e dificuldades; não converte uma premissa aceita em verdade demonstrada. Em Tópicos I, 2, a dialética é apresentada como útil ao exercício, ao encontro com posições alheias e à investigação filosófica. Identifique sempre o que o interlocutor concede e o que ainda precisa ser defendido.",
            },
            {
              title: "A objeção deve atingir uma razão identificável",
              text: "Escreva a tese com alcance claro: toda consulta, alguma consulta ou uma consulta sob certas condições? Depois numere as premissas. A objeção mais útil não é a mais agressiva: é a que torna difícil manter uma premissa, a inferência ou a aplicação ao caso. Pergunte se o adversário reconheceria a versão que você escreveu. Quando o problema for uma afirmação universal, um contraexemplo pertinente pode bastar para rejeitá-la; ele não estabelece, sozinho, uma política completa para todos os casos.",
            },
            {
              title: "Conceder, negar e distinguir com razões",
              text: "Conceder é reconhecer uma afirmação ou dificuldade procedente. Negar exige explicar por que uma premissa ou inferência deve ser recusada. Distinguir é mostrar sentidos ou condições diferentes que mudam a avaliação. As três operações podem colaborar: concedo o dever de preservar; distingo consultas com riscos e condições diversos; nego que a fragilidade, isoladamente, já prove que toda consulta é incompatível com conservar. Essa resposta ainda depende de justificar os critérios e apurar os fatos. Pronunciar distingo não resolve a questão se a distinção não for pertinente.",
            },
            {
              title: "O juízo final pode ser mais limitado que o inicial",
              text: "Uma tese revista pode abandonar uma universal e explicar as condições em que a afirmação se sustenta. Isso pode ser progresso intelectual. Preserve o registro inicial para comparar o que mudou, qual objeção motivou a mudança e qual dúvida permanece. A passagem dos Tópicos à disputatio cristã envolve tradições e formas históricas diferentes; a atividade usa ferramentas em diálogo e não atribui a Aristóteles a estrutura de um artigo da Suma. A meta é justificar o próprio juízo, não reproduzir um modelo como fórmula de vitória.",
            },
          ],
          argument: {
            premises: [
              "Se toda consulta de manuscrito frágil fosse incompatível com conservá-lo, não existiria consulta de um exemplar frágil compatível com sua conservação.",
              "No caso hipotético proposto, existe uma consulta supervisionada de um exemplar frágil compatível com sua conservação.",
            ],
            conclusion:
              "Logo, no caso hipotético, não é verdade que toda consulta de manuscrito frágil seja incompatível com sua conservação.",
            analysis:
              "A existência de um caso contrário nega a universal. A segunda premissa é concedida no exercício fictício; numa biblioteca real, exigiria exame material e avaliação responsável. A conclusão não autoriza toda consulta, não mede sozinha o risco de outros exemplares e não fornece todos os critérios de uma política justa. Uma objeção pode aceitar a importância do acesso e exigir critérios mais seguros para avaliar danos. Responder a ela pede investigar esses critérios, em vez de trocar a universal inicial pela universal contrária.",
          },
          criteria: [
            "Defini a questão e distingui premissas concedidas de afirmações ainda não demonstradas.",
            "Formulei uma objeção que atinge uma premissa, inferência ou aplicação identificada.",
            "Concedi uma dificuldade real e justifiquei uma negação ou distinção pertinente.",
            "Comparei tese inicial e juízo revisto, delimitando a conclusão e a investigação seguinte.",
          ],
          reflection:
            "Releia sua tese inicial sem apagá-la. Na revisão, registre o que mudou e qual objeção produziu essa mudança; se a manteve, apresente a razão adicional que respondeu à dificuldade. Transfira a estrutura para uma questão de sua escolha na Disputatio, sem confundir acompanhar etapas com demonstrar a conclusão.",
          referenceIds: ["REF-2026-01"],
          source:
            "Exposição e caso autorais. Consulta parcial: Aristóteles, Tópicos I, 1–2, texto grego da edição Bekker (1837), no corpus First1KGreek. O roteiro de conceder, negar e distinguir é uma adaptação pedagógica da prática escolástica, não uma citação desses capítulos.",
          practice: {
            href: "/disputatio#sua-disputatio",
            label: "Escrever e revisar sua Disputatio",
          },
        },
      },
    ],
  },
  {
    id: "platao",
    title: "Platão",
    latin: "Plato",
    prereq: "logica",
    summary:
      "Opinião, conhecimento e investigação: ler a República e o Mênon antes de comparar escolas.",
    lessons: PLATO_LESSONS,
  },
  {
    id: "aristoteles",
    title: "Aristóteles",
    latin: "Aristoteles",
    prereq: "logica",
    summary: "Substância, causas, ato e potência: a filosofia da natureza e do ser.",
    lessons: ARISTOTLE_LESSONS,
  },
  {
    id: "metafisica",
    title: "Metafísica",
    latin: "Metaphysica",
    prereq: "aristoteles",
    summary: "Ente, essência e existência; ato e potência.",
    lessons: METAPHYSICS_LESSONS,
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

import type { Lesson } from "@/data/curriculum";

/** Original introductory exposition; primary-source locators are stated in the lesson. */
export const METAPHYSICS_LESSONS: Lesson[] = [
  {
    id: "met-1",
    title: "Ato e potência",
    concepts: ["Capacidade determinada", "Atualidade", "Mudança", "Sujeito e aspecto"],
    body: "Ato e potência permitem distinguir o que algo é ou exerce agora daquilo que pode ser ou exercer sob condições determinadas. Uma capacidade não desaparece só porque não está sendo exercida; tampouco qualquer coisa pode tornar-se qualquer outra. Na Física, Aristóteles examina sujeito, determinação e privação para compreender a mudança; na Metafísica, investiga os sentidos de potência e atualidade. O trabalho começa por explicar um caso concreto sem transformar essas distinções em palavras que dispensam razões.",
    exercise:
      "Um copista que sabe escrever interrompe o trabalho e depois o retoma sem reaprender. Uma madeira adequada pode receber a forma de uma estante, mas continua sem essa organização enquanto ninguém a trabalha. Uma semente viável pode germinar, mas pode também não encontrar as condições necessárias. Para cada caso, diga o que está em ato, qual capacidade determinada se considera e quais condições sua realização exige. Depois reconstrua a dificuldade sobre ser e não-ser discutida na Física I: a mudança exige vir do nada absoluto ou pode ser descrita como adquirir uma determinação que faltava? Se sua resposta antiga traz Parmênides, mantenha-a e distinga reconstrução didática de uma citação ou atribuição histórica a conferir.",
    options: [
      {
        text: "O copista perde necessariamente a habilidade sempre que para de escrever e a readquire sem aprender ao recomeçar.",
        correct: false,
        why: "O caso concede que a habilidade não foi perdida. A afirmação confunde possuir uma capacidade com exercê-la neste momento, precisamente o problema discutido em Metafísica Θ, 3.",
      },
      {
        text: "Possuir uma capacidade determinada e exercê-la agora são distintos; sua realização depende também das condições pertinentes.",
        correct: true,
        why: "O copista pode conservar a habilidade em repouso. A madeira exige um trabalho adequado, e a semente pode não germinar. Potência real não equivale a exercício presente nem garante um resultado futuro.",
      },
      {
        text: "Algo pode tornar-se qualquer outra coisa sempre que conseguimos imaginar uma história sobre essa transformação.",
        correct: false,
        why: "Imaginar um resultado não identifica a capacidade de um sujeito nem explica suas condições. É preciso investigar sua constituição, a determinação possível e os agentes envolvidos.",
      },
    ],
    study: {
      objective:
        "Distinguir capacidade, exercício e processo de mudança, identificando sujeito, determinação e condições; examinar uma inferência sem apresentá-la como solução de toda a metafísica.",
      sections: [
        {
          title: "O sujeito não é o nada absoluto",
          text: "Na Física I, 7, Aristóteles examina o exemplo de alguém que passa de não-músico a músico. O sujeito permanece, mas adquire uma determinação que antes não possuía. Não-músico não significa inexistente em todos os sentidos. A discussão de I, 8 enfrenta uma dificuldade dos antigos: se o que vem a ser já é, parece não precisar vir a ser; se não é, como viria do não-ser? A resposta exige distinguir em que sentido se diz ser e não-ser. Essa reconstrução não é uma transcrição de Parmênides, nem confunde geração natural com a questão teológica da criação.",
        },
        {
          title: "Uma potência é uma capacidade para algo",
          text: "Em Metafísica Θ, 1, Aristóteles começa pela potência como princípio de mudança em outro ou no mesmo enquanto outro, distinguindo poder agir e poder receber uma ação. Uma mesma pessoa pode agir sobre si sob aspectos diferentes; isso não significa produzir a mesma determinação que lhe falta simplesmente por já possuí-la no mesmo aspecto. Em qualquer caso, especifique: quem pode fazer ou receber o quê e em quais condições? A madeira adequada pode ser trabalhada; uma semente viável pode desenvolver-se. A simples ausência de uma prova de impossibilidade não estabelece que qualquer sujeito tenha qualquer capacidade.",
        },
        {
          title: "Interromper o exercício não é necessariamente perder a capacidade",
          text: "Em Θ, 3, Aristóteles critica a identificação entre poder e estar fazendo. Se um construtor só pudesse construir enquanto constrói, seria difícil explicar como conserva sua arte no intervalo e como recomeça sem adquiri-la novamente. Nosso copista é uma adaptação desse tipo de dificuldade. Isso não autoriza dizer que nenhuma capacidade se perde: doença, esquecimento ou alteração do sujeito podem exigir outra avaliação. O ponto é mais preciso: não exercer agora, por si só, não prova incapacidade.",
        },
        {
          title: "Atualidade não significa apenas agitação visível",
          text: "Em Θ, 6, a comparação entre quem vê e quem pode ver, ou entre construir e poder construir, ajuda a esclarecer os sentidos de atualidade. A analogia não apaga diferenças entre os casos. A madeira já é algo em ato, embora ainda possa receber a organização de um artefato. A habilidade adquirida de ler está presente, enquanto seu exercício pode permanecer em potência: quem não está lendo pode conservar a habilidade. Sempre acrescente o aspecto considerado. Ser capaz de aprender também não significa já dominar o conteúdo que se procura aprender.",
        },
        {
          title: "Capacidade ociosa, processo e término",
          text: "A definição do movimento em Física III, 1, conserva uma precisão decisiva: atualidade do que é potencial enquanto tal. Compare materiais que podem ser empregados numa construção, o construir em andamento e a obra acabada. A capacidade ainda não exercida não é o processo; a obra terminada também não é o construir em andamento. Quando se usa a fórmula introdutória passagem da potência ao ato, é necessário esclarecer o que ela pretende descrever. Não basta apontar um estado inicial e outro final sem investigar o processo e seus princípios.",
        },
        {
          title: "Explicar a mudança e delimitar a conclusão",
          text: "Aristóteles não precisa afirmar que o mesmo sujeito é quente e não-quente no mesmo sentido e sob o mesmo aspecto para descrever um aquecimento. Ele considera a determinação atual e a capacidade relativa a outra determinação, com condições e agentes apropriados. Uma objeção pergunta se falar de potência explica algo ou apenas renomeia o fato de que uma mudança pode ocorrer. Responda identificando critérios e condições independentes para atribuir a capacidade, e reconheça quando faltam. A distinção prepara questões tomistas sobre essência e ato de ser, mas não as resolve sozinha; as conclusões sobre o primeiro princípio exigirão argumentos próprios.",
        },
      ],
      comparison: {
        caption: "Um mesmo sujeito, capacidades e aspectos determinados",
        columns: ["Situação", "O que está presente", "Capacidade e realização"],
        rows: [
          [
            "Copista em repouso",
            "Habilidade adquirida; a cópia não está sendo executada.",
            "Exercer a escrita sem ter de reaprendê-la, se as condições permitirem.",
          ],
          [
            "Madeira adequada, ainda sem estante",
            "Material com propriedades determinadas.",
            "Receber a organização de uma estante mediante trabalho apropriado.",
          ],
          [
            "Semente viável",
            "Organismo em um estágio determinado de desenvolvimento.",
            "Germinar e desenvolver-se sob condições pertinentes; o resultado não está garantido.",
          ],
          [
            "Construção em andamento",
            "O construir está ocorrendo, mas a obra não está terminada.",
            "O construível está sendo realizado enquanto construível; não é mera capacidade ociosa.",
          ],
        ],
        note: "As analogias não tornam os processos idênticos. Uma semente não depende de um artífice no mesmo sentido em que uma estante depende de fabricação. Identifique o aspecto em cada afirmação e investigue as condições concretas.",
      },
      argument: {
        premises: [
          "Se só fosse possível possuir a habilidade de copiar enquanto se copia, o copista que interrompe a cópia não conservaria essa habilidade durante a pausa.",
          "No caso hipotético, o copista interrompe a cópia e conserva a habilidade durante a pausa, retomando-a sem reaprender.",
        ],
        conclusion:
          "No caso proposto, possuir a habilidade de copiar não é idêntico a exercê-la neste momento.",
        analysis:
          "A segunda premissa nega a consequência da hipótese da primeira; por isso a hipótese é rejeitada. O exemplo mostra por que distinguir possuir uma capacidade de exercê-la. Numa situação real, a conservação da habilidade exigiria razões e poderia ser contestada; ela não deve ser presumida se há indícios de perda. O caso não prova que qualquer transformação seja possível, que toda capacidade se realizará ou que todos os processos tenham a mesma explicação. Tampouco encerra a questão de como provar um primeiro princípio. O argumento é uma reconstrução pedagógica original inspirada na dificuldade de Θ, 3, não uma transcrição de todo o capítulo.",
      },
      criteria: [
        "Identifiquei o sujeito, a determinação atual e a capacidade considerada em cada exemplo.",
        "Distingui uma capacidade real de mera imaginação e de uma garantia sobre o futuro.",
        "Separei conservar a habilidade, exercê-la e concluir uma obra, sem confundir os aspectos.",
        "Reconstruí a dificuldade sobre ser e não-ser sem introduzir contradição no mesmo sentido.",
        "Enfrentei a objeção de que potência seria apenas um novo nome e delimitei o alcance do argumento.",
      ],
      reflection:
        "Compare seus três casos com a tese inicial de que mudar exigiria surgir do nada absoluto. Indique o que permanece, o que é adquirido e qual condição é necessária em cada caso. Depois apresente a objeção mais forte à sua própria atribuição de uma potência: que observação ou argumento mostraria que ela foi mal atribuída? Registre um juízo revisto sem apagar a resposta inicial.",
      source:
        "Exposição, quadro, exemplos e reconstrução autorais. Consulta parcial: Aristóteles, Física I, 7–8 e III, 1, no anexo espanhol traduzido por Guillermo R. de Echandía; Metafísica Θ (IX), 1, 3 e 6, tradução inglesa de Hugh Tredennick (1933–1935), corpus Perseus. As notas editoriais não são apresentadas como texto de Aristóteles. Não se reproduzem as traduções nem se atribui a esta aula uma exposição integral da metafísica aristotélica ou tomista.",
      referenceIds: ["aristoteles-fisica", "aristoteles-metafisica"],
      practice: {
        href: "/disputatio#sua-disputatio",
        label: "Disputar uma atribuição de potência",
      },
    },
  },
];

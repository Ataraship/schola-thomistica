import type { Lesson } from "@/data/curriculum";
import { ILLUMINATION_LESSON } from "@/data/augustine-illumination";

/** Original teaching material. Passages and limits of consultation are explicit below. */
export const PATRISTICS_LESSONS: Lesson[] = [
  {
    id: "pat-1",
    title: "Agostinho: crede ut intelligas",
    concepts: ["Fé e compreensão", "Testemunho", "Dúvida e existência", "Interioridade"],
    body: "Agostinho procura compreender a fé que professa e examina as razões pelas quais crê. Nas Confissões, reconhece o papel do testemunho na vida comum e revê objeções que dirigia à fé católica. Em A Cidade de Deus e A Trindade, examina certezas presentes na própria dúvida: o erro não pode eliminar a existência daquele que se engana. Esses percursos se relacionam em sua busca cristã da verdade, mas não são um único argumento que demonstre de uma vez toda a fé ou toda a natureza da alma.",
    exercise:
      "Explique o argumento conhecido como si fallor, sum e compare-o, com cautela histórica, ao cogito de Descartes. Explicite a hipótese de erro e o que ela permite concluir; não afirme que uma frase condicional prova, sozinha, que você está efetivamente enganado. Depois examine o testemunho: por que precisar confiar em relatos não torna todo relato verdadeiro? Separe as razões comuns para crer das premissas teológicas usadas por Agostinho ao falar da autoridade das Escrituras. Preserve sua resposta antiga e registre as mudanças na revisão.",
    options: [
      {
        text: "A frase condicional se me engano, existo demonstra, sozinha, que agora estou de fato enganado.",
        correct: false,
        why: "Uma condicional não afirma por si só o antecedente. O exame agostiniano mostra que a hipótese de erro não consegue refutar a existência de quem se engana; é preciso distinguir essa análise de afirmar um erro efetivo.",
      },
      {
        text: "A hipótese de erro não refuta minha existência enquanto me engano; outras conclusões sobre a alma exigem razões adicionais.",
        correct: true,
        why: "O argumento volta a hipótese de erro contra a tentativa de negar a existência daquele que se engana. Esta reconstrução não demonstra, sozinha, imortalidade, uma teoria completa da alma ou todas as afirmações recebidas por testemunho.",
      },
      {
        text: "Como a vida comum depende de testemunhos, qualquer tradição religiosa está demonstrada sem outras premissas.",
        correct: false,
        why: "A necessidade de testemunho contesta sua rejeição indiscriminada, mas não torna infalível qualquer testemunho. Nas Confissões, a aplicação à Escritura envolve também premissas sobre Deus e sua providência, que devem ser explicitadas.",
      },
    ],
    study: {
      objective:
        "Reconstruir o argumento da certeza na dúvida e a defesa do valor de crer, distinguindo seus contextos, premissas e alcances antes da comparação com Descartes.",
      sections: [
        {
          title: "Uma busca narrada diante de Deus",
          text: "As Confissões são uma narrativa retrospectiva em forma de oração. Agostinho não escreve como se não tivesse fé ou pudesse demonstrar todo o conteúdo cristão apenas a partir de uma experiência isolada. Em VI, 4–5, recorda dificuldades, reconhece interpretações erradas que atribuía à Igreja e revê sua atitude diante de crer. A compreensão pode corrigir uma objeção, aprofundar uma crença e tornar explícita uma razão. Retirar uma objeção infundada, porém, não equivale a demonstrar todas as afirmações de uma tradição.",
        },
        {
          title: "Testemunho e premissas teológicas",
          text: "Agostinho considera a confiança em relatos sobre o passado, lugares não visitados, amigos, médicos e a própria origem familiar. Não presenciar algo não basta para rejeitá-lo. Esse argumento rebate uma censura indiscriminada ao ato de crer. Ao aplicá-lo às Escrituras, já crê que Deus existe e cuida dos humanos: julga que Deus não lhes concederia tamanha autoridade se não quisesse ser crido e procurado por elas. Preserve sua posição afirmativa, tornando visíveis essas premissas adicionais. Pergunte pela competência, sinceridade, evidência e coerência de um relato sem presumir que toda crença seja infalível ou que todo testemunho seja inútil.",
        },
        {
          title: "A hipótese de erro e quem se engana",
          text: "Em A Cidade de Deus XI, 26, a reflexão sobre existir, conhecer a própria existência e amá-la aparece no contexto da imagem da Trindade na criatura. Agostinho responde à dificuldade de poder estar enganado: para que eu me engane, devo existir. A hipótese que pretendia remover a certeza não consegue fazê-lo nesse caso. O trecho não se limita a reunir dados dos sentidos, nem identifica a criatura com Deus. A reflexão sobre a imagem divina e suas relações possui um contexto teológico maior que a inferência aqui reconstruída.",
        },
        {
          title: "Distinguir a certeza mínima das conclusões seguintes",
          text: "Em A Trindade X, 10, 14, Agostinho relaciona duvidar a viver, recordar, entender, querer, pensar, saber e julgar. A tentativa de duvidar envolve operações que não são simplesmente anuladas pela dúvida. Uma objeção forte pergunta se o argumento explica a natureza do sujeito ou apenas assegura que não se pode ter engano sem existência. Distinga essas questões. Agostinho desenvolve sua discussão da mente em outros passos; reconhecer isso permite delimitar esta aula sem atribuir à pequena reconstrução tudo o que a obra pretende demonstrar.",
        },
        {
          title: "Comparar o papel do argumento em Descartes",
          text: "No Discurso do método, parte IV, Descartes relata a busca de um primeiro princípio que resista à dúvida sobre sentidos, raciocínios e sonhos. Reconhece que, ao pensar que tudo é falso, precisa existir como aquele que pensa. O passo tem semelhança com a resistência da existência à hipótese de erro em Agostinho. Compare também a função nos textos: a reflexão sobre criação e imagem da Trindade, de um lado, e a procura cartesiana de um primeiro princípio para sua filosofia, de outro. As conclusões cartesianas seguintes sobre a natureza da mente pedem exame próprio; uma semelhança não estabelece identidade dos projetos nem influência histórica direta.",
        },
        {
          title: "Uma resposta que admite objeções reais",
          text: "A objeção pode atingir a premissa de que enganar-se exige alguém que se engane, ou a passagem de uma certeza presente a uma descrição duradoura da pessoa. Responda ao ponto indicado. É legítimo pedir que o defensor explique o sujeito de que fala, sem fingir que uma dificuldade sobre a natureza da alma refutou automaticamente toda certeza de existência. Do mesmo modo, a defesa do testemunho não permite saltar da necessidade de confiar à verdade de qualquer doutrina. A revisão deve dizer o que foi estabelecido, por quais razões e o que permanece por investigar.",
        },
      ],
      comparison: {
        caption: "Crer, duvidar e reconhecer a própria existência · contextos de leitura",
        columns: ["Passagem", "Questão examinada", "Alcance a justificar"],
        rows: [
          [
            "Confissões VI, 4–5",
            "Como reconhecer razões para crer sem ter presenciado tudo?",
            "Testemunho não deve ser rejeitado indiscriminadamente; a aplicação à Escritura explicita outras premissas.",
          ],
          [
            "A Cidade de Deus XI, 26",
            "A hipótese de erro elimina a existência de quem se engana?",
            "A certeza de existir resiste a essa hipótese, no contexto de uma reflexão sobre a imagem divina.",
          ],
          [
            "A Trindade X, 10, 14",
            "O que a própria dúvida envolve?",
            "Vida e operações da mente são reconhecidas no ato de duvidar; outros passos investigam sua natureza.",
          ],
          [
            "Discurso do método IV",
            "Que primeiro princípio pode resistir à dúvida metódica?",
            "A existência daquele que pensa é tomada como primeiro princípio; as conclusões seguintes exigem novo exame.",
          ],
        ],
        note: "O quadro compara argumentos em contextos identificados. As reconstruções desta aula são autorais; fórmulas semelhantes não substituem a leitura das premissas e da finalidade de cada passagem.",
      },
      argument: {
        premises: [
          "Quem se engana precisa existir para estar enganado.",
          "Admita, para examinar a objeção, que eu esteja enganado quando julgo que existo.",
        ],
        conclusion:
          "Mesmo nessa hipótese, eu existo enquanto me engano; a hipótese de erro não refuta minha existência.",
        analysis:
          "A segunda premissa é uma hipótese examinada, não a afirmação de que algum erro efetivo já foi demonstrado. Sob essa hipótese, a primeira exige a existência daquele que se engana. Assim, tentar usar o erro para negar a existência não tem o resultado pretendido. Esta reconstrução didática não pretende formalizar toda a reflexão de Agostinho: a certeza na própria dúvida e as operações da mente merecem exame adicional. Não se segue apenas dessas duas premissas uma identidade pessoal completa, a imortalidade da alma ou a verdade de todas as crenças de quem argumenta. Uma objeção pertinente deve indicar qual premissa ou passagem contesta.",
      },
      criteria: [
        "Distingui narrativa de conversão, razões para testemunho e premissas teológicas sobre a Escritura.",
        "Reconstruí a hipótese de erro sem confundir uma condicional com a afirmação de seu antecedente.",
        "Delimitei a certeza de existência e explicitei uma objeção ao argumento ou a suas extensões.",
        "Comparei o papel dos argumentos nos textos de Agostinho e Descartes sem identificar automaticamente seus projetos.",
      ],
      reflection:
        "Volte à resposta inicial sobre si fallor, sum. Registre uma premissa que agora explicitaria, a objeção mais forte e sua resposta. Depois escolha um testemunho em que confia: exponha razões e limites dessa confiança e diga o que mudaria seu juízo. Na comparação histórica, separe o que as passagens consultadas mostram de uma influência entre autores que ainda precisaria documentar.",
      source:
        "Exposição, quadro e reconstruções autorais. Consulta parcial: Agostinho, Confissões VI, 4–5, anexo português com tradução de J. Oliveira Santos e A. Ambrósio de Pina e revisão moderna identificada, comparado com E. B. Pusey, Gutenberg 3296; A Cidade de Deus XI, 26, volume inglês editado por Marcus Dods (1871), Gutenberg 45304; A Trindade X, 10, 14, tradução de Frei Agustino Belmonte, Paulus. Comparação com Descartes, Discurso do método IV, tradução de John Veitch, Gutenberg 59. A fórmula do título não é atribuída como citação literal das passagens de Confissões consultadas; comentários editoriais modernos não são falas dos autores.",
      referenceIds: ["agostinho", "agostinho-trindade", "descartes-metodo"],
      practice: {
        href: "/disputatio#sua-disputatio",
        label: "Disputar o alcance da certeza na dúvida",
      },
    },
  },
  ILLUMINATION_LESSON,
];

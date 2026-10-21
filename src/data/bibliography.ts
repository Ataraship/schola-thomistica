export type Availability = "referencia" | "resumo-demonstrativo";
export type ReferenceCategory =
  | "filosofia"
  | "patristica"
  | "espiritualidade"
  | "idiomas"
  | "paleografia"
  | "direito-canonico"
  | "economia"
  | "historia-das-ideias";
export type BibliographicReference = {
  id: string;
  autor: string;
  titulo: string;
  idioma: string;
  categoria: ReferenceCategory;
  cobertura: string;
  statusDisponibilidade: Availability;
  direitos: string;
  modulos: readonly string[];
  verificacao: "parcial";
  origemVerificacao: "anexo-inspecao-parcial" | "inventario" | "bibliografia-existente";
  notasDeVerificacao: readonly string[];
  papelCurricular: "fundamental" | "opcional" | "complementar";
};

/** Metadata only. Private PDFs and modern translations are not shipped or linked for download. */
export const NEW_REFERENCES: readonly BibliographicReference[] = [
  {
    id: "REF-2026-01",
    autor: "Mário Ferreira dos Santos",
    titulo: "Lógica e Dialética — 4ª edição (1959)",
    idioma: "Português",
    categoria: "filosofia",
    cobertura:
      "Arquivo de 289 páginas; sumário com conceito, juízo, definição, raciocínio, silogismo, verdade, conhecimento e método.",
    statusDisponibilidade: "referencia",
    direitos:
      "Edição e digitalização sem licença de redistribuição confirmada. Não incorporar páginas ou tradução ao aplicativo.",
    modulos: ["Lógica", "Disputatio"],
    verificacao: "parcial",
    origemVerificacao: "anexo-inspecao-parcial",
    papelCurricular: "fundamental",
    notasDeVerificacao: [
      "Conferidos folha de rosto, edição, sumário e contagem do PDF privado enviado. Não foi feita leitura integral.",
      "A sequência didática e os exemplos do aplicativo são autorais; não transcrevem o PDF.",
    ],
  },
  {
    id: "REF-2026-02",
    autor: "São Tomás de Aquino; tradução alemã de Josef Spindelböck",
    titulo: "Kommentar zur Nikomachischen Ethik des Aristoteles — Teil 2 (Buch 6 bis 10)",
    idioma: "Alemão",
    categoria: "filosofia",
    cobertura:
      "Arquivo de 378 páginas: livros VI–X da Ética, com texto de Aristóteles e comentário de Tomás em alemão. Não cobre os livros I–V.",
    statusDisponibilidade: "referencia",
    direitos:
      "Tradução contemporânea com direitos a verificar. Nenhum trecho extenso ou PDF redistribuído.",
    modulos: ["Ética", "Alemão intermediário", "Studium Fontium"],
    verificacao: "parcial",
    origemVerificacao: "anexo-inspecao-parcial",
    papelCurricular: "fundamental",
    notasDeVerificacao: [
      "Conferidos título, tradutor, indicação Buch 6 bis 10 e início do sexto livro no anexo. Consulta parcial.",
      "Aristóteles e o comentário tomista são vozes distintas; não apresentar esta parte como comentário integral aos dez livros.",
    ],
  },
  {
    id: "REF-2026-03",
    autor: "São João Damasceno; tradução e edição de Rafael Rodrigues",
    titulo: "Apologia contra os que condenam as imagens sagradas",
    idioma: "Português",
    categoria: "patristica",
    cobertura:
      "PDF de 77 páginas; tradução independente, com introdução moderna de uma catequese de Bento XVI.",
    statusDisponibilidade: "referencia",
    direitos:
      "Tradução independente sem licença de redistribuição confirmada. Usar exposição autoral e distinguir o texto antigo da introdução moderna.",
    modulos: ["Patrística", "Studium Fontium", "Disputatio"],
    verificacao: "parcial",
    origemVerificacao: "anexo-inspecao-parcial",
    papelCurricular: "fundamental",
    notasDeVerificacao: [
      "Conferidos folha de rosto, crédito editorial, introdução e contagem do anexo. Não foi feita leitura integral nem revisão da tradução.",
      "A atividade sobre imagens é autoral e não atribui a esta edição citações ou paginação de passagens não conferidas.",
    ],
  },
  {
    id: "REF-2026-04",
    autor: "Tomás de Kempis",
    titulo: "Imitação de Cristo — edição Paulus",
    idioma: "Português",
    categoria: "espiritualidade",
    cobertura:
      "Arquivo de 273 páginas; sumário sobre vida espiritual, interioridade, humildade, prudência e meditação.",
    statusDisponibilidade: "referencia",
    direitos: "Edição e tradução modernas. Nenhuma reprodução integral ou de páginas da edição.",
    modulos: ["Espiritualidade opcional", "Exame pessoal"],
    verificacao: "parcial",
    origemVerificacao: "anexo-inspecao-parcial",
    papelCurricular: "opcional",
    notasDeVerificacao: [
      "Conferidos sumário e contagem do PDF; identificação Paulus segue o inventário editorial. Não foi feita leitura integral.",
      "Leitura espiritual não substitui demonstração ou análise filosófica.",
    ],
  },
  {
    id: "REF-2026-05",
    autor: "Anke e Jörg Rautzenberg",
    titulo: "Aufbaukurs Deutsch — Teil 3, 2ª edição",
    idioma: "Alemão; apoio em português",
    categoria: "idiomas",
    cobertura:
      "O inventário registra 275 páginas e Lektionen 21–30, para estudo intermediário. O Teil 3 não é um curso básico A1.",
    statusDisponibilidade: "referencia",
    direitos:
      "Obra editorial protegida. Não copiar textos, exercícios ou páginas; OCR defeituoso requer conferência visual.",
    modulos: ["Alemão intermediário"],
    verificacao: "parcial",
    origemVerificacao: "inventario",
    papelCurricular: "opcional",
    notasDeVerificacao: [
      "O PDF do Teil 3 foi fornecido pelo responsável, porém não ficou acessível diretamente nesta etapa pelo limite de transferência de 32 MiB. Edição e cobertura seguem somente o inventário em docs/codex/acervo-e-plano-2026-10-20.md; não se afirma consulta direta ao volume.",
      "Os anexos denominados Aufbaukurs Teil 1 e ddce9614d92dbe45 têm 180 páginas e identificam Teil 1; não foram confundidos com este Teil 3.",
      "Não se atribui equivalência CEFR exata ao volume sem avaliação curricular.",
    ],
  },
  {
    id: "REF-2026-06",
    autor: "Atribuído a Sarah; autoria editorial a confirmar",
    titulo: "Alemão essencial — guia prático",
    idioma: "Português e alemão",
    categoria: "idiomas",
    cobertura:
      "O inventário descreve guia de 22 páginas com situações cotidianas e exercícios introdutórios; não equivale a um curso completo.",
    statusDisponibilidade: "referencia",
    direitos: "Autoria e licença ainda não confirmadas; não reproduzir a edição.",
    modulos: ["Alemão inicial"],
    verificacao: "parcial",
    origemVerificacao: "inventario",
    papelCurricular: "opcional",
    notasDeVerificacao: [
      "O PDF foi fornecido pelo responsável, porém não ficou acessível diretamente nesta etapa pelo limite de transferência de 32 MiB. Cobertura e atribuição seguem exclusivamente o inventário em docs/codex/acervo-e-plano-2026-10-20.md; não se afirma consulta direta ao guia.",
      "Os exemplos situacionais do aplicativo são originais, sem alegação de transcrição desta fonte.",
    ],
  },
  {
    id: "REF-2026-07",
    autor: "Autoria institucional a confirmar",
    titulo: "Handwriting Guide: German Gothic",
    idioma: "Inglês; exemplos de escrita alemã",
    categoria: "paleografia",
    cobertura: "Guia de 4 páginas sobre tipos góticos, caligrafia e leitura de documentos antigos.",
    statusDisponibilidade: "referencia",
    direitos:
      "Guia moderno; licença de redistribuição não confirmada. Não copiar tabelas ou imagens.",
    modulos: ["Leitura gótica eletiva"],
    verificacao: "parcial",
    origemVerificacao: "anexo-inspecao-parcial",
    papelCurricular: "opcional",
    notasDeVerificacao: [
      "Conferidos título, finalidade e contagem do anexo. Tabelas gráficas não foram transcritas.",
      "Paleografia e Fraktur não são um nível obrigatório de gramática ou pronúncia do alemão atual.",
    ],
  },
  {
    id: "REF-2026-08",
    autor: "Igreja Católica; compilação alemã de autoria editorial a confirmar",
    titulo: "Codex iuris canonici (deutsche Fassung) e constituições afins",
    idioma: "Alemão",
    categoria: "direito-canonico",
    cobertura:
      "Arquivo de 370 páginas: código de direito canônico e documentos como Divinus perfectionis magister, Sacrae disciplinae leges e Universi dominici gregis.",
    statusDisponibilidade: "referencia",
    direitos:
      "Texto e tradução exigem identificação editorial; verificar atualizações em fontes oficiais antes de ensinar direito vigente.",
    modulos: ["Leitura jurídica em alemão", "Direito canônico"],
    verificacao: "parcial",
    origemVerificacao: "anexo-inspecao-parcial",
    papelCurricular: "opcional",
    notasDeVerificacao: [
      "Conferidos título interno, índice e contagem. O nome do arquivo Catecismo em alemão não descreve seu conteúdo.",
      "Não é o Catecismo da Igreja Católica. O catecismo Loyola também enviado é outro documento e não substitui esta identificação.",
      "Não foi verificada a vigência de cada cânon nesta compilação histórica.",
    ],
  },
  {
    id: "REF-2026-09",
    autor: "Ludwig von Mises; tradução de Donald Stewart Jr.",
    titulo: "Ação Humana: um tratado de economia — Instituto Ludwig von Mises Brasil (2010)",
    idioma: "Português",
    categoria: "economia",
    cobertura:
      "Arquivo de 1.059 páginas; tratado de economia e teoria da ação humana, edição portuguesa identificada.",
    statusDisponibilidade: "referencia",
    direitos:
      "Tradução moderna. Licença de redistribuição não confirmada nesta entrega; nenhum conteúdo integral publicado.",
    modulos: ["Leitura complementar de economia", "Crítica de argumentos"],
    verificacao: "parcial",
    origemVerificacao: "anexo-inspecao-parcial",
    papelCurricular: "complementar",
    notasDeVerificacao: [
      "Conferidos folha de rosto, tradutor, editora, ano e sumário; consulta bibliográfica parcial, sem leitura integral.",
      "Leitura complementar: não constitui Magistério, doutrina católica oficial ou consenso científico obrigatório.",
    ],
  },
  {
    id: "REF-2026-10",
    autor: "Olavo de Carvalho",
    titulo: "O Jardim das Aflições — 3ª edição",
    idioma: "Português",
    categoria: "historia-das-ideias",
    cobertura:
      "O inventário descreve PDF de 327 páginas, ensaio de história intelectual, materialismo e religião civil.",
    statusDisponibilidade: "referencia",
    direitos: "Obra protegida; não reproduzir páginas ou conteúdo integral.",
    modulos: ["Leitura complementar de história das ideias", "Crítica de argumentos"],
    verificacao: "parcial",
    origemVerificacao: "inventario",
    papelCurricular: "complementar",
    notasDeVerificacao: [
      "Referência registrada no plano; nenhum PDF correspondente foi identificado entre os anexos transferidos. Não houve leitura direta nesta sessão.",
      "Examinar teses e evidências em confronto com fontes e posições divergentes; não apresentar como Magistério ou fatos incontroversos.",
    ],
  },
];

const legacy = (
  id: string,
  autor: string,
  titulo: string,
  cobertura: string,
  categoria: ReferenceCategory = "filosofia",
  statusDisponibilidade: Availability = "referencia",
): BibliographicReference => ({
  id,
  autor,
  titulo,
  idioma: "Original grego ou latino; tradução não incorporada",
  categoria,
  cobertura,
  statusDisponibilidade,
  direitos:
    "Obra antiga; os direitos de uma tradução ou edição moderna precisam de verificação própria.",
  modulos: ["Formação Fundamental"],
  verificacao: "parcial",
  origemVerificacao: "bibliografia-existente",
  notasDeVerificacao: [
    statusDisponibilidade === "resumo-demonstrativo"
      ? "O aplicativo contém estrutura e resumo didático, não o texto integral."
      : "Referência já existente no projeto; nenhum arquivo integral incorporado.",
  ],
  papelCurricular: "fundamental",
});
export const EXISTING_REFERENCES: readonly BibliographicReference[] = [
  legacy("platao-republica", "Platão", "República", "Justiça, alma e Formas; livros VI–VII."),
  legacy("platao-fedon", "Platão", "Fédon", "Imortalidade da alma e recordação."),
  legacy(
    "aristoteles-organon",
    "Aristóteles",
    "Órganon (Categorias, Analíticos)",
    "Lógica e demonstração.",
  ),
  legacy(
    "aristoteles-metafisica",
    "Aristóteles",
    "Metafísica",
    "Ente enquanto ente, substância, ato e potência.",
  ),
  legacy(
    "agostinho",
    "Santo Agostinho",
    "Confissões; A Cidade de Deus",
    "Interioridade, tempo e as duas cidades.",
    "patristica",
  ),
  legacy(
    "atanasio",
    "Santo Atanásio",
    "Sobre a Encarnação do Verbo",
    "A divindade do Verbo.",
    "patristica",
  ),
  legacy(
    "damasceno",
    "São João Damasceno",
    "Exposição da Fé Ortodoxa",
    "Síntese da tradição grega.",
    "patristica",
  ),
  legacy(
    "summa",
    "São Tomás de Aquino",
    "Summa Theologiae",
    "Estrutura das partes e resumo demonstrativo de um artigo.",
    "filosofia",
    "resumo-demonstrativo",
  ),
  legacy("de-ente", "São Tomás de Aquino", "De ente et essentia", "Ente, essência e existência."),
];
export const BIBLIOGRAPHY = [...EXISTING_REFERENCES, ...NEW_REFERENCES] as const;

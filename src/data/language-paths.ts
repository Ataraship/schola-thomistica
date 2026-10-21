export type GermanPath = {
  id: "inicial" | "intermediario" | "gotico";
  title: string;
  optional: boolean;
  purpose: string;
  references: readonly string[];
  note: string;
  reading: string;
  prompt: string;
  criteria: readonly string[];
};

export const GERMAN_PATHS: readonly GermanPath[] = [
  {
    id: "inicial",
    title: "Alemão inicial",
    optional: false,
    purpose:
      "Começar por cumprimentos, apresentação e frases curtas, sem exigir estudo prévio de filosofia.",
    references: ["REF-2026-06"],
    note: "Alemão essencial é um guia breve de apoio introdutório, não um curso completo. Sua ficha foi verificada apenas no inventário; o PDF enviado excedeu o limite de transferência.",
    reading: "Guten Tag. Ich heiße Anna. Ich lerne Deutsch. Das ist ein Buch.",
    prompt:
      "Apresente-se em duas frases, substituindo o nome. Identifique a frase que apresenta uma pessoa e a que aponta para um objeto. Explique qual verbo mudou e por quê.",
    criteria: [
      "Usei Ich heiße para dizer meu nome.",
      "Distingui uma apresentação de Das ist ein Buch.",
      "Registrei uma dúvida sem adivinhar uma regra pelo português.",
    ],
  },
  {
    id: "intermediario",
    title: "Alemão intermediário · leitura e argumento",
    optional: false,
    purpose:
      "Ampliar leitura, conectivos e justificativas em alemão; o percurso permanece livre, com apoio em português.",
    references: ["REF-2026-05", "REF-2026-02", "REF-2026-08"],
    note: "O plano registra Aufbaukurs Deutsch Teil 3 (Lektionen 21–30), que não é básico A1. O anexo Teil 1 recebido é distinto. O comentário de Spindelböck cobre somente VI–X; o Codex em alemão é direito canônico, não catecismo. As atividades abaixo são autorais, não extraídas desses livros.",
    reading:
      "Die Schülerin prüft ein Argument. Sie nennt die Gründe, weil eine Meinung allein nicht genügt. Vernunft bedeutet hier razão; Tugend, virtude; Wesen, essência; Sein, ser. Die Bedeutung hängt vom Zusammenhang ab.",
    prompt:
      "Localize a oração iniciada por weil e explique a razão que ela apresenta. Reescreva a ideia em duas frases independentes. Escolha Vernunft, Tugend, Wesen ou Sein e explique por que a equivalência portuguesa precisa de contexto.",
    criteria: [
      "Identifiquei a oração causal e a posição de genügt.",
      "Preservei o sentido ao separar as frases.",
      "Não tratei o vocabulário filosófico como tradução única para todo contexto.",
    ],
  },
  {
    id: "gotico",
    title: "Leitura gótica · eletiva histórica",
    optional: true,
    purpose:
      "Preparar a leitura de documentos históricos distinguindo tipografia, manuscrito e língua; não é etapa obrigatória da gramática atual.",
    references: ["REF-2026-07"],
    note: "Fraktur designa uma tradição tipográfica, enquanto escritas manuscritas têm convenções próprias. Este exemplo usa caracteres Unicode, não reproduz tabelas do guia nem ensina sozinho paleografia. Sem equivalência automática com um nível CEFR.",
    reading:
      "Heute leſen wir einen Text. No exemplo preparado para esta atividade, ſ é o s longo; não é a letra f nem um som novo.",
    prompt:
      "Transcreva a primeira frase usando a grafia atual. Explique o que a mudança de ſ para s altera e o que não altera. Antes de transcrever um manuscrito real, registre quais evidências gráficas e informações de época precisaria conferir.",
    criteria: [
      "Transcrevi leſen como lesen sem criar uma nova pronúncia.",
      "Distingui uma forma impressa de uma mão manuscrita.",
      "Reconheci os limites deste exemplo sem uma amostra histórica verificada.",
    ],
  },
];

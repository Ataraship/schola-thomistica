# Aristóteles: explicação causal, ato e potência

Continuação da formação sobre a base do PR #5. Duas aulas existentes são aprofundadas: `ari-1`, As quatro causas, e `met-1`, Ato e potência. Seus IDs, títulos, respostas e marcações de conclusão anteriores são mantidos; o currículo continua com treze lições.

## Conteúdo e conferência das fontes

A aula das quatro causas distingue sentidos explicativos do porquê, natureza e produção artesanal, organização de um vivente e contorno, princípio eficiente e condições, finalidade e benefício incidental. O estudante retoma o caso da árvore, identifica o processo, apresenta razões para cada atribuição e enfrenta uma objeção à finalidade. O argumento sobre bronze, estátua e sino tem conclusão delimitada: identificar o tipo de material não basta para responder a toda pergunta sobre o objeto. Não pretende refutar toda explicação material nem demonstrar teleologia universal.

A aula de ato e potência distingue capacidade determinada, exercício atual e processo de mudança. Os casos do copista, da madeira e da semente viável exigem explicitar sujeito, aspecto e condições. A exposição conserva a precisão de Física III, 1: movimento como atualidade do potencial enquanto tal, distinguindo capacidade ociosa, construção em andamento e término. A dificuldade sobre ser e não-ser é uma reconstrução a investigar, não uma citação literal de Parmênides. A aula prepara questões tomistas posteriores, sem apresentá-las como conclusões já demonstradas.

Consulta parcial efetiva:

- **Física I, 7–8; II, 1, 3, 8–9; III, 1.** Anexo de 321 páginas em **espanhol**, tradução e notas de Guillermo R. de Echandía. A folha inicial indica Gredos (1995)/Planeta De Agostini. Sumário, início em I, 1 e término em VIII, 10 foram conferidos para identificar a cobertura do arquivo. Isso não equivale a leitura ou revisão integral. Texto do autor e notas modernas foram distinguidos.
- **Metafísica Θ (IX), 1, 3 e 6.** Edição inglesa de Hugh Tredennick (1933–1935), corpus Perseus. O anexo `ANGAML-3` refere-se aos livros I–III e não foi tratado como fonte que contivesse Θ.

A ficha `aristoteles-fisica` foi acrescentada como referência catalogada, sem download. A ficha existente `aristoteles-metafisica` registra a consulta pública parcial de Θ. O campo tipado de origem da verificação distingue essa consulta da inspeção de anexos privados. Os nove IDs bibliográficos originais e os dez códigos REF-2026 foram conservados; o catálogo tem 21 referências.

Exposição, quadros, exercícios e reconstruções argumentativas são autorais. Nenhum PDF, imagem de página ou tradução foi incorporado. A revisão independente dos conceitos e das passagens não encontrou problemas materiais; sugestões de precisão sobre causa eficiente, habilidade e exercício foram incorporadas.

## Validação

- `bun run test`: **50 testes em onze arquivos**. Os sete novos testes cobrem resposta/conclusão antigas, revisão e critérios independentes após remontagem, análise após tentativa, feedback, quadros acessíveis, fontes e preservação dos treze IDs/títulos.
- `tsc --noEmit`, `bun run build` e ESLint dos cinco arquivos TypeScript/TSX alterados ou criados: aprovados.
- Chromium desktop 1280 × 900 e viewport móvel 390 × 844: exercícios, fontes específicas, respostas antigas, revisões/critério após recarga, retomada da aula exata e dados dos outros módulos preservados. Quadros com foco de teclado e rolagem interna, sem transbordamento da página ou exceções JavaScript. O contador continua separado das oficinas.
- Lint global mantém 71 erros de formatação e seis avisos preexistentes nos arquivos fora desta entrega; o lint de todos os arquivos alterados foi aprovado.
- Safari real de iPhone e WebKit não estão disponíveis neste ambiente. Sua validação permanece pendente antes de publicar.

Entrega em PR para revisão, sobre o PR #5 e suas bases #4, #3 e #2. Sem deploy ou integração em `main`. VoiceStudio, a navegação e os mecanismos de persistência não foram alterados nesta entrega.

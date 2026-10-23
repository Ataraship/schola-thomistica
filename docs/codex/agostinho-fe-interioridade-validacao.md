# Agostinho: fé, interioridade e iluminação

Continuação da formação sobre a base do PR #6. A aula `pat-1`, **Agostinho: crede ut intelligas**, recebe uma exposição completa, análise de argumento, comparação de fontes, alternativas comentadas e critérios de revisão. Seu ID e título permanecem os mesmos, conservando respostas e conclusões anteriores. A nova aula `pat-agostinho-iluminacao` aproxima a leitura de Agostinho da investigação do Mênon. O currículo passa de treze para quatorze lições; não se apresenta esta entrega como um curso completo de Patrística.

## Conteúdo e fontes

A primeira aula distingue as razões comuns para confiar em testemunhos das premissas teológicas sobre Deus, providência e autoridade das Escrituras em Confissões. A posição cristã do autor é afirmada em seus próprios termos. A certeza presente na dúvida é situada na reflexão sobre a imagem da Trindade: a hipótese de erro não consegue refutar a existência de quem se engana. Uma hipótese não demonstra que o aluno esteja efetivamente enganado; o pequeno argumento também não demonstra sozinho imortalidade ou uma teoria completa da alma. A comparação com Descartes identifica semelhanças e funções diferentes nos textos, sem presumir identidade dos projetos ou influência histórica direta.

A segunda aula distingue a rememoração de conhecimentos de uma existência anterior da aptidão da mente criada para o inteligível na explicação agostiniana. A comparação entre compreender uma relação geométrica e datar uma carta exige razões pertinentes a cada tarefa. Experiência, testemunho e estudo não são dispensados; a iluminação não é apresentada como intensidade subjetiva da convicção ou visão imediata da essência divina. O aluno deve reconstruir a posição, formular a melhor objeção e justificar sua revisão.

Consulta parcial efetiva:

- **Confissões VI, 4–5.** Anexo português de 687 páginas, com livros I–XIII. Créditos de tradução de J. Oliveira Santos e A. Ambrósio de Pina; revisão, atualização e notas de Souza Campos, E. L. de; Valdemar Teodoro Editor, Niterói, 2024. Passagens comparadas com a tradução inglesa de E. B. Pusey, Gutenberg 3296. A fórmula do título da aula não é atribuída como citação literal desses capítulos. A declaração editorial de permissão de cópia do anexo é registrada sem certificar sua origem ou alcance jurídico.
- **A Cidade de Deus XI, 26.** Volume I inglês editado por Marcus Dods, 1871, Gutenberg 45304. O contexto da imagem da Trindade e o argumento sobre existir foram conferidos. A comparação com Descartes numa nota editorial moderna não foi atribuída a Agostinho.
- **A Trindade X, 10, 14 e XII, 15, 24.** Anexo português de 472 páginas com livros I–XV; tradução e introdução de Frei Agustino Belmonte, O.A.R., Paulus; revisão e notas de Ir. Nair de Assis Oliveira, C.S.A. A CIP registra 1994 e o colofão digital ©2014, com eISBN 9788534938815: são dados distintos, sem número de edição confirmado. Texto de Agostinho e notas modernas foram separados.
- **Discurso do método, início da parte IV.** Tradução inglesa de John Veitch, Gutenberg 59. Comparação com a dúvida metódica, o primeiro princípio e seus desdobramentos, sem tratar a consulta parcial como revisão integral da filosofia cartesiana.
- **Mênon 80d–86c.** Comparação com o excerto de Maura Iglésias identificado e consultado na etapa de Platão; o anexo termina por volta de 86d.

Exposições, quadros, exercícios e reconstruções são autorais. Nenhum PDF, imagem de página ou tradução foi incorporado. A ficha legada `agostinho` foi precisada e as referências `agostinho-trindade` e `descartes-metodo` foram acrescentadas. Os nove IDs originais e os dez códigos REF-2026 permanecem; o catálogo tem 23 referências. Descartes figura como comparação complementar, sem atribuição de autoridade doutrinal.

A revisão independente das aulas e das passagens não encontrou problemas materiais; a sugestão de explicitar a premissa providencial de Confissões foi incorporada. A conferência bibliográfica confirmou os créditos, limites e dados editoriais registrados.

## Validação

- `bun run test`: **59 testes em doze arquivos**. Nove novos testes verificam preservação de resposta/conclusão, revisão, critérios e escolha após remontagem; isolamento da nova aula; tentativa antes da análise e feedback de todas as opções; quadros acessíveis; referências resolvidas e fichas sem downloads. O teste de compatibilidade foi atualizado para incluir a nova aula, mantendo todos os IDs e títulos anteriores.
- TypeScript (`tsc --noEmit`) e `bun run build`: aprovados.
- ESLint dos seis arquivos TypeScript/TSX desta entrega, Prettier dos sete arquivos e `git diff --check`: aprovados.
- Chromium desktop 1280 × 900 e viewport móvel 390 × 844: resposta antiga de `pat-1`, conclusão, feedback, referências, revisão e critérios independentes após recarga e retomada da aula exata. A aula nova começa sem resposta e não substitui a antiga. Registros alheios e rascunho da Disputatio foram preservados; o contador conta três lições de quatorze, sem incluir a oficina concluída.
- Quadros com nome acessível, foco de teclado e rolagem interna; capturas móveis inspecionadas, sem transbordamento da página ou exceções JavaScript. As fichas apontam consulta parcial, sem downloads de PDFs.
- Lint global mantém 71 erros de formatação e seis avisos nos mesmos arquivos anteriores, fora desta entrega.
- Safari real de iPhone e WebKit não estão disponíveis neste ambiente; sua validação permanece pendente antes de publicar.

Entrega em PR para revisão sobre o PR #6 e suas bases #5, #4, #3 e #2. Sem deploy ou integração em `main`. Infraestrutura de persistência, VoiceStudio, idiomas e Suma não foram alterados nesta entrega.

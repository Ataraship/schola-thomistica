# Platão: conhecimento e investigação

Continuação pedagógica sobre a base do PR #4. A unidade `pla-1`, Opinião e conhecimento, mantém ID e título, e passa de um parágrafo introdutório a uma aula de leitura e argumentação. A nova `pla-menon` investiga como procurar o que ainda não se conhece. São aulas introdutórias completas em seu recorte, não um curso completo de Platão nem textos integrais incorporados.

## Conteúdo e fontes consultadas

- **República V, 476c–480a; VI, 509d–511e.** Distinção entre apreciar exemplos e conhecer o belo em si; relação entre objeto e modo de conhecer; desenho e objeto geométrico; hipótese e exame dialético dos pontos de partida. Quadro semântico das quatro atividades da linha dividida, sem pretender representar comprimentos ou proporções. Exercício de reconstrução, objeção à exigência de estabilidade e revisão do juízo antes da comparação histórica entre escolas.
- **Mênon 80d–86c.** Paradoxo da investigação, saber parcial, aporia, rememoração e perguntas no episódio geométrico. O exercício testa as respostas de lado 4 e lado 3 para duplicar um quadrado de lado 2, oferece análise por diagonal e decomposição de áreas e distingue o resultado matemático da tese sobre o saber anterior da alma. A objeção da aprendizagem orientada e a cautela de Sócrates em 86b–c permanecem explícitas.

Na República, os localizadores de Stephanus foram conferidos no texto inglês de Paul Shorey (1935–1937), corpus Perseus; foi feita leitura comparada com Benjamin Jowett, Project Gutenberg 1497, e consulta parcial ao anexo português de 467 páginas. A tradução deste anexo não foi identificada com segurança e não recebeu atribuição inventada.

No Mênon, foram conferidos o crédito de Maura Iglésias e as editoras PUC-Rio/Loyola no anexo de 34 páginas, além das passagens usadas. O arquivo contém elementos editoriais e um excerto iniciado em 70a, terminando durante 86d. **Não é o diálogo integral**; as passagens posteriores de 97–98 não foram atribuídas a esse anexo. Nenhuma tradução, imagem de página ou PDF foi incorporado: a exposição, o quadro e as reconstruções são autorais.

O catálogo conserva os nove IDs originais e os dez `REF-2026-01` a `REF-2026-10`. Acrescenta uma referência de estudo separada, `platao-menon`, e atualiza a consulta parcial de `platao-republica`. O Mênon continua marcado como referência bibliográfica, sem download. Cada aula desenvolvida declara seus próprios `referenceIds`; o leitor deixou de encaminhar toda aula automaticamente à ficha de lógica.

## Continuidade e validação

A retomada de aulas foi corrigida: a trilha e a lição são selecionadas por parâmetros validados da URL. O cartão Continuar guarda a aula exata, em vez de apenas abrir `/formacao` na primeira lição de lógica. Links antigos sem parâmetros continuam válidos; seleções inválidas ou incompatíveis usam uma seleção válida. Recarregar e voltar/avançar no navegador preservam a seleção. IDs, conclusão anterior e respostas existentes foram mantidos, sem migração de armazenamento. O total passa a treze lições.

- `bun run test`: **43 testes em dez arquivos**, incluindo sete novos testes de persistência e independência de respostas/revisões, referências por aula, quadro acessível, integridade do excerto e URLs de retomada válidas e inválidas.
- `tsc --noEmit`, `bun run build` e ESLint dos sete arquivos TypeScript/TSX criados ou alterados: aprovados.
- Chromium desktop 1280 × 900 e viewport móvel 390 × 844: respostas antigas de `pla-1`, revisão das duas aulas após recarga, critérios, análise após tentativa, fichas específicas, ligação à Disputatio e contagem de lições preservada. Continuação da aula exata, recarga, voltar/avançar, links antigos e parâmetros incompatíveis conferidos. Sem exceções JavaScript ou transbordamento horizontal da página; o quadro permite rolagem interna e foco de teclado.
- Lint global: permanecem 71 erros de formatação e seis avisos preexistentes em arquivos fora desta entrega.
- Safari real de iPhone e WebKit não estão disponíveis neste ambiente. A validação nesse navegador permanece pendente antes de uma publicação.

Entrega em PR para revisão, dependente do PR #4 e de suas bases #3 e #2. Não houve deploy ou integração em `main`. VoiceStudio e os mecanismos de persistência gerais e da Disputatio não foram alterados.

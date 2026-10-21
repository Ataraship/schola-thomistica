# Entrega da issue #1: catálogo, lógica e Studium Fontium

A implementação segue `AGENTS.md`, a issue #1 e `acervo-e-plano-2026-10-20.md`. O PR limita-se à primeira entrega: não configura VoiceStudio, não importa o corpus da Suma e não publica os anexos privados.

## Funcional

- Catálogo tipado com os dez códigos `REF-2026-01` a `REF-2026-10`, preservando as nove referências existentes. Autor, idioma, assunto, cobertura, direitos, uso pedagógico, disponibilidade e verificação são explícitos. Todas as novas obras aparecem como referências catalogadas, sem acesso integral ou links para PDFs privados.
- Cinco unidades autorais de lógica: conceito, juízo, definição, silogismo e validade/verdade. Os IDs `log-1` e `log-2` e suas respostas são preservados. Há tentativa aberta, análise argumentativa, alternativas justificadas, revisão e critérios de autoavaliação. Os dois casos solicitados — inferência inválida com premissas verdadeiras e inferência válida com premissa falsa — são contrastados sem confundir validade e solidez.
- Oficina original sobre imagens, veneração e adoração em cinco etapas livres: Lectio, Quaestio, Argumentatio, Disputatio e Iudicium. Exposição autoral separada da referência moderna de Damasceno; respostas e autoavaliação persistem, sem nota filosófica automática.
- Alemão inicial, intermediário e leitura gótica eletiva: uma primeira atividade autoral por percurso, rascunhos independentes e referências corretamente classificadas. Os percursos não se apresentam como cursos completos ou certificação CEFR. Latim e inglês existentes permanecem independentes.
- Progresso local mantido na chave `schola-progress-v1`, com callbacks estáveis, preservação de campos legados, recuperação antes de substituir documentos ilegíveis e proteção de alterações entre abas após falha de gravação. A conclusão do Studium não aumenta indevidamente o contador de lições filosóficas.

## Conferência dos anexos

Foram informados 62 anexos nas duas mensagens: 54 transferências concluídas e oito bloqueadas pelo limite de 32 MiB. Há duplicatas e apresentações; não são 62 obras distintas. Os arquivos e o inventário local com hashes ficaram fora do checkout, em `/workspace/attachments` e `/workspace/library-files/acervo-privado`. Foram extraídos dados preliminares e consultadas parcialmente as fontes necessárias à identificação bibliográfica. Não houve leitura integral de todas as obras, revisão editorial das traduções nem cópia de seus conteúdos para o código.

Conferidos, entre outros, folha de rosto/sumário e contagem de Lógica e Dialética (289 páginas), comentário alemão à Ética (378, livros VI–X), Apologia de Damasceno (77), Imitação de Cristo (273), guia gótico (4), Codex em alemão (370) e Ação Humana (1.059). Os campos `origemVerificacao` distinguem consulta parcial de anexo e informação exclusiva do inventário.

Diferenças relevantes em relação ao plano:

- O Aufbaukurs enviado como Teil 1 tem 180 páginas, capa conferida visualmente e lições a partir da 1. O arquivo genérico `ddce9614d92dbe45.pdf` também identifica Teil 1. Nenhum foi apresentado como o Teil 3 de 275 páginas/Lektionen 21–30 registrado no plano. A ficha do Teil 3 permanece uma referência documental ainda não confrontada com seu exemplar.
- `document_compress 2.pdf` identifica Introdução ao Espírito da Liturgia, de Joseph Ratzinger/Bento XVI; não foi associado por suposição a outra obra.
- `ANGAML-3.pdf` identifica Metafísica, livros I–III, tradução de Lucas Angioni, e não a Metafísica inteira.
- O arquivo chamado Catecismo em alemão é uma compilação do código canônico; o Catecismo Loyola também enviado é outro documento. Nenhuma compilação histórica é tratada como certificação de legislação atualmente vigente.
- Alemão essencial/Sarah excedeu o limite de transferência; sua ficha baseia-se apenas no plano. O Jardim das Aflições não foi identificado entre os anexos transferidos e permanece informação do inventário.

Não transferidos por exceder 32 MiB: `suma-teolc3b3gica.zip`, `faf6d56f013857ac.pdf`, `document_compress.pdf`, `VoiceStudio-main.zip`, Schritte A1.2, Schritte A1.1, Grammatik aktiv A1–B1 e Alemão essencial/Sarah. Nenhum desses arquivos é necessário para compilar ou usar as atividades autorais desta entrega. Se uma futura tarefa exigir consulta direta, será preciso fornecer volumes ou excertos menores, sem presumir que o conteúdo foi lido.

## Validação e pendências

- Vitest (`bun run test`): 21 testes em cinco arquivos, incluindo classificação bibliográfica, alternativas, oficina, preservação de respostas, níveis de alemão e falhas de armazenamento.
- TypeScript: `tsc --noEmit` aprovado.
- Build: `bun run build` aprovado, incluindo cliente, SSR e worker Cloudflare.
- ESLint nos arquivos novos/alterados: sem erros. O lint global ainda encontra 89 erros de formatação e seis avisos em arquivos preexistentes que este PR não modifica; inclui arquivos de voz mantidos intactos.
- Verificações funcionais no Chromium: catálogo, raciocínio antes da análise, respostas antigas, persistência das cinco etapas, percursos alemães e contador separado. Viewport móvel 390 × 844 verificado.
- Safari real de iPhone não está disponível nesta máquina; o WebKit do Playwright também não está instalado. A emulação móvel no Chromium não equivale a um teste no Safari. Essa validação manual permanece pendente antes de uma publicação.

Não houve deploy nem alteração em branch publicada. O PR contém somente código, testes e metadados da primeira entrega; nenhum livro ou anexo privado faz parte do diff.

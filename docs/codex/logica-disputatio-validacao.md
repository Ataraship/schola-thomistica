# Da crítica de argumentos à primeira disputatio

Continuação do P1 de `acervo-e-plano-2026-10-20.md`, sobre a base do PR #3. Esta entrega acrescenta duas unidades autorais e desenvolve a prática de argumentação, mantendo a identidade visual existente.

## Aprendizagem e fontes

- `log-falacias`: reconstrução antes do diagnóstico; equivocação, espantalho, falso dilema, relevância de críticas pessoais, autoridade e alcance de uma refutação. O estudante explica e corrige a razão; distingue o parecer especializado revisável de uma demonstração. Há tentativa escrita antes da análise, alternativas justificadas, revisão e critérios explícitos.
- `log-dialetica`: éndoxa, premissas concedidas, objeção forte, concessão/negação/distinção e juízo revisto. O caso de consulta a um manuscrito frágil obriga a delimitar o alcance de um contraexemplo. Não se apresenta uma hipótese fictícia como evidência sobre acervos reais. A aula conduz à área de escrita da Disputatio.
- Disputatio: perguntas aplicáveis a qualquer questão, campo próprio de juízo revisto, comparação com a tese inicial e cinco critérios de autoavaliação. A marcação não gera nota ou certificação. O exemplo sobre percepção delimita sua conclusão: refutar um salto de alguns erros para uma negação universal não demonstra, sozinho, uma teoria positiva da certeza. A dificuldade sobre o critério de correção continua explícita.

Foram consultados parcialmente Aristóteles, _Refutações sofísticas_, capítulos 1 e 4, no anexo alemão `Aristoteles-Organon.pdf` (976 páginas), e _Tópicos_ I, 1–2, na edição grega Bekker (1837) do corpus First1KGreek. A consulta não equivale à leitura integral do Organon nem à revisão editorial da tradução alemã. As aulas, o exemplo e os exercícios são originais em português; não se reproduzem os textos consultados. A terminologia atual sobre falácias e o roteiro escolástico não são atribuídos integralmente aos capítulos aristotélicos.

## Conservação do trabalho do estudante

A Disputatio mantém a chave e o formato plano `schola-disputatio-v1`, incluindo os cinco campos antigos: `tese`, `premissas`, `objecoes`, `respostas` e `reflexao`. O novo campo `juizo-revisto` e as marcações `criterion:<id>` coexistem com eles. Campos adicionais desconhecidos são conservados. Ler a página não reescreve o documento.

As alterações são combinadas por campo com a versão mais recente do navegador; abas e componentes montados são sincronizados. Se a escrita falhar, o texto editado fica na página com aviso para copiar antes de sair. Após recuperar o acesso, uma nova edição tenta gravar também os campos pendentes, preservando mudanças de outros campos feitas por outra aba. Documentos ilegíveis recebem cópia de recuperação antes de serem substituídos; sem leitura ou backup possível, a substituição é recusada.

Os IDs e respostas das lições antigas, as oficinas e `schola-progress-v1` permanecem. O total de lições passa de dez para doze; os registros já concluídos são mantidos. Não há migração nem importação de respostas entre os dois armazenamentos.

## Validação

- `bun run test`: 36 testes em oito arquivos, incluindo compatibilidade dos cinco campos antigos, revisão/autoavaliação após remontagem, conservação de campos desconhecidos, erros de leitura/gravação, recuperação de documentos inválidos e combinação de edições pendentes com alterações de outra aba.
- `tsc --noEmit`, `bun run build` e ESLint dos oito arquivos TS/TSX criados ou alterados: aprovados.
- Lint global: 71 erros de formatação e seis avisos preexistentes nos arquivos fora desta entrega. Os 18 erros anteriores da rota Disputatio foram resolvidos na formatação do código refeito.
- Chromium em desktop 1280 × 900 e viewport móvel 390 × 844: navegação pelas novas aulas, tentativa antes da análise, ligação à Disputatio, edição/recarregamento com dados legados preservados, duas abas reais sincronizadas, recuperação após falha simulada de gravação e contador correto de lições. Sem transbordamento horizontal ou exceções JavaScript; a âncora móvel fica abaixo do cabeçalho.
- Safari real de iPhone e WebKit não estão disponíveis neste ambiente. Essa verificação continua pendente antes de publicar.

A integração VoiceStudio e o mecanismo geral de progresso não foram alterados. Nenhum anexo privado foi incluído no repositório. Entrega em PR para revisão, dependente dos PRs #2 e #3; sem deploy ou integração em `main`.

## Preparação técnica de 22/10/2026

A auditoria do head `8cbb383` reproduziu perda de uma cópia de recuperação quando duas corrupções distintas eram recuperadas no mesmo timestamp. A Disputatio agora acrescenta uma identidade aleatória de 128 bits ao prefixo legado de recuperação. Não substitui uma chave já ocupada; se a geração da identidade, a leitura ou a gravação falhar, conserva a raiz danificada e os textos pendentes com aviso. As chaves v1, os campos auxiliares, os cinco campos antigos, o juízo revisto e as cópias de recuperação anteriores permanecem.

Cinco novos testes cobrem timestamps repetidos, identidade ocupada, leitura negada, quota na cópia e indisponibilidade de aleatoriedade, incluindo a retomada posterior dos textos pendentes. O caso de timestamps repetidos falhou no código anterior e passou após a correção. O relatório externo desta preparação registra os gates e navegadores efetivamente executados no SHA final; os números e limitações da seção anterior são históricos. Safari real no iPhone e conferência visual no editor Lovable continuam pendentes. A possível colisão nas recuperações do progresso geral é dívida herdada de `main`, fora desta correção da Disputatio. Os PRs #5–#7 não recebem esta correção nesta etapa e precisarão de reconciliação autorizada posteriormente.

# Methodus Discendi — arquitetura e demonstração pedagógica

Base conferida antes do desenvolvimento: `393214dd54698276c6a0e449550319900e23c355`, merge do PR #10. Entrega para revisão em **PR DRAFT**, sem integração, deploy, publicação, VoiceStudio ou alteração no Lovable. Não inicia Germania.

## Auditoria e responsabilidades

Foram examinados AGENTS.md, o inventário curricular, os relatórios de formação, as duas oficinas Studium Fontium, Disputatio, idiomas, persistência local, CI, B1, inicialização do PR #9 e interface do PR #10.

O aplicativo já oferece leitura, perguntas abertas, critérios, conclusão declarada, navegação livre, respostas locais e journals por campo. Esses recursos continuam funcionando. Não é necessário substituir os componentes de aulas ou introduzir outro banco de dados.

- `src/lib/activities.ts`: união discriminada de atividades, avaliação objetiva, validação de registros, identidades de notas, histórico e calendário determinístico.
- `src/data/activities.ts`: dez atividades autorais e três percursos demonstrativos independentes, com níveis, unidades, lições de idioma, vocabulário, gramática, leitura e referências às atividades.
- `ActivityEditor`: controles nativos com rótulos; sem arrastar como único modo de responder.
- `ActivityWorkbench`: rascunho, critérios, feedback, registro de versões, comparação e histórico.
- `MethodusDiscendi`: seleção, retomada, estado declarado e agenda do percurso escolhido.
- `MethodusEntry`: disclosure acessível e carregamento sob demanda. Uma abertura nativa anterior ao bootstrap é respeitada após a hidratação.

As únicas inserções nas páginas existentes são o import e a entrada da oficina ao final de Formação Fundamental e Idiomas. Os textos anteriores não são reescritos. As oficinas antigas e a Disputatio não são substituídas por um formulário uniforme.

## Tipos e alcance real

O modelo e o editor contemplam múltipla escolha, associação, ordenação, lacunas, gramática, interpretação, identificação de erro, resposta aberta, construção de argumento, objeção, revisão e autoavaliação fundamentada.

Existem **dez atividades reais**, não dez novas lições da Formação Fundamental:

| Percurso  | Atividades demonstrativas                                                                           |
| --------- | --------------------------------------------------------------------------------------------------- |
| Latim     | sentido de pax; nominativo/genitivo singular de rosa                                                |
| Alemão    | presente de lernen com ich; associação de Buch/Wahrheit                                             |
| Inglês    | interpretação de texto autoral sobre pedir razões; revisão de concordância no presente              |
| Filosofia | validade/verdade/contraexemplo; objeção e resposta; revisão vinculada; autoavaliação com evidências |

Ordenação e resposta aberta genérica têm modelo, editor e testes com fixtures, sem inventar lições adicionais para preencher o catálogo. Interpretação e argumentação já usam o caminho de respostas abertas. Os três idiomas permanecem opcionais e independentes; nenhuma certificação de nível ou curso completo é declarada.

Exposições, frases e exercícios novos são autorais. Não foram consultados novos trechos dos anexos nem reproduzidos PDFs ou traduções modernas. As referências catalogadas continuam 23; a formação continua com 14 lições e as oficinas continuam duas.

## Filosofia: orientação sem julgamento automático

O aluno identifica tese, premissas e conclusão, separa validade de verdade, testa uma forma por contraexemplo, constrói uma inferência própria, enfrenta uma objeção e registra limites. A atividade sobre manuscritos distingue um contraexemplo à universal de uma autorização geral de consulta. Nomear uma falácia não substitui explicar onde o apoio falha.

Respostas abertas recebem sempre o resultado `ungraded`. Não se procura palavra-chave para lhes atribuir correção. Os critérios e a orientação são visíveis; preencher ou concluir uma atividade não certifica domínio. A autoavaliação pede uma evidência no próprio texto e um próximo passo verificável.

Registrar uma versão conserva uma cópia dos campos. A revisão exige uma versão registrada da análise de partida e inclui seu ID e uma cópia de suas respostas. Editar depois o rascunho inicial não modifica essa cópia nem apaga a versão anterior. Cada nova versão é um registro independente.

## Revisão programada verificável

Somente atividades objetivas entram no calendário. A avaliação compara alternativas, associações, posições ou formas aceitas; lacunas usam NFC, caixa e espaços externos, sem eliminar diacríticos ou diferenças morfológicas.

Um erro fica disponível para revisão imediatamente. Um acerto inicial agenda um dia; acertos de revisões devidas usam três, sete, quatorze e trinta dias, mantendo trinta como teto do intervalo. Dias significam períodos de 24 horas; o horário é apresentado no fuso do navegador. A agenda usa o relógio local, não um serviço remoto.

Acertos repetidos antes da data não aumentam o intervalo. Uma resposta idêntica à última não gera outro registro pelo botão, salvo uma revisão correta que já venceu. Erros e respostas anteriores continuam no histórico. Tentativas de outra revisão editorial são preservadas, mas não alimentam o calendário atual. Não há porcentagem de domínio, ranking ou nota calculada pelo número de cliques.

A agenda é atualizada na abertura, ao voltar à janela, em mudanças de visibilidade, ao registrar uma tentativa e pelo botão Atualizar agenda. Não há polling, espera artificial para liberar campos ou timer de gravação.

## Preservação e extensão compatível

Não há novo documento raiz, migração, exclusão ou alteração do esquema de progresso. A extensão usa **notas string já suportadas**, dentro do namespace `methodus:v1:`:

- `<atividade>:answer:<campo>`: um rascunho por campo, isolado no journal existente.
- `<atividade>:event:<identidade>`: JSON versionado de uma tentativa/versão, em nota própria.
- `<atividade>:completed`: conclusão explicitamente declarada, separada das conclusões curriculares.
- `selected:<percurso>`: atividade selecionada para retomada.

O prefixo completo antecede todos esses sufixos. As chaves v1, journals, espelhos, backups, IDs e respostas anteriores são mantidos. Os módulos `progress.ts`, `storage-lock.ts`, `disputatio-draft.ts`, os cinco testes B1 e os cinco testes de inicialização não são alterados.

Cada evento contém versão de envelope, atividade/revisão, identidade aleatória de 128 bits, timestamp, ordinal observado, respostas e resultado. O ordinal ordena sucessores conhecidos mesmo com relógio repetido ou regressivo. Eventos realmente concorrentes podem compartilhar ordinal; timestamp e identidade oferecem um desempate determinístico, sem alegar um relógio global. Uma identidade já presente bloqueia a gravação; falha de aleatoriedade não recorre a timestamp compartilhado. A aleatoriedade não é garantia matemática de unicidade.

Antes de integrar a oficina às rotas, os testes cobriram compatibilidade, parsing, recuperação, quota, leitura negada, corrupção, espelhos desatualizados, hidratação e versões preservadas. Registros de atividade inválidos ou de envelope futuro não são substituídos: seus bytes podem ser inspecionados, o rascunho continua editável, mas novos eventos e conclusão daquela atividade são suspensos. Não existe botão de limpeza automática.

O journal existente protege campos distintos entre abas, inclusive com um espelho v1 antigo. Para o mesmo campo, permanece a regra herdada da última gravação. Eventos independentes não disputam um único array de tentativas. Pendências continuam na sessão com aviso quando a gravação falha; encerrar forçadamente o navegador ainda pode perdê-las. Dados escritos em testes são exclusivamente sintéticos.

A seleção ativa é local à aba depois da inicialização. O registro compartilhado de seleção serve para retomada; um evento de outra aba não troca o formulário sob a digitação do estudante. Um teste reproduziu a troca na implementação inicial e passou após separar o estado ativo da preferência de retomada. Os campos salvos permanecem independentes da seleção.

## Responsividade e custo de carregamento

Reutilizam-se estilos, áreas seguras, foco, alvos de toque, movimento reduzido e navegação TV do PR #10. Os controles novos são radios, selects, inputs, textareas, botões e disclosures nativos. As teclas de edição continuam pertencendo aos campos; não se introduz uma nova interceptação global.

O build exploratório com import direto adicionava o conteúdo da oficina ao pacote inicial: aproximadamente 536,58 kB / 172,64 kB gzip. O carregamento sob demanda o separou: pacote principal de aproximadamente 502,78 kB / 162,35 kB gzip e módulo Methodus de 26,18 kB / 9,19 kB gzip. São medidas de artefatos exploratórios, não promessa de latência em hardware físico; o relatório externo registra o build final.

## Validação e limites de expansão

O relatório externo do PR registra o SHA final, comandos, CI, capturas, resultados por motor e manifesto de integridade. As regressões antigas devem manter suas asserções e timeouts. Ensaios exploratórios e falhas do harness ficam separados da execução final no commit publicado.

Após a correção da seleção entre abas, a suíte local passou com 149 testes em 24 arquivos, incluindo os 118 testes anteriores. Na exploração do WebKit houve um encerramento de página (`Page crashed`) durante a matriz da oficina aberta, sem exceção JavaScript registrada ou evidência de OOM no cgroup. Uma matriz isolada e, depois, uma rodada completa passaram com os mesmos timeouts. Os logs nativos foram preservados; a causa do encerramento não foi comprovada e não é atribuída à correção de seleção. O relatório final deve manter esse risco separado dos resultados aprovados no head do PR.

Chromium e WebKit em Linux, viewports e teclas emulados não homologam iPhone/iPad/Android físicos, Safari real, Tizen/webOS, controles remotos, leitores de tela ou zoom nativo. Continuam os limites do piso de compilação e de CSS moderno do PR #10.

Para cursos extensos, a primeira expansão deve produzir conteúdo revisado por unidade, com IDs/revisões estáveis, não multiplicar telas vazias. A arquitetura permite novos níveis e atividades independentes. Antes de um volume grande, será necessário medir o custo de leitura do armazenamento e o tamanho do histórico: notas e eventos ainda compartilham localStorage e sua quota; não há coleta automática nem exportação implementada. Não se promete armazenamento ilimitado.

Permanecem a dívida global de lint fora do diff e os limites documentados de persistência: recuperação do progresso por timestamp, abas antigas não cooperantes, edição simultânea do mesmo campo, convergência eventual e `beforeunload` de melhor esforço. B1 continua protegendo as recuperações da Disputatio. Nenhuma conta, backend, sincronização entre dispositivos ou infraestrutura de voz foi introduzida.

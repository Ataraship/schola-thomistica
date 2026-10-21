# Persistência local durante a revisão da issue #8

Os documentos `schola-progress-v1` e `schola-disputatio-v1` continuam no localStorage, com os mesmos IDs de aulas, respostas, conclusão e campos desconhecidos. Não há serviço, login ou sincronização entre dispositivos.

## Duas abas e documentos desatualizados

A revisão reproduziu perda de campos diferentes em escritas simultâneas. Web Locks serializa as operações de abas cooperantes, mas não garante que o cache de localStorage de um processo Chromium já tenha recebido a alteração do outro. Uma leitura dentro da trava ainda podia devolver um documento antigo.

Cada campo editado passa a ter uma chave auxiliar estável, no formato `<chave-v1>:field:<identificador-codificado>`, com envelope versionado. Não é criada uma chave por caractere. O aplicativo grava apenas os próprios campos nessa área e recompõe a visão juntando o documento legado, os campos auxiliares válidos e os textos ainda pendentes. Uma cópia antiga do documento inteiro não apaga o campo salvo por outra aba.

Os documentos v1 continuam como espelhos para compatibilidade. Eventos de armazenamento atualizam a interface e reconciliam esses espelhos, sem regravar os campos auxiliares de outra aba. A comparação ignora somente a ordem das propriedades de objetos, evitando ciclos de gravação por diferenças de serialização. Notas vazias e conclusão desmarcada também são valores persistidos.

Para o mesmo campo editado simultaneamente, prevalece a última gravação efetiva desse campo; não há fusão automática de dois textos. Abas com versões anteriores do aplicativo não conhecem o protocolo auxiliar. É preciso atualizá-las antes de usar edição concorrente. O caminho sem Web Locks continua disponível; a separação por campo protege dados de campos distintos, mas o espelho inteiro não é uma transação entre abas.

## Falhas e recuperação

- Leitura negada impede sobrescrita. Os registros malformados do documento principal só são substituídos após cópia dos bytes em uma chave de recuperação.
- Quota, rejeição de trava e falha de gravação mantêm os textos pendentes editáveis e exibem aviso. Uma próxima edição retenta a gravação; pendências sobrevivem à navegação interna e remontagem da rota.
- Um campo auxiliar inválido não é apagado nem substituído silenciosamente. A gravação é bloqueada e o texto pendente permanece na sessão. A recuperação exige inspeção e cópia dos dados antes de qualquer correção manual.
- Se um campo auxiliar foi salvo antes de falhar a atualização do espelho, a próxima leitura ainda recupera esse campo.
- O aviso de saída permanece enquanto há gravação pendente, mesmo após sair da rota por navegação interna, e é removido após salvar. `beforeunload` é uma proteção de melhor esforço: o navegador pode não executá-lo em encerramento forçado, especialmente em dispositivos móveis.

Uma futura exportação/importação deve abranger os documentos v1, campos auxiliares e recuperações. Copiar somente o espelho principal pode omitir um campo cuja reconciliação foi interrompida. A revisão não implementa exportação nem exclui automaticamente chaves auxiliares.

Os testes incluem documentos legados, campos desconhecidos, snapshots antigos, concorrência por campos distintos, string vazia, conclusão falsa, ordenação de propriedades, quota entre campo e espelho, leitura negada, corrupção, recuperação, navegação interna e URL de retomada inválida. O relatório de validação registra as execuções por branch e os limites dos testes de navegador.

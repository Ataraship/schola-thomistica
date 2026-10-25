# Persistência local durante a revisão da issue #8

Os documentos `schola-progress-v1` e `schola-disputatio-v1` continuam no localStorage, com os mesmos IDs de aulas, respostas, conclusão e campos desconhecidos. Não há serviço, login ou sincronização entre dispositivos.

## Inicialização dos campos de progresso

O HTML renderizado no servidor ainda não possui os handlers React nem o progresso local do navegador. No commit `14219e1`, os campos eram editáveis nessa janela: uma entrada nativa anterior ao bootstrap não chegava ao journal e podia desaparecer quando o cliente carregava o valor salvo. A retenção controlada apenas do entry JavaScript reproduziu essa perda em Chromium e WebKit; o mesmo campo, editado depois da inicialização, gravou e recarregou corretamente.

`useProgress` agora expõe `isReady`, inicialmente falso no servidor e no primeiro render do cliente. O sinal é habilitado depois da leitura inicial e da instalação dos listeners, junto com o snapshot carregado. Studium, formação e idiomas deixam seus controles de progresso desabilitados até esse ponto e informam “Carregando seus registros…”. Não há timer, espera artificial ou alteração das chaves, envelopes, locks e regras de gravação.

Prontidão não significa sucesso do armazenamento: uma leitura negada ou falha de gravação continua permitindo edição pendente com aviso e retentativa, conforme o protocolo abaixo. A proteção impede aceitar entrada antes de o cliente poder acompanhá-la; não fornece sincronização entre dispositivos ou garantia de gravação diante de encerramento forçado. Os testes de inicialização cobrem SSR, hidratação com legado, primeira edição/journal e recuperação após leitura negada. A Disputatio usa seu hook próprio e não foi modificada por esta correção.

Na cadeia revisada, o protocolo de campos do progresso começa no PR #2. A Disputatio o recebe a partir do PR #4; nas branches dos PRs #2 e #3, seu editor mantém a implementação anterior.

## Duas abas e documentos desatualizados

A revisão reproduziu perda de campos diferentes em escritas simultâneas. Web Locks serializa as operações de abas cooperantes, mas não garante que o cache de localStorage de um processo Chromium já tenha recebido a alteração do outro. Uma leitura dentro da trava ainda podia devolver um documento antigo.

Cada campo editado passa a ter uma chave auxiliar estável, no formato `<chave-v1>:field:<identificador-codificado>`, com envelope versionado. Não é criada uma chave por caractere. O aplicativo grava apenas os próprios campos nessa área e recompõe a visão juntando o documento legado, os campos auxiliares válidos e os textos ainda pendentes. Uma cópia antiga do documento inteiro não apaga o campo salvo por outra aba.

Os documentos v1 continuam como espelhos para compatibilidade. Eventos de armazenamento atualizam a interface e reconciliam esses espelhos, sem regravar os campos auxiliares de outra aba. A comparação ignora somente a ordem das propriedades de objetos, evitando ciclos de gravação por diferenças de serialização. Notas vazias e conclusão desmarcada também são valores persistidos.

Para o mesmo campo editado simultaneamente, prevalece a última gravação efetiva desse campo; não há fusão automática de dois textos. Abas com versões anteriores do aplicativo não conhecem o protocolo auxiliar. É preciso atualizá-las antes de usar edição concorrente. O caminho sem Web Locks continua disponível; a separação por campo protege dados de campos distintos, mas o espelho inteiro não é uma transação entre abas.

## Falhas e recuperação

- Leitura negada impede sobrescrita. Os registros malformados do documento principal só são substituídos após cópia dos bytes em uma chave de recuperação.
- Na Disputatio, cada nova cópia de recuperação usa o prefixo legado e um sufixo aleatório de 128 bits gerado por `crypto.getRandomValues`. Isso resiste a colisões quando o relógio repete um timestamp e evita depender da visão possivelmente desatualizada de outra aba para escolher um contador. Uma chave já ocupada ou falha ao gerar, ler ou gravar a cópia interrompe a recuperação antes de substituir o documento. A aleatoriedade não constitui garantia matemática de unicidade. As cópias antigas são mantidas. O progresso ainda usa somente o timestamp para suas recuperações; a possível colisão nesse módulo é uma dívida herdada, não corrigida nesta preparação do PR #4.
- Na Disputatio, se novos bytes malformados surgirem entre a leitura inicial e a conferência após gravar um campo, a substituição do documento é interrompida. O texto pendente e o aviso de saída permanecem; uma nova edição tenta preservar esses bytes antes de reconciliar as respostas.
- Quota, rejeição de trava e falha de gravação mantêm os textos pendentes editáveis e exibem aviso. Uma próxima edição retenta a gravação; pendências sobrevivem à navegação interna e remontagem da rota.
- Um campo auxiliar inválido não é apagado nem substituído silenciosamente. A gravação é bloqueada e o texto pendente permanece na sessão. A recuperação exige inspeção e cópia dos dados antes de qualquer correção manual.
- Se um campo auxiliar foi salvo antes de falhar a atualização do espelho, a próxima leitura ainda recupera esse campo.
- O aviso de saída permanece enquanto há gravação pendente, mesmo após sair da rota por navegação interna, e é removido após salvar. `beforeunload` é uma proteção de melhor esforço: o navegador pode não executá-lo em encerramento forçado, especialmente em dispositivos móveis.

Uma futura exportação/importação deve abranger os documentos v1, campos auxiliares e recuperações. Copiar somente o espelho principal pode omitir um campo cuja reconciliação foi interrompida. A revisão não implementa exportação nem exclui automaticamente chaves auxiliares.

Os testes incluem documentos legados, campos desconhecidos, snapshots antigos, concorrência por campos distintos, string vazia, conclusão falsa, ordenação de propriedades, quota entre campo e espelho, leitura negada, corrupção, recuperação, navegação interna e URL de retomada inválida. O relatório de validação registra as execuções por branch e os limites dos testes de navegador.

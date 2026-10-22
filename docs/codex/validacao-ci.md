# Validação dos PRs em revisão

O workflow `Validate PR` executa em pushes para `feat/**`, inclusive em PRs em rascunho, e na abertura, reabertura, edição ou passagem de um PR para revisão. O evento `synchronize` é atendido pelo próprio push, evitando duas execuções para a mesma atualização. Testa o SHA exato da branch, sem fazer merge sintético, publicar, usar segredos ou aprovar a revisão. As actions são fixadas por SHA e a permissão é somente de leitura do conteúdo.

O evento de push permite verificar o head mesmo quando o GitHub suspende eventos `pull_request` por conflito entre branches. Nesse evento, o controle de qualidade compara todo o escopo acumulado com a main congelada desta auditoria (`40fb9905e88e0db61e07d579b7bee2f2f1c8afd9`); no evento de PR, usa o SHA de sua base. A concorrência por nome de branch cancela uma execução duplicada, mantendo a mais recente. Um CI verde não demonstra ausência de conflitos de integração.

Os gates são instalação com `bun install --frozen-lockfile` (Bun 1.3.14), testes, TypeScript, build, controle de lint/formatação e `git diff --check`. O build apenas produz arquivos locais ao runner; não há etapa de deploy. O workflow não modifica a branch principal nem as bases dos PRs.

## Dívida de lint controlada

`scripts/lint-baseline.json` identifica individualmente os diagnósticos herdados do commit `87aea5912f41cdcf23c7e5fc9e373aebbc2e29f2`: 89 erros de formatação e seis avisos. Registra arquivo, regra, severidade, mensagem, linha-fonte e quantidade, em vez de tolerar qualquer erro até uma contagem máxima. A versão posterior da Disputatio remove dezoito desses erros.

`node scripts/check-quality.mjs <SHA-da-base>` reprova diagnósticos novos em qualquer arquivo e qualquer diagnóstico em um arquivo alterado, além de verificar Prettier nos arquivos alterados reconhecidos. Dívida resolvida deixa de aparecer e não precisa ser recriada. O baseline não é regenerado automaticamente no CI. O comando `bun run lint` continua expondo a dívida global, portanto não se declara que todo o repositório passa no lint estrito.

O controle foi ensaiado em um clone temporário: a árvore válida passou e a inclusão de um arquivo TypeScript mal formatado reprovou. Nenhum desses commits de ensaio foi enviado ao GitHub.

## Execução local e limites

Cada branch deve receber execução própria dos comandos acima. Para o controle de qualidade local, use o SHA completo da base correspondente, disponível em `gh api repos/Ataraship/schola-thomistica/pulls/<n> --jq .base.sha`. A comparação usa o ancestral comum; alterações repetidas em branches empilhadas continuam sujeitas aos gates.

Não fazer rebase, force-push ou alterar commits já publicados. Após autorização expressa do responsável para sincronizar as branches de trabalho, as correções compartilhadas foram consolidadas no PR #2 e propagadas por commits de sincronização na cadeia #2 → #3 → #4 → #5 → #6 → #7. Cada base final é ancestral do head seguinte; os diffs são incrementais. Commits equivalentes já publicados foram preservados, sem criar novas cópias por cherry-pick. Os PRs e seus nomes de base foram mantidos, sem integrar nenhum PR em main. Cada atualização do head exige nova execução do CI. Integração em main, retarget e publicação continuam dependendo de autorização posterior.

CI automatizado não certifica exatidão acadêmica, licença de publicação de traduções ou funcionamento no Safari real de iPhone. Esses itens precisam de evidência específica e permanecem distintos dos testes automatizados. VoiceStudio continua adiado; nenhum PDF privado integra esta configuração.

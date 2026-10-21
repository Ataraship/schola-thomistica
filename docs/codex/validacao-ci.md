# Validação dos PRs em revisão

O workflow `Validate PR` executa em cada atualização de PR, inclusive rascunhos. Testa o SHA exato da branch, sem fazer merge sintético, publicar, usar segredos ou aprovar a revisão. As actions são fixadas por SHA e a permissão é somente de leitura do conteúdo.

Os gates são instalação com `bun install --frozen-lockfile` (Bun 1.3.14), testes, TypeScript, build, controle de lint/formatação e `git diff --check`. O build apenas produz arquivos locais ao runner; não há etapa de deploy. O workflow não modifica a branch principal nem as bases dos PRs.

## Dívida de lint controlada

`scripts/lint-baseline.json` identifica individualmente os diagnósticos herdados do commit `87aea5912f41cdcf23c7e5fc9e373aebbc2e29f2`: 89 erros de formatação e seis avisos. Registra arquivo, regra, severidade, mensagem, linha-fonte e quantidade, em vez de tolerar qualquer erro até uma contagem máxima. A versão posterior da Disputatio remove dezoito desses erros.

`node scripts/check-quality.mjs <SHA-da-base>` reprova diagnósticos novos em qualquer arquivo e qualquer diagnóstico em um arquivo alterado, além de verificar Prettier nos arquivos alterados reconhecidos. Dívida resolvida deixa de aparecer e não precisa ser recriada. O baseline não é regenerado automaticamente no CI. O comando `bun run lint` continua expondo a dívida global, portanto não se declara que todo o repositório passa no lint estrito.

O controle foi ensaiado em um clone temporário: a árvore válida passou e a inclusão de um arquivo TypeScript mal formatado reprovou. Nenhum desses commits de ensaio foi enviado ao GitHub.

## Execução local e limites

Cada branch deve receber execução própria dos comandos acima. Para o controle de qualidade local, use o SHA completo da base correspondente, disponível em `gh pr view <n> --json baseRefOid`. A comparação usa o ancestral comum; alterações repetidas em branches empilhadas continuam sujeitas aos gates.

Não fazer rebase, force-push ou alterar commits já publicados. As correções comuns são novos commits aplicados às branches existentes, sem executar merge ou retargetar PRs. Isso preserva todos os commits antigos, mas os novos commits das branches não criam ancestralidade entre si: os diffs podem repetir correções comuns. A integração ordenada e qualquer ajuste de base ficam para uma etapa expressamente autorizada.

CI automatizado não certifica exatidão acadêmica, licença de publicação de traduções ou funcionamento no Safari real de iPhone. Esses itens precisam de evidência específica e permanecem distintos dos testes automatizados. VoiceStudio continua adiado; nenhum PDF privado integra esta configuração.

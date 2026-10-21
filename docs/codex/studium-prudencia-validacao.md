# Segunda oficina: virtudes intelectuais e prudência

Entrega incremental do P2 de `acervo-e-plano-2026-10-20.md`, sobre a base do PR #2, ainda aberto para revisão. A biblioteca oferece acesso direto às duas oficinas, sem exigir conclusão prévia: imagens e veneração; virtudes intelectuais, reta razão e prudência.

## Conteúdo e fontes

A oficina de prudência contém exposição original em português, vocabulário contextual, um caso fictício sobre um catálogo e uma carta de autoria incerta, cinco etapas escritas e critérios de autoavaliação. O percurso pede reconstruir a posição aristotélica, distinguir a leitura de Tomás, explicitar premissas, justificar fins e meios, comparar alternativas, enfrentar uma objeção forte e revisar o juízo. Êxito técnico e resultado posterior não são tratados como prova suficiente de prudência. Não há nota filosófica automática.

Consulta parcial efetiva ao anexo privado `thomaskommentar_ethik2.pdf`, de 378 páginas, traduzido por Josef Spindelböck, **Teil 2, livros VI–X**:

- Aristóteles, *Ética a Nicômaco* VI.3–7, 1139b14–1141b22: disposições intelectuais, produção e ação, prudência, princípios e sabedoria.
- Aristóteles, VI.12–13, 1143b18–1145a11: habilidade, fins e vínculo entre prudência e virtude moral.
- Tomás, *Sententia libri Ethicorum* VI, lições 3–4, §§1142–1174, e 10–11, §§1257–1291, conforme a numeração apresentada na edição: comentário às passagens correspondentes.

Esses localizadores são da obra e da numeração editorial, não páginas inventadas do PDF. Texto de Aristóteles, comentário de Tomás e elaboração pedagógica são distinguidos. A ficha `REF-2026-02` registra a ampliação da consulta, mantendo a verificação parcial. Nenhum trecho da tradução moderna ou anexo privado integra a entrega.

## Compatibilidade e validação

O componente recebe uma atividade tipada; a atividade padrão continua sendo a de imagens. As chaves `schola-progress-v1`, `studium-imagens:<etapa>` e `studium-imagens:criterion:<critério>` foram preservadas. A nova oficina usa `studium-prudencia`; rascunhos, critérios e conclusão são independentes. Todos os IDs de apresentação e suas relações ARIA também distinguem as duas oficinas.

- `bun run test`: **25 testes aprovados em seis arquivos**. Os quatro novos testes cobrem isolamento e persistência após remontagem, conservação de dados legados e campos adicionais, IDs e destinos acessíveis exclusivos, compatibilidade da atividade padrão e acesso às oficinas durante busca sem resultados.
- `tsc --noEmit`: aprovado.
- `bun run build`: aprovado, incluindo cliente, SSR e worker Cloudflare.
- ESLint dos cinco arquivos TypeScript/TSX alterados ou criados: aprovado. O lint global continua com os mesmos 89 erros de formatação e seis avisos em arquivos preexistentes fora deste diff.
- Chromium real em desktop 1280 × 900 e viewport móvel 390 × 844: navegação inicial e pelas cinco etapas, rascunhos/critério/conclusão após recarregar, dados legados intactos e ausência de transbordamento horizontal ou exceções JavaScript. O espaçamento dos destinos considera o cabeçalho fixo.
- Revisão independente de conteúdo e localizadores: sem problemas materiais encontrados. Os critérios são orientação para autoavaliação, não comprovação automática de aprendizagem.

Safari real de iPhone e WebKit não estão disponíveis neste ambiente; a validação nesse navegador permanece pendente antes da publicação. A entrega deve permanecer em PR para revisão. A integração VoiceStudio e os mecanismos de armazenamento não foram alterados.

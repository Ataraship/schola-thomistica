# Schola Universalis — experiência responsiva e leitura para TV

Base revalidada: `fc400039bfa4b10de93176c0aa81e7a1a2d610a7`. Entrega para revisão em DRAFT, sem merge ou publicação. Conteúdo acadêmico, IDs, chaves v1, auxiliares e backups não são modificados.

## Problemas observados e intervenção

O menu usava top fixo de58px, embora o cabeçalho medisse63–90px com fontes de fallback e178px com fonte200%. Em390px, o documento chegava a543px no Chromium e585px no WebKit. Escape não fechava o menu. Botões de40px e o menu menor ficavam abaixo da meta de44px. Não havia áreas seguras nem tratamento de movimento reduzido.

A alteração se concentra em AppShell, estilos e um hook de navegação direcional. O menu acompanha o cabeçalho real, tem altura limitada/rolagem própria e fecha por Escape ou saída do foco, restaurando foco ao botão quando apropriado. O cabeçalho é medido por ResizeObserver, com fallback de resize; não há medição por caractere digitado. O atalho de conteúdo fica acima do cabeçalho e o main recebe foco na navegação comum, preservando cliques modificados para nova aba.

Botões/campos têm alvo mínimo de2,75rem. Marca e textos podem quebrar sem ampliar a página, cartões se reorganizam conforme a fonte, formulários/fieldset encolhem corretamente e textarea só redimensiona verticalmente. Quadros comparativos continuam com rolagem horizontal interna e foco nativo. Cabeçalho, conteúdo, menu e barra lateral usam env(safe-area-inset-*), com fallback; vh precede dvh. Movimento reduzido remove transições/rolagem animada e foco tem contorno contrastante, inclusive em cores forçadas. Fontes serifadas, verde, vinho, dourado, cruz e termos latinos permanecem.

## Leitura para TV

Ativação explícita pelo botão “Leitura para TV”, disponível no menu e barra lateral. Não há detecção de aparelho, API nativa ou nova chave de armazenamento. O estado existe somente na montagem atual; a navegação SPA o mantém e a recarga o encerra. Em telas largas, há texto maior, linhas limitadas, cartões mais amplos, foco mais espesso e margem proporcional.

Setas escolhem geometricamente links, botões, summary e outros destinos de foco visíveis. Controles ocultos, desabilitados e fora da ordem de Tab são ignorados. A operação consulta a geometria apenas durante teclas direcionais com modo ativo; não roda durante digitação. Enter mantém ativação nativa, evitando duplo clique. Na borda, a rolagem padrão continua disponível. A navegação geométrica não garante que Esquerda desfaça exatamente um movimento Direita em cartões de tamanhos diferentes.

Retorno/Esc fecha primeiro o menu ou encerra o modo, preservando a página; não chama history.back nem descarta rascunhos. BrowserBack/GoBack e os códigos legados10009/461 são tratados somente quando entregues ao documento com o modo ativo. Não há promessa de que o navegador de uma TV entregue esses eventos. Campos de texto, seletores, widgets nativos, atalhos com modificadores e quadros roláveis mantêm suas próprias teclas. A experiência prioriza leitura/revisão; edição por controle remoto não é certificada. É preciso um ponteiro ou Tab/Enter para ativar o modo quando o navegador não fornecer foco inicial remoto.

## Plataformas e limites do build

Consulta pública às especificações de motores, preservada com data/hashes no relatório externo:

- Samsung: https://developer.samsung.com/smarttv/develop/specifications/web-engine-specifications.html — tabela indica Tizen10/2026 Chromium130; Tizen9/2025 Chromium120; Tizen8/2024 Chromium108; Tizen7/2023 Chromium94.
- LG: https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine — webOS26 Chromium132;25 Chromium120;24 Chromium108;23 Chromium94. O documento ressalva diferenças entre plataformas/aplicações e navegadores.

Vite8 instalado usa por padrão Chrome/Edge111, Firefox114 e Safari16.4 como alvos de compilação. Isso não é homologação nesses navegadores. Tailwind4 e o tema usam CSS moderno, incluindo oklch. TVs antigas podem não interpretar o artefato atual; Chromium108/94 e inferiores não estão cobertos por esse piso. Não foi criado build legado nem alteradas dependências para prometer suporte a toda geração de TV. As tabelas de fabricantes não certificam o navegador comum ou o firmware de um aparelho específico.

Os testes automatizados usam Chromium/WebKit no Linux, viewports320–430,667,768–1024,1280–1920,1920×1080 e2560×1440, além de fonte200%, toque emulado, orientação por dimensões e teclas simuladas. Não equivalem a iPhone/iPad/Android reais, Windows/macOS físicos, Safari real, emuladores Tizen/webOS ou controles remotos reais. Notch, teclado virtual, overscan, foco inicial do navegador e retorno reservado pelo sistema precisam de ensaio físico. Fonte200% e viewport de reflow não são a interface de zoom nativo de um aparelho.

## Verificação e preservação

Vitest inclui regressões de abertura/foco/Escape, cliques modificados, modo sem gravação, geometria das quatro setas, controles ocultos/desabilitados, edição, widgets, tabelas, modificadores, Enter nativo, retorno e limpeza de listeners. O CI existente continua com instalação congelada, suíte completa, TypeScript, build e qualidade controlada. O baseline não foi ampliado.

O relatório externo registra SHAs, capturas antes/depois, matriz de viewports por motor, casos de teclado/toque/movimento reduzido, persistência entre abas, inicialização, quota/leitura negada/corrupção e inventário14/23/2. Resultados de exploração são separados do teste final no commit enviado. Permanecem a dívida global de lint fora do diff e os limites documentados de armazenamento: timestamp no recovery do progresso, última gravação no mesmo campo, abas antigas e beforeunload de melhor esforço. Não foi ativado VoiceStudio.

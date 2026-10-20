# Schola Thomistica

Crie o projeto web full-stack "Schola Thomistica" em português do Brasil. É um aplicativo EDUCACIONAL CATÓLICO de formação intelectual, com identidade visual medieval/escolástica, não um site de propaganda nem uma simples demonstração de voz. OBJETIVO MAIOR: formar estudantes capazes de "pensar por si próprios" com lógica rigorosa, investigação, objeções, debate, avaliação de premissas e autonomia intelectual; não substituir estudo por respostas prontas de IA. Aprender primeiro fundamentos (Platão, Aristóteles, patrística, tradição tomista), compreender os autores em seus próprios termos antes da comparação com São Tomás, posteriormente estudar sistematicamente a Suma Teológica. Há cursos opcionais independentes de latim, alemão e inglês.

DESIGN: bela interface responsiva e utilizável no iPhone Safari, inspirada em biblioteca universitária medieval, iluminuras manuscritas, arcos góticos, pergaminho marfim, bordô profundo, verde escuro e dourado envelhecido, com serifas elegantes legíveis; sensação de ferramenta acadêmica séria, não fantasia caricatural. Sidebar/navegação, menu mobile, tela inicial bonita com módulos e progresso salvo localmente (sem obrigatoriedade de login para estudar). Interface acessível com teclado, cores contrastantes. Não reproduzir páginas de livros comerciais protegidos por copyright.

TELAS/MÓDULOS DO MVP:
1) Início/Dashboard "Schola Thomistica", missão "Non tantum discere, sed intelligere et iudicare", resumo do progresso e continuidade de lições.
2) Formação Fundamental com trilhas selecionáveis (lógica; Platão; Aristóteles; metafísica; patrística Agostinho/Atanásio/João Damasceno; introdução tomista), explicação de conceitos e exercícios de raciocínio; navegação livre e sugestão de pré-requisitos, sem travas arbitrárias.
3) Biblioteca com catálogo de fontes iniciais descritas, distinção texto integral/parcial/referência, sem fingir ter corpus completo nem redistribuir PDFs.
4) Disputatio escolástica socrática: exemplo completo "É possível conhecer algo com certeza?", com campos para tese, premissas, objeções, respostas e reflexões, orientações pedagógicas que questionam o aluno em vez de entregar resposta pronta; armazenamento local das respostas.
5) Suma Teológica: apresentação da estrutura (Partes, questões, artigos), leitor-esqueleto (sem alegar que todo corpus já foi carregado), espaço para futura indexação; indicar conteúdo demonstrativo quando for demo.
6) Idiomas: latim, alemão, inglês como percursos independentes, primeira lição demo em cada um, com pronúncia/aplicações.

RECURSO CENTRAL SOLICITADO: integrar a IA de voz chamada VoiceStudio (projeto open-source debpalash/VoiceStudio) como "Vox Scholastica" / leitor de aulas. NÃO confundir com a sintese nativa do navegador.
- VoiceStudio é serviço de backend, NÃO roda embutido/offline num iPhone. Ele oferece endpoint compatível OpenAI POST /v1/audio/speech, corpo JSON {model:"tts-1", input:text, voice:"default", language:"pt"|"de"|"en", speed:1, response_format:"mp3"} e devolve audio/mpeg; servidor precisa ser implantado separadamente.
- Construir componente React de leitura nas lições, português/inglês/alemão, velocidade 0.85/1/1.15, botão Gerar com IA, player audio HTML5 e segmentação de longos textos por sentenças (máximo ~420 caracteres por segmento e ~3500 total), avançar/voltar trechos, status e erros úteis. Safari pode necessitar toque manual no play após gerar. Seleção de voz "Leitor" e "Mestre" pode ser futura se perfis efetivamente configurados.
- Latim deve constar como 'experimental/aguardando modelo de pronúncia eclesiástica validado', não simular pronúncia correta; o catálogo OmniVoice fornecido não lista latim.
- Quando servidor IA indisponível, botão claramente rotulado "voz do aparelho (não IA)" usando window.speechSynthesis pt-BR/en-US/de-DE. Informar que fallback varia conforme dispositivo e não garantir offline.
- Implementar backend seguro (Edge Function Lovable Cloud/Supabase ou backend já existente conforme stack). Chamada do browser -> backend -> VoiceStudio com URL e chave configuradas SOMENTE em secrets VOICESTUDIO_BASE_URL, VOICESTUDIO_API_KEY. Nunca incluir credenciais no frontend/VITE. CORS restrito, tamanho de texto validado, erros sanitizados e controle de abuso/limites. Se a stack permitir, exigir sessão autenticada somente para uso custoso da IA; estudos continuam acessíveis sem login. Nunca usar servidor fictício, chave inventada ou afirmar que áudio IA real está ativo antes de testar.
- O motor default do VoiceStudio possui pesos com restrições não comerciais; conferir licenças de software AGPL-3.0 e modelos antes de disponibilização comercial. A infraestrutura não foi entregue, portanto deixar recurso em estado "Aguardando configuração do servidor VoiceStudio", mas componente, Edge Function, secrets e fluxos preparados.
- Evitar request de API com CORS diretamente do navegador para o VoiceStudio público; usar camada intermediária segura, texto enviado só após clique do usuário.
- Conteúdo e visual católico medieval consistente, com respeito ao estudo independente, ensino objetivo de Platão e Aristóteles com distinção da perspectiva tomista.

IMPLEMENTAÇÃO PRÁTICA: escreva e edite código de verdade, não apenas um plano. Execute build/checks que tiver, mostre na resposta quais arquivos criou, o que funciona sem servidor e quais secrets ainda precisam de configuração. Não publicar automaticamente para o público nem solicitar pagamentos. Priorize um MVP bonito e navegável, funcional com leitura básica no navegador agora e preparado para integrar VoiceStudio quando backend online.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b8cecaa3-0b6a-4232-982c-1951c7c256bc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

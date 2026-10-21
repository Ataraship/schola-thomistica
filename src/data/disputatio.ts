export const DISPUTATIO_FIELDS = [
  {
    id: "tese",
    label: "Tese (Respondeo)",
    question:
      "O que exatamente você afirma? Defina os termos, o domínio e se a tese vale para todos, alguns ou um caso determinado.",
  },
  {
    id: "premissas",
    label: "Premissas",
    question:
      "Numere P1, P2 e a conclusão. Qual premissa é observada, demonstrada, concedida ou ainda suposta? Por que a conclusão decorre delas?",
  },
  {
    id: "objecoes",
    label: "Objeções (Videtur quod)",
    question:
      "Formule a objeção mais forte: qual premissa, inferência ou aplicação ela atinge? Seu interlocutor reconheceria a posição que você escreveu?",
  },
  {
    id: "respostas",
    label: "Respostas às objeções (Ad primum…)",
    question:
      "O que concede, o que nega e que distinção propõe? Justifique cada passo e responda ao ponto atingido, sem apenas repetir a tese.",
  },
  {
    id: "reflexao",
    label: "Reflexão final",
    question:
      "Que dificuldade permanece? Qual evidência ou leitura permitiria investigá-la e que resultado o faria reconsiderar?",
  },
  {
    id: "juizo-revisto",
    label: "Juízo revisto e motivo da mudança",
    question:
      "Compare com a tese inicial sem apagá-la. O que mudou e por qual razão? Se manteve a tese, explique como respondeu à objeção. Delimite o que seu argumento estabeleceu.",
  },
];

export const DISPUTATIO_CRITERIA = [
  { id: "termos", text: "Defini a tese e seu alcance sem mudar os termos durante o argumento." },
  {
    id: "premissas",
    text: "Explicitei premissas e inferência, distinguindo o que concedi do que justifiquei.",
  },
  {
    id: "objecao",
    text: "A objeção enfrenta uma razão identificada e representa a posição contrária com fidelidade.",
  },
  {
    id: "resposta",
    text: "Respondi com razões e uma concessão, negação ou distinção pertinente.",
  },
  {
    id: "revisao",
    text: "Comparei tese inicial e juízo revisto e indiquei uma dúvida que ainda posso investigar.",
  },
];

export const DISPUTATIO_EXAMPLE = {
  title: "Um erro de percepção prova que nenhum juízo pode ser certo?",
  parts: [
    {
      title: "Videtur quod · a dificuldade",
      text: "Os sentidos às vezes enganam. Se a correção de um erro também puder falhar, como saber que a nova avaliação não é outro engano? Acumular verificações tampouco parece produzir, por si só, uma garantia absoluta. Essas dificuldades pedem uma justificação do critério usado para corrigir.",
    },
    {
      title: "Sed contra · o alcance da objeção",
      text: "De haver ao menos um erro não se segue, sem uma premissa adicional, que todo juízo seja falso ou que nenhum possa ser certo. A passagem de alguns casos para uma negação universal precisa ser defendida. Essa observação contesta uma inferência; ainda não demonstra uma tese geral sobre a certeza.",
    },
    {
      title: "Respondeo · uma resposta delimitada",
      text: "Concedo que percepções e correções exigem exame. Distingo a possibilidade de erro, a justificação de um juízo concreto e a pretensão de certeza. Nego que a existência de enganos, sozinha, demonstre a impossibilidade de todo conhecimento certo. Para afirmar positivamente que há tal conhecimento, devo oferecer outro argumento e esclarecer o sentido de certeza. Uma crítica pode ser bem-sucedida sem resolver a questão inteira.",
    },
    {
      title: "Ad primum · o critério de correção",
      text: "A dificuldade sobre o critério é pertinente e permanece uma tarefa de investigação. A resposta não pode presumir que toda correção é infalível. É preciso apresentar e defender os critérios do juízo discutido; apontar um salto na conclusão cética não satisfaz automaticamente essa exigência.",
    },
    {
      title: "Ad secundum · verificar e demonstrar",
      text: "Concedo que repetir observações não equivale, apenas por repetição, a uma demonstração necessária. Isso limita o apoio que essas verificações oferecem. Para concluir que nenhum outro tipo de justificação é possível, porém, seria preciso examinar as alternativas e acrescentar razões.",
    },
  ],
  note: "Exemplo autoral de avaliação do alcance de uma inferência, sem citações atribuídas a autores clássicos. O roteiro adapta a forma da questão disputada; aqui o Sed contra apresenta uma razão, sem pretender reproduzir um artigo da Suma. Avalie a resposta e desenvolva a objeção que ela ainda precisa enfrentar.",
};

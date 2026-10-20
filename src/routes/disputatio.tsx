import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageTitle } from "@/components/AppShell";
import { VoxReader } from "@/components/VoxReader";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/disputatio")({
  head: () => meta("Disputatio", "Exercício de questão disputada: tese, premissas, objeções e respostas, com perguntas socráticas em vez de respostas prontas."),
  component: Disputatio,
});

const KEY = "schola-disputatio-v1";
const FIELDS = [
  { id: "tese", label: "Tese (Respondeo)", q: "O que exatamente você afirma? Que significa 'certeza' na sua formulação: psicológica ou objetiva?" },
  { id: "premissas", label: "Premissas", q: "Cada premissa é evidente, demonstrada ou apenas suposta? Qual delas um cético atacaria primeiro?" },
  { id: "objecoes", label: "Objeções (Videtur quod)", q: "Formule a objeção mais forte possível — tão forte que um cético a assinaria." },
  { id: "respostas", label: "Respostas às objeções (Ad primum…)", q: "Sua resposta distingue algo, ou apenas repete a tese? Que distinção resolve a dificuldade?" },
  { id: "reflexao", label: "Reflexão final", q: "O que você ainda não sabe responder? Que leitura faria a seguir?" },
];

const EXAMPLE = "Questão: É possível conhecer algo com certeza? Parece que não. Primeira objeção: os sentidos às vezes enganam, como o remo que parece quebrado na água; ora, o que às vezes engana não gera certeza. Segunda objeção: todo raciocínio parte de premissas, que exigiriam outras premissas ao infinito. Em sentido contrário, quem afirma que nada é certo afirma isso como certo, e assim se contradiz. Respondo: há verdades conhecidas por si mesmas, como o princípio de não contradição, que não se demonstram mas são pressupostas por toda demonstração, inclusive pela do cético. Ao primeiro, digo que o erro dos sentidos é corrigido por outros sentidos e pelo intelecto; reconhecer o erro já supõe um critério de verdade. Ao segundo, digo que a demonstração não procede ao infinito, mas termina em primeiros princípios evidentes.";

function Disputatio() {
  const [v, setV] = useState<Record<string, string>>({});
  useEffect(() => { try { setV(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* ignore */ } }, []);
  const set = (id: string, val: string) => { const n = { ...v, [id]: val }; setV(n); localStorage.setItem(KEY, JSON.stringify(n)); };
  return (
    <div>
      <PageTitle kicker="Quaestio disputata" title="Disputatio">O mestre não entrega a resposta: pergunta até que você a encontre e a defenda.</PageTitle>
      <article className="folio p-6">
        <p className="rubric">Exemplo completo</p>
        <h2 className="text-3xl mt-1">É possível conhecer algo com certeza?</h2>
        <dl className="mt-4 space-y-3">
          <div><dt className="font-display text-xl text-primary">Videtur quod non</dt><dd>1. Os sentidos às vezes enganam (o remo "quebrado" na água); o que às vezes engana não gera certeza. 2. Todo raciocínio parte de premissas, que exigiriam outras ao infinito.</dd></div>
          <div><dt className="font-display text-xl text-primary">Sed contra</dt><dd>Quem afirma que nada é certo afirma-o como certo, e se contradiz (cf. Aristóteles, Metafísica IV; Agostinho contra os acadêmicos).</dd></div>
          <div><dt className="font-display text-xl text-primary">Respondeo</dt><dd>Há verdades conhecidas por si mesmas, como o princípio de não contradição, não demonstradas mas pressupostas por toda demonstração — inclusive a do cético.</dd></div>
          <div><dt className="font-display text-xl text-primary">Ad primum / Ad secundum</dt><dd>O erro dos sentidos é corrigido por outros sentidos e pelo intelecto; reconhecer um erro já supõe um critério. A demonstração não regride ao infinito: termina em primeiros princípios.</dd></div>
        </dl>
        <VoxReader text={EXAMPLE} />
        <p className="text-sm text-muted-foreground">Não aceite o exemplo por autoridade. A resposta acima convence você? Onde ela é mais fraca?</p>
      </article>

      <h2 className="text-3xl mt-10 mb-2">Sua disputatio</h2>
      <p className="text-muted-foreground mb-4">Escolha a mesma questão ou outra. Tudo é salvo apenas neste aparelho.</p>
      <div className="space-y-5">
        {FIELDS.map((f) => (
          <div key={f.id} className="folio p-5">
            <label htmlFor={f.id} className="font-display text-xl">{f.label}</label>
            <p className="text-sm italic text-secondary mt-1">Magister interrogat: {f.q}</p>
            <textarea id={f.id} className="field mt-2 min-h-28" value={v[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

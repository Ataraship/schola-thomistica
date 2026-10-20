import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/AppShell";
import { VoxReader } from "@/components/VoxReader";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/suma")({
  head: () => meta("Suma Teológica", "Estrutura da Summa Theologiae de São Tomás — partes, questões e artigos — com leitor demonstrativo."),
  component: Suma,
});

const PARTS = [
  { p: "Prima Pars (I)", q: "119 questões", d: "Deus uno e trino; criação, anjos, homem; governo divino." },
  { p: "Prima Secundae (I-II)", q: "114 questões", d: "Fim último, atos humanos, paixões, hábitos, virtudes, lei e graça." },
  { p: "Secunda Secundae (II-II)", q: "189 questões", d: "Virtudes teologais e cardeais em particular; estados de vida." },
  { p: "Tertia Pars (III)", q: "90 questões", d: "Cristo e os sacramentos (obra inacabada)." },
  { p: "Supplementum", q: "99 questões", d: "Completado por discípulos a partir do Comentário às Sentenças." },
];

const DEMO = "Primeira Parte, questão 2, artigo 3: Se Deus existe. Parece que não. Primeira objeção: se um dos contrários fosse infinito, destruiria totalmente o outro; ora, o nome Deus significa um bem infinito; logo, se Deus existisse, não haveria mal. Mas há mal no mundo; logo Deus não existe. Em sentido contrário, diz-se na pessoa de Deus: Eu sou aquele que sou. Respondo: a existência de Deus pode ser provada por cinco vias. A primeira e mais manifesta parte do movimento. Resumo demonstrativo; não é o texto integral.";

function Suma() {
  return (
    <div>
      <PageTitle kicker="Summa Theologiae" title="Suma Teológica">Estudada após os fundamentos. O corpus integral ainda não foi carregado: abaixo há a estrutura e um artigo demonstrativo resumido.</PageTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {PARTS.map((x) => (
          <div key={x.p} className="folio p-4">
            <h2 className="text-2xl">{x.p}</h2>
            <p className="rubric mt-1">{x.q}</p>
            <p className="text-sm mt-1">{x.d}</p>
          </div>
        ))}
      </div>
      <article className="folio p-6 mt-8">
        <p className="rubric">Leitor · conteúdo demonstrativo</p>
        <nav aria-label="Localização" className="text-sm text-muted-foreground mt-1">I › q. 2 › a. 3</nav>
        <h2 className="text-3xl mt-1">Utrum Deus sit — Se Deus existe</h2>
        <p className="initial mt-4">{DEMO}</p>
        <VoxReader text={DEMO} />
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Espaço reservado para indexação futura: busca por parte/questão/artigo, texto latino de domínio público em paralelo e notas do estudante.
        </div>
      </article>
    </div>
  );
}

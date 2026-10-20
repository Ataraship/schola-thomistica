import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/AppShell";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/biblioteca")({
  head: () => meta("Biblioteca", "Catálogo de fontes clássicas e escolásticas, indicando com clareza o que é texto integral, parcial ou apenas referência."),
  component: Biblioteca,
});

type Kind = "Referência" | "Parcial (demo)" | "Integral";
const SOURCES: { a: string; t: string; d: string; k: Kind; note: string }[] = [
  { a: "Platão", t: "República", d: "Justiça, alma e Formas; alegoria da caverna (livros VI–VII).", k: "Referência", note: "Domínio público no original grego; use traduções de domínio público ou edições próprias." },
  { a: "Platão", t: "Fédon", d: "Imortalidade da alma e teoria da recordação.", k: "Referência", note: "Indicação bibliográfica." },
  { a: "Aristóteles", t: "Órganon (Categorias, Analíticos)", d: "Fundamentos da lógica e da demonstração.", k: "Referência", note: "Indicação bibliográfica." },
  { a: "Aristóteles", t: "Metafísica", d: "Ente enquanto ente, substância, ato e potência.", k: "Referência", note: "Indicação bibliográfica." },
  { a: "Santo Agostinho", t: "Confissões; A Cidade de Deus", d: "Interioridade, tempo, história e as duas cidades.", k: "Referência", note: "Textos latinos em domínio público." },
  { a: "Santo Atanásio", t: "Sobre a Encarnação do Verbo", d: "Defesa da divindade do Verbo.", k: "Referência", note: "Indicação bibliográfica." },
  { a: "São João Damasceno", t: "Exposição da Fé Ortodoxa", d: "Síntese da teologia patrística grega.", k: "Referência", note: "Indicação bibliográfica." },
  { a: "São Tomás de Aquino", t: "Summa Theologiae", d: "Obra sistemática em três partes.", k: "Parcial (demo)", note: "Apenas a estrutura e um artigo demonstrativo resumido estão no app." },
  { a: "São Tomás de Aquino", t: "De ente et essentia", d: "Ente, essência e existência.", k: "Referência", note: "Texto latino em domínio público; ainda não incorporado." },
];

function Biblioteca() {
  return (
    <div>
      <PageTitle kicker="Bibliotheca" title="Biblioteca">Não redistribuímos PDFs nem traduções protegidas. Cada fonte indica o que de fato está disponível aqui.</PageTitle>
      <ul className="grid gap-4 sm:grid-cols-2">
        {SOURCES.map((s) => (
          <li key={s.t} className="folio p-5">
            <p className="rubric">{s.a}</p>
            <h2 className="text-2xl mt-1">{s.t}</h2>
            <p className="mt-2">{s.d}</p>
            <p className="mt-3 text-sm"><span className={`rounded-full px-2 py-0.5 ${s.k === "Referência" ? "bg-muted" : "bg-accent"}`}>{s.k}</span> <span className="text-muted-foreground">{s.note}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

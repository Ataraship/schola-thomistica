import { createFileRoute, Link } from "@tanstack/react-router";
import { TRACKS } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "Início",
      "Formação intelectual católica: lógica, Platão, Aristóteles, Padres da Igreja e São Tomás de Aquino.",
    ),
  component: Index,
});

const MODULES = [
  {
    to: "/formacao",
    t: "Formação Fundamental",
    d: "Lógica, Platão, Aristóteles, metafísica, patrística e introdução tomista.",
  },
  {
    to: "/disputatio",
    t: "Disputatio",
    d: "Pratique tese, objeções e respostas como nas escolas medievais.",
  },
  {
    to: "/biblioteca",
    t: "Biblioteca",
    d: "Fontes descritas com honestidade sobre o que está disponível.",
  },
  {
    to: "/suma",
    t: "Suma Teológica",
    d: "Estrutura de Partes, questões e artigos; leitor em preparação.",
  },
  { to: "/idiomas", t: "Idiomas", d: "Latim, alemão e inglês como percursos opcionais." },
] as const;

function Index() {
  const { progress } = useProgress();
  const total = TRACKS.reduce((n, t) => n + t.lessons.length, 0);
  const lessonIds = new Set(TRACKS.flatMap((track) => track.lessons.map((lesson) => lesson.id)));
  const done = progress.completed.filter((id) => lessonIds.has(id)).length;
  const pct = Math.round((Math.min(done, total) / total) * 100);
  return (
    <div>
      <section className="folio arch bg-secondary text-secondary-foreground px-6 pt-16 pb-10 text-center border-4 border-gold">
        <p className="rubric text-gold">Studium generale</p>
        <h1 className="text-5xl sm:text-6xl mt-2">Schola Thomistica</h1>
        <p className="mt-4 font-display text-xl italic text-gold">
          Non tantum discere, sed intelligere et iudicare.
        </p>
        <p className="mt-3 max-w-xl mx-auto opacity-90">
          Não apenas aprender, mas compreender e julgar. Uma escola para pensar por si próprio com
          rigor, à luz da tradição.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 mt-8">
        <div className="folio p-5">
          <p className="rubric">Progresso</p>
          <p className="font-display text-3xl mt-1">
            {done} de {total} lições
          </p>
          <div
            className="mt-3 h-2 rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Salvo localmente neste aparelho. Sem login.
          </p>
        </div>
        <div className="folio p-5">
          <p className="rubric">Continuar</p>
          {progress.last ? (
            <a
              href={progress.last.to}
              className="font-display text-2xl text-primary hover:underline block mt-1"
            >
              {progress.last.title} →
            </a>
          ) : (
            <Link
              to="/formacao"
              className="font-display text-2xl text-primary hover:underline block mt-1"
            >
              Começar pela Lógica →
            </Link>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Ordem sugerida: lógica → Platão e Aristóteles → metafísica → patrística → São Tomás →
            Suma.
          </p>
        </div>
      </section>

      <h2 className="text-3xl mt-10 mb-4">Módulos</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m, i) => (
          <Link
            key={m.to}
            to={m.to}
            className="folio arch p-5 pt-10 text-center hover:border-gold transition-colors"
          >
            <span className="rubric">{["I", "II", "III", "IV", "V"][i]}</span>
            <h3 className="text-2xl mt-1">{m.t}</h3>
            <p className="text-sm text-muted-foreground mt-2">{m.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

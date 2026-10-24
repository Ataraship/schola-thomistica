import { createFileRoute } from "@tanstack/react-router";
import { useProgress } from "@/lib/progress";
import { GERMAN_PATHS } from "@/data/language-paths";
import { PageTitle } from "@/components/AppShell";
import { VoxReader } from "@/components/VoxReader";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/idiomas")({
  head: () =>
    meta(
      "Idiomas",
      "Cursos opcionais de latim, alemão e inglês, com primeira lição, guia de pronúncia e aplicações ao estudo filosófico.",
    ),
  component: Idiomas,
});

const COURSES = {
  la: {
    name: "Latim",
    lang: "la" as const,
    title: "Lição 1 — Primeira declinação",
    body: "Rosa, rosae: a rosa. A primeira declinação reúne sobretudo substantivos femininos terminados em -a. Nominativo rosa, genitivo rosae, acusativo rosam, ablativo rosa. Frase: Philosophia ancilla theologiae dicitur — a filosofia é dita serva da teologia.",
    pron: "Pronúncia eclesiástica (descrição escrita): 'ae' soa como 'é'; 'c' antes de e/i soa 'tch' (caelum: 'tchélum'); 'g' antes de e/i soa 'dj'; 'ti' antes de vogal soa 'tsi' (gratia: 'grátsia').",
    use: "Ler os títulos e artigos da Suma no original: Utrum Deus sit.",
  },
  de: {
    name: "Alemão",
    lang: "de" as const,
    title: "Lektion 1 — Sein und Wesen",
    body: "Das Sein und das Wesen. Was ist das? Das ist ein Buch. Der Mensch denkt. Die Wahrheit ist nicht nur eine Meinung.",
    pron: "'ei' soa 'ai' (Sein: 'zain'); 'ie' soa 'i' longo; 'w' soa 'v'; 'ch' após a/o/u é gutural; substantivos sempre com maiúscula.",
    use: "Acesso à grande erudição tomista e histórica em língua alemã.",
  },
  en: {
    name: "Inglês",
    lang: "en" as const,
    title: "Lesson 1 — Reading an argument",
    body: "Every man is mortal. Socrates is a man. Therefore, Socrates is mortal. The conclusion follows from the premises. An argument can be valid and still unsound.",
    pron: "'th' em 'therefore' é sonoro; 'valid' acentua a primeira sílaba; 'unsound' = não sólido: pode ser inválido ou válido com premissa falsa.",
    use: "Ler comentários e traduções acadêmicas contemporâneas.",
  },
};

export function Idiomas() {
  const { progress, setNote, storageError, isReady } = useProgress();
  const savedCourse = progress.notes["idiomas:course"];
  const k: keyof typeof COURSES = savedCourse === "de" || savedCourse === "en" ? savedCourse : "la";
  const c = COURSES[k];
  const path =
    GERMAN_PATHS.find((item) => item.id === progress.notes["de-path:selected"]) ?? GERMAN_PATHS[0]!;
  return (
    <div>
      <PageTitle kicker="Linguae" title="Idiomas">
        Percursos independentes e opcionais. Comece por qualquer um.
      </PageTitle>
      {!isReady && (
        <p role="status" className="mt-3">
          Carregando seus registros…
        </p>
      )}
      <div aria-label="Cursos de idiomas" className="flex flex-wrap gap-2">
        {(Object.keys(COURSES) as (keyof typeof COURSES)[]).map((x) => (
          <button
            key={x}
            disabled={!isReady}
            aria-pressed={x === k}
            className={`btn ${x === k ? "" : "btn-ghost"}`}
            onClick={() => setNote("idiomas:course", x)}
          >
            {COURSES[x].name}
          </button>
        ))}
      </div>
      {storageError && (
        <p role="alert" className="text-primary mt-3">
          {storageError}
        </p>
      )}
      {k === "de" && (
        <section className="folio p-5 mt-5" aria-label="Percursos de alemão">
          <h2 className="text-3xl">Percursos independentes de alemão</h2>
          <p className="text-sm mt-3">
            Primeiras atividades e referências para orientar o estudo; não se apresentam como cursos
            completos ou certificação de nível. Comece por qualquer percurso. A leitura gótica é
            eletiva.
          </p>
          <nav aria-label="Níveis e leitura histórica" className="flex flex-wrap gap-2 mt-4">
            {GERMAN_PATHS.map((item) => (
              <button
                type="button"
                key={item.id}
                disabled={!isReady}
                aria-pressed={path.id === item.id}
                className={`btn ${path.id === item.id ? "" : "btn-ghost"}`}
                onClick={() => setNote("de-path:selected", item.id)}
              >
                {item.title}
              </button>
            ))}
          </nav>
          <h3 className="text-2xl mt-5">{path.title}</h3>
          <p className="mt-2">{path.purpose}</p>
          <p className="text-sm mt-3 text-muted-foreground">{path.note}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {path.references.map((reference) => (
              <a
                key={reference}
                href={`/biblioteca#${reference}`}
                className="text-primary underline text-sm"
              >
                Ficha {reference} · referência
              </a>
            ))}
          </div>
          <p className="rubric mt-5">Lectio · texto autoral</p>
          <blockquote className="border-l-2 border-gold pl-3 mt-2" lang="de">
            {path.reading}
          </blockquote>
          <p className="mt-4">{path.prompt}</p>
          <label htmlFor={`de-path-${path.id}`} className="block font-display text-xl mt-3">
            Sua análise do percurso
          </label>
          <textarea
            id={`de-path-${path.id}`}
            disabled={!isReady}
            className="field mt-2 min-h-32"
            value={progress.notes[`de-path:${path.id}:answer`] ?? ""}
            onChange={(event) => setNote(`de-path:${path.id}:answer`, event.target.value)}
          />
          <h4 className="text-xl mt-4">Antes de encerrar, confira</h4>
          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
            {path.criteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mt-3">
            Seu rascunho é salvo neste aparelho; os critérios orientam sua revisão, sem nota
            automática.
          </p>
        </section>
      )}
      <article className="folio p-6 mt-5">
        <h2 className="text-3xl">{c.title}</h2>
        <p className="initial mt-4">{c.body}</p>
        <h3 className="text-xl mt-5">Pronúncia</h3>
        <p>{c.pron}</p>
        <h3 className="text-xl mt-4">Aplicação</h3>
        <p>{c.use}</p>
        <VoxReader key={k} text={c.body} defaultLang={c.lang} langs={[c.lang]} />
      </article>
    </div>
  );
}

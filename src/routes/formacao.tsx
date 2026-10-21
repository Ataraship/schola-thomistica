import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageTitle } from "@/components/AppShell";
import { VoxReader } from "@/components/VoxReader";
import { TRACKS, type Lesson } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/formacao")({
  head: () =>
    meta(
      "Formação Fundamental",
      "Lógica, Platão, Aristóteles, metafísica, patrística e introdução tomista com exercícios de raciocínio.",
    ),
  component: Formacao,
});

function Formacao() {
  const [trackId, setTrackId] = useState("logica");
  const track = TRACKS.find((item) => item.id === trackId)!;
  const [lessonId, setLessonId] = useState("log-1");
  const lesson = track.lessons.find((item) => item.id === lessonId) ?? track.lessons[0]!;
  const { progress, setLast } = useProgress();
  const prereq = TRACKS.find((item) => item.id === track.prereq);
  useEffect(() => {
    setLast("/formacao", `${track.title}: ${lesson.title}`);
  }, [track.title, lesson.title, setLast]);
  function chooseTrack(id: string) {
    const target = TRACKS.find((item) => item.id === id)!;
    setTrackId(id);
    setLessonId(target.lessons[0]!.id);
  }
  return (
    <div>
      <PageTitle kicker="Fundamenta" title="Formação Fundamental">
        Navegação livre. Leia, exponha suas razões e confronte a melhor objeção; pré-requisitos são
        sugestões, não travas.
      </PageTitle>
      <nav aria-label="Trilhas" className="flex flex-wrap gap-2">
        {TRACKS.map((item) => (
          <button
            key={item.id}
            aria-pressed={item.id === track.id}
            onClick={() => chooseTrack(item.id)}
            className={`btn ${item.id === track.id ? "" : "btn-ghost"}`}
          >
            {item.title}
          </button>
        ))}
      </nav>
      <p className="mt-4 italic text-muted-foreground">
        {track.latin} — {track.summary}
      </p>
      {prereq && (
        <p className="text-sm mt-1">
          Sugestão: estude antes{" "}
          <button className="underline text-primary" onClick={() => chooseTrack(prereq.id)}>
            {prereq.title}
          </button>
          .
        </p>
      )}
      <nav aria-label="Lições da trilha" className="mt-4 flex flex-wrap gap-2">
        {track.lessons.map((item, index) => (
          <button
            key={item.id}
            aria-pressed={item.id === lesson.id}
            onClick={() => setLessonId(item.id)}
            className={`text-sm rounded-md border px-3 py-2 ${item.id === lesson.id ? "border-primary text-primary" : ""}`}
          >
            {progress.completed.includes(item.id) ? "✓ " : ""}
            {index + 1}. {item.title}
          </button>
        ))}
      </nav>
      <LessonWorkshop key={lesson.id} lesson={lesson} />
    </div>
  );
}

export function LessonWorkshop({ lesson }: { lesson: Lesson }) {
  const { progress, setNote, toggle, storageError } = useProgress();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const study = lesson.study;
  const attempt = progress.notes[lesson.id] ?? "";
  const pick = progress.notes[`${lesson.id}:choice`];
  const option = pick === undefined ? undefined : lesson.options?.[Number(pick)];
  return (
    <article className="folio p-5 sm:p-6 mt-5">
      <h2 className="text-3xl">{lesson.title}</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {lesson.concepts.map((concept) => (
          <span key={concept} className="text-xs rounded-full bg-accent px-2 py-0.5">
            {concept}
          </span>
        ))}
      </div>
      {study && (
        <p className="mt-4 text-secondary">
          <strong>Objetivo:</strong> {study.objective}
        </p>
      )}
      <p className="initial mt-4">{lesson.body}</p>
      {study?.sections.map((section) => (
        <section key={section.title} className="mt-5">
          <h3 className="text-2xl">{section.title}</h3>
          <p className="mt-2">{section.text}</p>
        </section>
      ))}
      <VoxReader text={`${lesson.title}. ${lesson.body}`} />
      <div className="gold-rule my-5" />
      <h3 className="text-2xl">Exercitium · exponha suas razões</h3>
      <p className="mt-2">{lesson.exercise}</p>
      <label htmlFor={`answer-${lesson.id}`} className="block font-display text-xl mt-4">
        Seu raciocínio
      </label>
      <textarea
        id={`answer-${lesson.id}`}
        className="field mt-2 min-h-36"
        value={attempt}
        onChange={(event) => setNote(lesson.id, event.target.value)}
        placeholder="Identifique as premissas, a conclusão e a ligação entre elas. Procure uma objeção ou contraexemplo."
      />
      {storageError && (
        <p role="alert" className="text-primary mt-2">
          {storageError}
        </p>
      )}
      {study && (
        <>
          <button
            type="button"
            className="btn btn-ghost mt-4"
            disabled={!attempt.trim()}
            aria-expanded={showAnalysis}
            onClick={() => setShowAnalysis((value) => !value)}
          >
            {showAnalysis ? "Recolher análise" : "Conferir análise do argumento"}
          </button>
          {showAnalysis && (
            <section className="border rounded-md p-4 mt-4" aria-label="Análise orientadora">
              <ol className="list-decimal pl-5 space-y-2">
                {study.argument.premises.map((premise) => (
                  <li key={premise}>{premise}</li>
                ))}
              </ol>
              <p className="mt-3">
                <strong>Conclusão:</strong> {study.argument.conclusion}
              </p>
              <p className="mt-3">{study.argument.analysis}</p>
              <p className="text-sm mt-3 text-muted-foreground">
                A análise explica a inferência; não atribui uma nota à sua resposta.
              </p>
            </section>
          )}
        </>
      )}
      {lesson.options && (!study || showAnalysis) && (
        <fieldset className="mt-4">
          <legend className="font-display text-xl">Confronte sua conclusão</legend>
          {lesson.options.map((item, index) => (
            <label key={item.text} className="field flex items-start gap-3 mt-2">
              <input
                type="radio"
                name={`choice-${lesson.id}`}
                checked={pick === String(index)}
                onChange={() => setNote(`${lesson.id}:choice`, String(index))}
              />
              <span>{item.text}</span>
            </label>
          ))}
          {option && (
            <p role="status" className="mt-3">
              {option.why}
            </p>
          )}
        </fieldset>
      )}
      {study && (
        <>
          <h3 className="text-2xl mt-6">Objeção e revisão do juízo</h3>
          <p className="mt-2">{study.reflection}</p>
          <label htmlFor={`revision-${lesson.id}`} className="sr-only">
            Sua revisão
          </label>
          <textarea
            id={`revision-${lesson.id}`}
            className="field mt-2 min-h-28"
            value={progress.notes[`${lesson.id}:revision`] ?? ""}
            onChange={(event) => setNote(`${lesson.id}:revision`, event.target.value)}
          />
          <fieldset className="mt-5 border rounded-md p-4">
            <legend className="font-display text-xl px-1">Critérios de autoavaliação</legend>
            <p className="text-sm mb-3">
              Assinale o que consegue justificar. A marcação não equivale a correção automática.
            </p>
            {study.criteria.map((criterion, index) => (
              <label key={criterion} className="flex gap-3 items-start mt-2">
                <input
                  type="checkbox"
                  checked={progress.notes[`${lesson.id}:criterion:${index}`] === "yes"}
                  onChange={(event) =>
                    setNote(`${lesson.id}:criterion:${index}`, event.target.checked ? "yes" : "no")
                  }
                />
                <span>{criterion}</span>
              </label>
            ))}
          </fieldset>
          <p className="text-sm text-muted-foreground mt-4">{study.source}</p>
          <a href="/biblioteca#REF-2026-01" className="text-primary underline text-sm">
            Consultar a ficha da referência de lógica
          </a>
          {study.practice && (
            <a href={study.practice.href} className="btn btn-ghost block mt-4 w-fit">
              {study.practice.label}
            </a>
          )}
        </>
      )}
      <button type="button" className="btn btn-green mt-5 block" onClick={() => toggle(lesson.id)}>
        {progress.completed.includes(lesson.id)
          ? "Marcar como não concluída"
          : "Marcar como concluída"}
      </button>
    </article>
  );
}

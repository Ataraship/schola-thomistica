import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageTitle } from "@/components/AppShell";
import { VoxReader } from "@/components/VoxReader";
import { TRACKS } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/formacao")({
  head: () => meta("Formação Fundamental", "Trilhas de lógica, Platão, Aristóteles, metafísica, patrística e introdução tomista com exercícios de raciocínio."),
  component: Formacao,
});

function Formacao() {
  const [trackId, setTrackId] = useState("logica");
  const track = TRACKS.find((t) => t.id === trackId)!;
  const [lessonId, setLessonId] = useState(track.lessons[0]!.id);
  const lesson = track.lessons.find((l) => l.id === lessonId) ?? track.lessons[0]!;
  const { progress, toggle, setLast, setNote } = useProgress();
  const [pick, setPick] = useState<number | null>(null);
  const prereq = TRACKS.find((t) => t.id === track.prereq);

  useEffect(() => { setLast("/formacao", `${track.title}: ${lesson.title}`); setPick(null); }, [lesson.id]);

  return (
    <div>
      <PageTitle kicker="Fundamenta" title="Formação Fundamental">Navegação livre. Os pré-requisitos são sugestões, não travas.</PageTitle>
      <div role="tablist" aria-label="Trilhas" className="flex flex-wrap gap-2">
        {TRACKS.map((t) => (
          <button key={t.id} role="tab" aria-selected={t.id === trackId} onClick={() => { setTrackId(t.id); setLessonId(t.lessons[0]!.id); }}
            className={`btn ${t.id === trackId ? "" : "btn-ghost"}`}>{t.title}</button>
        ))}
      </div>
      <p className="mt-4 italic text-muted-foreground">{track.latin} — {track.summary}</p>
      {prereq && <p className="text-sm mt-1">Sugestão: estude antes <button className="underline text-primary" onClick={() => { setTrackId(prereq.id); setLessonId(prereq.lessons[0]!.id); }}>{prereq.title}</button>.</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {track.lessons.map((l, i) => (
          <button key={l.id} onClick={() => setLessonId(l.id)} className={`text-sm rounded-md border px-3 py-1 ${l.id === lesson.id ? "border-primary text-primary" : ""}`}>
            {progress.completed.includes(l.id) ? "✓ " : ""}Lição {i + 1}
          </button>
        ))}
      </div>

      <article className="folio p-6 mt-4">
        <h2 className="text-3xl">{lesson.title}</h2>
        <div className="flex flex-wrap gap-2 mt-2">{lesson.concepts.map((c) => <span key={c} className="text-xs rounded-full bg-accent px-2 py-0.5">{c}</span>)}</div>
        <p className="initial mt-4">{lesson.body}</p>
        <VoxReader text={`${lesson.title}. ${lesson.body}`} />
        <div className="gold-rule my-4" />
        <h3 className="text-2xl">Exercitium</h3>
        <p className="mt-1">{lesson.exercise}</p>
        {lesson.options ? (
          <div className="mt-3 flex flex-col gap-2">
            {lesson.options.map((o, i) => (
              <button key={i} onClick={() => setPick(i)} className="text-left field">{o.text}</button>
            ))}
            {pick !== null && <p role="status" className={lesson.options[pick]!.correct ? "text-secondary" : "text-primary"}>{lesson.options[pick]!.why}</p>}
          </div>
        ) : (
          <>
            <label htmlFor="resp" className="sr-only">Sua resposta</label>
            <textarea id="resp" className="field mt-3 min-h-32" placeholder="Escreva seu raciocínio. Salvo automaticamente neste aparelho."
              value={progress.notes[lesson.id] ?? ""} onChange={(e) => setNote(lesson.id, e.target.value)} />
            <p className="text-sm text-muted-foreground mt-1">Pergunte-se: quais são minhas premissas? Alguma delas é apenas opinião?</p>
          </>
        )}
        <button className="btn btn-green mt-5" onClick={() => toggle(lesson.id)}>
          {progress.completed.includes(lesson.id) ? "Marcar como não concluída" : "Marcar como concluída"}
        </button>
      </article>
    </div>
  );
}

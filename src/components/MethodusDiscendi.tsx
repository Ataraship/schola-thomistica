import { useEffect, useMemo, useState } from "react";
import { ACTIVITIES, LANGUAGE_COURSES } from "@/data/activities";
import { ActivityWorkbench } from "@/components/ActivityWorkbench";
import { useProgress } from "@/lib/progress";
import {
  activityFields,
  activityHistory,
  answerKey,
  completionKey,
  isObjective,
  reviewSchedule,
  selectionKey,
  type Activity,
} from "@/lib/activities";

export function MethodusDiscendi({ course }: { course: Activity["course"] }) {
  const { progress, setNote, isReady } = useProgress();
  const [now, setNow] = useState(0);
  const [active, setActive] = useState<{ course: Activity["course"]; id: string } | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const activities = useMemo(
    () => ACTIVITIES.filter((activity) => activity.course === course),
    [course],
  );
  const resumeId =
    activities.find((activity) => activity.id === progress.notes[selectionKey(course)])?.id ??
    activities[0]!.id;
  useEffect(() => {
    if (isReady)
      setActive((previous) => (previous?.course === course ? previous : { course, id: resumeId }));
  }, [isReady, course, resumeId]);
  const selected =
    activities.find(
      (activity) => activity.id === (active?.course === course ? active.id : resumeId),
    ) ?? activities[0]!;
  const curriculum = LANGUAGE_COURSES.find((item) => item.id === course);
  const agenda = activities.filter(isObjective).map((activity) => {
    const history = activityHistory(progress.notes, activity);
    return { activity, history, schedule: reviewSchedule(activity, history.events) };
  });
  const choose = (id: string) => {
    setActive({ course, id });
    setNote(selectionKey(course), id);
  };
  return (
    <section aria-label="Methodus Discendi" className="mt-4">
      <p>
        Atividades demonstrativas independentes das 14 lições de formação. Seus rascunhos,
        tentativas e versões permanecem neste navegador. Não são cursos completos nem certificação
        de domínio.
      </p>
      {curriculum &&
        curriculum.levels.map((level) => (
          <section
            key={level.id}
            className="mt-4"
            aria-label={`Percurso demonstrativo de ${curriculum.title}`}
          >
            <h2 className="text-2xl">
              {curriculum.title} · {level.title}
            </h2>
            {level.units.map((unit) => (
              <div key={unit.id} className="mt-3">
                <h3 className="text-xl">{unit.title}</h3>
                {unit.lessons.map((lesson) => (
                  <div key={lesson.id} className="mt-2">
                    <p className="font-semibold">{lesson.title}</p>
                    <dl className="mt-2">
                      {lesson.vocabulary.map((word) => (
                        <div key={word.term} className="mt-1">
                          <dt className="inline font-semibold">{word.term}: </dt>
                          <dd className="inline">{word.meaning}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-2">
                      <strong>Gramática: </strong>
                      {lesson.grammar}
                    </p>
                    <p className="mt-2">
                      <strong>Leitura: </strong>
                      {lesson.reading}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </section>
        ))}
      <nav aria-label="Atividades do Methodus" className="flex flex-col items-start gap-2 mt-5">
        {activities.map((activity) => {
          const history = activityHistory(progress.notes, activity);
          const hasDraft = activityFields(activity).some(
            (field) => progress.notes[answerKey(activity.id, field.id)],
          );
          const status =
            progress.notes[completionKey(activity.id)] === "yes"
              ? "Concluída por você"
              : hasDraft || history.events.length
                ? "Em andamento · retomar"
                : "Pendente";
          return (
            <button
              key={activity.id}
              type="button"
              className={`btn ${selected.id === activity.id ? "" : "btn-ghost"}`}
              disabled={!isReady}
              aria-pressed={selected.id === activity.id}
              onClick={() => choose(activity.id)}
            >
              {activity.title} · {status}
            </button>
          );
        })}
      </nav>
      <section aria-label="Revisão programada" className="border rounded-md p-4 mt-5">
        <h2 className="text-2xl">Revisão programada</h2>
        <p className="text-sm mt-2">
          Apenas exercícios objetivos: erro permite revisão imediata; acertos no momento devido usam
          intervalos de 1, 3, 7, 14 e 30 dias de 24 horas. Praticar antes da data não amplia o
          intervalo. Isto organiza a revisão, sem medir domínio.
        </p>
        {!agenda.length && (
          <p className="mt-2">
            Atividades filosóficas abertas usam versões e critérios, sem calendário ou nota
            automática. Releia a análise e registre sua revisão fundamentada.
          </p>
        )}
        <ul className="mt-3 space-y-3">
          {agenda.map(({ activity, history, schedule }) => (
            <li key={activity.id}>
              <button
                type="button"
                className="underline text-primary"
                disabled={!isReady}
                onClick={() => choose(activity.id)}
              >
                {activity.title}
              </button>
              <p className="text-sm">
                {history.invalid.length ? (
                  "Agenda suspensa: inspecione o registro preservado."
                ) : schedule?.dueAt === null ? (
                  "Pendente: ainda não estudado."
                ) : schedule && schedule.dueAt !== null && schedule.dueAt <= now ? (
                  "Revisão disponível agora."
                ) : schedule?.dueAt !== null && schedule?.dueAt !== undefined ? (
                  <>
                    Próxima revisão:{" "}
                    <time dateTime={new Date(schedule.dueAt).toISOString()}>
                      {new Date(schedule.dueAt).toLocaleString("pt-BR")}
                    </time>
                    .
                  </>
                ) : (
                  "Pendente."
                )}
              </p>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-ghost mt-3" onClick={() => setNow(Date.now())}>
          Atualizar agenda
        </button>
      </section>
      <ActivityWorkbench
        key={selected.id}
        activity={selected}
        now={now}
        onRecorded={() => setNow(Date.now())}
      />
    </section>
  );
}

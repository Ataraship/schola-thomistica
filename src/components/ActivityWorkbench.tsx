import { useState } from "react";
import { ACTIVITIES } from "@/data/activities";
import { ActivityEditor } from "@/components/ActivityEditor";
import { useProgress } from "@/lib/progress";
import {
  activityFields,
  activityHistory,
  answerKey,
  completionKey,
  evaluate,
  eventPrefix,
  isObjective,
  newActivityEvent,
  parseActivityEvent,
  reviewSchedule,
  type Activity,
  type ActivityEvent,
  type Answers,
} from "@/lib/activities";

function AnswerSnapshot({
  answers,
  activity,
}: {
  answers: Answers;
  activity: Activity | undefined;
}) {
  const fields = activity ? activityFields(activity) : [];
  const display = (text: string) => {
    if (activity?.kind === "multiple-choice" || activity?.kind === "error-identification")
      return activity.options.find((option) => option.id === text)?.label ?? text;
    if (activity?.kind === "matching")
      return activity.targets.find((target) => target.id === text)?.label ?? text;
    if (activity?.kind === "ordering")
      return activity.items.find((item) => item.id === text)?.label ?? text;
    return text;
  };
  return (
    <dl className="space-y-2 mt-3">
      {Object.entries(answers).map(([field, text]) => (
        <div key={field}>
          <dt className="font-semibold break-words">
            {fields.find((item) => item.id === field)?.label ?? field}
          </dt>
          <dd className="whitespace-pre-wrap break-words">{display(text)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ActivityWorkbench({
  activity,
  now,
  onRecorded,
}: {
  activity: Activity;
  now: number;
  onRecorded: () => void;
}) {
  const { progress, isReady, storageError, setNote } = useProgress();
  const [actionError, setActionError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const answers = Object.fromEntries(
    activityFields(activity).map((field) => [
      field.id,
      progress.notes[answerKey(activity.id, field.id)] ?? "",
    ]),
  );
  const history = activityHistory(progress.notes, activity);
  const current = history.events.filter((event) => event.revision === activity.revision);
  const latest = current.at(-1);
  const schedule = reviewSchedule(activity, current);
  const complete = activityFields(activity).every((field) => answers[field.id]?.trim());
  const sameAsLast =
    latest &&
    activityFields(activity).every((field) => latest.answers[field.id] === answers[field.id]);
  const sourceActivity =
    activity.kind === "revision"
      ? ACTIVITIES.find((item) => item.id === activity.sourceActivityId)
      : undefined;
  const sourceHistory = sourceActivity
    ? activityHistory(progress.notes, sourceActivity)
    : undefined;
  const source = sourceHistory?.events
    .filter((event) => event.revision === sourceActivity?.revision)
    .at(-1);
  const completion = progress.notes[completionKey(activity.id)];
  const invalidCompletion = completion !== undefined && completion !== "yes" && completion !== "no";
  const blocked =
    history.invalid.length > 0 || !!sourceHistory?.invalid.length || invalidCompletion;
  const allowNew =
    !sameAsLast ||
    !!(
      latest?.result === "correct" &&
      schedule?.dueAt !== null &&
      schedule?.dueAt !== undefined &&
      schedule.dueAt <= now
    );

  const saveVersion = () => {
    try {
      const ordinal = history.events.reduce((max, event) => Math.max(max, event.ordinal), 0) + 1;
      const event = newActivityEvent(activity, answers, Date.now(), source, ordinal);
      const key = eventPrefix(activity.id) + event.id;
      if (progress.notes[key] !== undefined)
        throw new Error(
          "A identidade do registro já está ocupada. Sua resposta foi mantida; tente registrar novamente.",
        );
      const raw = JSON.stringify(event);
      parseActivityEvent(raw, activity, key);
      setNote(key, raw);
      onRecorded();
      setActionError(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar. Suas respostas foram mantidas.",
      );
    }
  };
  return (
    <article className="folio p-5 sm:p-6 mt-5" aria-labelledby={`${activity.id}-title`}>
      <p className="rubric">Exercitium · demonstração funcional</p>
      <h3 id={`${activity.id}-title`} className="text-3xl mt-2">
        {activity.title}
      </h3>
      <p className="mt-3 whitespace-pre-line">{activity.prompt}</p>
      {!isReady && (
        <p role="status" className="mt-3">
          Carregando seus registros…
        </p>
      )}
      {storageError && (
        <p role="alert" className="text-primary mt-3">
          {storageError}
        </p>
      )}
      {actionError && (
        <p role="alert" className="mt-3">
          {actionError}
        </p>
      )}
      {blocked && (
        <div role="alert" className="mt-3 border p-3">
          Há um registro de atividade inválido ou de versão desconhecida. Seus bytes foram
          preservados. Você pode continuar o rascunho; novos registros e a conclusão estão suspensos
          até sua recuperação. Copie os registros abaixo antes de qualquer inspeção manual.
          {[...history.invalid, ...(sourceHistory?.invalid ?? [])].map((entry) => (
            <details key={entry.key} className="mt-2">
              <summary className="break-all">{entry.key}</summary>
              <pre className="whitespace-pre-wrap break-all">{entry.raw}</pre>
            </details>
          ))}
          {invalidCompletion && <pre className="whitespace-pre-wrap break-all">{completion}</pre>}
        </div>
      )}
      {activity.kind === "revision" && (
        <aside className="mt-4 border p-3" aria-label="Versão de partida">
          {source ? (
            <>
              <p>
                Versão registrada da análise de partida. Ao registrar esta revisão, será conservada
                uma cópia vinculada a ela.
              </p>
              <AnswerSnapshot activity={sourceActivity} answers={source.answers} />
            </>
          ) : (
            <p>
              Registre uma versão em “Análise: validade, verdade e contraexemplo” para vinculá-la à
              revisão. O rascunho da revisão permanece livre.
            </p>
          )}
        </aside>
      )}
      <fieldset disabled={!isReady} className="mt-5">
        <legend className="sr-only">Respostas de {activity.title}</legend>
        <ActivityEditor
          activity={activity}
          answers={answers}
          onChange={(field, value) => {
            setNote(answerKey(activity.id, field), value);
            setActionError(null);
          }}
        />
      </fieldset>
      {!isObjective(activity) && (
        <section className="mt-5" aria-label="Critérios de revisão">
          <h4 className="text-2xl">Critérios transparentes</h4>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            {activity.criteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-ghost mt-3"
            disabled={!isReady || !complete}
            aria-expanded={showGuide}
            onClick={() => setShowGuide((value) => !value)}
          >
            Orientação para revisar
          </button>
          {showGuide && <p className="mt-3">{activity.guide}</p>}
          <p className="text-sm mt-3">
            Uma versão preenchida não equivale a uma resposta correta. O sistema não atribui nota
            filosófica.
          </p>
        </section>
      )}
      <button
        type="button"
        className="btn mt-4"
        disabled={
          !isReady || !complete || blocked || !allowNew || (activity.kind === "revision" && !source)
        }
        onClick={saveVersion}
      >
        {isObjective(activity) ? "Conferir e registrar tentativa" : "Registrar esta versão"}
      </button>
      {latest && (
        <section className="mt-4 border rounded-md p-4" aria-label="Último registro">
          <h4 className="text-xl">
            {latest.result === "ungraded"
              ? "Versão registrada · sem nota automática"
              : latest.result === "correct"
                ? "Resposta registrada correta neste exercício"
                : "Resposta a revisar"}
          </h4>
          {isObjective(activity) && (
            <p role="status" className="mt-2">
              {evaluate(activity, latest.answers).feedback}
            </p>
          )}
          {sameAsLast &&
            schedule?.dueAt !== null &&
            schedule?.dueAt !== undefined &&
            schedule.dueAt > now && (
              <p className="mt-2 text-sm">
                A mesma resposta já foi registrada. A revisão programada ficará disponível na data
                indicada; repetir cliques não amplia o intervalo.
              </p>
            )}
          <p className="text-sm mt-2">
            O retorno corresponde à versão registrada abaixo, mesmo se o rascunho mudar.
          </p>
          <details className="mt-2">
            <summary>Ver respostas registradas</summary>
            <AnswerSnapshot activity={activity} answers={latest.answers} />
          </details>
        </section>
      )}
      <button
        type="button"
        className="btn btn-green mt-4"
        disabled={!isReady || blocked}
        aria-pressed={completion === "yes"}
        onClick={() => setNote(completionKey(activity.id), completion === "yes" ? "no" : "yes")}
      >
        {completion === "yes" ? "Reabrir atividade" : "Concluir por decisão própria"}
      </button>
      <p className="text-sm mt-2">
        Conclusão declarada por você; não certifica domínio. Respostas e versões permanecem
        disponíveis.
      </p>
      <details className="mt-5">
        <summary className="font-display text-xl">
          Histórico de tentativas e versões ({history.events.length})
        </summary>
        {!history.events.length && (
          <p className="mt-2">
            Nenhuma versão registrada. Seu rascunho já é salvo quando o armazenamento permite.
          </p>
        )}
        <ol className="space-y-3 mt-3">
          {[...history.events].reverse().map((event: ActivityEvent) => (
            <li key={event.id} className="border p-3 rounded-md">
              <p>
                {event.result === "ungraded"
                  ? "Sem nota automática"
                  : event.result === "correct"
                    ? "Correta"
                    : "Erro anterior"}{" "}
                · versão do exercício {event.revision}
              </p>
              <time dateTime={new Date(event.at).toISOString()}>
                {new Date(event.at).toLocaleString("pt-BR")}
              </time>
              <AnswerSnapshot activity={activity} answers={event.answers} />
              {event.source && (
                <details className="mt-3">
                  <summary>Versão de partida preservada nesta revisão</summary>
                  <AnswerSnapshot
                    activity={ACTIVITIES.find((item) => item.id === event.source?.activityId)}
                    answers={event.source.answers}
                  />
                </details>
              )}
            </li>
          ))}
        </ol>
      </details>
      <p className="text-xs text-muted-foreground mt-4">{activity.provenance}</p>
    </article>
  );
}

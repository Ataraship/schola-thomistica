import {
  IMAGES_STUDIUM,
  type StudiumActivity,
  studiumCriterionKey,
  studiumNoteKey,
} from "@/data/studium";
import { useProgress } from "@/lib/progress";

export function StudiumFontium({ activity = IMAGES_STUDIUM }: { activity?: StudiumActivity }) {
  const { progress, setNote, toggle, storageError } = useProgress();
  const completed = progress.completed.includes(activity.id);
  const elementId = (suffix: string) => `${activity.id}:${suffix}`;

  return (
    <section id={activity.id} aria-labelledby={elementId("title")} className="mt-10 scroll-mt-20">
      <div className="gold-rule mb-6" />
      <p className="rubric">Studium Fontium · oficina de leitura</p>
      <h2 id={elementId("title")} className="text-3xl mt-2">
        {activity.title}
      </h2>
      <p className="font-display text-xl text-secondary mt-3">{activity.question}</p>
      <p className="mt-3 text-sm text-muted-foreground">
        Percurso livre: Lectio → Quaestio → Argumentatio → Disputatio → Iudicium. Leia, formule suas
        razões e volte aos registros para revê-los. Nenhuma etapa bloqueia as seguintes.
      </p>
      <nav
        aria-label={`Etapas do Studium Fontium · ${activity.title}`}
        className="flex flex-wrap gap-2 mt-4"
      >
        {activity.stages.map((stage) => (
          <a
            key={stage.id}
            href={`#${studiumNoteKey(stage.id, activity.id)}`}
            className="btn btn-ghost"
          >
            {stage.title.split(" · ")[0]}
          </a>
        ))}
      </nav>
      <aside className="folio p-5 mt-5" aria-labelledby={elementId("source-title")}>
        <p className="rubric">Fonte e alcance</p>
        <h3 id={elementId("source-title")} className="text-2xl mt-2">
          {activity.source.author}
        </h3>
        <p className="mt-2 italic">{activity.source.work}</p>
        <p className="text-sm mt-2">
          {activity.source.referenceId} · {activity.source.edition}
        </p>
        <p className="text-sm mt-3">
          <strong>Disponibilidade:</strong> {activity.source.availability}
        </p>
        <p className="text-sm mt-2">
          <strong>Verificação:</strong> {activity.source.verification}
        </p>
        <p className="text-sm text-muted-foreground mt-2">{activity.source.rights}</p>
      </aside>
      <article className="folio p-5 sm:p-6 mt-5" aria-labelledby={elementId("exposition-title")}>
        <p className="rubric">Exposição autoral · introdução histórica e conceitual</p>
        <h3 id={elementId("exposition-title")} className="text-2xl mt-2">
          {activity.expositionTitle}
        </h3>
        <div className="space-y-3 mt-4">
          {activity.exposition.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 mt-5">
          {activity.terms.map((entry) => (
            <div key={entry.term} className="rounded-md border p-3">
              <dt className="font-display text-xl text-primary">{entry.term}</dt>
              <dd className="text-sm mt-1">{entry.description}</dd>
            </div>
          ))}
        </dl>
      </article>
      {activity.caseStudy && (
        <article className="folio p-5 sm:p-6 mt-5" aria-labelledby={elementId("case-title")}>
          <p className="rubric">Caso para deliberar · exercício autoral</p>
          <h3 id={elementId("case-title")} className="text-2xl mt-2">
            {activity.caseStudy.title}
          </h3>
          <p className="mt-3">{activity.caseStudy.scenario}</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            {activity.caseStudy.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            Retome este caso nas etapas abaixo e justifique suas escolhas. Você pode revisar o juízo
            ao reconhecer uma dificuldade ou considerar novas razões.
          </p>
        </article>
      )}
      {storageError && (
        <p role="alert" className="text-primary mt-4">
          {storageError}
        </p>
      )}
      <p className="text-sm text-muted-foreground mt-5">
        Respostas e autoavaliação ficam neste navegador quando o armazenamento está disponível, sem
        login. Este roteiro não corrige automaticamente o conteúdo nem atribui uma nota.
      </p>
      <div className="space-y-5 mt-4">
        {activity.stages.map((stage, index) => (
          <section
            key={stage.id}
            className="folio p-5 sm:p-6"
            aria-labelledby={elementId(`title-${stage.id}`)}
          >
            <p className="rubric">
              Etapa {index + 1} de {activity.stages.length}
            </p>
            <h3 id={elementId(`title-${stage.id}`)} className="text-2xl mt-2">
              {stage.title}
            </h3>
            <p className="text-secondary text-sm mt-2">{stage.purpose}</p>
            <p id={elementId(`prompt-${stage.id}`)} className="mt-3">
              {stage.prompt}
            </p>
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer underline text-primary">
                Perguntas para revisar esta etapa
              </summary>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {stage.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </details>
            <label
              htmlFor={studiumNoteKey(stage.id, activity.id)}
              className="block font-display text-xl mt-4"
            >
              Seu registro · {stage.title.split(" · ")[0]}
            </label>
            <textarea
              id={studiumNoteKey(stage.id, activity.id)}
              className="field mt-2 min-h-32 scroll-mt-32"
              aria-describedby={elementId(`prompt-${stage.id}`)}
              value={progress.notes[studiumNoteKey(stage.id, activity.id)] ?? ""}
              onChange={(event) =>
                setNote(studiumNoteKey(stage.id, activity.id), event.target.value)
              }
            />
          </section>
        ))}
      </div>
      <fieldset className="folio p-5 sm:p-6 mt-5">
        <legend className="font-display text-2xl px-2">Exame do próprio raciocínio</legend>
        <p className="text-sm mb-4">
          Assinale apenas os critérios que consegue justificar no que escreveu. Sua marcação
          registra uma autoavaliação; não comprova a verdade da conclusão.
        </p>
        <div className="space-y-3">
          {activity.criteria.map((criterion) => (
            <label key={criterion.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={progress.notes[studiumCriterionKey(criterion.id, activity.id)] === "yes"}
                onChange={(event) =>
                  setNote(
                    studiumCriterionKey(criterion.id, activity.id),
                    event.target.checked ? "yes" : "no",
                  )
                }
              />
              <span>{criterion.text}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button
        className="btn btn-green mt-5"
        type="button"
        aria-pressed={completed}
        onClick={() => toggle(activity.id)}
      >
        {completed ? "Reabrir atividade para revisão" : "Marcar atividade como concluída"}
      </button>
      <p className="text-sm text-muted-foreground mt-2">
        Concluir é uma decisão sua. As respostas continuam editáveis e você pode retomar qualquer
        etapa.
      </p>
    </section>
  );
}

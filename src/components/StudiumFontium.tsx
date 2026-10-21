import { IMAGES_STUDIUM, studiumCriterionKey, studiumNoteKey } from "@/data/studium";
import { useProgress } from "@/lib/progress";

export function StudiumFontium() {
  const { progress, setNote, toggle, storageError } = useProgress();
  const completed = progress.completed.includes(IMAGES_STUDIUM.id);

  return (
    <section id={IMAGES_STUDIUM.id} aria-labelledby="studium-title" className="mt-10">
      <div className="gold-rule mb-6" />
      <p className="rubric">Studium Fontium · oficina de leitura</p>
      <h2 id="studium-title" className="text-3xl mt-2">
        {IMAGES_STUDIUM.title}
      </h2>
      <p className="font-display text-xl text-secondary mt-3">{IMAGES_STUDIUM.question}</p>
      <p className="mt-3 text-sm text-muted-foreground">
        Percurso livre: Lectio → Quaestio → Argumentatio → Disputatio → Iudicium. Leia, formule suas
        razões e volte aos registros para revê-los. Nenhuma etapa bloqueia as seguintes.
      </p>
      <nav aria-label="Etapas do Studium Fontium" className="flex flex-wrap gap-2 mt-4">
        {IMAGES_STUDIUM.stages.map((stage) => (
          <a key={stage.id} href={`#${studiumNoteKey(stage.id)}`} className="btn btn-ghost">
            {stage.title.split(" · ")[0]}
          </a>
        ))}
      </nav>
      <aside className="folio p-5 mt-5" aria-labelledby="studium-source-title">
        <p className="rubric">Fonte e alcance</p>
        <h3 id="studium-source-title" className="text-2xl mt-2">
          {IMAGES_STUDIUM.source.author}
        </h3>
        <p className="mt-2 italic">{IMAGES_STUDIUM.source.work}</p>
        <p className="text-sm mt-2">
          {IMAGES_STUDIUM.source.referenceId} · {IMAGES_STUDIUM.source.edition}
        </p>
        <p className="text-sm mt-3">
          <strong>Disponibilidade:</strong> {IMAGES_STUDIUM.source.availability}
        </p>
        <p className="text-sm mt-2">
          <strong>Verificação:</strong> {IMAGES_STUDIUM.source.verification}
        </p>
        <p className="text-sm text-muted-foreground mt-2">{IMAGES_STUDIUM.source.rights}</p>
      </aside>
      <article className="folio p-5 sm:p-6 mt-5" aria-labelledby="studium-exposition-title">
        <p className="rubric">Exposição autoral · introdução histórica e conceitual</p>
        <h3 id="studium-exposition-title" className="text-2xl mt-2">
          Compreender a distinção antes do debate
        </h3>
        <div className="space-y-3 mt-4">
          {IMAGES_STUDIUM.exposition.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 mt-5">
          {IMAGES_STUDIUM.terms.map((entry) => (
            <div key={entry.term} className="rounded-md border p-3">
              <dt className="font-display text-xl text-primary">{entry.term}</dt>
              <dd className="text-sm mt-1">{entry.description}</dd>
            </div>
          ))}
        </dl>
      </article>
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
        {IMAGES_STUDIUM.stages.map((stage, index) => (
          <section
            key={stage.id}
            className="folio p-5 sm:p-6"
            aria-labelledby={`title-${stage.id}`}
          >
            <p className="rubric">
              Etapa {index + 1} de {IMAGES_STUDIUM.stages.length}
            </p>
            <h3 id={`title-${stage.id}`} className="text-2xl mt-2">
              {stage.title}
            </h3>
            <p className="text-secondary text-sm mt-2">{stage.purpose}</p>
            <p id={`prompt-${stage.id}`} className="mt-3">
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
            <label htmlFor={studiumNoteKey(stage.id)} className="block font-display text-xl mt-4">
              Seu registro · {stage.title.split(" · ")[0]}
            </label>
            <textarea
              id={studiumNoteKey(stage.id)}
              className="field mt-2 min-h-32"
              aria-describedby={`prompt-${stage.id}`}
              value={progress.notes[studiumNoteKey(stage.id)] ?? ""}
              onChange={(event) => setNote(studiumNoteKey(stage.id), event.target.value)}
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
          {IMAGES_STUDIUM.criteria.map((criterion) => (
            <label key={criterion.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={progress.notes[studiumCriterionKey(criterion.id)] === "yes"}
                onChange={(event) =>
                  setNote(studiumCriterionKey(criterion.id), event.target.checked ? "yes" : "no")
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
        onClick={() => toggle(IMAGES_STUDIUM.id)}
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

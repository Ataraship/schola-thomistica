import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/AppShell";
import { VoxReader } from "@/components/VoxReader";
import { DISPUTATIO_CRITERIA, DISPUTATIO_EXAMPLE, DISPUTATIO_FIELDS } from "@/data/disputatio";
import { useDisputatioDraft } from "@/lib/disputatio-draft";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/disputatio")({
  head: () =>
    meta(
      "Disputatio",
      "Questão disputada: tese, premissas, objeções, respostas e juízo revisto, com critérios transparentes de autoavaliação.",
    ),
  component: Disputatio,
});

export function Disputatio() {
  const { values, setField, storageError } = useDisputatioDraft();
  const exampleText = [
    DISPUTATIO_EXAMPLE.title,
    ...DISPUTATIO_EXAMPLE.parts.map((part) => part.text),
  ].join(". ");
  return (
    <div>
      <PageTitle kicker="Quaestio disputata" title="Disputatio">
        Formule a tese, enfrente a melhor objeção e justifique o próprio juízo. Todas as etapas são
        livres; a revisão pode limitar ou corrigir sua primeira resposta.
      </PageTitle>
      <a href="#sua-disputatio" className="btn btn-ghost mb-5">
        Ir para sua disputatio
      </a>
      <article className="folio p-5 sm:p-6">
        <p className="rubric">Exemplo comentado · limites de uma refutação</p>
        <h2 className="text-3xl mt-1">{DISPUTATIO_EXAMPLE.title}</h2>
        <dl className="mt-4 space-y-4">
          {DISPUTATIO_EXAMPLE.parts.map((part) => (
            <div key={part.title}>
              <dt className="font-display text-xl text-primary">{part.title}</dt>
              <dd className="mt-1">{part.text}</dd>
            </div>
          ))}
        </dl>
        <VoxReader text={exampleText} />
        <p className="text-sm text-muted-foreground mt-3">{DISPUTATIO_EXAMPLE.note}</p>
      </article>

      <section id="sua-disputatio" aria-labelledby="draft-title" className="mt-10 scroll-mt-20">
        <h2 id="draft-title" className="text-3xl mb-2">
          Sua disputatio
        </h2>
        <p className="text-muted-foreground mb-4">
          Escolha a questão do exemplo ou outra. Preserve sua tese inicial e compare-a com o juízo
          revisto. Seus textos e critérios ficam neste navegador quando o armazenamento está
          disponível, sem login. A autoavaliação não é uma nota ou uma correção automática.
        </p>
        {storageError && (
          <p role="alert" className="text-primary mb-4">
            {storageError}
          </p>
        )}
        <div className="space-y-5">
          {DISPUTATIO_FIELDS.map((field) => (
            <div key={field.id} className="folio p-5">
              <label htmlFor={field.id} className="font-display text-xl">
                {field.label}
              </label>
              <p id={`${field.id}-prompt`} className="text-sm italic text-secondary mt-1">
                Magister interrogat: {field.question}
              </p>
              <textarea
                id={field.id}
                aria-describedby={`${field.id}-prompt`}
                className="field mt-2 min-h-28"
                value={values[field.id] ?? ""}
                onChange={(event) => setField(field.id, event.target.value)}
              />
            </div>
          ))}
        </div>
        <fieldset className="folio p-5 mt-5">
          <legend className="font-display text-2xl px-2">Exame do próprio argumento</legend>
          <p className="text-sm mb-4">
            Assinale apenas o que consegue justificar no texto. Marcar todos os critérios não prova
            que sua conclusão seja verdadeira; volte a eles depois de uma nova objeção.
          </p>
          {DISPUTATIO_CRITERIA.map((criterion) => (
            <label key={criterion.id} className="flex items-start gap-3 mt-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={values[`criterion:${criterion.id}`] === "yes"}
                onChange={(event) =>
                  setField(`criterion:${criterion.id}`, event.target.checked ? "yes" : "no")
                }
              />
              <span>{criterion.text}</span>
            </label>
          ))}
        </fieldset>
      </section>
    </div>
  );
}

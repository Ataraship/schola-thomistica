import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle } from "@/components/AppShell";
import { StudiumFontium } from "@/components/StudiumFontium";
import { BIBLIOGRAPHY, type BibliographicReference } from "@/data/bibliography";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/biblioteca")({
  head: () =>
    meta(
      "Biblioteca",
      "Fontes catalogadas com cobertura, direitos e verificação explícitos; atividade original de Studium Fontium.",
    ),
  component: Biblioteca,
});

export function ReferenceCard({ source }: { source: BibliographicReference }) {
  return (
    <li id={source.id} className="folio p-5 scroll-mt-20">
      <p className="rubric">{source.autor}</p>
      <h2 className="text-2xl mt-1">{source.titulo}</h2>
      <p className="mt-3 text-sm rounded-md bg-muted inline-block px-2 py-1">
        {source.statusDisponibilidade === "referencia"
          ? "Catalogada · referência bibliográfica"
          : "Resumo demonstrativo · texto integral não integrado"}
      </p>
      <dl className="text-sm mt-4 space-y-3">
        <div>
          <dt className="font-semibold">Idioma e assunto</dt>
          <dd>
            {source.idioma} · {source.categoria.replaceAll("-", " ")}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Cobertura identificada</dt>
          <dd>{source.cobertura}</dd>
        </div>
        <div>
          <dt className="font-semibold">Uso pedagógico</dt>
          <dd>{source.modulos.join(" · ")}</dd>
        </div>
        <div>
          <dt className="font-semibold">Direitos e disponibilidade</dt>
          <dd>{source.direitos} O PDF não é disponibilizado nesta página.</dd>
        </div>
      </dl>
      {source.papelCurricular !== "fundamental" && (
        <p className="mt-3 text-sm text-secondary">
          {source.papelCurricular === "complementar"
            ? "Leitura complementar: não constitui doutrina católica oficial."
            : "Percurso opcional, sem requisito para o estudo filosófico."}
        </p>
      )}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-primary underline">
          Verificação parcial · {source.id}
        </summary>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          {source.notasDeVerificacao.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </details>
    </li>
  );
}

export function Biblioteca() {
  const [query, setQuery] = useState("");
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const sources = BIBLIOGRAPHY.filter((source) =>
    words.every((word) =>
      normalize(`${source.autor} ${source.titulo} ${source.id} ${source.categoria}`).includes(word),
    ),
  );
  return (
    <div>
      <PageTitle kicker="Bibliotheca" title="Biblioteca">
        Conhecer uma referência não significa ter seu texto integral no aplicativo. As dez novas
        obras estão catalogadas, com limites de cobertura e consulta explícitos.
      </PageTitle>
      <a href="#studium-imagens" className="btn btn-ghost mb-5">
        Ir à oficina Studium Fontium
      </a>
      <label htmlFor="reference-search" className="block text-sm">
        Buscar autor, obra ou código da referência
      </label>
      <input
        id="reference-search"
        type="search"
        className="field mt-1 mb-3"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p role="status" className="text-sm text-muted-foreground mb-4">
        {sources.length} referências encontradas. PDFs privados não são publicados.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {sources.map((source) => (
          <ReferenceCard key={source.id} source={source} />
        ))}
      </ul>
      {!sources.length && <p>Nenhuma referência encontrada. Tente outro título ou autor.</p>}
      <StudiumFontium />
    </div>
  );
}

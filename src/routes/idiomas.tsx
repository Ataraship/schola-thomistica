import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle } from "@/components/AppShell";
import { VoxReader } from "@/components/VoxReader";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/idiomas")({
  head: () => meta("Idiomas", "Cursos opcionais de latim, alemão e inglês, com primeira lição, guia de pronúncia e aplicações ao estudo filosófico."),
  component: Idiomas,
});

const COURSES = {
  la: { name: "Latim", lang: "la" as const, title: "Lição 1 — Primeira declinação",
    body: "Rosa, rosae: a rosa. A primeira declinação reúne sobretudo substantivos femininos terminados em -a. Nominativo rosa, genitivo rosae, acusativo rosam, ablativo rosa. Frase: Philosophia ancilla theologiae dicitur — a filosofia é dita serva da teologia.",
    pron: "Pronúncia eclesiástica (descrição escrita): 'ae' soa como 'é'; 'c' antes de e/i soa 'tch' (caelum: 'tchélum'); 'g' antes de e/i soa 'dj'; 'ti' antes de vogal soa 'tsi' (gratia: 'grátsia').",
    use: "Ler os títulos e artigos da Suma no original: Utrum Deus sit." },
  de: { name: "Alemão", lang: "de" as const, title: "Lektion 1 — Sein und Wesen",
    body: "Das Sein und das Wesen. Was ist das? Das ist ein Buch. Der Mensch denkt. Die Wahrheit ist nicht nur eine Meinung.",
    pron: "'ei' soa 'ai' (Sein: 'zain'); 'ie' soa 'i' longo; 'w' soa 'v'; 'ch' após a/o/u é gutural; substantivos sempre com maiúscula.",
    use: "Acesso à grande erudição tomista e histórica em língua alemã." },
  en: { name: "Inglês", lang: "en" as const, title: "Lesson 1 — Reading an argument",
    body: "Every man is mortal. Socrates is a man. Therefore, Socrates is mortal. The conclusion follows from the premises. An argument can be valid and still unsound.",
    pron: "'th' em 'therefore' é sonoro; 'valid' acentua a primeira sílaba; 'unsound' = não sólido (válido mas com premissa falsa).",
    use: "Ler comentários e traduções acadêmicas contemporâneas." },
};

function Idiomas() {
  const [k, setK] = useState<keyof typeof COURSES>("la");
  const c = COURSES[k];
  return (
    <div>
      <PageTitle kicker="Linguae" title="Idiomas">Percursos independentes e opcionais. Comece por qualquer um.</PageTitle>
      <div role="tablist" className="flex gap-2">
        {(Object.keys(COURSES) as (keyof typeof COURSES)[]).map((x) => (
          <button key={x} role="tab" aria-selected={x === k} className={`btn ${x === k ? "" : "btn-ghost"}`} onClick={() => setK(x)}>{COURSES[x].name}</button>
        ))}
      </div>
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

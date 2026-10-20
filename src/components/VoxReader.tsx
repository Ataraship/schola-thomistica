import { useEffect, useMemo, useRef, useState } from "react";
import { segmentText } from "@/lib/segment";

type Lang = "pt" | "en" | "de" | "la";
const DEVICE: Record<Exclude<Lang, "la">, string> = { pt: "pt-BR", en: "en-US", de: "de-DE" };
const LABEL: Record<Lang, string> = { pt: "Português", en: "Inglês", de: "Alemão", la: "Latim" };

export function VoxReader({ text, defaultLang = "pt", langs = ["pt", "en", "de"] }: { text: string; defaultLang?: Lang; langs?: Lang[] }) {
  const { segments, truncated } = useMemo(() => segmentText(text), [text]);
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [speed, setSpeed] = useState(1);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState("Pronto. O texto só é enviado quando você clicar em Gerar.");
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [aiDown, setAiDown] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  useEffect(() => () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }, []);

  const latin = lang === "la";

  async function generate() {
    setBusy(true); setStatus(`Gerando trecho ${idx + 1}/${segments.length} com Vox Scholastica…`);
    try {
      const res = await fetch("/api/tts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: segments[idx], language: lang, speed }) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({ message: "Erro desconhecido." }));
        if (res.status >= 500) setAiDown(true);
        setStatus(j.message); return;
      }
      const blob = await res.blob();
      const u = URL.createObjectURL(blob); setUrl(u);
      setStatus("Áudio IA gerado. No iPhone/Safari, toque em ▶ se não iniciar sozinho.");
      setTimeout(() => audio.current?.play().catch(() => {}), 50);
    } catch { setAiDown(true); setStatus("Não foi possível contactar o servidor."); }
    finally { setBusy(false); }
  }

  function deviceSpeak() {
    if (latin) return;
    const s = window.speechSynthesis;
    if (!s) { setStatus("Este navegador não oferece voz do aparelho."); return; }
    s.cancel();
    const u = new SpeechSynthesisUtterance(segments[idx]);
    u.lang = DEVICE[lang]; u.rate = speed;
    u.onend = () => setStatus("Trecho lido pela voz do aparelho.");
    s.speak(u); setStatus("Lendo com a voz do aparelho (não IA). A qualidade varia conforme o dispositivo.");
  }

  const go = (d: number) => { setIdx((i) => Math.min(segments.length - 1, Math.max(0, i + d))); setUrl(null); window.speechSynthesis?.cancel(); };

  return (
    <section aria-label="Vox Scholastica — leitor de aulas" className="folio p-4 my-6 border-gold">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="rubric">✠ Vox Scholastica</p>
        <span className="text-xs text-muted-foreground">IA VoiceStudio · aguardando configuração do servidor</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 items-end">
        <label className="text-sm">Idioma
          <select className="field mt-1" value={lang} onChange={(e) => { setLang(e.target.value as Lang); setUrl(null); }}>
            {langs.map((l) => <option key={l} value={l}>{LABEL[l]}{l === "la" ? " (experimental)" : ""}</option>)}
          </select>
        </label>
        <label className="text-sm">Velocidade
          <select className="field mt-1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={0.85}>0,85×</option><option value={1}>1×</option><option value={1.15}>1,15×</option>
          </select>
        </label>
        <label className="text-sm">Voz
          <select className="field mt-1" disabled><option>Leitor (padrão)</option></select>
        </label>
      </div>
      {latin && <p className="mt-3 text-sm text-primary">Latim: experimental — aguardando modelo de pronúncia eclesiástica validado. Não simulamos pronúncia; use o guia escrito.</p>}
      <blockquote className="mt-3 border-l-2 border-gold pl-3 italic text-sm">{segments[idx]}</blockquote>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn btn-ghost" onClick={() => go(-1)} disabled={idx === 0} aria-label="Trecho anterior">‹ Anterior</button>
        <button className="btn" onClick={generate} disabled={busy || latin}>{busy ? "Gerando…" : "Gerar com IA"}</button>
        <button className="btn btn-green" onClick={deviceSpeak} disabled={latin}>Voz do aparelho (não IA)</button>
        <button className="btn btn-ghost" onClick={() => go(1)} disabled={idx >= segments.length - 1} aria-label="Próximo trecho">Próximo ›</button>
      </div>
      {url && <audio ref={audio} src={url} controls className="mt-3 w-full" onEnded={() => setStatus("Trecho concluído. Avance para o próximo.")} />}
      <p role="status" aria-live="polite" className="mt-2 text-sm text-muted-foreground">
        Trecho {idx + 1}/{segments.length}. {status}
        {aiDown && !latin && " Use a voz do aparelho enquanto isso."}
        {truncated && " (Texto limitado a 3500 caracteres.)"}
      </p>
    </section>
  );
}

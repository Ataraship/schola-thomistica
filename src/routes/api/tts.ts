import { createFileRoute } from "@tanstack/react-router";

// Proxy browser -> this server -> VoiceStudio (OpenAI-compatible /v1/audio/speech).
// Credentials live only in server secrets VOICESTUDIO_BASE_URL / VOICESTUDIO_API_KEY.
const LANGS = new Set(["pt", "en", "de"]);
const SPEEDS = new Set([0.85, 1, 1.15]);
const hits = new Map<string, number[]>(); // best-effort per-instance rate limit
const LIMIT = 20, WINDOW = 60_000;

const err = (status: number, code: string, message: string) =>
  new Response(JSON.stringify({ code, message }), { status, headers: { "content-type": "application/json" } });

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (origin && new URL(origin).host !== new URL(request.url).host) return err(403, "forbidden", "Origem não permitida.");

        const ip = request.headers.get("cf-connecting-ip") ?? "anon";
        const now = Date.now();
        const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
        if (recent.length >= LIMIT) return err(429, "rate_limited", "Muitas solicitações. Aguarde um minuto.");
        recent.push(now); hits.set(ip, recent);

        let body: { text?: unknown; language?: unknown; speed?: unknown };
        try { body = await request.json(); } catch { return err(400, "bad_request", "Corpo inválido."); }
        const text = typeof body.text === "string" ? body.text.trim() : "";
        const language = String(body.language);
        const speed = Number(body.speed ?? 1);
        if (!text || text.length > 420) return err(400, "bad_text", "Trecho vazio ou acima de 420 caracteres.");
        if (!LANGS.has(language)) return err(400, "bad_language", "Idioma não suportado pela IA (pt, en, de).");
        if (!SPEEDS.has(speed)) return err(400, "bad_speed", "Velocidade inválida.");

        const base = process.env["VOICESTUDIO_BASE_URL"];
        const key = process.env["VOICESTUDIO_API_KEY"];
        if (!base) return err(503, "not_configured", "Aguardando configuração do servidor VoiceStudio.");

        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 45_000);
        try {
          const res = await fetch(`${base.replace(/\/$/, "")}/v1/audio/speech`, {
            method: "POST",
            signal: ctrl.signal,
            headers: { "content-type": "application/json", ...(key ? { authorization: `Bearer ${key}` } : {}) },
            body: JSON.stringify({ model: "tts-1", input: text, voice: "default", language, speed, response_format: "mp3" }),
          });
          if (!res.ok) {
            console.error("VoiceStudio status", res.status);
            return err(502, "upstream_error", `O servidor de voz respondeu com erro (${res.status}).`);
          }
          return new Response(res.body, { headers: { "content-type": "audio/mpeg", "cache-control": "no-store" } });
        } catch (e) {
          console.error("VoiceStudio fetch failed", e);
          return err(504, "upstream_unreachable", "Servidor de voz inacessível ou lento demais.");
        } finally { clearTimeout(timer); }
      },
    },
  },
});

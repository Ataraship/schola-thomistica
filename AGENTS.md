<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Study progress and student answers live in localStorage only; no login required to study.
- AI voice goes browser -> `src/routes/api/tts.ts` -> VoiceStudio; credentials only in server secrets VOICESTUDIO_BASE_URL / VOICESTUDIO_API_KEY, never VITE_ vars.
- Text segmentation rules (420/segment, 3500 total) live in `src/lib/segment.ts` and are shared by client; server re-validates.
- Latin is never sent to AI TTS until a validated ecclesiastical pronunciation model exists.

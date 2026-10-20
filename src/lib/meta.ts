export const meta = (title: string, description: string) => ({
  meta: [
    { title: `${title} · Schola Thomistica` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Schola Thomistica` },
    { property: "og:description", content: description },
  ],
});

import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Início", sub: "Atrium" },
  { to: "/formacao", label: "Formação Fundamental", sub: "Trivium et fundamenta" },
  { to: "/biblioteca", label: "Biblioteca", sub: "Bibliotheca" },
  { to: "/disputatio", label: "Disputatio", sub: "Quaestio disputata" },
  { to: "/suma", label: "Suma Teológica", sub: "Summa Theologiae" },
  { to: "/idiomas", label: "Idiomas", sub: "Linguae" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav aria-label="Principal" className="flex flex-col gap-1">
      {NAV.map((n) => (
        <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.to === "/" }}
          className="rounded-md px-3 py-2 hover:bg-sidebar-accent data-[status=active]:bg-sidebar-accent data-[status=active]:border-l-2 data-[status=active]:border-gold">
          <span className="block font-display text-lg leading-tight">{n.label}</span>
          <span className="block text-xs italic opacity-75">{n.sub}</span>
        </Link>
      ))}
    </nav>
  );
  const brand = (
    <Link to="/" className="block">
      <span className="font-display text-2xl text-gold">✠ Schola Thomistica</span>
    </Link>
  );
  return (
    <div className="min-h-screen lg:flex">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-card">Ir para o conteúdo</a>
      <aside className="hidden lg:flex lg:w-72 shrink-0 flex-col gap-6 bg-sidebar text-sidebar-foreground p-5 sticky top-0 h-screen border-r-4 border-gold">
        {brand}
        <div className="gold-rule" />
        {nav}
        <p className="mt-auto text-xs italic opacity-70">Progresso salvo apenas neste aparelho.</p>
      </aside>
      <header className="lg:hidden sticky top-0 z-30 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 py-3 border-b-2 border-gold">
        {brand}
        <button aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(!open)} className="rounded-md border border-sidebar-border px-3 py-1 font-display">
          {open ? "Fechar" : "Menu"}
        </button>
      </header>
      {open && <div id="menu-mobile" className="lg:hidden fixed inset-x-0 top-[58px] z-20 bg-sidebar text-sidebar-foreground p-4 border-b-2 border-gold">{nav}</div>}
      <main id="conteudo" className="flex-1 px-4 py-8 sm:px-8 max-w-5xl mx-auto w-full">{children}</main>
    </div>
  );
}

export function PageTitle({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <p className="rubric">{kicker}</p>
      <h1 className="text-4xl sm:text-5xl text-foreground mt-1">{title}</h1>
      {children && <p className="mt-3 text-muted-foreground max-w-2xl">{children}</p>}
      <div className="gold-rule mt-5" />
    </header>
  );
}

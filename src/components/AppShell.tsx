import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { useDirectionalNavigation } from "@/lib/directional-navigation";

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
  const [tv, setTV] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const tvButton = useRef<HTMLButtonElement | null>(null);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const measure = () => {
      shell.current?.style.setProperty(
        "--schola-header-height",
        `${header.current?.getBoundingClientRect().height ?? 0}px`,
      );
      if (window.matchMedia?.("(min-width: 64rem)").matches) {
        if (menu.current?.contains(document.activeElement))
          main.current?.focus({ preventScroll: true });
        setOpen(false);
      }
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    if (header.current) observer?.observe(header.current);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    if (tv) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        closeMenu();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open, tv, closeMenu]);

  const leaveReading = useCallback(() => {
    if (open) {
      closeMenu();
      return;
    }
    setTV(false);
    if (tvButton.current?.getClientRects().length) tvButton.current.focus({ preventScroll: true });
    else menuButton.current?.focus({ preventScroll: true });
  }, [open, closeMenu]);
  useDirectionalNavigation(tv, shell, leaveReading);

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey
    )
      return;
    setOpen(false);
    main.current?.focus({ preventScroll: true });
  };
  const readingToggle = (
    <button
      type="button"
      className="reading-toggle"
      aria-pressed={tv}
      aria-describedby={tv ? "tv-help" : undefined}
      onClick={(event) => {
        tvButton.current = event.currentTarget;
        setTV((value) => !value);
        if (open) closeMenu();
      }}
    >
      {tv ? "Sair da leitura para TV" : "Leitura para TV"}
    </button>
  );
  const nav = (
    <nav aria-label="Principal" className="app-nav flex flex-col gap-1">
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={navigate}
          activeOptions={{ exact: n.to === "/" }}
          className="rounded-md px-3 py-2 hover:bg-sidebar-accent data-[status=active]:bg-sidebar-accent data-[status=active]:border-l-2 data-[status=active]:border-gold"
        >
          <span className="nav-title block font-display text-lg leading-tight">{n.label}</span>
          <span className="block text-xs italic opacity-75">{n.sub}</span>
        </Link>
      ))}
    </nav>
  );
  const brand = (
    <Link to="/" onClick={navigate} className="app-brand block">
      <span className="font-display text-2xl text-gold">✠ Schola Thomistica</span>
    </Link>
  );
  return (
    <div ref={shell} className={`app-shell min-h-screen lg:flex${tv ? " tv-reading" : ""}`}>
      <a href="#conteudo" className="skip-link" data-directional-skip>
        Ir para o conteúdo
      </a>
      <aside className="app-sidebar hidden lg:flex lg:w-72 shrink-0 flex-col gap-6 bg-sidebar text-sidebar-foreground p-5 sticky top-0 border-r-4 border-gold">
        {brand}
        <div className="gold-rule" />
        {nav}
        <div className="mt-auto space-y-3">
          {readingToggle}
          <p className="text-xs italic opacity-70">Progresso salvo apenas neste aparelho.</p>
        </div>
      </aside>
      <header
        ref={header}
        onBlurCapture={(event) => {
          if (
            open &&
            event.relatedTarget instanceof Node &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            setOpen(false);
        }}
        className="app-header lg:hidden sticky top-0 z-30 bg-sidebar text-sidebar-foreground flex items-center justify-between gap-3 border-b-2 border-gold"
      >
        {brand}
        <button
          ref={menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
          className="menu-toggle rounded-md border border-sidebar-border px-3 py-1 font-display"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d={open ? "M6 6l12 12M18 6L6 18" : "M3 6h18M3 12h18M3 18h18"} />
          </svg>
          <span className="sr-only">{open ? "Fechar" : "Menu"}</span>
        </button>
        {open && (
          <div
            ref={menu}
            id="menu-mobile"
            className="mobile-menu bg-sidebar text-sidebar-foreground border-b-2 border-gold"
          >
            {nav}
            <div className="mt-4">{readingToggle}</div>
          </div>
        )}
      </header>
      <main
        ref={main}
        id="conteudo"
        tabIndex={-1}
        className="app-main flex-1 min-w-0 px-4 py-8 sm:px-8 max-w-5xl mx-auto w-full"
      >
        {tv && (
          <p id="tv-help" role="status" className="reading-help folio p-4 mb-6">
            Leitura em tela grande: use setas entre links e botões e Enter para ativar. Retorno ou
            Esc fecha o menu ou encerra este modo. Campos e quadros mantêm suas teclas próprias;
            para escrever, prefira teclado ou ponteiro.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}

export function PageTitle({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8">
      <p className="rubric">{kicker}</p>
      <h1 className="text-4xl sm:text-5xl text-foreground mt-1">{title}</h1>
      {children && <p className="mt-3 text-muted-foreground max-w-2xl">{children}</p>}
      <div className="gold-rule mt-5" />
    </header>
  );
}

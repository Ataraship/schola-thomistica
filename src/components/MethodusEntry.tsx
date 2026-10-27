import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Activity } from "@/lib/activities";

const Methodus = lazy(() =>
  import("@/components/MethodusDiscendi").then((module) => ({ default: module.MethodusDiscendi })),
);

/** Load the workshop only on request; keep the existing lessons' initial bundle small. */
export function MethodusEntry({ course }: { course: Activity["course"] }) {
  const details = useRef<HTMLDetailsElement>(null);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    // Honor a native disclosure opened before the client bootstrap installed handlers.
    setOpened(!!details.current?.open);
  }, []);
  return (
    <details
      ref={details}
      id="methodus"
      className="mt-8 scroll-mt-24 border rounded-md p-4 sm:p-5"
      onToggle={(event) => setOpened(event.currentTarget.open)}
    >
      <summary className="font-display text-2xl cursor-pointer">
        Methodus Discendi · praticar, revisar e retomar
      </summary>
      {opened && (
        <Suspense
          fallback={
            <p role="status" className="mt-3">
              Preparando atividades…
            </p>
          }
        >
          <Methodus course={course} />
        </Suspense>
      )}
    </details>
  );
}

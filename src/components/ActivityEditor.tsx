import { activityFields, type Activity, type Answers } from "@/lib/activities";

/** Native controls retain touch, keyboard and TV-mode editing behavior. */
export function ActivityEditor({
  activity,
  answers,
  onChange,
}: {
  activity: Activity;
  answers: Answers;
  onChange: (field: string, value: string) => void;
}) {
  if (activity.kind === "multiple-choice" || activity.kind === "error-identification")
    return (
      <fieldset className="space-y-3">
        <legend className="font-display text-xl mb-3">Sua escolha</legend>
        {activity.options.map((option) => (
          <label key={option.id} className="field flex items-start gap-3">
            <input
              type="radio"
              name={`${activity.id}-choice`}
              value={option.id}
              checked={answers["choice"] === option.id}
              onChange={() => onChange("choice", option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
    );
  return (
    <div className="space-y-4">
      {activityFields(activity).map((field) => {
        const id = `${activity.id}-${field.id}`;
        const options =
          activity.kind === "matching"
            ? activity.targets
            : activity.kind === "ordering"
              ? activity.items
              : null;
        return (
          <div key={field.id}>
            <label className="block font-display text-xl" htmlFor={id}>
              {field.label}
            </label>
            {field.hint && (
              <p id={`${id}-hint`} className="text-sm mt-1">
                {field.hint}
              </p>
            )}
            {options ? (
              <select
                id={id}
                className="field mt-2"
                value={answers[field.id] ?? ""}
                onChange={(event) => onChange(field.id, event.target.value)}
              >
                <option value="">Selecione…</option>
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : activity.kind === "gap-fill" || activity.kind === "grammar" ? (
              <input
                id={id}
                className="field mt-2"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-describedby={field.hint ? `${id}-hint` : undefined}
                value={answers[field.id] ?? ""}
                onChange={(event) => onChange(field.id, event.target.value)}
              />
            ) : (
              <textarea
                id={id}
                className="field mt-2 min-h-28"
                aria-describedby={field.hint ? `${id}-hint` : undefined}
                value={answers[field.id] ?? ""}
                onChange={(event) => onChange(field.id, event.target.value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

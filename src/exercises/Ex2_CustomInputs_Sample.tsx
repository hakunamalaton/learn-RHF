/**
 * SAMPLE SOLUTION — Exercise 2: useController
 *
 * Your submission wired field.value + field.onChange correctly. These
 * improvements cover the parts the spec asked for and the deeper lesson of
 * why useController exists.
 *
 * 1. GENERIC COMPONENTS — a reusable custom input should NOT hardcode your
 *    specific form type. Make it generic over <T extends FieldValues> and type
 *    `name` as FieldPath<T>. Now the component drops into ANY form, and `name`
 *    is checked against that form's real fields. Let useController INFER its
 *    type from `control` — don't pass useController<FormData>().
 *
 * 2. fieldState.error — the main reason to reach for useController over a
 *    hand-rolled controlled input: it hands you the field's error alongside
 *    its value. Display it. Validation is useless if it's invisible.
 *
 * 3. RULES AT THE CALL SITE — you plumbed the `rules` prop through but never
 *    passed it. Pass it where you use the component so `required` actually runs.
 *    NOTE: for the star, `required` won't catch 0 (RHF treats 0 as "present").
 *    Use min: 1 or a validate fn.
 *
 * 4. field.onBlur — call it when interaction ends so onBlur/onTouched modes
 *    work. Native inputs get this free via register; with useController you
 *    wire it yourself. (ref is also forwarded so RHF can focus the field on
 *    error — handy for accessibility.)
 *
 * 5. BUTTONS, NOT CHECKBOXES — a single-select group is semantically a
 *    radio/button group. Buttons avoid the "looks multi-select" confusion.
 *    Clicking the active option again deselects it (value -> undefined).
 */

import { useController, useForm } from "react-hook-form";
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

// [1] Generic props shared by both custom inputs.
type ControlledProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  // rules typing for a generic field:
  rules?: Omit<
    RegisterOptions<T, FieldPath<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
};

// [1] Generic over T — usable in any form, `name` checked against that form.
function StarRating<T extends FieldValues>({
  name,
  control,
  rules,
}: ControlledProps<T>) {
  // [1] no <FormData> here — inferred from `control`
  const {
    field,
    fieldState, // [2]
  } = useController({ name, control, rules });

  const value = Number(field.value) || 0;

  return (
    <div>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
          <span
            key={star}
            role="button"
            style={{ cursor: "pointer", fontSize: 24 }}
            onClick={() => field.onChange(star)}
            // [4] mark touched when the user leaves the control
            onBlur={field.onBlur}
            tabIndex={0}
          >
            {star <= value ? "★" : "☆"}
          </span>
        ))}
      </div>
      {/* [2] error display */}
      {fieldState.error && (
        <span style={{ color: "red", fontSize: 12 }}>
          {fieldState.error.message}
        </span>
      )}
    </div>
  );
}

// [5] Button group instead of checkboxes for single-select.
function ToggleGroup<T extends FieldValues>({
  name,
  control,
  options,
  rules,
}: ControlledProps<T> & { options: string[] }) {
  const { field, fieldState } = useController({ name, control, rules });

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((option) => {
          const active = field.value === option;
          return (
            <button
              key={option}
              type="button" // [5] not "submit" — these are toggles, not submit
              onClick={() =>
                // [5] click active again -> deselect (undefined)
                field.onChange(active ? undefined : option)
              }
              onBlur={field.onBlur} // [4]
              style={{
                fontWeight: active ? "bold" : "normal",
                border: active ? "2px solid #3b82f6" : "1px solid #ccc",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
      {/* [2] */}
      {fieldState.error && (
        <span style={{ color: "red", fontSize: 12 }}>
          {fieldState.error.message}
        </span>
      )}
    </div>
  );
}

interface FormData {
  starRating: number;
  toggleGroup: string;
}

export default function Ex2CustomInputsSample() {
  const { control, handleSubmit } = useForm<FormData>({
    mode: "onTouched", // [4] errors show after the field is touched (needs onBlur)
    defaultValues: {
      starRating: 0,
      toggleGroup: "",
    },
  });

  function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StarRating<FormData>
        control={control}
        name="starRating"
        // [3] required won't catch 0 — use min/validate instead
        rules={{ min: { value: 1, message: "Please pick a rating" } }}
      />
      <ToggleGroup<FormData>
        control={control}
        name="toggleGroup"
        options={["Option 1", "Option 2", "Option 3"]}
        // [3] required works here because "" is empty
        rules={{ required: "Please choose an option" }}
      />

      <input type="submit" />
    </form>
  );
}

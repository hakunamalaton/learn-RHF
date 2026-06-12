/**
 * SAMPLE SOLUTION — Exercise 5: useFormState
 *
 * You used useFormState correctly in the status bar. These improvements fix the
 * isolation goal (the whole point) and a few rendering bugs.
 *
 * 1. ISOLATION — the parent must subscribe to NOTHING so it never re-renders on
 *    input. Your version read formState in the parent to drive the disabled
 *    submit button, which re-subscribed the parent. Fix: move the button into
 *    its own <SubmitButton> that subscribes via useFormState. Now both the
 *    status bar AND the button re-render independently, and the form stays
 *    silent. Check the console: typing logs "statusbar rendered" only.
 *
 * 2. BUG — {errorKeys.length && <div/>} renders a literal 0 when empty, because
 *    React skips false/null/undefined but NOT the number 0. Use `> 0`.
 *
 * 3. BUG — rendering Object.entries(dirtyFields) directly dumps "[key,true]"
 *    pairs mashed together. Map to keys and join. Same for the error list:
 *    give each item a key and a separator.
 *
 * 4. mode: 'onChange' — isValid is only recomputed per `mode`. With 'onBlur'
 *    the validity (and the disabled button) lags until each field is blurred.
 *    For a LIVE status bar, 'onChange' reflects validity as you type.
 *    (Tradeoff: 'onChange' validates more often = more work. Fine for a form
 *    this size.)
 *
 * 5. Control<FormValues> instead of a generic — these components are only used
 *    with this one form, so the generic added noise. Keep generics for truly
 *    reusable components (see Ex2).
 *
 * RE-RENDER SUMMARY (console):
 *   - type / blur a field  -> "statusbar rendered" + "submitbutton rendered"
 *   - parent form          -> logs ONCE on mount, then stays silent
 */

import { useForm, useFormState } from "react-hook-form";
import type { Control } from "react-hook-form";

interface FormValues {
  displayName: string;
  email: string;
  emailFrequency: "daily" | "weekly" | "never";
  marketingEmails: boolean;
}

// [1][5] Subscribes via useFormState — re-renders here, not in the parent.
function FormStatusBar({ control }: { control: Control<FormValues> }) {
  const { isDirty, isValid, isSubmitting, submitCount, errors, dirtyFields } =
    useFormState({ control });
  console.log("statusbar rendered");

  const errorEntries = Object.entries(errors);
  const dirtyNames = Object.keys(dirtyFields);

  return (
    <div>
      <div>Dirty: {String(isDirty)}</div>
      <div>Valid: {String(isValid)}</div>
      <div>Submitting: {String(isSubmitting)}</div>
      <div>Submit count: {submitCount}</div>

      {/* [2] explicit > 0 so we never render a bare 0 */}
      {errorEntries.length > 0 && (
        <div>
          Errors:
          <ul>
            {/* [3] keyed + separated */}
            {errorEntries.map(([name, error]) => (
              <li key={name}>{error?.message as string}</li>
            ))}
          </ul>
        </div>
      )}

      {/* [3] keys joined, not raw entries */}
      <div>Dirty fields: {dirtyNames.join(", ") || "(none)"}</div>
    </div>
  );
}

// [1] The submit button subscribes too — so the parent doesn't have to.
function SubmitButton({ control }: { control: Control<FormValues> }) {
  const { isDirty, isValid, isSubmitting } = useFormState({ control });
  console.log("submitbutton rendered");

  return (
    <button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
      {isSubmitting ? "Saving…" : "Save"}
    </button>
  );
}

export default function Ex5FormStatusSample() {
  // [1] parent destructures NO formState — it stays silent on input
  const { register, control, handleSubmit } = useForm<FormValues>({
    mode: "onChange", // [4] live validity for the status bar
    defaultValues: {
      displayName: "",
      email: "",
      emailFrequency: "daily",
      marketingEmails: false,
    },
  });

  console.log("form rendered"); // logs ONCE on mount, then silent

  async function onSubmit(data: FormValues) {
    await new Promise((r) => setTimeout(r, 1500));
    console.log(data);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("displayName", {
            required: "Display name is required",
            minLength: { value: 2, message: "At least 2 characters" },
          })}
          placeholder="Display Name"
        />
        <input
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          })}
          placeholder="Email"
        />
        <select {...register("emailFrequency", { required: true })}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="never">Never</option>
        </select>
        <label>
          <input type="checkbox" {...register("marketingEmails")} />
          Marketing emails
        </label>

        {/* [1] button is its own subscribing component */}
        <SubmitButton control={control} />
      </form>

      <FormStatusBar control={control} />
    </>
  );
}

# Exercise 5 — `useFormState`: Smart Form Status Bar

## Goal

Understand `useFormState` as a way to subscribe to **form meta-state** (dirty, valid, submitting, errors) without causing the form component itself to re-render.

The same isolation principle as Exercise 4: pull the state subscription into a dedicated component so the heavy form tree stays quiet.

---

## What to build

A **Settings Form** at `src/exercises/Ex5_FormStatus.tsx` with a live status sidebar.

### Form fields (choose any topic — e.g. notification settings)

At least 4 fields, mix of types. Example:

| Field | Type | Rules |
|---|---|---|
| `displayName` | text | required, min 2 chars |
| `email` | text | required, valid email |
| `emailFrequency` | select (daily/weekly/never) | required |
| `marketingEmails` | checkbox | — |

Set `defaultValues` for all fields so "dirty" tracking works correctly.

### `<FormStatusBar control={control} />` component

This component uses **only** `useFormState({ control })` — no other hooks, no props beyond `control`.

It must display:

| Item | Source |
|---|---|
| Dirty indicator | `isDirty` |
| Valid indicator | `isValid` |
| Submitting spinner / "Saving…" label | `isSubmitting` |
| Submit count | `submitCount` |
| List of current error messages | `errors` (iterate the object) |
| List of dirty field names | `dirtyFields` (iterate the object) |

### Behaviour requirements

1. **Async submit**: simulate a 1.5 s delay with `await new Promise(r => setTimeout(r, 1500))`. During that time `isSubmitting` should be `true`.
2. **Submit button state**: the button should be disabled when `!isDirty || !isValid || isSubmitting`. Put this logic in the parent — the status bar is read-only.
3. **Re-render proof**: add `console.log('form rendered')` in the parent and `console.log('statusbar rendered')` in `<FormStatusBar />`. Typing in the form should only trigger `statusbar rendered`, not `form rendered` (RHF's uncontrolled inputs mean the parent doesn't re-render on input changes; the status bar re-renders because it subscribed via `useFormState`).

---

## Hints

- `useFormState({ control })` — subscribes the calling component to form state changes; returns the same shape as `formState` from `useForm`
- `isDirty`, `isValid`, `isSubmitting`, `submitCount`, `errors`, `dirtyFields` are all top-level keys
- `errors` is `FieldErrors<T>` — an object keyed by field name; each value has a `.message` string
- `dirtyFields` is a partial object keyed by field name; a field is dirty when its value differs from `defaultValues`

**Key question:** What happens to `isDirty` if you change a field and then change it back to its original value?

---

## Suggested file

```
src/exercises/Ex5_FormStatus.tsx
```

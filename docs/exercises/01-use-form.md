# Exercise 1 — `useForm`: Registration Form

## Goal

Get comfortable with the core `useForm` API: registering fields, handling submission, reading errors, watching values, and resetting.

`useForm` is the entry point of every react-hook-form form. It returns helpers (`register`, `handleSubmit`, `watch`, `reset`, `formState`, …) that you compose together.

---

## What to build

A **user registration form** at `src/exercises/Ex1_Registration.tsx`.

### Fields & validation rules

| Field | Input type | Rules |
|---|---|---|
| `username` | text | required · min 3 chars · max 20 chars |
| `email` | text | required · must be a valid email address |
| `password` | text | required · min 8 chars · must contain at least one uppercase letter and one number |
| `confirmPassword` | text | required · must equal the current value of `password` |
| `age` | number | required · must be an integer · min 18 · max 120 |
| `agreeToTerms` | checkbox | must be checked (`true`) |

### Behaviour requirements

1. Show an inline error message under each field as soon as it fails validation (use `mode: 'onChange'` or `'onBlur'` — your choice, but be able to explain the difference).
2. The submit button must be **disabled** while the form is submitting.
3. On submit, simulate an async API call (`await new Promise(r => setTimeout(r, 1000))`), log the form data to the console, then call `reset()` to clear the form.
4. After a successful submit, display a visible success message until the user edits the form again.
5. Display a **live character counter** for `username` (e.g. "12 / 20") using `watch`.

---

## Hints (no spoilers — just the API surface)

- `useForm<T>({ mode, defaultValues })` — read about `mode` options
- `register(name, rules)` — spread the return value onto your `<input>`
- `handleSubmit(onValid, onInvalid?)` — wraps your submit handler
- `formState.errors` — per-field `FieldError` objects with `.message`
- `formState.isSubmitting` — boolean, true while your async handler runs
- `watch(fieldName)` — returns the current value of a field
- `reset()` — resets all fields to their default values

---

## Suggested file

```
src/exercises/Ex1_Registration.tsx
```

Export the component as default. You can import and render it in `App.tsx` to test it.

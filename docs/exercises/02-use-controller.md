# Exercise 2 — `useController`: Custom Controlled Components

## Goal

Understand when and why to use `useController` instead of `register`.

`register` works by attaching a ref to a native HTML input. When you build a **custom component** that manages its own internal state (a star rater, a colour picker, a rich-text editor, a UI-library input), you can't use a ref the same way. `useController` gives you `field.value`, `field.onChange`, `field.onBlur`, and `fieldState.error` so your custom component stays in sync with RHF without touching the DOM directly.

---

## What to build

A **User Preferences** form at `src/exercises/Ex2_CustomInputs.tsx` containing two reusable custom inputs.

### Custom component 1 — `<StarRating />`

Props: `{ name: string; control: Control; rules?: RegisterOptions }`

Renders 5 clickable stars (★ / ☆). The RHF field value is a number 1–5.

- Clicking star N sets the value to N
- Hovering should preview the selection (optional but nice)
- Show the field error below the stars when validation fails

### Custom component 2 — `<ToggleGroup />`

Props: `{ name: string; control: Control; options: string[]; rules?: RegisterOptions }`

Renders one button per option. Clicking a button selects it (active style); clicking an already-active button deselects it (value becomes `undefined`).

- The RHF field value is the selected string, or `undefined`
- Show the field error below the buttons when validation fails

### The parent form

| Field | Component | Rules |
|---|---|---|
| `rating` | `<StarRating />` | required |
| `theme` | `<ToggleGroup options={["light","dark","system"]} />` | required |

On submit, log the values to the console.

---

## Hints

- `useController({ name, control, rules, defaultValue })` — returns `{ field, fieldState, formState }`
- `field.value` — the current RHF value for this field
- `field.onChange(newValue)` — call this when the user makes a selection
- `field.onBlur()` — call this when the component loses focus (important for `onBlur` validation mode)
- `fieldState.error` — the `FieldError` for this field (`.message`)
- `Control` type is exported from `react-hook-form`

**Key question to answer while doing this exercise:** why would using `register` here be awkward or impossible?

---

## Suggested file

```
src/exercises/Ex2_CustomInputs.tsx
```

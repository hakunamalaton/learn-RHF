# Exercise 4 — `useWatch`: Live Preview with Isolated Re-renders

## Goal

Understand `useWatch` as a **subscription** hook: it lets a component read form field values and re-render when they change — without causing the parent form component to re-render.

The key difference from `watch()` (the method returned by `useForm`):
- `watch()` is called inside the form component → the form component re-renders on every change
- `useWatch({ control })` is called inside a child component → only that child re-renders

---

## What to build

A **Profile Card Builder** at `src/exercises/Ex4_LivePreview.tsx`.

### Form fields

| Field | Input type |
|---|---|
| `displayName` | text |
| `bio` | textarea |
| `avatarUrl` | text (URL) |
| `accentColor` | `<input type="color">` |
| `isPublic` | checkbox |

### `<ProfileCardPreview />` component

A separate component (same file is fine) that:

- Accepts only `control: Control` as a prop — **no form values passed directly**
- Uses `useWatch({ control })` internally to read the current field values
- Renders a styled "card" that reflects the current values in real time:
  - Display name as a heading
  - Bio as a paragraph
  - Avatar image (if URL is provided and valid)
  - Accent colour applied as a border or background tint
  - A "Public" / "Private" badge

### Re-render proof

Add a `console.log('form rendered')` inside the parent form component and a `console.log('preview rendered')` inside `<ProfileCardPreview />`.

**Expected behaviour:** typing in the form should log `preview rendered` but NOT `form rendered` (except on mount). This demonstrates the isolation.

### Granular watching

In `<ProfileCardPreview />`, demonstrate watching **a subset** of fields:

```ts
// watches only these two fields
const [displayName, bio] = useWatch({ control, name: ['displayName', 'bio'] })
```

Then have a second internal component `<ColorAccent />` that watches only `accentColor` — so colour changes only re-render `<ColorAccent />`, not the entire preview.

---

## Hints

- `useWatch({ control })` — subscribes to all fields; returns an object matching your form values type
- `useWatch({ control, name: 'fieldName' })` — subscribes to a single field; returns that field's value
- `useWatch({ control, name: ['a', 'b'] })` — subscribes to multiple fields; returns a tuple
- `useWatch` can also be called with `{ control, name, defaultValue }` to provide an initial value before the form mounts

**Key question:** Open React DevTools Profiler, record a session, type a few characters. Which components highlight on each keystroke?

---

## Suggested file

```
src/exercises/Ex4_LivePreview.tsx
```

# Exercise 3 — `useFormContext`: Multi-section Form Without Prop Drilling

## Goal

Understand how `FormProvider` + `useFormContext` lets you split a large form into sub-components that each access the form directly — without passing `register`, `control`, or `errors` as props.

This is the RHF equivalent of React's Context API. The parent owns the form; children subscribe to it.

---

## What to build

A **Job Application** form at `src/exercises/Ex3_FormContext.tsx`, split into three child components.

### Child components (implement each in the same file or as separate files)

#### `<PersonalSection />`
Fields: `firstName` (required), `lastName` (required), `email` (required, valid email)

#### `<ExperienceSection />`
Fields: `yearsOfExperience` (number, required, min 0, max 50), `currentRole` (text, required)

#### `<AvailabilitySection />`
Fields: `startDate` (date input, required), `remoteOnly` (checkbox, no validation needed)

### The parent — `Ex3_FormContext`

- Creates the form with `useForm`
- Wraps children in `<FormProvider ...methods>`
- Owns the `handleSubmit` and logs data on submit
- Shows a **live JSON preview** of all values at the bottom of the page

### Hard constraint

**No RHF prop is passed to any child component.** Each child must call `useFormContext()` to get what it needs.

---

## Hints

- `FormProvider` is a component exported from `react-hook-form`; spread your `useForm()` return value into it: `<FormProvider {...methods}>`
- `useFormContext<T>()` inside a child returns the same object as `useForm()` — same `register`, `formState`, `control`, etc.
- `watch()` (called with no arguments) returns a snapshot of all current values — useful for the JSON preview
- TypeScript tip: define a single `FormValues` type and pass it as the generic to both `useForm<FormValues>()` and `useFormContext<FormValues>()`

**Key question:** What re-rendering behaviour do you observe compared to Exercise 1? Which components re-render when you type in `PersonalSection`?

---

## Suggested file

```
src/exercises/Ex3_FormContext.tsx
```

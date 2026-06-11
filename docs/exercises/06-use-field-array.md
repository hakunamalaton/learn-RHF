# Exercise 6 — `useFieldArray`: Dynamic Invoice Builder

## Goal

Understand `useFieldArray` for forms with a variable-length list of items: adding, removing, reordering rows, and validating array-level and item-level constraints.

`useFieldArray` manages an array field in RHF's store. It gives you a `fields` array (each item has a stable `id`) and mutation methods (`append`, `remove`, `move`, `prepend`, `insert`, `swap`, `update`).

---

## What to build

An **Invoice Builder** at `src/exercises/Ex6_Invoice.tsx`.

### Form structure

```
clientName      (text,   required)
invoiceDate     (date,   required)
currency        (select: USD | EUR | GBP,  required)

items[]
  items[N].description  (text,   required)
  items[N].quantity     (number, required, min 1, integer)
  items[N].unitPrice    (number, required, min 0)
```

### Behaviour requirements

1. **Add item** — a button at the bottom of the list that appends a new blank row `{ description: '', quantity: 1, unitPrice: 0 }`.
2. **Remove item** — each row has a "Remove" button; the last remaining row cannot be removed (disable or hide the button when `fields.length === 1`).
3. **Reorder** — each row has "↑" and "↓" buttons that call `move(index, index - 1)` / `move(index, index + 1)`. Disable "↑" for the first row and "↓" for the last.
4. **Row subtotal** — display `quantity × unitPrice` next to each row. Use `useWatch({ control, name: 'items' })` to derive this in real time (no submit needed).
5. **Grand total** — sum all row subtotals and display it below the list.
6. **At-least-one validation** — if all items are removed (or if the array is somehow empty on submit), show an error. Implement this with a custom `validate` on the `items` field or a manual check inside `handleSubmit`.
7. On submit, log the full invoice object to the console.

### TypeScript shape

```ts
type LineItem = {
  description: string
  quantity: number
  unitPrice: number
}

type InvoiceFormValues = {
  clientName: string
  invoiceDate: string
  currency: 'USD' | 'EUR' | 'GBP'
  items: LineItem[]
}
```

---

## Hints

- `useFieldArray({ control, name: 'items' })` — returns `{ fields, append, remove, move, prepend, insert, swap, update }`
- `fields` — array of `{ id: string } & LineItem`; **always use `field.id` as the React `key`**, never the array index
- `append(value)` — adds a new item at the end
- `remove(index)` — removes item at `index`
- `move(from, to)` — moves item from index `from` to index `to`
- To register a field inside an array: `register('items.0.description')` or more commonly `register(\`items.${index}.description\`)`
- `useWatch({ control, name: 'items' })` returns the current live array values (useful for computing subtotals without submit)

**Key question:** Why must you use `field.id` as the React `key` instead of the array index? What bug would occur if you used the index?

---

## Suggested file

```
src/exercises/Ex6_Invoice.tsx
```

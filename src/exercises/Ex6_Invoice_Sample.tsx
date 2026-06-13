/**
 * SAMPLE SOLUTION — Exercise 6: useFieldArray
 *
 * You got the hard parts right: field.id as the key, append/remove/move, and
 * live subtotals/grand total from useWatch. These fixes cover correctness.
 *
 * 1. type="button" ON EVERY NON-SUBMIT BUTTON — the critical one. A <button>
 *    inside a <form> defaults to type="submit", so Remove / ↑ / ↓ / Add item
 *    were all submitting the form. Only the actual submit stays type="submit".
 *
 * 2. currency <option> values must match the union type. Lowercase "usd" stored
 *    into a 'USD' | 'EUR' | 'GBP' field is a silent type violation.
 *
 * 3. ONE useFieldArray, real array-level validation. The parent's second
 *    useFieldArray (just to check length) was dead code (Remove disabled at
 *    length 1 means it never hits 0) and re-rendered the parent constantly.
 *    Instead: allow removing to 0 and validate the array with a `rules`
 *    validate on useFieldArray, OR a `validate` on a registered field. Here we
 *    use useFieldArray's own `rules.validate` (RHF v7.49+).
 *
 * 4. ERROR DISPLAY + message-returning validate. Rules are invisible without
 *    rendering errors. validate must return a STRING when invalid (a bare
 *    boolean gives no message); min/max use the { value, message } form.
 *
 * 5. GUARD useWatch on the array — it can be undefined before hydration; `?? []`.
 *    And guard the math: (q ?? 0) * (p ?? 0) avoids NaN.
 *
 * 6. useFormContext<FormData>() — typed register so the `items.N.field` paths
 *    are checked. We also pull `control` from context instead of prop-drilling.
 *
 * 7. invoiceDate as string (no valueAsDate) — avoids the UTC Date pitfall (Ex3).
 */

import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

interface FormData {
  clientName: string;
  invoiceDate: string; // [7] string, not Date
  currency: "USD" | "EUR" | "GBP";
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

const BLANK_ITEM = { description: "", quantity: 1, unitPrice: 0 };

function LineItems() {
  // [6] typed context — no prop drilling, no untyped register
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items",
    // [3] array-level validation lives here — no separate useFieldArray needed
    rules: {
      validate: (value) =>
        (value && value.length > 0) || "Add at least one line item",
    },
  });

  // [5] guard against undefined before hydration
  const items = useWatch({ control, name: "items" }) ?? [];

  const grandTotal = items.reduce(
    // [5] guard the math
    (sum, item) => sum + (item.quantity ?? 0) * (item.unitPrice ?? 0),
    0,
  );

  return (
    <>
      {fields.map((field, index) => {
        const row = items[index];
        const subtotal = (row?.quantity ?? 0) * (row?.unitPrice ?? 0); // [5]

        return (
          <div key={field.id} className="flex my-2 gap-2">
            <div className="flex flex-col gap-2">
              <div>
                Description:
                <input
                  className="border ml-2"
                  {...register(`items.${index}.description`, {
                    required: "Description is required",
                  })}
                />
                {/* [4] error display */}
                {errors.items?.[index]?.description && (
                  <span className="text-red-500 text-sm">
                    {errors.items[index]?.description?.message}
                  </span>
                )}
              </div>

              <div>
                Quantity:
                <input
                  className="border ml-2"
                  type="number"
                  {...register(`items.${index}.quantity`, {
                    required: "Quantity is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Must be at least 1" }, // [4]
                    validate: (v) =>
                      Number.isInteger(v) || "Must be a whole number", // [4]
                  })}
                />
                {errors.items?.[index]?.quantity && (
                  <span className="text-red-500 text-sm">
                    {errors.items[index]?.quantity?.message}
                  </span>
                )}
              </div>

              <div>
                Unit price:
                <input
                  className="border ml-2"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.unitPrice`, {
                    required: "Unit price is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Cannot be negative" }, // [4]
                  })}
                />
                {errors.items?.[index]?.unitPrice && (
                  <span className="text-red-500 text-sm">
                    {errors.items[index]?.unitPrice?.message}
                  </span>
                )}
              </div>

              <div>Subtotal: {subtotal}</div>
            </div>

            <div className="flex gap-2">
              {/* [1] type="button" so these don't submit */}
              <button type="button" className="border" onClick={() => remove(index)}>
                Remove
              </button>
              <button
                type="button"
                className="border px-2"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="border px-2"
                disabled={index === fields.length - 1}
                onClick={() => move(index, index + 1)}
              >
                ↓
              </button>
            </div>
          </div>
        );
      })}

      {/* [3] array-level error (from useFieldArray rules.validate) */}
      {errors.items?.root && (
        <span className="text-red-500 text-sm">{errors.items.root.message}</span>
      )}

      <div>Grand total: {grandTotal}</div>

      {/* [1] type="button" */}
      <button type="button" className="border" onClick={() => append(BLANK_ITEM)}>
        Add item
      </button>
    </>
  );
}

export default function Ex6InvoiceSample() {
  const methods = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      clientName: "",
      invoiceDate: "",
      currency: "USD",
      items: [BLANK_ITEM],
    },
  });

  const {
    register,
    formState: { errors },
  } = methods;

  function onSubmit(data: FormData) {
    // [3] no manual throw — the array rule handles "at least one item"
    console.log(data);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <input
          className="border"
          placeholder="Client name"
          {...register("clientName", { required: "Client name is required" })}
        />
        {errors.clientName && (
          <span className="text-red-500 text-sm">{errors.clientName.message}</span>
        )}

        <input
          type="date"
          {...register("invoiceDate", { required: "Invoice date is required" })}
        />

        {/* [2] option values match the union type */}
        <select {...register("currency", { required: true })}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>

        <LineItems />

        {/* the ONLY submit button */}
        <input className="block w-full" type="submit" />
      </form>
    </FormProvider>
  );
}

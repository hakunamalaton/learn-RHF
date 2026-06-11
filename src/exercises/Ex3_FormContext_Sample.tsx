/**
 * SAMPLE SOLUTION — Exercise 3: useFormContext
 *
 * Key improvements over the original submission:
 *
 * 1. CORRECT GENERIC ON useFormContext — all child components call
 *    useFormContext<FormData>() with the FULL form type, not a slice.
 *    The form instance is shared; every child can see every field.
 *    Using a partial type (e.g. useFormContext<PersonalInfo>()) makes
 *    TypeScript think the form is smaller than it is — misleading and
 *    breaks autocomplete for any field outside that slice.
 *
 * 2. ERRORS IN CHILD COMPONENTS — each section destructures
 *    formState: { errors } from useFormContext and renders error messages.
 *    Validation rules are useless if errors are never displayed.
 *
 * 3. JSON PREVIEW WITH watch() — calling watch() with NO arguments
 *    returns a live snapshot of all field values as one object.
 *    JSON.stringify + <pre> gives a proper JSON preview.
 *    This replaces 7 separate watch('field') calls with one.
 *
 * 4. isSubmitting ON SUBMIT BUTTON — same pattern as Ex1; disable the
 *    button while the async handler runs so double-submit is impossible.
 *
 * 5. startDate AS string — valueAsDate: true converts to a UTC Date,
 *    which causes off-by-one day bugs in timezones behind UTC.
 *    Keeping it as a string and parsing at use-time is safer.
 */

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  yearsOfExperience: number;
  currentRole: string;
  startDate: string; // [5] string, not Date — avoids UTC timezone pitfalls
  remoteOnly: boolean;
};

// [1] full FormData type in every child — not a slice
function PersonalSection() {
  const {
    register,
    formState: { errors }, // [2] errors come from context too
  } = useFormContext<FormData>();

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-semibold mb-1">Personal Info</legend>

      <div>
        <input
          {...register("firstName", { required: "First name is required" })}
          placeholder="First Name"
          className="border p-1 rounded w-full"
        />
        {errors.firstName && (
          <span className="text-red-500 text-sm">{errors.firstName.message}</span>
        )}
      </div>

      <div>
        <input
          {...register("lastName", { required: "Last name is required" })}
          placeholder="Last Name"
          className="border p-1 rounded w-full"
        />
        {errors.lastName && (
          <span className="text-red-500 text-sm">{errors.lastName.message}</span>
        )}
      </div>

      <div>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          })}
          placeholder="Email"
          className="border p-1 rounded w-full"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>
    </fieldset>
  );
}

function ExperienceSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>(); // [1]

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-semibold mb-1">Experience</legend>

      <div>
        <input
          type="number"
          {...register("yearsOfExperience", {
            required: "Required",
            valueAsNumber: true,
            min: { value: 0, message: "Must be 0 or more" },
            max: { value: 50, message: "Must be 50 or less" },
            validate: (v) => Number.isInteger(v) || "Must be a whole number",
          })}
          placeholder="Years of Experience"
          className="border p-1 rounded w-full"
        />
        {errors.yearsOfExperience && (
          <span className="text-red-500 text-sm">
            {errors.yearsOfExperience.message}
          </span>
        )}
      </div>

      <div>
        <input
          {...register("currentRole", { required: "Current role is required" })}
          placeholder="Current Role"
          className="border p-1 rounded w-full"
        />
        {errors.currentRole && (
          <span className="text-red-500 text-sm">{errors.currentRole.message}</span>
        )}
      </div>
    </fieldset>
  );
}

function AvailabilitySection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>(); // [1]

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-semibold mb-1">Availability</legend>

      <div>
        <label className="block text-sm">Start Date</label>
        <input
          type="date"
          {...register("startDate", {
            required: "Start date is required",
            // [5] no valueAsDate — keep it as the string "YYYY-MM-DD"
          })}
          className="border p-1 rounded"
        />
        {errors.startDate && (
          <span className="text-red-500 text-sm">{errors.startDate.message}</span>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("remoteOnly")} />
        Remote Only
      </label>
    </fieldset>
  );
}

export default function Ex3FormContextSample() {
  const methods = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      currentRole: "",
      startDate: "",
      remoteOnly: false,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log(data);
  };

  // [3] one watch() call — no args — returns the whole form as a live object
  const allValues = methods.watch();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-w-md"
      >
        <PersonalSection />
        <ExperienceSection />
        <AvailabilitySection />

        {/* [4] disabled while submitting */}
        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {methods.formState.isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </form>

      {/* [3] JSON preview — outside <form> but still inside FormProvider */}
      <pre className="mt-4 p-3 bg-gray-100 rounded text-sm overflow-auto">
        {JSON.stringify(allValues, null, 2)}
      </pre>
    </FormProvider>
  );
}

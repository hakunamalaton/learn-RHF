/**
 * SAMPLE SOLUTION — Exercise 1: useForm
 *
 * Key improvements over the original submission:
 *
 * 1. TYPESCRIPT — useForm<FormValues> gives you typed register(), errors, and
 *    getValues(). Without it everything is `any` and you lose autocomplete.
 *
 * 2. MODE — { mode: 'onBlur' } shows errors as the user leaves each field,
 *    not only after the first submit attempt. 'onChange' is also valid but
 *    can feel noisy; 'onBlur' is the most common real-world default.
 *
 * 3. ERROR MESSAGES IN RULES — put the message string inside each rule object
 *    ({ value: 3, message: '...' }). Then just render {errors.field?.message}
 *    in JSX — one line per field, no need to know which rule fired.
 *
 * 4. ASYNC SUBMIT + reset() — handleSubmit catches thrown errors for you.
 *    Call reset() after the await so the form clears on success.
 *
 * 5. isSubmitting — disable the submit button while the async handler runs.
 *    RHF sets this automatically; you just read it from formState.
 *
 * 6. watch() for character counter — watch('username') re-renders the
 *    component on every keystroke so the counter stays live.
 *
 * 7. valueAsNumber on age — without this the submitted value is a string "25"
 *    not a number 25. Also add validate: Number.isInteger for the integer rule.
 *
 * 8. confirmPassword validate — return a message string when invalid so
 *    errors.confirmPassword.message is populated, not undefined.
 *    Also remove the stale minLength: 8 (that's password's rule, not this one).
 *
 * 9. cross-field re-validation — when password changes, trigger confirmPassword
 *    so it re-validates immediately instead of staying stale.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  agreeToTerms: boolean;
};

export default function Ex1RegistrationSample() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: "onBlur" });

  // [6] watch drives the live character counter
  const usernameValue = watch("username", "");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // [4] simulate async API call
    await new Promise((r) => setTimeout(r, 1000));
    console.log(data);
    reset();
    setSubmitted(true);
  };

  return (
    <form
      className="flex flex-col items-start gap-4"
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => setSubmitted(false)}
    >
      {submitted && (
        <p className="text-green-600 font-medium">Registration successful!</p>
      )}

      {/* USERNAME */}
      <div className="flex items-start gap-1 w-full">
        <label htmlFor="username" className="mt-2 w-1/4">
          Username:
        </label>
        <div className="flex flex-col items-start gap-1 w-full">
          <input
            className="border-2 border-gray-300 p-2 rounded-md w-full"
            id="username"
            {...register("username", {
              // [3] message lives inside the rule, not in JSX
              required: "Username is required",
              minLength: { value: 3, message: "Must be at least 3 characters" },
              maxLength: { value: 20, message: "Must be at most 20 characters" },
            })}
          />
          {/* [6] live character counter */}
          <span className="text-gray-400 text-xs self-end">
            {(usernameValue ?? "").length} / 20
          </span>
          {/* [3] one line — no need to know which rule fired */}
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username.message}</span>
          )}
        </div>
      </div>

      {/* EMAIL */}
      <div className="flex items-start gap-1 w-full">
        <label htmlFor="email" className="mt-2 w-1/4">
          Email:
        </label>
        <div className="flex flex-col items-start gap-1 w-full">
          <input
            className="border-2 border-gray-300 p-2 rounded-md w-full"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Must be a valid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
      </div>

      {/* PASSWORD */}
      <div className="flex items-start gap-1 w-full">
        <label htmlFor="password" className="mt-2 w-1/4">
          Password:
        </label>
        <div className="flex flex-col items-start gap-1 w-full">
          <input
            className="border-2 border-gray-300 p-2 rounded-md w-full"
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Must be at least 8 characters" },
              validate: (value) =>
                (/[A-Z]/.test(value) && /[0-9]/.test(value)) ||
                "Must contain at least one uppercase letter and one number",
              // [9] re-validate confirmPassword whenever password changes
              onChange: () => trigger("confirmPassword"),
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="flex items-start gap-1 w-full">
        <label htmlFor="confirmPassword" className="mt-2 w-1/4">
          Confirm Password:
        </label>
        <div className="flex flex-col items-start gap-1 w-full">
          <input
            className="border-2 border-gray-300 p-2 rounded-md w-full"
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              // [8] no minLength here — that's password's constraint
              // [8] return a string so errors.confirmPassword.message is set
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </div>

      {/* AGE */}
      <div className="flex items-start gap-1 w-full">
        <label htmlFor="age" className="mt-2 w-1/4">
          Age:
        </label>
        <div className="flex flex-col items-start gap-1 w-full">
          <input
            className="border-2 border-gray-300 p-2 rounded-md"
            id="age"
            type="number"
            {...register("age", {
              required: "Age is required",
              // [7] valueAsNumber: submitted value is 25 (number), not "25" (string)
              valueAsNumber: true,
              min: { value: 18, message: "Must be at least 18" },
              max: { value: 120, message: "Must be at most 120" },
              // [7] type="number" still allows 18.5 — validate integer explicitly
              validate: (v) => Number.isInteger(v) || "Must be a whole number",
            })}
          />
          {errors.age && (
            <span className="text-red-500 text-sm">{errors.age.message}</span>
          )}
        </div>
      </div>

      {/* AGREE TO TERMS */}
      <div className="flex flex-col items-start gap-1">
        <label htmlFor="agreeToTerms" className="flex items-center gap-2">
          <input
            className="mr-2"
            id="agreeToTerms"
            type="checkbox"
            {...register("agreeToTerms", {
              required: "You must agree to the terms",
            })}
          />
          I agree to the terms
        </label>
        {errors.agreeToTerms && (
          <span className="text-red-500 text-sm">{errors.agreeToTerms.message}</span>
        )}
      </div>

      {/* [5] disable while submitting */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Registering…" : "Register"}
      </button>
    </form>
  );
}

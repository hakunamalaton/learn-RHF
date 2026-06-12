/**
 * SAMPLE SOLUTION — Exercise 4: useWatch
 *
 * Your submission nailed the headline concept: useWatch in the child means the
 * parent form does NOT re-render on keystroke. These improvements cover the
 * second half of the spec — GRANULAR watching.
 *
 * 1. GRANULAR SUBSCRIPTIONS — instead of one useWatch({ control }) that
 *    subscribes to EVERY field (so the whole preview re-renders on any change),
 *    each piece of the preview watches only the fields it needs:
 *      - <ProfileCardPreview> watches the text fields by name (tuple form)
 *      - <ColorAccent> watches ONLY accentColor in its own component
 *    Result: dragging the color picker re-renders <ColorAccent> alone, not the
 *    text. Open the console and watch which "rendered" log fires.
 *
 * 2. defaultValues — without them every field is `undefined` on first render,
 *    which triggers React's "changing uncontrolled to controlled" warning and
 *    gives the color picker a black default. Always seed defaultValues.
 *
 * 3. mode REMOVED — there's no validation here, so mode does nothing. useWatch
 *    subscribes independently of validation timing; it's not what drives the
 *    live preview. (Kept out to avoid implying a connection.)
 *
 * 4. BROKEN-IMAGE HANDLING — onError hides the <img> for an invalid avatar URL
 *    instead of showing the browser's broken-image icon.
 *
 * RE-RENDER SUMMARY (check the console logs):
 *   - type in displayName/bio  -> "preview rendered"      (NOT form, NOT accent)
 *   - drag the color picker    -> "accent rendered"       (NOT form, NOT preview)
 *   - the parent form          -> logs ONCE on mount, then stays silent
 */

import { useForm, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

interface FormData {
  displayName: string;
  bio: string;
  avatarUrl: string;
  accentColor: string;
  isPublic: boolean;
}

// [1] Watches ONLY accentColor. Lives in its own component so color changes
// re-render here and nowhere else.
function ColorAccent({ control }: { control: Control<FormData> }) {
  const accentColor = useWatch({ control, name: "accentColor" });
  console.log("accent rendered");

  return (
    <div
      style={{
        backgroundColor: accentColor,
        width: 100,
        height: 100,
        borderRadius: 8,
      }}
    />
  );
}

// [1] Watches a named SUBSET (tuple return). Does NOT re-render when only
// accentColor changes — that's isolated in <ColorAccent>.
function ProfileCardPreview({ control }: { control: Control<FormData> }) {
  const [displayName, bio, avatarUrl, isPublic] = useWatch({
    control,
    name: ["displayName", "bio", "avatarUrl", "isPublic"],
  });
  console.log("preview rendered"); // still logs color accent when you change displayName/bio because the whole preview re-renders, but NOT when you change accentColor

  return (
    <div className="border rounded-lg p-4 max-w-xs">
      <div className="text-xs uppercase text-gray-400">Preview</div>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
          // [4] hide broken images instead of showing the broken icon
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <h1 className="text-lg font-bold">{displayName}</h1>
      <p className="text-sm text-gray-600">{bio}</p>
      <ColorAccent control={control} />
      <span className="text-xs font-medium">
        {isPublic ? "🌐 Public" : "🔒 Private"}
      </span>
    </div>
  );
}

export default function Ex4LivePreviewSample() {
  const { register, handleSubmit, control } = useForm<FormData>({
    // [2] seed defaults — avoids the controlled/uncontrolled warning and gives
    // the color picker a sensible starting color
    defaultValues: {
      displayName: "",
      bio: "",
      avatarUrl: "",
      accentColor: "#3b82f6",
      isPublic: false,
    },
    // [3] no `mode` — there's no validation, so it would do nothing
  });

  async function onSubmit(data: FormData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  }

  console.log("form rendered"); // logs ONCE on mount, then stays silent

  return (
    <div className="flex gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          placeholder="Display name"
          {...register("displayName")}
        />
        <textarea
          className="border-2 border-gray-300 rounded-md p-2"
          placeholder="Bio"
          {...register("bio")}
        />
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          placeholder="Avatar URL"
          {...register("avatarUrl")}
        />
        <input type="color" {...register("accentColor")} />
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isPublic")} />
          Public profile
        </label>
        <input type="submit" />
      </form>

      <ProfileCardPreview control={control} />
    </div>
  );
}

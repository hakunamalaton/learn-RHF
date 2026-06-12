import { useForm, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

interface FormData {
  displayName: string;
  bio: string;
  avatarUrl: string;
  accentColor: string;
  isPublic: boolean;
}

function ProfileCardPreview({ control }: { control: Control<FormData> }) {

  const data = useWatch({ control });

  console.log('preview rendered');

  return (
    <>
      <div>Preview</div>
      <h1>{data.displayName}</h1>
      <p>{data.bio}</p>
      {data.avatarUrl && <img src={data.avatarUrl} alt="Avatar" />}
      <div style={{ backgroundColor: data.accentColor, width: 100, height: 100 }} />
      <p>{data.isPublic ? "Public" : "Private"}</p>
    </>
  )
}

export default function Ex4LivePreview() {
  const { register, handleSubmit, control } = useForm<FormData>({ mode: 'onChange' });

  async function onSubmit(data: FormData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  }

  console.log('form rendered');

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="border-2 border-gray-300 rounded-md p-2"
            {...register("displayName")}
          />

          <input
            className="border-2 border-gray-300 rounded-md p-2"
            {...register("bio")}
          />

          <input
            className="border-2 border-gray-300 rounded-md p-2"
            {...register("avatarUrl")}
          />

          <input
            className="border-2 border-gray-300 rounded-md p-2"
            type="color"
            {...register("accentColor")}
          />

          <input
            type="checkbox"
            {...register("isPublic")}
          />
          
          <input type="submit" />
      </form>

      <ProfileCardPreview control={control} />
    </>
  )
}

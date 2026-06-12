import { type Control, type RegisterOptions, useForm, useController } from 'react-hook-form';

interface FormData {
  starRating: number;
  toggleGroup: string;
}

function StarRating (
  { name, control, rules }: {
    name: string;
    control: Control<FormData>;
    rules?: RegisterOptions;
  }) {
    const {
      field,
    } = useController<FormData>({
      name,
      control,
      rules,
    })

    return (
      <div>
        {new Array(5).fill(0).map((_, index) => <div
          key={index}
          onClick={() => {
            field.onChange(index + 1);
          }}
        >{
          index < Number(field.value) ? '★' : '☆'
        }</div>)}
      </div>
    )
}

function ToggleGroup ({
  name,
  control,
  options,
  rules,
}: {
  name: string;
  control: Control<FormData>;
  options: string[];
  rules?: RegisterOptions;
}) {

  const {
    field,
  } = useController<FormData>({
    name,
    control,
    rules,
  })

  return (
    <div>
      {options.map((option) => <input
        key={option}
        type="checkbox"
        value={option}
        checked={field.value === option}
        onChange={(e) => {
          const isChecked = e.target.checked;
          field.onChange(isChecked ? option : '');
        }}
      />)}
    </div>
  )
}

export default function Ex2_CustomInputs() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      starRating: 0,
      toggleGroup: '',
    },
  });

  function onSubmit (data: FormData) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StarRating control={control} name="starRating" />
      <ToggleGroup control={control} name="toggleGroup" options={['Option 1', 'Option 2', 'Option 3']} />

      <input type="submit" />
    </form>
  );
}
